import React from 'react';
import { Layout, Row, Col } from 'antd';
import { TwitterOutlined, InstagramOutlined, FacebookOutlined } from '@ant-design/icons';
import './index.css';

const { Footer } = Layout;

const AppFooter = () => {
    return (
        <Footer className="app-footer">
            <Row gutter={[16, 16]} className="footer-content">
                <Col xs={24} sm={12} md={6}>
                    <h3 className="footer-title">Wanderlust</h3>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <h3 className="footer-title">Company</h3>
                    <ul className="footer-list">
                        <li>About</li>
                        <li>Careers</li>
                        <li>Partnerships</li>
                        <li>Blog</li>
                        <li>Advertising</li>
                        <li>How we work</li>
                    </ul>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <h3 className="footer-title">Policies</h3>
                    <ul className="footer-list">
                        <li>Privacy</li>
                        <li>Terms of Use</li>
                        <li>Accessibility</li>
                        <li>Cookies</li>
                    </ul>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <h3 className="footer-title">Help</h3>
                    <ul className="footer-list">
                        <li>Support</li>
                        <li>Cancel your booking</li>
                        <li>Refund policies</li>
                        <li>Use a coupon</li>
                        <li>Travel documents</li>
                    </ul>
                </Col>
                <Col xs={24} className="footer-social">
                    <TwitterOutlined className="social-icon" />
                    <InstagramOutlined className="social-icon" />
                    <FacebookOutlined className="social-icon" />
                </Col>
            </Row>
            <div className="footer-bottom">
                © 2023 GlobGoer Inc.
            </div>
        </Footer>
    );
};

export default AppFooter;
