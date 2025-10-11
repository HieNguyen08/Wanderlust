# Wanderlust - Travel Booking Website

Website đặt vé máy bay và khách sạn được xây dựng với React, TypeScript và Tailwind CSS.

## 🚀 Tính Năng

- ✈️ Tìm kiếm và đặt vé máy bay
- 🏨 Tìm kiếm và đặt phòng khách sạn  
- 🔍 Bộ lọc và sắp xếp kết quả tìm kiếm
- 📝 Form nhập thông tin đặt chỗ
- ✅ Xác nhận đặt vé
- 🎁 Trang ưu đãi và khuyến mãi
- 📱 Responsive design

## 📁 Cấu Trúc Project

```
/
├── HomePage.tsx              # Trang chủ (Khách sạn)
├── FlightsPage.tsx          # Trang vé máy bay
├── SearchPage.tsx           # Trang kết quả tìm kiếm
├── BookingDetailsPage.tsx   # Trang nhập thông tin đặt chỗ
├── ConfirmationPage.tsx     # Trang xác nhận đặt vé
├── OffersPage.tsx           # Trang ưu đãi
├── MainApp.tsx              # App chính với routing
├── App.tsx                  # Entry point
│
├── components/
│   ├── ui/                  # Shadcn UI components
│   └── figma/               # Figma helper components
│
├── imports/                 # Figma imported files & SVG paths
└── styles/
    └── globals.css          # Global styles & Tailwind config
```

## 🛠️ Tech Stack

- **Framework:** React 18 + TypeScript
- **Styling:** Tailwind CSS v4.0
- **UI Components:** Shadcn/ui
- **Icons:** Lucide React
- **Build Tool:** Vite
- **Routing:** Client-side state management

## 📦 Installation

### ✅ All Fixes Complete! 
- ✅ **Import fix:** All 41 UI components - No version numbers (See: `IMPORT_FIX_SUMMARY.md`)
- ✅ **CSS fix:** Tailwind imports added (See: `LATEST_FIXES.md`)
- ✅ **Layout fix:** HomePage fully responsive (See: `FIX_LAYOUT_ISSUE.md`)

### Quick Start (3 bước)

```bash
# 1. Cài đặt tất cả dependencies
npm install

# 2. Chạy development server
npm run dev

# 3. Mở trình duyệt tại http://localhost:5173
```

### ⚠️ Had Layout Issues?
If your layout was broken before, **it's now FIXED!**

Run this to verify:
```bash
.\verify-css-imports.ps1  # Windows
bash verify-css-imports.sh  # Mac/Linux
```

See: `FIX_LAYOUT_ISSUE.md` or `LATEST_FIXES.md`

### Các lệnh khác

```bash
npm run build        # Build cho production
npm run preview      # Preview production build
npm run typecheck    # Check TypeScript errors
npm run lint         # Check ESLint errors
```

### Xem hướng dẫn chi tiết
- 📖 **Quick Start**: `QUICK_START.md`
- 📖 **Installation Guide**: `INSTALLATION.md`
- 📖 **Deployment Guide**: `DEPLOYMENT_GUIDE.md`

## ⚠️ Quan Trọng: Figma Assets

**Các file hiện tại sử dụng `figma:asset/...` CHỈ hoạt động trên Figma Make!**

Khi deploy ra production, bạn CẦN làm một trong các việc sau:

### Lựa Chọn 1: Dùng Lucide Icons (Khuyến nghị - Nhanh nhất)

File mẫu: `/SearchPage_Portable.tsx`

Thay thế tất cả icon images bằng Lucide React icons:

```tsx
// Trước:
import imgSearch from "figma:asset/xxx.png";
<img src={imgSearch} alt="search" className="w-4 h-4" />

// Sau:
import { Search } from "lucide-react";
<Search className="w-4 h-4" />
```

Xem chi tiết: `ICON_MAPPING.md`

### Lựa Chọn 2: Tải Assets Từ Figma

1. Mở file Figma
2. Export từng image/icon
3. Lưu vào `/public/assets/`
4. Update import paths:

```tsx
// Trước:
import imgPlane from "figma:asset/xxx.png";

// Sau:
const imgPlane = "/assets/icons/plane.png";
```

### Lựa Chọn 3: Dùng Unsplash (Cho photos)

```tsx
// Thay vì figma:asset, dùng Unsplash URLs:
<img 
  src="https://images.unsplash.com/photo-xxxxx" 
  alt="destination"
  className="w-full h-full object-cover"
/>
```

Xem chi tiết: `DEPLOYMENT_GUIDE.md`

## 🌐 Navigation Flow

```
HomePage (Khách sạn)
  ↓
FlightsPage (Vé máy bay)
  ↓ [Search]
SearchPage (Kết quả tìm kiếm)
  ↓ [Book Now / Chi tiết hành trình]
BookingDetailsPage (Nhập thông tin)
  ↓ [Proceed to Payment]
ConfirmationPage (Xác nhận đặt chỗ)
  ↓ [Khám phá thêm ưu đãi]
OffersPage (Các ưu đãi)
```

## 📚 Documentation Files

- `DEPLOYMENT_GUIDE.md` - Hướng dẫn deploy chi tiết
- `ICON_MAPPING.md` - Mapping icons từ Figma sang Lucide
- `SearchPage_Portable.tsx` - Example file đã convert sang portable

## 🎨 Design System

### Colors
- Primary: `#0194f3` (Blue)
- Secondary: `#5d36af` (Purple)
- Success: `#10b981` (Green)
- Warning: `#f59e0b` (Orange)
- Danger: `#ef4444` (Red)
- Background: `#f3f3f3` (Light gray)
- Dark: `#153a43` (Dark teal)

### Typography
Configured in `styles/globals.css` - **KHÔNG dùng Tailwind font classes!**

## 🚢 Deploy

### Vercel (Khuyến nghị)
```bash
git init
git add .
git commit -m "Initial commit"
git push

# Hoặc deploy trực tiếp:
vercel
```

### Netlify
```bash
npm run build

# Upload folder `dist` lên Netlify
```

## ⚡ Performance Tips

1. **Optimize images:**
   - Dùng WebP format
   - Compress với TinyPNG
   - Lazy load với `loading="lazy"`

2. **Code splitting:**
   - Vite tự động code split
   - Lazy load routes nếu cần

3. **Caching:**
   - Vercel/Netlify tự động cache static assets

## 🐛 Common Issues

### Issue: Images không load sau khi deploy
**Solution:** Thay `figma:asset` bằng Lucide icons hoặc Unsplash URLs

### Issue: Build failed
**Solution:** 
```bash
rm -rf node_modules
npm install
npm run build
```

### Issue: Types error
**Solution:** 
```bash
npm run typecheck
# Fix errors theo output
```

## 📝 TODO

- [ ] Convert tất cả figma:asset sang Lucide icons
- [ ] Thêm real API integration (Supabase?)
- [ ] Thêm authentication
- [ ] Thêm payment gateway
- [ ] SEO optimization
- [ ] Analytics tracking
- [ ] Progressive Web App (PWA)
- [ ] Multi-language support
- [ ] Dark mode

## 🤝 Contributing

1. Fork project
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

MIT License - feel free to use for your projects!

## 👨‍💻 Author

Built with ❤️ using Figma Make

## 🔗 Links

- [Figma Design](https://figma.com/...) 
- [Live Demo](https://wanderlust-demo.vercel.app)
- [Documentation](./DEPLOYMENT_GUIDE.md)

---

**⚠️ Nhớ đọc `DEPLOYMENT_GUIDE.md` trước khi deploy!**
