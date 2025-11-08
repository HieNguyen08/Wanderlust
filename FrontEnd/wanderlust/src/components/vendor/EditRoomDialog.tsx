import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Save } from "lucide-react";

interface Room {
  id: string;
  name: string;
  type: string;
  image: string;
  price: number;
  capacity: number;
  available: number;
  total: number;
  rating: number;
  reviews: number;
  bookings: number;
  revenue: number;
  status: "active" | "inactive" | "maintenance";
  amenities: string[];
  description?: string;
}

interface EditRoomDialogProps {
  room: Room | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (room: Room) => void;
}

export function EditRoomDialog({
  room,
  isOpen,
  onClose,
  onSave,
}: EditRoomDialogProps) {
  const [formData, setFormData] = useState<Partial<Room>>({});

  useEffect(() => {
    if (room) {
      setFormData(room);
    }
  }, [room]);

  const handleSave = () => {
    if (formData && room) {
      onSave({ ...room, ...formData });
      onClose();
    }
  };

  const handleChange = (field: keyof Room, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!room) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa phòng</DialogTitle>
          <DialogDescription>
            Cập nhật thông tin phòng {room.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="name">Tên phòng</Label>
              <Input
                id="name"
                value={formData.name || ""}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Deluxe Ocean View"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="type">Loại phòng</Label>
              <Input
                id="type"
                value={formData.type || ""}
                onChange={(e) => handleChange("type", e.target.value)}
                placeholder="Deluxe"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="capacity">Sức chứa (người)</Label>
              <Input
                id="capacity"
                type="number"
                value={formData.capacity || ""}
                onChange={(e) => handleChange("capacity", parseInt(e.target.value))}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="price">Giá/đêm (VND)</Label>
              <Input
                id="price"
                type="number"
                value={formData.price || ""}
                onChange={(e) => handleChange("price", parseInt(e.target.value))}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="total">Tổng số phòng</Label>
              <Input
                id="total"
                type="number"
                value={formData.total || ""}
                onChange={(e) => handleChange("total", parseInt(e.target.value))}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="available">Số phòng trống</Label>
              <Input
                id="available"
                type="number"
                value={formData.available || ""}
                onChange={(e) => handleChange("available", parseInt(e.target.value))}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="status">Trạng thái</Label>
              <Select
                value={formData.status || "active"}
                onValueChange={(value) => handleChange("status", value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Hoạt động</SelectItem>
                  <SelectItem value="inactive">Tạm ngưng</SelectItem>
                  <SelectItem value="maintenance">Bảo trì</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-2">
              <Label htmlFor="amenities">Tiện nghi (phân cách bằng dấu phẩy)</Label>
              <Input
                id="amenities"
                value={formData.amenities?.join(", ") || ""}
                onChange={(e) => handleChange("amenities", e.target.value.split(",").map(s => s.trim()))}
                placeholder="WiFi, TV, Mini bar, Ocean view"
                className="mt-1"
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                value={formData.description || ""}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Mô tả chi tiết về phòng..."
                className="mt-1"
                rows={3}
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="image">URL hình ảnh</Label>
              <Input
                id="image"
                value={formData.image || ""}
                onChange={(e) => handleChange("image", e.target.value)}
                placeholder="https://..."
                className="mt-1"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Hủy
            </Button>
            <Button onClick={handleSave} className="flex-1 gap-2">
              <Save className="w-4 h-4" />
              Lưu thay đổi
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
