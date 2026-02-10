import { Image, Typography } from "antd";

import { mainLogo } from "../../../utilities/images";
import React from "react";
import { useGetDashboardDataQuery } from "../../../modules/Dashboard/api/dashoboardEndPoints";

const SidebarTop: React.FC = () => {
  const { data: dashboardData } = useGetDashboardDataQuery({});
  const institutionName =
    dashboardData?.data?.institution?.name || "Sobar Bazar Vendor";

  // const [time, setTime] = useState(moment().format("LTS"));

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setTime(moment().format("LTS"));
  //   }, 1000);

  //   return () => clearInterval(interval); // cleanup interval on component unmount
  // }, []);

  return (
    <React.Fragment>
      <div className="sidebar-top-style overflow-hidden">
        {/* <h1 style={{ fontSize: "24px", fontFamily: "Arial" }}>{time .}</h1> */}

        <Image
          src={dashboardData?.data?.institution?.logo || mainLogo}
          preview={false}
          width={50}
          height={50}
          className="sidebar-brand-logo object-fit-contain"
        />
        <div>
          <Typography.Text className="sidebar-brand-name">
            {institutionName}
          </Typography.Text>
          <Typography.Text className="sidebar-brand-subtitle">
            Vendor Dashboard
          </Typography.Text>
        </div>
      </div>
    </React.Fragment>
  );
};

export default SidebarTop;
