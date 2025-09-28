import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import LoginSuccess from './pages/Login/LoginSuccess'; // Đảm bảo đường dẫn chính xác
import Home from './pages/Home'; // Đảm bảo đường dẫn chính xác

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/login-success" element={<LoginSuccess />} />
                <Route path="/" element={<Home />} /> {/* Trang chính */}
                {/* Các route khác có thể thêm vào đây */}
            </Routes>
        </Router>
    );
};

export default App;