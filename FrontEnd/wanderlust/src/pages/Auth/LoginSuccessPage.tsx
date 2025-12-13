import { useEffect, useRef, useState } from 'react';
import { PageType } from '../../MainApp';
import { authApi, profileApi, tokenService } from '../../utils/api';
import { mapBackendRoleToFrontend, type FrontendRole } from '../../utils/roleMapper';

interface LoginSuccessPageProps {
  onLogin: (role: FrontendRole) => void;
  onNavigate: (page: PageType, data?: any) => void;
}

export const LoginSuccessPage = ({ onLogin, onNavigate }: LoginSuccessPageProps) => {
  const [status, setStatus] = useState('Đang xác thực...');
  const [isMergeRequired, setIsMergeRequired] = useState(false);
  const [mergeData, setMergeData] = useState<{ email: string; avatar: string; provider: string } | null>(null);
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sử dụng useRef để ngăn chặn useEffect chạy 2 lần (Race Condition)
  const processedRef = useRef(false);

  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
  };

  useEffect(() => {
    const handleOAuthCallback = async () => {
      // Nếu đã xử lý rồi thì dừng lại ngay
      if (processedRef.current) return;
      
      console.log('🔄 LoginSuccessPage useEffect running...');

      const urlParams = new URLSearchParams(window.location.search);
      const error = urlParams.get('error');

      // Xử lý trường hợp Merge Account (nếu Backend vẫn trả về, giữ lại để an toàn)
      if (error === 'merge_required') {
        const email = urlParams.get('email');
        const provider = urlParams.get('provider');

        if (email) {
          console.log('⚠️ Merge required for:', email);
          processedRef.current = true; // Đánh dấu đã xử lý
          
          localStorage.setItem('prefill_login_email', email);
          const query = new URLSearchParams({ email, merge_required: '1', provider: provider || 'oauth' });
          onNavigate('login', { email, merge_required: true, provider: provider || 'oauth' });
          window.history.replaceState({}, '', `/login?${query.toString()}`);
          return;
        }
      }

      // Xử lý lỗi khác
      if (error && error !== 'merge_required') {
        processedRef.current = true;
        alert(`Đăng nhập thất bại: ${error}`);
        onNavigate('login');
        return;
      }

      // --- LOGIC TÌM TOKEN (QUAN TRỌNG) ---
      
      // 1. Tìm trong URL
      let token = urlParams.get('token');

      // 2. Nếu không có, tìm trong Cookie
      if (!token) {
        token = getCookie('accessToken');
      }

      // 3. Nếu vẫn không có, tìm trong LocalStorage (Trường hợp re-render đã lưu rồi)
      if (!token) {
        token = tokenService.getToken();
      }

      if (token) {
        console.log('✅ Valid Token found - processing...');
        processedRef.current = true; // Khóa lại để không chạy lần 2
        await processLoginSuccess(token);
        return;
      }

      // Nếu chưa tìm thấy token, đợi một chút rồi kiểm tra lại lần cuối
      if (!isMergeRequired) {
        setTimeout(() => {
          // Kiểm tra lại cả Cookie và LocalStorage
          const retryToken = getCookie('accessToken') || tokenService.getToken();
          
          if (retryToken) {
            // Nếu tìm thấy ở lần thử lại và chưa xử lý
            if (!processedRef.current) {
                processedRef.current = true;
                processLoginSuccess(retryToken);
            }
          } else {
            console.log('❌ Missing token after timeout');
            setStatus('Không tìm thấy phiên đăng nhập.');
            onNavigate('login');
          }
        }, 500);
      }
    };

    handleOAuthCallback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onLogin, onNavigate, isMergeRequired]);

  const processLoginSuccess = async (token: string) => {
    // Lưu token ngay lập tức
    tokenService.setToken(token);
    setStatus('Đang tải thông tin người dùng...');

    // Dọn dẹp URL và Cookie ngay để bảo mật
    // Lưu ý: Token đã an toàn trong tokenService (LocalStorage)
    document.cookie = 'accessToken=; Max-Age=0; path=/;';
    window.history.replaceState({}, '', '/');

    try {
      const userData = await profileApi.getCurrentUser();
      console.log('📦 Full user data:', userData);

      const mappedRole = mapBackendRoleToFrontend(userData.role);

      tokenService.setUserData({
        id: userData.userId || userData.id, // lưu id để gọi các API theo user
        userId: userData.userId || userData.id,
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
        passportExpiryDate: userData.passportExpiryDate || '',
        membershipLevel: userData.membershipLevel || 'BRONZE',
        loyaltyPoints: userData.loyaltyPoints || 0,
        avatar: userData.avatar || '',
        role: mappedRole
      });

      onLogin(mappedRole);
      onNavigate('home');
    } catch (error) {
      console.error('❌ Error fetching profile:', error);
      alert('Không thể lấy thông tin người dùng.');
      onNavigate('login');
    }
  };

  const handleMergeAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mergeData || !password) return;

    setIsSubmitting(true);
    try {
      const response = await authApi.login(mergeData.email, password);

      if (response?.token) {
        await processLoginSuccess(response.token);
      } else {
        throw new Error('Login response missing token');
      }
    } catch (err: any) {
      alert(err?.message || 'Mật khẩu không đúng hoặc có lỗi xảy ra.');
      setIsSubmitting(false);
    }
  };

  if (isMergeRequired && mergeData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-600 to-purple-700 p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <i className="fas fa-link text-blue-600 text-2xl"></i>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Liên kết tài khoản</h2>
            <p className="text-gray-600 mt-2">
              Email <strong>{mergeData.email}</strong> đã tồn tại. Vui lòng nhập mật khẩu để xác thực và liên kết với {mergeData.provider}.
            </p>
          </div>

          <form onSubmit={handleMergeAccount} className="space-y-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Mật khẩu hiện tại</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                placeholder="Nhập mật khẩu của bạn"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-2 px-4 rounded-md text-white font-bold transition duration-200 ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {isSubmitting ? 'Đang xử lý...' : 'Xác nhận & Đăng nhập'}
            </button>

            <button
              type="button"
              onClick={() => onNavigate('login')}
              className="w-full py-2 px-4 text-gray-500 hover:text-gray-700 text-sm font-medium"
            >
              Hủy bỏ
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-600 to-purple-700">
      <div className="text-center text-white">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white mx-auto mb-4"></div>
        <p className="text-xl">{status}</p>
      </div>
    </div>
  );
};