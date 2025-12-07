import { Menu, MenuProps } from "antd";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import Iconify from "../../../common/IconifyConfig/IconifyConfig";
import SidebarTop from "./SidebarTop";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";
import { ThemesTypes } from "../../../app/features/themeSlice";
import SidebarButtom from "./SidebarButtom";

import { useGetDashboardDataQuery } from "../../../modules/Dashboard/api/dashoboardEndPoints";
import { hasPermissionForModule } from "../../../utilities/permission";
import { ItemType, MenuItemType } from "antd/es/menu/interface";
import { LiaProductHunt } from "react-icons/lia";
import { IoCartOutline } from "react-icons/io5";
import { HiOutlineDocumentReport } from "react-icons/hi";

const MenuData: React.FC = () => {
  const { themes } = useSelector<RootState, ThemesTypes>(
    (state) => state.themes
  );
  const { pathname } = useLocation();
  const { data: dashboardData } = useGetDashboardDataQuery({});

  const permissions = dashboardData?.data?.permissions || [];

  const iconStyle: React.CSSProperties | undefined = {
    marginRight: "8px",
    color: themes === "light" ? "#000000" : "#FFFFFF",
  };

  // const settings = [
  //   hasPermissionForModule(permissions, "routine") && {
  //     key: "/routine",
  //     label: <Link to="/routine">Routine</Link>,
  //     icon: <IoCalendarOutline />,
  //   },
  //   hasPermissionForModule(permissions, "institution") && {
  //     key: "/institute-profile",
  //     label: <Link to="/institute-profile">Institute Profile</Link>,
  //     icon: <BiSolidInstitution />,
  //   },

  //   hasPermissionForModule(permissions, "role") && {
  //     key: "/role-permission",
  //     label: <Link to="/role-permission">Role & Permissions</Link>,
  //     icon: <IoAccessibilityOutline />,
  //   },
  //   hasPermissionForModule(permissions, "noticeboard") && {
  //     key: "/notice",
  //     label: <Link to="/notice">Notice</Link>,
  //     icon: <TfiAnnouncement />,
  //   },
  //   hasPermissionForModule(permissions, "noticeboard") && {
  //     key: "/holiday",
  //     label: <Link to="/holiday">Holiday / Events</Link>,
  //     icon: <MdOutlineHolidayVillage />,
  //   },
  //   hasPermissionForModule(permissions, "rulesandregulations") && {
  //     key: "/rules",
  //     label: <Link to="/rules">Rules & Regulation</Link>,
  //     icon: <BsFillFileRuledFill />,
  //   },
  //   hasPermissionForModule(permissions, "smsconfig") && {
  //     key: "/sms",
  //     label: <Link to="/sms">SMS Configuration</Link>,
  //     icon: <FaCommentSms />,
  //   },
  //   hasPermissionForModule(permissions, "smsconfig") && {
  //     key: "/ticket",
  //     label: <Link to="/ticket">Ticket</Link>,
  //     icon: <IoTicketOutline />,
  //   },
  //   // hasPermissionForModule(permissions, "smsconfig") && {
  //   //   key: "/message",
  //   //   label: <Link to="/message">Message</Link>,
  //   //   icon: <FaCommentSms />,
  //   // },
  // ].filter(Boolean);

  const product = [
    {
      key: "/products",
      label: <Link to="/products">Products</Link>,
      icon: <LiaProductHunt />,
    },
    // hasPermissionForModule(permissions, "student") && {
    //   key: "/products",
    //   label: <Link to="/products">Products</Link>,
    //   icon: <LiaProductHunt />,
    // },
    {
      key: "/orders",
      label: <Link to="/orders">Orders</Link>,
      icon: <IoCartOutline />,
    },
    {
      key: "/money-receipt",
      label: <Link to="/money-receipt">Money Receipt</Link>,
      icon: <IoCartOutline />,
    },

    {
      key: "/invoices",
      label: <Link to="/invoices">Invoices</Link>,
      icon: <IoCartOutline />,
    },
    hasPermissionForModule(permissions, "student") && {
      key: "/earning-report",
      label: <Link to="/earning-report">Earning / Report</Link>,
      icon: <HiOutlineDocumentReport />,
    },
    hasPermissionForModule(permissions, "student") && {
      key: "/profile-setting",
      label: <Link to="/profile-setting">Profile Setting</Link>,
      icon: <HiOutlineDocumentReport />,
    },
  ].filter(Boolean);

  const items: MenuProps["items"] = [
    {
      key: "/",
      label: <Link to="/">Dashboard</Link>,
      icon: <Iconify name="mage:dashboard" style={iconStyle} />,
    },
  ];

  return (
    <div className="dashboard-sidebar-style">
      <div>
        <SidebarTop />
        <span className="features-title text-blue-500">Main Menu</span>
        <div>
          <Menu
            style={{
              backgroundColor: "transparent",
            }}
            mode="inline"
            theme={themes}
            selectedKeys={[pathname]}
            items={items}
          />
        </div>

        <div>
          <Menu
            style={{
              backgroundColor: "transparent",
            }}
            mode="inline"
            theme={themes}
            selectedKeys={[pathname]}
            items={product.filter(Boolean) as ItemType<MenuItemType>[]}
          />
        </div>
      </div>

      <br />
      <br />

      <SidebarButtom />
    </div>
  );
};

export default MenuData;
