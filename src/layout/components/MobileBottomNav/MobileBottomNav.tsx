import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LiaProductHunt } from "react-icons/lia";
import { IoCartOutline, IoGridOutline } from "react-icons/io5";
import { TbFileInvoice } from "react-icons/tb";
import Iconify from "../../../common/IconifyConfig/IconifyConfig";

interface Props {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface MobileNavItem {
  key: string;
  label: string;
  icon: React.ReactNode;
  to?: string;
  onClick?: () => void;
  isActive: (path: string) => boolean;
}

const MobileBottomNav: React.FC<Props> = ({ setOpen }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const items: MobileNavItem[] = [
    {
      key: "dashboard",
      label: "Home",
      icon: <Iconify name="mage:dashboard" width={20} />,
      to: "/",
      isActive: (path) => path === "/",
    },
    {
      key: "products",
      label: "Products",
      icon: <LiaProductHunt size={20} />,
      to: "/products",
      isActive: (path) => path === "/products" || path.startsWith("/products/"),
    },
    {
      key: "orders",
      label: "Orders",
      icon: <IoCartOutline size={20} />,
      to: "/orders",
      isActive: (path) => path === "/orders" || path.startsWith("/orders/"),
    },
    {
      key: "invoices",
      label: "Invoices",
      icon: <TbFileInvoice size={20} />,
      to: "/invoices",
      isActive: (path) => path === "/invoices" || path.startsWith("/invoices/"),
    },
    {
      key: "more",
      label: "More",
      icon: <IoGridOutline size={20} />,
      onClick: () => setOpen(true),
      isActive: (path) =>
        path.startsWith("/money-receipt") ||
        path.startsWith("/stock-reservation") ||
        path.startsWith("/store-profile") ||
        path.startsWith("/earning-report") ||
        path.startsWith("/profile-setting") ||
        path.startsWith("/role-permission") ||
        path.startsWith("/account") ||
        path.startsWith("/profile"),
    },
  ];

  const onItemClick = (item: MobileNavItem): void => {
    if (item.to) {
      navigate(item.to);
      return;
    }

    item.onClick?.();
  };

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-[120] block px-2 pt-2 shadow-[0_-10px_24px_rgba(15,23,42,0.16)] backdrop-blur-md lg:hidden"
      style={{
        borderTop: "1px solid var(--app-border)",
        background: "color-mix(in srgb, var(--app-surface) 92%, transparent)",
        paddingBottom: "calc(env(safe-area-inset-bottom) + 8px)",
      }}
      aria-label="Mobile quick navigation"
    >
      <div className="mx-auto grid max-w-[560px] grid-cols-5 gap-1">
        {items.map((item) => {
          const isActive = item.isActive(pathname);

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onItemClick(item)}
              className={`flex min-h-[58px] flex-col items-center justify-center gap-1 rounded-2xl border px-1 text-[11px] font-semibold transition-all duration-200 ${
                isActive
                  ? "border-[#279e5a]/45 bg-[#279e5a]/14 text-[#1f7f49] shadow-[0_8px_16px_rgba(39,158,90,0.2)]"
                  : "border-transparent text-[var(--app-text-soft)] hover:border-[var(--app-border)] hover:bg-[var(--app-surface-soft)] hover:text-[var(--app-text)]"
              }`}
            >
              <span className="text-[20px] leading-none">{item.icon}</span>
              <span className="leading-none">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
