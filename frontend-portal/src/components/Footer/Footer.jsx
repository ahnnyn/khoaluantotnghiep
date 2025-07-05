import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone,faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faFacebook, faTwitter, faInstagram, faLinkedin } from "@fortawesome/free-brands-svg-icons";

import "./Footer.css";

function Footer() {
  return (
    <div className="footer-container">
      <div className="footer">
        {/* Cột 1: Logo + Giới thiệu */}
        <div className="footer-col about">
          <h3 className="logo">MediCare+</h3>
          <p className="description">
            Healio - Chăm sóc sức khỏe của bạn mọi lúc mọi nơi
          </p>
          <div className="contact">
            <p>Liên hệ với chúng tôi</p>
            <FontAwesomeIcon icon={faPhone} className="icon" />
            <span className="phone">+01 123 456 7890</span>
          </div>
        </div>

        {/* Cột 2: Quick Links */}
        <div className="footer-col about">
          <h4>Quick Links</h4>
          <ul>
            <li>Về chúng tôi</li>
            <li>Dịch vụ</li>
            <li>Đặt lịch</li>
            <li>bài viết</li>
          </ul>
        </div>

        {/* Cột 3: Our Services */}
        <div className="footer-col about">
          <h4>Dịch vụ của chúng tôi</h4>
          <ul>
            <li>Đặt lịch khám tại bệnh viện</li>
            <li>Đặt lịch tư vấn trực tuyến</li>
          </ul>
        </div>

        {/* Cột 4: Subscribe */}
        <div className="footer-col subscribe">
          <h4>Subscribe</h4>
          <input type="email" placeholder="Email Address" className="email-input" />
          <button className="subscribe-btn">Đăng ký ngay</button>
          <div className="social-icons">
            <FontAwesomeIcon icon={faFacebook} />
            <FontAwesomeIcon icon={faTwitter} />
            <FontAwesomeIcon icon={faInstagram} />
            <FontAwesomeIcon icon={faLinkedin} />
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="footer-bottom">
        <p>Copyright © 2025 Design & Developed by AD's Team</p>
      </div>
    </div>
  );
}

export default Footer;
