import { useMemo, useState } from "react";
import {
  FileDoneOutlined,
  FilterOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { Button, Card, Col, Row, Space, Tag, Typography } from "antd";
import BreadCrumb from "../../../common/BreadCrumb/BreadCrumb";
import { SearchComponent } from "../../../common/CommonAnt/CommonSearch/CommonSearch";
import Table from "../../../common/CommonAnt/Table";
import { useAppSelector } from "../../../app/store";
import { FilterState } from "../../../app/features/filterSlice";
import { useGetDashboardDataQuery } from "../../Dashboard/api/dashoboardEndPoints";
import { GetPermission } from "../../../utilities/permission";
import {
  actionNames,
  moduleNames,
} from "../../../utilities/permissionConstant";
import NoPermissionData from "../../../utilities/NoPermissionData";
import { useGetMoneyReceiptsQuery } from "../api/moneyReceiptEndPoints";
import moneyReceiptColumns from "../utils/moenyReceiptColumns";
import { IReceiptData } from "../types/money-receiptType";

const cardBaseClass =
  "rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] shadow-sm";
const headerCardClass =
  "rounded-2xl border border-[#cdeedb] bg-gradient-to-br from-white to-[#eefff7] shadow-sm";
const chipClass = "!rounded-full !border-0 !bg-[#e8f7ef] !text-[#1f6f45] !font-semibold";

const formatCurrency = (value: number) =>
  `Tk ${value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const MoneyReceiptPage = () => {
  const { data: dashboardData } = useGetDashboardDataQuery({});
  const columns = moneyReceiptColumns();
  const [filters, setFilters] = useState({
    search: "",
  });
  const [searchKey, setSearchKey] = useState(0);
  const { page_size, page } = useAppSelector(FilterState);

  const {
    data: moneyReceiptsData,
    isLoading,
    refetch,
    isFetching,
  } = useGetMoneyReceiptsQuery({
    search: filters.search,
    page_size,
    page: Number(page) || undefined,
  });

  const viewPermission = GetPermission(
    dashboardData?.data?.permissions,
    moduleNames.student,
    actionNames.view
  );

  const receipts = (moneyReceiptsData?.data?.results || []) as IReceiptData[];
  const totalReceipts = Number(moneyReceiptsData?.data?.count || 0);

  const paidReceipts = useMemo(
    () =>
      receipts.filter(
        (item) => String(item?.payment_status).toLowerCase() === "paid"
      ).length,
    [receipts]
  );

  const pendingReceipts = useMemo(
    () =>
      receipts.filter(
        (item) => String(item?.payment_status).toLowerCase() === "pending"
      ).length,
    [receipts]
  );

  const collectedAmount = useMemo(
    () => receipts.reduce((sum, item) => sum + Number(item?.amount || 0), 0),
    [receipts]
  );

  const averageReceiptAmount =
    receipts.length > 0 ? collectedAmount / receipts.length : 0;

  const handleResetFilters = () => {
    setFilters({
      search: "",
    });
    setSearchKey((prev) => prev + 1);
  };

  return (
    <div className="space-y-4 pb-1">
      <div>
        <BreadCrumb />
      </div>

      <Card className={headerCardClass}>
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <Typography.Title level={4} className="!mb-1 !text-[var(--app-text)]">
              Money Receipts
            </Typography.Title>
            <Typography.Text className="text-sm text-[var(--app-text-soft)]">
              Monitor collections, payment status, and receipt performance.
            </Typography.Text>
          </div>

          <Space wrap>
            <Tag className={chipClass}>Total {totalReceipts}</Tag>
            <Tag className={chipClass}>Paid {paidReceipts}</Tag>
            <Tag className={chipClass}>Pending {pendingReceipts}</Tag>
          </Space>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-3">
        <Card className={`${cardBaseClass} h-full`}>
          <div className="space-y-1">
            <Typography.Text className="block text-xs text-[var(--app-text-soft)]">
              Total Receipts
            </Typography.Text>
            <Typography.Text className="block text-2xl font-bold !text-[var(--app-text)] leading-tight">
              {totalReceipts}
            </Typography.Text>
            <Typography.Text className="block text-xs text-[var(--app-text-soft)]">
              All receipt records
            </Typography.Text>
          </div>
        </Card>

        <Card className={`${cardBaseClass} h-full`}>
          <div className="space-y-1">
            <Typography.Text className="block text-xs text-[var(--app-text-soft)]">
              Visible Collection
            </Typography.Text>
            <Typography.Text className="block text-2xl font-bold !text-[var(--app-text)] leading-tight">
              {formatCurrency(collectedAmount)}
            </Typography.Text>
            <Typography.Text className="block text-xs text-[var(--app-text-soft)]">
              Total amount in this page
            </Typography.Text>
          </div>
        </Card>

        <Card className={`${cardBaseClass} h-full`}>
          <div className="space-y-1">
            <Typography.Text className="block text-xs text-[var(--app-text-soft)]">
              Average Receipt
            </Typography.Text>
            <Typography.Text className="block text-2xl font-bold !text-[var(--app-text)] leading-tight">
              {formatCurrency(averageReceiptAmount)}
            </Typography.Text>
            <Typography.Text className="block text-xs text-[var(--app-text-soft)]">
              Mean receipt value
            </Typography.Text>
          </div>
        </Card>
      </div>

      <Card className={cardBaseClass}>
        <div className="mb-3 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <Typography.Text className="text-sm text-[var(--app-text-soft)]">
            <FilterOutlined /> Filter receipts quickly by keyword
          </Typography.Text>
          <Space wrap>
            <Button
              icon={<ReloadOutlined />}
              onClick={() => refetch()}
              loading={isFetching}
            >
              Refresh
            </Button>
            <Button onClick={handleResetFilters}>Reset Filters</Button>
          </Space>
        </div>

        <Row gutter={[12, 12]} align="middle">
          <Col xs={24} md={10} lg={8}>
            <SearchComponent
              key={searchKey}
              onSearch={(value) =>
                setFilters((prev) => ({ ...prev, search: value }))
              }
              placeholder="Search money receipt"
            />
          </Col>
        </Row>
      </Card>

      {!viewPermission ? (
        <Card
          className={cardBaseClass}
          title={
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <Typography.Text className="!font-semibold">
                <FileDoneOutlined /> Receipt List
              </Typography.Text>
              <Tag className={chipClass}>{totalReceipts} Records</Tag>
            </div>
          }
        >
          <Table
            rowKey="id"
            loading={isLoading || isFetching}
            refetch={refetch}
            total={moneyReceiptsData?.data?.count}
            dataSource={receipts}
            columns={columns}
          />
        </Card>
      ) : (
        <NoPermissionData />
      )}
    </div>
  );
};

export default MoneyReceiptPage;
