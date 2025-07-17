import { Breadcrumb } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import React from "react";

export interface BreadcrumbItem {
  title: string | React.ReactNode;
  href?: string;
  icon?: React.ReactNode;
}

interface BreadcrumbCustomProps {
  items: BreadcrumbItem[];
}

const BreadcrumbCustom: React.FC<BreadcrumbCustomProps> = ({ items }) => {
  return (
    <Breadcrumb
      separator=">"
      style={{ marginBottom: 16, fontSize: 16 }}
      items={[
        {
          title: (
            <Link
              to="/"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                color: "#1890ff",
              }}
            >
              <HomeOutlined />
              <span>Trang chủ</span>
            </Link>
          ),
        },
        ...items.map((item) => ({
          title: item.href ? (
            <Link
              to={item.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                color: "#1890ff",
              }}
            >
              {item.icon}
              <span>{item.title}</span>
            </Link>
          ) : (
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                color: "#1890ff",
              }}
            >
              {item.icon}
              <strong>{item.title}</strong>
            </span>
          ),
        })),
      ]}
    />
  );
};

export default BreadcrumbCustom;
