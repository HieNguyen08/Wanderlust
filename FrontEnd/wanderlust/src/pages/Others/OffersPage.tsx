import { useState } from "react";
import svgPaths from "../../imports/svg-b0swlovnmc";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { Button } from "../../components/ui/button";
import { Bell, Copy, Clock } from "lucide-react";
import { Footer } from "../../components/Footer";
import type { PageType } from "../../MainApp";

interface OffersPageProps {
  onNavigate: (page: PageType) => void;
}

// Hero Section
function HeroSection() {
  return (
    <div className="bg-[#fff1e4] py-16 px-8">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-16">
        <div className="flex-1 max-w-[670px]">
          <h1 className="text-[32px] mb-6">Ưu đãi hàng tuần</h1>
          <div className="text-[16px] leading-relaxed mb-6">
            <p className="mb-4">
              🌟 <span className="text-[14px]">Ưu đãi nghỉ ngơi độc quyền ở Paris! Tiết kiệm 20% cho chuyến đi trong mơ của bạn!</span> 🌟
            </p>
            <p>
              Bắt đầu cuộc hành trình khó quên đến thành phố lãng mạn Paris, Pháp, với ưu đãi độc quyền trong thời gian có hạn của chúng tôi! Đắm mình trong sự quyến rũ của Thành phố Ánh sáng trong khi tận hưởng mức tiết kiệm đáng kinh ngạc 20% cho toàn bộ chuyến đi của bạn! Dưới đây là các tính năng độc quyền của thỏa thuận này:
            </p>
          </div>
          <Button className="bg-[#0194f3] hover:bg-[#0180d6] text-white">
            <Bell className="w-4 h-4 mr-2" />
            Đăng ký để nhận thêm các thông tin ưu đãi đặc biệt
          </Button>
        </div>

        <div className="flex-1">
          <ImageWithFallback 
            src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&h=600&fit=crop" 
            alt="Paris" 
            className="w-full h-[400px] object-cover rounded-lg shadow-xl"
          />
        </div>
      </div>
    </div>
  );
}

// Filter Section
function FilterSection() {
  return (
    <div className="flex gap-2">
      <select className="border rounded px-4 py-2 bg-white">
        <option>Flights</option>
        <option>Hotels</option>
        <option>Tours</option>
      </select>
      <select className="border rounded px-4 py-2 bg-white">
        <option>Trending</option>
        <option>New</option>
        <option>Popular</option>
      </select>
      <select className="border rounded px-4 py-2 bg-white">
        <option>Time of stay</option>
        <option>This weekend</option>
        <option>Next week</option>
        <option>Next month</option>
      </select>
    </div>
  );
}

// Offer Card
function OfferCard() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("WANDER15");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      <ImageWithFallback 
        src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop" 
        alt="Offer" 
        className="w-full h-[180px] object-cover"
      />
      
      <div className="p-4">
        <p className="text-sm text-gray-600 mb-2">Wanderlust Travel Agency</p>
        <h3 className="text-[16px] mb-4">15% Off on All-Inclusive Vacation Packages</h3>
        
        <div className="flex items-center gap-2 mb-4">
          <div className="flex-1 border-2 border-dashed border-[#5d36af] rounded p-2 text-center">
            <span className="">WANDER15</span>
          </div>
          <button 
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2 text-[#0194f3] hover:bg-gray-50 rounded transition-colors"
          >
            <span className="text-sm">{copied ? "Copied!" : "Copy"}</span>
            <Copy className="w-3 h-3" />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="bg-[#ecd8c5] px-3 py-1 rounded text-xs">
            Expires in 23h:20m
          </div>
          <Button size="sm" className="bg-[#0194f3] hover:bg-[#0180d6] text-white">
            Explore Now
          </Button>
        </div>
      </div>
    </div>
  );
}

// Offers Grid
function OffersGrid() {
  return (
    <div className="grid grid-cols-3 gap-8">
      {[...Array(9).keys()].map((i) => (
        <OfferCard key={i} />
      ))}
    </div>
  );
}

// Footer
function OffersFooter({ onNavigate }: { onNavigate?: (page: string) => void }) {
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
              <li><a href="#" className="hover:text-white transition-colors">Partnerships</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Advertising</a></li>
              <li><a href="#" className="hover:text-white transition-colors">How we work</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg mb-4">Policies</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Use</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Accessibility</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Cookies</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg mb-4">Help</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Cancel your booking</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Refund policies</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Use a coupon</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Travel documents</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg mb-4">More</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors">Airline fees</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Airlines</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Low fare trips</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Badges & Certificates</a></li>
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
export default function OffersPage({ onNavigate }: OffersPageProps) {
  return (
    <div className="bg-white min-h-screen">      <HeroSection />

      <div className="max-w-[1440px] mx-auto px-[180px] py-16">
        <div className="flex flex-col items-end gap-8">
          <FilterSection />
          <OffersGrid />
        </div>
      </div>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
