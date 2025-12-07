/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from "react";
import { Card, Col, Row } from "antd";

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
import useProductColumns from "../utils/orderColumns";
import { useGetOrdersQuery } from "../api/orderEndPoints";
import { CommonSelect } from "../../../common/commonField/commonFeild";

const OrdersPage = () => {
  // const dispatch = useDispatch();
  const { data: dashboardData } = useGetDashboardDataQuery({});
  const columns = useProductColumns();
  const [filters, setFilters] = useState({
    search: "",
    is_active: "",
    payment_status: "",
    status: "",
  });
  const { page_size, page } = useAppSelector(FilterState);

  // Fetch students data with pagination
  const {
    data: ordersData,
    isLoading,
    refetch,
    isFetching,
  } = useGetOrdersQuery({
    search: filters.search,
    payment_status: filters.payment_status || undefined,
    status: filters.status || undefined,
    // current_session: filters.current_session,
    // current_shift: filters.current_shift,
    // is_active: filters.is_active,
    page_size: page_size,
    page: Number(page) || undefined,
  });

  console.log("ordersData", ordersData);

  const viewPermission = GetPermission(
    dashboardData?.data?.permissions,
    moduleNames.student,
    actionNames.view
  );
  // const createPermission = GetPermission(
  //   dashboardData?.data?.permissions,
  //   moduleNames.student,
  //   actionNames.add
  // );

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
          {/* Search Section */}
          <Col xs={24} sm={24} md={8} lg={6} xl={4}>
            <SearchComponent
              onSearch={(value) =>
                setFilters((prev) => ({ ...prev, search: value }))
              }
              placeholder="Search orders..."
            />
          </Col>
          <Col >
            <Row className="flex items-center justify-end gap-3">
              <Col>
                <CommonSelect
                  placeholder="Select Payment Status"
                  options={[
                    { name: "Pending", value: "pending" },
                    { name: "Paid", value: "paid" },
                    { name: "Failed", value: "failed" },
                    { name: "Refunded", value: "refunded" },
                  ].map((item) => ({ label: item.name, value: item.value }))}
                  value={filters.payment_status || undefined} // ✅ ensure undefined if empty
                  onChange={(value) =>
                    setFilters((prev) => ({
                      ...prev,
                      payment_status: value || undefined,
                    }))
                  }
                  allowClear
                  className="min-w-[200px]"
                />
              </Col>
              <Col>
                <CommonSelect
                  placeholder="Select Status"
                  options={[
                    { name: "Pending", value: "pending" },
                    { name: "Processing", value: "processing" },
                    { name: "Shipped", value: "shipped" },
                    { name: "Delivered", value: "delivered" },
                    { name: "Cancelled", value: "cancelled" },
                  ].map((item) => ({ label: item.name, value: item.value }))}
                  value={filters.status || undefined} // ✅ ensure undefined if empty
                  onChange={(value) =>
                    setFilters((prev) => ({
                      ...prev,
                      status: value || undefined,
                    }))
                  }
                  allowClear
                  className="min-w-[200px]"
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
                <span>All Orders</span>
              </div>
            </div>
          }
        >
          <Table
            rowKey={"id"}
            loading={isLoading || isFetching}
            refetch={refetch}
            total={ordersData?.data?.count}
            dataSource={ordersData?.data?.results}
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
