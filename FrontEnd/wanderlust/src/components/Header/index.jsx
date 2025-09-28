import React, { useState } from 'react';
import { Layout, Menu, Dropdown, Avatar, Space, Button } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import './index.css';
import { useNavigate } from 'react-router-dom';
import defaultAvatar from '../../../src/assets/images/avatar.jpeg';

const { Header } = Layout;

const AppHeader = () => {
    const navigate = useNavigate();
    const [user, setUser ] = useState(() => {
        const storedUser  = sessionStorage.getItem('user');
        return storedUser  ? JSON.parse(storedUser ) : null;
    });

    const handleLogout = () => {
        sessionStorage.clear(); // Clear session storage
        setUser (null); // Reset user state
        navigate('/login'); // Redirect to login page
    };

    const userMenu = (
        <Menu>
            <Menu.Item key="profile" onClick={() => navigate('/profile')}>
                <UserOutlined /> User Info
            </Menu.Item>
            <Menu.Item key="logout" onClick={handleLogout}>
                <LogoutOutlined /> Log Out
            </Menu.Item>
        </Menu>
    );

    return (
        <Header className="app-header">
            <div className="logo">
                Wanderlust
            </div>
            <Menu mode="horizontal" className="nav-menu">
                <Menu.Item key="flights">Vé máy bay</Menu.Item>
                <Menu.Item key="hotels">Khách sạn</Menu.Item>
                <Menu.Item key="visa">Visa</Menu.Item>
                <Menu.Item key="car">Thuê xe</Menu.Item>
                <Menu.Item key="activities">Hoạt động vui chơi</Menu.Item>
                <Menu.SubMenu title="Tin tức">
                    <Menu.Item key="news1">Tin tức 1</Menu.Item>
                    <Menu.Item key="news2">Tin tức 2</Menu.Item>
                </Menu.SubMenu>
            </Menu>
            <div className="auth-section">
                {user ? (
                    // <Dropdown overlay={userMenu} trigger={['click']}>
                    //     <Space>
                    //         <Avatar 
                    //             src={user.avatar || defaultAvatar} // Use default avatar if none is provided
                    //             icon={!user.avatar && <UserOutlined />}
                    //         />
                    //         <span>{user.name}</span>
                    //     </Space>
                    // </Dropdown>
                    <div className="logo">
                        ThanhAnh
                    </div>
                ) : (
                    <Space>
                        <Button type="link" onClick={() => navigate('/login')}>
                            Đăng nhập
                        </Button>
                        <Button type="primary" onClick={() => navigate('/register')}>
                            Đăng Ký
                        </Button>
                    </Space>
                )}
            </div>
        </Header>
    );
};

export default AppHeader;