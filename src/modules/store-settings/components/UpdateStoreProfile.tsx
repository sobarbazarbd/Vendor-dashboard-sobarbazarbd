import {
  Row,
  Col,
  Card,
  Input,
  Upload,
  Avatar,
  DatePicker,
  Switch,
  Typography,
  Divider,
  Modal,
  Select,
  Button,
} from "antd";
import { useEffect, useState } from "react";
import { Form } from "../../../common/CommonAnt";
import { Form as AntForm } from "antd";
import dayjs from "dayjs";
import { UploadOutlined, UserOutlined } from "@ant-design/icons";
import {
  useGetStoreSettingsQuery,
  useUpdateStoreSettingsMutation,
} from "../api/storeSettingsEndPoints";

const { Title, Text } = Typography;

const storeTypes = ["Enterprise", "Company"];

const weekdays = [
  "Saturday",
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
];

const kycFields = [
  {
    numberKey: "voter_id_card",
    numberLabel: "Voter ID Card",
    numberPlaceholder: "Enter voter ID card number",
    fileKey: "voter_id_card_file",
    fileLabel: "Voter ID Upload",
    uploadButtonText: "Upload Voter ID Photo",
  },
  {
    numberKey: "nid_verification",
    numberLabel: "NID Verification",
    numberPlaceholder: "Enter NID number",
    fileKey: "nid_verification_file",
    fileLabel: "NID Upload",
    uploadButtonText: "Upload NID Photo",
  },
  {
    numberKey: "tin_verification",
    numberLabel: "TIN Verification",
    numberPlaceholder: "Enter TIN number",
    fileKey: "tin_verification_file",
    fileLabel: "TIN Upload",
    uploadButtonText: "Upload TIN File",
  },
  {
    numberKey: "bin_verification",
    numberLabel: "BIN Verification",
    numberPlaceholder: "Enter BIN number",
    fileKey: "bin_verification_file",
    fileLabel: "BIN Upload",
    uploadButtonText: "Upload BIN File",
  },
  {
    numberKey: "trade_license",
    numberLabel: "Trade License",
    numberPlaceholder: "Enter trade license number",
    fileKey: "trade_license_file",
    fileLabel: "Trade License Upload",
    uploadButtonText: "Upload Trade License",
  },
] as const;

const kycTextKeys = kycFields.map((field) => field.numberKey);
const kycFileKeys = kycFields.map((field) => field.fileKey);

const UpdateStoreProfile = () => {
  const { data } = useGetStoreSettingsQuery<any>({});
  const [update, { isLoading }] = useUpdateStoreSettingsMutation();

  const [form] = AntForm.useForm();

  const [imageFileList, setImageFileList] = useState<any[]>([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  const store = data?.data;

  /* -------------------------------- */
  /* Prefill Form */
  /* -------------------------------- */
  useEffect(() => {
    if (!store) return;

    const normalized = { ...store };
    Object.keys(normalized).forEach((key) => {
      if (normalized[key] === null) normalized[key] = "";
    });

    const toUploadFileList = (url: string | undefined, name: string) =>
      typeof url === "string" && url
        ? [
            {
              uid: `-${name}`,
              url,
              name,
            },
          ]
        : [];

    const initialLogo =
      typeof store.logo === "string" && store.logo
        ? [
            {
              uid: "-1",
              url: store.logo,
              thumbUrl: store.logo,
              name: "Store Logo",
            },
          ]
        : [];

    const initialKycFileFields = {
      voter_id_card_file: toUploadFileList(
        store.voter_id_card_file,
        "Voter ID Document"
      ),
      nid_verification_file: toUploadFileList(
        store.nid_verification_file,
        "NID Document"
      ),
      tin_verification_file: toUploadFileList(
        store.tin_verification_file,
        "TIN Document"
      ),
      bin_verification_file: toUploadFileList(
        store.bin_verification_file,
        "BIN Document"
      ),
      trade_license_file: toUploadFileList(
        store.trade_license_file,
        "Trade License Document"
      ),
    };

    const hasAnyKycData = Boolean(
      store.voter_id_card ||
        store.nid_verification ||
        store.tin_verification ||
        store.bin_verification ||
        store.trade_license ||
        store.voter_id_card_file ||
        store.nid_verification_file ||
        store.tin_verification_file ||
        store.bin_verification_file ||
        store.trade_license_file
    );

    setImageFileList(initialLogo);

    form.setFieldsValue({
      ...normalized,
      ...initialKycFileFields,
      has_kyc_documents: hasAnyKycData,
      established_date: store.established_date
        ? dayjs(store.established_date)
        : undefined,
      logo: initialLogo,
    });
  }, [store, form]);

  /* -------------------------------- */
  /* Handlers */
  /* -------------------------------- */
  const handleImageChange = ({ fileList }: any) => setImageFileList(fileList);

  const handlePreview = (file: any) => {
    setPreviewImage(file.thumbUrl || file.url);
    setPreviewVisible(true);
  };

  const getUploadFileList = (e: any) => (Array.isArray(e) ? e : e?.fileList);

  const onFinish = (values: any) => {
    const formData = new FormData();
    const hasKycDocuments = Boolean(values.has_kyc_documents);

    Object.entries(values).forEach(([key, value]: any) => {
      if (key === "has_kyc_documents") {
        return;
      }

      if (
        !hasKycDocuments &&
        (kycTextKeys.includes(key as (typeof kycTextKeys)[number]) ||
          kycFileKeys.includes(key as (typeof kycFileKeys)[number]))
      ) {
        return;
      }

      if (Array.isArray(value)) {
        const looksLikeUploadFileList = value.some(
          (item) =>
            typeof item === "object" &&
            item !== null &&
            ("uid" in item || "originFileObj" in item)
        );

        if (looksLikeUploadFileList) {
          value.forEach((file) => {
            if (file?.originFileObj instanceof File) {
              formData.append(key, file.originFileObj);
            }
          });

          return;
        }

        value.forEach((v) => formData.append(key, v));
        return;
      }

      if (key === "established_date" && value) {
        formData.append(key, dayjs(value).format("YYYY-MM-DD"));
      } else if (key === "is_affiliated_store") {
        formData.append(key, value ? "true" : "false");
      } else if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });

    update({ data: formData });
  };

  /* -------------------------------- */
  /* UI */
  /* -------------------------------- */
  return (
    <div className="p-4 md:p-8">
      <Title level={3}>Update Store Profile</Title>
      <Text type="secondary">Update your store information carefully</Text>

      <Divider />

      <Form form={form} onFinish={onFinish} isLoading={isLoading}>
        <Row gutter={[24, 24]}>
          {/* Logo */}
          <Col xs={24}>
            <Card title="Store Logo">
              <AntForm.Item
                name="logo"
                valuePropName="fileList"
                getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
              >
                <Upload
                  listType="picture-card"
                  fileList={imageFileList}
                  onChange={handleImageChange}
                  onPreview={handlePreview}
                  beforeUpload={() => false}
                >
                  {imageFileList.length === 0 && (
                    <div className="text-center">
                      <Avatar size={96} icon={<UserOutlined />} />
                      <p className="mt-2">Upload Logo</p>
                    </div>
                  )}
                </Upload>
              </AntForm.Item>
            </Card>
          </Col>

          {/* Basic Information */}
          <Col xs={24}>
            <Card title="Basic Information">
              <Row gutter={[16, 16]}>
                <Col xs={24} md={8}>
                  <Form.Item name="name" label="Store Name">
                    <Input size="large" />
                  </Form.Item>
                </Col>

                <Col xs={24} md={4}>
                  <Form.Item name="prefix" label="Prefix">
                    <Input size="large" />
                  </Form.Item>
                </Col>

                <Col xs={24} md={4}>
                  <Form.Item name="store_type" label="Store Type">
                    <Select size="large">
                      {storeTypes.map((t) => (
                        <Select.Option key={t} value={t}>
                          {t}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>

                <Col xs={24} md={8}>
                  <Form.Item name="founder" label="Founder">
                    <Input size="large" />
                  </Form.Item>
                </Col>

                <Col xs={24} md={8}>
                  <Form.Item name="contact_email" label="Contact Email">
                    <Input size="large" />
                  </Form.Item>
                </Col>

                <Col xs={24} md={8}>
                  <Form.Item name="phone_number" label="Phone Number">
                    <Input size="large" />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Col>

          {/* Location */}
          <Col xs={24}>
            <Card title="Location Information">
              <Row gutter={[16, 16]}>
                <Col xs={24} md={8}>
                  <Form.Item name="address" label="Address">
                    <Input size="large" />
                  </Form.Item>
                </Col>

                <Col xs={24} md={4}>
                  <Form.Item name="city" label="City">
                    <Input size="large" />
                  </Form.Item>
                </Col>

                <Col xs={24} md={4}>
                  <Form.Item name="latitude" label="Latitude">
                    <Input size="large" type="number" />
                  </Form.Item>
                </Col>

                <Col xs={24} md={4}>
                  <Form.Item name="longitude" label="Longitude">
                    <Input size="large" type="number" />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Col>

          {/* Store Details */}
          <Col xs={24}>
            <Card title="Store Details">
              <Row gutter={[16, 16]}>
                <Col xs={24} md={6}>
                  <Form.Item name="established_date" label="Established Date">
                    <DatePicker className="w-full" size="large" />
                  </Form.Item>
                </Col>

                <Col xs={24} md={6}>
                  <Form.Item name="tax_id" label="Tax ID">
                    <Input size="large" />
                  </Form.Item>
                </Col>

                <Col xs={24} md={6}>
                  <Form.Item
                    name="is_affiliated_store"
                    label="Affiliated Store"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Col>

          {/* KYC */}
          <Col xs={24}>
            <Card title="KYC Verification">
              <Row gutter={[14, 14]}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="has_kyc_documents"
                    label="Do you have KYC documents?"
                    rules={[{ required: true, message: "Please select an option" }]}
                  >
                    <Select
                      size="large"
                      placeholder="Select"
                      options={[
                        {
                          label: "Yes, I have KYC documents",
                          value: true,
                        },
                        {
                          label: "No, I do not have them now",
                          value: false,
                        },
                      ]}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <AntForm.Item
                noStyle
                shouldUpdate={(prev, curr) =>
                  prev.has_kyc_documents !== curr.has_kyc_documents
                }
              >
                {({ getFieldValue }) => {
                  const hasKycDocuments = Boolean(getFieldValue("has_kyc_documents"));

                  if (!hasKycDocuments) {
                    return (
                      <Text type="secondary" className="block">
                        KYC is optional for now. You can skip this section and
                        update it later from profile.
                      </Text>
                    );
                  }

                  return (
                    <>
                      <Text type="secondary" className="mb-3 block">
                        Since you selected KYC available, number and file are both
                        required for each verification.
                      </Text>

                      <Row gutter={[14, 14]}>
                        {kycFields.map((field) => (
                          <Col xs={24} md={12} lg={8} key={field.numberKey}>
                            <div className="h-full rounded-xl border border-[#d4e9dd] bg-[#f8fffb] p-3">
                              <Form.Item
                                name={field.numberKey}
                                label={field.numberLabel}
                                className="!mb-3"
                                rules={[
                                  {
                                    required: true,
                                    message: `Please enter ${field.numberLabel}`,
                                  },
                                ]}
                              >
                                <Input
                                  size="large"
                                  placeholder={field.numberPlaceholder}
                                />
                              </Form.Item>

                              <Form.Item
                                name={field.fileKey}
                                label={field.fileLabel}
                                valuePropName="fileList"
                                getValueFromEvent={getUploadFileList}
                                className="!mb-2"
                                rules={[
                                  {
                                    validator: (_, value) => {
                                      if (Array.isArray(value) && value.length > 0) {
                                        return Promise.resolve();
                                      }
                                      return Promise.reject(
                                        new Error(
                                          `Please upload ${field.numberLabel} file`
                                        )
                                      );
                                    },
                                  },
                                ]}
                              >
                                <Upload
                                  beforeUpload={() => false}
                                  maxCount={1}
                                  accept=".pdf,.jpg,.jpeg,.png"
                                  listType="picture"
                                >
                                  <Button icon={<UploadOutlined />}>
                                    {field.uploadButtonText}
                                  </Button>
                                </Upload>
                              </Form.Item>

                              <Text type="secondary" className="!text-xs">
                                Accepted: JPG, PNG, PDF
                              </Text>
                            </div>
                          </Col>
                        ))}
                      </Row>
                    </>
                  );
                }}
              </AntForm.Item>
            </Card>
          </Col>

          {/* Online Presence */}
          <Col xs={24}>
            <Card title="Online Presence">
              <Row gutter={[16, 16]}>
                <Col xs={24} md={6}>
                  <Form.Item name="website_url" label="Website">
                    <Input size="large" />
                  </Form.Item>
                </Col>

                <Col xs={24} md={6}>
                  <Form.Item name="facebook_url" label="Facebook">
                    <Input size="large" />
                  </Form.Item>
                </Col>

                <Col xs={24} md={6}>
                  <Form.Item name="twitter_url" label="Twitter">
                    <Input size="large" />
                  </Form.Item>
                </Col>

                <Col xs={24} md={6}>
                  <Form.Item name="linkedin_url" label="LinkedIn">
                    <Input size="large" />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Col>

          {/* Attendance */}
          <Col xs={24}>
            <Card title="Attendance Integration">
              <Row gutter={[16, 16]}>
                <Col xs={24} md={8}>
                  <Form.Item name="attendance_base_api_url" label="API URL">
                    <Input size="large" />
                  </Form.Item>
                </Col>

                <Col xs={24} md={8}>
                  <Form.Item name="attendance_api_key" label="API Key">
                    <Input size="large" />
                  </Form.Item>
                </Col>

                <Col xs={24} md={8}>
                  <Form.Item name="attendance_device_id" label="Device ID">
                    <Input size="large" />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Col>

          {/* Weekend Days */}
          <Col xs={24}>
            <Card title="Weekend Days">
              <Form.Item name="weekend_days">
                <Select
                  mode="multiple"
                  size="large"
                  placeholder="Select weekend days"
                >
                  {weekdays.map((day) => (
                    <Select.Option key={day} value={day}>
                      {day}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Card>
          </Col>

          {/* Description & Policy */}
          <Col xs={24}>
            <Card title="Description & Policies">
              <Form.Item name="description" label="Description">
                <Input.TextArea rows={3} />
              </Form.Item>

              <Form.Item name="return_policy" label="Return Policy">
                <Input.TextArea rows={3} />
              </Form.Item>
            </Card>
          </Col>
        </Row>
      </Form>

      <Modal
        open={previewVisible}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
      >
        <img src={previewImage} className="w-full" />
      </Modal>
    </div>
  );
};

export default UpdateStoreProfile;
