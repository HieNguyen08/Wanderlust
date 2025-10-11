import { useState } from "react";
import { ImageWithFallback } from "./components/figma/ImageWithFallback";
import { ChevronDown, ArrowLeft, Star } from "lucide-react";
import { Button } from "./components/ui/button";
import { Checkbox } from "./components/ui/checkbox";
import type { PageType } from "./MainApp";
import { MoreDropdown } from "./TravelGuidePage";
import { Footer } from "./components/Footer";

interface CarPaymentPageProps {
  car: {
    id: number;
    name: string;
    type: string;
    image: string;
    price: number;
    originalPrice?: number;
  };
  onNavigate: (page: PageType, data?: any) => void;
}

export default function CarPaymentPage({ car, onNavigate }: CarPaymentPageProps) {
  const [agreedMarketing, setAgreedMarketing] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("credit-card");

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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <Button
          variant="ghost"
          onClick={() => onNavigate("car-list")}
          className="gap-2 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại
        </Button>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="md:col-span-2 space-y-8">
            {/* Billing Info */}
            <div className="bg-white rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Billing Info</h2>
                  <p className="text-sm text-gray-500">Please enter your billing info</p>
                </div>
                <span className="text-sm text-gray-500">Step 1 of 4</span>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">Name</label>
                  <input type="text" placeholder="Your name" className="w-full px-4 py-3 bg-gray-100 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Phone Number</label>
                  <input type="tel" placeholder="Phone number" className="w-full px-4 py-3 bg-gray-100 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Address</label>
                  <input type="text" placeholder="Address" className="w-full px-4 py-3 bg-gray-100 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Town / City</label>
                  <input type="text" placeholder="Town or city" className="w-full px-4 py-3 bg-gray-100 rounded-lg" />
                </div>
              </div>
            </div>

            {/* Rental Info */}
            <div className="bg-white rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Rental Info</h2>
                  <p className="text-sm text-gray-500">Please select your rental date</p>
                </div>
                <span className="text-sm text-gray-500">Step 2 of 4</span>
              </div>

              {/* Pick-up */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-4 h-4 rounded-full bg-blue-600/30 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-blue-600" />
                  </div>
                  <h3 className="font-semibold">Pick - Up</h3>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Địa điểm</label>
                    <select className="w-full px-4 py-3 bg-gray-100 rounded-lg">
                      <option>Chọn thành phố</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Ngày</label>
                    <select className="w-full px-4 py-3 bg-gray-100 rounded-lg">
                      <option>Chọn ngày</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Giờ</label>
                    <select className="w-full px-4 py-3 bg-gray-100 rounded-lg">
                      <option>Chọn giờ</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Drop-off */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-4 h-4 rounded-full bg-[#54a6ff]/30 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-[#54a6ff]" />
                  </div>
                  <h3 className="font-semibold">Drop - Off</h3>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Địa điểm</label>
                    <select className="w-full px-4 py-3 bg-gray-100 rounded-lg">
                      <option>Chọn thành phố</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Ngày</label>
                    <select className="w-full px-4 py-3 bg-gray-100 rounded-lg">
                      <option>Chọn ngày</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Giờ</label>
                    <select className="w-full px-4 py-3 bg-gray-100 rounded-lg">
                      <option>Chọn giờ</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Payment Method</h2>
                  <p className="text-sm text-gray-500">Please enter your payment method</p>
                </div>
                <span className="text-sm text-gray-500">Step 3 of 4</span>
              </div>

              {/* Credit Card */}
              <div className="bg-gray-100 rounded-xl p-6 mb-6">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-4 h-4 rounded-full bg-blue-600/30 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-blue-600" />
                  </div>
                  <h3 className="font-semibold">Credit Card</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Card Number</label>
                    <input type="text" placeholder="Card number" className="w-full px-4 py-3 bg-white rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Expration Date</label>
                    <input type="text" placeholder="DD / MM / YY" className="w-full px-4 py-3 bg-white rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Card Holder</label>
                    <input type="text" placeholder="Card holder" className="w-full px-4 py-3 bg-white rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">CVC</label>
                    <input type="text" placeholder="CVC" className="w-full px-4 py-3 bg-white rounded-lg" />
                  </div>
                </div>
              </div>

              {/* PayPal */}
              <div className="bg-gray-100 rounded-xl p-4 mb-4 flex items-center gap-3">
                <input type="radio" name="payment" checked={paymentMethod === "paypal"} onChange={() => setPaymentMethod("paypal")} />
                <span className="font-semibold">PayPal</span>
              </div>

              {/* Bitcoin */}
              <div className="bg-gray-100 rounded-xl p-4 flex items-center gap-3">
                <input type="radio" name="payment" checked={paymentMethod === "bitcoin"} onChange={() => setPaymentMethod("bitcoin")} />
                <span className="font-semibold">Bitcoin</span>
              </div>
            </div>

            {/* Confirmation */}
            <div className="bg-white rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Confirmation</h2>
                  <p className="text-sm text-gray-500">We are getting to the end. Just few clicks and your rental is ready!</p>
                </div>
                <span className="text-sm text-gray-500">Step 4 of 4</span>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3 bg-gray-100 rounded-lg p-4">
                  <Checkbox checked={agreedMarketing} onCheckedChange={(checked) => setAgreedMarketing(checked === true)} />
                  <label className="text-sm font-semibold text-gray-700 cursor-pointer">
                    I agree with sending an Marketing and newsletter emails. No spam, promissed!
                  </label>
                </div>

                <div className="flex items-start gap-3 bg-gray-100 rounded-lg p-4">
                  <Checkbox checked={agreedTerms} onCheckedChange={(checked) => setAgreedTerms(checked === true)} />
                  <label className="text-sm font-semibold text-gray-700 cursor-pointer">
                    I agree with our terms and conditions and privacy policy.
                  </label>
                </div>
              </div>

              <Button 
                onClick={() => onNavigate("car-thankyou", car)} 
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={!agreedTerms}
              >
                Rent Now
              </Button>

              <div className="mt-6 flex gap-4">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  🔒
                </div>
                <div>
                  <h3 className="font-semibold mb-1">All your data are safe</h3>
                  <p className="text-sm text-gray-500">We are using the most advanced security to provide you the best experience ever.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Summary */}
          <div>
            <div className="bg-white rounded-xl p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-4">Rental Summary</h2>
              <p className="text-sm text-gray-500 mb-6">Prices may change depending on the length of the rental and the price of your rental car.</p>

              {/* Car Preview */}
              <div className="flex gap-4 mb-6">
                <div className="w-32 h-24 bg-blue-600 rounded-lg flex items-center justify-center p-2">
                  <ImageWithFallback
                    src={car.image}
                    alt={car.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-1">{car.name}</h3>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      {[...Array(4)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      ))}
                      <Star className="w-3 h-3 text-gray-300" />
                    </div>
                    <span className="text-xs text-gray-600">440+ Reviewer</span>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4 mb-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">${car.price}.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-semibold">$0</span>
                </div>
              </div>

              <div className="bg-gray-100 rounded-lg p-4 mb-4 flex items-center justify-between">
                <input type="text" placeholder="Apply promo code" className="bg-transparent outline-none text-sm text-gray-500 flex-1" />
                <button className="font-semibold">Apply now</button>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="text-xl font-bold">Total Rental Price</h3>
                    <p className="text-xs text-gray-500">Overall price and includes rental discount</p>
                  </div>
                  <span className="text-3xl font-bold">${car.price}.00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
