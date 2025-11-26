import { AlertCircle, Bell, CheckCircle, Clock, Eye, Loader2, MessageSquare } from "lucide-react";
import { useEffect, useState } from "react";
import type { PageType } from "../MainApp";
import { notificationApi, type NotificationDTO } from "../api/notificationApi";
import { tokenService } from "../utils/api";
import { Badge } from "./ui/badge";

interface Notification {
  id: string;
  type: "booking" | "review" | "payment" | "system" | "promotion";
  title: string;
  message: string;
  time: string;
  read: boolean;
  link?: {
    page: PageType;
    data?: any;
  };
}

interface NotificationDropdownProps {
  onNavigate: (page: PageType, data?: any) => void;
  userRole?: "user" | "vendor" | "admin";
}

export function NotificationDropdown({ onNavigate, userRole = "user" }: NotificationDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch notifications from API
  useEffect(() => {
    // Only load if user is authenticated and dropdown is open
    if (isOpen && tokenService.isAuthenticated()) {
      loadNotifications();
    }
  }, [isOpen]);

  // Fetch unread count on mount and periodically
  useEffect(() => {
    // Only load if user is authenticated
    if (!tokenService.isAuthenticated()) {
      return;
    }
    
    loadUnreadCount();
    const interval = setInterval(loadUnreadCount, 30000); // Every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadNotifications = async () => {
    try {
      setIsLoading(true);
      const data = await notificationApi.getMyNotifications();
      setNotifications(mapNotificationsFromAPI(data));
    } catch (error) {
      console.error("Error loading notifications:", error);
      // Fallback to mock data if API fails
      setNotifications(getMockNotifications(userRole));
    } finally {
      setIsLoading(false);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const count = await notificationApi.getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      // Silently fail if not authenticated
      if (error instanceof Error && error.message !== 'UNAUTHORIZED') {
        console.error("Error loading unread count:", error);
      }
    }
  };

  const mapNotificationsFromAPI = (apiNotifications: NotificationDTO[]): Notification[] => {
    return apiNotifications.map(n => ({
      id: n.id,
      type: n.type.toLowerCase() as any,
      title: n.title,
      message: n.message,
      time: formatTimeAgo(n.createdAt),
      read: n.read,
      link: n.relatedEntityId ? {
        page: getPageFromEntityType(n.relatedEntityType),
        data: { id: n.relatedEntityId }
      } : undefined,
    }));
  };

  const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return "Vừa xong";
    if (diffMins < 60) return `${diffMins} phút trước`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} giờ trước`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays} ngày trước`;
    
    return date.toLocaleDateString("vi-VN");
  };

  const getPageFromEntityType = (entityType?: string): PageType => {
    switch (entityType) {
      case "BOOKING": return "booking-history";
      case "REVIEW": return "vendor-reviews";
      case "PAYMENT": return "user-wallet";
      default: return "home";
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    // Mark as read via API
    if (!notification.read) {
      try {
        await notificationApi.markAsRead(notification.id);
        setNotifications(prev =>
          prev.map(n => n.id === notification.id ? { ...n, read: true } : n)
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      } catch (error) {
        console.error("Error marking notification as read:", error);
      }
    }

    // Navigate to linked page
    if (notification.link) {
      onNavigate(notification.link.page, notification.link.data);
      setIsOpen(false);
    }
  };

  const markAllAsRead = async () => {
    const unreadNotifications = notifications.filter(n => !n.read);
    
    try {
      await Promise.all(
        unreadNotifications.map(n => notificationApi.markAsRead(n.id))
      );
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const clearAll = async () => {
    try {
      await Promise.all(
        notifications.map(n => notificationApi.deleteNotification(n.id))
      );
      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      console.error("Error clearing notifications:", error);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "booking":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "review":
        return <MessageSquare className="w-5 h-5 text-blue-600" />;
      case "payment":
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case "promotion":
        return <AlertCircle className="w-5 h-5 text-purple-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div className="relative">
      {/* Bell Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-gray-100 rounded-lg transition-all"
      >
        <Bell className="w-5 h-5 text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown Content */}
          <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 max-h-[500px] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-900">Thông báo</h3>
                {unreadCount > 0 && (
                  <Badge className="bg-red-500">{unreadCount} mới</Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                {notifications.length > 0 && (
                  <>
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Đánh dấu đã đọc
                    </button>
                    <span className="text-gray-300">|</span>
                    <button
                      onClick={clearAll}
                      className="text-xs text-red-600 hover:text-red-700 font-medium"
                    >
                      Xóa tất cả
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Notifications List */}
            <div className="overflow-y-auto flex-1">
              {isLoading ? (
                <div className="p-8 text-center">
                  <Loader2 className="w-8 h-8 text-gray-400 mx-auto mb-3 animate-spin" />
                  <p className="text-gray-500">Đang tải thông báo...</p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Không có thông báo mới</p>
                </div>
              ) : (
                <div>
                  {notifications.map((notification) => (
                    <button
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      className={`w-full p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors text-left flex gap-3 ${
                        !notification.read ? "bg-blue-50" : ""
                      }`}
                    >
                      {/* Icon */}
                      <div className="shrink-0 mt-1">
                        {getIcon(notification.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="font-semibold text-gray-900 text-sm">
                            {notification.title}
                          </h4>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full shrink-0 mt-1" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-1 line-clamp-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">{notification.time}</span>
                          {notification.link && (
                            <span className="text-xs text-blue-600 flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              Xem chi tiết
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function getMockNotifications(userRole: "user" | "vendor" | "admin"): Notification[] {
  if (userRole === "vendor") {
    return [
      {
        id: "V001",
        type: "booking",
        title: "Đơn đặt phòng mới",
        message: "Nguyễn Văn A đã đặt Deluxe Ocean View từ 15/01 - 20/01",
        time: "5 phút trước",
        read: false,
        link: {
          page: "vendor-bookings" as PageType,
        },
      },
      {
        id: "V002",
        type: "review",
        title: "Đánh giá mới",
        message: "Trần Thị B vừa đánh giá 5 sao cho Standard Room",
        time: "1 giờ trước",
        read: false,
        link: {
          page: "vendor-reviews" as PageType,
        },
      },
      {
        id: "V003",
        type: "payment",
        title: "Thanh toán thành công",
        message: "Booking BK-2025-001 đã được thanh toán 10.500.000đ",
        time: "2 giờ trước",
        read: true,
        link: {
          page: "vendor-bookings" as PageType,
        },
      },
    ];
  }

  if (userRole === "admin") {
    return [
      {
        id: "A001",
        type: "system",
        title: "Người dùng mới đăng ký",
        message: "5 người dùng mới đã đăng ký trong 24 giờ qua",
        time: "30 phút trước",
        read: false,
        link: {
          page: "admin-users" as PageType,
        },
      },
      {
        id: "A002",
        type: "review",
        title: "Đánh giá cần duyệt",
        message: "3 đánh giá mới đang chờ kiểm duyệt",
        time: "1 giờ trước",
        read: false,
        link: {
          page: "admin-reviews" as PageType,
        },
      },
      {
        id: "A003",
        type: "booking",
        title: "Doanh thu tăng trưởng",
        message: "Doanh thu hôm nay đạt 150 triệu, tăng 25% so với hôm qua",
        time: "3 giờ trước",
        read: true,
        link: {
          page: "admin-dashboard" as PageType,
        },
      },
    ];
  }

  // User notifications
  return [
    {
      id: "U001",
      type: "booking",
      title: "Xác nhận đặt phòng",
      message: "Đặt phòng Deluxe Ocean View tại Danang Beach Resort đã được xác nhận",
      time: "10 phút trước",
      read: false,
      link: {
        page: "booking-history" as PageType,
      },
    },
    {
      id: "U002",
      type: "promotion",
      title: "Ưu đãi đặc biệt cho bạn!",
      message: "Giảm 20% cho đặt phòng khách sạn 5 sao tại Nha Trang. Áp dụng đến 31/01",
      time: "1 giờ trước",
      read: false,
      link: {
        page: "promotions" as PageType,
      },
    },
    {
      id: "U003",
      type: "system",
      title: "Nhắc nhở check-in",
      message: "Bạn có lịch check-in tại Danang Beach Resort vào ngày mai lúc 14:00",
      time: "2 giờ trước",
      read: true,
      link: {
        page: "booking-history" as PageType,
      },
    },
  ];
}
