import { Plane, Shield, DollarSign, Clock } from "lucide-react";

const features = [
  {
    icon: Plane,
    title: "Đa dạng lựa chọn",
    description: "Hàng nghìn điểm đến trên toàn thế giới với giá tốt nhất"
  },
  {
    icon: Shield,
    title: "An toàn & Tin cậy",
    description: "Đảm bảo an toàn cho mọi chuyến đi của bạn"
  },
  {
    icon: DollarSign,
    title: "Giá tốt nhất",
    description: "Cam kết giá rẻ nhất thị trường, hoàn tiền nếu tìm thấy giá thấp hơn"
  },
  {
    icon: Clock,
    title: "Hỗ trợ 24/7",
    description: "Đội ngũ chăm sóc khách hàng luôn sẵn sàng hỗ trợ bạn"
  }
];

export function WhyChooseUs() {
  return (
    <section className="py-20 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-red-600 mb-2">Tại sao chọn Wanderlust?</h2>
          <p className="text-gray-600">Chúng tôi mang đến trải nghiệm du lịch tuyệt vời nhất</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index}
                className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-blue-100 rounded-full">
                  <Icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
