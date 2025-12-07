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
import { useGetMoneyReceiptsQuery } from "../api/moneyReceiptEndPoints";
import moneyReceiptColumns from "../utils/moenyReceiptColumns";

const MoneyReceiptPage = () => {
  // const dispatch = useDispatch();
  const { data: dashboardData } = useGetDashboardDataQuery({});
  const columns = moneyReceiptColumns();
  const [filters, setFilters] = useState({
    search: "",
  });
  const { page_size, page } = useAppSelector(FilterState);

  const {
    data: moneyReceiptsData,
    isLoading,
    refetch,
    isFetching,
  } = useGetMoneyReceiptsQuery<any>({
    search: filters.search,
    page_size: page_size,
    page: Number(page) || undefined,
  });

  const viewPermission = GetPermission(
    dashboardData?.data?.permissions,
    moduleNames.student,
    actionNames.view
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
          {/* Search Section */}
          <Col xs={24} sm={24} md={8} lg={6} xl={4}>
            <SearchComponent
              onSearch={(value) =>
                setFilters((prev) => ({ ...prev, search: value }))
              }
              placeholder="Search Money Receipt..."
            />
          </Col>
        </Row>
      </Card>
      {!viewPermission ? (
        <Card
          title={
            <div className="flex justify-between items-center">
              <div className="space-x-5">
                <span>All Money Receipts</span>
              </div>
            </div>
          }
        >
          <Table
            rowKey={"id"}
            loading={isLoading || isFetching}
            refetch={refetch}
            total={moneyReceiptsData?.data?.count}
            dataSource={moneyReceiptsData?.data?.results}
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
