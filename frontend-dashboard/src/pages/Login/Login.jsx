import { Button, Checkbox, Form, Input, Modal, notification } from "antd";
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { doLoginAction } from "@redux/account/accountSlice";
import { forgotPassword, loginUser } from "services/user/user.auth.services";
import "./Login.css";
import HeaderLogin from "../../components/Doctor/Header/Header.Login";

const Login = () => {
  const [form] = Form.useForm();
  const [formLayMK] = Form.useForm();
  const [remember, setRemember] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDoiMK, setIsLoadingDoiMK] = useState(false);
  const [openQuenMK, setOpenQuenMK] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isUserAuthenticated = useSelector((state) => state.account?.isUserAuthenticated);

  useEffect(() => {
    const remembered = localStorage.getItem("rememberedDoctor");
    if (remembered) {
      const { username, password } = JSON.parse(remembered);
      form.setFieldsValue({ username, password, remember: true });
      setRemember(true);
    }

    const handleKeyDown = (e) => e.key === "Enter" && form.submit();
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [form]);

  const handleLogin = async ({ username, password }) => {
  setIsLoading(true);
  try {
    const res = await loginUser(username, password);
    console.log("Login response:", res);
    const data = res?.data;

    if (!data || !data.user || !data.accessToken) {
      throw new Error(res?.message || "Thông tin không đúng");
    }

    const { user, accessToken: token } = data;

    if (remember) {
      localStorage.setItem("rememberedDoctor", JSON.stringify({ username, password }));
    } else {
      localStorage.removeItem("rememberedDoctor");
    }

    dispatch(doLoginAction({ user, token }));
    localStorage.setItem("access_token", token);
    form.resetFields();

    notification.success({
      message: "Đăng nhập thành công!",
      description: `Chào mừng ${user.fullName || "người dùng"}`,
      duration: 3,
    });

    const redirectMap = {
      DOCTOR: "/doctor",
      ADMIN: "/admin",
    };

    if (redirectMap[user.role]) {
      navigate(redirectMap[user.role]);
    } else {
      notification.warning({
        message: "Vai trò không hợp lệ",
        description: "Vui lòng liên hệ quản trị viên.",
      });
    }
  } catch (err) {
    const msg =
      err?.response?.data?.message || // lấy message từ backend
      err?.message ||                 // fallback từ throw Error
      "Đã có lỗi xảy ra";             // fallback cuối

    notification.error({
      message: "Đăng nhập thất bại",
      description: msg,
    });
  } finally {
    setIsLoading(false);
  }
};



  const handleResetPassword = async ({ email }) => {
    if (!email) {
      return notification.error({ message: "Vui lòng nhập email!" });
    }
    setIsLoadingDoiMK(true);
    try {
      const res = await forgotPassword(email);
      notification.success({
        message: "Yêu cầu thành công",
        description: res.message,
      });
      setOpenQuenMK(false);
      formLayMK.resetFields();
    } catch (err) {
      notification.error({
        message: "Gửi yêu cầu thất bại",
        description: err?.response?.data?.message || err.message,
      });
    } finally {
      setIsLoadingDoiMK(false);
    }
  };

  return (
    <>
    <HeaderLogin />
    <div className="rts-register-area rts-section-gap bg_light-1">
      <div className="container">
        <div className="registration-wrapper-1" style={{ maxWidth: 450, margin: "0 auto", background: "#fff", padding: 40, borderRadius: 12, boxShadow: "0 0 15px rgba(0,0,0,0.1)" }}>
          <h2 style={{ textAlign: "center", marginBottom: 30, color: "#2A95BF" }}>ĐĂNG NHẬP HỆ THỐNG</h2>
          <Form form={form} layout="vertical" onFinish={handleLogin}>
            <Form.Item name="username" label="Tên đăng nhập" rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập!" }]}>
              <Input size="large" placeholder="Nhập username" />
            </Form.Item>

            <Form.Item name="password" label="Mật khẩu" rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}>
              <Input.Password size="large" placeholder="Nhập mật khẩu" />
            </Form.Item>

            <Form.Item name="remember" valuePropName="checked">
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Checkbox checked={remember} onChange={(e) => setRemember(e.target.checked)}>
                  Ghi nhớ đăng nhập
                </Checkbox>
                <span
                  style={{ color: "#2A95BF", cursor: "pointer", textDecoration: "underline" }}
                  onClick={() => setOpenQuenMK(true)}
                >
                  Quên mật khẩu?
                </span>
              </div>
            </Form.Item>

            <Form.Item style={{ textAlign: "center" }}>
              <Button loading={isLoading} type="primary" htmlType="submit" size="large" style={{ width: "100%", height: 45, background: "#2A95BF", border: "none" }}>
                ĐĂNG NHẬP
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>

      <Modal
        title={null}
        centered
        open={openQuenMK}
        onCancel={() => {
          setOpenQuenMK(false);
          formLayMK.resetFields();
        }}
        footer={null}
        width={500}
        className="custom-forgot-modal"
        maskClosable={false}
      >
        <div className="forgot-password-wrapper">
          <h2 className="forgot-title">🔐 Lấy lại mật khẩu</h2>
          <p className="forgot-subtitle">Vui lòng nhập email đã đăng ký để lấy lại mật khẩu.</p>
          <Form form={formLayMK} layout="vertical" onFinish={handleResetPassword}>
            <Form.Item
              label="Địa chỉ Email"
              name="email"
              rules={[
                { required: true, message: "Vui lòng nhập email!" },
                { type: "email", message: "Email không hợp lệ!" },
              ]}
            >
              <Input placeholder="nhapemail@example.com" />
            </Form.Item>
            <div className="forgot-form-actions">
              <Button onClick={() => {
                setOpenQuenMK(false);
                formLayMK.resetFields();
              }}>
                Hủy
              </Button>
              <Button type="primary" loading={isLoadingDoiMK} onClick={() => formLayMK.submit()}>
                Gửi yêu cầu
              </Button>
            </div>
          </Form>
        </div>
      </Modal>
    </div>
    </>
  );
};

export default Login;
