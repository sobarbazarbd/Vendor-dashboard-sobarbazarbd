import { ColumnsType } from "antd/es/table";
import { Tag, Space } from "antd";
import dayjs from "dayjs";
import { useDispatch } from "react-redux";
import UpdateOrder from "../components/UpdateOrder";
import { showModal } from "../../../app/features/modalSlice";
import EditButton from "../../../common/CommonAnt/Button/EditButton";

const statusColors: Record<string, string> = {
  pending: "orange",
  delivered: "green",
  cancelled: "red",
};

const paymentColors: Record<string, string> = {
  paid: "green",
  unpaid: "red",
  pending: "orange",
};

const useOrderColumns = (): ColumnsType<any> => {
  const dispatch = useDispatch();

  return [
    {
      key: "0",
      title: "SL",
      align: "center",
      render: (_text, _record, index) => index + 1,
      sorter: (a, b) => a.id - b.id, // simple numeric sort
    },
    {
      key: "1",
      title: "Order Number",
      dataIndex: "order_number",
      align: "center",
      sorter: (a, b) => a.order_number.localeCompare(b.order_number),
    },
    {
      key: "2",
      title: "Status",
      dataIndex: "status",
      align: "center",
      render: (status: string) => {
        const color = statusColors[status.toLowerCase()] || "default";
        return <Tag color={color}>{status}</Tag>;
      },
      sorter: (a, b) => a.status.localeCompare(b.status),
    },
    {
      key: "3",
      title: "Payment Status",
      dataIndex: "payment_status",
      align: "center",
      render: (status: string) => {
        const color = paymentColors[status.toLowerCase()] || "default";
        return <Tag color={color}>{status}</Tag>;
      },
      sorter: (a, b) => a.payment_status.localeCompare(b.payment_status),
    },
    {
      key: "4",
      title: "Order Date",
      dataIndex: "order_date",
      align: "center",
      render: (date: string) => dayjs(date).format("DD MMM YYYY"),
      sorter: (a, b) => dayjs(a.order_date).unix() - dayjs(b.order_date).unix(),
    },
    {
      key: "5",
      title: "Total Amount",
      dataIndex: "total_amount",
      align: "center",
      render: (amount: number) => `Tk ${amount.toFixed(2)}`,
      sorter: (a, b) => a.total_amount - b.total_amount,
    },
    {
      key: "6",
      title: "Item Count",
      dataIndex: "item_count",
      align: "center",
      sorter: (a, b) => a.item_count - b.item_count,
    },
    {
      key: "7",
      title: "Subtotal",
      dataIndex: "subtotal",
      align: "center",
      render: (amount: number) => `Tk ${amount.toFixed(2)}`,
      sorter: (a, b) => a.subtotal - b.subtotal,
    },
    {
      key: "8",
      title: "Discount",
      dataIndex: "discount",
      align: "center",
      render: (amount: number) => `Tk ${amount.toFixed(2)}`,
      sorter: (a, b) => a.discount - b.discount,
    },
    {
      key: "9",
      title: "Net Subtotal",
      dataIndex: "net_subtotal",
      align: "center",
      render: (amount: number) => `Tk ${amount.toFixed(2)}`,
      sorter: (a, b) => a.net_subtotal - b.net_subtotal,
    },
    {
      key: "10",
      title: "Tax",
      dataIndex: "tax",
      align: "center",
      render: (amount: number) => `Tk ${amount.toFixed(2)}`,
      sorter: (a, b) => a.tax - b.tax,
    },
    {
      key: "11",
      title: "Shipping Cost",
      dataIndex: "shipping_cost",
      align: "center",
      render: (amount: number) => `Tk ${amount.toFixed(2)}`,
      sorter: (a, b) => a.shipping_cost - b.shipping_cost,
    },
    {
      key: "12",
      title: "Notes",
      dataIndex: "notes",
      align: "center",
      render: (notes: string) => notes || "-",
    },
    {
      key: "13",
      title: "Created At",
      dataIndex: "created_at",
      align: "center",
      render: (date: string) => dayjs(date).format("DD MMM YYYY"),
      sorter: (a, b) => dayjs(a.created_at).unix() - dayjs(b.created_at).unix(),
    },
    {
      key: "14",
      title: "Updated At",
      dataIndex: "updated_at",
      align: "center",
      render: (date: string) => dayjs(date).format("DD MMM YYYY"),
      sorter: (a, b) => dayjs(a.updated_at).unix() - dayjs(b.updated_at).unix(),
    },
    {
      key: "actions",
      title: "Actions",
      align: "center",
      render: (record) => (
        <Space>
          <EditButton
            onClick={() =>
              dispatch(
                showModal({
                  title: "Update Order",
                  content: <UpdateOrder id={record?.id} />,
                })
              )
            }
          />
        </Space>
      ),
    },
  ];
};

export default useOrderColumns;
