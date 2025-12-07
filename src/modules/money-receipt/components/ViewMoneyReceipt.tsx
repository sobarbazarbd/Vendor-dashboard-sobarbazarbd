import { Card, Badge, Divider } from "antd";
import { useGetMoneyReceiptsQuery } from "../api/moneyReceiptEndPoints";

export default function ViewMoneyReceipt({ id }: { id: number }) {
  const { data: response, isLoading } = useGetMoneyReceiptsQuery<any>({ id });
  const receipt = response?.data;

  if (isLoading) {
    return (
      <div className="w-full flex justify-center py-20">
        <span className="text-lg font-medium">Loading...</span>
      </div>
    );
  }

  if (!receipt) {
    return (
      <div className="w-full text-center py-10 text-red-500 font-semibold">
        Receipt not found
      </div>
    );
  }

  return (
    <div className="flex justify-center bg-gray-100 min-h-screen p-5 md:p-10">
      <Card className="w-full max-w-3xl p-8 rounded-2xl shadow-lg">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-3xl font-bold">Money Receipt</h1>

          <Badge
            className="text-sm"
            color={
              receipt.payment_status === "paid"
                ? "green"
                : receipt.payment_status === "pending"
                ? "orange"
                : "red"
            }
            text={receipt.payment_status}
          />
        </div>

        <Divider />

        {/* Receipt Top Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-2 text-sm">
            <p>
              <span className="font-semibold">Receipt Number: </span>
              {receipt.receipt_number}
            </p>
            <p>
              <span className="font-semibold">Receipt Date: </span>
              {receipt.receipt_date}
            </p>
            <p>
              <span className="font-semibold">Invoice Number: </span>
              {receipt.invoice_number}
            </p>
            <p>
              <span className="font-semibold">Order Number: </span>
              {receipt.order_number}
            </p>
          </div>

          <div className="space-y-2 text-sm">
            <p>
              <span className="font-semibold">Payment Method: </span>
              {receipt.payment_method}
            </p>
            <p>
              <span className="font-semibold">Transaction ID: </span>
              {receipt.transaction_id}
            </p>
            <p>
              <span className="font-semibold">Created At: </span>
              {receipt.created_at}
            </p>
            <p>
              <span className="font-semibold">Updated At: </span>
              {receipt.updated_at || "N/A"}
            </p>
          </div>
        </div>

        <Divider />

        {/* Money Section */}
        <div className="bg-gray-50 border p-5 rounded-xl mb-6">
          <p className="text-lg font-semibold">Payment Summary</p>

          <div className="flex justify-between mt-3 text-base">
            <span className="font-medium">Amount:</span>
            <span className="font-bold text-green-600 text-xl">
              ${receipt.amount}
            </span>
          </div>
        </div>

        {/* Notes Section */}
        {receipt.notes && (
          <>
            <Divider />
            <h2 className="text-lg font-semibold mb-1">Notes</h2>
            <p className="text-gray-600">{receipt.notes}</p>
          </>
        )}
      </Card>
    </div>
  );
}
