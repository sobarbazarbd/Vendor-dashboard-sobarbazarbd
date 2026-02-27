import { useState } from "react";
import {
  Button,
  Card,
  Col,
  Descriptions,
  Modal,
  Row,
  Select,
  Space,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import {
  CarOutlined,
  EnvironmentOutlined,
  UserOutlined,
} from "@ant-design/icons";
import Table from "../../../common/CommonAnt/Table";
import { useAppSelector } from "../../../app/store";
import { FilterState } from "../../../app/features/filterSlice";
import {
  useGetAffiliatedCustomerOrdersQuery,
  useShipAffiliatedOrderMutation,
  useUpdateAffiliatedOrderStatusMutation,
} from "../api/orderEndPoints";
import { IAffiliatedCustomerOrder, CustomerOrderStatus } from "../types/ordersType";

const STATUS_COLORS: Record<CustomerOrderStatus, string> = {
  Placed: "default",
  Paid: "cyan",
  Confirmed: "blue",
  Processing: "orange",
  Shipped: "purple",
  Delivered: "green",
  Cancelled: "red",
};

const STATUS_OPTIONS: CustomerOrderStatus[] = [
  "Placed",
  "Confirmed",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

const AffiliatedCustomerOrdersTable = () => {
  const { page_size, page } = useAppSelector(FilterState);
  const [shipModal, setShipModal] = useState<{
    open: boolean;
    order: IAffiliatedCustomerOrder | null;
  }>({ open: false, order: null });
  const [selectedMethod, setSelectedMethod] = useState<"steadfast" | "pathao">("steadfast");

  const { data, isLoading, isFetching, refetch } = useGetAffiliatedCustomerOrdersQuery({
    page_size,
    page: Number(page) || undefined,
  });

  const [updateStatus, { isLoading: isUpdating }] = useUpdateAffiliatedOrderStatusMutation();
  const [shipOrder, { isLoading: isShipping }] = useShipAffiliatedOrderMutation();

  const orders = (data?.data?.results ?? []) as IAffiliatedCustomerOrder[];

  const handleStatusChange = async (id: number, status: string) => {
    await updateStatus({ id, status });
  };

  const handleShip = async () => {
    if (!shipModal.order) return;
    await shipOrder({
      id: shipModal.order.id,
      delivery_method: selectedMethod,
    });
    setShipModal({ open: false, order: null });
  };

  const columns = [
    {
      title: "Order #",
      dataIndex: "order_number",
      key: "order_number",
      render: (val: string) => (
        <Typography.Text strong>{val}</Typography.Text>
      ),
    },
    {
      title: "Customer",
      key: "customer",
      render: (_: any, record: IAffiliatedCustomerOrder) => (
        <Space direction="vertical" size={0}>
          <Space size={4}>
            <UserOutlined className="text-xs text-gray-400" />
            <Typography.Text>{record.customer_name || "—"}</Typography.Text>
          </Space>
          <Typography.Text type="secondary" className="text-xs">
            {record.customer_phone}
          </Typography.Text>
        </Space>
      ),
    },
    {
      title: "Address",
      dataIndex: "shipping_address",
      key: "shipping_address",
      render: (val: string) => (
        <Space size={4}>
          <EnvironmentOutlined className="text-xs text-gray-400" />
          <Typography.Text className="text-xs">{val || "—"}</Typography.Text>
        </Space>
      ),
    },
    {
      title: "Items",
      key: "items",
      render: (_: any, record: IAffiliatedCustomerOrder) => (
        <Space direction="vertical" size={0}>
          {record.items.map((item) => (
            <Typography.Text key={item.id} className="text-xs">
              {item.product_title} × {item.quantity}
            </Typography.Text>
          ))}
        </Space>
      ),
    },
    {
      title: "Total",
      dataIndex: "total_price",
      key: "total_price",
      render: (val: string) => (
        <Typography.Text strong>৳{val ?? "—"}</Typography.Text>
      ),
    },
    {
      title: "Delivery",
      key: "delivery",
      render: (_: any, record: IAffiliatedCustomerOrder) => {
        if (record.delivery_tracking_code) {
          return (
            <Space direction="vertical" size={0}>
              <Tag color="blue">{record.delivery_method?.toUpperCase()}</Tag>
              <Typography.Text copyable className="text-xs">
                {record.delivery_tracking_code}
              </Typography.Text>
            </Space>
          );
        }
        return <Typography.Text type="secondary" className="text-xs">Not shipped</Typography.Text>;
      },
    },
    {
      title: "Status",
      key: "status",
      render: (_: any, record: IAffiliatedCustomerOrder) => (
        <Select
          value={record.status}
          size="small"
          style={{ width: 130 }}
          loading={isUpdating}
          onChange={(val) => handleStatusChange(record.id, val)}
          options={STATUS_OPTIONS.map((s) => ({
            label: <Tag color={STATUS_COLORS[s]}>{s}</Tag>,
            value: s,
          }))}
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: IAffiliatedCustomerOrder) => (
        <Space>
          {!record.delivery_tracking_code &&
            ["Confirmed", "Processing"].includes(record.status) && (
              <Tooltip title="Ship this order via courier">
                <Button
                  size="small"
                  type="primary"
                  icon={<CarOutlined />}
                  onClick={() => setShipModal({ open: true, order: record })}
                >
                  Ship
                </Button>
              </Tooltip>
            )}
        </Space>
      ),
    },
  ];

  return (
    <>
      <div className="mb-3 flex items-center justify-between">
        <Typography.Text type="secondary" className="text-sm">
          Customer orders containing your affiliated products
        </Typography.Text>
        <Button onClick={refetch} loading={isFetching} size="small">
          Refresh
        </Button>
      </div>

      <Table
        rowKey="id"
        loading={isLoading || isFetching}
        refetch={refetch}
        total={data?.data?.count}
        dataSource={orders}
        columns={columns}
        expandable={{
          expandedRowRender: (record: IAffiliatedCustomerOrder) => (
            <Card size="small" className="bg-gray-50">
              <Descriptions column={2} size="small" title="Order Details">
                <Descriptions.Item label="Order #">{record.order_number}</Descriptions.Item>
                <Descriptions.Item label="Date">
                  {record.order_date
                    ? new Date(record.order_date).toLocaleString()
                    : "—"}
                </Descriptions.Item>
                <Descriptions.Item label="Customer">{record.customer_name}</Descriptions.Item>
                <Descriptions.Item label="Phone">{record.customer_phone}</Descriptions.Item>
                <Descriptions.Item label="Address" span={2}>
                  {record.shipping_address}
                </Descriptions.Item>
                {record.delivery_tracking_code && (
                  <Descriptions.Item label="Tracking Code" span={2}>
                    <Typography.Text copyable>
                      {record.delivery_tracking_code}
                    </Typography.Text>
                  </Descriptions.Item>
                )}
              </Descriptions>
            </Card>
          ),
        }}
      />

      <Modal
        title={
          <Space>
            <CarOutlined />
            Ship Order #{shipModal.order?.order_number}
          </Space>
        }
        open={shipModal.open}
        onCancel={() => setShipModal({ open: false, order: null })}
        onOk={handleShip}
        confirmLoading={isShipping}
        okText="Ship Now"
      >
        <div className="space-y-4">
          <div>
            <Typography.Text strong>Select Delivery Method</Typography.Text>
            <Row gutter={12} className="mt-2">
              <Col span={12}>
                <Card
                  hoverable
                  className={`cursor-pointer text-center ${
                    selectedMethod === "steadfast" ? "border-blue-500 bg-blue-50" : ""
                  }`}
                  onClick={() => setSelectedMethod("steadfast")}
                  size="small"
                >
                  <Typography.Text strong>Steadfast</Typography.Text>
                  <br />
                  <Typography.Text type="secondary" className="text-xs">
                    2–3 business days
                  </Typography.Text>
                </Card>
              </Col>
              <Col span={12}>
                <Card
                  hoverable
                  className={`cursor-pointer text-center ${
                    selectedMethod === "pathao" ? "border-blue-500 bg-blue-50" : ""
                  }`}
                  onClick={() => setSelectedMethod("pathao")}
                  size="small"
                >
                  <Typography.Text strong>Pathao</Typography.Text>
                  <br />
                  <Typography.Text type="secondary" className="text-xs">
                    1–2 business days
                  </Typography.Text>
                </Card>
              </Col>
            </Row>
          </div>
          {shipModal.order && (
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Recipient">
                {shipModal.order.customer_name}
              </Descriptions.Item>
              <Descriptions.Item label="Phone">
                {shipModal.order.customer_phone}
              </Descriptions.Item>
              <Descriptions.Item label="Address">
                {shipModal.order.shipping_address}
              </Descriptions.Item>
              <Descriptions.Item label="Total">
                ৳{shipModal.order.total_price}
              </Descriptions.Item>
            </Descriptions>
          )}
        </div>
      </Modal>
    </>
  );
};

export default AffiliatedCustomerOrdersTable;
