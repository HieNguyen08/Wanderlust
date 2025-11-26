import { authenticatedFetch } from "../utils/api";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "user" | "admin" | "vendor";
  status: "active" | "banned" | "suspended";
  joinDate: string;
  lastLogin: string;
  bookings: number;
  totalSpent: number;
}

export const adminUserApi = {
  getAllUsers: async (): Promise<AdminUser[]> => {
    const response = await authenticatedFetch("/api/users");
    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }
    const data = await response.json();
    
    return data.map((user: any) => ({
      id: user.userId,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      phone: user.mobile || "",
      role: user.role === "PARTNER" ? "vendor" : user.role ? user.role.toLowerCase() : "user",
      status: user.isBlocked ? "banned" : "active", // Simple mapping for now
      joinDate: user.createdAt ? new Date(user.createdAt).toISOString().split('T')[0] : "",
      lastLogin: user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : "Never",
      bookings: user.totalTrips || 0,
      totalSpent: 0, // Not available in User entity yet
    }));
  },

  createUser: async (userData: any) => {
    // Split name into first and last name
    const nameParts = userData.name.split(" ");
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ");

    const payload = {
      firstName,
      lastName,
      email: userData.email,
      mobile: userData.phone,
      password: userData.password,
      role: userData.role === "vendor" ? "PARTNER" : userData.role.toUpperCase(),
      isBlocked: userData.status === "banned",
    };

    const response = await authenticatedFetch("/api/users", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || "Failed to create user");
    }
    return response.json();
  },

  updateUser: async (id: string, userData: any) => {
    // Split name into first and last name if provided
    let namePayload = {};
    if (userData.name) {
        const nameParts = userData.name.split(" ");
        namePayload = {
            firstName: nameParts[0],
            lastName: nameParts.slice(1).join(" ")
        };
    }

    const payload = {
      userId: id,
      ...namePayload,
      email: userData.email,
      mobile: userData.phone,
      role: userData.role ? (userData.role === "vendor" ? "PARTNER" : userData.role.toUpperCase()) : undefined,
      isBlocked: userData.status === "banned",
    };

    const response = await authenticatedFetch(`/api/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || "Failed to update user");
    }
    return response.json();
  },

  deleteUser: async (id: string) => {
    const response = await authenticatedFetch(`/api/users/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || "Failed to delete user");
    }
    return response.text(); // Returns string message
  },
  
  // Helper to ban user (update status)
  banUser: async (id: string) => {
      // First get the user to preserve other fields? 
      // Or just send partial update if backend supports it. 
      // The backend updateUser expects a User object.
      // Let's assume we need to fetch first or just send what we have if the UI passes the full user.
      // For now, let's implement this in the UI by calling updateUser with isBlocked=true
      return adminUserApi.updateUser(id, { status: "banned" });
  }
};
