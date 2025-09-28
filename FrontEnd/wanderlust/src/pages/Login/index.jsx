import React, { useState } from 'react';
import { Layout, Form, Input, Button, Typography, Modal } from 'antd';
import { FacebookOutlined, GoogleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './index.css'; // Import CSS styles if needed

const { Content } = Layout;
const { Title, Text } = Typography;

const Login = () => {
    const navigate = useNavigate();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleLogin = async (values) => {
        console.log('Login values:', values);
        try {
            const response = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });
    
            const contentType = response.headers.get('Content-Type');
            
            if (!response.ok) {
                // Lấy thông báo lỗi nếu có
                const errorData = contentType?.includes('application/json')
                    ? await response.json()
                    : await response.text();
                throw new Error(errorData.message || errorData || 'Login failed');
            }
    
            // Nếu API trả về JSON
            let data;
            if (contentType?.includes('application/json')) {
                data = await response.json();
            } else {
                // Nếu API trả về plain text
                console.log('API response is plain text');
                data = { message: await response.text() };
            }
    
            console.log('Login success:', data);
    
            // Lưu thông tin người dùng và token vào sessionStorage
            if (data.token) sessionStorage.setItem('token', data.token);
            if (data.user) {
                sessionStorage.setItem('user', JSON.stringify(data.user));
            }
    
            // Điều hướng đến trang Home
            navigate('/Home');
        } catch (error) {
            setErrorMessage(error.message);
            setIsModalVisible(true);
            console.error('Login error:', error);
        }
    };
    

    const handleRegister = () => {
        // Chuyển hướng đến trang đăng ký
        console.log('Redirect to register page');
    };

    const handleForgotPassword = () => {
        // Chuyển hướng đến trang quên mật khẩu
        console.log('Redirect to forgot password page');
    };

    const redirectGoogleOAuth = () => {
        window.open('http://localhost:8080/oauth2/authorization/google', '_self');
    };

    const redirectFacebookOAuth = () => {
        window.open('http://localhost:8080/oauth2/authorization/facebook', '_self');
    };

    return (
        <Layout className="login-layout">
            <Content className="login-content">
                <div className="login-form-container">
                    <Title className="title-wanderlust" level={1}>Wanderlust</Title>
                    <Title level={3}>Login</Title>
                    <Form
                        name="login_form"
                        className="login-form"
                        initialValues={{ remember: true }}
                        onFinish={handleLogin}
                    >
                        <Form.Item
                            name="email"
                            rules={[{ required: true, message: 'Please input your email!' }]}
                        >
                            <Input placeholder="Email" />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[{ required: true, message: 'Please input your password!' }]}
                        >
                            <Input.Password placeholder="Password" />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                Log in
                            </Button>
                        </Form.Item>
                    </Form>
                    <div className="flex justify-between">
                        <Button type="link" onClick={handleForgotPassword}>
                            Forgot password?
                        </Button>
                        <Button type="link" onClick={handleRegister}>
                            Register
                        </Button>
                    </div>
                    <div className="text-3xl font-semibold mb-5">Or sign in with</div>
                    <div className="flex flex-col space-y-2">
                        <Button
                            onClick={redirectGoogleOAuth}
                            className="flex items-center justify-center px-6 py-2.5 rounded-full bg-white text-black font-medium hover:bg-gray-300 border border-gray-400"
                        >
                            <GoogleOutlined className="mr-2" />
                            Sign in with Google
                        </Button>
                        <Button
                            onClick={redirectFacebookOAuth}
                            className="flex items-center justify-center px-6 py-2.5 rounded-full bg-white text-black font-medium hover:bg-gray-300 border border-gray-400"
                        >
                            <FacebookOutlined className="mr-2" />
                            Sign in with Facebook
                        </Button>
                    </div>
                    <Modal
                        title="Login Error"
                        visible={isModalVisible}
                        onOk={() => setIsModalVisible(false)}
                        onCancel={() => setIsModalVisible(false)}
                    >
                        <p>{errorMessage}</p>
                    </Modal>
                </div>
            </Content>
        </Layout>
    );
};

export default Login;