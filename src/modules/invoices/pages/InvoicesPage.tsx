import { useMemo, useState } from "react";
import {
  FileTextOutlined,
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
import { useGetInvoicesQuery } from "../api/invoiceEndPoints";
import useInvoiceColumns from "../utils/invoiceColumns";
import { IInvoiceData } from "../types/invoiceType";

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

const InvoicesPage = () => {
  const { data: dashboardData } = useGetDashboardDataQuery({});
  const columns = useInvoiceColumns();
  const [filters, setFilters] = useState({
    search: "",
  });
  const [searchKey, setSearchKey] = useState(0);
  const { page_size, page } = useAppSelector(FilterState);

  const {
    data: invoicesData,
    isLoading,
    refetch,
    isFetching,
  } = useGetInvoicesQuery({
    search: filters.search,
    page_size,
    page: Number(page) || undefined,
  });

  const viewPermission = GetPermission(
    dashboardData?.data?.permissions,
    moduleNames.student,
    actionNames.view
  );

  const invoices = (invoicesData?.data?.results || []) as IInvoiceData[];
  const totalInvoices = Number(invoicesData?.data?.count || 0);

  const paidInvoices = useMemo(
    () =>
      invoices.filter((item) => String(item?.status).toLowerCase() === "paid")
        .length,
    [invoices]
  );

  const overdueInvoices = useMemo(
    () =>
      invoices.filter((item) => String(item?.status).toLowerCase() === "overdue")
        .length,
    [invoices]
  );

  const totalAmount = useMemo(
    () => invoices.reduce((sum, item) => sum + Number(item?.total || 0), 0),
    [invoices]
  );

  const totalReceived = useMemo(
    () => invoices.reduce((sum, item) => sum + Number(item?.amount_paid || 0), 0),
    [invoices]
  );

  const totalDue = useMemo(
    () => invoices.reduce((sum, item) => sum + Number(item?.balance || 0), 0),
    [invoices]
  );

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
              Invoices
            </Typography.Title>
            <Typography.Text className="text-sm text-[var(--app-text-soft)]">
              Follow due balances and monitor invoice payment progress.
            </Typography.Text>
          </div>

          <Space wrap>
            <Tag className={chipClass}>Total {totalInvoices}</Tag>
            <Tag className={chipClass}>Paid {paidInvoices}</Tag>
            <Tag className={chipClass}>Overdue {overdueInvoices}</Tag>
          </Space>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-3">
        <Card className={`${cardBaseClass} h-full`}>
          <div className="space-y-1">
            <Typography.Text className="block text-xs text-[var(--app-text-soft)]">
              Total Billed
            </Typography.Text>
            <Typography.Text className="block text-2xl font-bold !text-[var(--app-text)] leading-tight">
              {formatCurrency(totalAmount)}
            </Typography.Text>
            <Typography.Text className="block text-xs text-[var(--app-text-soft)]">
              Sum of visible invoices
            </Typography.Text>
          </div>
        </Card>

        <Card className={`${cardBaseClass} h-full`}>
          <div className="space-y-1">
            <Typography.Text className="block text-xs text-[var(--app-text-soft)]">
              Total Received
            </Typography.Text>
            <Typography.Text className="block text-2xl font-bold !text-[var(--app-text)] leading-tight">
              {formatCurrency(totalReceived)}
            </Typography.Text>
            <Typography.Text className="block text-xs text-[var(--app-text-soft)]">
              Amount paid so far
            </Typography.Text>
          </div>
        </Card>

        <Card className={`${cardBaseClass} h-full`}>
          <div className="space-y-1">
            <Typography.Text className="block text-xs text-[var(--app-text-soft)]">
              Outstanding Due
            </Typography.Text>
            <Typography.Text className="block text-2xl font-bold !text-[var(--app-text)] leading-tight">
              {formatCurrency(totalDue)}
            </Typography.Text>
            <Typography.Text className="block text-xs text-[var(--app-text-soft)]">
              Pending invoice balance
            </Typography.Text>
          </div>
        </Card>
      </div>

      <Card className={cardBaseClass}>
        <div className="mb-3 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <Typography.Text className="text-sm text-[var(--app-text-soft)]">
            <FilterOutlined /> Filter invoices by invoice number, order number,
            or amount
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
              placeholder="Search invoice"
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
                <FileTextOutlined /> Invoice List
              </Typography.Text>
              <Tag className={chipClass}>{totalInvoices} Records</Tag>
            </div>
          }
        >
          <Table
            rowKey="id"
            loading={isLoading || isFetching}
            refetch={refetch}
            total={invoicesData?.data?.count}
            dataSource={invoices}
            columns={columns}
          />
        </Card>
      ) : (
        <NoPermissionData />
      )}
    </div>
  );
};

export default InvoicesPage;
