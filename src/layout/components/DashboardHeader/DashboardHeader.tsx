import {
  Avatar,
  Badge,
  Button,
  Flex,
  Image,
  Input,
  Layout,
  Popover,
  Space,
  Tooltip,
  Typography,
} from "antd";
import React from "react";
import Iconify from "../../../common/IconifyConfig/IconifyConfig";
import { useDispatch, useSelector } from "react-redux";
import { loggedOut } from "../../../app/features/authSlice";
import { TOKEN_NAME } from "../../../utilities/baseQuery";
import { Link, useNavigate } from "react-router-dom";
import { greeting } from "../../../utilities/helper";
import { RootState } from "../../../app/store";
import { toggleThemes } from "../../../app/features/themeSlice";
import { avatar } from "../../../utilities/images";
import { useGetProfileQuery } from "../../../modules/Profile/api/profileEndpoint";

interface Props {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const DashboardHeader: React.FC<Props> = ({ setOpen }) => {
  const { themes } = useSelector((state: RootState) => state.themes);
  const { data } = useGetProfileQuery();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const username = data?.data?.username || "Vendor";
  const userInitial = username.charAt(0).toUpperCase();

  const handleLogout = (): void => {
    dispatch(loggedOut());
    localStorage.removeItem(TOKEN_NAME);
    navigate("/login");
  };

  return (
    <React.Fragment>
      <Layout.Header id="dashboard-header">
        <div className="dashboard-header-left">
          <Button
            onClick={() => setOpen(true)}
            type="default"
            size="large"
            icon={<Iconify name="pepicons-pop:menu" />}
            id="dashboard-header-icon"
            className="dashboard-action-btn"
          />

          <div className="dashboard-header-title">
            <Typography.Text className="dashboard-header-hello">
              Hello, {username}
            </Typography.Text>
            <Typography.Text className="dashboard-header-subtitle">
              {greeting()} - keep your store performance in check
            </Typography.Text>
          </div>
        </div>

        <Input
          placeholder="Search products, orders, invoices"
          prefix={<Iconify name="iconamoon:search-light" />}
          className="search-section"
          style={{ width: 310 }}
          allowClear
        />

        <Flex className="dashboard-header-actions">
          <Badge count={0} showZero={false}>
            <Popover
              content={
                <Typography.Text type="secondary">
                  No new notifications.
                </Typography.Text>
              }
              trigger="click"
              placement="bottomRight"
            >
              <Button
                type="default"
                shape="circle"
                icon={<Iconify name="ant-design:bell-outlined" />}
                className="dashboard-action-btn"
              />
            </Popover>
          </Badge>

          <Tooltip
            title={themes === "light" ? "Dark Mode" : "Light Mode"}
            placement="bottomRight"
          >
            <Button
              type="default"
              shape="circle"
              onClick={() => dispatch(toggleThemes())}
              icon={
                <Iconify
                  name={
                    themes === "light"
                      ? "material-symbols:light-mode"
                      : "material-symbols-light:dark-mode-outline"
                  }
                />
              }
              className="dashboard-action-btn"
            />
          </Tooltip>

          <Popover
            content={
              <Space direction="vertical" className="dashboard-user-popover">
                <Image
                  src={avatar}
                  alt="Profile picture"
                  preview={false}
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: "100%",
                    pointerEvents: "none",
                    objectFit: "cover",
                  }}
                />
                <Typography.Text strong>{username}</Typography.Text>
                <Typography.Text type="secondary" style={{ fontSize: "12px" }}>
                  Account settings and session controls
                </Typography.Text>
                <div className="dashboard-user-popover-actions">
                  <Link to="/profile">
                    <Button type="link" icon={<Iconify name="uil:user" />}>
                      Profile
                    </Button>
                  </Link>

                  <Button
                    type="link"
                    danger
                    icon={<Iconify name="hugeicons:logout-05" />}
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </div>
              </Space>
            }
            trigger="click"
            placement="bottomRight"
          >
            <Button
              type="default"
              shape="circle"
              className="dashboard-action-btn"
              icon={<Avatar size={26}>{userInitial}</Avatar>}
            />
          </Popover>
        </Flex>
      </Layout.Header>
    </React.Fragment>
  );
};

export default DashboardHeader;
