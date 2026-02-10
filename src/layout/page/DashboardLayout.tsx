import { Layout } from "antd";
import React, { useState } from "react";
import "../styles/DashboardLayout.css";
import DashboardSidebar from "../components/DashboardSidebar/DashboardSidebar";
import { Outlet, useLocation } from "react-router-dom";
import DashboardHeader from "../components/DashboardHeader/DashboardHeader";
import SidebarDrawer from "../components/DashboardSidebar/SidebarDrawer";
import MobileBottomNav from "../components/MobileBottomNav/MobileBottomNav";

const { Content } = Layout;

const DashboardLayout: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const location = useLocation();

  return (
    <React.Fragment>
      <Layout className="dashboard-main-layout">
        <DashboardSidebar />

        <Layout id="contain-layout">
          <DashboardHeader setOpen={setOpen} />
          <Content className="dashboard-content-wrapper">
            <div className="dashboard-content">
              <div key={location.pathname} className="dashboard-route-view">
                <Outlet />
              </div>
              <div className="h-24 lg:hidden" aria-hidden="true" />
            </div>
          </Content>

          {/* <DashboardFooter /> */}
        </Layout>
      </Layout>
      <SidebarDrawer open={open} setOpen={setOpen} />
      <MobileBottomNav setOpen={setOpen} />
    </React.Fragment>
  );
};

export default DashboardLayout;
