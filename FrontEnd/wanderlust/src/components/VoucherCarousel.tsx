import { Check, Ticket } from "lucide-react";
import type { PageType } from "../MainApp";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Button } from "./ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./ui/carousel";

interface VoucherCarouselProps {
  vouchers: any[];
  savedVouchers: string[];
  onSaveVoucher: (voucher: any) => Promise<void>;
  onNavigate: (page: PageType, data?: any) => void;
  title?: string;
  subtitle?: string;
}

export function VoucherCarousel({
  vouchers,
  savedVouchers,
  onSaveVoucher,
  onNavigate,
  title = "Ưu đãi dành cho bạn",
  subtitle = "Những khuyến mãi hấp dẫn đang chờ bạn"
}: VoucherCarouselProps) {
  const isSaved = (code: string) => savedVouchers.includes(code);

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl text-gray-900 mb-1">{title}</h2>
          <p className="text-gray-600">{subtitle}</p>
        </div>
        <Button
          variant="outline"
          onClick={() => onNavigate("promotions")}
          className="border-blue-600 text-blue-600 hover:bg-blue-50"
        >
          Xem tất cả →
        </Button>
      </div>

      <Carousel className="w-full">
        <CarouselContent className="-ml-2 md:-ml-4">
          {vouchers.map((voucher: any) => (
            <CarouselItem key={voucher.id} className="md:basis-1/2 lg:basis-1/3 pl-2 md:pl-4">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group h-full flex flex-col">
                <div className="relative h-48">
                  <ImageWithFallback
                    alt={voucher.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    src={voucher.image || "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&h=400&fit=crop"}
                  />
                  <div className="absolute top-3 right-3 bg-red-600 text-white px-3 py-1 rounded-full font-semibold">
                    {voucher.type === 'PERCENTAGE' 
                      ? `Giảm ${voucher.value}%` 
                      : `Giảm ${(voucher.value / 1000).toFixed(0)}K`}
                  </div>
                  {isSaved(voucher.code) && (
                    <div className="absolute top-3 left-3 bg-green-600 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      Đã lưu
                    </div>
                  )}
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{voucher.title}</h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-1">{voucher.description}</p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <code className="border-2 border-dashed border-purple-600 text-purple-600 rounded px-3 py-1 font-mono text-sm">
                        {voucher.code}
                      </code>
                    </div>
                    <Button
                      onClick={() => onSaveVoucher(voucher)}
                      disabled={isSaved(voucher.code)}
                      className={`w-full ${
                        isSaved(voucher.code)
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-700'
                      }`}
                    >
                      {isSaved(voucher.code) ? (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Đã lưu vào ví
                        </>
                      ) : (
                        <>
                          <Ticket className="w-4 h-4 mr-2" />
                          Lưu voucher
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex" />
        <CarouselNext className="hidden md:flex" />
      </Carousel>
    </section>
  );
}
