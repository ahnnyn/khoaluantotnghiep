import { LoadingOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  message,
  Modal,
  notification,
  Row,
} from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserById, changeUserPassword } from "services/auth.user/user.auth.services";
import { useNavigate } from "react-router-dom";
import { doLogoutAction } from "@redux/account/accountSlice";
import bcrypt from "bcryptjs-react";
import { FaSave } from "react-icons/fa";

const ModalChangePassword = ({
  openModalChangePassword,
  setOpenModalChangePassword,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formDoiMK] = Form.useForm();
  const [dataAccKH, setDataAccKH] = useState(null);
  const acc = useSelector((state) => state.account.user);
  const [loading, setLoading] = useState(false);

  const cancel = () => {
    formDoiMK.resetFields();
    setOpenModalChangePassword(false);
  };

  const fetchOneAcc = async () => {
    if (!acc?.user?.maBenhNhan) {
      return notification.error({
        message: "Lỗi dữ liệu",
        description: "Không tìm thấy thông tin tài khoản!",
      });
    }

    try {
      const res = await getUserById(acc.user.maBenhNhan);
      if (res?.data) {
        setDataAccKH(res.data);
      } else {
        notification.error({
          message: "Không thể tải dữ liệu",
          description: "Dữ liệu tài khoản không khả dụng.",
        });
      }
    } catch (error) {
      notification.error({
        message: "Lỗi hệ thống",
        description: "Không thể lấy thông tin tài khoản.",
      });
    }
  };

  useEffect(() => {
    if (openModalChangePassword) fetchOneAcc();
  }, [openModalChangePassword]);

  useEffect(() => {
    if (dataAccKH) {
      formDoiMK.setFieldsValue({
        _idAcc: dataAccKH.maTaiKhoan,
        idBN: dataAccKH.maBenhNhan,
        hoTen: dataAccKH.hoTen,
        soDienThoai: dataAccKH.soDienThoai,
        email: dataAccKH.email,
      });
    }
  }, [dataAccKH]);

  const onFinishDoiMK = async (values) => {
    const { _idAcc, idBN, matKhau, matKhauMoi, matKhauMoiConfirm } = values;

    if (!dataAccKH) {
      return notification.error({
        message: "Lỗi dữ liệu",
        description: "Không tìm thấy thông tin tài khoản!",
      });
    }

    if (matKhauMoi !== matKhauMoiConfirm) {
      return notification.error({
        message: "Mật khẩu mới không khớp",
        description: "Vui lòng kiểm tra lại mật khẩu mới và xác nhận.",
      });
    }

    if (matKhauMoi === matKhau) {
      return notification.error({
        message: "Mật khẩu mới trùng với mật khẩu cũ",
        description: "Vui lòng nhập mật khẩu mới khác mật khẩu cũ.",
      });
    }

    const isMatch = await bcrypt.compare(matKhau, dataAccKH.matKhau);
    if (!isMatch) {
      return notification.error({
        message: "Mật khẩu cũ không đúng",
        description: "Vui lòng nhập đúng mật khẩu hiện tại.",
      });
    }

    try {
      setLoading(true);
      const res = await changeUserPassword(
        _idAcc,
        idBN,
        acc.user.username,
        matKhau,
        matKhauMoi
      );
      if (res?.success) {
        message.success("Đổi mật khẩu thành công!");
        dispatch(doLogoutAction());
        navigate("/");
        setOpenModalChangePassword(false);
      } else {
        notification.error({
          message: "Đổi mật khẩu thất bại",
          description: res.message || "Vui lòng thử lại.",
        });
      }
    } catch (error) {
      notification.error({
        message: "Lỗi hệ thống",
        description: "Không thể đổi mật khẩu.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={
        <div style={{ fontSize: 20, fontWeight: 600, textAlign: "center" }}>
          Đổi mật khẩu
        </div>
      }
      open={openModalChangePassword}
      onCancel={cancel}
      footer={null}
      width={700}
      maskClosable={false}
      className="doi-mk-modal"
    >
      <Divider />
      <Form form={formDoiMK} layout="vertical" onFinish={onFinishDoiMK}>
        <Row gutter={[20, 10]}>
          <Form.Item name="_idAcc" hidden>
            <Input hidden />
          </Form.Item>
          <Form.Item name="idBN" hidden>
            <Input hidden />
          </Form.Item>
          <Col span={12}>
            <Form.Item
              label="Mật khẩu cũ"
              name="matKhau"
              rules={[
                { required: true, message: "Vui lòng nhập mật khẩu cũ!" },
                {
                  pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
                  message:
                    "Mật khẩu phải có ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt!",
                },
              ]}
              hasFeedback
            >
              <Input.Password placeholder="Mật khẩu hiện tại" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Mật khẩu mới"
              name="matKhauMoi"
              dependencies={["matKhau"]}
              rules={[
                { required: true, message: "Vui lòng nhập mật khẩu mới!" },
                {
                  pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
                  message:
                    "Mật khẩu phải có ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("matKhau") !== value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(
                        "Mật khẩu mới không được trùng với mật khẩu cũ!"
                      )
                    );
                  },
                }),
              ]}
              hasFeedback
            >
              <Input.Password placeholder="Mật khẩu mới" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label="Xác nhận mật khẩu mới"
              name="matKhauMoiConfirm"
              dependencies={["matKhauMoi"]}
              rules={[
                {
                  required: true,
                  message: "Nhập lại mật khẩu mới!",
                },
                {
                  pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
                  message:
                    "Mật khẩu phải có ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("matKhauMoi") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Mật khẩu không khớp!"));
                  },
                }),
              ]}
              hasFeedback
            >
              <Input.Password placeholder="Nhập lại mật khẩu mới" />
            </Form.Item>
          </Col>

          <Col span={24} style={{ textAlign: "center" }}>
            <Button
              type="primary"
              size="large"
              htmlType="submit"
              icon={loading ? <LoadingOutlined /> : <FaSave size={20} />}
              loading={loading}
            >
              Đổi mật khẩu
            </Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default ModalChangePassword;
