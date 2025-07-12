import React from "react";
import { useSelector } from "react-redux";
import { Result, Button } from "antd";
import { Link } from "react-router-dom";
import "./Private.scss";

const PrivateRoute = ({ children, allowedRoles }) => {
  const { user, isUserAuthenticated } = useSelector((state) => state.account);
  console.log("User from PrivateRoute:", user);

  if (!isUserAuthenticated) {
    return (
      <div className="private-route-center">
        <Result
          status="403"
          title="Chưa đăng nhập"
          subTitle="Vui lòng đăng nhập để tiếp tục."
          extra={
            <Button type="primary">
              <Link to="/user/login">Đăng nhập</Link>
            </Button>
          }
        />
      </div>
    );
  }

  const roleName = user?.role || user?.roleId?.roleName || "";

  if (allowedRoles && !allowedRoles.includes(roleName)) {
    return (
      <div className="private-route-center">
        <Result
          status="403"
          title="Không có quyền truy cập"
          subTitle="Tài khoản của bạn không được phép truy cập trang này."
          extra={
            <Button type="primary">
              <Link to="/">Quay lại trang chủ</Link>
            </Button>
          }
        />
      </div>
    );
  }

  return <>{children}</>;
};

export default PrivateRoute;
