
import ScrollToTop from "components/ScrollToTop/ScrollToTop";
import "./home.scss";
import BodyHomePage from "./BodyHomePage/BodyHomePage";
const Home = () => {
  return (
    <>
      <div className="layout-app">
        <BodyHomePage />
      </div>
      <ScrollToTop />
    </>
  );
};
export default Home;
