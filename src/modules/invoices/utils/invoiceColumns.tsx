import { ColumnsType } from "antd/es/table";
import { Tag, Space, Button } from "antd";
import dayjs from "dayjs";
import { showModal } from "../../../app/features/modalSlice";
import ViewInvoice from "../components/ViewInvoice";
import { useDispatch } from "react-redux";
import { FaEye } from "react-icons/fa";

const statusColors: Record<string, string> = {
  paid: "green",
  unpaid: "red",
  pending: "orange",
  overdue: "red",
  partial: "blue",
  cancelled: "gray",
};

const useInvoiceColumns = (): ColumnsType<any> => {
  const dispatch = useDispatch();

  return [
    {
      key: "0",
      title: "SL",
      align: "center",
      render: (_text, _record, index) => index + 1,
      sorter: (a, b) => a.id - b.id,
    },
    {
      key: "1",
      title: "Invoice Number",
      dataIndex: "invoice_number",
      align: "center",
      sorter: (a, b) => a.invoice_number.localeCompare(b.invoice_number),
    },
    {
      key: "2",
      title: "Order Number",
      dataIndex: "order_number",
      align: "center",
      sorter: (a, b) => a.order_number.localeCompare(b.order_number),
    },
    {
      key: "3",
      title: "Invoice Date",
      dataIndex: "invoice_date",
      align: "center",
      render: (date: string) => dayjs(date).format("DD MMM YYYY"),
      sorter: (a, b) =>
        dayjs(a.invoice_date).unix() - dayjs(b.invoice_date).unix(),
    },
    {
      key: "4",
      title: "Due Date",
      dataIndex: "due_date",
      align: "center",
      render: (date: string) => dayjs(date).format("DD MMM YYYY"),
      sorter: (a, b) => dayjs(a.due_date).unix() - dayjs(b.due_date).unix(),
    },
    {
      key: "5",
      title: "Total",
      dataIndex: "total",
      align: "center",
      render: (amount: number) => `$${amount.toFixed(2)}`,
      sorter: (a, b) => a.total - b.total,
    },
    {
      key: "6",
      title: "Amount Paid",
      dataIndex: "amount_paid",
      align: "center",
      render: (amount: number) => `$${amount.toFixed(2)}`,
      sorter: (a, b) => a.amount_paid - b.amount_paid,
    },
    {
      key: "7",
      title: "Balance",
      dataIndex: "balance",
      align: "center",
      render: (amount: number) => `$${amount.toFixed(2)}`,
      sorter: (a, b) => a.balance - b.balance,
    },
    {
      key: "8",
      title: "Status",
      dataIndex: "status",
      align: "center",
      render: (status: string) => {
        const color = statusColors[status.toLowerCase()] || "default";
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
      sorter: (a, b) => a.status.localeCompare(b.status),
      filters: [
        { text: "Paid", value: "paid" },
        { text: "Unpaid", value: "unpaid" },
        { text: "Pending", value: "pending" },
        { text: "Overdue", value: "overdue" },
        { text: "Partial", value: "partial" },
      ],
      onFilter: (value, record) => record.status.toLowerCase() === value,
    },
    {
      key: "9",
      title: "Days Remaining",
      align: "center",
      render: (record) => {
        const dueDate = dayjs(record.due_date);
        const today = dayjs();
        const days = dueDate.diff(today, "day");

        if (days < 0) {
          return <Tag color="red">OVERDUE {Math.abs(days)} days</Tag>;
        } else if (days === 0) {
          return <Tag color="orange">DUE TODAY</Tag>;
        } else {
          return <Tag color="green">{days} days</Tag>;
        }
      },
      sorter: (a, b) => {
        const daysA = dayjs(a.due_date).diff(dayjs(), "day");
        const daysB = dayjs(b.due_date).diff(dayjs(), "day");
        return daysA - daysB;
      },
    },
    {
      key: "10",
      title: "Payment Percentage",
      align: "center",
      render: (record) => {
        const percentage = (record.amount_paid / record.total) * 100;
        let color = "green";
        if (percentage < 100) color = "orange";
        if (percentage < 50) color = "red";
        if (percentage === 0) color = "gray";

        return <Tag color={color}>{percentage.toFixed(0)}%</Tag>;
      },
      sorter: (a, b) => {
        const percentA = (a.amount_paid / a.total) * 100;
        const percentB = (b.amount_paid / b.total) * 100;
        return percentA - percentB;
      },
    },
    {
      key: "11",
      title: "Created At",
      dataIndex: "created_at",
      align: "center",
      render: (date: string) => dayjs(date).format("DD MMM YYYY HH:mm"),
      sorter: (a, b) => dayjs(a.created_at).unix() - dayjs(b.created_at).unix(),
    },
    {
      key: "actions",
      title: "Actions",
      align: "center",
      fixed: "right",
      width: 120,
      render: (record) => (
        <Space>
          <Button
            onClick={() =>
              dispatch(
                showModal({
                  title: "Order",
                  content: <ViewInvoice id={record?.id} />,
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
        </Space>
      ),
    },
  ];
};

export default useInvoiceColumns;
