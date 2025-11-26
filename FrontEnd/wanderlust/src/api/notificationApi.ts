import { authenticatedFetch } from "../utils/api";

export interface NotificationDTO {
  id: string;
  userId: string;
  type: "BOOKING" | "REVIEW" | "PAYMENT" | "SYSTEM" | "PROMOTION";
  title: string;
  message: string;
  read: boolean;
  relatedEntityType?: string;
  relatedEntityId?: string;
  createdAt: string;
  readAt?: string;
}

export const notificationApi = {
  // GET /api/notifications - Get my notifications
  getMyNotifications: async (): Promise<NotificationDTO[]> => {
    const response = await authenticatedFetch("/api/notifications");
    
    if (!response.ok) {
      throw new Error("Không thể tải thông báo");
    }
    
    return response.json();
  },

  // GET /api/notifications/unread-count - Get unread count
  getUnreadCount: async (): Promise<number> => {
    const response = await authenticatedFetch("/api/notifications/unread-count");
    
    if (!response.ok) {
      throw new Error("Không thể đếm thông báo chưa đọc");
    }
    
    return response.json();
  },

  // PUT /api/notifications/{id}/read - Mark as read
  markAsRead: async (id: string): Promise<void> => {
    const response = await authenticatedFetch(`/api/notifications/${id}/read`, {
      method: "PUT",
    });
    
    if (!response.ok) {
      throw new Error("Không thể đánh dấu đã đọc");
    }
  },

  // DELETE /api/notifications/{id} - Delete notification
  deleteNotification: async (id: string): Promise<void> => {
    const response = await authenticatedFetch(`/api/notifications/${id}`, {
      method: "DELETE",
    });
    
    if (!response.ok) {
      throw new Error("Không thể xóa thông báo");
    }
  },
};
