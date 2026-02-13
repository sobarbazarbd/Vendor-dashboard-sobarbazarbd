/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Card,
  Col,
  Input,
  Modal,
  Row,
  Switch,
  Form as AntForm,
  Typography,
  Button,
  Upload,
  message,
  Select,
  Popconfirm,
  Progress,
  Tag,
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  ArrowLeftOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  PictureOutlined,
  ApartmentOutlined,
} from "@ant-design/icons";
import { Form } from "../../../common/CommonAnt";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";

import {
  useCreateProductMutation,
  useGetBrandsQuery,
  useGetSubCategoriesQuery,
} from "../api/productEndPoints";

import { CommonSelect } from "../../../common/commonField/commonFeild";
import useDebounce from "../../../hooks/useDebounce";
import { ATTRIBUTE_KEYS, ATTRIBUTE_VALUES } from "../attributeOptions";
import BreadCrumb from "../../../common/BreadCrumb/BreadCrumb";
import { useGetProfileQuery } from "../../Profile/api/profileEndpoint";

const { Title, Text } = Typography;
const pageCardClass =
  "rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] shadow-sm";
const heroCardClass =
  "rounded-2xl border border-[#cdeedb] bg-gradient-to-br from-white to-[#eefff7] shadow-sm";

const CreateProduct = () => {
  const [form] = AntForm.useForm();
  const navigate = useNavigate();
  const { data: profileData } = useGetProfileQuery();
  const isAffiliatedStore = profileData?.data?.role?.store?.is_affiliated_store;

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);
  const [description, setDescription] = useState("");
  const [shortDescription, setShortDescription] = useState("");

  const [create, { isLoading, isSuccess }] = useCreateProductMutation();
  const { data: subCategoriesData } = useGetSubCategoriesQuery({
    search: debouncedSearch || undefined,
  });

  const { data: brandData } = useGetBrandsQuery({});

  const [images, setImages] = useState<any[]>([]);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [imageForm] = AntForm.useForm();

  const openAddImageModal = () => {
    imageForm.resetFields();
    setIsImageModalOpen(true);
  };

  const handleAddImage = () => {
    imageForm.validateFields().then((values) => {
      const fileObj = values.image?.fileList?.[0];

      if (!fileObj) {
        return message.error("Please upload an image!");
      }

      const newImage = {
        image: fileObj.originFileObj,
        alt_text: values.alt_text || "",
        is_feature: values.is_feature || false,
        order: Number(values.order) || images.length,
      };

      setImages((prev) => [...prev, newImage]);
      setIsImageModalOpen(false);
      message.success("Image added successfully!");
    });
  };

  const removeImage = (i: number) => {
    const updated = images.filter((_, index) => index !== i);
    setImages(updated);
  };

  const [variants, setVariants] = useState<any[]>([
    {
      name: "",
      sku: "",
      price: "",
      customer_price: "",
      stock: "",
      is_default: false,
      attributes: [{ key: "", value: "" }],
      image: null,
      imagePreview: null,
    },
  ]);

  const addVariant = () => {
    setVariants([
      ...variants,
      {
        name: "",
        sku: "",
        price: "",
        customer_price: "",
        stock: "",
        is_default: false,
        attributes: [{ key: "", value: "" }],
        image: null,
        imagePreview: null,
      },
    ]);
  };

  const removeVariant = (index: number) => {
    if (variants.length === 1) {
      return message.warning("At least one variant required!");
    }
    setVariants(variants.filter((_, i) => i !== index));
  };

  const addAttribute = (variantIndex: number) => {
    const arr = [...variants];
    arr[variantIndex].attributes.push({ key: "", value: "" });
    setVariants(arr);
  };

  const removeAttribute = (variantIndex: number, attrIndex: number) => {
    const arr = [...variants];
    arr[variantIndex].attributes.splice(attrIndex, 1);
    setVariants(arr);
  };

  const handleVariantImageChange = (
    variantIndex: number,
    file: File | null,
  ) => {
    const arr = [...variants];
    if (file) {
      arr[variantIndex].image = file;
      arr[variantIndex].imagePreview = URL.createObjectURL(file);
    } else {
      arr[variantIndex].image = null;
      arr[variantIndex].imagePreview = null;
    }
    setVariants(arr);
  };

  const onFinish = (values: any) => {
    if (
      !description ||
      description === "<p></p>" ||
      description.trim() === ""
    ) {
      message.error("Please add a product description!");
      return;
    }

    if (!shortDescription || shortDescription.trim() === "") {
      message.error("Please add a short description!");
      return;
    }

    if (variants.length === 0 || !variants[0].name || !variants[0].sku) {
      message.error("Please add at least one variant with name and SKU!");
      return;
    }

    const hasValidVariant = variants.some(
      (v) => v.name && v.sku && Number(v.price) > 0,
    );
    if (!hasValidVariant) {
      message.error(
        "At least one variant must have a valid name, SKU, and price!",
      );
      return;
    }

    if (images.length === 0) {
      message.error("Please add at least one product image!");
      return;
    }

    // Validate at least one attribute per variant
    const invalidVariant = variants.find(
      (v) =>
        !v.attributes ||
        v.attributes.length === 0 ||
        v.attributes.some((a: any) => !a.key || !a.value),
    );
    if (invalidVariant) {
      message.error(
        "Each variant must have at least one attribute with both key and value!",
      );
      return;
    }

    const formData = new FormData();

    formData.append("name", values.name);
    formData.append("short_description", shortDescription);
    formData.append("description", description);
    formData.append("sku", values.sku || "");
    formData.append("is_active", values.is_active ? "true" : "false");

    if (values.subcategories && values.subcategories.length > 0) {
      values.subcategories.forEach((id: number) => {
        formData.append("subcategories", id.toString());
      });
    }

    if (
      values.brand_or_company !== undefined &&
      values.brand_or_company !== null
    ) {
      formData.append("brand_or_company", values.brand_or_company.toString());
    }

    const validVariants = variants.filter(
      (v: any) => v.name && v.sku && Number(v.price) > 0,
    );

    const variantsPayload = validVariants.map((v: any, idx: number) => ({
      name: v.name.trim(),
      sku: v.sku.trim(),
      price: Number(v.price),
      customer_price: Number(v.customer_price),
      stock: Number(v.stock) || 0,
      is_default: v.is_default || false,
      attributes: Object.fromEntries(
        (v.attributes || [])
          .filter((a: any) => a.key && a.value)
          .map((a: any) => [a.key.trim(), a.value.trim()]),
      ),
      has_image: !!v.image,
      image_index: v.image ? idx : null,
    }));

    formData.append("variants", JSON.stringify(variantsPayload));

    // Append variant image files
    validVariants.forEach((v: any) => {
      if (v.image) {
        formData.append("variant_image_files", v.image);
      }
    });

    const imagesMetadata = images.map((img: any, index: number) => ({
      alt_text: img.alt_text || "",
      is_feature: img.is_feature || false,
      order: img.order ?? index,
    }));

    formData.append("images", JSON.stringify(imagesMetadata));

    images.forEach((img: any) => {
      if (img.image) {
        formData.append("image_files", img.image);
      }
    });

    create(formData);
  };

  useEffect(() => {
    if (isSuccess) {
      message.success("Product Created Successfully!");
      navigate("/products");
    }
  }, [isSuccess, navigate]);

  useEffect(() => {
    form.setFieldsValue({ is_active: true });
  }, [form]);

  const validVariantCount = variants.filter(
    (v: any) => v.name && v.sku && Number(v.price) > 0,
  ).length;

  const validAttributeVariantCount = variants.filter(
    (v: any) =>
      Array.isArray(v.attributes) &&
      v.attributes.length > 0 &&
      v.attributes.every((a: any) => a.key && a.value),
  ).length;

  const descriptionReady = Boolean(
    shortDescription.trim() &&
    description &&
    description !== "<p></p>" &&
    description.trim() !== "",
  );

  const flowChecks = [
    { key: "description", label: "Details", done: descriptionReady },
    { key: "images", label: "Images", done: images.length > 0 },
    {
      key: "variants",
      label: "Variants",
      done: validVariantCount > 0,
    },
    {
      key: "attributes",
      label: "Attributes",
      done:
        validAttributeVariantCount === variants.length && variants.length > 0,
    },
  ];

  const completionPercent = Math.round(
    (flowChecks.filter((item) => item.done).length / flowChecks.length) * 100,
  );

  return (
    <div className="space-y-4 pb-3">
      <BreadCrumb />

      <Card className={heroCardClass}>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Title level={3} className="!mb-1 !text-[var(--app-text)]">
              Create New Product
            </Title>
            <Text className="text-sm text-[var(--app-text-soft)]">
              Add product details, upload images, and configure variants in one
              smooth flow.
            </Text>
            <div className="mt-3 flex flex-wrap gap-2">
              <Tag className="!rounded-full !border-0 !bg-[#e8f7ef] !text-[#1f6f45]">
                <PictureOutlined /> {images.length} Images
              </Tag>
              <Tag className="!rounded-full !border-0 !bg-[#e8f7ef] !text-[#1f6f45]">
                <ApartmentOutlined /> {variants.length} Variants
              </Tag>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              icon={<ArrowLeftOutlined />}
              className="!rounded-xl"
              onClick={() => navigate("/products")}
            >
              Back to Products
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              className="!rounded-xl !bg-[#279e5a] !border-[#279e5a] hover:!bg-[#1f8a4e] hover:!border-[#1f8a4e]"
              onClick={openAddImageModal}
            >
              Quick Add Image
            </Button>
          </div>
        </div>
      </Card>

      <Card className={pageCardClass}>
        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <Text className="text-sm font-semibold text-[var(--app-text)]">
            Product Creation Flow
          </Text>
          <Text className="text-xs text-[var(--app-text-soft)]">
            Completion: {completionPercent}%
          </Text>
        </div>

        <div className="mb-3 grid grid-cols-2 gap-2 md:grid-cols-4">
          {flowChecks.map((item) => (
            <div
              key={item.key}
              className={`rounded-xl border px-3 py-2 text-sm ${
                item.done
                  ? "border-[#b7e2c8] bg-[#edf9f1] text-[#1f6f45]"
                  : "border-[var(--app-border)] bg-[var(--app-surface-soft)] text-[var(--app-text-soft)]"
              }`}
            >
              <div className="flex items-center gap-2">
                {item.done ? (
                  <CheckCircleOutlined />
                ) : (
                  <ExclamationCircleOutlined />
                )}
                <span>{item.label}</span>
              </div>
            </div>
          ))}
        </div>

        <Progress
          percent={completionPercent}
          showInfo={false}
          strokeColor="#279e5a"
          trailColor="rgba(39, 158, 90, 0.12)"
        />
      </Card>

      <Form
        form={form}
        onFinish={onFinish}
        isLoading={isLoading}
        buttonLabel="Create Product"
      >
        <Row gutter={[16, 16]}>
          <Col xs={24}>
            <Card
              className={pageCardClass}
              title={
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold">
                    Basic Product Information
                  </span>
                  <Text className="text-xs text-[var(--app-text-soft)]">
                    Required fields
                  </Text>
                </div>
              }
            >
              <Row gutter={[16, 8]}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Product Name"
                    name="name"
                    rules={[{ required: true }]}
                  >
                    <Input
                      size="large"
                      placeholder="Product Name"
                      className="!rounded-xl"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item label="SKU" name="sku">
                    <Input
                      size="large"
                      placeholder="SKU"
                      className="!rounded-xl"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24}>
                  <Form.Item
                    label="Short Description"
                    name="short_description"
                    help={
                      !shortDescription ? "Short description is required" : ""
                    }
                    validateStatus={!shortDescription ? "error" : ""}
                  >
                    <Input.TextArea
                      rows={3}
                      maxLength={250}
                      showCount
                      placeholder="Short Description (max 250 chars)"
                      className="!rounded-xl"
                      value={shortDescription}
                      onChange={(e) => setShortDescription(e.target.value)}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24}>
                  <Form.Item
                    label="Description"
                    name="description"
                    help={!description ? "Description is required" : ""}
                    validateStatus={!description ? "error" : ""}
                  >
                    <Editor
                      apiKey="233kxbtr26hptvnz70r051p006eabjgrqpjnj7psbw11yti9"
                      value={description}
                      init={{
                        height: 320,
                        menubar: false,
                        plugins: [
                          "advlist",
                          "autolink",
                          "lists",
                          "link",
                          "image",
                          "charmap",
                          "preview",
                          "anchor",
                          "searchreplace",
                          "visualblocks",
                          "code",
                          "fullscreen",
                          "insertdatetime",
                          "media",
                          "table",
                          "help",
                          "wordcount",
                        ],
                        toolbar:
                          "undo redo | formatselect | bold italic underline | \
        alignleft aligncenter alignright | \
        bullist numlist outdent indent | removeformat | help",
                        content_style:
                          "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                      }}
                      onEditorChange={(content: any) => {
                        setDescription(content);
                      }}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item label="Brand" name="brand_or_company">
                    <CommonSelect
                      placeholder="Select Brand"
                      options={brandData?.data?.results?.map((b: any) => ({
                        label: b.name,
                        value: b.id,
                      }))}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item label="Sub Categories" name="subcategories">
                    <CommonSelect
                      mode="multiple"
                      placeholder="Search Sub Categories"
                      onSearch={(v) => setSearchTerm(v)}
                      options={subCategoriesData?.data?.results?.map(
                        (s: any) => ({
                          label: s.name,
                          value: s.id,
                        }),
                      )}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24}>
                  <Form.Item
                    label="Status"
                    name="is_active"
                    valuePropName="checked"
                    className="mb-0"
                  >
                    <div className="flex items-center gap-2 rounded-xl border border-[var(--app-border)] bg-[var(--app-surface-soft)] px-3 py-2">
                      <Switch
                        checkedChildren="Active"
                        unCheckedChildren="Inactive"
                      />
                      <Text className="text-sm text-[var(--app-text-soft)]">
                        Keep this product active for listing
                      </Text>
                    </div>
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Col>

          <Col xs={24}>
            <Card
              className={pageCardClass}
              title="Images"
              extra={
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  className="!rounded-xl !bg-[#279e5a] !border-[#279e5a] hover:!bg-[#1f8a4e] hover:!border-[#1f8a4e]"
                  onClick={openAddImageModal}
                >
                  Add Image
                </Button>
              }
            >
              {images.length === 0 && (
                <Text
                  type="secondary"
                  className="rounded-xl border border-dashed border-[var(--app-border)] bg-[var(--app-surface-soft)] px-4 py-2 inline-block"
                >
                  No images added yet. Please add at least one image.
                </Text>
              )}

              <Row gutter={[16, 16]}>
                {images.map((img, index) => (
                  <Col key={index} xs={24} md={6}>
                    <Card
                      className="!rounded-xl !border !border-[var(--app-border)] overflow-hidden"
                      hoverable
                      cover={
                        <img
                          alt={img.alt_text}
                          src={URL.createObjectURL(img.image)}
                          className="h-48 w-full object-cover"
                        />
                      }
                    >
                      <p>
                        <b>Alt:</b> {img.alt_text}
                      </p>
                      <p>
                        <b>Order:</b> {img.order}
                      </p>
                      <p>
                        <b>Feature:</b> {img.is_feature ? "Yes" : "No"}
                      </p>
                      <Popconfirm
                        title="Remove this image?"
                        description="This image will be removed from the product."
                        okText="Remove"
                        cancelText="Cancel"
                        okButtonProps={{
                          className:
                            "!bg-[#279e5a] !border-[#279e5a] hover:!bg-[#1f8a4e] hover:!border-[#1f8a4e]",
                        }}
                        onConfirm={() => removeImage(index)}
                      >
                        <Button
                          danger
                          size="small"
                          block
                          className="!rounded-lg"
                        >
                          Remove
                        </Button>
                      </Popconfirm>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card>
          </Col>

          <Col xs={24}>
            <Card
              className={pageCardClass}
              title="Variants"
              extra={
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  className="!rounded-xl !bg-[#279e5a] !border-[#279e5a] hover:!bg-[#1f8a4e] hover:!border-[#1f8a4e]"
                  onClick={addVariant}
                >
                  Add Variant
                </Button>
              }
            >
              <div className="space-y-4">
                {variants.map((variant, index) => (
                  <Card
                    key={index}
                    title={`Variant ${index + 1}`}
                    className="!rounded-xl !border !border-[var(--app-border)] !bg-[var(--app-surface-soft)]"
                    extra={
                      <Popconfirm
                        title="Remove this variant?"
                        description="All fields inside this variant will be deleted."
                        okText="Remove"
                        cancelText="Cancel"
                        okButtonProps={{
                          className:
                            "!bg-[#279e5a] !border-[#279e5a] hover:!bg-[#1f8a4e] hover:!border-[#1f8a4e]",
                        }}
                        onConfirm={() => removeVariant(index)}
                        disabled={variants.length === 1}
                      >
                        <Button
                          danger
                          icon={<DeleteOutlined />}
                          className="!rounded-lg"
                          disabled={variants.length === 1}
                        >
                          Remove
                        </Button>
                      </Popconfirm>
                    }
                  >
                    <Row gutter={[12, 12]}>
                      <Col xs={24} md={12}>
                        <Input
                          placeholder="Variant Name"
                          className="!rounded-xl"
                          value={variant.name}
                          onChange={(e) => {
                            const arr = [...variants];
                            arr[index].name = e.target.value;
                            setVariants(arr);
                          }}
                        />
                      </Col>

                      <Col xs={24} md={12}>
                        <Input
                          placeholder="SKU"
                          className="!rounded-xl"
                          value={variant.sku}
                          onChange={(e) => {
                            const arr = [...variants];
                            arr[index].sku = e.target.value;
                            setVariants(arr);
                          }}
                        />
                      </Col>

                      <Col xs={24} md={6}>
                        <Input
                          placeholder={
                            isAffiliatedStore ? "Price for Wholesale" : "Price"
                          }
                          type="number"
                          addonBefore="Tk"
                          className="!rounded-xl"
                          value={variant.price}
                          onChange={(e) => {
                            const arr = [...variants];
                            arr[index].price = e.target.value;
                            setVariants(arr);
                          }}
                        />
                      </Col>

                      {isAffiliatedStore && (
                        <Col xs={24} md={6}>
                          <Input
                            placeholder="Price for Customer"
                            type="number"
                            addonBefore="Tk"
                            className="!rounded-xl"
                            value={variant.customer_price}
                            onChange={(e) => {
                              const arr = [...variants];
                              arr[index].customer_price = e.target.value;
                              setVariants(arr);
                            }}
                          />
                        </Col>
                      )}

                      <Col xs={24} md={6}>
                        <Input
                          placeholder="Stock"
                          type="number"
                          className="!rounded-xl"
                          value={variant.stock}
                          onChange={(e) => {
                            const arr = [...variants];
                            arr[index].stock = e.target.value;
                            setVariants(arr);
                          }}
                        />
                      </Col>

                      <Col xs={24} md={6}>
                        <div className="flex items-center gap-2 rounded-xl border border-[var(--app-border)] bg-white px-3 py-2">
                          <Switch
                            checked={variant.is_default}
                            onChange={(v) => {
                              const arr = [...variants];
                              arr[index].is_default = v;
                              setVariants(arr);
                            }}
                          />
                          <Text className="text-sm text-[var(--app-text-soft)]">
                            Default Variant
                          </Text>
                        </div>
                      </Col>

                      <Col xs={24} md={24}>
                        <Card
                          size="small"
                          className="!rounded-xl !border !border-[var(--app-border)]"
                          title="Variant Image (Optional)"
                        >
                          <Row gutter={16} align="middle">
                            <Col>
                              <Upload
                                listType="picture-card"
                                maxCount={1}
                                showUploadList={false}
                                beforeUpload={(file) => {
                                  handleVariantImageChange(index, file);
                                  return false;
                                }}
                              >
                                {variant.imagePreview ? (
                                  <img
                                    src={variant.imagePreview}
                                    alt="variant"
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <div>
                                    <PlusOutlined />
                                    <div className="mt-2">Upload</div>
                                  </div>
                                )}
                              </Upload>
                            </Col>
                            {variant.imagePreview && (
                              <Col>
                                <Popconfirm
                                  title="Remove variant image?"
                                  okText="Remove"
                                  cancelText="Cancel"
                                  okButtonProps={{
                                    className:
                                      "!bg-[#279e5a] !border-[#279e5a] hover:!bg-[#1f8a4e] hover:!border-[#1f8a4e]",
                                  }}
                                  onConfirm={() =>
                                    handleVariantImageChange(index, null)
                                  }
                                >
                                  <Button
                                    danger
                                    size="small"
                                    className="!rounded-lg"
                                  >
                                    Remove Image
                                  </Button>
                                </Popconfirm>
                              </Col>
                            )}
                          </Row>
                        </Card>
                      </Col>

                      <Col xs={24}>
                        <Card
                          size="small"
                          className="!rounded-xl !border !border-[var(--app-border)]"
                          title="Attributes"
                          extra={
                            <Button
                              size="small"
                              icon={<PlusOutlined />}
                              className="!rounded-lg"
                              onClick={() => addAttribute(index)}
                            >
                              Add Attribute
                            </Button>
                          }
                        >
                          {variant.attributes.map(
                            (attr: any, aIndex: number) => (
                              <Row
                                gutter={12}
                                key={aIndex}
                                style={{ marginBottom: 10 }}
                              >
                                <Col xs={24} sm={10}>
                                  <Select
                                    showSearch
                                    allowClear
                                    placeholder="Attribute Key"
                                    value={attr.key}
                                    className="w-full"
                                    filterOption={(input, option) =>
                                      (option?.value ?? "")
                                        .toLowerCase()
                                        .includes(input.toLowerCase())
                                    }
                                    options={ATTRIBUTE_KEYS.map((k) => ({
                                      value: k,
                                      label: k,
                                    }))}
                                    onChange={(value) => {
                                      const arr = [...variants];
                                      arr[index].attributes[aIndex].key = value;
                                      setVariants(arr);
                                    }}
                                    onBlur={(e) => {
                                      // Allow custom input on blur
                                      const arr = [...variants];
                                      const inputValue = (
                                        e.target as HTMLInputElement
                                      ).value;
                                      if (
                                        !arr[index].attributes[aIndex].key &&
                                        inputValue
                                      ) {
                                        arr[index].attributes[aIndex].key =
                                          inputValue;
                                        setVariants(arr);
                                      }
                                    }}
                                  />
                                </Col>
                                <Col xs={24} sm={10}>
                                  <Select
                                    showSearch
                                    allowClear
                                    placeholder="Attribute Value"
                                    value={attr.value}
                                    className="w-full"
                                    filterOption={(input, option) =>
                                      (option?.value ?? "")
                                        .toLowerCase()
                                        .includes(input.toLowerCase())
                                    }
                                    options={ATTRIBUTE_VALUES.map((v) => ({
                                      value: v,
                                      label: v,
                                    }))}
                                    onChange={(value) => {
                                      const arr = [...variants];
                                      arr[index].attributes[aIndex].value =
                                        value;
                                      setVariants(arr);
                                    }}
                                    onBlur={(e) => {
                                      // Allow custom input on blur
                                      const arr = [...variants];
                                      const inputValue = (
                                        e.target as HTMLInputElement
                                      ).value;
                                      if (
                                        !arr[index].attributes[aIndex].value &&
                                        inputValue
                                      ) {
                                        arr[index].attributes[aIndex].value =
                                          inputValue;
                                        setVariants(arr);
                                      }
                                    }}
                                  />
                                </Col>
                                <Col xs={24} sm={4}>
                                  <Popconfirm
                                    title="Remove this attribute?"
                                    okText="Remove"
                                    cancelText="Cancel"
                                    okButtonProps={{
                                      className:
                                        "!bg-[#279e5a] !border-[#279e5a] hover:!bg-[#1f8a4e] hover:!border-[#1f8a4e]",
                                    }}
                                    onConfirm={() =>
                                      removeAttribute(index, aIndex)
                                    }
                                    disabled={variant.attributes.length === 1}
                                  >
                                    <Button
                                      danger
                                      block
                                      icon={<DeleteOutlined />}
                                      className="!rounded-lg"
                                      disabled={variant.attributes.length === 1}
                                    />
                                  </Popconfirm>
                                </Col>
                              </Row>
                            ),
                          )}
                        </Card>
                      </Col>
                    </Row>
                  </Card>
                ))}
              </div>
            </Card>
          </Col>
        </Row>
      </Form>

      <Modal
        title={
          <div className="space-y-1">
            <div className="text-base font-semibold text-[var(--app-text)]">
              Add Product Image
            </div>
            <div className="text-xs text-[var(--app-text-soft)]">
              Upload image, alt text, and ordering information.
            </div>
          </div>
        }
        open={isImageModalOpen}
        onCancel={() => setIsImageModalOpen(false)}
        onOk={handleAddImage}
        okText="Add"
        cancelText="Cancel"
        centered
        destroyOnClose
        maskClosable={false}
        width={560}
        okButtonProps={{
          className:
            "!bg-[#279e5a] !border-[#279e5a] hover:!bg-[#1f8a4e] hover:!border-[#1f8a4e]",
        }}
        cancelButtonProps={{
          className: "!rounded-lg",
        }}
      >
        <AntForm form={imageForm} layout="vertical">
          <AntForm.Item
            label="Image File"
            name="image"
            rules={[{ required: true, message: "Image is required" }]}
          >
            <Upload
              listType="picture-card"
              maxCount={1}
              beforeUpload={() => false}
            >
              <div>
                <PlusOutlined />
                <div className="mt-2">Upload</div>
              </div>
            </Upload>
          </AntForm.Item>

          <AntForm.Item
            label="Alt Text"
            name="alt_text"
            rules={[{ required: true, message: "Alt text required" }]}
          >
            <Input placeholder="Alt Text" className="!rounded-xl" />
          </AntForm.Item>

          <AntForm.Item label="Order" name="order">
            <Input
              type="number"
              placeholder="Order number"
              className="!rounded-xl"
            />
          </AntForm.Item>

          <AntForm.Item
            label="Feature Image"
            name="is_feature"
            valuePropName="checked"
          >
            <Switch />
          </AntForm.Item>
        </AntForm>
      </Modal>
    </div>
  );
};

export default CreateProduct;
