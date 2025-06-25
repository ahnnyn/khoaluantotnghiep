import { Routes, Route } from "react-router-dom";
import Home from "./pages/BacSi";
// import AdminHome from "./pages/Admin";
import Login from "./pages/Login";
import Header from "./components/BacSi/Header/Header";
import Footer from "./components/BacSi/Footer/Footer";
import '@schedule-x/theme-shadcn/dist/index.css';


const App = () => {
  return (
    <>
      <Header /> {/* Header luôn hiển thị */}
      <Routes>
        <Route path="/doctor" element={<Home />} />
        <Route path="/login" element={<Login />} />
        {/* <Route path="/admin" element={<AdminHome />} /> */}
      </Routes>
    </>
  );
};

export default App;
