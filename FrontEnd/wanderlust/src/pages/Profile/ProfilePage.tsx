import { Award, Camera, Edit, MapPin, Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner@2.0.3";
import avatarMan from "../../assets/images/avatarman.jpeg";
import avatarOther from "../../assets/images/avatarother.jpeg";
import avatarWoman from "../../assets/images/avatarwoman.jpeg";
import { ProfileLayout } from "../../components/ProfileLayout";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import type { PageType } from "../../MainApp";
import { profileApi, tokenService } from "../../utils/api";

interface ProfilePageProps {
  onNavigate: (page: PageType, data?: any) => void;
}

export default function ProfilePage({ onNavigate }: ProfilePageProps) {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [membershipLevel, setMembershipLevel] = useState("BRONZE");
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);
  const [totalTrips, setTotalTrips] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [avatarDialogOpen, setAvatarDialogOpen] = useState(false);
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

  // Default avatar options
  const defaultAvatars = [
    { id: 'male', src: avatarMan, label: 'Nam' },
    { id: 'female', src: avatarWoman, label: 'Nữ' },
    { id: 'other', src: avatarOther, label: 'Khác' },
  ];

  // Get avatar based on gender
  const getAvatarSrc = (userData: any): string => {
    if (userData?.avatar) {
      return userData.avatar;
    }
    const gender = userData?.gender?.toUpperCase();
    switch (gender) {
      case 'MALE':
        return avatarMan;
      case 'FEMALE':
        return avatarWoman;
      case 'OTHER':
        return avatarOther;
      default:
        return avatarOther;
    }
  };

  // Handle avatar change
  const handleAvatarChange = async (avatarUrl: string) => {
    try {
      setFormData({ ...formData, avatar: avatarUrl });
      
      // Update backend
      await profileApi.updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        mobile: formData.phone,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender?.toUpperCase(),
        address: formData.address,
        city: formData.city,
        country: formData.country,
        passportNumber: formData.passportNumber,
        passportExpiryDate: formData.passportExpiry,
        avatar: avatarUrl,
      });
      
      // Update localStorage
      const currentUserData = tokenService.getUserData();
      if (currentUserData) {
        tokenService.setUserData({
          ...currentUserData,
          avatar: avatarUrl,
        });
      }
      
      setAvatarDialogOpen(false);
      toast.success('Cập nhật avatar thành công!');
    } catch (error: any) {
      toast.error(error.message || 'Không thể cập nhật avatar');
    }
  };

  // Handle custom avatar upload
  const handleCustomAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        handleAvatarChange(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  // Load user data from API on mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true);
        
        // Fetch current user profile from backend
        const userData = await profileApi.getCurrentUser();
        
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
          passportExpiry: userData.passportExpiryDate || "",
          avatar: userData.avatar || "",
        });
        
        // Update localStorage with fresh data
        tokenService.setUserData(userData);
        
        // Load membership info
        const membershipInfo = await profileApi.getMembershipInfo();
        setMembershipLevel(membershipInfo.membershipLevel || "BRONZE");
        setLoyaltyPoints(membershipInfo.loyaltyPoints || 0);
        
        // Load user stats
        const stats = await profileApi.getUserStats();
        setTotalTrips(stats.totalTrips || 0);
        setTotalReviews(stats.totalReviews || 0);
        
      } catch (error: any) {
        console.error('Failed to load user data:', error);
        toast.error(error.message || 'Failed to load profile');
        
        // Fallback to localStorage if API fails
        const localData = tokenService.getUserData();
        if (localData) {
          setFormData({
            firstName: localData.firstName || "",
            lastName: localData.lastName || "",
            email: localData.email || "",
            phone: localData.mobile || "",
            dateOfBirth: localData.dateOfBirth || "",
            gender: localData.gender?.toLowerCase() || "",
            address: localData.address || "",
            city: localData.city || "",
            country: localData.country || "",
            passportNumber: localData.passportNumber || "",
            passportExpiry: localData.passportExpiryDate || "",
            avatar: localData.avatar || "",
          });
          setMembershipLevel(localData.membershipLevel || "BRONZE");
          setLoyaltyPoints(localData.loyaltyPoints || 0);
        }
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
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
      toast.success(t('profile.updateSuccess'));
    } catch (error: any) {
      toast.error(error.message || t('profile.updateFailed'));
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
    { label: t('profile.trips'), value: totalTrips.toString(), icon: MapPin, color: "text-blue-600" },
    { label: t('profile.points'), value: loyaltyPoints.toLocaleString('vi-VN'), icon: Award, color: "text-yellow-600" },
    { label: t('profile.ratingsCount'), value: totalReviews.toString(), icon: Award, color: "text-green-600" },
  ];

  return (
    <ProfileLayout currentPage="profile" onNavigate={onNavigate} activePage="profile">
      <div className="space-y-6">
        {/* Avatar Change Dialog */}
        <Dialog open={avatarDialogOpen} onOpenChange={setAvatarDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Thay đổi ảnh đại diện</DialogTitle>
              <DialogDescription>
                Chọn một trong các ảnh mặc định hoặc tải ảnh của bạn lên
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {/* Default Avatars */}
              <div className="grid grid-cols-3 gap-4">
                {defaultAvatars.map((avatar) => (
                  <button
                    key={avatar.id}
                    onClick={() => handleAvatarChange(avatar.src)}
                    className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <img
                      src={avatar.src}
                      alt={avatar.label}
                      className="w-20 h-20 rounded-full object-cover border-2 border-gray-200 hover:border-blue-500"
                    />
                    <span className="text-sm text-gray-600">{avatar.label}</span>
                  </button>
                ))}
              </div>
              
              {/* Custom Upload */}
              <div className="border-t pt-4">
                <label className="block">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCustomAvatarUpload}
                    className="hidden"
                    id="avatar-upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => document.getElementById('avatar-upload')?.click()}
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Tải ảnh lên
                  </Button>
                </label>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl text-gray-900 mb-2">{t('profile.personalInfo')}</h1>
            <p className="text-gray-600">{t('profile.managePersonalInfo')}</p>
          </div>
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)} className="gap-2">
              <Edit className="w-4 h-4" />
              {t('profile.edit')}
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button onClick={handleCancel} variant="outline" className="gap-2">
                <X className="w-4 h-4" />
                {t('profile.cancel')}
              </Button>
              <Button onClick={handleSave} className="gap-2">
                <Save className="w-4 h-4" />
                {t('profile.saveChanges')}
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
          <div className="flex items-start justify-between mb-6">
            <h2 className="text-xl text-gray-900">{t('profile.basicInfo')}</h2>
            {/* Avatar Section */}
            <div className="relative group">
              <img
                src={getAvatarSrc(formData)}
                alt="Profile Avatar"
                className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
                onError={(e) => {
                  e.currentTarget.src = avatarOther;
                }}
              />
              <button
                onClick={() => setAvatarDialogOpen(true)}
                className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Camera className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="firstName">{t('profile.firstName')} <span className="text-red-600">*</span></Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                disabled={!isEditing}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="lastName">{t('profile.lastName')} <span className="text-red-600">*</span></Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                disabled={!isEditing}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="email">{t('profile.email')}</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                disabled
                className="mt-1 bg-gray-50"
              />
              <p className="text-xs text-gray-500 mt-1">{t('profile.emailCannotChange')}</p>
            </div>
            <div>
              <Label htmlFor="phone">{t('profile.phone')}</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                disabled={!isEditing}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="dateOfBirth">{t('profile.dateOfBirth')}</Label>
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
              <Label htmlFor="gender">{t('profile.gender')}</Label>
              <Select 
                value={formData.gender} 
                onValueChange={(v) => setFormData({ ...formData, gender: v })}
                disabled={!isEditing}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder={t('profile.selectGender')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">{t('profile.male')}</SelectItem>
                  <SelectItem value="female">{t('profile.female')}</SelectItem>
                  <SelectItem value="other">{t('profile.other')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Address Information */}
        <Card className="p-6">
          <h2 className="text-xl text-gray-900 mb-6">{t('profile.addressInfo')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Label htmlFor="address">{t('profile.address')}</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                disabled={!isEditing}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="city">{t('profile.city')}</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                disabled={!isEditing}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="country">{t('profile.country')}</Label>
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
          <h2 className="text-xl text-gray-900 mb-6">{t('profile.passportInfo')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="passportNumber">{t('profile.passportNumber')}</Label>
              <Input
                id="passportNumber"
                value={formData.passportNumber}
                onChange={(e) => setFormData({ ...formData, passportNumber: e.target.value })}
                disabled={!isEditing}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="passportExpiry">{t('profile.passportExpiry')}</Label>
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
        <Card className="p-6 bg-linear-to-r from-yellow-50 to-orange-50 border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl text-gray-900 mb-2">
                {t('profile.membershipLevel')} {
                  membershipLevel === "BRONZE" ? t('profile.bronze') : 
                  membershipLevel === "SILVER" ? t('profile.silver') : 
                  membershipLevel === "GOLD" ? t('profile.gold') : 
                  t('profile.platinum')
                }
              </h3>
              <p className="text-gray-600 mb-4">
                {membershipLevel === "PLATINUM" 
                  ? t('profile.currentPoints', { points: loyaltyPoints.toLocaleString() })
                  : t('profile.pointsToNextLevel', {
                      points: (
                        membershipLevel === "BRONZE" ? 5000 - loyaltyPoints : 
                        membershipLevel === "SILVER" ? 15000 - loyaltyPoints : 
                        30000 - loyaltyPoints
                      ).toLocaleString(),
                      level: membershipLevel === "BRONZE" ? t('profile.silver') : 
                             membershipLevel === "SILVER" ? t('profile.gold') : 
                             t('profile.platinum')
                    })
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
