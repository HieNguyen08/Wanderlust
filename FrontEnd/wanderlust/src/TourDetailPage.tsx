import { useState } from "react";
import { ImageWithFallback } from "./components/figma/ImageWithFallback";
import { 
  ChevronDown, 
  ArrowLeft, 
  MapPin, 
  Star, 
  Check, 
  X,
  Clock,
  Users,
  Globe,
  Calendar,
  ThumbsUp,
  ThumbsDown,
  Share2,
  Heart
} from "lucide-react";
import { Button } from "./components/ui/button";
import { Card } from "./components/ui/card";
import { Badge } from "./components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./components/ui/accordion";
import type { PageType } from "./MainApp";
import { MoreDropdown } from "./TravelGuidePage";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";

interface TourDetailPageProps {
  tour: {
    id: number | string;
    name: string;
    location: string;
    image: string;
    price: number;
    originalPrice?: number;
    rating: number;
    reviews: number;
    duration?: string;
  };
  onNavigate: (page: PageType, data?: any) => void;
}

export default function TourDetailPage({ tour, onNavigate }: TourDetailPageProps) {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [adultCount, setAdultCount] = useState(3);
  const [youthCount, setYouthCount] = useState(2);
  const [childrenCount, setChildrenCount] = useState(4);
  const [isLiked, setIsLiked] = useState(false);

  // Pricing
  const adultPrice = 282;
  const youthPrice = 168;
  const childPrice = 80;
  const total = (adultCount * adultPrice) + (youthCount * youthPrice) + (childrenCount * childPrice);

  const tourImages = [
    tour.image,
    "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1431274172761-fca41d930114?w=800&h=600&fit=crop",
  ];

  const highlights = [
    "Trải nghiệm tốc độ của speedboat đến quần đảo Phi Phi tuyệt đẹp",
    "Ngạc nhiên trước sự đa dạng của sinh vật biển trong quần đảo",
    "Tận hưởng thiên đường với những bãi biển cát trắng và làn nước trong xanh",
    "Cảm nhận sự thoải mái của một tour giới hạn 35 hành khách",
    "Thoáng nhìn những chú khỉ hoang dã quanh Monkey Beach",
  ];

  const included = [
    "Đồ uống, nước uống, trà sáng và buffet trưa",
    "Thuế địa phương",
    "Đưa đón khách sạn bằng xe mini có điều hòa",
    "Bảo hiểm chuyển đến bến tàu riêng",
    "Nước ngọt",
    "Hướng dẫn viên du lịch",
  ];

  const notIncluded = [
    "Khăn tắm",
    "Tiền boa",
    "Đồ uống có cồn",
  ];

  const itinerary = [
    {
      day: "Ngày 1: Đón tại sân bay",
      description: "Giống như tất cả các chuyến đi của chúng tôi, chúng tôi có thể đón bạn từ sân bay khi bạn hạ cánh và đưa bạn trực tiếp đến khách sạn. Ngày đầu tiên chỉ là ngày check-in nên bạn có quyền tự do khám phá thành phố và ổn định.",
    },
    {
      day: "Ngày 2: Chùa & Du thuyền sông",
      description: "Khám phá các ngôi chùa cổ kính và trải nghiệm du thuyền sông tuyệt vời với buffet trưa sang trọng.",
    },
    {
      day: "Ngày 3: Massage & Tàu qua đêm",
      description: "Thư giãn với massage truyền thống và trải nghiệm tàu hỏa qua đêm độc đáo.",
    },
    {
      day: "Ngày 4: Công viên Quốc gia Khao Sok",
      description: "Tham quan công viên quốc gia với cảnh quan thiên nhiên tuyệt đẹp.",
    },
    {
      day: "Ngày 5: Di chuyển đến Koh Phangan",
      description: "Chuyển địa điểm đến hòn đảo xinh đẹp Koh Phangan.",
    },
    {
      day: "Ngày 6: Buổi sáng thư giãn & Bài học Muay Thai",
      description: "Thư giãn vào buổi sáng và tham gia lớp học Muay Thai hấp dẫn.",
    },
    {
      day: "Ngày 7: Chuyến đi thuyền đảo",
      description: "Khám phá các hòn đảo xung quanh bằng thuyền và tận hưởng thiên nhiên.",
    },
  ];

  const overallRatings = [
    { category: "Overall Rating", score: 5.0, label: "Excellent" },
    { category: "Location", score: 5.0, label: "Excellent" },
    { category: "Amenities", score: 5.0, label: "Excellent" },
    { category: "Food", score: 5.0, label: "Excellent" },
    { category: "Price", score: 5.0, label: "Excellent" },
    { category: "Rooms", score: 5.0, label: "Excellent" },
    { category: "Tour Operator", score: 5.0, label: "Excellent" },
  ];

  const reviews = [
    {
      id: 1,
      name: "Ali Tufan",
      date: "April 2023",
      rating: 5,
      title: "Take this tour! Its fantastic!",
      content: "Great for 4-5 hours to explore. Really a lot to see and tons of photo spots. Even have a passport for you to collect all the stamps as a souvenir. Must see for a Harry Potter fan.",
      images: [
        "https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&h=300&fit=crop",
      ],
      helpful: 0,
      notHelpful: 0,
    },
  ];

  const faqs = [
    {
      question: "Can I get the refund?",
      answer: "Phang Nga Bay Sea Cave Canoeing & James Bond Island w/ Buffet Lunch by Big Boat cancellation policy: For a full refund, cancel at least 24 hours in advance of the start date of the experience.",
    },
    { question: "Can I change the travel date?", answer: "" },
    { question: "When and where does the tour end?", answer: "" },
    { question: "Do you arrange airport transfers?", answer: "" },
  ];

  const relatedTours = [
    {
      id: 1,
      name: "Centipede Tour - Guided Arizona Desert Tour by ATV",
      location: "Paris, France",
      image: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&h=600&fit=crop",
      price: 189.25,
      rating: 4.8,
      reviews: 243,
      duration: "4 days",
    },
    {
      id: 2,
      name: "Molokini and Turtle Town Snorkeling Adventure Aboard",
      location: "New York, USA",
      image: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=800&h=600&fit=crop",
      price: 225,
      rating: 4.8,
      reviews: 243,
      duration: "4 days",
    },
    {
      id: 3,
      name: "Westminster Walking Tour & Westminster Abbey Entry",
      location: "London, UK",
      image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&h=600&fit=crop",
      price: 943,
      rating: 4.8,
      reviews: 243,
      duration: "4 days",
    },
    {
      id: 4,
      name: "All Inclusive Ultimate Circle Island Day Tour with Lunch",
      location: "New York, USA",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
      price: 771,
      rating: 4.8,
      reviews: 243,
      duration: "4 days",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header currentPage="travel-guide" onNavigate={onNavigate} />

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 pt-[calc(60px+2rem)]">
        {/* Badges & Title */}
        <div className="mb-6">
          <div className="flex gap-2 mb-4">
            <Badge className="bg-orange-50 text-orange-600 border-orange-200">Bán chạy</Badge>
            <Badge className="bg-gray-100 text-gray-800">Miễn phí hủy/ đổi</Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {tour.name}
          </h1>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              ))}
              <span className="ml-2">{tour.rating} ({tour.reviews})</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{tour.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>30K+ lượt đặt</span>
            </div>
            <div className="ml-auto flex gap-2">
              <Button variant="outline" size="icon" onClick={() => setIsLiked(!isLiked)}>
                <Heart className={`w-5 h-5 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
              </Button>
              <Button variant="outline" size="icon">
                <Share2 className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="grid grid-cols-4 gap-2 mb-8 h-[500px]">
          <div className="col-span-2 row-span-2 overflow-hidden rounded-l-xl">
            <ImageWithFallback
              src={tourImages[0]}
              alt={tour.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="overflow-hidden">
            <ImageWithFallback
              src={tourImages[1]}
              alt={`${tour.name} 2`}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="overflow-hidden rounded-tr-xl">
            <ImageWithFallback
              src={tourImages[2]}
              alt={`${tour.name} 3`}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="overflow-hidden">
            <ImageWithFallback
              src={tourImages[3]}
              alt={`${tour.name} 4`}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="relative overflow-hidden rounded-br-xl">
            <ImageWithFallback
              src={tourImages[1]}
              alt="More"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Button className="bg-gray-900 hover:bg-black text-white">
                Xem tất cả
              </Button>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => onNavigate("promotions")}
          className="gap-2 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại khuyến mãi
        </Button>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Tour Info */}
            <Card className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <div className="flex items-start gap-3">
                  <div className="bg-gray-100 p-3 rounded-xl">
                    <Clock className="w-6 h-6 text-gray-700" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Thời gian</p>
                    <p className="font-semibold">{tour.duration || "3 days"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-gray-100 p-3 rounded-xl">
                    <Users className="w-6 h-6 text-gray-700" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Nhóm</p>
                    <p className="font-semibold">10 people</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-gray-100 p-3 rounded-xl">
                    <Users className="w-6 h-6 text-gray-700" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Độ tuổi</p>
                    <p className="font-semibold">18-99 yrs</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-gray-100 p-3 rounded-xl">
                    <Globe className="w-6 h-6 text-gray-700" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Ngôn ngữ</p>
                    <p className="font-semibold text-sm">English, Japanese</p>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold mb-4">Tổng quan chuyến đi</h2>
              <p className="text-gray-700 leading-relaxed">
                The Phi Phi archipelago is a must-visit while in Phuket, and this speedboat trip whisks you around the islands in one day. 
                Swim over the coral reefs of Pileh Lagoon, have lunch at Phi Phi Leh, snorkel at Bamboo Island, and visit Monkey Beach and 
                Maya Bay, immortalized in "The Beach." Boat transfers, snacks, buffet lunch, snorkeling equipment, and Phuket hotel pickup 
                and drop-off all included.
              </p>
            </Card>

            {/* Highlights */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">Điểm nhấn</h2>
              <ul className="space-y-3">
                {highlights.map((highlight, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-black rounded-full mt-2 flex-shrink-0" />
                    <span className="text-gray-700">{highlight}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Included/Not Included */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6">Dịch vụ đi kèm</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  {included.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="bg-green-100 p-1.5 rounded-full">
                        <Check className="w-3 h-3 text-green-600" />
                      </div>
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-3">
                  {notIncluded.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="bg-red-100 p-1.5 rounded-full">
                        <X className="w-3 h-3 text-red-600" />
                      </div>
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Itinerary */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6">Itinerary</h2>
              <div className="space-y-6">
                {itinerary.map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="bg-blue-600 text-white rounded-full p-2 flex items-center justify-center w-8 h-8">
                        <span className="text-sm font-semibold">{index + 1}</span>
                      </div>
                      {index < itinerary.length - 1 && (
                        <div className="w-0.5 h-full bg-blue-200 mt-2" />
                      )}
                    </div>
                    <div className="flex-1 pb-8">
                      <h3 className="font-semibold text-lg mb-2">{item.day}</h3>
                      <p className="text-gray-600 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Map Placeholder */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">Hành trình chuyến đi</h2>
              <div className="bg-gray-200 h-[400px] rounded-xl flex items-center justify-center">
                <p className="text-gray-500">Map View (Google Maps Integration)</p>
              </div>
            </Card>

            {/* Date Selection */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">Ngày đi</h2>
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-gray-600">Calendar Component (Choose date)</p>
              </div>
            </Card>

            {/* FAQ */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6">FAQ</h2>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    {faq.answer && (
                      <AccordionContent>
                        <p className="text-gray-600">{faq.answer}</p>
                      </AccordionContent>
                    )}
                  </AccordionItem>
                ))}
              </Accordion>
            </Card>

            {/* Customer Reviews */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6">Phản hồi của khách hàng</h2>
              
              {/* Overall Ratings */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {overallRatings.map((rating, index) => (
                  <div 
                    key={index} 
                    className={`p-4 rounded-xl ${index === 0 ? 'bg-orange-50' : 'bg-gray-50'}`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <Star className="w-6 h-6 text-orange-500" />
                      <div>
                        <p className="font-semibold">{rating.category}</p>
                        <p className="text-sm text-gray-600">{rating.label}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{rating.score}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Reviews */}
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border-t pt-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full" />
                        <div>
                          <p className="font-semibold">{review.name}</p>
                          <p className="text-sm text-gray-500">{review.date}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1 mb-2">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <h4 className="font-semibold mb-2">{review.title}</h4>
                    <p className="text-gray-700 mb-4">{review.content}</p>
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {review.images.map((img, i) => (
                        <ImageWithFallback
                          key={i}
                          src={img}
                          alt={`Review ${i + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                    <div className="flex gap-4">
                      <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
                        <ThumbsUp className="w-4 h-4" />
                        <span className="text-sm">Helpful</span>
                      </button>
                      <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
                        <ThumbsDown className="w-4 h-4" />
                        <span className="text-sm">Not helpful</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <Button variant="outline" className="w-full mt-6">
                See more reviews
              </Button>
            </Card>

            {/* Write Review */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6">Viết phản hồi</h2>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Name"
                    className="px-4 py-3 border rounded-lg"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    className="px-4 py-3 border rounded-lg"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Title"
                  className="w-full px-4 py-3 border rounded-lg"
                />
                <textarea
                  placeholder="Comment"
                  rows={5}
                  className="w-full px-4 py-3 border rounded-lg"
                />
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Post Comment
                </Button>
              </div>
            </Card>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <div className="mb-6">
                <p className="text-gray-600 mb-2">From</p>
                <div className="flex items-baseline gap-2">
                  {tour.originalPrice && (
                    <span className="text-xl text-gray-400 line-through">
                      ${tour.originalPrice}
                    </span>
                  )}
                  <span className="text-3xl font-bold text-blue-600">
                    ${tour.price}
                  </span>
                </div>
              </div>

              {/* Date & Time */}
              <div className="space-y-4 mb-6">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Calendar className="w-5 h-5 text-gray-600" />
                    <p className="font-medium">From</p>
                  </div>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Clock className="w-5 h-5 text-gray-600" />
                    <p className="font-medium">Time</p>
                  </div>
                  <select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="">Choose time</option>
                    <option value="09:00">09:00 AM</option>
                    <option value="14:00">02:00 PM</option>
                  </select>
                </div>
              </div>

              {/* Tickets */}
              <div className="mb-6">
                <h3 className="font-semibold mb-4">Tickets</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm">Adult (18+ years) <span className="font-semibold">${adultPrice}.00</span></p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        onClick={() => setAdultCount(Math.max(0, adultCount - 1))}
                      >
                        -
                      </Button>
                      <span className="w-8 text-center">{adultCount}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        onClick={() => setAdultCount(adultCount + 1)}
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm">Youth (13-17 years) <span className="font-semibold">${youthPrice}.00</span></p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        onClick={() => setYouthCount(Math.max(0, youthCount - 1))}
                      >
                        -
                      </Button>
                      <span className="w-8 text-center">{youthCount}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        onClick={() => setYouthCount(youthCount + 1)}
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm">Children (0-12 years) <span className="font-semibold">${childPrice}.00</span></p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        onClick={() => setChildrenCount(Math.max(0, childrenCount - 1))}
                      >
                        -
                      </Button>
                      <span className="w-8 text-center">{childrenCount}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        onClick={() => setChildrenCount(childrenCount + 1)}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Total */}
              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Total:</span>
                  <span className="text-xl font-bold text-blue-600">${total}.00</span>
                </div>
              </div>

              <Button className="w-full bg-blue-600 hover:bg-blue-700 py-6 text-lg">
                Book Now
              </Button>
            </Card>
          </div>
        </div>

        {/* Related Tours */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold mb-8">Có thể bạn sẽ thích</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedTours.map((relatedTour) => (
              <Card key={relatedTour.id} className="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
                <div className="relative h-48">
                  <ImageWithFallback
                    src={relatedTour.image}
                    alt={relatedTour.name}
                    className="w-full h-full object-cover"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 bg-white/90 hover:bg-white"
                  >
                    <Heart className="w-5 h-5" />
                  </Button>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                    <MapPin className="w-4 h-4" />
                    <span>{relatedTour.location}</span>
                  </div>
                  <h3 className="font-semibold mb-2 line-clamp-2">
                    {relatedTour.name}
                  </h3>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <span className="text-sm">{relatedTour.rating} ({relatedTour.reviews})</span>
                  </div>
                  <div className="flex items-center justify-between border-t pt-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4" />
                      <span>{relatedTour.duration}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">From </span>
                      <span className="font-bold">${relatedTour.price}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
