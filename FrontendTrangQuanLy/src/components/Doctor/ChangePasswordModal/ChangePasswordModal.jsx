import {
  Button,
  Card,
  Col,
  Form,
  Input,
  message,
  notification,
  Row,
  Typography,
} from "antd";
import { useEffect, useState } from "react";
import { FaSave, FaLock } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getUserById,
  changeUserPassword,
} from "services/user/user.auth.services";
import { doLogoutAction } from "@redux/account/accountSlice";

const { Title } = Typography;

const ChangePasswordModal = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [doctor, setDoctor] = useState(null);
  const user = useSelector((state) => state.account.user);

  useEffect(() => {
    const fetchDoctor = async () => {
      if (user?._id) {
        const res = await getUserById(user._id);
        if (res?.data) setDoctor(res.data);
      }
    };
    fetchDoctor();
  }, [user]);

  useEffect(() => {
    if (doctor) {
      form.setFieldsValue({
        idUser: doctor._id,
        newUsername: doctor.username,
      });
    }
    return () => form.resetFields();
  }, [doctor]);

  const onFinish = async (values) => {
    const { idUser, oldPassword, newPassword, confirmNewPassword, newUsername } = values;

    if (newPassword !== confirmNewPassword) {
      return notification.error({
        message: "Lỗi xác nhận mật khẩu",
        description: "Mật khẩu mới và xác nhận không khớp!",
      });
    }

    try {
      const res = await changeUserPassword(idUser, oldPassword, newPassword, newUsername);
      if (res?.success || res.status === 200) {
        message.success("Đổi mật khẩu thành công!");
        dispatch(doLogoutAction());
        navigate("/login-doctor");
      } else {
        notification.error({
          message: "Đổi mật khẩu thất bại",
          description: res.message || "Vui lòng thử lại.",
        });
      }
    } catch (err) {
      notification.error({
        message: "Lỗi hệ thống",
        description: err?.message || "Không thể kết nối máy chủ.",
      });
    }
  };

  return (
    <Row justify="center" style={{ padding: "40px 16px" }}>
      <Col xs={24} md={20} lg={14} xl={12}>
        <Card>
          <Title
            level={3}
            style={{ textAlign: "center", marginBottom: 32, color: "#2A95BF" }}
          >
            <FaLock style={{ marginRight: 12 }} />
            ĐỔI MẬT KHẨU
          </Title>

          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            requiredMark={false}
          >
            <Form.Item name="idUser" hidden>
              <Input hidden />
            </Form.Item>

            <Row gutter={[20, 16]}>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Tên đăng nhập mới"
                  name="newUsername"
                  rules={[
                    { required: true, message: "Vui lòng nhập tên đăng nhập!" },
                    { min: 6, message: "Tối thiểu 6 ký tự." },
                  ]}
                  hasFeedback
                >
                  <Input placeholder="Tên đăng nhập mới" />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12}>
                <Form.Item
                  label="Mật khẩu cũ"
                  name="oldPassword"
                  rules={[{ required: true, message: "Vui lòng nhập mật khẩu cũ!" }]}
                  hasFeedback
                >
                  <Input.Password placeholder="Nhập mật khẩu cũ" />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12}>
                <Form.Item
                  label="Mật khẩu mới"
                  name="newPassword"
                  rules={[
                    { required: true, message: "Vui lòng nhập mật khẩu mới!" },
                    { min: 6, message: "Tối thiểu 6 ký tự." },
                  ]}
                  hasFeedback
                >
                  <Input.Password placeholder="Mật khẩu mới" />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12}>
                <Form.Item
                  label="Xác nhận mật khẩu mới"
                  name="confirmNewPassword"
                  dependencies={["newPassword"]}
                  hasFeedback
                  rules={[
                    { required: true, message: "Vui lòng xác nhận mật khẩu!" },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("newPassword") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject("Mật khẩu xác nhận không khớp!");
                      },
                    }),
                  ]}
                >
                  <Input.Password placeholder="Xác nhận mật khẩu mới" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item style={{ textAlign: "center", marginTop: 24 }}>
              <Button
                type="primary"
                size="large"
                icon={<FaSave />}
                htmlType="submit"
                style={{
                  padding: "8px 32px",
                  borderRadius: 8,
                  background: "#2A95BF",
                  fontWeight: "bold",
                }}
              >
                ĐỔI MẬT KHẨU
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default ChangePasswordModal;
