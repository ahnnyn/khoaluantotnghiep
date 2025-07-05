const Footer = () => {
    return (
        <div className="rts-footer-area pt--50 pb--30 bg_light-1" style={{ backgroundColor: "#f5f5f5", marginTop: "50px" }}>
            <div className="container">
                <div className="row">
                    {/* Cột 1: Giới thiệu */}
                    <div className="col-md-4">
                        <h4>Hệ thống lịch hẹn bác sĩ</h4>
                        <p>
                            Nền tảng giúp bác sĩ và bệnh nhân kết nối dễ dàng, quản lý lịch hẹn hiệu quả.
                        </p>
                    </div>

                    {/* Cột 2: Liên kết nhanh */}
                    <div className="col-md-4">
                        <h4>Liên kết nhanh</h4>
                        <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
                            <li><a href="/" style={{ color: "#333" }}>Trang chủ</a></li>
                            <li><a href="/lich-hen" style={{ color: "#333" }}>Lịch hẹn</a></li>
                            <li><a href="/quan-ly-lich-lam-viec" style={{ color: "#333" }}>Lịch làm việc</a></li>
                            <li><a href="/ho-so" style={{ color: "#333" }}>Thông tin bác sĩ</a></li>
                        </ul>
                    </div>

                    {/* Cột 3: Thông tin liên hệ */}
                    <div className="col-md-4">
                        <h4>Liên hệ</h4>
                        <p>Email: <a href="mailto:contact@benhvien.com">contact@benhvien.com</a></p>
                        <p>Điện thoại: 0909 999 999</p>
                        <p>Địa chỉ: 123 Đường Sức Khỏe, Q.1, TP.HCM</p>
                    </div>
                </div>

                <hr style={{ margin: "20px 0" }} />

                <div className="text-center">
                    <p>© {new Date().getFullYear()} Bản quyền thuộc về <strong>Hệ thống lịch hẹn bác sĩ</strong></p>
                </div>
            </div>
        </div>
    );
};

export default Footer;
