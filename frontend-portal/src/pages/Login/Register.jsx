import { Button, Col, Divider, Form, Input, message, Modal, notification, Radio, Row, DatePicker, Upload  } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUser } from "services/auth.user/user.auth.services";
import "./register.scss";
const RegisterPage = ({setOpenRegisterKH, openRegisterKH}) => {

    const [formRegister] = Form.useForm();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const onFinish = async (values) => {
        setIsLoading(true);
    
        try {
            const { hoTen, email, soDienThoai, username, matKhau } = values;
    
            // Biểu thức kiểm tra
            const nameRegex = /^[A-Za-zÀ-ỹ\s]+$/;
            const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
            const phoneRegex = /^0\d{9}$/;
            const usernameRegex = /^[a-zA-Z0-9@_]+$/;
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    
            // Kiểm tra từng trường
            if (!nameRegex.test(hoTen)) {
                message.error("Họ tên chỉ được chứa chữ cái và khoảng trắng!");
                setIsLoading(false);
                return;
            }
    
            if (!emailRegex.test(email)) {
                message.error("Email không hợp lệ! Phải là địa chỉ @gmail.com");
                setIsLoading(false);
                return;
            }
    
            if (!phoneRegex.test(soDienThoai)) {
                message.error("Số điện thoại phải bắt đầu bằng số 0 và có đúng 10 chữ số!");
                setIsLoading(false);
                return;
            }
    
            if (!usernameRegex.test(username)) {
                message.error("Username chỉ được chứa chữ cái, số, @ và _");
                setIsLoading(false);
                return;
            }
    
            if (!passwordRegex.test(matKhau)) {
                message.error("Mật khẩu phải có ít nhất 8 ký tự, bao gồm hoa, thường, số và ký tự đặc biệt!");
                setIsLoading(false);
                return;
            }
    
            // Gọi API nếu hợp lệ
            const res = await createUser(email, hoTen, soDienThoai, username, matKhau);
    
            console.log("API Response: ", res);
            if (res.success) {
                message.success(res.message);
                formRegister.resetFields();
                setOpenRegisterKH(false);
                notification.success({
                    message: "Đăng ký thành công!",
                    duration: 3,
                });
                setTimeout(() => {
                    navigate("/");
                }, 2000);
            } else {
                notification.error({
                    message: "Đăng ký không thành công!",
                    description: res.message || "Thông tin đăng ký không đúng.",
                    duration: 5,
                });
            }
        } catch (error) {
            notification.error({ message: "Lỗi hệ thống", description: error.message });
        } finally {
            setIsLoading(false);
        }
    };
    

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    // Hàm để tạo mật khẩu ngẫu nhiên
    const generateRandomPassword = (length) => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+';
        let matKhau = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            matKhau += characters[randomIndex];
        }
        return matKhau;
    };

    const handleCancel = () => {
        setOpenRegisterKH(false)
    }

    return (
        <Modal
            // title="Đăng Ký Tài Khoản Cho Bệnh Nhân"
            open={openRegisterKH}
            onCancel={() => handleCancel()}
            maskClosable={false}
            width={600}
            footer={null}
        > 
            <Form      
                form={formRegister} 
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                layout="vertical"
                className="register-form-container"
            >
                <h3 className="register-form-title">Đăng ký tài khoản</h3>
                <Divider />
                <Row gutter={[20, 20]}>
                    <Col span={24}>
                        <Form.Item
                        labelCol={{ span: 24 }}
                        label="Họ tên"
                        name="hoTen"
                        rules={[
                            { required: true, message: 'Vui lòng nhập họ tên!' },
                            {
                            pattern: /^[A-Za-zÀ-ỹ\s]+$/,
                            message: 'Họ tên chỉ được chứa chữ và khoảng trắng!',
                            },
                        ]}
                        hasFeedback
                        >
                        <Input />
                        </Form.Item>
                    </Col>

                    <Col span={24}>
                        <Form.Item
                        labelCol={{ span: 24 }}
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: 'Vui lòng nhập email!' },
                            {
                            pattern: /^[a-zA-Z0-9._%+-]+@gmail\.com$/,
                            message: 'Email phải có đuôi @gmail.com',
                            },
                        ]}
                        hasFeedback
                        >
                        <Input />
                        </Form.Item>
                    </Col>

                    <Col span={24}>
                        <Form.Item
                        labelCol={{ span: 24 }}
                        label="Username"
                        name="username"
                        rules={[
                            { required: true, message: 'Vui lòng nhập username!' },
                            {
                            pattern: /^[a-zA-Z0-9@_]+$/,
                            message: 'Username chỉ được chứa chữ cái, số, @ và _',
                            },
                        ]}
                        hasFeedback
                        >
                        <Input />
                        </Form.Item>
                    </Col>

                    <Col span={24}>
                        <Form.Item
                        labelCol={{ span: 24 }}
                        label="Mật khẩu"
                        name="matKhau"
                        rules={[
                            { required: true, message: 'Vui lòng nhập mật khẩu!' },
                            {
                            pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                            message:
                                'Mật khẩu phải có ít nhất 8 ký tự, bao gồm hoa, thường, số, và ký tự đặc biệt!',
                            },
                        ]}
                        hasFeedback
                        >
                        <Input.Password />
                        </Form.Item>
                    </Col>

                    <Col span={24}>
                        <Form.Item
                        labelCol={{ span: 24 }}
                        label="Số điện thoại"
                        name="soDienThoai"
                        rules={[
                            { required: true, message: 'Vui lòng nhập số điện thoại!' },
                            {
                            pattern: /^0\d{9}$/,
                            message: 'Số điện thoại phải có 10 chữ số và bắt đầu bằng 0!',
                            },
                        ]}
                        hasFeedback
                        >
                        <Input />
                        </Form.Item>
                    </Col>
                    </Row>
                <Form.Item>
                    <div className="register-button-group">
                        <Button type="primary" onClick={() => formRegister.submit()} loading={isLoading}> Đăng ký tài khoản</Button>

                        <Button type="primary" danger onClick={() => {
                            console.log("check form: ", formRegister.getFieldsValue());
                            // form.getFieldsValue()
                            const randomPassword = generateRandomPassword(10); // Sinh mật khẩu với độ dài 10 ký tự
                            formRegister.setFieldsValue({
                                matKhau: randomPassword,
                            })
                        }}>Tự tạo mật khẩu</Button>
                    </div>
                </Form.Item>
            </Form> 
        </Modal>
    )
}
export default RegisterPage