import { useEffect, useState } from 'react';
import { PageType } from '../../MainApp'; // Import PageType
import { API_BASE_URL, tokenService } from '../../utils/api';

interface LoginSuccessPageProps {
  onLogin: (role: "user" | "admin" | "vendor") => void; // Fix type
  onNavigate: (page: PageType, data?: any) => void; // Use PageType
}

export const LoginSuccessPage = ({ onLogin, onNavigate }: LoginSuccessPageProps) => {
  const [status, setStatus] = useState('Đang xác thực...');

  useEffect(() => {
    const handleOAuthCallback = async () => {
      console.log("🔄 LoginSuccessPage useEffect running...");
      console.log("📍 Current URL:", window.location.href);
      
      // Parse URL query parameters manually
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      const username = urlParams.get('username');
      const avatar = urlParams.get('avatar');
      const error = urlParams.get('error');

      console.log("🔍 URL Params:", { token: token ? token.substring(0, 20) + "..." : null, username, avatar, error });

      if (error) {
        alert(`Đăng nhập thất bại: ${error}`);
        onNavigate('login');
        return;
      }

      if (token && username) {
        console.log("✅ Valid OAuth callback - processing...");
        // Lưu token vào localStorage trước
        tokenService.setToken(token);
        
        setStatus('Đang tải thông tin người dùng...');
        
        try {
          // Gọi API để lấy đầy đủ thông tin user
          const response = await fetch(`${API_BASE_URL}/api/user/profile`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            const userData = await response.json();
            console.log("📦 Full user data from API:", userData);
            
            // Lưu đầy đủ thông tin user vào localStorage
            tokenService.setUserData({
              firstName: userData.firstName || '',
              lastName: userData.lastName || '',
              email: userData.email || '',
              mobile: userData.mobile || '',
              dateOfBirth: userData.dateOfBirth || '',
              gender: userData.gender || '',
              address: userData.address || '',
              city: userData.city || '',
              country: userData.country || '',
              passportNumber: userData.passportNumber || '',
              passportExpiryDate: userData.passportExpiryDate || '', // Use passportExpiryDate from backend
              membershipLevel: userData.membershipLevel || 'BRONZE',
              loyaltyPoints: userData.loyaltyPoints || 0,
              avatar: userData.avatar || (avatar ? decodeURIComponent(avatar) : ''),
              role: userData.role?.toLowerCase() || 'user'
            });
            
            // Callback onLogin
            onLogin(userData.role?.toLowerCase() || 'user');
          } else {
            console.warn("⚠️ Failed to fetch user profile, using URL data");
            // Fallback: nếu API lỗi, vẫn lưu thông tin từ URL
            const names = decodeURIComponent(username).split(' ');
            tokenService.setUserData({
              firstName: names[0] || 'User',
              lastName: names.slice(1).join(' ') || '',
              email: '',
              avatar: avatar ? decodeURIComponent(avatar) : undefined,
              role: 'user'
            });
            onLogin('user');
          }
        } catch (error) {
          console.error("❌ Error fetching user profile:", error);
          // Fallback: sử dụng thông tin từ URL
          const names = decodeURIComponent(username).split(' ');
          tokenService.setUserData({
            firstName: names[0] || 'User',
            lastName: names.slice(1).join(' ') || '',
            email: '',
            avatar: avatar ? decodeURIComponent(avatar) : undefined,
            role: 'user'
          });
          onLogin('user');
        }
        
        // Clear URL params and redirect về home
        window.history.replaceState({}, '', '/');
        onNavigate('home');
      } else {
        console.log("❌ Missing token or username");
        alert('Đăng nhập thất bại: Thiếu thông tin');
        onNavigate('login');
      }
    };

    handleOAuthCallback();
  }, [onLogin, onNavigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-600 to-purple-700">
      <div className="text-center text-white">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white mx-auto mb-4"></div>
        <p className="text-xl">{status}</p>
      </div>
    </div>
  );
};
