import { useMemo, useState } from "react";
import {
  FilterOutlined,
  ReloadOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
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
import stockReservationColumns from "../utils/stockReservationColumns";
import { useGetStockReservationQuery } from "../api/stockReservationEndPoints";
import { IStockReservation } from "../types/stockReservation";

const cardBaseClass =
  "rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] shadow-sm";
const headerCardClass =
  "rounded-2xl border border-[#cdeedb] bg-gradient-to-br from-white to-[#eefff7] shadow-sm";
const chipClass = "!rounded-full !border-0 !bg-[#e8f7ef] !text-[#1f6f45] !font-semibold";

const StockReservationPage = () => {
  const { data: dashboardData } = useGetDashboardDataQuery({});
  const columns = stockReservationColumns();
  const [filters, setFilters] = useState({
    search: "",
  });
  const [searchKey, setSearchKey] = useState(0);
  const { page_size, page } = useAppSelector(FilterState);

  const {
    data: stockReservationData,
    isLoading,
    refetch,
    isFetching,
  } = useGetStockReservationQuery({
    search: filters.search,
    page_size,
    page: Number(page) || undefined,
  });

  const viewPermission = GetPermission(
    dashboardData?.data?.permissions,
    moduleNames.student,
    actionNames.view
  );

  const reservations = (stockReservationData?.data?.results || []) as
    | IStockReservation[]
    | [];
  const totalReservations = Number(stockReservationData?.data?.count || 0);

  const reservedCount = useMemo(
    () =>
      reservations.filter((item) => String(item?.status).toLowerCase() === "reserved")
        .length,
    [reservations]
  );

  const expiringSoonCount = useMemo(
    () =>
      reservations.filter((item) => {
        const expiresAt = dayjs(item?.expires_at);
        if (!expiresAt.isValid()) {
          return false;
        }

        const hoursDiff = expiresAt.diff(dayjs(), "hour");
        return hoursDiff >= 0 && hoursDiff <= 48;
      }).length,
    [reservations]
  );

  const totalReservedQty = useMemo(
    () =>
      reservations.reduce((sum, item) => sum + Number(item?.quantity || 0), 0),
    [reservations]
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
              Stock Reservation
            </Typography.Title>
            <Typography.Text className="text-sm text-[var(--app-text-soft)]">
              Keep reservation flow under control and avoid expiry leakage.
            </Typography.Text>
          </div>

          <Space wrap>
            <Tag className={chipClass}>Total {totalReservations}</Tag>
            <Tag className={chipClass}>Reserved {reservedCount}</Tag>
            <Tag className={chipClass}>Expiring Soon {expiringSoonCount}</Tag>
          </Space>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-3">
        <Card className={`${cardBaseClass} h-full`}>
          <div className="space-y-1">
            <Typography.Text className="block text-xs text-[var(--app-text-soft)]">
              Total Reservations
            </Typography.Text>
            <Typography.Text className="block text-2xl font-bold !text-[var(--app-text)] leading-tight">
              {totalReservations}
            </Typography.Text>
            <Typography.Text className="block text-xs text-[var(--app-text-soft)]">
              System reservation records
            </Typography.Text>
          </div>
        </Card>

        <Card className={`${cardBaseClass} h-full`}>
          <div className="space-y-1">
            <Typography.Text className="block text-xs text-[var(--app-text-soft)]">
              Reserved Quantity
            </Typography.Text>
            <Typography.Text className="block text-2xl font-bold !text-[var(--app-text)] leading-tight">
              {totalReservedQty}
            </Typography.Text>
            <Typography.Text className="block text-xs text-[var(--app-text-soft)]">
              Total locked units in this page
            </Typography.Text>
          </div>
        </Card>

        <Card className={`${cardBaseClass} h-full`}>
          <div className="space-y-1">
            <Typography.Text className="block text-xs text-[var(--app-text-soft)]">
              Expiring in 48 Hours
            </Typography.Text>
            <Typography.Text className="block text-2xl font-bold !text-[var(--app-text)] leading-tight">
              {expiringSoonCount}
            </Typography.Text>
            <Typography.Text className="block text-xs text-[var(--app-text-soft)]">
              Needs immediate attention
            </Typography.Text>
          </div>
        </Card>
      </div>

      <Card className={cardBaseClass}>
        <div className="mb-3 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <Typography.Text className="text-sm text-[var(--app-text-soft)]">
            <FilterOutlined /> Filter reservations by product, variant, order ref,
            or status
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
              placeholder="Search stock reservation"
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
                <ShoppingOutlined /> Reservation List
              </Typography.Text>
              <Tag className={chipClass}>{totalReservations} Records</Tag>
            </div>
          }
        >
          <Table
            rowKey="id"
            loading={isLoading || isFetching}
            refetch={refetch}
            total={stockReservationData?.data?.count}
            dataSource={reservations}
            columns={columns}
          />
        </Card>
      ) : (
        <NoPermissionData />
      )}
    </div>
  );
};

export default StockReservationPage;
