import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../../store/slices/authSlice'; // Điều chỉnh đường dẫn nếu cần

const LoginSuccess = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        const username = params.get('username');
        const avatar = decodeURIComponent(params.get('avatar'));

        if (token && username && avatar) {
            localStorage.setItem('jwtToken', token); // Lưu token vào localStorage
            dispatch(login({ token, username, avatar })); // Dispatch action login với token
            navigate('/Home'); // Chuyển hướng đến trang chính
        } else {
            console.error('Token or username not found in URL');
        }
    }, [dispatch, navigate]);

    return (
        <div>
            Redirecting...
        </div>
    );
};

export default LoginSuccess;