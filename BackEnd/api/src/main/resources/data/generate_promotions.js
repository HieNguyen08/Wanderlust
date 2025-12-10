const fs = require('fs');
const path = require('path');

const categories = ['HOTEL', 'FLIGHT', 'CAR', 'ACTIVITY', 'ALL'];
const types = ['PERCENTAGE', 'FIXED_AMOUNT'];
const destinations = ['Toàn quốc', 'Đà Nẵng', 'Hội An', 'Phú Quốc', 'Hà Nội', 'TP. Hồ Chí Minh', 'Nha Trang', 'Đà Lạt', 'Sapa', 'Hạ Long', 'Huế'];
const badgeColors = ['bg-blue-600', 'bg-orange-600', 'bg-green-600', 'bg-purple-600', 'bg-red-600', 'bg-yellow-600'];

const images = [
    "https://images.unsplash.com/photo-1566073771259-6a8506099945",
    "https://images.unsplash.com/photo-1436491865332-7a61a109cc05",
    "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d",
    "https://images.unsplash.com/photo-1527004013197-933c4bb611b3",
    "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800",
    "https://images.unsplash.com/photo-1488646953014-85cb44e25828",
    "https://images.unsplash.com/photo-1502920917128-1aa500764cbd",
    "https://images.unsplash.com/photo-1544016768-982d1554f0b9",
    "https://images.unsplash.com/photo-1582719508461-905c673771fd",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
    "https://images.unsplash.com/photo-1528543606781-2f6e6857f318",
    "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1",
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
    "https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96",
    "https://images.unsplash.com/photo-1496417263034-38ec4f0d665a"
];

const titles = [
    "Chào hè rực rỡ", "Vi vu muôn nơi", "Khám phá Việt Nam", "Kỳ nghỉ trong mơ",
    "Ưu đãi đặc biệt", "Flash Sale cực sốc", "Cuối tuần vui vẻ", "Mùa lễ hội",
    "Du lịch tiết kiệm", "Trải nghiệm đẳng cấp", "Đặt sớm giá tốt", "Combo siêu hời"
];

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function generateCode(category, index) {
    const prefix = category === 'ALL' ? 'WANDER' : category.substring(0, 3).toUpperCase();
    return `${prefix}${randomInt(10, 99)}${String.fromCharCode(65 + randomInt(0, 25))}${index}`;
}

const promotions = [];

for (let i = 0; i < 100; i++) {
    const category = randomElement(categories);
    const type = randomElement(types);
    const destination = randomElement(destinations);

    let value, maxDiscount, minSpend, badge;

    if (type === 'PERCENTAGE') {
        value = randomElement([5, 10, 15, 20, 25, 30, 40, 50]);
        maxDiscount = randomElement([100000, 200000, 300000, 500000, 1000000]);
        minSpend = randomElement([500000, 1000000, 2000000, 3000000, 5000000]);
        badge = `GIẢM ${value}%`;
    } else {
        value = randomElement([50000, 100000, 200000, 300000, 500000]);
        maxDiscount = value;
        minSpend = value * randomInt(2, 5);
        badge = `GIẢM ${value.toLocaleString('vi-VN')}Đ`;
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - randomInt(0, 30));
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + randomInt(30, 90));

    const totalUsesLimit = randomElement([50, 100, 200, 500, 1000]);
    const usedCount = randomInt(0, totalUsesLimit * 0.8);

    const check = i % 5 === 0; // Admin create check roughly 20%

    promotions.push({
        code: generateCode(category, i),
        title: `${randomElement(titles)} - ${destination === 'Toàn quốc' ? 'Mọi miền' : destination}`,
        description: `Ưu đãi ${category === 'ALL' ? 'toàn sàn' : 'dịch vụ ' + category.toLowerCase()} áp dụng cho ${destination}. Đặt ngay kẻo lỡ!`,
        image: randomElement(images),
        type: type,
        value: value,
        maxDiscount: maxDiscount,
        minSpend: minSpend,
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        category: category,
        vendorId: check ? null : `vendor_${randomInt(1, 20)}`,
        adminCreateCheck: !check, // Dao nguoc logic phia tren ti
        destination: destination,
        badge: badge,
        badgeColor: randomElement(badgeColors),
        isFeatured: Math.random() < 0.2, // 20% featured
        totalUsesLimit: totalUsesLimit,
        usedCount: usedCount,
        conditions: [
            "Áp dụng cho khách hàng thành viên",
            `Đơn hàng tối thiểu ${minSpend.toLocaleString('vi-VN')}đ`,
            "Không áp dụng đồng thời với các khuyến mãi khác",
            "Có thể kết thúc sớm nếu hết lượt sử dụng"
        ],
        applicableServices: [] // Can populate if we had service IDs, keep empty for now
    });
}

// Ensure specific diverse types are present at top
promotions[0].isFeatured = true;
promotions[1].isFeatured = true;
promotions[2].isFeatured = true;
promotions[0].title = "SIÊU SALE ĐÓN HÈ";
promotions[0].value = 50;
promotions[0].type = "PERCENTAGE";
promotions[0].badge = "GIẢM 50%";

fs.writeFileSync(path.join(__dirname, 'promotions-new.json'), JSON.stringify(promotions, null, 2), 'utf8');

console.log("Generated 100 promotions in promotions-new.json");
