import { ColumnsType } from "antd/es/table";
import { Tag, Space, Button } from "antd";
import dayjs from "dayjs";

import { useDispatch } from "react-redux";
import { showModal } from "../../../app/features/modalSlice";
import ViewMoneyReceipt from "../components/ViewMoneyReceipt";
import { FaEye } from "react-icons/fa";

const paymentStatusColors: Record<string, string> = {
  paid: "green",
  unpaid: "red",
  pending: "orange",
  completed: "blue",
  failed: "gray",
  refunded: "purple",
};

const paymentMethodColors: Record<string, string> = {
  cash: "green",
  card: "blue",
  bank_transfer: "purple",
  check: "orange",
  online: "cyan",
  mobile: "geekblue",
};

// Define type for money receipt
interface MoneyReceipt {
  id: number;
  receipt_number: string;
  receipt_date: string;
  invoice_number: string;
  payment_method: string;
  amount: number;
  payment_status: string;
  created_at: string;
}

const moneyReceiptColumns = (): ColumnsType<MoneyReceipt> => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const dispatch = useDispatch();

  return [
    {
      key: "0",
      title: "SL",
      align: "center",
      width: 70,
      render: (_text, _record, index) => index + 1,
    },
    {
      key: "1",
      title: "Receipt Number",
      dataIndex: "receipt_number",
      align: "center",
      sorter: (a, b) => a.receipt_number.localeCompare(b.receipt_number),
      render: (receiptNumber: string) => (
        <Tag color="blue" style={{ fontWeight: "bold" }}>
          {receiptNumber}
        </Tag>
      ),
    },
    {
      key: "2",
      title: "Invoice Number",
      dataIndex: "invoice_number",
      align: "center",
      sorter: (a, b) => a.invoice_number.localeCompare(b.invoice_number),
      render: (invoiceNumber: string) => (
        <Tag color="purple">{invoiceNumber}</Tag>
      ),
    },
    {
      key: "3",
      title: "Receipt Date",
      dataIndex: "receipt_date",
      align: "center",
      render: (date: string) => dayjs(date).format("DD MMM YYYY"),
      sorter: (a, b) =>
        dayjs(a.receipt_date).unix() - dayjs(b.receipt_date).unix(),
    },
    {
      key: "4",
      title: "Payment Method",
      dataIndex: "payment_method",
      align: "center",
      render: (method: string) => {
        const color = paymentMethodColors[method.toLowerCase()] || "default";
        return (
          <Tag color={color} style={{ textTransform: "capitalize" }}>
            {method.replace("_", " ").toUpperCase()}
          </Tag>
        );
      },
      filters: [
        { text: "Cash", value: "cash" },
        { text: "Card", value: "card" },
        { text: "Bank Transfer", value: "bank_transfer" },
        { text: "Check", value: "check" },
        { text: "Online", value: "online" },
        { text: "Mobile", value: "mobile" },
      ],
      onFilter: (value, record) => record.payment_method === value,
    },
    {
      key: "5",
      title: "Amount",
      dataIndex: "amount",
      align: "center",
      render: (amount: number) => (
        <span style={{ fontWeight: "bold", color: "#1890ff" }}>
          Tk{" "}
          {amount.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
      ),
      sorter: (a, b) => a.amount - b.amount,
    },
    {
      key: "6",
      title: "Payment Status",
      dataIndex: "payment_status",
      align: "center",
      render: (status: string) => {
        const color = paymentStatusColors[status.toLowerCase()] || "default";
        return (
          <Tag color={color} style={{ fontWeight: "500" }}>
            {status.toUpperCase()}
          </Tag>
        );
      },
      filters: [
        { text: "Paid", value: "paid" },
        { text: "Pending", value: "pending" },
        { text: "Completed", value: "completed" },
        { text: "Failed", value: "failed" },
        { text: "Refunded", value: "refunded" },
      ],
      onFilter: (value, record) => record.payment_status === value,
      sorter: (a, b) => a.payment_status.localeCompare(b.payment_status),
    },
    {
      key: "7",
      title: "Created At",
      dataIndex: "created_at",
      align: "center",
      render: (date: string) => (
        <div>
          <div>{dayjs(date).format("DD MMM YYYY")}</div>
          <div style={{ fontSize: "12px", color: "#999" }}>
            {dayjs(date).format("HH:mm")}
          </div>
        </div>
      ),
      sorter: (a, b) => dayjs(a.created_at).unix() - dayjs(b.created_at).unix(),
    },
    {
      key: "8",
      title: "Days Since Receipt",
      align: "center",
      render: (record) => {
        const receiptDate = dayjs(record.receipt_date);
        const today = dayjs();
        const days = today.diff(receiptDate, "day");

        if (days === 0) {
          return <Tag color="green">TODAY</Tag>;
        } else if (days === 1) {
          return <Tag color="green">YESTERDAY</Tag>;
        } else {
          return <Tag color="blue">{days} days ago</Tag>;
        }
      },
      sorter: (a, b) => {
        const daysA = dayjs().diff(dayjs(a.receipt_date), "day");
        const daysB = dayjs().diff(dayjs(b.receipt_date), "day");
        return daysA - daysB;
      },
    },
    {
      key: "actions",
      title: "Actions",
      align: "center",
      fixed: "right",
      width: 150,
      render: (record) => (
        <Space>
          <Button
            onClick={() =>
              dispatch(
                showModal({
                  title: "Money Receipt",
                  content: <ViewMoneyReceipt id={record?.id} />,
                })
              )
            }
            title="View"
            size="small"
            type="default"
            style={{
              color: "#3892E3",
              // background: "#3892E3",
              border: "1px solid #3892E3",
            }}
          >
            <FaEye />
          </Button>
          {/* <Button
            type="default"
            size="small"
            onClick={() => {
              dispatch(
                showModal({
                  title: `Receipt #${record.receipt_number}`,
                  content: <ReceiptDetailModal receipt={record} />,
                  width: 600,
                })
              );
            }}
            title="View Receipt Details"
          >
            Details
          </Button> */}
        </Space>
      ),
    },
  ];
};

export default moneyReceiptColumns;
