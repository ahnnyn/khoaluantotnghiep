import { Layout } from "antd";

import "./Header.Login.css";

const { Header } = Layout;

const HeaderLogin = () => {
  return (
      <Header className="dashboard-header">
        <div className="header-left">
          <div className="header-logo">Healio</div>
        </div>

        <div className="header-right">
        </div>
      </Header>

  );
};

export default HeaderLogin;
