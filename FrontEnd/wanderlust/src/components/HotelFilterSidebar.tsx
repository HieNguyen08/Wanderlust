import { useState } from "react";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";
import { Button } from "./ui/button";
import { Star } from "lucide-react";

interface FilterState {
  priceRange: [number, number];
  freeCancellation: boolean;
  amenities: string[];
  propertyTypes: string[];
  ratings: number[];
  preferences: string[];
}

interface HotelFilterSidebarProps {
  onFilterChange: (filters: FilterState) => void;
}

export function HotelFilterSidebar({ onFilterChange }: HotelFilterSidebarProps) {
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 10000000],
    freeCancellation: false,
    amenities: [],
    propertyTypes: [],
    ratings: [],
    preferences: [],
  });

  const updateFilter = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const toggleArrayItem = (key: keyof FilterState, item: string) => {
    const currentArray = filters[key] as string[];
    const newArray = currentArray.includes(item)
      ? currentArray.filter((i) => i !== item)
      : [...currentArray, item];
    updateFilter(key, newArray);
  };

  const resetFilters = () => {
    const defaultFilters: FilterState = {
      priceRange: [0, 10000000],
      freeCancellation: false,
      amenities: [],
      propertyTypes: [],
      ratings: [],
      preferences: [],
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  return (
    <div className="w-full lg:w-[310px] bg-white border-r p-4 space-y-6 overflow-y-auto max-h-screen">
      {/* Price Range */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Phạm vi giá</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => updateFilter("priceRange", [0, 10000000])}
            className="text-xs text-blue-600"
          >
            Đặt lại
          </Button>
        </div>
        <Slider
          min={0}
          max={10000000}
          step={100000}
          value={filters.priceRange}
          onValueChange={(value) => updateFilter("priceRange", value as [number, number])}
          className="w-full"
        />
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span>{filters.priceRange[0].toLocaleString("vi-VN")} đ</span>
          <span>{filters.priceRange[1].toLocaleString("vi-VN")} đ</span>
        </div>
      </div>

      {/* Free Cancellation */}
      <div className="space-y-3">
        <h3 className="font-semibold">Chính sách đặt phòng</h3>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="free-cancel"
            checked={filters.freeCancellation}
            onCheckedChange={(checked) =>
              updateFilter("freeCancellation", checked)
            }
          />
          <Label htmlFor="free-cancel" className="text-sm cursor-pointer">
            Miễn phí hủy
          </Label>
        </div>
      </div>

      {/* Amenities */}
      <div className="space-y-3">
        <h3 className="font-semibold">Tiện nghi</h3>
        <div className="space-y-2">
          {[
            "Wifi",
            "Hồ bơi",
            "Chỗ đậu xe",
            "Nhà hàng",
            "Phòng tập gym",
            "Spa",
            "Dịch vụ phòng",
            "Quầy bar",
            "Trung tâm thể dục",
            "Dịch vụ giặt ủi",
          ].map((amenity) => (
            <div key={amenity} className="flex items-center space-x-2">
              <Checkbox
                id={`amenity-${amenity}`}
                checked={filters.amenities.includes(amenity)}
                onCheckedChange={() => toggleArrayItem("amenities", amenity)}
              />
              <Label
                htmlFor={`amenity-${amenity}`}
                className="text-sm cursor-pointer"
              >
                {amenity}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Property Type */}
      <div className="space-y-3">
        <h3 className="font-semibold">Loại hình cư trú</h3>
        <div className="space-y-2">
          {[
            "Căn hộ",
            "Khách sạn",
            "Biệt thự",
            "Resort",
            "Nhà nghỉ",
            "Homestay",
          ].map((type) => (
            <div key={type} className="flex items-center space-x-2">
              <Checkbox
                id={`type-${type}`}
                checked={filters.propertyTypes.includes(type)}
                onCheckedChange={() => toggleArrayItem("propertyTypes", type)}
              />
              <Label
                htmlFor={`type-${type}`}
                className="text-sm cursor-pointer"
              >
                {type}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div className="space-y-3">
        <h3 className="font-semibold">Đánh giá</h3>
        <div className="space-y-2">
          {[5, 4, 3].map((rating) => (
            <div key={rating} className="flex items-center space-x-2">
              <Checkbox
                id={`rating-${rating}`}
                checked={filters.ratings.includes(rating)}
                onCheckedChange={() =>
                  toggleArrayItem("ratings", rating.toString())
                }
              />
              <Label
                htmlFor={`rating-${rating}`}
                className="flex items-center gap-1 cursor-pointer"
              >
                {[...Array(rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-3 h-3 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Preferences */}
      <div className="space-y-3">
        <h3 className="font-semibold">Ưu tiên</h3>
        <div className="space-y-2">
          {[
            "Thanh toán tại khách sạn",
            "Phù hợp cho gia đình",
            "Có xuất hóa đơn",
          ].map((pref) => (
            <div key={pref} className="flex items-center space-x-2">
              <Checkbox
                id={`pref-${pref}`}
                checked={filters.preferences.includes(pref)}
                onCheckedChange={() => toggleArrayItem("preferences", pref)}
              />
              <Label
                htmlFor={`pref-${pref}`}
                className="text-sm cursor-pointer"
              >
                {pref}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Reset All */}
      <Button
        variant="outline"
        className="w-full"
        onClick={resetFilters}
      >
        Đặt lại tất cả bộ lọc
      </Button>
    </div>
  );
}
