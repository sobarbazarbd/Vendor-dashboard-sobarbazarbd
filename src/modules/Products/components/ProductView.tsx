import { Card, Col, Row, Tag, Image, Typography, Table, Divider } from "antd";
import BreadCrumb from "../../../common/BreadCrumb/BreadCrumb";
import { useParams } from "react-router-dom";
import { useGetSingleProductQuery } from "../api/productEndPoints";

const { Title, Text, Paragraph } = Typography;

const ProductView = () => {
  const { productId } = useParams();
  const { data } = useGetSingleProductQuery(Number(productId));
  const product = data?.data;

  return (
    <div>
      <div className="my-5">
        <BreadCrumb />
      </div>

      <Card style={{ borderRadius: 16 }}>
        <Row gutter={[24, 24]}>
          {/* LEFT: Images */}
          <Col xs={24} md={12}>
            <Card bordered style={{ borderRadius: 12 }}>
              <Image
                src={product?.images?.[0]?.image}
                alt={product?.name}
                width="100%"
                height="auto"
                style={{
                  borderRadius: 12,
                  objectFit: "cover",
                  maxHeight: 350,
                }}
              />

              {/* Image Thumbnails */}
              <Row gutter={[12, 12]} className="mt-3">
                {product?.images?.map((img: any) => (
                  <Col key={img.id} span={6}>
                    <Image
                      src={img.image}
                      alt={img.alt_text}
                      width="100%"
                      height={70}
                      style={{
                        borderRadius: 8,
                        objectFit: "cover",
                      }}
                    />
                  </Col>
                ))}
              </Row>
            </Card>
          </Col>

          {/* RIGHT: Product Info */}
          <Col xs={24} md={12}>
            <div>
              <Title level={3} style={{ marginBottom: 8 }}>
                {product?.name}
              </Title>

              <Text type="secondary" style={{ fontSize: 16 }}>
                SKU: {product?.sku}
              </Text>

              <Divider />

              <Paragraph style={{ fontSize: 16 }}>
                {product?.description}
              </Paragraph>

              <Divider />

              <Title level={5}>Subcategories</Title>
              <div className="flex flex-wrap gap-2 mb-4">
                {product?.subcategories?.map((sub: any) => (
                  <Tag key={sub.id} color="blue">
                    {sub.name}
                  </Tag>
                ))}
              </div>

              <Divider />

              {/* Brand Info */}
              <Title level={5}>Brand / Company</Title>
              <Text>{product?.brand_or_company || "No brand available"}</Text>

              <Divider />

              {/* Product Status */}
              <Title level={5}>Status</Title>
              {product?.is_active ? (
                <Tag color="green">Active</Tag>
              ) : (
                <Tag color="red">Inactive</Tag>
              )}
            </div>
          </Col>
        </Row>

        {/* Variants Table */}
        <Divider />

        <Title level={4}>Variants</Title>

        <Table
          bordered
          size="middle"
          dataSource={product?.variants || []}
          rowKey="id"
          pagination={false}
          columns={[
            {
              title: "Variant Name",
              dataIndex: "name",
            },
            {
              title: "SKU",
              dataIndex: "sku",
            },
            {
              title: "Price",
              dataIndex: "final_price",
              render: (p) => `৳ ${p}`,
            },
            {
              title: "Stock",
              dataIndex: "stock",
            },
            {
              title: "Default",
              dataIndex: "is_default",
              render: (v) =>
                v ? <Tag color="green">Default</Tag> : <Tag>No</Tag>,
            },
          ]}
        />
      </Card>
    </div>
  );
};

export default ProductView;
