# Role Mapping Documentation

## Tổng quan

Hệ thống Wanderlust sử dụng 3 loại vai trò (role) cho người dùng:

### Backend (Java/Spring Boot)
```java
public enum Role {
    USER,     // Người dùng bình thường
    PARTNER,  // Vendor/Partner - có quyền quản lý dịch vụ
    ADMIN     // Quản trị viên hệ thống
}
```

### Frontend (TypeScript/React)
```typescript
type FrontendRole = "user" | "admin" | "vendor";
```

## Mapping giữa Backend và Frontend

| Backend | Frontend | Mô tả |
|---------|----------|-------|
| `USER` | `user` | Người dùng bình thường, có thể đặt dịch vụ |
| `PARTNER` | `vendor` | Vendor/Partner, có quyền truy cập Vendor Panel |
| `ADMIN` | `admin` | Quản trị viên, có quyền truy cập Admin Panel |

## Tại sao cần mapping?

Backend sử dụng `PARTNER` (viết hoa, theo convention của Java Enum) để chỉ những người dùng có quyền cung cấp dịch vụ (vendor/partner). Frontend sử dụng `vendor` (viết thường) để dễ hiểu và nhất quán với UI/UX.

## Cách sử dụng

### 1. Import utility functions
```typescript
import { 
  mapBackendRoleToFrontend, 
  mapFrontendRoleToBackend,
  type FrontendRole 
} from '@/utils/roleMapper';
```

### 2. Khi nhận response từ API
```typescript
// Backend trả về: { role: "PARTNER", ... }
const response = await authApi.login(email, password);
const mappedRole = mapBackendRoleToFrontend(response.role);
// mappedRole = "vendor"
```

### 3. Khi gửi request lên API
```typescript
const frontendRole: FrontendRole = "vendor";
const backendRole = mapFrontendRoleToBackend(frontendRole);
// backendRole = "PARTNER"
```

### 4. Check quyền trong component
```typescript
import { isAdmin, isVendor, isUser } from '@/utils/roleMapper';

function MyComponent({ userRole }: { userRole: FrontendRole }) {
  if (isAdmin(userRole)) {
    // Show admin features
  }
  
  if (isVendor(userRole)) {
    // Show vendor panel access
  }
  
  if (isUser(userRole)) {
    // Regular user features
  }
}
```

## Chi tiết quyền hạn

### USER (user)
- Đăng ký/đăng nhập
- Xem và đặt các dịch vụ (flights, hotels, activities, car rental)
- Quản lý booking của mình
- Quản lý profile, wallet, vouchers
- Viết review

### PARTNER (vendor)
- Tất cả quyền của USER
- **Truy cập Vendor Panel** (`/vendor-dashboard`)
- Quản lý dịch vụ của mình (hotels, cars, activities)
- Xem và xử lý booking cho dịch vụ của mình
- Quản lý vouchers/promotions
- Xem báo cáo doanh thu

### ADMIN (admin)
- Tất cả quyền của USER và PARTNER
- **Truy cập Admin Panel** (`/admin-dashboard`)
- Quản lý tất cả users, vendors
- Quản lý tất cả bookings trong hệ thống
- Quản lý flights, activities
- Duyệt/từ chối dịch vụ của vendors
- Quản lý refunds, wallets
- Xem và kiểm duyệt reviews
- Xem báo cáo tổng thể hệ thống

## Files đã được cập nhật

1. **`src/utils/roleMapper.ts`** - Utility functions chính
2. **`src/pages/Auth/LoginPage.tsx`** - Mapping role khi đăng nhập
3. **`src/pages/Auth/LoginSuccessPage.tsx`** - Mapping role cho OAuth login
4. **`src/MainApp.tsx`** - State management cho userRole
5. **`src/components/Header.tsx`** - Display và navigation dựa trên role

## Testing

### Test accounts (mock data)
```typescript
// User account
email: "user@gmail.com"
password: "123456"
role: USER → "user"

// Vendor/Partner account
email: "vendor@gmail.com"
password: "123456"
role: PARTNER → "vendor"

// Admin account
email: "admin@gmail.com"
password: "123456"
role: ADMIN → "admin"
```

## Lưu ý quan trọng

1. **Luôn sử dụng `FrontendRole`** type trong TypeScript code
2. **Không hardcode** role strings, sử dụng mapping functions
3. **Backend luôn trả về uppercase** (USER, PARTNER, ADMIN)
4. **Frontend luôn dùng lowercase** (user, vendor, admin)
5. **localStorage** lưu role đã được mapped (lowercase)

## Migration từ code cũ

Nếu code cũ sử dụng:
```typescript
// ❌ Old way
role === "vendor"  // Unclear if backend or frontend

// ✅ New way
import { type FrontendRole } from '@/utils/roleMapper';
const role: FrontendRole = "vendor";
```

## Backend endpoints theo role

### USER
- `/api/v1/users/me/*` - Profile management
- `/api/bookings/*` - User bookings
- `/api/v1/wallet/*` - Wallet operations

### PARTNER (vendor)
- `/api/vendor/*` - Vendor panel endpoints
- `/api/vendor/bookings/*` - Manage vendor bookings
- `/api/vendor/services/*` - Manage services

### ADMIN
- `/api/admin/*` - Admin panel endpoints
- `/api/admin/users/*` - User management
- `/api/admin/bookings/*` - All bookings
- `/api/v1/admin/wallets/*` - Wallet management

---
**Cập nhật cuối:** 2025-01-21
**Người cập nhật:** System Auto-documentation
