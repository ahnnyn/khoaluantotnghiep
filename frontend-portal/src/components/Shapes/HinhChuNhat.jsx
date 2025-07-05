import { Col, Row } from "antd";

const HinhChuNhat = ({ icon, txtP, onClick }) => {
    return (
        <div
            className="cursor-pointer hcn-toan-dien hover:shadow-xl transform hover:scale-105 transition-all duration-300 p-4 rounded-lg bg-whitecursor-pointer hcn-toan-dien hover:shadow-xl transform hover:scale-105 transition-all duration-300 p-4 rounded-lg bg-white"
            onClick={onClick} // ← Thêm dòng này để bắt sự kiện click
        >
            <Row align="middle">
                {/* Icon */}
                <Col md={6} sm={8} xs={8} className="flex justify-center">
                    <div className="boc-ngoai-Imghcn flex items-center justify-center rounded-full bg-gray-200 p-3">
                        {typeof icon === "string" ? (
                            <img className="w-[8vh] h-[8vh]" src={icon} alt="icon" />
                        ) : (
                            <div className="text-blue-500 text-[6vh]">{icon}</div>
                        )}
                    </div>
                </Col>

                {/* Text */}
                <Col md={18} sm={16} xs={16} className="flex items-center">
                    <p style={{ fontSize: "3vh", fontWeight: "500", textAlign: "start", lineHeight: "6vh" }}>
                        {txtP}
                    </p>
                </Col>
            </Row>
        </div>
    );
};

export default HinhChuNhat;
