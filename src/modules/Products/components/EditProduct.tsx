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
  Select,
  Spin,
} from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { Form } from "../../../common/CommonAnt";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";

import {
  useUpdateProductMutation,
  useGetSingleProductQuery,
  useGetBrandsQuery,
  useGetSubCategoriesQuery,
} from "../api/productEndPoints";

import { CommonSelect } from "../../../common/commonField/commonFeild";
import useDebounce from "../../../hooks/useDebounce";
import { ATTRIBUTE_KEYS, ATTRIBUTE_VALUES } from "../attributeOptions";

const { Title, Text } = Typography;

const EditProduct = () => {
  const { productId } = useParams();
  const [form] = AntForm.useForm();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);
  const [description, setDescription] = useState("");

  const { data: productData, isLoading: isLoadingProduct } = useGetSingleProductQuery(Number(productId));
  const [update, { isLoading, isSuccess }] = useUpdateProductMutation();
  
  const { data: subCategoriesData } = useGetSubCategoriesQuery({
    search: debouncedSearch || undefined,
  });

  const { data: brandData } = useGetBrandsQuery({});

  const [images, setImages] = useState<any[]>([]);
  const [existingImages, setExistingImages] = useState<any[]>([]);
  const [deleteImageIds, setDeleteImageIds] = useState<number[]>([]);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [imageForm] = AntForm.useForm();

  const [variants, setVariants] = useState<any[]>([]);

  // Load existing product data
  useEffect(() => {
    if (productData?.data) {
      const product = productData.data;
      
      form.setFieldsValue({
        name: product.name,
        sku: product.sku,
        is_active: product.is_active,
        brand_or_company: product.brand_or_company?.id,
        subcategories: product.subcategories?.map((s: any) => s.id),
      });

      setDescription(product.description || "");
      setExistingImages(product.images || []);

      // Load variants with attributes
      if (product.variants && product.variants.length > 0) {
        const loadedVariants = product.variants.map((v: any) => ({
          id: v.id,
          name: v.name,
          sku: v.sku,
          price: v.price,
          stock: v.stock,
          is_default: v.is_default,
          attributes: v.attributes
            ? Object.entries(v.attributes).map(([key, value]) => ({ key, value }))
            : [{ key: "", value: "" }],
        }));
        setVariants(loadedVariants);
      } else {
        setVariants([
          {
            name: "",
            sku: "",
            price: "",
            stock: "",
            is_default: false,
            attributes: [{ key: "", value: "" }],
          },
        ]);
      }
    }
  }, [productData, form]);

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
        order: Number(values.order) || images.length + existingImages.length,
      };

      setImages((prev) => [...prev, newImage]);
      setIsImageModalOpen(false);
      message.success("Image added successfully!");
    });
  };

  const removeExistingImage = (imageId: number) => {
    setDeleteImageIds((prev) => [...prev, imageId]);
    setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
    message.info("Image will be deleted on save");
  };

  const removeNewImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const addVariant = () => {
    setVariants([
      ...variants,
      {
        name: "",
        sku: "",
        price: "",
        stock: "",
        is_default: false,
        attributes: [{ key: "", value: "" }],
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
    if (arr[variantIndex].attributes.length === 1) {
      return message.warning("At least one attribute required per variant!");
    }
    arr[variantIndex].attributes.splice(attrIndex, 1);
    setVariants(arr);
  };

  const onFinish = (values: any) => {
    if (!description || description === "<p></p>" || description.trim() === "") {
      message.error("Please add a product description!");
      return;
    }

    if (variants.length === 0) {
      message.error("Please add at least one variant!");
      return;
    }

    const hasValidVariant = variants.some(
      (v) => v.name && v.sku && Number(v.price) > 0
    );
    if (!hasValidVariant) {
      message.error("At least one variant must have a valid name, SKU, and price!");
      return;
    }

    // Validate at least one attribute per variant
    const invalidVariant = variants.find(
      (v) =>
        !v.attributes ||
        v.attributes.length === 0 ||
        v.attributes.some((a: any) => !a.key || !a.value)
    );
    if (invalidVariant) {
      message.error("Each variant must have at least one attribute with both key and value!");
      return;
    }

    if (existingImages.length === 0 && images.length === 0) {
      message.error("Please add at least one product image!");
      return;
    }

    const formData = new FormData();

    formData.append("name", values.name);
    formData.append("description", description);
    formData.append("sku", values.sku || "");
    formData.append("is_active", values.is_active ? "true" : "false");

    if (values.subcategories && values.subcategories.length > 0) {
      values.subcategories.forEach((id: number) => {
        formData.append("subcategories", id.toString());
      });
    }

    if (values.brand_or_company !== undefined && values.brand_or_company !== null) {
      formData.append("brand_or_company", values.brand_or_company.toString());
    }

    // Prepare variants payload
    const validVariants = variants.filter(
      (v: any) => v.name && v.sku && Number(v.price) > 0
    );

    const variantsPayload = validVariants.map((v: any) => {
      const variantData: any = {
        name: v.name.trim(),
        sku: v.sku.trim(),
        price: Number(v.price),
        stock: Number(v.stock) || 0,
        is_default: v.is_default || false,
        attributes: Object.fromEntries(
          (v.attributes || [])
            .filter((a: any) => a.key && a.value)
            .map((a: any) => [a.key.trim(), a.value.trim()])
        ),
      };

      // Include ID for existing variants
      if (v.id) {
        variantData.id = v.id;
      }

      return variantData;
    });

    formData.append("variants", JSON.stringify(variantsPayload));

    // Existing images metadata
    const existingImagesMetadata = existingImages.map((img: any) => ({
      id: img.id,
      alt_text: img.alt_text || "",
      is_feature: img.is_feature || false,
      order: img.order ?? 0,
    }));

    // New images metadata
    const newImagesMetadata = images.map((img: any, index: number) => ({
      alt_text: img.alt_text || "",
      is_feature: img.is_feature || false,
      order: img.order ?? (existingImages.length + index),
    }));

    const allImagesMetadata = [...existingImagesMetadata, ...newImagesMetadata];
    formData.append("images", JSON.stringify(allImagesMetadata));

    // Append new image files
    images.forEach((img: any) => {
      if (img.image) {
        formData.append("image_files", img.image);
      }
    });

    // Delete image IDs
    if (deleteImageIds.length > 0) {
      deleteImageIds.forEach((id) => {
        formData.append("delete_image_ids", id.toString());
      });
    }

    update({ id: Number(productId), data: formData });
  };

  useEffect(() => {
    if (isSuccess) {
      message.success("Product Updated Successfully!");
      navigate("/products");
    }
  }, [isSuccess, navigate]);

  if (isLoadingProduct) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="edit-product-form">
      <Title level={3}>Edit Product</Title>
      <Divider />

      <Form form={form} onFinish={onFinish} isLoading={isLoading}>
        <Row gutter={[24, 24]}>
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
                      apiKey="233kxbtr26hptvnz70r051p006eabjgrqpjnj7psbw11yti9"
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

          {/* Images Section */}
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
              {existingImages.length === 0 && images.length === 0 && (
                <Text type="secondary">
                  No images added yet. Please add at least one image.
                </Text>
              )}

              <Row gutter={[16, 16]}>
                {/* Existing Images */}
                {existingImages.map((img, index) => (
                  <Col key={`existing-${img.id}`} xs={24} md={6}>
                    <Card
                      hoverable
                      cover={
                        <img
                          alt={img.alt_text}
                          src={img.image}
                          style={{ height: 200, objectFit: "cover" }}
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
                      <Button
                        danger
                        size="small"
                        block
                        onClick={() => removeExistingImage(img.id)}
                      >
                        Remove
                      </Button>
                    </Card>
                  </Col>
                ))}

                {/* New Images */}
                {images.map((img, index) => (
                  <Col key={`new-${index}`} xs={24} md={6}>
                    <Card
                      hoverable
                      cover={
                        <img
                          alt={img.alt_text}
                          src={URL.createObjectURL(img.image)}
                          style={{ height: 200, objectFit: "cover" }}
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
                      <p style={{ color: "green" }}>
                        <b>New</b>
                      </p>
                      <Button
                        danger
                        size="small"
                        block
                        onClick={() => removeNewImage(index)}
                      >
                        Remove
                      </Button>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card>
          </Col>

          {/* Variants Section - same as CreateProduct but with loaded data */}
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
                  title={`Variant ${index + 1} ${variant.id ? `(ID: ${variant.id})` : "(New)"}`}
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

                    <Col xs={24}>
                      <Card
                        size="small"
                        title="Attributes (At least one required)"
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
                              <Select
                                showSearch
                                allowClear
                                placeholder="Attribute Key"
                                value={attr.key}
                                style={{ width: "100%" }}
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
                              />
                            </Col>
                            <Col xs={10}>
                              <Select
                                showSearch
                                allowClear
                                placeholder="Attribute Value"
                                value={attr.value}
                                style={{ width: "100%" }}
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
                                  arr[index].attributes[aIndex].value = value;
                                  setVariants(arr);
                                }}
                              />
                            </Col>
                            <Col xs={4}>
                              <Button
                                danger
                                icon={<DeleteOutlined />}
                                onClick={() => removeAttribute(index, aIndex)}
                                disabled={variant.attributes.length === 1}
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

      {/* Image Add Modal */}
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

export default EditProduct;
