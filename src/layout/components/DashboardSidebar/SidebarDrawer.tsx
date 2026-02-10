import React from "react";
import { Drawer } from "antd";
import MenuData from "./MenuData";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";
import { ThemesTypes } from "../../../app/features/themeSlice";

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SidebarDrawer: React.FC<Props> = ({ open, setOpen }) => {
  const { themes, color1, color2 } = useSelector<RootState, ThemesTypes>(
    (state) => state.themes
  );

  return (
    <Drawer
      onClose={() => setOpen(false)}
      open={open}
      placement="left"
      footer={null}
      closable={false}
      width={272}
      className="sidebar-drawer"
      style={{
        background: themes === "light" ? color1 : color2,
      }}
    >
      <MenuData />
    </Drawer>
  );
};

export default SidebarDrawer;
