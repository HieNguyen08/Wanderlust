import { useState } from "react";
import svgPaths from "./imports/svg-hwt49vcm5d";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Checkbox } from "./components/ui/checkbox";
import { Plane, Ticket, Briefcase, User, Luggage, Calendar, Plus, ChevronDown } from "lucide-react";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import type { PageType } from "./MainApp";

interface BookingDetailsPageProps {
  onNavigate: (page: PageType) => void;
}

// Trip Header
function TripHeader() {
  return (
    <div className="flex items-center gap-4 w-full">
      <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
        <Plane className="w-12 h-12 text-blue-600" />
      </div>
      <div>
        <p className="text-[32px]">Nairobi (NBI) → Mombasa (MBO)</p>
        <div className="flex gap-6 text-[16px] text-gray-600">
          <span>Sunday, 29th Jan</span>
          <span>• Non stop</span>
          <span>• 9hr 50min</span>
        </div>
      </div>
    </div>
  );
}

// Flight Summary Card
function FlightSummaryCard() {
  return (
    <div className="bg-white rounded shadow-lg p-4">
      <p className="text-lg mb-4">Flight Summary</p>
      
      {/* Airline Info */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <Plane className="w-5 h-5 text-blue-600" />
          </div>
          <span>ABC Airline</span>
        </div>
        <span className="text-red-600 text-sm">Không hoàn trả</span>
        <span className="text-sm">Hạng vé: <strong>Economy</strong></span>
      </div>

      {/* Flight Details */}
      <div className="bg-[#fff1e4] rounded p-4 mb-4">
        <p className="text-xs text-gray-600 mb-2">Sun, 29 Jan 2023</p>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg">NBI</p>
            <p className="text-sm">14.50</p>
            <p className="text-xs text-gray-600">Moi Intl, Mombasa, Kenya</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-sm mb-2">9hr 50min</p>
            <div className="relative w-[140px] h-[20px]">
              <div className="absolute inset-0 border-t border-b border-gray-300"></div>
              <Plane className="absolute left-1/2 -translate-x-1/2 w-4 h-4 text-blue-600" />
            </div>
          </div>
          <div>
            <p className="text-lg">MBO</p>
            <p className="text-sm">14.50</p>
            <p className="text-xs text-gray-600">JFK Terminal, Nairobi, Kenya</p>
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="flex gap-4 text-xs text-gray-600 mb-2">
        <span className="flex items-center gap-1">
          <Ticket className="w-3 h-3" />
          Ưu đãi khi mua vé theo nhóm
        </span>
        <span className="flex items-center gap-1">
          <Briefcase className="w-3 h-3" />
          Phí thay đổi giờ bay
        </span>
        <span className="flex items-center gap-1">
          <User className="w-3 h-3" />
          Phí vận chuyển hành lý
        </span>
        <span className="flex items-center gap-1">
          <Luggage className="w-3 h-3" />
          7kg
        </span>
      </div>

      <div className="bg-[#e9ecef] rounded p-2 text-xs">
        Xin cáo lỗi quý khách vì chưa có quy định chính sách về hành lý quá cân và hành lý ký gửi
      </div>
    </div>
  );
}

// Contact Details Card
function ContactDetailsCard() {
  return (
    <div className="bg-white rounded shadow-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <p className="text-lg">Thông tin liên lạc (Hóa đơn đặt chỗ chi tiết sẽ được gửi lại qua mail)</p>
        <ChevronDown className="w-4 h-4" />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm block mb-2">Số điện thoại</label>
          <div className="flex gap-2">
            <select className="border rounded p-2 w-32">
              <option>Mã quốc gia</option>
            </select>
            <Input placeholder="Mobile numbers" className="flex-1" />
          </div>
        </div>
        <div>
          <label className="text-sm block mb-2">Email</label>
          <Input placeholder="Email" />
        </div>
      </div>
    </div>
  );
}

// Passenger Card
function PassengerCard() {
  return (
    <div className="bg-white rounded shadow-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <p className="text-lg">Thông tin hành khách</p>
        <ChevronDown className="w-4 h-4" />
      </div>

      <div className="bg-white border rounded p-4 mb-4">
        <div className="flex justify-between items-center mb-4">
          <p className="">Hành khách phổ thông</p>
          <select className="border rounded p-2">
            <option>Người lớn (trên 12 tuổi)</option>
          </select>
        </div>

        <hr className="my-4" />

        <div className="bg-[#e7f5ff] border border-blue-200 rounded p-3 mb-4 text-sm">
          Đề nghị nhập chính xác và đầy đủ cả họ và tên của bạn được viết trong CCCD/ Hộ chiếu
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm block mb-2">Họ và tên đệm</label>
              <Input placeholder="e.g. John Doe" />
            </div>
            <div>
              <label className="text-sm block mb-2">Tên</label>
              <Input placeholder="e.g. Bobby" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm block mb-2">Quốc tịch</label>
              <select className="border rounded p-2 w-full">
                <option>Chọn</option>
              </select>
            </div>
            <div>
              <label className="text-sm block mb-2">Giới tính</label>
              <select className="border rounded p-2 w-full">
                <option>Chọn</option>
              </select>
            </div>
            <div>
              <label className="text-sm block mb-2">Ngày/ tháng / năm sinh</label>
              <div className="relative">
                <Input placeholder="dd/mm/yyyy" />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm block mb-2">Số hộ chiếu</label>
              <Input placeholder="Passport number..." />
            </div>
            <div>
              <label className="text-sm block mb-2">Ngày hết hạn</label>
              <div className="relative">
                <Input placeholder="dd/mm/yyyy" />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
              <label className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                <Checkbox />
                No expiration
              </label>
            </div>
          </div>
        </div>

        <div className="bg-[#e9ecef] rounded p-3 mt-4 text-sm">
          <p className="">Thông tin về quy định hành lý xách tay</p>
          <p className="text-gray-600 mt-1">Được phép mang theo hành lý xách tay không quá 7 cân.</p>
        </div>
      </div>

      <div className="flex justify-end">
        <Button variant="outline" className="text-[#0194f3] border-[#0194f3]">
          <Plus className="w-4 h-4 mr-2" />
          Thêm hành khách
        </Button>
      </div>
    </div>
  );
}

// Fare Summary Sidebar
function FareSummary() {
  return (
    <div className="bg-white rounded shadow-lg p-4 w-[333px]">
      <p className="text-lg mb-4">Hóa đơn tạm tính</p>

      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <ChevronDown className="w-4 h-4" />
            <p className="">Base fare</p>
          </div>
          <div className="flex justify-between text-sm">
            <span>Người lớn (1 x $110)</span>
            <span>$110</span>
          </div>
        </div>

        <hr />

        <div>
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <ChevronDown className="w-4 h-4" />
              <p className="">Phụ phí, thuế và thủ tục</p>
            </div>
            <span>$23</span>
          </div>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Thuế thủ tục</span>
              <span>$17.3</span>
            </div>
            <div className="flex justify-between">
              <span>Phí dịch vụ</span>
              <span>$6</span>
            </div>
          </div>
        </div>

        <hr />

        <div>
          <div className="flex items-center gap-2 mb-2">
            <ChevronDown className="w-4 h-4" />
            <p className="">Dịch vụ khác</p>
          </div>
          <div className="flex justify-between text-sm">
            <span>Từ thiện</span>
            <span>$5</span>
          </div>
        </div>

        <hr />

        <div className="flex justify-between text-lg">
          <span>Tổng hóa đơn</span>
          <span>$139</span>
        </div>
      </div>
    </div>
  );
}

// Footer
function BookingFooter({ onNavigate }: { onNavigate?: (page: string) => void }) {
  return (
    <footer className="bg-[#153a43] text-white py-16">
      <div className="max-w-[1200px] mx-auto px-[120px]">
        <div className="grid grid-cols-5 gap-8 mb-12">
          <div>
            <button 
              onClick={() => onNavigate?.("home")}
              className="text-[32px] font-['Kadwa'] mb-4 hover:opacity-80 transition-opacity"
            >
              Wanderlust
            </button>
          </div>
          <div>
            <h4 className="text-lg mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors">About</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg mb-4">Policies</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Use</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg mb-4">Help</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Refund policies</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg mb-4">More</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors">Airlines</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Low fare trips</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6 flex items-center justify-between">
          <div className="flex gap-5">
            {[svgPaths.pfb1df80, svgPaths.p2837cb00, svgPaths.p26841d31].map((path, i) => (
              <a key={i} href="#" className="hover:text-yellow-300 transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d={path} />
                </svg>
              </a>
            ))}
          </div>
          <p className="text-sm text-gray-400">© 2023 GlobGoer Inc.</p>
        </div>
      </div>
    </footer>
  );
}

// Main Component
export default function BookingDetailsPage({ onNavigate }: BookingDetailsPageProps) {
  return (
    <div className="bg-white min-h-screen">
      <Header currentPage="booking" onNavigate={onNavigate} />

      <div className="max-w-[1440px] mx-auto px-[120px] py-8">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-600 mb-4">
          Flight Summary - Important Guidelines - Contact Details - Passengers - Cancellation Policy
        </div>

        <p className="text-[32px] mb-8 text-center">Nhập thông tin đặt chỗ</p>

        <div className="flex gap-8">
          {/* Main Content */}
          <div className="flex-1 space-y-8">
            <TripHeader />
            <FlightSummaryCard />
            
            <div className="bg-white rounded shadow-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <p className="text-lg">Hướng dẫn quan trọng</p>
                <ChevronDown className="w-4 h-4" />
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Khi đặt vé máy bay, điều quan trọng là hành khách phải tuân theo một số nguyên tắc nhất định để đảm bảo trải nghiệm suôn sẻ và không căng thẳng...
              </p>
              <Button variant="link" className="text-[#0194f3]">Xem thêm</Button>
            </div>

            <ContactDetailsCard />
            <PassengerCard />

            <div className="bg-white rounded shadow-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <p className="text-lg">Chính sách hoàn trả/ hủy/ đổi vé</p>
                <ChevronDown className="w-4 h-4" />
              </div>
              <p className="text-sm text-gray-600">
                Tại GlobGoer, chúng tôi hiểu rằng kế hoạch có thể thay đổi bất ngờ...
              </p>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" className="text-[#482a89]">Cancel</Button>
              <Button 
                className="bg-[#5d36af] hover:bg-[#4a2a89] text-white"
                onClick={() => onNavigate?.("confirmation")}
              >
                Proceed to Payment
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <FareSummary />
        </div>
      </div>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
