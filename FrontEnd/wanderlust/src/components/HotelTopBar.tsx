import { Grid3x3, List } from "lucide-react";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface HotelTopBarProps {
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  totalResults: number;
  sortBy: string;
  onSortChange: (sort: string) => void;
  destination?: string;
}

export function HotelTopBar({
  viewMode,
  onViewModeChange,
  totalResults,
  sortBy,
  onSortChange,
  destination = "Đà Nẵng",
}: HotelTopBarProps) {
  return (
    <div className="bg-white border-b p-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left: Results count */}
        <p className="text-sm text-gray-700">
          Tìm thấy <span className="font-semibold">{totalResults}</span> cơ sở
          lưu trú tại <span className="font-semibold">{destination}</span>
        </p>

        {/* Right: Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          {/* Sort */}
          <div className="flex items-center gap-2">
            <span className="text-sm whitespace-nowrap">Xếp theo:</span>
            <Select value={sortBy} onValueChange={onSortChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">Độ phổ biến</SelectItem>
                <SelectItem value="price-low">Giá thấp → cao</SelectItem>
                <SelectItem value="price-high">Giá cao → thấp</SelectItem>
                <SelectItem value="rating">Đánh giá cao nhất</SelectItem>
                <SelectItem value="distance">Khoảng cách</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Price display */}
          <div className="flex items-center gap-2">
            <span className="text-sm whitespace-nowrap">Hiển thị giá:</span>
            <Select defaultValue="per-night">
              <SelectTrigger className="w-[280px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="per-night">
                  Mỗi phòng mỗi đêm (Bao gồm phí và thuế)
                </SelectItem>
                <SelectItem value="total">Tổng giá (Bao gồm phí và thuế)</SelectItem>
                <SelectItem value="per-person">Mỗi người mỗi đêm</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* View mode toggle */}
          <div className="flex items-center gap-2 border-l pl-4">
            <span className="text-sm">Xem</span>
            <div className="flex gap-1">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => onViewModeChange("grid")}
                className="px-3"
              >
                <Grid3x3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => onViewModeChange("list")}
                className="px-3"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
