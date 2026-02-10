import React from "react";
import "./App.css";
import { RouterProvider } from "react-router-dom";
import router from "./router/router";
import { ConfigProvider, FloatButton, theme } from "antd";
import Notification from "./common/Notification/Notification";
import { useSelector } from "react-redux";
import { persistor, RootState } from "./app/store";
import { Modal } from "./common/CommonAnt";
import { PersistGate } from "redux-persist/integration/react";
import "react-calendar/dist/Calendar.css";

const App: React.FC = () => {
  const { themes, primaryColor } = useSelector(
    (state: RootState) => state.themes
  );

  React.useEffect(() => {
    document.documentElement.setAttribute("data-theme", themes);
  }, [themes]);

  return (
    <React.Fragment>
      <ConfigProvider
        theme={{
          algorithm:
            themes === "light" ? theme.defaultAlgorithm : theme.darkAlgorithm,
          token: {
            fontFamily:
              '"Fustat", "Hind Siliguri", "Segoe UI", "Helvetica Neue", sans-serif',
            colorPrimary: primaryColor,
            borderRadius: 10,
            borderRadiusLG: 14,
            borderRadiusSM: 8,
            wireframe: false,
          },
        }}
      >
        <PersistGate loading={null} persistor={persistor}>
          <RouterProvider router={router} />
          <Notification />
          <Modal />
          <FloatButton.BackTop />
        </PersistGate>
      </ConfigProvider>
    </React.Fragment>
  );
};

export default App;
