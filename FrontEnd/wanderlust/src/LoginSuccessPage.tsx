import { useEffect } from 'react';
import { tokenService } from './utils/api';
import { PageType } from './MainApp'; // Import PageType

interface LoginSuccessPageProps {
  onLogin: (role: "user" | "admin" | "vendor") => void; // Fix type
  onNavigate: (page: PageType, data?: any) => void; // Use PageType
}

export const LoginSuccessPage = ({ onLogin, onNavigate }: LoginSuccessPageProps) => {
  useEffect(() => {
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
      // Lưu token vào localStorage
      tokenService.setToken(token);
      
      // Parse username để lấy firstName
      const names = decodeURIComponent(username).split(' ');
      const firstName = names[0] || 'User';
      const lastName = names.slice(1).join(' ') || '';
      
      // Lưu user data
      tokenService.setUserData({
        firstName,
        lastName,
        email: '', // OAuth không trả về email trong URL
        avatar: avatar ? decodeURIComponent(avatar) : undefined,
        role: 'user'
      });

      // Callback onLogin
      onLogin('user');
      
      // Clear URL params and redirect về home
      window.history.replaceState({}, '', '/');
      onNavigate('home');
    } else {
      console.log("❌ Missing token or username");
      alert('Đăng nhập thất bại: Thiếu thông tin');
      onNavigate('login');
    }
  }, [onLogin, onNavigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-700">
      <div className="text-center text-white">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white mx-auto mb-4"></div>
        <p className="text-xl">Đang đăng nhập...</p>
      </div>
    </div>
  );
};
