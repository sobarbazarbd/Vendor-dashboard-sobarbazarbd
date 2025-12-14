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
  Divider,
  Button,
  Upload,
  message,
} from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
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

const { Title, Text } = Typography;

const CreateProduct = () => {
  const [form] = AntForm.useForm();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);
  const [description, setDescription] = useState("");

  const [create, { isLoading, isSuccess }] = useCreateProductMutation();
  const { data: subCategoriesData } = useGetSubCategoriesQuery({
    search: debouncedSearch || undefined,
  });

  const { data: brandData } = useGetBrandsQuery({});

  /** -------------------------------
   * IMAGE STATE + MODAL FORM
   --------------------------------*/
  const [images, setImages] = useState<any[]>([]);

  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  // image modal form
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
        id: 0,
        image: fileObj,
        alt_text: values.alt_text,
        is_feature: values.is_feature || false,
        order: Number(values.order) || 0,
      };

      setImages((prev) => [...prev, newImage]);
      setIsImageModalOpen(false);
    });
  };

  const removeImage = (i: number) => {
    const updated = images.filter((_, index) => index !== i);
    setImages(updated);
  };

  /** ---------------------------
   * PRODUCT VARIANTS
   -----------------------------*/
  const [variants, setVariants] = useState<any[]>([
    {
      name: "",
      sku: "",
      price: "",
      stock: "",
      is_default: false,
      attributes: [],
    },
  ]);

  console.log("variants", variants);
  console.log("images", images);

  const addVariant = () => {
    setVariants([
      ...variants,
      {
        name: "",
        sku: "",
        price: "",
        stock: "",
        is_default: false,
        attributes: [],
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

  /** -------------------------------
   * SUBMIT HANDLER
   --------------------------------*/
  // const onFinish = (values: any) => {
  //   const formData = new FormData();

  //   formData.append("name", values.name);
  //   formData.append("description", values.description || "");
  //   formData.append("sku", values.sku || "");
  //   formData.append("is_active", values.is_active ? "true" : "false");

  //   values.subcategories?.forEach((id: number) =>
  //     formData.append("subcategories", id.toString())
  //   );

  //   if (values.brand_or_company) {
  //     formData.append("brand_or_company", values.brand_or_company);
  //   }

  //   formData.append(
  //     "variants",
  //     JSON.stringify(
  //       variants.map((v) => ({
  //         name: v.name,
  //         sku: v.sku,
  //         price: Number(v.price),
  //         stock: Number(v.stock),
  //         is_default: v.is_default,
  //         attributes: Object.fromEntries(
  //           v.attributes.map((a: any) => [a.key, a.value])
  //         ),
  //       }))
  //     )
  //   );

  //   /** -------------------------------
  //    * IMAGE APPEND TO FORMDATA
  //    --------------------------------*/
  //   images.forEach((img) => {
  //     const meta = {
  //       id: 0,
  //       image: "",
  //       alt_text: img.alt_text,
  //       is_feature: img.is_feature,
  //       order: img.order,
  //       variant: null,
  //     };

  //     formData.append(
  //       "images",
  //       new Blob([JSON.stringify(meta)], {
  //         type: "application/json",
  //       })
  //     );

  //     formData.append("image_files", img.image.originFileObj);
  //   });

  //   // NO DELETE IDS
  //   // formData.append("delete_image_ids", JSON.stringify([]));

  //   console.log("formData", formData);
  //   console.log("values", values);

  //   create(formData);
  // };

  const onFinish = (values: any) => {
    const formData = new FormData();

    // BASIC FIELDS
    formData.append("name", values.name);
    formData.append("description", description || "");
    formData.append("sku", values.sku || "");
    formData.append("is_active", String(values.is_active));

    // SUBCATEGORIES (array)
    values.subcategories?.forEach((id: number) =>
      formData.append("subcategories", id.toString())
    );

    // BRAND
    if (values.brand_or_company !== undefined) {
      formData.append("brand_or_company", values.brand_or_company.toString());
    }

    // VARIANTS (array)
    formData.append(
      "variants",
      JSON.stringify(
        variants.map((v: any) => ({
          name: v.name,
          sku: v.sku,
          price: Number(v.price),
          stock: Number(v.stock),
          is_default: v.is_default,
          attributes: Object.fromEntries(
            v.attributes.map((a: any) => [a.key, a.value])
          ),
        }))
      )
    );

    // IMAGES METADATA (array)
    formData.append(
      "images",
      JSON.stringify(
        images.map((img: any, index: number) => ({
          image: "", // backend will map file
          variant: img.variant ?? null,
          alt_text: img.alt_text,
          is_feature: img.is_feature,
          order: img.order ?? index,
        }))
      )
    );

    // IMAGE FILES
    images.forEach((img: any) => {
      if (img.image?.originFileObj) {
        formData.append("image_files", img.image.originFileObj);
      }
    });

    create(formData);
  };

  useEffect(() => {
    if (isSuccess) {
      message.success("Product Created Successfully!");
      navigate("/products");
    }
  }, [isSuccess]);

  return (
    <div className="create-product-form">
      <Title level={3}>Create New Product</Title>
      <Divider />

      <Form form={form} onFinish={onFinish} isLoading={isLoading}>
        <Row gutter={[24, 24]}>
          {/* BASIC INFO */}
          <Col xs={24}>
            <Card title="Basic Product Information">
              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Product Name"
                    name="name"
                    rules={[{ required: true }]}
                  >
                    <Input size="large" placeholder="Product Name" />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item label="SKU" name="sku">
                    <Input size="large" placeholder="SKU" />
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
                      apiKey="no-api-key"
                      value={description}
                      init={{
                        height: 300,
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
                        })
                      )}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24}>
                  <Form.Item
                    label="Status"
                    name="is_active"
                    valuePropName="checked"
                  >
                    <Switch
                      checkedChildren="Active"
                      unCheckedChildren="Inactive"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Col>

          {/* IMAGE SECTION */}
          <Col xs={24}>
            <Card
              title="Images"
              extra={
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={openAddImageModal}
                >
                  Add Image
                </Button>
              }
            >
              {images.length === 0 && <Text>No images added yet.</Text>}

              <Row gutter={[16, 16]}>
                {images.map((img, index) => (
                  <Col key={index} xs={24} md={6}>
                    <Card
                      hoverable
                      cover={
                        <img alt={img.alt_text} src={img.image.thumbUrl} />
                      }
                      extra={
                        <Button
                          danger
                          size="small"
                          onClick={() => removeImage(index)}
                        >
                          Remove
                        </Button>
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
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card>
          </Col>

          {/* VARIANTS */}
          <Col xs={24}>
            <Card
              title="Variants"
              extra={
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={addVariant}
                >
                  Add Variant
                </Button>
              }
            >
              {variants.map((variant, index) => (
                <Card
                  key={index}
                  title={`Variant ${index + 1}`}
                  extra={
                    <Button
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => removeVariant(index)}
                    >
                      Remove
                    </Button>
                  }
                  style={{ marginBottom: 16 }}
                >
                  <Row gutter={[16, 16]}>
                    <Col xs={24} md={12}>
                      <Input
                        placeholder="Variant Name"
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
                        placeholder="Price"
                        type="number"
                        value={variant.price}
                        onChange={(e) => {
                          const arr = [...variants];
                          arr[index].price = e.target.value;
                          setVariants(arr);
                        }}
                      />
                    </Col>

                    <Col xs={24} md={6}>
                      <Input
                        placeholder="Stock"
                        type="number"
                        value={variant.stock}
                        onChange={(e) => {
                          const arr = [...variants];
                          arr[index].stock = e.target.value;
                          setVariants(arr);
                        }}
                      />
                    </Col>

                    <Col xs={24} md={6}>
                      <Switch
                        checked={variant.is_default}
                        onChange={(v) => {
                          const arr = [...variants];
                          arr[index].is_default = v;
                          setVariants(arr);
                        }}
                      />
                      <Text style={{ marginLeft: 8 }}>Default Variant</Text>
                    </Col>

                    {/* ATTRIBUTES */}
                    <Col xs={24}>
                      <Card
                        size="small"
                        title="Attributes"
                        extra={
                          <Button
                            size="small"
                            icon={<PlusOutlined />}
                            onClick={() => addAttribute(index)}
                          >
                            Add Attribute
                          </Button>
                        }
                      >
                        {variant.attributes.map((attr: any, aIndex: number) => (
                          <Row
                            gutter={12}
                            key={aIndex}
                            style={{ marginBottom: 10 }}
                          >
                            <Col xs={10}>
                              <Input
                                placeholder="Attribute Key"
                                value={attr.key}
                                onChange={(e) => {
                                  const arr = [...variants];
                                  arr[index].attributes[aIndex].key =
                                    e.target.value;
                                  setVariants(arr);
                                }}
                              />
                            </Col>
                            <Col xs={10}>
                              <Input
                                placeholder="Attribute Value"
                                value={attr.value}
                                onChange={(e) => {
                                  const arr = [...variants];
                                  arr[index].attributes[aIndex].value =
                                    e.target.value;
                                  setVariants(arr);
                                }}
                              />
                            </Col>
                            <Col xs={4}>
                              <Button
                                danger
                                icon={<DeleteOutlined />}
                                onClick={() => removeAttribute(index, aIndex)}
                              />
                            </Col>
                          </Row>
                        ))}
                      </Card>
                    </Col>
                  </Row>
                </Card>
              ))}
            </Card>
          </Col>
        </Row>
      </Form>

      {/* IMAGE ADD MODAL */}
      <Modal
        title="Add Image"
        open={isImageModalOpen}
        onCancel={() => setIsImageModalOpen(false)}
        onOk={handleAddImage}
        okText="Add"
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
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            </Upload>
          </AntForm.Item>

          <AntForm.Item
            label="Alt Text"
            name="alt_text"
            rules={[{ required: true, message: "Alt text required" }]}
          >
            <Input placeholder="Alt Text" />
          </AntForm.Item>

          <AntForm.Item label="Order" name="order">
            <Input type="number" placeholder="Order number" />
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
