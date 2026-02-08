"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { IoBagHandleOutline } from "react-icons/io5";
import { LuReceiptText, LuUserCog } from "react-icons/lu";
import { TbLayoutDashboard, TbUsers } from "react-icons/tb";
import { CiSettings } from "react-icons/ci";
import { FiUsers } from "react-icons/fi";

const sidebarConfig = {
  header: {
    title: "BMS",
  },
  sections: [
    {
      items: [
        {
          id: "dashboard",
          href: "#",
          icon: <TbLayoutDashboard size={20} />,
          menu: {
            title: "Dashboard",
            items: [
              { label: "Overview", href: "/dashboard" },
              { label: "Analytics", href: "/dashboard/analytics" },
              { label: "Reports", href: "/dashboard/reports" },
            ],
          },
        },
        {
          id: "invoices",
          href: "#",
          icon: <LuReceiptText size={20} />,
          menu: {
            title: "Invoices",
            items: [
              { label: "All invoices", href: "/dashboard/invoices" },
              { label: "Create invoice", href: "/dashboard/invoices/new" },
              { label: "Recurring", href: "/dashboard/invoices/recurring" },
            ],
          },
        },
        {
          id: "orders",
          href: "#",
          icon: <IoBagHandleOutline size={20} />,
          menu: {
            title: "Orders",
            items: [
              { label: "All orders", href: "/dashboard/orders" },
              { label: "Returns", href: "/dashboard/orders/returns" },
              { label: "Shipments", href: "/dashboard/orders/shipments" },
            ],
          },
        },
        {
          id: "accounts",
          href: "#",
          icon: <LuUserCog size={20} />,
          menu: {
            title: "Accounts",
            items: [
              { label: "Users", href: "/dashboard/accounts/users" },
              { label: "Roles", href: "/dashboard/accounts/roles" },
              { label: "Permissions", href: "/dashboard/accounts/permissions" },
            ],
          },
        },
      ],
    },
  ],
  footer: [
    {
      items: [
        {
          id: "teams",
          href: "#",
          icon: <FiUsers size={20} />,
          menu: {
            title: "Teams",
            items: [
              { label: "Team members", href: "/dashboard/teams" },
              { label: "Invitations", href: "/dashboard/teams/invitations" },
              { label: "Access", href: "/dashboard/teams/access" },
            ],
          },
        },
        {
          id: "settings",
          href: "#",
          icon: <CiSettings size={20} />,
          menu: {
            title: "Settings",
            items: [
              { label: "Outlets", href: "/dashboard/outlet" },
              { label: "Users", href: "/dashboard/settings/users" },
              { label: "Departments", href: "/dashboard/settings/departments" },
            ],
          },
        },
      ],
    },
  ],
};

export default function Sidebar() {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const allItems = useMemo(
    () => [
      ...sidebarConfig.sections.flatMap((section) => section.items),
      ...sidebarConfig.footer.flatMap((section) => section.items),
    ],
    []
  );

  const activeMenu = allItems.find((item) => item.id === activeMenuId)?.menu;
  const handleMenuToggle = (id: string) => {
    setActiveMenuId((current) => (current === id ? null : id));
  };

  return (
    <div className="sidebarWrapper">
      <aside className="sidebar" aria-label="Primary">
        <div className="header">
          <h2 className="title">{sidebarConfig.header.title}</h2>
        </div>

        <nav className="nav">
          {sidebarConfig.sections.map((section) => (
            <div key={section.items[0].id}>
              {section.items.map((item) => (
                <button
                  key={item.id}
                  className={
                    activeMenuId === item.id ? "link active" : "link"
                  }
                  type="button"
                  aria-pressed={activeMenuId === item.id}
                  onClick={() => handleMenuToggle(item.id)}
                >
                  {item.icon}
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div className="footer">
          {sidebarConfig.footer[0].items.map((item) => (
            <button
              key={item.id}
              className={activeMenuId === item.id ? "link active" : "link"}
              type="button"
              aria-pressed={activeMenuId === item.id}
              onClick={() => handleMenuToggle(item.id)}
            >
              {item.icon}
            </button>
          ))}
        </div>
      </aside>

      <div className={activeMenu ? "drawer open" : "drawer"}>
        <div className="drawerHeader">
          <span className="drawerTitle">{activeMenu?.title}</span>
          <button
            type="button"
            className="drawerClose"
            onClick={() => setActiveMenuId(null)}
            aria-label="Close menu"
          >
            ×
          </button>
        </div>
        <div className="drawerBody">
          {activeMenu?.items.map((entry) => (
            <Link key={entry.href} className="drawerItem" href={entry.href}>
              {entry.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
