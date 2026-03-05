import { Card, Col, Input, Row, Typography, Button, Form, Alert } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useLoginMutation } from "../api/loginEndpoint";
import {
  clearMessage,
  loggedIn,
  setMessage,
} from "../../../app/features/authSlice";
import { openNotification } from "../../../app/features/notificationSlice";
import { RootState } from "../../../app/store";
import { schoolBag, mainLogo } from "../../../utilities/images";
import "../styles/Login.css";
import { LoginTypes } from "../types/authTypes";
import { TOKEN_NAME } from "../../../utilities/baseQuery";

const Login: React.FC = () => {
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
    <div className="min-h-screen bg-gradient-to-br from-[#f0f1f1] to-[#a9f8dc] relative">
      {/* Main content container */}
      <div className="flex flex-col min-h-screen">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-32 h-32 bg-[#8ce4c5] rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#84f0ca] rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#7ce6c1] rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        {/* Centered login card */}
        <div className="flex-grow flex justify-center items-center px-4 py-8 z-10">
          <Card className="shadow-2xl p-8 rounded-2xl bg-transparent backdrop-blur-sm border border-white/40 w-full max-w-4xl transition-all duration-300 hover:shadow-3xl">
            <Row gutter={[24, 24]} align="middle" justify="space-between">
              {/* Illustration Column */}
              <Col
                xs={0}
                sm={0}
                md={0}
                lg={12}
                xl={12}
                xxl={12}
                className="hidden lg:block"
              >
                <div className="relative h-full flex items-center justify-center p-4">
                  <img
                    src={schoolBag}
                    alt="Education illustration"
                    className="w-full max-w-md object-contain transition-transform duration-500 hover:scale-105"
                  />
                </div>
              </Col>

              {/* Login Form Column */}
              <Col
                xs={24}
                sm={24}
                md={24}
                lg={12}
                xl={12}
                xxl={12}
                className="px-4"
              >
                <div className="text-center">
                  <img
                    src={mainLogo}
                    alt="Logo"
                    className="w-40 mx-auto mb-2 transition-all duration-300 hover:scale-110"
                  />
                  <Typography.Title
                    level={3}
                    className="!mb-1 !font-semibold !text-gray-800"
                  >
                    Welcome Back
                  </Typography.Title>
                  <Typography.Text className="text-gray-500">
                    Login to access your dashboard
                  </Typography.Text>
                </div>

                <div className="mt-6">
                  <Form onFinish={onFinish} layout="vertical" size="large">
                    <Form.Item
                      name="username"
                      rules={[
                        {
                          required: true,
                          message: "Please input your username!",
                        },
                      ]}
                      className="!mb-5"
                    >
                      <Input
                        onFocus={handleOnFocus}
                        // prefix={<Iconify icon="ph:user" className="text-gray-400" />}
                        placeholder="Username"
                        className="!py-3 !rounded-lg hover:!border-[#58C59E] focus:!border-[#58C59E] focus:!shadow-blue-200"
                      />
                    </Form.Item>

                    <Form.Item
                      name="password"
                      rules={[
                        {
                          required: true,
                          message: "Please input your password!",
                        },
                      ]}
                      className="!mb-1"
                    >
                      <Input.Password
                        onFocus={handleOnFocus}
                        // prefix={<Iconify icon="ant-design:lock-outlined" className="text-gray-400" />}
                        placeholder="Password"
                        className="!py-3 !rounded-lg hover:!border-[#58C59E] focus:!border-[#58C59E] focus:!shadow-blue-200"
                      />
                    </Form.Item>
                    <br />
                    {/* <div className="flex justify-end items-center mb-6">
                      <Link to="/send-otp">
                        <Typography.Link className="!text-gray-600 hover:!text-[#58C59E]">
                          Forgot Password?
                        </Typography.Link>
                      </Link>
                    </div> */}

                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        block
                        loading={isLoading}
                        className="!h-12 !rounded-lg cursor-pointer !bg-gradient-to-r !from-[#58C59E] !to-[#308366] hover:!from-[#308366] hover:!to-[#58C59E] duration-300 hover:duration-300 !border-none !text-white !font-medium !shadow-lg hover:!shadow-[#58C59E]/30 transition-all "
                      >
                        {isLoading ? "Logging in..." : "Login"}
                      </Button>
                    </Form.Item>

                    {message && (
                      <Alert
                        message={message}
                        type="error"
                        showIcon
                        className="!mt-4 !rounded-lg"
                      />
                    )}
                  </Form>
                </div>
              </Col>
            </Row>
          </Card>
        </div>

        {/* Footer */}
        <div className="py-4 text-center z-10">
          <Typography.Text className="text-gray-600 text-sm">
            © {new Date().getFullYear()} Powered by{" "}
            <Typography.Link
              href="https://codecanvascreation.com"
              target="_blank"
              className="!text-[#58C59E]  "
            >
              Sobar Bazar
            </Typography.Link>
          </Typography.Text>
        </div>
      </div>
    </div>
  );
};

export default Login;
