import { Button, Col, Form, Input, message, notification, Row } from "antd";
import { useEffect, useState } from "react";
import { FaSave } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getUserById, changeUserPassword } from "services/user/user.auth.services";
import { doLogoutAction } from "@redux/account/accountSlice";

const ChangePasswordModal = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [changePasswordForm] = Form.useForm();
  const [doctorAccountData, setDoctorAccountData] = useState(null);
  const user = useSelector((state) => state.account.user);

  useEffect(() => {
    const fetchDoctorInfo = async (userId) => {
      try {
        const res = await getUserById(userId);
        if (res && res.data) {
          setDoctorAccountData(res.data);
        }
      } catch (error) {
        console.error("Error fetching doctor account info:", error);
      }
    };

    if (user?._id) {
      fetchDoctorInfo(user._id);
    }
  }, [user]);

  useEffect(() => {
    if (doctorAccountData) {
      changePasswordForm.setFieldsValue({
        idUser: user._id,
        newUsername: user.username,
      });
    }
    return () => changePasswordForm.resetFields();
  }, [doctorAccountData]);

  const onFinishChangePassword = async (values) => {
    const { idUser, oldPassword, newPassword, confirmNewPassword, newUsername } = values;

    if (newPassword !== confirmNewPassword) {
      return notification.error({
        message: "Lỗi xác nhận mật khẩu",
        description: "Mật khẩu mới và xác nhận mật khẩu không khớp!",
      });
    }

    try {
      const res = await changeUserPassword(idUser, oldPassword, newPassword, newUsername);

      if (!res) {
        return notification.error({
          message: "Lỗi hệ thống",
          description: "API không phản hồi hoặc bị lỗi.",
        });
      }

      if (res.success || res.status === 200) {
        message.success("Đổi mật khẩu thành công!");
        dispatch(doLogoutAction());
        navigate("/login-doctor");
      } else {
        notification.error({
          message: "Đổi mật khẩu thất bại",
          description: res.message || "Vui lòng thử lại!",
        });
      }
    } catch (error) {
      notification.error({
        message: "Lỗi hệ thống",
        description: error?.message || "Không thể kết nối đến máy chủ.",
      });
    }
  };

  return (
    <Form form={changePasswordForm} layout="vertical" onFinish={onFinishChangePassword}>
      <Row>
        <Col span={24} style={{ padding: "0 0 20px", fontSize: "20px", textAlign: "center" }}>
          <span style={{ fontWeight: 550, color: "navy" }}>ĐỔI MẬT KHẨU</span>
        </Col>
      </Row>

      <Row gutter={[20, 10]}>
        <Form.Item name="idUser" hidden><Input hidden /></Form.Item>

        <Col span={12}>
          <Form.Item
            label="Tên đăng nhập mới"
            name="newUsername"
            labelCol={{ span: 24 }}
            rules={[
              { required: true, message: "Vui lòng nhập tên đăng nhập!" },
              { min: 6, message: "Tên đăng nhập phải có ít nhất 6 ký tự!" },
            ]}
            hasFeedback
          >
            <Input placeholder="Nhập tên đăng nhập mới" />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label="Mật khẩu cũ"
            name="oldPassword"
            labelCol={{ span: 24 }}
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu cũ!" }]}
            hasFeedback
          >
            <Input.Password placeholder="Nhập mật khẩu cũ" />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label="Mật khẩu mới"
            name="newPassword"
            labelCol={{ span: 24 }}
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu mới!" },
              { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
            ]}
            hasFeedback
          >
            <Input.Password placeholder="Nhập mật khẩu mới" />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label="Xác nhận mật khẩu mới"
            name="confirmNewPassword"
            labelCol={{ span: 24 }}
            dependencies={["newPassword"]}
            rules={[
              { required: true, message: "Vui lòng xác nhận mật khẩu mới!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject("Mật khẩu xác nhận không khớp!");
                },
              }),
            ]}
            hasFeedback
          >
            <Input.Password placeholder="Nhập lại mật khẩu mới" />
          </Form.Item>
        </Col>

        <Col span={24} style={{ display: "flex", justifyContent: "center" }}>
          <Button
            type="primary"
            size="large"
            icon={<FaSave size={25} />}
            onClick={() => changePasswordForm.submit()}
            style={{ width: "200px", height: "50px", background: "#2A95BF" }}
          >
            ĐỔI MẬT KHẨU
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default ChangePasswordModal;
