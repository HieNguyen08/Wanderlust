# Hướng Dẫn Deploy Dự Án Wanderlust

## Vấn đề với `figma:asset`

Các file import `figma:asset/...` chỉ hoạt động trong môi trường Figma Make. Khi tải dự án về máy hoặc deploy lên hosting, các asset này sẽ không load được.

## Giải Pháp

Có 3 cách để giải quyết:

### **Giải Pháp 1: Tải Assets Từ Figma (Khuyến nghị cho design chính xác)**

1. **Mở file Figma của bạn**
2. **Chọn từng image/icon trong design**
3. **Export assets:**
   - Click chuột phải → Export
   - Chọn format (PNG cho photos, SVG cho icons)
   - Save vào folder `/public/assets/`

4. **Cấu trúc thư mục đề xuất:**
```
/public/
  /assets/
    /icons/          # Các icon nhỏ
    /images/         # Hình ảnh lớn
    /destinations/   # Hình các địa điểm
    /flights/        # Hình chuyến bay
```

5. **Thay thế trong code:**
```tsx
// Trước:
import imgPlane from "figma:asset/xxx.png";

// Sau:
const imgPlane = "/assets/icons/plane.png";
// hoặc
<img src="/assets/icons/plane.png" alt="plane" />
```

### **Giải Pháp 2: Sử dụng Lucide React Icons (Nhanh nhất)**

Thay thế các icon bằng Lucide React:

```tsx
import { 
  Plane, 
  Calendar, 
  User, 
  Search,
  ArrowRightLeft,
  // ... các icon khác
} from "lucide-react";

// Sử dụng:
<Plane className="w-5 h-5" />
<Calendar className="w-5 h-5" />
```

**Icon mapping:**
- `imgAirplaneTakeOff` → `<PlaneTakeoff />`
- `imgAirplaneLanding` → `<PlaneLanding />`
- `imgCalendar` → `<Calendar />`
- `imgUser` → `<User />`
- `imgSearch` → `<Search />`
- `imgDataTransfer` → `<ArrowRightLeft />`
- `imgPlane` → `<Plane />`
- `imgExpandArrow` → `<ChevronDown />`
- `imgPlus` → `<Plus />`

### **Giải Pháp 3: Sử dụng Unsplash cho Photos**

Cho các hình ảnh destination/travel:

```tsx
// Trong component, sử dụng ImageWithFallback
import { ImageWithFallback } from './components/figma/ImageWithFallback';

<ImageWithFallback 
  src="https://images.unsplash.com/photo-xxxxx" 
  alt="destination"
  className="w-full h-full object-cover"
/>
```

**Unsplash URLs mẫu:**
- Paris: `https://images.unsplash.com/photo-1502602898657-3e91760cbb34`
- Tokyo: `https://images.unsplash.com/photo-1540959733332-eab4deabeeaf`
- Bali: `https://images.unsplash.com/photo-1537996194471-e657df975ab4`
- NYC: `https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9`

## Cách Deploy

### Deploy lên Vercel (Khuyến nghị)

1. **Push code lên GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin your-repo-url
git push -u origin main
```

2. **Deploy trên Vercel:**
   - Đăng nhập vào vercel.com
   - Click "Import Project"
   - Chọn repository
   - Vercel sẽ tự động detect Vite/React
   - Click Deploy

3. **Cấu hình (nếu cần):**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

### Deploy lên Netlify

1. **Push code lên GitHub**
2. **Deploy trên Netlify:**
   - Đăng nhập netlify.com
   - Click "Add new site" → "Import an existing project"
   - Chọn repository
   - Build settings:
     - Build command: `npm run build`
     - Publish directory: `dist`

## Script Hữu Ích

### Tìm tất cả figma:asset trong project:
```bash
grep -r "figma:asset" --include="*.tsx" --include="*.ts"
```

### Đếm số lượng figma:asset:
```bash
grep -r "figma:asset" --include="*.tsx" --include="*.ts" | wc -l
```

## Khuyến Nghị

Để dự án chạy tốt nhất khi deploy:

1. **Icons nhỏ** → Dùng Lucide React (đã có sẵn, không cần tải thêm)
2. **Photos lớn** → Dùng Unsplash hoặc tải từ Figma
3. **SVG paths** → Giữ nguyên (đã OK trong `/imports/*.ts`)
4. **Logo, branding** → Tải từ Figma để đảm bảo chính xác

## Lưu Ý Quan Trọng

- ⚠️ KHÔNG commit figma:asset vào production code
- ✅ Test local trước khi deploy: `npm run build && npm run preview`
- ✅ Kiểm tra console errors về missing images
- ✅ Optimize images trước khi deploy (dùng TinyPNG, ImageOptim...)

## Hỗ Trợ

Nếu gặp lỗi khi deploy, check:
1. Console browser có lỗi 404 images không?
2. Build có success không? (`npm run build`)
3. Tất cả dependencies đã install? (`npm install`)
