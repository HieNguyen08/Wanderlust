import { useState } from "react";
import svgPaths from "./imports/svg-6plt7yinjf";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { ChevronDown, Plane, Calendar as CalendarIcon, Users, ArrowRightLeft, PlaneTakeoff, PlaneLanding, Search, Plus } from "lucide-react";
import { ImageWithFallback } from "./components/figma/ImageWithFallback";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./components/ui/accordion";
import { Calendar } from "./components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./components/ui/popover";
import type { PageType } from "./MainApp";
import { Header } from "./components/Header";

// Hero Section with Search
function HeroSearch({ onNavigate }: { onNavigate?: (page: string) => void }) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState<Date>();
  const [flightType, setFlightType] = useState("Chuyến bay");
  const [ticketType, setTicketType] = useState("Loại");

  return (
    <div className="relative h-[700px] w-full">
      {/* Background Image */}
      <ImageWithFallback
        alt="Hero background"
        className="absolute inset-0 w-full h-full object-cover"
        src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1920&h=700&fit=crop"
      />
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center pt-[113px] px-[112px]">
        <h1 className="text-white text-[48px] text-center mb-8 drop-shadow-2xl">
          Từ Đông Nam Á Đến Thế Giới, Trong Tầm Tay Bạn
        </h1>

        {/* Search Box */}
        <div className="bg-white rounded-lg p-6 w-full max-w-[1024px] shadow-2xl">
          <h2 className="text-[24px] mb-4">Tìm kiếm chuyến bay</h2>

          {/* Flight Type Selectors */}
          <div className="flex gap-2 mb-4">
            <button className="px-4 py-2 border border-gray-300 rounded flex items-center gap-2 hover:bg-gray-50 transition-colors">
              {flightType}
              <ChevronDown className="w-4 h-4 text-gray-600" />
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded flex items-center gap-2 hover:bg-gray-50 transition-colors">
              {ticketType}
              <ChevronDown className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          {/* Search Inputs */}
          <div className="flex gap-2">
            {/* From */}
            <div className="flex-1 border border-gray-300 rounded p-3 flex items-center gap-2 hover:border-blue-500 transition-colors">
              <PlaneTakeoff className="w-5 h-5 text-blue-600" />
              <Input
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                placeholder="From"
                className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>

            {/* Swap Button */}
            <button className="bg-white border border-gray-300 rounded p-3 hover:bg-gray-50 transition-colors">
              <ArrowRightLeft className="w-5 h-5 text-gray-600" />
            </button>

            {/* To */}
            <div className="flex-1 border border-gray-300 rounded p-3 flex items-center gap-2 hover:border-blue-500 transition-colors">
              <PlaneLanding className="w-5 h-5 text-blue-600" />
              <Input
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="To"
                className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>

            {/* Date */}
            <Popover>
              <PopoverTrigger asChild>
                <button className="flex-1 border border-gray-300 rounded p-3 flex items-center gap-2 hover:border-blue-500 transition-colors">
                  <CalendarIcon className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-500">{date ? date.toLocaleDateString() : "Date"}</span>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={date} onSelect={setDate} />
              </PopoverContent>
            </Popover>

            {/* Travellers */}
            <button className="flex-1 border border-gray-300 rounded p-3 flex items-center gap-2 hover:border-blue-500 transition-colors">
              <Users className="w-5 h-5 text-blue-600" />
              <span className="text-gray-500">Travellers</span>
            </button>

            {/* Search Button */}
            <Button 
              onClick={() => onNavigate?.("search")}
              className="bg-[#0194f3] hover:bg-[#0180d6] text-white px-8"
            >
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
        </div>
      </div>

      {/* Image Credit */}
      <p className="absolute bottom-8 right-8 text-white text-sm">
        The Himalya Mount,
        <br />
        the Peak Everest
      </p>
    </div>
  );
}

// Features Section
function Features() {
  const features = [
    {
      icon: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=100&h=100&fit=crop",
      title: "Tìm kiếm chuyến bay du lịch:",
      description: "Trang web đại lý du lịch trực tuyến của chúng tôi cung cấp cho người dùng một công cụ tìm kiếm toàn diện và thân thiện với người dùng. Người dùng có thể dễ dàng tìm thấy các chuyến bay, khách sạn và ô tô cho thuê bằng cách nhập thông tin chi tiết và sở thích du lịch của họ. Tính năng này giúp người dùng tiết kiệm thời gian và công sức bằng cách trình bày nhiều tùy chọn ở một nơi."
    },
    {
      icon: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=100&h=100&fit=crop",
      title: "Cẩm nang du lịch:",
      description: "Chúng tôi đưa ra các đề xuất được cá nhân hóa dựa trên sở thích của người dùng, đặt chỗ trước đó và lịch sử duyệt web. Bằng cách tận dụng các thuật toán nâng cao, trang web của chúng tôi đề xuất các tùy chọn du lịch phù hợp với sở thích, ngân sách và mô hình du lịch của người dùng. Tính năng này nâng cao trải nghiệm người dùng bằng cách cung cấp các đề xuất có liên quan và có mục tiêu."
    },
    {
      icon: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=100&h=100&fit=crop",
      title: "Giá cả hợp lý:",
      description: "Người dùng có thể xem thông tin về giá cả và tình trạng sẵn có theo thời gian thực của các chuyến bay, khách sạn và các dịch vụ du lịch khác. Trang web của chúng tôi tích hợp với nhiều nhà cung cấp dịch vụ du lịch, đảm bảo thông tin chính xác và cập nhật. Người dùng có thể đưa ra quyết định sáng suốt dựa trên mức giá và tình trạng phòng trống mới nhất, giảm nguy cơ gặp phải những điều bất ngờ trong quá trình đặt phòng."
    },
    {
      icon: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=100&h=100&fit=crop",
      title: "Hỗ trợ chăm sóc khách hàng 24/7:",
      description: "Chúng tôi cung cấp hỗ trợ khách hàng 24/7 thông qua nhiều kênh, bao gồm trò chuyện trực tiếp, email và điện thoại. Người dùng có thể tìm kiếm sự trợ giúp, giải quyết vấn đề hoặc nhận hướng dẫn trong suốt hành trình đặt vé du lịch của mình. Tính năng này mang lại niềm tin cho người dùng, biết rằng họ có quyền truy cập vào hỗ trợ bất cứ khi nào họ cần, nâng cao trải nghiệm tổng thể của họ với đại lý du lịch trực tuyến của chúng tôi."
    },
    {
      icon: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100&h=100&fit=crop",
      title: "Hỗ trợ đa nền tảng:",
      description: "Trang web đại lý du lịch trực tuyến của chúng tôi có thể truy cập được trên nhiều nền tảng khác nhau, bao gồm máy tính để bàn, thiết bị di động và máy tính bảng. Người dùng có thể chuyển đổi liền mạch giữa các thiết bị trong khi lên kế hoạch cho chuyến đi của mình, đảm bảo trải nghiệm nhất quán bất kể nền tảng họ thích. Tính năng này mang lại sự linh hoạt và tiện lợi, đáp ứng nhu cầu và sở thích đa dạng của người dùng."
    },
    {
      icon: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=100&h=100&fit=crop",
      title: "Đánh giá người dùng:",
      description: "Chúng tôi kết hợp các đánh giá và xếp hạng của người dùng về khách sạn, hãng hàng không và các dịch vụ du lịch khác. Tính năng này cho phép người dùng đọc phản hồi xác thực từ những người bạn đồng hành, giúp họ đưa ra quyết định sáng suốt. Bằng cách cung cấp nền tảng cho nội dung do người dùng tạo, trang web của chúng tôi xây dựng niềm tin và tính minh bạch, trao quyền cho người dùng lựa chọn các tùy chọn tốt nhất cho nhu cầu du lịch của họ."
    }
  ];

  return (
    <section className="max-w-[1200px] mx-auto px-6 py-20">
      <div className="grid grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div key={index} className="p-4">
            <ImageWithFallback alt="" className="w-16 h-16 mb-4 rounded object-cover" src={feature.icon} />
            <h3 className="mb-3">{feature.title}</h3>
            <p className="text-sm text-justify text-gray-700">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// Popular Flights
function PopularFlights() {
  const flights = [
    { image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=300&fit=crop", from: "Nairobi", to: "Lisbon", price: "$718" },
    { image: "https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=400&h=300&fit=crop", from: "Nairobi", to: "Madrid", price: "$870" },
    { image: "https://images.unsplash.com/photo-1534081333815-ae5019106622?w=400&h=300&fit=crop", from: "Nairobi", to: "Amsterdam", price: "$760" },
    { image: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=400&h=300&fit=crop", from: "Nairobi", to: "Bangkok", price: "$900" }
  ];

  return (
    <section className="max-w-[1200px] mx-auto px-6 py-20">
      <div className="mb-8">
        <h2 className="text-[36px] mb-2">Các chuyến bay phổ biến</h2>
        <p className="text-gray-600">Các chuyến bay trong nước phổ biến</p>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {flights.map((flight, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-all cursor-pointer group"
          >
            <div className="relative h-60">
              <ImageWithFallback
                alt={`${flight.from} to ${flight.to}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                src={flight.image}
              />
            </div>
            <div className="p-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-[18px]">{flight.from}</span>
                <ArrowRightLeft className="w-4 h-4 text-blue-600" />
                <span className="text-[18px]">{flight.to}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-600">From</span>
                <span className="font-bold">{flight.price}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// Discover Section
function DiscoverSection() {
  return (
    <section className="max-w-[1200px] mx-auto px-6 py-20">
      <div className="bg-[#fff1e4] rounded-lg p-8">
        <h2 className="text-[24px] mb-4">
          Chào mừng bạn đến với trang web của chúng tôi, nơi hành trình của bạn bắt đầu!
        </h2>
        <p className="mb-6 text-gray-700">
          Đặt vé máy bay chưa bao giờ dễ dàng hơn thế. Với giao diện thân thiện với người dùng và các tùy chọn di chuyển phong phú của chúng tôi, bạn có thể tìm thấy chuyến bay hoàn hảo đến điểm đến mơ ước của mình chỉ bằng vài bước đơn giản. Cho dù bạn đang lên kế hoạch cho một chuyến công tác hay một kỳ nghỉ nhàn nhã, trang web của chúng tôi đều mang đến trải nghiệm đặt phòng liền mạch và được cá nhân hóa.
        </p>
        <Button className="bg-[#0194f3] hover:bg-[#0180d6] text-white">
          Book a Flight
        </Button>
      </div>
    </section>
  );
}

// Deals Section
function DealsSection() {
  return (
    <section className="max-w-[1200px] mx-auto px-6 py-20">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-[36px]">Ưu đãi dành cho bạn</h2>
        <div className="flex gap-4">
          <Button variant="outline" className="border-[#0194f3] text-[#0194f3]">
            Xem tất cả
          </Button>
          <div className="flex gap-4">
            <button className="bg-white border border-gray-300 rounded p-2 hover:bg-gray-50">
              <svg className="w-6 h-6 rotate-90" viewBox="0 0 24 24" fill="none">
                <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" />
              </svg>
            </button>
            <button className="bg-white border border-gray-300 rounded p-2 hover:bg-gray-50">
              <svg className="w-6 h-6 -rotate-90" viewBox="0 0 24 24" fill="none">
                <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {[
          "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=200&h=200&fit=crop",
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200&h=200&fit=crop",
          "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=200&h=200&fit=crop"
        ].map((img, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-4 flex gap-4 hover:shadow-lg transition-shadow">
            <ImageWithFallback alt="offer" className="w-32 h-32 rounded object-cover" src={img} />
            <div className="flex-1">
              <p className="text-gray-600 mb-2">Wanderlust Travel Agency</p>
              <p className="mb-4">15% Off on All-Inclusive Vacation Packages</p>
              <div className="flex items-center justify-between">
                <div className="border-2 border-dashed border-[#5d36af] rounded px-3 py-1">
                  <span>WANDER15</span>
                </div>
                <Button variant="link" className="text-[#0194f3]">
                  Explore Now
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// Download Mobile Section
function DownloadMobile() {
  return (
    <section className="max-w-[1200px] mx-auto px-6 py-20">
      <div className="bg-[#fff1e4] rounded-lg p-8 flex items-center justify-between">
        <div className="max-w-2xl">
          <h2 className="text-[24px] mb-4">
            Đăng ký hội viên, nhận thêm nhiều ưu đãi
          </h2>
          <p className="text-gray-700">
            Vui lòng quét mã QR để biết thêm chi tiết về chương trình ưu đãi của chúng tôi.
          </p>
        </div>
        <div className="w-32 h-32 bg-white rounded flex items-center justify-center">
          <div className="text-center text-gray-400">QR Code</div>
        </div>
      </div>
    </section>
  );
}

// FAQ Section
function FAQSection() {
  const faqs = [
    "Làm thế nào để tôi có thể tìm kiếm chuyến bay, khách sạn và đặt phòng trên trang web này?",
    "Những hình thức thanh toán nào được chấp nhận ?",
    "Liệu tôi có thể hủy chuyến sau khi đã xác nhận đặt vé và phòng ?",
    "Những thông tin cần thiết về lộ trình và mô tả chuyến đi ?",
    "Làm thế nào để tôi có thể liên lạc với nhân viên hỗ trợ trong thời gian chuyến du lịch diễn ra ?",
    "Có cần phải tính thêm phụ phí di chuyển cho taxi và dịch vụ vận chuyển hành lý không ?",
    "Trang web có chính sách hoàn trả trong trường hợp vé đặt của tôi bị hủy không ?",
    "Bạn có cung cấp các lựa chọn bảo hiểm du lịch không? Làm cách nào tôi có thể thêm bảo hiểm vào vé đặt chỗ của mình?",
    "Có chương trình khách hàng thân thiết hoặc phần thưởng nào dành cho khách du lịch thường xuyên không?",
    "Tôi có thể đặt chuyến bay và khách sạn cho nhiều hành khách trong một giao dịch không?"
  ];

  return (
    <section className="max-w-[1200px] mx-auto px-6 py-20">
      <div className="mb-8">
        <h2 className="text-[24px] mb-2">FAQ</h2>
        <p className="text-[18px] text-gray-600">Câu hỏi thường gặp</p>
      </div>

      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-left hover:no-underline">
              {faq}
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-gray-600">
                Đây là câu trả lời mẫu cho câu hỏi này. Vui lòng liên hệ với bộ phận hỗ trợ khách hàng để biết thêm chi tiết.
              </p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}

// Footer Component
function FlightsFooter() {
  return (
    <footer className="bg-[#153a43] text-white py-16">
      <div className="max-w-[1200px] mx-auto px-[120px]">
        <div className="grid grid-cols-5 gap-8 mb-12">
          <div>
            <h3 className="text-[32px] mb-4">Wanderlust</h3>
          </div>
          <div>
            <h4 className="text-[18px] mb-4">Company</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors">About</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Partnerships</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Advertising</a></li>
              <li><a href="#" className="hover:text-white transition-colors">How we work</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[18px] mb-4">Policies</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Use</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Accessibility</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Cookies</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[18px] mb-4">Help</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Cancel your booking</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Refund policies</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Use a coupon</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Travel documents</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[18px] mb-4">More</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors">Airline fees</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Airlines</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Low fare trips</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Badges & Certificates</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6 flex items-center justify-between">
          <div className="flex gap-5">
            <a href="#" className="hover:text-yellow-300 transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d={svgPaths.pfb1df80} />
              </svg>
            </a>
            <a href="#" className="hover:text-yellow-300 transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d={svgPaths.p2837cb00} />
              </svg>
            </a>
            <a href="#" className="hover:text-yellow-300 transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d={svgPaths.p26841d31} />
              </svg>
            </a>
          </div>
          <p className="text-right text-gray-400">© 2023 GlobGoer Inc.</p>
        </div>
      </div>
    </footer>
  );
}

// Main FlightsPage Component
interface FlightsPageProps {
  onNavigate: (page: PageType) => void;
}

export default function FlightsPage({ onNavigate }: FlightsPageProps) {
  return (
    <div className="bg-white min-h-screen">
      <Header currentPage="flights" onNavigate={onNavigate} />
      <HeroSearch onNavigate={onNavigate} />
      <Features />
      <PopularFlights />
      <DiscoverSection />
      <DealsSection />
      <DownloadMobile />
      <FAQSection />
      <FlightsFooter />
    </div>
  );
}
