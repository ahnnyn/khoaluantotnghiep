import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  message,
  Modal,
  notification,
  Radio,
  Row,
  Upload,
  DatePicker,
} from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getUserById,
  updateUserInfo,
  uploadFile,
} from "services/auth.user/user.auth.services";
import { useNavigate } from "react-router-dom";
import { FaSave } from "react-icons/fa";
import "./style.css";
import dayjs from "dayjs";

const ModalUpdateThongTin = ({
  openUpdateBenhNhan,
  setOpenModalThongTinCaNhan,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [dataAccKH, setDataAccKH] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const [genderBenhNhan, setGenderBenhNhan] = useState(null);
  const [isSubmit, setIsSubmit] = useState(false);
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.account.user);
  console.log("Thông tin tài khoản:", user);

  const cancel = () => {
    form.resetFields();
    setOpenModalThongTinCaNhan(false);
  };
  console.log("Account ID:", user?._id);

  const fetchOneAcc = async () => {
    if (user?._id) {
      return notification.error({
        message: "Lỗi dữ liệu",
        description: "Không tìm thấy thông tin tài khoản!",
      });
    }

    const query = { maBenhNhan: user?._id };
    console.log("Fetching account data with query:", query); // Log query to check the request data

    try {
      const res = await getUserById(query.maBenhNhan);
      console.log("API Response:", res); // Log the API response to check the data structure
      // Kiểm tra sự tồn tại của res và res.data
      if (res) {
        setDataAccKH(res.data); // Lưu trữ đúng dữ liệu vào state
      } else {
        notification.error({
          message: "Lỗi lấy dữ liệu tài khoản",
          description: "Không thể tải thông tin tài khoản từ hệ thống.",
        });
      }
    } catch (error) {
      console.error("Lỗi khi gọi API lấy thông tin tài khoản:", error);
      notification.error({
        message: "Lỗi hệ thống",
        description: "Có lỗi xảy ra khi lấy thông tin tài khoản.",
      });
    }
  };

  useEffect(() => {
    if (dataAccKH) {
      console.log("Dữ liệu tài khoản:", dataAccKH); // Log the account data
    } else {
      console.log("Chưa có dữ liệu tài khoản"); // Log when data is not available
    }
  }, [dataAccKH]); // Log whenever dataAccKH changes

  // Khi modal mở thì gọi lại thông tin tài khoản
  useEffect(() => {
    if (openUpdateBenhNhan) {
      fetchOneAcc(); // Gọi API khi mở modal
    }
  }, [openUpdateBenhNhan]);

  // Cập nhật thông tin lên form
  useEffect(() => {
    if (dataAccKH) {
      if (dataAccKH.hinhAnh) {
        setFileList([
          {
            uid: "-1",
            name: dataAccKH.hinhAnh,
            status: "done",
            url: `${import.meta.env.VITE_BACKEND_URL}/public/benhnhan/${
              dataAccKH.hinhAnh
            }`,
          },
        ]);
        setImageUrl(dataAccKH.hinhAnh);
      }
    }
    if (dataAccKH) {
      form.setFieldsValue({
        maBenhNhan: dataAccKH.maBenhNhan,
        hoTen: dataAccKH.hoTen,
        gioiTinh: dataAccKH.gioiTinh,
        soDienThoai: dataAccKH.soDienThoai,
        email: dataAccKH.email,
        diaChi: dataAccKH.diaChi,
        ngaySinh: dataAccKH.ngaySinh ? dayjs(dataAccKH.ngaySinh) : null,
      });

      setGenderBenhNhan(dataAccKH.gioiTinh);
    }
  }, [dataAccKH]);

  const handleUploadFileImage = async ({ file }) => {
    setLoading(true);
    try {
      const res = await uploadFile(file);
      console.log("Upload Response:", res); // Kiểm tra dữ liệu trả về từ API
      console.log("File Name:", res.filename); // Log the file name to the console
      console.log("File url:", res.url); // Log the file type to the console
      console.log("File success:", res.success); // Log the file size to the console
      console.log("File Status:", res.status); // Log the file status to the console

      if (res.success) {
        // const fileName = res.url.split("/").pop();
        const imageUrl = `${import.meta.env.VITE_BACKEND_URL}${res.url}`;
        // const fileName = res.url.split("/").pop();
        setImageUrl(imageUrl); //Đúng tên biến ở đây
        // form.setFieldsValue({ hinhAnh: fileName });
        setFileList([
          {
            uid: "-1",
            name: file.name,
            status: "done",
            url: imageUrl,
          },
        ]);
        console.log("imgURL:", imageUrl);
        message.success("Tải ảnh lên thành công!");
      }
    } catch (error) {
      message.error(error.message || "Lỗi khi tải ảnh lên!");
    }
    setLoading(false);
  };

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("Bạn chỉ có thể tải lên hình ảnh JPG/PNG!");
    }
    return isJpgOrPng;
  };

  const handleRemoveFile = (file) => {
    setFileList([]);
    setImageUrl("");
    message.success(`${file.name} đã được xóa`);
  };

  // Xử lý submit
  const handleUpdateBenhNhan = async (values) => {
    console.log("Form Values:", values);
    console.log("BenhNhan ID:", values.maBenhNhan);
    // console.log("Hình ảnh (file name):", hinhAnh);
    if (!imageUrl) {
      notification.error({
        message: "Lỗi",
        description: "Vui lòng upload hình ảnh",
      });
      return;
    }
    const hinhAnh = imageUrl.split("/").pop(); // Extract filename from the image URL

    // Kiểm tra kỹ mã bệnh nhân
    if (!values.maBenhNhan) {
      notification.error({
        message: "Thiếu thông tin!",
        description: "Không có mã bệnh nhân.",
      });
      return;
    }

    setIsSubmit(true);
    // const hinhAnh = imageUrl; //
    console.log("Updating Paint with data:", {
      maBenhNhan: values.maBenhNhan,
      hoTen: values.hoTen,
      gioiTinh: values.gioiTinh,
      ngaySinh: values.ngaySinh,
      soDienThoai: values.soDienThoai,
      email: values.email,
      diaChi: values.diaChi,
      hinhAnh: hinhAnh,
    });
    console.log("VALUES GỬI LÊN:", values); // 👈 Thêm dòng này

    try {
      // setLoading(true);
      const formattedNgaySinh = values.ngaySinh.format("YYYY-MM-DD");
      const res = await updateUserInfo(
        values.maBenhNhan,
        values.hoTen,
        values.gioiTinh,
        formattedNgaySinh, // Format chuẩn để tránh lệch múi giờ
        values.soDienThoai,
        values.email,
        values.diaChi,
        hinhAnh
      );
      console.log(res);
      if (res.status) {
        message.success(res.message || "Cập nhật thành công");
        // dispatch(doLogoutAction());
        // navigate("/");
        // setOpenModalThongTinCaNhan(false);
        fetchOneAcc(acc.user.maBenhNhan);
      } else {
        notification.error({
          message: "Đổi thông tin thất bại!",
          description: res.message || "Đã xảy ra lỗi.",
        });
      }
    } catch (error) {
      console.error("Lỗi cập nhật tài khoản:", error);
      notification.error({
        message: "Lỗi hệ thống",
        description: "Có lỗi xảy ra trong quá trình cập nhật.",
      });
    } finally {
      setIsSubmit(false);
    }
  };

  return (
    <Modal
      title="Thông tin của tôi"
      open={openUpdateBenhNhan}
      onCancel={cancel}
      footer={null}
      width={700}
      maskClosable={false}
    >
      <Divider />
      <Form form={form} layout="vertical" onFinish={handleUpdateBenhNhan}>
        <Row gutter={[20, 10]}>
          <Form.Item name="maBenhNhan" hidden>
            <Input hidden />
          </Form.Item>

          <Col span={12}>
            <Form.Item
              label="Họ tên"
              name="hoTen"
              rules={[
                { required: true, message: "Vui lòng nhập họ tên!" },
                {
                  pattern: /^[A-Za-zÀ-ỹ\s]+$/,
                  message: "Không được nhập số, ký tự đặc biệt!",
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập email!",
                },
                {
                  pattern: /^[a-zA-Z0-9._%+-]+@gmail\.com$/,
                  message: "Email phải có đuôi @gmail.com",
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Số điện thoại"
              name="soDienThoai"
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại!" },
                {
                  pattern: /^0\d{9}$/,
                  message: "Số điện thoại phải có 10 chữ số, bắt đầu bằng 0",
                },
              ]}
            >
              <Input placeholder="Ví dụ: 0972138493" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Địa chỉ liên hệ"
              name="diaChi"
              rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Giới tính" name="gioiTinh">
              {/* <Radio.Group value={genderBenhNhan} onChange={(e) => setGenderBenhNhan(e.target.value)}>
                                <Radio value={"0"}>Nam</Radio>
                                <Radio value={"1"}>Nữ</Radio>
                                <Radio value={"2"}>Khác</Radio>
                            </Radio.Group> */}
              <Radio.Group>
                <Radio value={"0"}>Nam</Radio>
                <Radio value={"1"}>Nữ</Radio>
                <Radio value={"2"}>Khác</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Ngày sinh"
              name="ngaySinh"
              rules={[{ required: true, message: "Vui lòng chọn ngày sinh!" }]}
            >
              <DatePicker
                format="DD/MM/YYYY"
                style={{ width: "100%" }}
                placeholder="Chọn ngày sinh"
                disabledDate={(current) =>
                  current && current > dayjs().endOf("day")
                }
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item label="Hình ảnh" name="hinhAnh">
              <Upload
                listType="picture-card"
                maxCount={1}
                customRequest={handleUploadFileImage}
                beforeUpload={beforeUpload}
                onRemove={handleRemoveFile}
                fileList={fileList}
              >
                <div>
                  {loading ? <LoadingOutlined /> : <PlusOutlined />} Upload
                </div>
              </Upload>
            </Form.Item>
          </Col>

          <Col span={24} style={{ display: "flex", justifyContent: "center" }}>
            <Button
              className="custom-btn-save"
              type="primary"
              size="large"
              onClick={() => !loading && form.submit()}
              icon={loading ? <LoadingOutlined /> : <FaSave size={25} />}
              loading={loading}
            >
              Đổi thông tin
            </Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default ModalUpdateThongTin;
