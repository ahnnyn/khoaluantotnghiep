// App.jsx
import React from "react";
import Header from "components/Doctor/Header/Header";
import { Outlet } from "react-router-dom";
import "@schedule-x/theme-shadcn/dist/index.css";

const App = () => {
  return (
    <>
      <Outlet /> {/* Đây là chỗ render các route con như /doctor */}
    </>
  );
};

export default App;
