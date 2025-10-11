# Dependencies List - Wanderlust Travel

## Tổng Quan

Dự án sử dụng **52 dependencies** và **11 dev dependencies**

### Cài Đặt Tất Cả

```bash
npm install
```

---

## 📦 Core Dependencies

### React & TypeScript
```json
"react": "^18.3.1"
"react-dom": "^18.3.1"
```

---

## 🎨 Styling & UI Framework

### Tailwind CSS
```json
"tailwindcss": "^4.0.0"
"@tailwindcss/vite": "^4.0.0"
```

### Utility Libraries
```json
"class-variance-authority": "^0.7.0"      // Component variants
"clsx": "^2.1.1"                          // Conditional classes
"tailwind-merge": "^2.5.4"                // Merge Tailwind classes
```

---

## 🧩 UI Components (Shadcn/ui + Radix UI)

### Layout & Navigation
```json
"@radix-ui/react-accordion": "^1.2.1"
"@radix-ui/react-collapsible": "^1.1.1"
"@radix-ui/react-navigation-menu": "^1.2.1"
"@radix-ui/react-menubar": "^1.1.2"
"@radix-ui/react-tabs": "^1.1.1"
"@radix-ui/react-separator": "^1.1.0"
```

### Overlays & Modals
```json
"@radix-ui/react-dialog": "^1.1.2"
"@radix-ui/react-alert-dialog": "^1.1.2"
"@radix-ui/react-popover": "^1.1.2"
"@radix-ui/react-hover-card": "^1.1.2"
"@radix-ui/react-tooltip": "^1.1.4"
"@radix-ui/react-context-menu": "^2.2.2"
"@radix-ui/react-dropdown-menu": "^2.1.2"
"vaul": "^1.0.0"                          // Drawer component
```

### Form Controls
```json
"@radix-ui/react-checkbox": "^1.1.2"
"@radix-ui/react-radio-group": "^1.2.1"
"@radix-ui/react-select": "^2.1.2"
"@radix-ui/react-slider": "^1.2.1"
"@radix-ui/react-switch": "^1.1.1"
"@radix-ui/react-toggle": "^1.1.0"
"@radix-ui/react-toggle-group": "^1.1.0"
"@radix-ui/react-label": "^2.1.0"
```

### Display Components
```json
"@radix-ui/react-avatar": "^1.1.1"
"@radix-ui/react-aspect-ratio": "^1.1.0"
"@radix-ui/react-progress": "^1.1.0"
"@radix-ui/react-scroll-area": "^1.2.0"
"@radix-ui/react-toast": "^1.2.2"
```

### Utilities
```json
"@radix-ui/react-slot": "^1.1.0"
```

---

## 🎯 Icons

```json
"lucide-react": "^0.447.0"                // 1000+ React icons
```

**Usage:**
```tsx
import { Plane, Calendar, User } from "lucide-react";
```

---

## 📅 Date & Calendar

```json
"react-day-picker": "^8.10.1"             // Calendar component
"date-fns": "^3.6.0"                      // Date utilities
```

**Usage:**
```tsx
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
```

---

## 📝 Forms & Validation

```json
"react-hook-form": "^7.55.0"              // Form management
"@hookform/resolvers": "^3.9.1"           // Form resolvers
"zod": "^3.23.8"                          // Schema validation
```

**Usage:**
```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
```

---

## 🎠 Carousel & Slider

```json
"embla-carousel-react": "^8.3.0"          // Carousel component
```

**Usage:**
```tsx
import { Carousel } from "@/components/ui/carousel";
```

---

## 📊 Charts & Graphs

```json
"recharts": "^2.13.3"                     // Charts library
```

**Usage:**
```tsx
import { LineChart, BarChart } from "recharts";
```

---

## 🔔 Notifications

```json
"sonner": "^1.7.1"                        // Toast notifications
```

**Usage:**
```tsx
import { toast } from "sonner";
toast.success("Booking confirmed!");
```

---

## 🎛️ Advanced Components

```json
"input-otp": "^1.2.4"                     // OTP input
"react-resizable-panels": "^2.1.4"        // Resizable panels
"cmdk": "^1.0.0"                          // Command palette
```

---

## 🛠️ Dev Dependencies

### Build Tools
```json
"vite": "^5.4.10"                         // Build tool
"@vitejs/plugin-react": "^4.3.3"         // React plugin for Vite
```

### TypeScript
```json
"typescript": "^5.6.3"
"@types/react": "^18.3.12"
"@types/react-dom": "^18.3.1"
```

### CSS Processing
```json
"autoprefixer": "^10.4.20"
"postcss": "^8.4.49"
```

### Linting
```json
"eslint": "^9.15.0"
"eslint-plugin-react-hooks": "^5.0.0"
"eslint-plugin-react-refresh": "^0.4.14"
"@typescript-eslint/eslint-plugin": "^8.15.0"
"@typescript-eslint/parser": "^8.15.0"
```

---

## 📊 Thống Kê Dependencies

| Category | Count |
|----------|-------|
| Radix UI Components | 21 |
| Form & Validation | 3 |
| Styling & Utils | 3 |
| Date & Calendar | 2 |
| Charts | 1 |
| Icons | 1 |
| Carousel | 1 |
| Notifications | 1 |
| Other | 19 |
| **Total Production** | **52** |
| **Total Dev** | **11** |
| **Grand Total** | **63** |

---

## 🔄 Cập Nhật Dependencies

### Check outdated packages
```bash
npm outdated
```

### Update all packages
```bash
npm update
```

### Update specific package
```bash
npm install <package-name>@latest
```

### Update major versions (cẩn thận!)
```bash
npx npm-check-updates -u
npm install
```

---

## ⚠️ Breaking Changes Considerations

### Tailwind CSS v4
- Mới ra, có thể có breaking changes
- Check docs: https://tailwindcss.com

### React 18
- Concurrent features
- Automatic batching
- New hooks: useId, useTransition, useDeferredValue

### Radix UI
- Cập nhật thường xuyên
- Check changelog trước khi update

---

## 🎯 Optimization Tips

### 1. Tree Shaking
Vite tự động loại bỏ code không dùng

### 2. Code Splitting
```tsx
// Lazy load routes
const HomePage = lazy(() => import('./HomePage'));
```

### 3. Bundle Analysis
```bash
npm install -D vite-bundle-visualizer
```

### 4. Remove unused dependencies
```bash
npm install -g depcheck
depcheck
```

---

## 📝 Notes

- Tất cả packages đều pinned exact versions trong `package.json`
- Dùng `npm ci` trong CI/CD thay vì `npm install`
- Check security với `npm audit`
- Update dependencies định kỳ (monthly)

---

## 🔗 Useful Links

- [React](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Shadcn/ui](https://ui.shadcn.com)
- [Radix UI](https://radix-ui.com)
- [Lucide Icons](https://lucide.dev)
- [React Hook Form](https://react-hook-form.com)
- [Zod](https://zod.dev)
- [Recharts](https://recharts.org)
- [Vite](https://vitejs.dev)

---

**Last Updated**: December 2024  
**Node Version**: 18.0.0+  
**npm Version**: 9.0.0+
