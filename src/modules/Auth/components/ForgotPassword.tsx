import React from "react";
import "../styles/forgot-password.css";
import { forgot_password_image } from "../../../utilities/images";
import { Button, Card, Col, Input, Row, Typography } from "antd";
import { Form } from "../../../common/CommonAnt";
import { ForgotPasswordTypes } from "../types/authTypes";
import { passwordValidator } from "../../../utilities/validator";
import Iconify from "../../../common/IconifyConfig/IconifyConfig";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../app/store";
import { clearMessage, loggedIn } from "../../../app/features/authSlice";
import { useChangePasswordMutation } from "../api/loginEndpoint";

type ForgotPasswordFormValues = ForgotPasswordTypes & {
  voterIdCard: string;
  nidVerification: string;
  tinVerification: string;
  binVerification: string;
  tradeLicense: string;
};

const ForgotPassword: React.FC = () => {
  const [changePassword, { isLoading }] = useChangePasswordMutation();
  const { message } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  if (token) {
    dispatch(loggedIn({ success: true, access: token }));
  }

  console.log("pppp", token);

  const onFinish = async (values: ForgotPasswordFormValues) => {
    const result = await changePassword({
      newPassword: values.newPassword,
      confirmNewPassword: values.confirmNewPassword,
    });

    if (values.newPassword === values.confirmNewPassword) {
      result;
    }

    if (result?.data?.success) {
      navigate("/login");
    }
  };

  const handleOnFocus = (): void => {
    dispatch(clearMessage());
  };

  return (
    <React.Fragment>
      <div className="forgot-password-container">
        <Card className="forgot-password-form">
          <Row
            justify="space-around"
            align="middle"
            className="forgot-password-body"
          >
            <Col span={24} md={12} className="forgot-password-left-side">
              {/* <img
                src={logo}
                alt="main logo"
                style={{ width: "50%", height: "100%", objectFit: "contain" }}
              /> */}
              <Typography.Text className="forgot-password-title">
                New Password
              </Typography.Text>
              <Typography.Text type="secondary" style={{ display: "block" }}>
                Your <strong>New Password</strong> must be different from
                previous used password.
              </Typography.Text>

              <br />
              <br />

              <Form
                onFinish={onFinish}
                buttonLabel="Reset Password"
                isLoading={isLoading}
              >
                <Typography.Text
                  style={{ display: "block", fontWeight: 600, marginBottom: "6px" }}
                >
                  KYC Verification
                </Typography.Text>
                <Typography.Text
                  type="secondary"
                  style={{ display: "block", marginBottom: "14px" }}
                >
                  Fill the details below to complete account verification.
                </Typography.Text>

                <Row gutter={[12, 0]}>
                  <Col xs={24} sm={12}>
                    <Form.Item<ForgotPasswordFormValues>
                      label="Voter ID Card"
                      name="voterIdCard"
                      rules={[{ required: true, message: "Please enter Voter ID Card" }]}
                    >
                      <Input
                        onFocus={handleOnFocus}
                        prefix={<Iconify name="mdi:card-account-details-outline" />}
                        placeholder="Enter voter ID card number"
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12}>
                    <Form.Item<ForgotPasswordFormValues>
                      label="NID Verification"
                      name="nidVerification"
                      rules={[{ required: true, message: "Please enter NID number" }]}
                    >
                      <Input
                        onFocus={handleOnFocus}
                        prefix={<Iconify name="mdi:identifier" />}
                        placeholder="Enter NID number"
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12}>
                    <Form.Item<ForgotPasswordFormValues>
                      label="TIN Verification"
                      name="tinVerification"
                      rules={[{ required: true, message: "Please enter TIN number" }]}
                    >
                      <Input
                        onFocus={handleOnFocus}
                        prefix={<Iconify name="mdi:file-certificate-outline" />}
                        placeholder="Enter TIN number"
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12}>
                    <Form.Item<ForgotPasswordFormValues>
                      label="BIN Verification"
                      name="binVerification"
                      rules={[{ required: true, message: "Please enter BIN number" }]}
                    >
                      <Input
                        onFocus={handleOnFocus}
                        prefix={<Iconify name="mdi:barcode-scan" />}
                        placeholder="Enter BIN number"
                      />
                    </Form.Item>
                  </Col>

                  <Col span={24}>
                    <Form.Item<ForgotPasswordFormValues>
                      label="Trade License"
                      name="tradeLicense"
                      rules={[{ required: true, message: "Please enter Trade License" }]}
                    >
                      <Input
                        onFocus={handleOnFocus}
                        prefix={<Iconify name="mdi:briefcase-outline" />}
                        placeholder="Enter trade license number"
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item<ForgotPasswordFormValues>
                  label="New Password"
                  name="newPassword"
                  rules={[{ required: true }, { validator: passwordValidator }]}
                >
                  <Input.Password
                    onFocus={handleOnFocus}
                    prefix={<Iconify name="ant-design:lock-outlined" />}
                    placeholder="********"
                  />
                </Form.Item>
                <Form.Item<ForgotPasswordFormValues>
                  label="Confirm Password"
                  name="confirmNewPassword"
                  rules={[{ required: true }, { validator: passwordValidator }]}
                >
                  <Input.Password
                    onFocus={handleOnFocus}
                    prefix={<Iconify name="ant-design:lock-outlined" />}
                    placeholder="********"
                  />
                </Form.Item>
              </Form>

              <Typography.Text type="danger" style={{ display: "block" }}>
                {message}
              </Typography.Text>
              <Button
                type="link"
                icon={<Iconify name="carbon:return" />}
                onClick={() => navigate("/match-otp")}
              >
                Go Back
              </Button>
            </Col>
            <Col span={24} md={12} className="forgot-password-right-side">
              <img
                src={forgot_password_image}
                alt=""
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </Col>
          </Row>
        </Card>
      </div>
    </React.Fragment>
  );
};

export default ForgotPassword;
