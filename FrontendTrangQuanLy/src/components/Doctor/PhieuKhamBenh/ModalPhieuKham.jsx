import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  message,
  notification,
  Row,
  Modal,
  Card
} from "antd";
import { useEffect } from "react";
import { FaSave, FaTrashAlt, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { updateMedicalExaminationResult } from "services/doctor/doctors.services";
import { triggerReloadMedicalData } from "@redux/app/globalSlice";
import { useDispatch } from "react-redux";


const ModalPhieuKham = ({ isModalOpen, setIsModalOpen, editingRecord }) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (editingRecord) {
      const initValues = {
        id: editingRecord._id,
        hoTen: editingRecord?.patientProfileId?.fullName || '',
        khungGio: editingRecord?.khungGio || '',
        ngayKham: editingRecord?.examinationTime?.slice(0, 10) || '',
        tienSu: editingRecord?.passMedicalHistory || '',
        chuanDoan: editingRecord?.diagnosis || '',
        ketLuan: editingRecord?.conclusion || '',
        donThuoc: editingRecord?.prescriptionId?.items?.map(item => ({
          tenThuoc: item.medication.name,
          lieuLuong: item.dosage,
          soLanDungTrongNgay: parseInt(item.frequency),
          soNgayDung: parseInt(item.duration),
          ghiChu: item.instructions
        })) || []
      };
      form.setFieldsValue(initValues);
    }
  }, [editingRecord]);



  const handleSubmit = async (values) => {
  try {
    const payload = {
      diagnosis: values.chuanDoan,
      conclusion: values.ketLuan,
      prescriptionItems: values.donThuoc || [],
    };

    const res = await updateMedicalExaminationResult(editingRecord._id, payload);

    // Nếu server trả lỗi theo kiểu res.success === false chẳng hạn
    if (res?.success === false || !res) {
      throw new Error(res?.message || "Lỗi không xác định từ server");
    }

    message.success("Cập nhật kết quả khám bệnh thành công!");
    dispatch(triggerReloadMedicalData());
    setIsModalOpen(false);
    navigate("/doctor");

  } catch (err) {
    notification.error({
      message: "Cập nhật thất bại",
      description: err?.response?.data?.message || err.message || "Lỗi hệ thống",
    });
  }
};


  return (
    <Modal
      open={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      footer={null}
      width={1100}
      bodyStyle={{ maxHeight: '75vh', overflowY: 'auto' }}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Row gutter={16}>
          <Col span={24} style={{ textAlign: "center", fontSize: 18, fontWeight: "bold" }}>
            CẬP NHẬT KẾT QUẢ KHÁM BỆNH
          </Col>

          <Col span={12}>
            <Form.Item label="Họ và tên bệnh nhân" name="hoTen">
              <Input disabled />
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item label="Khung giờ khám" name="khungGio">
              <Input disabled />
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item label="Ngày khám" name="ngayKham">
              <Input type="date" disabled />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="Lý do khám" name="lyDoKham">
              <Input.TextArea rows={3} disabled defaultValue={editingRecord?.reasonForVisit} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="Tiền sử bệnh" name="tienSu" rules={[{ required: true }]}>
              <Input.TextArea rows={3} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="Chẩn đoán" name="chuanDoan" rules={[{ required: true }]}>
              <Input.TextArea rows={3} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="Kết luận" name="ketLuan" rules={[{ required: true }]}>
              <Input.TextArea rows={3} />
            </Form.Item>
          </Col>

          <Col span={24}>
            <h3 style={{ marginTop: 16, marginBottom: 8 }}>Đơn thuốc</h3>
            <Form.List name="donThuoc">
              {(fields, { add, remove }) => (
                <>
                  <Button onClick={() => add()} icon={<FaPlus />} block style={{ marginBottom: 10 }}>
                    Thêm thuốc
                  </Button>
                  {fields.map(({ key, name, ...restField }) => (
                    <Card key={key} size="small" style={{ marginBottom: 10 }}>
                      <Row gutter={16}>
                        <Col span={5}>
                          <Form.Item {...restField} name={[name, "tenThuoc"]} label="Tên thuốc" rules={[{ required: true }]}>
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col span={4}>
                          <Form.Item {...restField} name={[name, "lieuLuong"]} label="Liều lượng" rules={[{ required: true }]}>
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col span={4}>
                          <Form.Item {...restField} name={[name, "soLanDungTrongNgay"]} label="Lần/ngày" rules={[{ required: true }]}>
                            <InputNumber min={1} />
                          </Form.Item>
                        </Col>
                        <Col span={4}>
                          <Form.Item {...restField} name={[name, "soNgayDung"]} label="Số ngày" rules={[{ required: true }]}>
                            <InputNumber min={1} />
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item {...restField} name={[name, "ghiChu"]} label="Ghi chú">
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col span={1} style={{ display: "flex", alignItems: "center" }}>
                          <Button type="text" danger icon={<FaTrashAlt />} onClick={() => remove(name)} />
                        </Col>
                      </Row>
                    </Card>
                  ))}
                </>
              )}
            </Form.List>
          </Col>

          <Col span={24} style={{ textAlign: "center", marginTop: 20 }}>
            <Button type="primary" size="large" icon={<FaSave />} onClick={() => form.submit()}>
              Cập nhật kết quả khám
            </Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default ModalPhieuKham;
