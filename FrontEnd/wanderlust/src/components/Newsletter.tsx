import { Mail } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export function Newsletter() {
  return (
    <section className="py-20 px-6 bg-gradient-to-r from-blue-600 to-blue-800">
      <div className="max-w-4xl mx-auto text-center text-white">
        <Mail className="w-16 h-16 mx-auto mb-4" />
        <h2 className="mb-4 text-white">Đăng ký nhận tin khuyến mãi</h2>
        <p className="mb-8 text-blue-100">
          Nhận ngay các ưu đãi đặc biệt và thông tin về các chuyến du lịch hấp dẫn
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <Input
            type="email"
            placeholder="Nhập email của bạn"
            className="flex-1 bg-white text-black"
          />
          <Button className="bg-yellow-500 hover:bg-yellow-600 text-black px-8">
            Đăng ký
          </Button>
        </div>
        
        <p className="mt-4 text-sm text-blue-200">
          Bằng cách đăng ký, bạn đồng ý với điều khoản sử dụng của chúng tôi
        </p>
      </div>
    </section>
  );
}
