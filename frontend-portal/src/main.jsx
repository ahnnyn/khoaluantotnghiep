import React from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@redux/store";

// Layout & Pages
import App from "./App";
import LoginPage from "pages/Login/Login";
import RegisterPage from "pages/Login/Register";
import ErrorPage from "pages/ErrorPage/ErrorPages";
import PrivateRoute from "pages/PrivatePage/PrivateRoutes";

// Public Pages
import Home from "pages/Home";
import ChiTietBacSi from "pages/ViewDoctor/ChiTietBacSi";
import PageDatLichKham from "pages/DatLichHen/DatLichKhamDoctor";
import LichHen from "pages/QuanLyLichHen/LichHen";
import HoSoCuaToi from "pages/HoSoCuaToi/HoSoCuaToi";
import TaoHoSo from "pages/HoSoCuaToi/TaoHoSo";
import BacSiNoiBat from "pages/BacSiNoiBat/BacSiNoiBat";
import ChuyenKhoa from "pages/ChuyenKhoa/ChuyenKhoa";
import LienHe from "pages/LienHe/LienHe";
import ChuyenKhoaVaBacSi from "pages/ChuyenKhoa/ChuyenKhoaVaBacSi";
import DichVuKham from "pages/DatLichHen/DichVuKham";
import ThongBaoThanhToan from "pages/ThongBaoThanhToan/ThongBaoThanhToan";

// CSS
import "./index.css";

// Router config
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: "chi-tiet-bac-si", element: <ChiTietBacSi /> },
      { path: "page-dat-lich-kham", element: <PageDatLichKham /> },
      { path: "user/lich-hen", element: <LichHen /> },
      { path: "user/ho-so-cua-toi", element: <HoSoCuaToi /> },
      { path: "user/tao-ho-so", element: <TaoHoSo /> },
      { path: "bac-si-noi-bat", element: <BacSiNoiBat /> },
      { path: "chuyen-khoa-kham", element: <ChuyenKhoa /> },
      { path: "chi-tiet-chuyen-khoa", element: <ChuyenKhoaVaBacSi /> },
      { path: "dich-vu-kham", element: <DichVuKham /> },
      { path: "lien-he", element: <LienHe /> },
      { path: "user/thong-bao-thanh-toan", element: <ThongBaoThanhToan /> },
    ],
  },
  {
    path: "/user/login-benh-nhan",
    element: <LoginPage />,
  },
  {
    path: "/user/register-benh-nhan",
    element: <RegisterPage />,
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
]);

// Render app
createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <RouterProvider router={router} />
    </PersistGate>
  </Provider>
);
