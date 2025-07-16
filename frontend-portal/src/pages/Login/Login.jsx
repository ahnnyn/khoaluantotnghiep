import {
  Button,
  Checkbox,
  Divider,
  Form,
  Input,
  Modal,
  notification,
} from "antd";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "services/auth.user/user.auth.services";
import RegisterPage from "./Register";
import { useDispatch } from "react-redux";
import { doLoginAction } from "@redux/account/accountSlice";
import "./login.scss";

const LoginPage = ({ openModalLogin, setOpenModalLogin }) => {
  const [formLogin] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [remember, setRemember] = useState(false);
  const [openRegisterKH, setOpenRegisterKH] = useState(false);

  useEffect(() => {
    const rememberedUser = localStorage.getItem("rememberedUser");
    if (rememberedUser) {
      const account = JSON.parse(rememberedUser);
      formLogin.setFieldsValue({
        username: account.username,
        password: account.password,
        remember: true,
      });
      setRemember(true);
    }
  }, [formLogin]);

  const onFinish = async ({ username, password }) => {
    setIsLoading(true);
    try {
      const res = await loginUser(username, password);
      const data = res?.data;

      if (!data || !data.user || !data.accessToken) {
        throw new Error(res?.message || "Thông tin không đúng");
      }

      const { user, accessToken: token } = data;

      if (remember) {
        localStorage.setItem(
          "rememberedUser",
          JSON.stringify({ username, password })
        );
      } else {
        localStorage.removeItem("rememberedUser");
      }

      dispatch(doLoginAction({ user, token }));
      formLogin.resetFields();

      notification.success({
        message: "Đăng nhập thành công!",
        description: `Chào mừng ${user.fullName || "người dùng"}`,
        duration: 3,
      });

      //  Đóng modal login sau đăng nhập
      setOpenModalLogin(false);

      setTimeout(() => {
        navigate("/");
      }, 800);
    } catch (err) {
      const msg =
        err?.response?.data?.message || err?.message || "Đã có lỗi xảy ra";

      notification.error({
        message: "Đăng nhập thất bại",
        description: msg,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      className="login-modal"
      title="Đăng Nhập"
      open={openModalLogin}
      onCancel={() => setOpenModalLogin(false)}
      width={600}
      maskClosable={false}
      footer={null}
      style={{ top: 100 }}
    >
      <Form form={formLogin} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Tên đăng nhập"
          name="username"
          rules={[
            { required: true, message: "Vui lòng nhập tên đăng nhập!" },
            {
              pattern: /^[a-zA-Z0-9@_]+$/,
              message: "Username chỉ gồm chữ, số, @ hoặc _",
            },
          ]}
          hasFeedback
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          hasFeedback
        >
          <Input.Password
            onKeyDown={(e) => {
              if (e.key === "Enter") formLogin.submit();
            }}
          />
        </Form.Item>

        <Form.Item>
          <Checkbox
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
          >
            Ghi nhớ tài khoản
          </Checkbox>
        </Form.Item>

        <Form.Item>
          <Button
            loading={isLoading}
            type="primary"
            onClick={() => formLogin.submit()}
            className="login-button"
          >
            Đăng nhập
          </Button>
        </Form.Item>
      </Form>

      <Divider />

      <div style={{ textAlign: "center" }}>
        Chưa có tài khoản?{" "}
        <Link onClick={() => setOpenRegisterKH(true)}>Đăng ký tại đây</Link>
      </div>

      <RegisterPage
        openRegisterKH={openRegisterKH}
        setOpenRegisterKH={setOpenRegisterKH}
      />
    </Modal>
  );
};

export default LoginPage;
