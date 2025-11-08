import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Nguyễn Minh Anh",
    location: "Hà Nội",
    image: "https://images.unsplash.com/photo-1622646771382-1c9c090d3c37?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMHRyYXZlbGVyJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzU5OTEwMTU2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    rating: 5,
    comment: "Trải nghiệm tuyệt vời! Dịch vụ chuyên nghiệp, giá cả hợp lý. Tôi đã có chuyến đi Paris đáng nhớ nhất đời."
  },
  {
    id: 2,
    name: "Trần Thị Hương",
    location: "TP. Hồ Chí Minh",
    image: "https://images.unsplash.com/photo-1585554414787-09b821c321c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHdvbWFuJTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc1OTk1MTYzOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    rating: 5,
    comment: "Website dễ sử dụng, booking nhanh chóng. Đội ngũ hỗ trợ nhiệt tình, tư vấn chi tiết. Rất hài lòng!"
  },
  {
    id: 3,
    name: "Lê Văn Hùng",
    location: "Đà Nẵng",
    image: "https://images.unsplash.com/photo-1622646771382-1c9c090d3c37?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMHRyYXZlbGVyJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzU5OTEwMTU2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    rating: 5,
    comment: "Tôi đã đặt tour Nhật Bản cho gia đình. Mọi thứ đều hoàn hảo từ A-Z. Chắc chắn sẽ quay lại!"
  }
];

export function Testimonials() {
  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-red-600 mb-2">Khách hàng nói gì về chúng tôi</h2>
        <p className="text-gray-600">Hơn 10,000+ khách hàng hài lòng</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((testimonial) => (
          <div 
            key={testimonial.id}
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex items-center mb-4">
              <ImageWithFallback
                src={testimonial.image}
                alt={testimonial.name}
                className="w-16 h-16 rounded-full object-cover mr-4"
              />
              <div>
                <h4 className="mb-1">{testimonial.name}</h4>
                <p className="text-sm text-gray-500">{testimonial.location}</p>
              </div>
            </div>
            
            <div className="flex mb-3">
              {[...Array(testimonial.rating)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            
            <p className="text-gray-600 text-sm italic">"{testimonial.comment}"</p>
          </div>
        ))}
      </div>
    </section>
  );
}
