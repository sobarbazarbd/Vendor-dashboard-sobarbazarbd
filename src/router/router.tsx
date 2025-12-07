import { createBrowserRouter } from "react-router-dom";
import DashboardLayout from "../layout/page/DashboardLayout";
import ErrorPage from "../common/ErrorPage/ErrorPage";
import Login from "../modules/Auth/page/Login";
import Dashboard from "../modules/Dashboard/page/Dashboard";
import Profile from "../modules/Profile/page/Profile";
import Accounts from "../modules/Accounts/pages/Accounts";
import BalanceStatus from "../modules/Accounts/components/BalanceStatus/BalanceStatus";
import ClientAccount from "../modules/Accounts/components/ClientAccount/ClientAccount";
import SendOTP from "../modules/Auth/components/SendOTP";
import MatchOTP from "../modules/Auth/components/MatchOTP";
import ForgotPassword from "../modules/Auth/components/ForgotPassword";
import SecondLogin from "../modules/Auth/page/SecondLogin";
import Verification from "../modules/Auth/components/Verification";
import PrivateRouter from "./PrivateRouter";
import RolePermissionPage from "../modules/settings/role & permission/page/RolePermissionPage";
import ViewRolePermission from "../modules/settings/role & permission/components/ViewRolePermission";

import WithPermission from "./withPermissionRouter";
import ProductsPage from "../modules/Products/pages/ProductsPage";
import CreateProduct from "../modules/Products/components/CreateProduct";
import UpdateProduct from "../modules/Products/components/UpdateProduct";
import ProductView from "../modules/Products/components/ProductView";
import OrdersPage from "../modules/Orders/pages/OrdersPage";
import EarningReportPage from "../modules/Earnings&Reports/pages/EarningReportPage";
import CreateEarningReport from "../modules/Earnings&Reports/components/CreateEarningReport";
import UpdateEarningReport from "../modules/Earnings&Reports/components/UpdateEarningReport";
import EarningReportView from "../modules/Earnings&Reports/components/EarningReportView";
import ProfileSettingPage from "../modules/Profile&Settings/pages/ProfileSettingPage";
import CreateProfileSetting from "../modules/Profile&Settings/components/CreateProfileSetting";
import UpdateProfileSetting from "../modules/Profile&Settings/components/UpdateProfileSetting";
import ProfileSettingView from "../modules/Profile&Settings/components/ProfileSettingView";
import InvoicesPage from "../modules/invoices/pages/InvoicesPage";
import MoneyReceiptPage from "../modules/money-receipt/pages/MoneyReceiptPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <PrivateRouter children={<DashboardLayout />} />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Dashboard />,
      },

      // products
      {
        path: "/products",
        element: (
          <Accounts />
          // <WithPermission requiredPermission="products">
          //   <Accounts />
          // </WithPermission>
        ),
        children: [
          {
            path: "/products",
            element: <ProductsPage />,
          },
          {
            path: "create",
            element: <CreateProduct />,
          },
          {
            path: "update/:productId",
            element: <UpdateProduct />,
          },
          {
            path: "product-view/:productId",
            element: <ProductView />,
          },
        ],
      },

      // orders
      {
        path: "/orders",
        element: <Accounts />,
        children: [
          {
            path: "/orders",
            element: <OrdersPage />,
          },
        ],
      },
      // invoices
      {
        path: "/invoices",
        element: <Accounts />,
        children: [
          {
            path: "/invoices",
            element: <InvoicesPage />,
          },
        ],
      },
      // Money-receipt
      {
        path: "/money-receipt",
        element: <Accounts />,
        children: [
          {
            path: "/money-receipt",
            element: <MoneyReceiptPage />,
          },
        ],
      },

      // earning-report
      {
        path: "/earning-report",
        element: (
          <WithPermission requiredPermission="orders">
            <Accounts />
          </WithPermission>
        ),
        children: [
          {
            path: "/earning-report",
            element: <EarningReportPage />,
          },
          {
            path: "create",
            element: <CreateEarningReport />,
          },
          {
            path: "update/:orderId",
            element: <UpdateEarningReport />,
          },
          {
            path: "product-view/:productId",
            element: <EarningReportView />,
          },
        ],
      },

      // profile-setting
      {
        path: "/profile-setting",
        element: (
          <WithPermission requiredPermission="orders">
            <Accounts />
          </WithPermission>
        ),
        children: [
          {
            path: "/profile-setting",
            element: <ProfileSettingPage />,
          },
          {
            path: "create",
            element: <CreateProfileSetting />,
          },
          {
            path: "update/:orderId",
            element: <UpdateProfileSetting />,
          },
          {
            path: "product-view/:productId",
            element: <ProfileSettingView />,
          },
        ],
      },

      // Role & permissions
      {
        path: "/role-permission",
        element: (
          <WithPermission requiredPermission="role">
            <Accounts />
          </WithPermission>
        ),
        children: [
          {
            path: "",
            element: <RolePermissionPage />,
          },
          {
            path: ":roleId",
            element: <ViewRolePermission />,
          },
        ],
      },

      {
        path: "/account",
        element: <Accounts />,
        children: [
          {
            path: "balance-status",
            element: <BalanceStatus />,
          },

          {
            path: "client-account",
            element: <ClientAccount />,
          },
        ],
      },
      // _______________________________________________________________________________________________________________
      // new for education

      {
        path: "profile",
        element: <Profile />,
      },
    ],
  },
  {
    path: "/login-second",
    element: <SecondLogin />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/verification",
    element: <Verification />,
  },
  {
    path: "/send-otp",
    element: <SendOTP />,
  },
  {
    path: "/match-otp",
    element: <MatchOTP />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
]);

export default router;
