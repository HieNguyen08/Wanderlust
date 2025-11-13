import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Upload, X, Plus } from "lucide-react";
import { toast } from "sonner";

interface AddServiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

type ServiceType = "hotel" | "activity" | "car";

export function AddServiceDialog({ open, onOpenChange, onSuccess }: AddServiceDialogProps) {
  const [serviceType, setServiceType] = useState<ServiceType>("hotel");
  const [formData, setFormData] = useState({
    // Common fields
    name: "",
    description: "",
    price: "",
    images: [] as string[],
    
    // Hotel specific
    roomType: "",
    capacity: "",
    amenities: "",
    
    // Activity specific
    duration: "",
    groupSize: "",
    includes: "",
    excludes: "",
    itinerary: "",
    
    // Car specific
    brand: "",
    model: "",
    seats: "",
    year: "",
    features: "",
  });

  const [imageUrl, setImageUrl] = useState("");

  const handleAddImage = () => {
    if (imageUrl && formData.images.length < 5) {
      setFormData({ ...formData, images: [...formData.images, imageUrl] });
      setImageUrl("");
    } else if (formData.images.length >= 5) {
      toast.error("Tối đa 5 ảnh");
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = () => {
    // Validation
    if (!formData.name || !formData.description || !formData.price) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    if (formData.images.length === 0) {
      toast.error("Vui lòng thêm ít nhất 1 ảnh");
      return;
    }

    // TODO: Call API to submit service for approval
    console.log("Submitting service:", { serviceType, ...formData });
    onSuccess();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Thêm dịch vụ mới</DialogTitle>
          <DialogDescription>
            Điền đầy đủ thông tin dịch vụ. Admin sẽ duyệt trong 1-2 ngày làm việc.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Service Type Selection */}
          <div>
            <Label>Loại dịch vụ <span className="text-red-600">*</span></Label>
            <Select value={serviceType} onValueChange={(v) => setServiceType(v as ServiceType)}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hotel">Khách sạn / Phòng</SelectItem>
                <SelectItem value="activity">Hoạt động / Tour</SelectItem>
                <SelectItem value="car">Thuê xe</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Tabs value={serviceType} className="w-full">
            {/* Hotel Form */}
            <TabsContent value="hotel" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="name">Tên phòng <span className="text-red-600">*</span></Label>
                  <Input
                    id="name"
                    placeholder="VD: Deluxe Ocean View Room"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="roomType">Loại phòng <span className="text-red-600">*</span></Label>
                  <Select value={formData.roomType} onValueChange={(v) => setFormData({ ...formData, roomType: v })}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Chọn loại phòng" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="deluxe">Deluxe</SelectItem>
                      <SelectItem value="suite">Suite</SelectItem>
                      <SelectItem value="presidential">Presidential</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="capacity">Sức chứa (người) <span className="text-red-600">*</span></Label>
                  <Input
                    id="capacity"
                    type="number"
                    placeholder="2"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="price">Giá/đêm (VND) <span className="text-red-600">*</span></Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="3500000"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="amenities">Tiện nghi <span className="text-red-600">*</span></Label>
                  <Input
                    id="amenities"
                    placeholder="VD: WiFi miễn phí, TV, Điều hòa, Mini bar, Bồn tắm"
                    value={formData.amenities}
                    onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">Ngăn cách bằng dấu phẩy</p>
                </div>
                <div className="col-span-2">
                  <Label htmlFor="description">Mô tả chi tiết <span className="text-red-600">*</span></Label>
                  <Textarea
                    id="description"
                    placeholder="Mô tả chi tiết về phòng, view, diện tích, v.v..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="mt-1"
                  />
                </div>
              </div>
            </TabsContent>

            {/* Activity Form */}
            <TabsContent value="activity" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="name">Tên hoạt động / Tour <span className="text-red-600">*</span></Label>
                  <Input
                    id="name"
                    placeholder="VD: Tour Hướng đạo sinh Phú Quốc"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="duration">Thời gian <span className="text-red-600">*</span></Label>
                  <Input
                    id="duration"
                    placeholder="VD: 1 ngày, 3 giờ, 2 ngày 1 đêm"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="groupSize">Số người/nhóm <span className="text-red-600">*</span></Label>
                  <Input
                    id="groupSize"
                    placeholder="VD: 2-10 người"
                    value={formData.groupSize}
                    onChange={(e) => setFormData({ ...formData, groupSize: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="price">Giá/người (VND) <span className="text-red-600">*</span></Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="1500000"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="description">Mô tả tổng quan <span className="text-red-600">*</span></Label>
                  <Textarea
                    id="description"
                    placeholder="Mô tả ngắn gọn về hoạt động này..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="mt-1"
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="itinerary">Lịch trình chi tiết <span className="text-red-600">*</span></Label>
                  <Textarea
                    id="itinerary"
                    placeholder="8:00 - Đón khách tại khách sạn&#10;9:00 - Khởi hành...&#10;12:00 - Ăn trưa..."
                    value={formData.itinerary}
                    onChange={(e) => setFormData({ ...formData, itinerary: e.target.value })}
                    rows={5}
                    className="mt-1"
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="includes">Bao gồm <span className="text-red-600">*</span></Label>
                  <Textarea
                    id="includes"
                    placeholder="VD: Vé tham quan, Bữa trưa, Hướng dẫn viên, Bảo hiểm"
                    value={formData.includes}
                    onChange={(e) => setFormData({ ...formData, includes: e.target.value })}
                    rows={3}
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">Mỗi dòng là 1 mục</p>
                </div>
                <div className="col-span-2">
                  <Label htmlFor="excludes">Không bao gồm</Label>
                  <Textarea
                    id="excludes"
                    placeholder="VD: Chi phí cá nhân, Đồ uống ngoài"
                    value={formData.excludes}
                    onChange={(e) => setFormData({ ...formData, excludes: e.target.value })}
                    rows={2}
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">Mỗi dòng là 1 mục</p>
                </div>
              </div>
            </TabsContent>

            {/* Car Form */}
            <TabsContent value="car" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="brand">Hãng xe <span className="text-red-600">*</span></Label>
                  <Input
                    id="brand"
                    placeholder="VD: Toyota, Honda, Ford"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="model">Dòng xe <span className="text-red-600">*</span></Label>
                  <Input
                    id="model"
                    placeholder="VD: Fortuner, CR-V, Everest"
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="seats">Số chỗ <span className="text-red-600">*</span></Label>
                  <Select value={formData.seats} onValueChange={(v) => setFormData({ ...formData, seats: v })}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Chọn số chỗ" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="4">4 chỗ</SelectItem>
                      <SelectItem value="5">5 chỗ</SelectItem>
                      <SelectItem value="7">7 chỗ</SelectItem>
                      <SelectItem value="9">9 chỗ</SelectItem>
                      <SelectItem value="16">16 chỗ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="year">Năm sản xuất <span className="text-red-600">*</span></Label>
                  <Input
                    id="year"
                    type="number"
                    placeholder="2023"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="name">Tên hiển thị <span className="text-red-600">*</span></Label>
                  <Input
                    id="name"
                    placeholder="VD: Toyota Fortuner 7 chỗ 2023"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="price">Giá thuê/ngày (VND) <span className="text-red-600">*</span></Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="2000000"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="features">Tính năng xe <span className="text-red-600">*</span></Label>
                  <Input
                    id="features"
                    placeholder="VD: Điều hòa, GPS, Camera lùi, Cửa sổ trời"
                    value={formData.features}
                    onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">Ngăn cách bằng dấu phẩy</p>
                </div>
                <div className="col-span-2">
                  <Label htmlFor="description">Mô tả chi tiết <span className="text-red-600">*</span></Label>
                  <Textarea
                    id="description"
                    placeholder="Mô tả tình trạng xe, chính sách thuê, điều khoản..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="mt-1"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Image Upload Section - Common for all types */}
          <div className="space-y-3">
            <Label>Hình ảnh <span className="text-red-600">*</span> (Tối đa 5 ảnh)</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Nhập URL hình ảnh từ Unsplash hoặc nguồn khác"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddImage()}
              />
              <Button type="button" variant="outline" onClick={handleAddImage}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              Lưu ý: Ảnh phải rõ nét, chất lượng cao. Ảnh đầu tiên sẽ là ảnh đại diện.
            </p>

            {/* Image Preview Grid */}
            {formData.images.length > 0 && (
              <div className="grid grid-cols-5 gap-3">
                {formData.images.map((img, index) => (
                  <div key={index} className="relative group aspect-square">
                    <ImageWithFallback
                      src={img}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    {index === 0 && (
                      <div className="absolute bottom-1 left-1 bg-blue-600 text-white text-xs px-2 py-0.5 rounded">
                        Ảnh đại diện
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={handleSubmit}>
            Gửi yêu cầu duyệt
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
