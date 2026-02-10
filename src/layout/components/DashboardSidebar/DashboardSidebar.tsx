import { Layout } from "antd";
import React from "react";
import MenuData from "./MenuData";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";
import { ThemesTypes } from "../../../app/features/themeSlice";

const DashboardSidebar: React.FC = () => {
  const { themes, color1, darkColor } = useSelector<RootState, ThemesTypes>(
    (state) => state.themes
  );

  return (
    <Layout.Sider
      id="dashboard-sidebar"
      width={272}
      style={{
        background: themes === "light" ? color1 : darkColor,
      }}
    >
      <MenuData />
    </Layout.Sider>
  );
};

export default DashboardSidebar;
