import { Layout } from "antd";
import "./Header.Login.css";

const { Header } = Layout;

const HeaderLogin = () => {
  return (
    <Header className="dashboard-header">
      <div className="header-left">
        <div className="header-logo">
          <img
            src="/assets/images/logo/healio_logo-removebg-preview.png"
            alt="Healio Logo"
            className="logo-image"
          />
          <span className="logo-text">Healio</span>
        </div>
      </div>
      <div className="header-right"></div>
    </Header>
  );
};

export default HeaderLogin;
