import { useMemo, useState } from "react";
import {
  FilterOutlined,
  ReloadOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { Card, Col, Row, Space, Tag, Typography, Button } from "antd";
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
import useOrderColumns from "../utils/orderColumns";
import { useGetOrdersQuery } from "../api/orderEndPoints";
import { CommonSelect } from "../../../common/commonField/commonFeild";

const cardBaseClass =
  "rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] shadow-sm";
const headerCardClass =
  "rounded-2xl border border-[#cdeedb] bg-gradient-to-br from-white to-[#eefff7] shadow-sm";
const chipClass = "!rounded-full !border-0 !bg-[#e8f7ef] !text-[#1f6f45] !font-semibold";

const OrdersPage = () => {
  const { data: dashboardData } = useGetDashboardDataQuery({});
  const columns = useOrderColumns();

  const [filters, setFilters] = useState({
    search: "",
    payment_status: "",
    status: "",
  });
  const [searchKey, setSearchKey] = useState(0);

  const { page_size, page } = useAppSelector(FilterState);

  const {
    data: ordersData,
    isLoading,
    refetch,
    isFetching,
  } = useGetOrdersQuery({
    search: filters.search,
    payment_status: filters.payment_status || undefined,
    status: filters.status || undefined,
    page_size,
    page: Number(page) || undefined,
  });

  const viewPermission = GetPermission(
    dashboardData?.data?.permissions,
    moduleNames.student,
    actionNames.view
  );

  const orders = ordersData?.data?.results || [];
  const totalOrders = Number(ordersData?.data?.count || 0);

  const pendingOrders = useMemo(
    () =>
      orders.filter((item: any) => String(item?.status).toLowerCase() === "pending")
        .length,
    [orders]
  );

  const paidOrders = useMemo(
    () =>
      orders.filter(
        (item: any) => String(item?.payment_status).toLowerCase() === "paid"
      ).length,
    [orders]
  );

  const activeFilterCount = useMemo(
    () =>
      [
        filters.search.trim().length > 0,
        Boolean(filters.payment_status),
        Boolean(filters.status),
      ].filter(Boolean).length,
    [filters]
  );

  const handleResetFilters = () => {
    setFilters({
      search: "",
      payment_status: "",
      status: "",
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
              Orders
            </Typography.Title>
            <Typography.Text className="text-sm text-[var(--app-text-soft)]">
              Track order lifecycle, payment status, and fulfillment progress.
            </Typography.Text>
          </div>

          <Space wrap>
            <Tag className={chipClass}>Total {totalOrders}</Tag>
            <Tag className={chipClass}>Pending {pendingOrders}</Tag>
            <Tag className={chipClass}>Paid {paidOrders}</Tag>
          </Space>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-3">
        <Card className={`${cardBaseClass} h-full`}>
          <div className="space-y-1">
            <Typography.Text className="block text-xs text-[var(--app-text-soft)]">
              Total Orders
            </Typography.Text>
            <Typography.Text className="block text-2xl font-bold !text-[var(--app-text)] leading-tight">
              {totalOrders}
            </Typography.Text>
            <Typography.Text className="block text-xs text-[var(--app-text-soft)]">
              All order records
            </Typography.Text>
          </div>
        </Card>

        <Card className={`${cardBaseClass} h-full`}>
          <div className="space-y-1">
            <Typography.Text className="block text-xs text-[var(--app-text-soft)]">
              Visible Orders
            </Typography.Text>
            <Typography.Text className="block text-2xl font-bold !text-[var(--app-text)] leading-tight">
              {orders.length}
            </Typography.Text>
            <Typography.Text className="block text-xs text-[var(--app-text-soft)]">
              Current page results
            </Typography.Text>
          </div>
        </Card>

        <Card className={`${cardBaseClass} h-full`}>
          <div className="space-y-1">
            <Typography.Text className="block text-xs text-[var(--app-text-soft)]">
              Applied Filters
            </Typography.Text>
            <Typography.Text className="block text-2xl font-bold !text-[var(--app-text)] leading-tight">
              {activeFilterCount}
            </Typography.Text>
            <Typography.Text className="block text-xs text-[var(--app-text-soft)]">
              Search and status filters
            </Typography.Text>
          </div>
        </Card>
      </div>

      <Card className={cardBaseClass}>
        <div className="mb-3 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <Typography.Text className="text-sm text-[var(--app-text-soft)]">
            <FilterOutlined /> Filter orders by keyword, payment status, and order
            status
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
          <Col xs={24} md={8} lg={7}>
            <SearchComponent
              key={searchKey}
              onSearch={(value) =>
                setFilters((prev) => ({ ...prev, search: value }))
              }
              placeholder="Search orders"
            />
          </Col>

          <Col xs={24} md={8} lg={8}>
            <CommonSelect
              placeholder="Select Payment Status"
              options={[
                { name: "Pending", value: "pending" },
                { name: "Paid", value: "paid" },
                { name: "Failed", value: "failed" },
                { name: "Refunded", value: "refunded" },
              ].map((item) => ({ label: item.name, value: item.value }))}
              value={filters.payment_status || undefined}
              onChange={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  payment_status: value || "",
                }))
              }
              allowClear
              className="w-full"
            />
          </Col>

          <Col xs={24} md={8} lg={9}>
            <CommonSelect
              placeholder="Select Order Status"
              options={[
                { name: "Pending", value: "pending" },
                { name: "Processing", value: "processing" },
                { name: "Shipped", value: "shipped" },
                { name: "Delivered", value: "delivered" },
                { name: "Cancelled", value: "cancelled" },
              ].map((item) => ({ label: item.name, value: item.value }))}
              value={filters.status || undefined}
              onChange={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  status: value || "",
                }))
              }
              allowClear
              className="w-full"
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
                <ShoppingCartOutlined /> Orders List
              </Typography.Text>
              <Tag className={chipClass}>{totalOrders} Records</Tag>
            </div>
          }
        >
          <Table
            rowKey="id"
            loading={isLoading || isFetching}
            refetch={refetch}
            total={ordersData?.data?.count}
            dataSource={orders}
            columns={columns}
          />
        </Card>
      ) : (
        <NoPermissionData />
      )}
    </div>
  );
};

export default OrdersPage;
