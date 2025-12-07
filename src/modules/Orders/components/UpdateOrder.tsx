import { Col, Row, Form as AntForm, Typography, Select } from "antd";
import { useEffect } from "react";
import { Form } from "../../../common/CommonAnt";
import {
  useGetSingleOrderQuery,
  useUpdateOrderMutation,
} from "../api/orderEndPoints";

const { Title } = Typography;
const { Option } = Select;

const UpdateOrder = ({ id }: { id: number }) => {
  const [form] = AntForm.useForm();

  console.log("id", id);

  // Fetch single order
  const { data: singleOrder, isLoading: isFetching } = useGetSingleOrderQuery(
    Number(id)
  );
  console.log("singleOrder", singleOrder);

  // Update order mutation
  const [updateOrder, { isLoading: isUpdating }] = useUpdateOrderMutation();

  // Set initial form values when order is fetched
  useEffect(() => {
    if (singleOrder?.data) {
      form.setFieldsValue({
        status: singleOrder?.data?.status,
      });
    }
  }, [singleOrder, form]);

  // Handle form submit
  const onFinish = (values: any) => {
    updateOrder({ id: Number(id), data: values });
  };

  return (
    <div className="update-order-form">
      <div className="form-header">
        <Title level={3}>Update Order Status</Title>
      </div>

      <Form
        form={form}
        onFinish={onFinish}
        isLoading={isUpdating || isFetching}
      >
        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            <AntForm.Item
              label="Order Status"
              name="status"
              rules={[{ required: true, message: "Please select a status" }]}
            >
              <Select placeholder="Select Order Status">
                <Option value="pending">Pending</Option>
                <Option value="processing">Processing</Option>
                <Option value="shipped">Shipped</Option>
                <Option value="delivered">Delivered</Option>
                <Option value="cancelled">Cancelled</Option>
              </Select>
            </AntForm.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default UpdateOrder;
