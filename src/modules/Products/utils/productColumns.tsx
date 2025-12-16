import { Space, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import ViewButton from "../../../common/CommonAnt/Button/ViewButton";

import { useNavigate } from "react-router-dom";
import { useGetDashboardDataQuery } from "../../Dashboard/api/dashoboardEndPoints";
import { GetPermission } from "../../../utilities/permission";
import {
  actionNames,
  moduleNames,
} from "../../../utilities/permissionConstant";
import DeleteButton from "../../../common/CommonAnt/Button/DeleteButton";
import EditButton from "../../../common/CommonAnt/Button/EditButton";
import { useDeleteProductMutation } from "../api/productEndPoints";

const useProductColumns = (): ColumnsType<any> => {
  // const dispatch = useDispatch();
  const navigate = useNavigate();

  const { data: dashboardData } = useGetDashboardDataQuery({});
  const [deleteCartItem] = useDeleteProductMutation();

  const updatePermission = GetPermission(
    dashboardData?.data?.permissions,
    moduleNames.student,
    actionNames.change
  );
  const deletePermission = GetPermission(
    dashboardData?.data?.permissions,
    moduleNames.student,
    actionNames.delete
  );

  const handleDelete = async (id: any) => {
    try {
      await deleteCartItem({ id }).unwrap();
    } catch (error) {
      console.error("Failed to delete item:", error);
    }
  };

  return [
    {
      key: "0",
      title: "SL",
      align: "center",
      width: 50,
      render: (_text, _record, index) => index + 1,
    },

    // ✅ NEW IMAGE COLUMN
    {
      key: "image",
      title: "Image",
      align: "center",
      width: 90,
      render: (_, record) => {
        const img = record?.images?.[0]?.image;

        return img ? (
          <img
            src={img}
            alt="product"
            style={{
              width: 45,
              height: 45,
              objectFit: "cover",
              borderRadius: 6,
              border: "1px solid #eee",
              cursor: "pointer",
            }}
            onClick={() => window.open(img, "_blank")}
          />
        ) : (
          <span>-</span>
        );
      },
    },

    {
      key: "1",
      title: "Full Name",
      dataIndex: "name",
      align: "left",
      width: 230,
      render: (_, record) => record?.name,
    },

    {
      key: "2",
      title: "SKU",
      dataIndex: "sku",
      align: "center",
      width: 120,
    },

    {
      key: "3",
      title: "Variant",
      dataIndex: "default_variant",
      align: "center",
      render: (v) => (v ? v?.name : "-"),
    },

    {
      key: "4",
      title: "Price",
      dataIndex: "default_variant",
      align: "center",
      render: (v) => (v ? v?.price : "-"),
    },

    {
      key: "5",
      title: "Stock",
      dataIndex: "default_variant",
      align: "center",
      render: (v) => (v ? v?.stock : "-"),
    },

    {
      key: "6",
      title: "Active",
      dataIndex: "is_active",
      align: "center",
      width: 100,
      render: (is_active) =>
        is_active ? (
          <Tag color="green">Active</Tag>
        ) : (
          <Tag color="red">Inactive</Tag>
        ),
    },

    {
      title: "Actions",
      align: "center",
      render: (record) => (
        <Space>
          {!updatePermission && (
            <EditButton
              onClick={() => navigate(`/products/update/${record.id}`)}
            />
          )}

          <ViewButton to={`product-view/${record?.id}`} />

          {deletePermission && (
            <DeleteButton onConfirm={() => handleDelete(record.id)} />
          )}
        </Space>
      ),
    },
  ];
};

export default useProductColumns;
