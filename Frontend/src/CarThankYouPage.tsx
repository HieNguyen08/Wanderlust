import { ImageWithFallback } from "./components/figma/ImageWithFallback";
import { ChevronDown, CheckCircle, Plane, Hotel, Car, Compass, Gift, BookOpen } from "lucide-react";
import { Button } from "./components/ui/button";
import type { PageType } from "./MainApp";
import { MoreDropdown } from "./TravelGuidePage";
import { Footer } from "./components/Footer";

interface CarThankYouPageProps {
  car: {
    name: string;
    price: number;
  };
  onNavigate: (page: PageType, data?: any) => void;
}

export default function CarThankYouPage({ car, onNavigate }: CarThankYouPageProps) {
  const features = [
    {
      icon: Plane,
      title: "Vé máy bay",
      description: "Đặt vé máy bay với giá ưu đãi",
      onClick: () => onNavigate("flights"),
    },
    {
      icon: Hotel,
      title: "Khách sạn",
      description: "Tìm khách sạn phù hợp với bạn",
      onClick: () => onNavigate("hotel"),
    },
    {
      icon: Compass,
      title: "Hoạt động vui chơi",
      description: "Khám phá điểm đến của bạn",
      onClick: () => onNavigate("activities"),
    },
    {
      icon: Gift,
      title: "Chương trình khuyến mãi",
      description: "Tiết kiệm với các ưu đãi",
      onClick: () => onNavigate("promotions"),
    },
    {
      icon: BookOpen,
      title: "Cẩm nang du lịch",
      description: "Mẹo du lịch hữu ích",
      onClick: () => onNavigate("travel-guide"),
    },
    {
      icon: Car,
      title: "Thuê xe khác",
      description: "Xem thêm xe để thuê",
      onClick: () => onNavigate("car-list"),
    },
  ];

  return (
    <div className="min-h-screen bg-[#f6f7f9]">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between py-4">
            <h1 
              className="font-['Kadwa',_serif] text-2xl md:text-3xl text-white drop-shadow-lg cursor-pointer" 
              onClick={() => onNavigate("home")}
            >
              Wanderlust
            </h1>
            
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all px-4 py-2 rounded-lg">
                <div className="w-5 h-5 bg-red-600 rounded-full"></div>
                <span className="text-white">VI</span>
                <ChevronDown className="w-4 h-4 text-white" />
              </button>
              <div className="hidden md:flex gap-3">
                <Button variant="outline" className="bg-white hover:bg-gray-50 text-blue-600 border-none px-6 h-[38px]">
                  Đăng nhập
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 h-[38px]">
                  Đăng ký
                </Button>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex gap-6 lg:gap-8 text-white drop-shadow-lg pb-4">
            <button onClick={() => onNavigate("flights")} className="hover:text-yellow-300 transition-colors">Vé máy bay</button>
            <button onClick={() => onNavigate("hotel")} className="hover:text-yellow-300 transition-colors">Khách sạn</button>
            <button className="hover:text-yellow-300 transition-colors">Visa</button>
            <button className="text-yellow-300 font-semibold">Thuê xe</button>
            <button onClick={() => onNavigate("activities")} className="hover:text-yellow-300 transition-colors">Hoạt động vui chơi</button>
            <button onClick={() => onNavigate("travel-guide")} className="hover:text-yellow-300 transition-colors">Cẩm nang du lịch</button>
          </nav>
        </div>
      </div>

      {/* Success Section */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-16">
        <div className="bg-white rounded-2xl p-12 text-center shadow-lg">
          {/* Success Icon */}
          <div className="flex justify-center mb-8">
            <div className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-20 h-20 text-green-600" />
            </div>
          </div>

          {/* Success Message */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Đặt xe thành công!
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Cảm ơn bạn đã tin tưởng và sử dụng dịch vụ của Wanderlust
          </p>

          {/* Booking Details */}
          <div className="bg-blue-50 rounded-xl p-6 mb-8 max-w-md mx-auto">
            <div className="text-left space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Xe thuê:</span>
                <span className="font-semibold text-gray-900">{car.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Giá thuê:</span>
                <span className="font-semibold text-gray-900">${car.price}.00/ngày</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Trạng thái:</span>
                <span className="font-semibold text-green-600">Đã xác nhận</span>
              </div>
            </div>
          </div>

          {/* Confirmation Email Notice */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
            <p className="text-sm text-yellow-800">
              📧 Email xác nhận đã được gửi đến hộp thư của bạn. Vui lòng kiểm tra email để xem chi tiết đặt xe.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => onNavigate("home")} className="bg-blue-600 hover:bg-blue-700 text-white px-8">
              Về trang chủ
            </Button>
            <Button onClick={() => onNavigate("car-list")} variant="outline" className="px-8">
              Thuê xe khác
            </Button>
          </div>
        </div>

        {/* Explore More Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
            Khám phá thêm dịch vụ
          </h2>
          <p className="text-center text-gray-600 mb-8">
            Tiếp tục khám phá các tính năng khác của Wanderlust
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                onClick={feature.onClick}
                className="bg-white rounded-xl p-6 hover:shadow-xl transition-all cursor-pointer group"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors">
                  <feature.icon className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center">
          <p className="text-xl mb-4">
            "Trải nghiệm tuyệt vời! Dịch vụ chuyên nghiệp và xe chất lượng cao."
          </p>
          <p className="text-blue-100">
            - Khách hàng của Wanderlust
          </p>
        </div>

        {/* Newsletter */}
        <div className="mt-12 bg-white rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Đăng ký nhận ưu đãi
          </h3>
          <p className="text-gray-600 mb-6">
            Nhận thông tin về các chương trình khuyến mãi và ưu đãi độc quyền
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Email của bạn"
              className="flex-1 px-4 py-3 border rounded-lg"
            />
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Đăng ký
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
