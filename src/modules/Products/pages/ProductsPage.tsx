import { useMemo, useState } from "react";
import {
  AppstoreOutlined,
  FilterOutlined,
  PlusOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { Button, Card, Col, Row, Space, Tag, Typography } from "antd";
import { Link } from "react-router-dom";
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
import useProductColumns from "../utils/productColumns";
import {
  useGetBrandsQuery,
  useGetProductsQuery,
  useGetSubCategoriesQuery,
} from "../api/productEndPoints";
import { CommonSelect } from "../../../common/commonField/commonFeild";

const cardBaseClass =
  "rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] shadow-sm";
const headerCardClass =
  "rounded-2xl border border-[#cdeedb] bg-gradient-to-br from-white to-[#eefff7] shadow-sm";
const chipClass = "!rounded-full !border-0 !bg-[#e8f7ef] !text-[#1f6f45] !font-semibold";

const ProductsPage = () => {
  const { data: dashboardData } = useGetDashboardDataQuery({});
  const columns = useProductColumns();

  const [filters, setFilters] = useState({
    search: "",
    brand_or_company: undefined as number | undefined,
    subcategories: [] as number[],
  });
  const [searchKey, setSearchKey] = useState(0);

  const { page_size, page } = useAppSelector(FilterState);

  const {
    data: productsData,
    isLoading,
    refetch,
    isFetching,
  } = useGetProductsQuery({
    search: filters.search,
    brand_or_company: filters.brand_or_company || undefined,
    subcategories:
      filters.subcategories.length > 0
        ? filters.subcategories.join(",")
        : undefined,
    page_size,
    page: Number(page) || undefined,
  });

  const { data: brandData } = useGetBrandsQuery({});
  const { data: subCategoriesData } = useGetSubCategoriesQuery({});

  const viewPermission = GetPermission(
    dashboardData?.data?.permissions,
    moduleNames.student,
    actionNames.view
  );

  const createPermission = GetPermission(
    dashboardData?.data?.permissions,
    moduleNames.student,
    actionNames.add
  );

  const products = productsData?.data?.results || [];
  const totalProducts = Number(productsData?.data?.count || 0);
  const activeProducts = useMemo(
    () => products.filter((item: any) => item?.is_active === true).length,
    [products]
  );

  const activeFilterCount = useMemo(
    () =>
      [
        filters.search.trim().length > 0,
        Boolean(filters.brand_or_company),
        filters.subcategories.length > 0,
      ].filter(Boolean).length,
    [filters]
  );

  const handleResetFilters = () => {
    setFilters({
      search: "",
      brand_or_company: undefined,
      subcategories: [],
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
              Products
            </Typography.Title>
            <Typography.Text className="text-sm text-[var(--app-text-soft)]">
              Organize your catalog, monitor active items, and manage categories.
            </Typography.Text>
          </div>

          <Space wrap>
            <Tag className={chipClass}>Total {totalProducts}</Tag>
            <Tag className={chipClass}>Showing {products.length}</Tag>
            {!createPermission && (
              <Link to="/products/create">
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  className="!rounded-xl !bg-[#279e5a] !border-[#279e5a] hover:!bg-[#1f8a4e] hover:!border-[#1f8a4e]"
                >
                  Add Product
                </Button>
              </Link>
            )}
          </Space>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Card className={`${cardBaseClass} h-full`}>
          <div className="space-y-1">
            <Typography.Text className="block text-xs text-[var(--app-text-soft)]">
              Total Products
            </Typography.Text>
            <Typography.Text className="text-2xl font-bold !text-[var(--app-text)]">
              {totalProducts}
            </Typography.Text>
            <Typography.Text className="text-xs text-[var(--app-text-soft)]">
              All catalog records
            </Typography.Text>
          </div>
        </Card>

        <Card className={`${cardBaseClass} h-full`}>
          <div className="space-y-1">
            <Typography.Text className="block text-xs text-[var(--app-text-soft)]">
              Active in This Page
            </Typography.Text>
            <Typography.Text className="text-2xl font-bold !text-[var(--app-text)]">
              {activeProducts}
            </Typography.Text>
            <Typography.Text className="text-xs text-[var(--app-text-soft)]">
              Out of {products.length} visible items
            </Typography.Text>
          </div>
        </Card>

        <Card className={`${cardBaseClass} h-full`}>
          <div className="space-y-1">
            <Typography.Text className="block text-xs text-[var(--app-text-soft)]">
              Applied Filters
            </Typography.Text>
            <Typography.Text className="text-2xl font-bold !text-[var(--app-text)]">
              {activeFilterCount}
            </Typography.Text>
            <Typography.Text className="text-xs text-[var(--app-text-soft)]">
              Quick filter tracking
            </Typography.Text>
          </div>
        </Card>
      </div>

      <Card className={cardBaseClass}>
        <div className="mb-3 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <Typography.Text className="text-sm text-[var(--app-text-soft)]">
            <FilterOutlined /> Filter products by name, brand, and subcategory
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
              placeholder="Search products"
            />
          </Col>

          <Col xs={24} md={8} lg={7}>
            <CommonSelect
              placeholder="Select Brand"
              options={brandData?.data?.results?.map((item: any) => ({
                label: item?.name,
                value: item?.id,
              }))}
              value={filters.brand_or_company ?? undefined}
              onChange={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  brand_or_company: value ?? undefined,
                }))
              }
              allowClear
              className="w-full"
            />
          </Col>

          <Col xs={24} md={8} lg={10}>
            <CommonSelect
              placeholder="Select Sub Categories"
              options={subCategoriesData?.data?.results?.map((item: any) => ({
                label: item?.name,
                value: item?.id,
              }))}
              mode="multiple"
              value={filters.subcategories}
              onChange={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  subcategories: value || [],
                }))
              }
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
                <AppstoreOutlined /> Products List
              </Typography.Text>
              <Tag className={chipClass}>{totalProducts} Records</Tag>
            </div>
          }
        >
          <Table
            rowKey="id"
            loading={isLoading || isFetching}
            refetch={refetch}
            total={productsData?.data?.count}
            dataSource={products}
            columns={columns}
          />
        </Card>
      ) : (
        <NoPermissionData />
      )}
    </div>
  );
};

export default ProductsPage;
