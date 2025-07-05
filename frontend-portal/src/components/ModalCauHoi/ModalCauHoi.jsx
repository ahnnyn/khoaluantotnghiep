import { Button, Checkbox, Col, Divider, Form, Input, message, Modal, Row } from "antd"
import { useEffect, useState } from "react"
import { FaRegCircleQuestion } from "react-icons/fa6"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { fetchAllDepartments } from "services/patient/patient.services"

const ModalCauHoi = (props) => {

    const {openModalCauHoi, setOpenModalCauHoi} = props
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [form] = Form.useForm()
    const [loading, setLoading] = useState(false);
    const [dataChuyenKhoa, setDataChuyenKhoa] = useState([])   

    useEffect(() => {
        fetchAllChuyenKhoaDoctor()
    }, [openModalCauHoi])

    const submitCauHoi = async (values) => {
        const {
            lastName, firstName, email, chuyenKhoaId, cauHoi
        } = values

        console.log("lastName, firstName, email, chuyenKhoaId, cauHoi: ",lastName, firstName, email, chuyenKhoaId, cauHoi);
        setLoading(true)
        let res = await handleCreateCauHoi(email, firstName, lastName, chuyenKhoaId, cauHoi)
        if(res && res.data) {
            message.success(res.message)
            cancel()
        }
        setLoading(false)        
    }

    const cancel = () => {
        setOpenModalCauHoi(false)
        form.resetFields()
    }

    const fetchAllChuyenKhoaDoctor = async () => {
        let query = `page=1&limit=1000`
        let res = await fetchAllDepartments(query)
        if(res && res.data) {
            setDataChuyenKhoa(res.data)
        }
    }

    console.log("dataChuyenKhoa: ", dataChuyenKhoa);
    
  return (
    <Modal title="Nhập câu hỏi" 
        open={openModalCauHoi} 
        // onOk={handleOk} 
        style={{top: 30}}
        onCancel={cancel}
        footer={null}
        width={700}
        maskClosable={false}
        >
            <Divider/>
            <Form
                form={form}
                layout="vertical"
                onFinish={submitCauHoi}                 
            >
                <Row gutter={[20,2]}>                        
                    <Col span={12} md={12} sm={24} xs={24}>
                        <Form.Item
                            labelCol={{span: 24}}
                            label="Họ"
                            name="lastName"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập đầy đủ thông tin!',
                                },
                                {
                                    required: false,
                                    pattern: new RegExp(/^[A-Za-zÀ-ỹ\s]+$/),
                                    message: 'Không được nhập số!',
                                },
                            ]}
                            hasFeedback
                        >
                            <Input placeholder="Nhập họ của bạn" />
                        </Form.Item>
                    </Col>
                    <Col span={12} md={12} sm={24} xs={24}>
                        <Form.Item
                            labelCol={{span: 24}}
                            label="Tên"
                            name="firstName"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập đầy đủ thông tin!',
                                },
                                {
                                    required: false,
                                    pattern: new RegExp(/^[A-Za-zÀ-ỹ\s]+$/),
                                    message: 'Không được nhập số!',
                                },
                            ]}
                            hasFeedback
                        >
                            <Input placeholder="Nhập tên của bạn" />
                        </Form.Item>
                    </Col>
                    <Col span={24} md={24} sm={24} xs={24}>
                        <Form.Item
                            label="Email"                                        
                            name="email"                                                
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập đầy đủ thông tin!',
                                },
                                {
                                    type: "email",
                                    message: 'Vui lòng nhập đúng định dạng địa chỉ email',
                                },

                            ]}
                            hasFeedback
                        ><Input placeholder="Nhập email của bạn" />
                        </Form.Item>
                    </Col>      

                    <Col span={24} md={24} sm={24} xs={24}>
                        <Form.Item
                            layout="vertical"
                            label="Chuyên khoa"
                            name="chuyenKhoaId"    
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn ít nhất 1 Chuyên khoa!',
                                },                                        
                            ]}                                
                        >
                            <Checkbox.Group>
                                {dataChuyenKhoa.map((chuyenKhoa) => (
                                    <Checkbox 
                                        style={{
                                            margin: "10px"
                                        }}
                                        key={chuyenKhoa._id}
                                        value={chuyenKhoa._id}
                                    >
                                        {chuyenKhoa.name}
                                    </Checkbox>
                                ))}
                            </Checkbox.Group>                                    
                        </Form.Item>
                    </Col>

                    <Col span={24} md={24} sm={24} xs={24}>
                        <Form.Item
                        label="Nhập câu hỏi?"
                        name="cauHoi"
                        rules={[{ required: true, message: 'Nhập câu hỏi?' }]}
                        >
                        <Input.TextArea rows={4} placeholder="Nhập câu hỏi?" />
                        </Form.Item>
                    </Col> 

                    <Col span={24} style={{display: "flex", justifyContent: "center"}}>
                        <Button onClick={() => form.submit()} type="primary" size="large" icon={<FaRegCircleQuestion size={25} />}>Tạo câu hỏi</Button>
                    </Col>
                </Row>
            </Form> 
        </Modal>
  )
}
export default ModalCauHoi