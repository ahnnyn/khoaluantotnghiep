import { Link, useRouteError } from "react-router-dom";
import { Button, Result } from "antd";
import './ErrorPage.css';

const ErrorPage = () => {
  const error = useRouteError();
  const statusCode = error?.status || 404;
  const subTitle = error?.statusText || error?.message || "Đã xảy ra lỗi không xác định.";

  return (
    <div className="error-page-wrapper">
      <Result
        status={statusCode}
        title="Oops!"
        subTitle={subTitle}
        extra={
          <Button type="primary">
            <Link to="/">Quay lại trang chủ</Link>
          </Button>
        }
      />
    </div>
  );
};

export default ErrorPage;
