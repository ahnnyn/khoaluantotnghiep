import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  Typography,
  Divider,
  message,
  Row,
  Col,
} from "antd";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useSelector } from "react-redux";
import { fectchListUser } from "services/user/user.auth.services";
import { sendEmailSchedule } from "../../../services/doctor/doctors.services";

const { Title } = Typography;

const BroadcastEmail = () => {
  const [form] = Form.useForm();
  const [userOptions, setUserOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const toEmail = Form.useWatch("to", form);

  const user = useSelector((state) => state.account.user);

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const fetchAllUsers = async () => {
    try {
      const res = await fectchListUser();
      console.log("Danh sách người dùng:", res.data);
      if (res?.data) {
        const options = res.data.map((user) => ({
          label: `${user.fullName} (${user.email})`,
          value: user.email, // dùng email làm giá trị để gửi
          fullName: user.fullName,
          email: user.email,
          avatar: user.avatar,
        }));
        setUserOptions(options);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách người dùng:", error);
    }
  };

  const handleSubmit = async (values) => {
    const { to, ccManual, ccSelect, subject, content } = values;

    if (!to || !subject || !content) {
      message.error("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    // Gộp cả email CC thủ công và email đã chọn
    const ccCombined = [
      ...(ccManual ? ccManual.split(",").map((email) => email.trim()) : []),
      ...(ccSelect || []),
    ];

    const payload = {
      email: to,
      subject,
      message: content,
      cc: ccCombined.join(","), // Chuỗi email cách nhau bởi dấu phẩy
    };

    try {
      setLoading(true);
      await sendEmailSchedule(payload);
      message.success("Gửi email thành công!");
      form.resetFields();
    } catch (error) {
      console.error("Send email error:", error);
      message.error("Gửi email thất bại.");
    } finally {
      setLoading(false);
    }
  };

  const getFilteredCCOptions = () => {
    return userOptions.filter((user) => user.value !== toEmail);
  };

  return (
    <div style={{ maxWidth: 1000, margin: "auto", padding: 24 }}>
      <Title level={3} style={{ textAlign: "center" }}>
        GỬI EMAIL
      </Title>
      <Divider />
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        {/* Row TO */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Email người nhận (To)"
              name="to"
              rules={[
                { required: true, message: "Vui lòng nhập email người nhận" },
              ]}
              style={{ marginBottom: 16 }}
            >
              <Input
                placeholder="Nhập email người nhận chính"
                style={{ height: 40 }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Chọn từ danh sách người dùng">
              <Select
                showSearch
                placeholder="Chọn người nhận chính"
                onChange={(email) => form.setFieldValue("to", email)}
                options={userOptions}
                style={{ height: 40 }}
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Row CC */}
        <Row gutter={16}>
          {/* Nhập CC bằng tay */}
          <Col span={12}>
            <Form.Item
              label="Email người nhận phụ (CC)"
              name="ccManual"
              style={{ marginBottom: 16 }}
            >
              <Input
                placeholder="Nhập email người nhận phụ (nhiều email cách nhau bằng dấu ,)"
                style={{ height: 40 }}
              />
            </Form.Item>
          </Col>

          {/* Chọn CC từ danh sách */}
          <Col span={12}>
            <Form.Item
              label="Chọn từ danh sách người dùng"
              name="ccSelect"
              style={{ marginBottom: 16 }}
            >
              <Select
                mode="multiple"
                placeholder="Chọn người nhận phụ"
                onChange={(emails) => form.setFieldValue("ccManual", emails)}
                options={getFilteredCCOptions()}
                style={{ minHeight: 40 }}
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Subject */}
        <Form.Item
          label="Tiêu đề email"
          name="subject"
          rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
        >
          <Input
            placeholder="Ví dụ: Thông báo điều chỉnh lịch làm việc"
            style={{ height: 40 }}
          />
        </Form.Item>

        {/* Content */}
        <Form.Item
          label="Nội dung email"
          name="content"
          rules={[{ required: true, message: "Vui lòng nhập nội dung" }]}
        >
          <CKEditor
            editor={ClassicEditor}
            data=""
            onChange={(event, editor) => {
              form.setFieldValue("content", editor.getData());
            }}
          />
        </Form.Item>

        <Form.Item>
          <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
            <Button
              htmlType="reset"
              onClick={() => form.resetFields()}
              style={{
                height: 44, // cao lên
                width: "auto",
                padding: "0 16px",
              }}
            >
              Hủy
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              style={{
                height: 44,
                width: "auto",
                padding: "0 20px",
              }}
            >
              Gửi mail
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default BroadcastEmail;
