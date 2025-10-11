# Hướng Dẫn Cài Đặt - Wanderlust Travel

## Yêu Cầu Hệ Thống

- **Node.js**: >= 18.0.0
- **npm**: >= 9.0.0 (hoặc yarn, pnpm)
- **Git**: Phiên bản mới nhất

## Cài Đặt Từ Đầu

### 1. Clone hoặc tải project

```bash
# Nếu từ Git
git clone <your-repo-url>
cd wanderlust-travel

# Hoặc giải nén file zip và cd vào thư mục
```

### 2. Cài đặt tất cả dependencies

```bash
npm install
```

**Hoặc dùng yarn:**
```bash
yarn install
```

**Hoặc dùng pnpm:**
```bash
pnpm install
```

### 3. Chạy development server

```bash
npm run dev
```

Website sẽ chạy tại: `http://localhost:5173`

## Các Lệnh Quan Trọng

### Development
```bash
npm run dev          # Chạy dev server với hot reload
```

### Production Build
```bash
npm run build        # Build project cho production
npm run preview      # Preview production build locally
```

### Type Checking & Linting
```bash
npm run typecheck    # Check TypeScript errors
npm run lint         # Check ESLint errors
```

## Cấu Trúc Dependencies

### Core Dependencies
- **React 18**: Framework chính
- **TypeScript**: Type safety
- **Vite**: Build tool & dev server
- **Tailwind CSS v4**: Styling framework

### UI Components (Shadcn/ui)
- **Radix UI**: Primitives cho components
- **Lucide React**: Icon library
- **Class Variance Authority**: Component variants
- **Tailwind Merge**: Merge Tailwind classes

### Form & Validation
- **React Hook Form**: Form management
- **Zod**: Schema validation
- **@hookform/resolvers**: Connect RHF với Zod

### Additional Libraries
- **date-fns**: Date utilities
- **react-day-picker**: Calendar component
- **embla-carousel-react**: Carousel
- **recharts**: Charts & graphs
- **sonner**: Toast notifications
- **vaul**: Drawer component
- **cmdk**: Command palette

## Troubleshooting

### Lỗi: "Module not found"
```bash
# Xóa node_modules và reinstall
rm -rf node_modules package-lock.json
npm install
```

### Lỗi: "Port 5173 đã được sử dụng"
```bash
# Thay đổi port trong vite.config.ts hoặc kill process
npx kill-port 5173
npm run dev
```

### Lỗi: TypeScript errors
```bash
# Check errors
npm run typecheck

# Có thể ignore bằng cách thêm @ts-ignore hoặc fix theo output
```

### Lỗi: Tailwind CSS không hoạt động
```bash
# Đảm bảo file globals.css đã được import trong App.tsx
# Check tailwind.config và postcss.config có đúng không
```

## Deploy lên Production

### Vercel (Khuyến nghị)

1. **Kết nối repo với Vercel:**
   - Đăng nhập https://vercel.com
   - Click "Import Project"
   - Chọn Git repository

2. **Cấu hình build:**
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Deploy:**
   - Click "Deploy"
   - Đợi vài phút

### Netlify

1. **Build locally:**
```bash
npm run build
```

2. **Deploy:**
   - Đăng nhập https://netlify.com
   - Drag & drop thư mục `dist`
   - Hoặc kết nối Git repository

### Manual Deploy (VPS/Server)

```bash
# Build project
npm run build

# Copy dist folder to server
scp -r dist/* user@server:/var/www/wanderlust

# Configure Nginx/Apache to serve static files
```

## Cấu Hình Nginx (nếu cần)

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    
    root /var/www/wanderlust;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Gzip compression
    gzip on;
    gzip_types text/css application/javascript application/json;
}
```

## Environment Variables (nếu cần sau này)

Tạo file `.env.local`:

```env
VITE_APP_NAME=Wanderlust
VITE_API_URL=https://your-api.com
# Thêm các env variables khác nếu cần
```

## Thêm Dependencies Mới

```bash
# Thêm dependency
npm install <package-name>

# Thêm dev dependency
npm install -D <package-name>

# Xóa dependency
npm uninstall <package-name>
```

## Cập Nhật Dependencies

```bash
# Check outdated packages
npm outdated

# Update all packages
npm update

# Update specific package
npm install <package-name>@latest
```

## Performance Tips

### 1. Optimize Images
- Compress images trước khi deploy
- Dùng WebP format
- Lazy load images

### 2. Code Splitting
- Vite tự động code split
- Có thể lazy load routes nếu cần

### 3. Build Optimization
```bash
# Build với minification & compression
npm run build

# Analyze bundle size
npm install -D vite-bundle-visualizer
```

## Hỗ Trợ

- **Issues**: Tạo issue trên GitHub repository
- **Docs**: Đọc README.md, DEPLOYMENT_GUIDE.md
- **Community**: Discord/Slack channel (nếu có)

## License

MIT License - Xem file LICENSE để biết chi tiết

---

**Happy Coding! 🚀**
