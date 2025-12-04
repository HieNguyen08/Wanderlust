import React, { createContext, useContext, useEffect, useState } from 'react';
import { tokenService } from '../utils/api';

export interface Notification {
    id: string;
    type: 'booking' | 'voucher' | 'wallet' | 'system';
    title: string;
    message: string;
    date: string;
    read: boolean;
    link?: string;
    data?: any;
}

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    addNotification: (notification: Omit<Notification, 'id' | 'date' | 'read'>) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    checkNewBookings: (latestBookingDate: string) => void;
    checkNewVouchers: (latestVoucherDate: string) => void;
    checkNewTransactions: (latestTransactionDate: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);

    // Load notifications from localStorage on mount
    useEffect(() => {
        const savedNotifications = localStorage.getItem('user_notifications');
        if (savedNotifications) {
            try {
                const parsed = JSON.parse(savedNotifications);
                setNotifications(parsed);
                setUnreadCount(parsed.filter((n: Notification) => !n.read).length);
            } catch (e) {
                console.error('Failed to parse notifications', e);
            }
        }
    }, []);

    // Save notifications to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('user_notifications', JSON.stringify(notifications));
        setUnreadCount(notifications.filter(n => !n.read).length);
    }, [notifications]);

    const addNotification = (notification: Omit<Notification, 'id' | 'date' | 'read'>) => {
        const newNotification: Notification = {
            ...notification,
            id: Date.now().toString(),
            date: new Date().toISOString(),
            read: false,
        };
        setNotifications(prev => [newNotification, ...prev]);
    };

    const markAsRead = (id: string) => {
        setNotifications(prev =>
            prev.map(n => (n.id === id ? { ...n, read: true } : n))
        );
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const checkNewBookings = (latestBookingDate: string) => {
        const lastCheck = localStorage.getItem('last_booking_check');
        if (lastCheck && new Date(latestBookingDate) > new Date(lastCheck)) {
            // Logic to add notification is handled by the caller or we can just update the timestamp here
            // Ideally the caller knows IF there is a new booking. 
            // But here we just provide a helper. 
            // Actually, the caller should call addNotification if it detects new data.
            // This function might just be to update the timestamp.
        }
        localStorage.setItem('last_booking_check', new Date().toISOString());
    };

    const checkNewVouchers = (latestVoucherDate: string) => {
        localStorage.setItem('last_voucher_check', new Date().toISOString());
    };

    const checkNewTransactions = (latestTransactionDate: string) => {
        localStorage.setItem('last_transaction_check', new Date().toISOString());
    };

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                unreadCount,
                addNotification,
                markAsRead,
                markAllAsRead,
                checkNewBookings,
                checkNewVouchers,
                checkNewTransactions,
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
};
