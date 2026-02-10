import { Button, Typography } from "antd";
import React from "react";
import Iconify from "../../../common/IconifyConfig/IconifyConfig";

const SidebarButtom: React.FC = () => {
  return (
    <React.Fragment>
      <div className="need-support-style">
        <div className="support-icon-shell">
          <Iconify name="fluent:person-support-28-regular" width={24} />
        </div>

        <Typography.Text className="support-title">Need Support?</Typography.Text>
        <Typography.Text className="support-text">
          Contact our support team for setup or account help.
        </Typography.Text>

        <div className="support-contact-lines">
          <Typography.Text>support@codecanvascreation.com</Typography.Text>
          <Typography.Text>+8809617391391</Typography.Text>
        </div>

        <div className="support-actions">
          <Button
            type="primary"
            size="small"
            icon={<Iconify name="ic:round-email" />}
            href="mailto:support@codecanvascreation.com"
          >
            Email
          </Button>

          <Button
            size="small"
            icon={<Iconify name="fluent:call-20-filled" />}
            href="tel:+8809617391391"
          >
            Call
          </Button>
        </div>
      </div>
    </React.Fragment>
  );
};

export default SidebarButtom;
