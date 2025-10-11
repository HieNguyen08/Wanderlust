import { useState } from "react";
import svgPaths from "./imports/svg-mi4c78h33s";
import { Button } from "./components/ui/button";
import { Plane, Ticket, Briefcase, User, Luggage, Calendar, Printer, Download, Share2, ChevronDown } from "lucide-react";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import type { PageType } from "./MainApp";

interface ConfirmationPageProps {
  onNavigate: (page: PageType) => void;
}

// Trip Header with Actions
function TripHeaderWithActions({ onNavigate }: { onNavigate?: (page: string) => void }) {
  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-4">
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
      
      <div className="flex gap-2">
        <Button variant="outline" className="text-[#0194f3] border-[#0194f3]">
          <Printer className="w-4 h-4 mr-2" />
          In vé
        </Button>
        <Button variant="outline" className="text-[#0194f3] border-[#0194f3]">
          <Download className="w-4 h-4 mr-2" />
          Tải bản điện tử
        </Button>
        <Button 
          variant="outline" 
          className="text-[#0194f3] border-[#0194f3]"
          onClick={() => onNavigate?.("offers")}
        >
          <Share2 className="w-4 h-4 mr-2" />
          Chia sẻ chuyến đi
        </Button>
      </div>
    </div>
  );
}

// Flight Trip Summary
function FlightTripSummary() {
  return (
    <div className="bg-white rounded shadow-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <p className="text-lg">Hành trình chuyến bay</p>
        <ChevronDown className="w-4 h-4" />
      </div>

      {/* Airline Info */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <Plane className="w-5 h-5 text-blue-600" />
          </div>
          <span>ABC Airline</span>
        </div>
        <span className="text-red-600 text-sm">Không hoàn phí</span>
        <span className="text-sm">Hạng vé: <strong>Economy</strong></span>
      </div>

      {/* Flight Details */}
      <div className="bg-[#fff1e4] rounded p-4 mb-4">
        <p className="text-xs text-gray-600 mb-2">Sun, 29 Jan 2023</p>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg">NBI</p>
            <p className="text-sm">14.50</p>
            <p className="text-xs text-gray-600">Sun, 29 Jan 2023</p>
            <p className="text-xs text-gray-600">Moi Intl, Mombasa, Kenya</p>
            <p className="text-xs text-gray-600">Terminal - 2, Gate - 25</p>
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
            <p className="text-xs text-gray-600">Sun, 29 Jan 2023</p>
            <p className="text-xs text-gray-600">JFK Terminal, Nairobi, Kenya</p>
            <p className="text-xs text-gray-600">Terminal - 2, Gate - 25</p>
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

// Contact Details Display
function ContactDetailsDisplay() {
  return (
    <div className="bg-white rounded shadow-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <p className="text-lg">Thông tin liên lạc (Hóa đơn đặt chỗ chi tiết sẽ được gửi lại qua mail)</p>
        <ChevronDown className="w-4 h-4" />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm block mb-2 text-gray-600">Số điện thoại</label>
          <p className="text-sm">+84 123 456 789</p>
        </div>
        <div>
          <label className="text-sm block mb-2 text-gray-600">Email</label>
          <p className="text-sm">example@email.com</p>
        </div>
      </div>
    </div>
  );
}

// Passenger Info Display
function PassengerInfoDisplay() {
  return (
    <div className="bg-white rounded shadow-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <p className="text-lg">Thông tin hành khách</p>
        <ChevronDown className="w-4 h-4" />
      </div>

      <div className="bg-white border rounded p-4">
        <div className="flex justify-between items-center mb-4">
          <p className="">Hành khách phổ thông</p>
          <span className="text-sm text-gray-600">Người lớn (trên 12 tuổi)</span>
        </div>

        <hr className="my-4" />

        <div className="bg-[#e7f5ff] border border-blue-200 rounded p-3 mb-4 text-sm">
          Đề nghị nhập chính xác và đầy đủ cả họ và tên của bạn được viết trong CCCD/ Hộ chiếu
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Họ và tên đệm:</span>
            <p>Nguyen Van</p>
          </div>
          <div>
            <span className="text-gray-600">Tên:</span>
            <p>An</p>
          </div>
          <div>
            <span className="text-gray-600">Quốc tịch:</span>
            <p>Việt Nam</p>
          </div>
          <div>
            <span className="text-gray-600">Giới tính:</span>
            <p>Nam</p>
          </div>
          <div>
            <span className="text-gray-600">Ngày sinh:</span>
            <p>01/01/1990</p>
          </div>
          <div>
            <span className="text-gray-600">Số hộ chiếu:</span>
            <p>A1234567</p>
          </div>
        </div>

        <div className="bg-[#e9ecef] rounded p-3 mt-4 text-sm">
          <p className="">Thông tin về quy định hành lý xách tay</p>
          <p className="text-gray-600 mt-1">Được phép mang theo hành lý xách tay không quá 7 cân.</p>
        </div>
      </div>
    </div>
  );
}

// Footer
function ConfirmationFooter({ onNavigate }: { onNavigate?: (page: string) => void }) {
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
export default function ConfirmationPage({ onNavigate }: ConfirmationPageProps) {
  return (
    <div className="bg-white min-h-screen">
      <Header currentPage="confirmation" onNavigate={onNavigate} />

      <div className="max-w-[1080px] mx-auto px-6 py-8">
        <p className="text-[32px] mb-8 text-center">Xác nhận đặt chỗ</p>

        <div className="space-y-8">
          <TripHeaderWithActions onNavigate={onNavigate} />
          <FlightTripSummary />
          <ContactDetailsDisplay />
          <PassengerInfoDisplay />
        </div>

        {/* Success Message */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mt-8 text-center">
          <div className="text-green-600 text-5xl mb-4">✓</div>
          <h3 className="text-2xl mb-2 text-green-800">Đặt chỗ thành công!</h3>
          <p className="text-gray-600 mb-4">
            Cảm ơn bạn đã đặt vé. Thông tin chi tiết đã được gửi đến email của bạn.
          </p>
          <Button 
            className="bg-[#0194f3] hover:bg-[#0180d6] text-white"
            onClick={() => onNavigate?.("offers")}
          >
            Khám phá thêm ưu đãi
          </Button>
        </div>
      </div>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
