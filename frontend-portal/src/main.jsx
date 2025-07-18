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
import DoctorDetail from "pages/DoctorDetail/DoctorDetail";
import DoctorsList from "pages/DoctorsList/DoctorsList";
import BookingAppointment from "pages/BookingAppointment/BookingAppointment";
// import LichHen from "pages/QuanLyLichHen/LichHen";
// import HoSoCuaToi from "pages/HoSoCuaToi/HoSoCuaToi";
// import TaoHoSo from "pages/HoSoCuaToi/TaoHoSo";
import LienHe from "pages/LienHe/LienHe";
import ChuyenKhoa from "./pages/ChuyenKhoa/ChuyenKhoa";
import ChuyenKhoaVaBacSi from "pages/ChuyenKhoa/ChuyenKhoaVaBacSi";

// CSS
import "./index.css";
import TuVan from "./pages/TuVan/TuVan";
import BangGia from "./pages/BangGia/BangGia";
import Dashboard from "./pages/Dashboard/Dashboard";
import PaymentNotificationPage from "./pages/PaymentNotificationPage/PaymentNotificationPage";
import ArticlesPage from "./pages/Articles/ArticlesPage";
import ArticleDetailPage from "./pages/Articles/ArticleDetailPage";

// Router config
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: "doctor/:id", element: <DoctorDetail /> },
      { path: "page-dat-lich-kham", element: <BookingAppointment /> },
      {
        path: "user/dashboard",
        element: (
          <PrivateRoute allowedRoles={["PATIENT"]}>
            <Dashboard />
          </PrivateRoute>
        ),
      },
      {
        path: "user/lich-hen",
        element: (
          <PrivateRoute allowedRoles={["PATIENT"]}>
            {/* <LichHen /> */}
          </PrivateRoute>
        ),
      },
      {
        path: "user/ho-so-cua-toi",
        element: (
          <PrivateRoute allowedRoles={["PATIENT"]}>
            {/* <HoSoCuaToi /> */}
          </PrivateRoute>
        ),
      },
      {
        path: "user/tao-ho-so",
        element: (
          <PrivateRoute allowedRoles={["PATIENT"]}>
            {/* <TaoHoSo /> */}
          </PrivateRoute>
        ),
      },
      { path: "doctor", element: <DoctorsList /> },
      { path: "chuyen-khoa-kham", element: <ChuyenKhoa /> },
      { path: "chuyen-khoa/:id", element: <ChuyenKhoaVaBacSi /> },
      { path: "lien-he", element: <LienHe /> },
      { path: "tu-van", element: <TuVan /> },
      { path: "bang-gia", element: <BangGia /> },
      { path: "bai-viet", element: <ArticlesPage /> },
      { path: "bai-viet/:slug", element: <ArticleDetailPage /> },
      {
        path: "user/thong-bao-thanh-toan",
        element: <PaymentNotificationPage />,
      },
    ],
  },
  { path: "/user/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "*", element: <ErrorPage /> },
]);

// Render app
createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <RouterProvider router={router} />
    </PersistGate>
  </Provider>
);
