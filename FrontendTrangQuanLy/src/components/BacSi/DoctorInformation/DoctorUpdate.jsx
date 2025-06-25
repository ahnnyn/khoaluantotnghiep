import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  notification,
  Radio,
  Row,
  Upload,
  Checkbox,
} from "antd";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { getUserById, updateUserInfo, uploadFile } from "services/user/user.auth.services";
import { fetchAllDepartments, fetchAllPositons } from "../../../services/doctor/doctors.services";
import { FaSave } from "react-icons/fa";
import "./scss.scss";

const DoctorUpdate = () => {
  const [form] = Form.useForm();
  const editorRef = useRef(null);
  const [isSubmit, setIsSubmit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dataChuyenKhoa, setDataChuyenKhoa] = useState([]);
  const [dataPositions, setDataPositions] = useState([]);
  const [dataUpdateDoctor, setDataUpdateDoctor] = useState({});
  const [fileList, setFileList] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [genderDoctor, setGenderDoctor] = useState(null);
  const user = useSelector((state) => state.account.user);

  useEffect(() => {
    if (user?._id) {
      fetchDoctorInfo(user._id);
      console.log("Fetching doctor info for user:", user._id);
      
      fetchDepartments();
      fetchPositions();
    }
  }, [user]);

  const fetchDoctorInfo = async (maBacSi) => {
    try {
      const res = await getUserById(maBacSi);
      console.log("Fetched doctor info:", res);
      if (res?.data) {
        setDataUpdateDoctor(res.data);
        console.log("Doctor data:", res.data);
      }
    } catch (error) {
      console.error("Error fetching doctor info:", error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await fetchAllDepartments();
      if (res?.data) {
        setDataChuyenKhoa(res.data);
        
      }
    } catch (error) {
      notification.error({
        message: "Lỗi",
        description: "Không thể tải danh sách chuyên khoa!",
      });
    }
  };

  const fetchPositions = async () => {
    try {
      const res = await fetchAllPositons();
      if (res?.data) {
        setDataPositions(res.data);
      }
    } catch (error) {
      notification.error({
        message: "Lỗi",
        description: "Không thể tải danh sách vị trí!",
      });
    }
  };

  const convertGender = (genderValue) => {
  if (genderValue === true || genderValue === "0") return "0"; // Nam
  if (genderValue === false || genderValue === "1") return "1"; // Nữ
  return "2"; // Khác
};

useEffect(() => {
  if (dataUpdateDoctor._id) {
    const chuyenKhoaId = dataUpdateDoctor.departmentId?.map(dep => dep._id) || [];
    const positionId = dataUpdateDoctor.positionId?.map(pos => pos._id) || [];
    const gender = convertGender(dataUpdateDoctor.gender); 
    
    if (dataUpdateDoctor.avatar) {
      const imageUrl = `${import.meta.env.VITE_BACKEND_URL}/public/images/upload/${dataUpdateDoctor.avatar}`;
      setImageUrl(imageUrl);
      setFileList([
        {
          uid: "-1",
          name: dataUpdateDoctor.avatar,
          status: "done",
          url: imageUrl,
        },
      ]);
    }
    setTimeout(() => {
      form.setFieldsValue({
        fullName: dataUpdateDoctor.fullName,
        gender, 
        phoneNumber: dataUpdateDoctor.phone,
        email: dataUpdateDoctor.email || "",
        address: dataUpdateDoctor.address || "",
        giaKham: dataUpdateDoctor.price,
        image: dataUpdateDoctor.avatar || "",
        mota: dataUpdateDoctor.moTa || "",
        chuyenKhoaId,
        positionId,
      });
      setGenderDoctor(gender);
      console.log("giá trị được set trong form", form.getFieldsValue())
    }, 100); // 100ms timeout là tối ưu
  }
}, [dataUpdateDoctor, form]);



 const handleUploadFileImage = async ({ file }) => {
  setLoading(true);
  try {
    const res = await uploadFile(file);
    const result = res.data;
    console.log("Upload result:", result);

    if (result?.status === "success") {
      const fileName = result.path;
      const imageUrl = `${import.meta.env.VITE_BACKEND_URL}/public/images/upload/${fileName}`;
      
      setFileName(fileName);
      setImageUrl(imageUrl);
      setFileList([
        {
          uid: "-1",
          name: file.name,
          status: "done",
          url: imageUrl,
        },
      ]);

      message.success("Tải ảnh lên thành công!");
    } else {
      throw new Error(result?.error || "Tải ảnh thất bại!");
    }
  } catch (error) {
    console.error("Upload error:", error);
    message.error(error.message || "Lỗi khi tải ảnh lên!");
  } finally {
    setLoading(false);
  }
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

  const handleUpdateDoctor = async (values) => {
    if (!imageUrl) {
      notification.error({
        message: "Lỗi",
        description: "Vui lòng tải lên hình ảnh!",
      });
      return;
    }

    const hinhAnh = imageUrl.split("/").pop();
    console.log("Hình ảnh sau khi tách:", hinhAnh);
    setIsSubmit(true);

    try {
      const res = await updateUserInfo({
      id: user._id,
      fullName: values.fullName,
      gender: values.gender === "0" ? true : values.gender === "1" ? false : undefined,
      phone: values.phoneNumber,
      email: values.email,
      address: values.address,
      avatar: fileName,
      price: values.giaKham,
      positionId: values.positionId,
      departmentId: values.chuyenKhoaId,
    });

    

      if (res.status) {
        message.success(res.message || "Cập nhật thông tin thành công!");
        fetchDoctorInfo(user._id);
      } else {
        notification.error({ message: "Lỗi", description: res.error });
      }
    } catch (error) {
      notification.error({
        message: "Lỗi",
        description: "Có lỗi xảy ra, vui lòng thử lại!",
      });
    } finally {
      setIsSubmit(false);
    }
  };

  return (
    <Row>
      <Col span={24} style={{ padding: "0 0 20px", fontSize: "20px", textAlign: "center" }}>
        <span style={{ fontWeight: "550", color: "navy" }}>
          THÔNG TIN CÁ NHÂN
        </span>
      </Col>
      <Col span={24}>
        <Form form={form} name="bacsi" layout="vertical" onFinish={handleUpdateDoctor}>
          <Row gutter={[20, 5]}>
            <Col span={8}>
              <Form.Item
                label="Họ tên"
                name="fullName"
                rules={[{ required: true, message: "Vui lòng nhập tên hiển thị!" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label="Số điện thoại"
                name="phoneNumber"
                rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
             <Form.Item label="Giới tính" name="gender">
                <Radio.Group onChange={(e) => setGenderDoctor(e.target.value)}>
                  <Radio value="0">Nam</Radio>
                  <Radio value="1">Nữ</Radio>
                  <Radio value="2">Khác</Radio>
                </Radio.Group>
            </Form.Item>
            </Col>
          </Row>

          <Row gutter={[20, 5]}>
            <Col span={8}>
              <Form.Item label="Hình ảnh" name="image">
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
              <Col span={8}>
                <Form.Item label="Email" name="email" rules={[{ required: true, message: "Vui lòng nhập email!" }]}><Input /></Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Địa chỉ liên hệ" name = "address" rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}><Input /></Form.Item>
              </Col>
          </Row>


          <Row gutter={[20, 5]}>
            <Col span={10}>
              <Form.Item label="Giá khám" name="giaKham" rules={[{ required: true, message: "Vui lòng nhập Giá khám!" }]}> 
                <InputNumber
                  style={{ width: "80%" }}
                  min={100000}
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  addonAfter={"VNĐ"}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[20, 5]}>
            <Col span={12}>
              <Form.Item label="Chuyên khoa" name="chuyenKhoaId">
                <Checkbox.Group>
                  <Row>
                    {dataChuyenKhoa.map((ck) => (
                      <Col span={24} key={ck._id}>
                        <Checkbox value={ck._id}>{ck.name}</Checkbox>
                      </Col>
                    ))}
                  </Row>
                </Checkbox.Group>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Chức vụ" name="positionId">
                <Checkbox.Group>
                  <Row>
                    {dataPositions.map((pos) => (
                      <Col span={24} key={pos._id}>
                        <Checkbox value={pos._id}>{pos.name}</Checkbox>
                      </Col>
                    ))}
                  </Row>
                </Checkbox.Group>
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span={24}>
              <Form.Item label="Mô tả" name="mota">
                <CKEditor
                  editor={ClassicEditor}
                  data={form.getFieldValue("mota") || ""}
                  onChange={(event, editor) => {
                    const data = editor.getData();
                    form.setFieldsValue({ mota: data });
                  }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Col span={24} style={{ display: "flex", justifyContent: "center" }}>
            <Button
              onClick={() => form.submit()}
              type="primary"
              size="large"
              icon={<FaSave size={25} />}
              style={{ width: "200px", height: "50px", background: "#2A95BF" }}
            >
              Đổi thông tin
            </Button>
          </Col>

          <Divider />
        </Form>
      </Col>
    </Row>
  );
};

export default DoctorUpdate;