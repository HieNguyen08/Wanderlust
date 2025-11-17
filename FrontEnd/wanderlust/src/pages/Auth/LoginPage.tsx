import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Calendar as CalendarIcon, Facebook, Mail, Plane } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { Button } from "../../components/ui/button";
import { Calendar } from "../../components/ui/calendar";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { PageType } from "../../MainApp"; // Import PageType
import { authApi, tokenService } from "../../utils/api";

interface LoginPageProps {
  onNavigate: (page: PageType, data?: any) => void; // Use PageType
  onLogin?: (role: "user" | "admin" | "vendor") => void;
}

export function LoginPage({ onNavigate, onLogin }: LoginPageProps) {
  const { t } = useTranslation();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  console.log("🎨 LoginPage rendered - isSignUp:", isSignUp, "email:", email, "password:", password ? "***" : "empty");
  
  useEffect(() => {
    console.log("🔧 LoginPage MOUNTED");
    return () => console.log("💀 LoginPage UNMOUNTED");
  }, []);

  // Sign Up additional fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [mobile, setMobile] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState<Date>();
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");

  const handleGoogleLogin = () => {
    console.log("🔐 Redirecting to Google OAuth...");
    console.log("📍 Current URL before redirect:", window.location.href);
    // Redirect đến backend OAuth2 endpoint
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  };

  const handleFacebookLogin = () => {
    // Redirect đến backend OAuth2 endpoint
    window.location.href = 'http://localhost:8080/oauth2/authorization/facebook';
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    console.log("🔐 handleSignIn called with:", { email, password: "***" });
    
    setLoading(true);
    try {
      console.log("📡 Calling authApi.login...");
      const response = await authApi.login(email, password);
      console.log("✅ Login response:", response);
      
      // Lưu token và thông tin user
      tokenService.setToken(response.token);
      tokenService.setUserData({
        firstName: response.firstName,
        lastName: response.lastName,
        email: response.email,
        avatar: response.avatar,
        role: response.role,
        gender: response.gender
      });
      
      console.log("💾 Saved to localStorage:", {
        token: response.token.substring(0, 20) + "...",
        userData: tokenService.getUserData()
      });
      
      if (onLogin) onLogin(response.role || "user");
      onNavigate("home");
    } catch (error: any) {
      console.error("❌ Login error:", error);
      alert(error.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại email và mật khẩu.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Manual validation for Select fields
    if (!gender) {
      alert(t('auth.pleaseSelectGender') || 'Vui lòng chọn giới tính');
      return;
    }
    if (!country) {
      alert(t('auth.pleaseSelectCountry') || 'Vui lòng chọn quốc gia');
      return;
    }
    if (!dateOfBirth) {
      alert(t('auth.pleaseSelectDOB') || 'Vui lòng chọn ngày sinh');
      return;
    }
    
    setLoading(true);
    try {
      const userData = {
        firstName,
        lastName,
        email,
        password,
        mobile,
        gender: gender || undefined,
        dateOfBirth: dateOfBirth?.toISOString(),
        address,
        city,
        country
      };
      
      // Register endpoint giờ trả về AuthResponseDTO với token luôn
      const response = await authApi.register(userData);
      
      // Lưu token và user data
      tokenService.setToken(response.token);
      tokenService.setUserData({
        firstName: response.firstName,
        lastName: response.lastName,
        email: response.email,
        avatar: response.avatar,
        role: response.role,
        gender: response.gender
      });
      
      if (onLogin) onLogin(response.role || "user");
      onNavigate("home");
    } catch (error: any) {
      alert(error.message || "Đăng ký thất bại. Email có thể đã tồn tại.");
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchToSignUp = () => {
    setIsSignUp(true);
    setEmail("");
    setPassword("");
    setFirstName("");
    setLastName("");
    setGender("");
    setMobile("");
    setDateOfBirth(undefined);
    setAddress("");
    setCity("");
    setCountry("");
  };

  const handleSwitchToSignIn = () => {
    setIsSignUp(false);
    setEmail("");
    setPassword("");
  };

  const handleMockLogin = (role: "user" | "admin" | "vendor") => {
    if (onLogin) onLogin(role);
    onNavigate("home");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-100 to-slate-200 p-4 relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1551727095-10465ee6b17f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cm9waWNhbCUyMGJlYWNoJTIwcGFyYWRpc2V8ZW58MXx8fHwxNzYyMzU0NzI1fDA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Travel Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-br from-blue-900/50 via-purple-900/40 to-pink-900/50 backdrop-blur-sm" />
      </div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-6xl">
        <div className="relative w-full min-h-[650px] bg-white rounded-3xl shadow-2xl overflow-hidden">
          
          {/* Sliding Panel */}
          <div className={`absolute top-0 left-0 w-full md:w-1/2 h-full bg-linear-to-br from-blue-600 via-blue-700 to-purple-700 transition-all duration-1000 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] z-10 ${
            isSignUp ? 'md:translate-x-full md:rounded-l-3xl' : 'md:translate-x-0 md:rounded-r-3xl'
          } hidden md:block`}>
            <div className="flex flex-col items-center justify-center h-full text-white p-12">
              {!isSignUp ? (
                <div className="text-center animate-enter">
                  <div className="w-20 h-20 mx-auto bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-6">
                    <Plane className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-white mb-4">{t('auth.welcomeBack')}</h2>
                  <p className="text-white/90 leading-relaxed mb-8 max-w-sm mx-auto">
                    {t('auth.welcomeBackDesc')}
                  </p>
                  <Button
                    variant="outline"
                    className="border-2 border-white text-white hover:bg-white hover:text-blue-600 bg-transparent px-8 py-3 rounded-full transition-all duration-300"
                    onClick={handleSwitchToSignUp}
                  >
                    {t('auth.signUp').toUpperCase()}
                  </Button>
                </div>
              ) : (
                <div className="text-center animate-enter">
                  <div className="w-20 h-20 mx-auto bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-6">
                    <Plane className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-white mb-4">{t('auth.hello')}</h2>
                  <p className="text-white/90 leading-relaxed mb-8 max-w-sm mx-auto">
                    {t('auth.helloDesc')}
                  </p>
                  <Button
                    variant="outline"
                    className="border-2 border-white text-white hover:bg-white hover:text-blue-600 bg-transparent px-8 py-3 rounded-full transition-all duration-300"
                    onClick={handleSwitchToSignIn}
                  >
                    {t('auth.signIn').toUpperCase()}
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Sign In Form */}
          <div className={`absolute top-0 w-full md:w-1/2 h-full transition-all duration-1000 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
            isSignUp ? 'md:translate-x-0 md:opacity-0 md:pointer-events-none' : 'md:translate-x-full md:opacity-100'
          } ${isSignUp ? 'hidden' : 'block'}`}>
            <div className="flex items-center justify-center h-full">
              <div className="w-full max-w-sm px-8 md:px-12">
                <div className="animate-enter">
                  {/* Logo */}
                  <div className="flex items-center justify-center gap-2 mb-8 md:hidden">
                    <Plane className="w-8 h-8 text-blue-600" />
                    <h2 className="font-['Kadwa',serif] text-gray-900">Wanderlust</h2>
                  </div>

                  <h3 className="text-gray-900 text-center mb-8">{t('auth.createAccount')}</h3>

                  {/* Social Login Buttons */}
                  <div className="space-y-3 mb-6">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full h-12 border-2 hover:bg-red-50 hover:border-red-300 transition-all group"
                      onClick={handleGoogleLogin}
                    >
                      <Mail className="w-5 h-5 text-red-500 mr-3 group-hover:scale-110 transition-transform" />
                      <span className="text-gray-700">{t('auth.signInWithGoogle')}</span>
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full h-12 border-2 hover:bg-blue-50 hover:border-blue-300 transition-all group"
                      onClick={handleFacebookLogin}
                    >
                      <Facebook className="w-5 h-5 text-blue-600 mr-3 group-hover:scale-110 transition-transform" />
                      <span className="text-gray-700">{t('auth.signInWithFacebook')}</span>
                    </Button>
                  </div>

                  {/* Divider */}
                  <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center">
                      <span className="px-4 bg-white text-gray-500">{t('auth.or')}</span>
                    </div>
                  </div>

                  {/* Email Login Form */}
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div>
                      <Input
                        type="email"
                        placeholder={t('auth.emailPlaceholder')}
                        value={email}
                        onChange={(e) => {
                          console.log("📧 Email changed:", e.target.value);
                          setEmail(e.target.value);
                        }}
                        required
                        className="w-full px-4 py-3 bg-slate-100 border-0 rounded-lg focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                    <div>
                      <Input
                        type="password"
                        placeholder={t('auth.passwordPlaceholder')}
                        value={password}
                        onChange={(e) => {
                          console.log("🔒 Password changed:", e.target.value ? "***" : "empty");
                          setPassword(e.target.value);
                        }}
                        required
                        className="w-full px-4 py-3 bg-slate-100 border-0 rounded-lg focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                    <div className="text-center">
                      <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                        {t('auth.forgotPassword')}
                      </a>
                    </div>
                    <button
                      type="submit"
                      className="w-full py-3 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={loading || !email || !password}
                    >
                      {loading ? t('auth.signingIn') : t('auth.signIn')}
                    </button>
                  </form>

                  {/* Mobile Toggle */}
                  <p className="text-center text-gray-600 mt-6 md:hidden">
                    {t('auth.dontHaveAccount')}{" "}
                    <button
                      onClick={handleSwitchToSignUp}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      {t('auth.registerNow')}
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sign Up Form */}
          <div className={`absolute top-0 w-full md:w-1/2 h-full transition-all duration-1000 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] overflow-y-auto ${
            !isSignUp ? 'md:-translate-x-full md:opacity-0 md:pointer-events-none' : 'md:translate-x-0 md:opacity-100'
          } ${!isSignUp ? 'hidden' : 'block'}`}>
            <div className="flex items-start md:items-center justify-center min-h-full py-8">
              <div className="w-full max-w-md px-6 md:px-8">
                <div className="animate-enter">
                  {/* Logo */}
                  <div className="flex items-center justify-center gap-2 mb-6 md:hidden">
                    <Plane className="w-8 h-8 text-blue-600" />
                    <h2 className="font-['Kadwa',serif] text-gray-900">Wanderlust</h2>
                  </div>

                  <h3 className="text-gray-900 text-center mb-6">{t('auth.signUpTitle')}</h3>

                  {/* Registration Form */}
                  <form onSubmit={handleSignUp} className="space-y-4">
                    {/* Name Fields */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="firstName" className="text-gray-700 text-sm">{t('auth.firstNameLabel')} {t('auth.required')}</Label>
                        <Input
                          id="firstName"
                          type="text"
                          placeholder={t('auth.firstNamePlaceholder')}
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          required
                          className="mt-1 px-3 py-2 bg-slate-100 border-0 rounded-lg focus:ring-2 focus:ring-blue-600"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName" className="text-gray-700 text-sm">{t('auth.lastNameLabel')} {t('auth.required')}</Label>
                        <Input
                          id="lastName"
                          type="text"
                          placeholder={t('auth.lastNamePlaceholder')}
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          required
                          className="mt-1 px-3 py-2 bg-slate-100 border-0 rounded-lg focus:ring-2 focus:ring-blue-600"
                        />
                      </div>
                    </div>

                    {/* Gender */}
                    <div>
                      <Label htmlFor="gender" className="text-gray-700 text-sm">{t('auth.gender')} {t('auth.required')}</Label>
                      <Select value={gender} onValueChange={(value) => {
                        console.log('🎯 Gender selected:', value);
                        setGender(value);
                      }}>
                        <SelectTrigger className="mt-1 bg-slate-100 border-0 rounded-lg focus:ring-2 focus:ring-blue-600">
                          <SelectValue placeholder={t('auth.selectGender')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MALE">{t('auth.male')}</SelectItem>
                          <SelectItem value="FEMALE">{t('auth.female')}</SelectItem>
                          <SelectItem value="OTHER">{t('auth.other')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Date of Birth */}
                    <div>
                      <Label htmlFor="dob" className="text-gray-700 text-sm">{t('auth.dateOfBirth')} {t('auth.required')}</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full mt-1 justify-start text-left bg-slate-100 border-0 hover:bg-slate-200"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dateOfBirth ? format(dateOfBirth, "dd/MM/yyyy", { locale: vi }) : <span className="text-gray-500">{t('auth.selectDateOfBirth')}</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={dateOfBirth}
                            onSelect={setDateOfBirth}
                            disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    {/* Email */}
                    <div>
                      <Label htmlFor="email" className="text-gray-700 text-sm">{t('auth.email')} {t('auth.required')}</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder={t('auth.emailExample')}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="mt-1 px-3 py-2 bg-slate-100 border-0 rounded-lg focus:ring-2 focus:ring-blue-600"
                      />
                    </div>

                    {/* Mobile */}
                    <div>
                      <Label htmlFor="mobile" className="text-gray-700 text-sm">{t('auth.mobile')} {t('auth.required')}</Label>
                      <Input
                        id="mobile"
                        type="tel"
                        placeholder={t('auth.mobilePlaceholder')}
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        required
                        pattern="[0-9]{10,11}"
                        className="mt-1 px-3 py-2 bg-slate-100 border-0 rounded-lg focus:ring-2 focus:ring-blue-600"
                      />
                    </div>

                    {/* Password */}
                    <div>
                      <Label htmlFor="password" className="text-gray-700 text-sm">{t('auth.password')} {t('auth.required')}</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder={t('auth.passwordMinLength')}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                        className="mt-1 px-3 py-2 bg-slate-100 border-0 rounded-lg focus:ring-2 focus:ring-blue-600"
                      />
                    </div>

                    {/* Address */}
                    <div>
                      <Label htmlFor="address" className="text-gray-700 text-sm">{t('auth.address')} {t('auth.required')}</Label>
                      <Input
                        id="address"
                        type="text"
                        placeholder={t('auth.addressPlaceholder')}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                        className="mt-1 px-3 py-2 bg-slate-100 border-0 rounded-lg focus:ring-2 focus:ring-blue-600"
                      />
                    </div>

                    {/* City & Country */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="city" className="text-gray-700 text-sm">{t('auth.city')} {t('auth.required')}</Label>
                        <Input
                          id="city"
                          type="text"
                          placeholder={t('auth.cityPlaceholder')}
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          required
                          className="mt-1 px-3 py-2 bg-slate-100 border-0 rounded-lg focus:ring-2 focus:ring-blue-600"
                        />
                      </div>
                      <div>
                        <Label htmlFor="country" className="text-gray-700 text-sm">{t('auth.country')} {t('auth.required')}</Label>
                        <Select value={country} onValueChange={(value) => {
                          console.log('🌍 Country selected:', value);
                          setCountry(value);
                        }}>
                          <SelectTrigger className="mt-1 bg-slate-100 border-0 rounded-lg focus:ring-2 focus:ring-blue-600">
                            <SelectValue placeholder={t('auth.selectCountry')} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="VN">Việt Nam</SelectItem>
                            <SelectItem value="US">Hoa Kỳ</SelectItem>
                            <SelectItem value="JP">Nhật Bản</SelectItem>
                            <SelectItem value="KR">Hàn Quốc</SelectItem>
                            <SelectItem value="SG">Singapore</SelectItem>
                            <SelectItem value="TH">Thái Lan</SelectItem>
                            <SelectItem value="MY">Malaysia</SelectItem>
                            <SelectItem value="CN">Trung Quốc</SelectItem>
                            <SelectItem value="OTHER">Khác</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full py-3 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/30 mt-6"
                      disabled={loading}
                    >
                      {loading ? t('auth.creatingAccount') : t('auth.signUp')}
                    </Button>
                  </form>

                  {/* Mobile Toggle */}
                  <p className="text-center text-gray-600 mt-6 md:hidden">
                    {t('auth.alreadyHaveAccount')}{" "}
                    <button
                      onClick={handleSwitchToSignIn}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      {t('auth.loginNow')}
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Home Link */}
        <div className="text-center mt-6">
          <button
            onClick={() => onNavigate("home")}
            className="text-white hover:text-blue-200 transition-colors inline-flex items-center gap-2 backdrop-blur-sm bg-black/20 px-6 py-3 rounded-full"
          >
            ← {t('auth.backToHome')}
          </button>
        </div>

        {/* Mock Login Buttons for Testing */}
        <div className="text-center mt-4">
          <p className="text-white/80 mb-3">{t('auth.demoLogin')}</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Button
              onClick={() => handleMockLogin("user")}
              variant="outline"
              className="bg-white/90 hover:bg-white border-none text-blue-600 px-5 h-10"
            >
              👤 User
            </Button>
            <Button
              onClick={() => handleMockLogin("admin")}
              className="bg-purple-600 hover:bg-purple-700 text-white px-5 h-10"
            >
              🛡️ Admin
            </Button>
            <Button
              onClick={() => handleMockLogin("vendor")}
              className="bg-green-600 hover:bg-green-700 text-white px-5 h-10"
            >
              🏪 Vendor
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
