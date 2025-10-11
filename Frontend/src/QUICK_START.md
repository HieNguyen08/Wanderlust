# Quick Start - Wanderlust Travel 🚀

## Cài Đặt Siêu Nhanh

### ✅ Import Version Fix
**Tất cả 41 files UI components đã được fix!** Không còn version numbers trong imports.

Xem chi tiết: `IMPORT_FIX_SUMMARY.md`

### ⚠️ Gặp lỗi?
Xem: **`TROUBLESHOOTING.md`** để giải quyết các issues phổ biến

### 1️⃣ Cài đặt tất cả dependencies

```bash
npm install
```

### 2️⃣ Chạy development server

```bash
npm run dev
```

Mở trình duyệt tại: **http://localhost:5173** 🎉

---

## Tất Cả Lệnh Cần Thiết

```bash
# Development
npm install          # Cài tất cả packages
npm run dev          # Chạy dev server
npm run typecheck    # Check TypeScript errors
npm run lint         # Check ESLint errors

# Production
npm run build        # Build cho production
npm run preview      # Preview production build
```

---

## Deploy Nhanh

### Vercel (1 Click Deploy)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### Netlify (Drag & Drop)
```bash
npm run build
# Drag thư mục 'dist' vào netlify.com
```

---

## Package Manager Khác

### Yarn
```bash
yarn install
yarn dev
yarn build
```

### pnpm
```bash
pnpm install
pnpm dev
pnpm build
```

---

## Danh Sách Dependencies Chính

✅ **React 18** - UI Framework  
✅ **TypeScript** - Type Safety  
✅ **Tailwind CSS v4** - Styling  
✅ **Shadcn/ui** - UI Components  
✅ **Lucide React** - Icons  
✅ **React Hook Form** - Forms  
✅ **Recharts** - Charts  
✅ **Sonner** - Toast Notifications  

**Xem đầy đủ**: `package.json` hoặc `INSTALLATION.md`

---

## Troubleshooting Nhanh

### Lỗi: "Module not found"
```bash
rm -rf node_modules package-lock.json
npm install
```

### Port đã được sử dụng
```bash
npx kill-port 5173
npm run dev
```

### Tailwind không hoạt động
- Check `styles/globals.css` đã import trong `App.tsx`
- Restart dev server

---

## File Cấu Hình Quan Trọng

- `package.json` - Dependencies & scripts
- `vite.config.ts` - Vite configuration
- `tsconfig.json` - TypeScript config
- `styles/globals.css` - Tailwind & global styles
- `index.html` - Entry HTML file

---

## Cấu Trúc Project

```
/
├── App.tsx                    # Entry point
├── MainApp.tsx                # Main routing
├── HomePage.tsx               # Trang chủ (Khách sạn)
├── FlightsPage.tsx            # Trang vé máy bay
├── SearchPage.tsx             # Kết quả tìm kiếm
├── BookingDetailsPage.tsx     # Nhập thông tin đặt vé
├── ConfirmationPage.tsx       # Xác nhận đặt vé
├── OffersPage.tsx             # Ưu đãi
├── components/                # Reusable components
│   ├── ui/                    # Shadcn UI components
│   └── figma/                 # Figma helpers
├── styles/                    # Global styles
└── imports/                   # Figma imports (không dùng)
```

---

## Navigation Flow

```
HomePage (Khách sạn)
    ↓ Click "Vé máy bay"
FlightsPage
    ↓ Click "Search"
SearchPage (Kết quả)
    ↓ Click "Book Now"
BookingDetailsPage
    ↓ Click "Proceed to Payment"
ConfirmationPage
    ↓ Click "Khám phá thêm ưu đãi"
OffersPage
```

---

## Resources

📖 **Docs:**
- `README.md` - Tổng quan
- `INSTALLATION.md` - Hướng dẫn cài đặt chi tiết
- `DEPLOYMENT_GUIDE.md` - Hướng dẫn deploy
- `ICON_MAPPING.md` - Icon mapping guide

🔗 **Links:**
- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Shadcn/ui](https://ui.shadcn.com)
- [Lucide Icons](https://lucide.dev)

---

**Happy Coding! 🎉**

Need help? Check `INSTALLATION.md` cho hướng dẫn chi tiết!
