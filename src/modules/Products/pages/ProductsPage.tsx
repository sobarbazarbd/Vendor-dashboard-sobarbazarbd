/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from "react";
import { Button, Card, Col, Row } from "antd";
import { Link } from "react-router-dom";
import BreadCrumb from "../../../common/BreadCrumb/BreadCrumb";
import { SearchComponent } from "../../../common/CommonAnt/CommonSearch/CommonSearch";
import Table from "../../../common/CommonAnt/Table";
import { useAppSelector } from "../../../app/store";
import { PlusOutlined } from "@ant-design/icons";
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

const ProductsPage = () => {
  // const dispatch = useDispatch();
  const { data: dashboardData } = useGetDashboardDataQuery({});
  const columns = useProductColumns();
  const [filters, setFilters] = useState({
    search: "",
    is_active: "",
    brand_or_company: undefined,
    subcategories: [], // multiple select → must be an array
  });

  const { page_size, page } = useAppSelector(FilterState);

  // Fetch students data with pagination
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

    is_active: filters.is_active || undefined,
    page_size: page_size,
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

  return (
    <div className="space-y-5">
      <div className="my-5">
        <BreadCrumb />
      </div>

      <Card
        bodyStyle={{
          padding: "16px",
          borderRadius: "8px",
          boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
        }}
      >
        <Row gutter={[16, 16]} align="middle" justify="space-between">
          <Col className="-mt-5">
            {!createPermission && (
              <Link to={"/products/create"}>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  className="w-full"
                >
                  Add Product
                </Button>
              </Link>
            )}
          </Col>

          {/* Search Section */}
          <Col xs={24} sm={24} md={8} lg={18} xl={18}>
            <Row gutter={12}>
              <Col className="-mt-5">
                <SearchComponent
                  onSearch={(value) =>
                    setFilters((prev) => ({ ...prev, search: value }))
                  }
                  placeholder="Search Products..."
                />
              </Col>

              <Col>
                <CommonSelect
                  placeholder="Select Brand"
                  options={brandData?.data?.results?.map((item: any) => ({
                    label: item?.name,
                    value: item?.id,
                  }))}
                  /* 🚀 FIXED */
                  value={filters.brand_or_company ?? undefined}
                  onChange={(value) =>
                    setFilters((prev) => ({
                      ...prev,
                      brand_or_company: value ?? undefined,
                    }))
                  }
                  allowClear // 👉 Add this (optional)
                  className="min-w-[200px]"
                />
              </Col>

              <Col>
                <CommonSelect
                  placeholder="Select Sub Categories"
                  options={subCategoriesData?.data?.results?.map(
                    (item: any) => ({
                      label: item?.name,
                      value: item?.id,
                    })
                  )}
                  mode="multiple"
                  value={filters.subcategories}
                  onChange={(value) =>
                    setFilters((prev) => ({ ...prev, subcategories: value }))
                  }
                  className="min-w-[200px] inline-block"
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>
      {!viewPermission ? (
        <Card
          title={
            <div className="flex justify-between items-center">
              <div className="space-x-5">
                <span>All Products</span>
              </div>
            </div>
          }
        >
          <Table
            rowKey={"id"}
            loading={isLoading || isFetching}
            refetch={refetch}
            total={productsData?.data?.count}
            dataSource={productsData?.data?.results}
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
