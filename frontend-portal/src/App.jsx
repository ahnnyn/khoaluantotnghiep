import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Spin } from "antd";
import Header from "components/Header/Header";
import Footer from "components/Footer/Footer";
import { useDispatch, useSelector } from "react-redux";
import { doGetAccountAction } from "@redux/account/accountSlice";
import { getUserById } from "./services/auth.user/user.auth.services";

const App = () => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.account);

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    const res = await getUserById();
    if (res.data) {
      dispatch(doGetAccountAction({ user: res.data.user }));
    } else {
      dispatch(doGetAccountAction({ user: {} }));
    }
  };

  return (
    <>
      {isLoading ? (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <Spin />
        </div>
      ) : (
        <>
          <Header />
          <Outlet />
          <Footer />
        </>
      )}
    </>
  );
};

export default App;
