import { useState, useEffect } from "react";
import { ProfileLayout } from "../../components/ProfileLayout";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Card } from "../../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Edit, Save, X, MapPin, Award } from "lucide-react";
import type { PageType } from "../../MainApp";
import { toast } from "sonner@2.0.3";
import { tokenService, profileApi } from "../../utils/api";

interface ProfilePageProps {
  onNavigate: (page: PageType, data?: any) => void;
}

export default function ProfilePage({ onNavigate }: ProfilePageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [membershipLevel, setMembershipLevel] = useState("BRONZE");
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    city: "",
    country: "",
    passportNumber: "",
    passportExpiry: "",
    avatar: "",
  });

  // Load user data from localStorage on mount
  useEffect(() => {
    const userData = tokenService.getUserData();
    if (userData) {
      setFormData({
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        email: userData.email || "",
        phone: userData.mobile || "",
        dateOfBirth: userData.dateOfBirth || "",
        gender: userData.gender?.toLowerCase() || "",
        address: userData.address || "",
        city: userData.city || "",
        country: userData.country || "",
        passportNumber: userData.passportNumber || "",
        passportExpiry: (userData as any).passportExpiryDate || "", // Backend uses passportExpiryDate
        avatar: userData.avatar || "",
      });
      
      // Load membership info
      setMembershipLevel((userData as any).membershipLevel || "BRONZE");
      setLoyaltyPoints((userData as any).loyaltyPoints || 0);
    }
    setLoading(false);
  }, []);

  const handleSave = async () => {
    try {
      setLoading(true);
      
      // Call API to update profile
      const updatedUser = await profileApi.updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        mobile: formData.phone,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender?.toUpperCase(),
        address: formData.address,
        city: formData.city,
        country: formData.country,
        passportNumber: formData.passportNumber,
        passportExpiryDate: formData.passportExpiry, // Backend uses passportExpiryDate
      });
      
      // Update localStorage with response from API
      const currentUserData = tokenService.getUserData();
      if (currentUserData) {
        tokenService.setUserData({
          ...currentUserData,
          firstName: updatedUser.firstName || formData.firstName,
          lastName: updatedUser.lastName || formData.lastName,
          mobile: updatedUser.mobile || formData.phone,
          dateOfBirth: updatedUser.dateOfBirth || formData.dateOfBirth,
          gender: updatedUser.gender || formData.gender?.toUpperCase(),
          address: updatedUser.address || formData.address,
          city: updatedUser.city || formData.city,
          country: updatedUser.country || formData.country,
          passportNumber: updatedUser.passportNumber || formData.passportNumber,
          passportExpiryDate: updatedUser.passportExpiryDate || formData.passportExpiry,
        });
      }
      
      setIsEditing(false);
      toast.success("Cập nhật thông tin thành công!");
    } catch (error: any) {
      toast.error(error.message || "Cập nhật thông tin thất bại!");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data from localStorage
    const userData = tokenService.getUserData();
    if (userData) {
      setFormData({
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        email: userData.email || "",
        phone: userData.mobile || "",
        dateOfBirth: userData.dateOfBirth || "",
        gender: userData.gender?.toLowerCase() || "",
        address: userData.address || "",
        city: userData.city || "",
        country: userData.country || "",
        passportNumber: userData.passportNumber || "",
        passportExpiry: (userData as any).passportExpiryDate || "", // Backend uses passportExpiryDate
        avatar: userData.avatar || "",
      });
    }
  };

  const stats = [
    { label: "Chuyến đi", value: "12", icon: MapPin, color: "text-blue-600" },
    { label: "Điểm tích lũy", value: "2,450", icon: Award, color: "text-yellow-600" },
    { label: "Đánh giá", value: "8", icon: Award, color: "text-green-600" },
  ];

  return (
    <ProfileLayout currentPage="profile" onNavigate={onNavigate} activePage="profile">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl text-gray-900 mb-2">Thông tin cá nhân</h1>
            <p className="text-gray-600">Quản lý thông tin cá nhân của bạn</p>
          </div>
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)} className="gap-2">
              <Edit className="w-4 h-4" />
              Chỉnh sửa
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button onClick={handleCancel} variant="outline" className="gap-2">
                <X className="w-4 h-4" />
                Hủy
              </Button>
              <Button onClick={handleSave} className="gap-2">
                <Save className="w-4 h-4" />
                Lưu thay đổi
              </Button>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                    <p className={`text-3xl ${stat.color}`}>{stat.value}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Personal Information */}
        <Card className="p-6">
          <h2 className="text-xl text-gray-900 mb-6">Thông tin cơ bản</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="firstName">Tên <span className="text-red-600">*</span></Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                disabled={!isEditing}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="lastName">Họ <span className="text-red-600">*</span></Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                disabled={!isEditing}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                disabled
                className="mt-1 bg-gray-50"
              />
              <p className="text-xs text-gray-500 mt-1">Email không thể thay đổi</p>
            </div>
            <div>
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                disabled={!isEditing}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="dateOfBirth">Ngày sinh</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                disabled={!isEditing}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="gender">Giới tính</Label>
              <Select 
                value={formData.gender} 
                onValueChange={(v) => setFormData({ ...formData, gender: v })}
                disabled={!isEditing}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Chọn giới tính" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Nam</SelectItem>
                  <SelectItem value="female">Nữ</SelectItem>
                  <SelectItem value="other">Khác</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Address Information */}
        <Card className="p-6">
          <h2 className="text-xl text-gray-900 mb-6">Địa chỉ</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Label htmlFor="address">Địa chỉ</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                disabled={!isEditing}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="city">Thành phố</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                disabled={!isEditing}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="country">Quốc gia</Label>
              <Input
                id="country"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                disabled={!isEditing}
                className="mt-1"
              />
            </div>
          </div>
        </Card>

        {/* Passport Information */}
        <Card className="p-6">
          <h2 className="text-xl text-gray-900 mb-6">Thông tin hộ chiếu</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="passportNumber">Số hộ chiếu</Label>
              <Input
                id="passportNumber"
                value={formData.passportNumber}
                onChange={(e) => setFormData({ ...formData, passportNumber: e.target.value })}
                disabled={!isEditing}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="passportExpiry">Ngày hết hạn</Label>
              <Input
                id="passportExpiry"
                type="date"
                value={formData.passportExpiry}
                onChange={(e) => setFormData({ ...formData, passportExpiry: e.target.value })}
                disabled={!isEditing}
                className="mt-1"
              />
            </div>
          </div>
        </Card>

        {/* Membership Info */}
        <Card className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl text-gray-900 mb-2">
                Thành viên {membershipLevel === "BRONZE" ? "Đồng" : membershipLevel === "SILVER" ? "Bạc" : membershipLevel === "GOLD" ? "Vàng" : "Bạch Kim"}
              </h3>
              <p className="text-gray-600 mb-4">
                {membershipLevel === "PLATINUM" 
                  ? `Bạn có ${loyaltyPoints.toLocaleString()} điểm tích lũy` 
                  : `Bạn còn ${(
                      membershipLevel === "BRONZE" ? 5000 - loyaltyPoints : 
                      membershipLevel === "SILVER" ? 15000 - loyaltyPoints : 
                      30000 - loyaltyPoints
                    ).toLocaleString()} điểm nữa để lên hạng ${
                      membershipLevel === "BRONZE" ? "Bạc" : 
                      membershipLevel === "SILVER" ? "Vàng" : 
                      "Bạch Kim"
                    }`
                }
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2 max-w-md">
                <div 
                  className={`h-2 rounded-full transition-all ${
                    membershipLevel === "BRONZE" ? "bg-orange-600" :
                    membershipLevel === "SILVER" ? "bg-gray-400" :
                    membershipLevel === "GOLD" ? "bg-yellow-500" :
                    "bg-purple-500"
                  }`}
                  style={{ 
                    width: `${Math.min(
                      membershipLevel === "BRONZE" ? (loyaltyPoints / 5000) * 100 :
                      membershipLevel === "SILVER" ? (loyaltyPoints / 15000) * 100 :
                      membershipLevel === "GOLD" ? (loyaltyPoints / 30000) * 100 :
                      100,
                      100
                    )}%` 
                  }}
                />
              </div>
            </div>
            <Award className={`w-16 h-16 ${
              membershipLevel === "BRONZE" ? "text-orange-600" :
              membershipLevel === "SILVER" ? "text-gray-400" :
              membershipLevel === "GOLD" ? "text-yellow-500" :
              "text-purple-500"
            }`} />
          </div>
        </Card>
      </div>
    </ProfileLayout>
  );
}
