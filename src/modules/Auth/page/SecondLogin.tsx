import { Card, Col, Input, Row, Typography } from "antd";
import React from "react";
import { LoginTypes } from "../types/authTypes";
import "../styles/Login.css";
import Iconify from "../../../common/IconifyConfig/IconifyConfig";
import { Form } from "../../../common/CommonAnt";
import { useLoginMutation } from "../api/loginEndpoint";
import { useDispatch, useSelector } from "react-redux";
import {
  clearMessage,
  loggedIn,
  setMessage,
} from "../../../app/features/authSlice";
import { Link } from "react-router-dom";
import { TOKEN_NAME } from "../../../utilities/baseQuery";
import { openNotification } from "../../../app/features/notificationSlice";
// import { passwordValidator } from "../../../utilities/validator";
import { RootState } from "../../../app/store";

import { mainLogo, welcome } from "../../../utilities/images";
import { passwordValidator } from "../../../utilities/validator";

const SecondLogin: React.FC = () => {
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();

  const { message } = useSelector((state: RootState) => state.auth);

  const from: string = "/";

  const onFinish = async (values: LoginTypes): Promise<void> => {
    try {
      const response = await login({
        ...values,
      }).unwrap();
      const { success, data } = response as any;
      dispatch(
        openNotification({
          type: "success",
          message: "You have successfully logged in.",
        })
      );
      dispatch(loggedIn({ success, access: data?.access }));
      localStorage.setItem(
        TOKEN_NAME,
        JSON.stringify({ success, access: data?.access })
      );
      window.location.href = from;
    } catch (error: any) {
      const raw = error?.data?.message ?? error?.data?.detail;
      const errorRes =
        typeof raw === "string"
          ? raw
          : typeof raw === "object" && raw !== null
          ? JSON.stringify(raw)
          : "We're sorry, our system is currently unavailable.";
      dispatch(setMessage(errorRes));
    }
  };

  const handleOnFocus = (): void => {
    dispatch(clearMessage());
  };
  return (
    <React.Fragment>
      <Row>
        <Col span={24} lg={10} xs={24} className="bg-[#b8deff] h-screen">
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "80vh",
              textAlign: "center",
            }}
          >
            <div>
              <img
                src={mainLogo}
                alt="main mainLogo"
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />

              <Card className=" bg-[#b8deff] w-[500px]">
                <Typography.Title
                  level={3}
                  style={{ margin: 0, display: "block" }}
                >
                  Welcome To Education
                </Typography.Title>
                <br />
                <Typography.Text type="secondary" style={{ display: "block" }}>
                  Login to you account below.
                </Typography.Text>
                <br />
                <Form
                  onFinish={onFinish}
                  buttonLabel="Login"
                  isLoading={isLoading}
                  className="form-field-body"
                >
                  <Form.Item<LoginTypes>
                    name="username"
                    rules={[{ required: true }]}
                  >
                    <Input
                      onFocus={handleOnFocus}
                      prefix={<Iconify name="ph:user" />}
                      placeholder="e.g: username"
                    />
                  </Form.Item>

                  <Form.Item<LoginTypes>
                    name="password"
                    rules={[
                      { required: true },
                      { validator: passwordValidator },
                    ]}
                  >
                    <Input.Password
                      onFocus={handleOnFocus}
                      prefix={<Iconify name="ant-design:lock-outlined" />}
                      placeholder="********"
                    />
                  </Form.Item>
                </Form>

                <Link to="/send-otp">
                  <Typography.Link
                    style={{
                      display: "block",
                      textAlign: "right",
                      padding: "5px",
                    }}
                  >
                    Forgot Password?
                  </Typography.Link>
                </Link>
                <Typography.Text type="danger" style={{ display: "block" }}>
                  {message}
                </Typography.Text>
              </Card>
            </div>
          </div>
        </Col>
        <Col span={24} lg={14} xs={0}>
          <img
            src={welcome}
            alt="main mainLogo"
            style={{ width: "60%", height: "100%", objectFit: "contain" }}
            className="mx-auto"
          />
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default SecondLogin;
