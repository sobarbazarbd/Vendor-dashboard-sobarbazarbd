import { Card, Spin, Tag, Row, Col, Divider, Typography } from "antd";
import { useGetSingleInvoiceQuery } from "../api/invoiceEndPoints";

const { Title, Text } = Typography;

export default function ViewInvoice({ id }: { id: number }) {
  const { data: singleInvoiceData, isLoading } = useGetSingleInvoiceQuery({
    id,
  });
  const invoice = singleInvoiceData?.data;

  if (isLoading) {
    return (
      <div className="w-full flex justify-center py-20">
        <Spin size="large" />
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="text-center py-10 text-red-500">
        <Text type="danger">Invoice not found</Text>
      </div>
    );
  }

  return (
    <div className="flex justify-center p-4 md:p-10 bg-gray-50 min-h-screen">
      <Card
        style={{
          width: "100%",
          maxWidth: 800,
          borderRadius: 16,
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        }}
        bodyStyle={{ padding: 24 }}
      >
        {/* Header */}
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={3} style={{ marginBottom: 0 }}>
              Invoice
            </Title>
          </Col>
          <Col>
            <Tag
              color={invoice.status === "paid" ? "green" : "orange"}
              style={{ padding: "4px 12px", fontSize: 14 }}
            >
              {invoice.status.toUpperCase()}
            </Tag>
          </Col>
        </Row>

        <Divider />

        {/* Invoice Meta */}
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Text strong>Invoice Number:</Text>
            <p>{invoice.invoice_number}</p>

            <Text strong>Order Number:</Text>
            <p>{invoice.order_number}</p>

            <Text strong>Invoice Date:</Text>
            <p>{invoice.invoice_date}</p>

            <Text strong>Due Date:</Text>
            <p>{invoice.due_date}</p>
          </Col>

          <Col xs={24} md={12}>
            <Text strong>Subtotal:</Text>
            <p>৳{invoice.subtotal}</p>

            <Text strong>Tax:</Text>
            <p>৳{invoice.tax}</p>

            <Text strong>Shipping:</Text>
            <p>৳{invoice.shipping}</p>

            <Text strong>Discount:</Text>
            <p>৳{invoice.discount}</p>
          </Col>
        </Row>

        <Divider />

        {/* Total Section */}
        <Card
          style={{
            background: "#fafafa",
            borderRadius: 12,
          }}
          bodyStyle={{ padding: 16 }}
        >
          <Row justify="space-between">
            <Text strong>Total:</Text>
            <Text strong>৳{invoice.total}</Text>
          </Row>

          <Row justify="space-between" style={{ marginTop: 6 }}>
            <Text strong>Amount Paid:</Text>
            <Text>৳{invoice.amount_paid}</Text>
          </Row>

          <Row justify="space-between" style={{ marginTop: 6 }}>
            <Text strong>Balance:</Text>
            <Text>৳{invoice.balance}</Text>
          </Row>
        </Card>

        {/* Notes Section */}
        {invoice.notes && (
          <div style={{ marginTop: 24 }}>
            <Title level={5}>Notes</Title>
            <Text type="secondary">{invoice.notes}</Text>
          </div>
        )}
      </Card>
    </div>
  );
}
