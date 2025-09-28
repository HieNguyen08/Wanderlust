import React from 'react';
import AppHeader from "../../components/Header/index";
import AppFooter from "../../components/Footer/index";
import './index.css';

const Home = () => {
    const promotions = [
        { title: 'Vé máy bay', discount: '25%', img: './src/assets/images/uuvemaybay.png' },
        { title: 'Hoạt động du lịch', discount: '25%', img: './src/assets/images/uudaidulich.png' },
        { title: 'Khách sạn', discount: '25%', img: './src/assets/images/uudaikhachsan.png' },
        { title: 'Ưu đãi ngân hàng', discount: '300K', img: './src/assets/images/uudai.png' },
    ];

    return (
        <div className="home-container">
            <AppHeader />
            <div className="banner">
                <h1>Từ Đông Nam Á đến thế giới, trong tầm tay bạn</h1>
                <div className="search-bar">
                    <input placeholder="Hồ Tràm" />
                    <input placeholder="Ngày nhận phòng - Ngày trả phòng" />
                    <input placeholder="2 người lớn - 0 trẻ em - 1 phòng" />
                    <button>Tìm</button>
                </div>
            </div>
            <div className="promotion-section">
                <h2>Săn Sale</h2>
                <div className="promotion-list">
                    {promotions.map((promo, index) => (
                        <div className="promotion-item" key={index}>
                            <img className="image" src={promo.img} alt={promo.title} />
                            <h3>{promo.title}</h3>
                            <p>{promo.discount}</p>
                        </div>
                    ))}
                </div>
            </div>
            <AppFooter />
        </div>
    );
};

export default Home;
