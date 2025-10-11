# Icon Mapping Guide - Thay thế figma:asset bằng Lucide Icons

## Danh Sách Icons Cần Thay Thế

### Flight & Travel Icons

```tsx
import {
  PlaneTakeoff,      // imgAirplaneTakeOff
  PlaneLanding,      // imgAirplaneLanding  
  Plane,             // imgPlane, imgPlaneFlyingOverThePlanet
  ArrowRightLeft,    // imgDataTransfer
  Calendar,          // imgCalendar
  User,              // imgUser
  Users,             // imgPeople (nhiều người)
  Search,            // imgSearch
  Luggage,           // imgSuitcase
  Briefcase,         // imgTraveler
  Ticket,            // imgTwoTickets
  Clock,             // imgAlarm
  Info,              // imgInfo
  Wifi,              // imgWiFi
  Video,             // imgVideo
  Plus,              // imgPlus, imgPlusMath
  ChevronDown,       // imgExpandArrow
  Copy,              // imgIcons8Copy24Px11
  Hotel,             // imgBed
  ThumbsUp,          // imgThumbsUp
  DollarSign,        // imgLowPrice
  Zap,               // Cho "fastest"
  MapPin,            // Cho location
  Globe,             // Cho destinations
} from "lucide-react";
```

## Cách Sử Dụng

### 1. Basic Icon
```tsx
// Trước:
<img alt="search" className="w-4 h-4" src={imgSearch} />

// Sau:
<Search className="w-4 h-4 text-gray-600" />
```

### 2. Icon trong Button
```tsx
// Trước:
<Button>
  <img alt="search" className="w-4 h-4 mr-2" src={imgSearch} />
  Search
</Button>

// Sau:
<Button>
  <Search className="w-4 h-4 mr-2" />
  Search
</Button>
```

### 3. Icon với màu tùy chỉnh
```tsx
<Plane className="w-5 h-5 text-blue-600" />
<Calendar className="w-5 h-5 text-gray-400" />
<User className="w-5 h-5 text-purple-600" />
```

### 4. Icon animated
```tsx
<Plane className="w-5 h-5 animate-bounce text-blue-600" />
<Search className="w-5 h-5 hover:scale-110 transition-transform" />
```

## Mapping Chi Tiết Cho Từng File

### FlightsPage.tsx
```tsx
// Thay thế:
imgAirplaneTakeOff → <PlaneTakeoff className="w-5 h-5" />
imgAirplaneLanding → <PlaneLanding className="w-5 h-5" />
imgDataTransfer → <ArrowRightLeft className="w-5 h-5" />
imgCalendar → <Calendar className="w-5 h-5" />
imgUser → <User className="w-5 h-5" />
imgSearch → <Search className="w-5 h-5" />
imgPlusMath → <Plus className="w-5 h-5" />
```

### SearchPage.tsx
```tsx
// Thay thế tương tự FlightsPage + thêm:
imgExpandArrow → <ChevronDown className="w-4 h-4" />
imgThumbsUp → <ThumbsUp className="w-4 h-4" />
imgLowPrice → <DollarSign className="w-4 h-4" />
imgPlaneFlyingOverThePlanet → <Plane className="w-8 h-8" />
imgPlane → <Plane className="w-4 h-4" />
imgTwoTickets → <Ticket className="w-3 h-3" />
imgTravelator → <Briefcase className="w-3 h-3" />
imgTraveler → <User className="w-3 h-3" />
imgSuitcase → <Luggage className="w-3 h-3" />
imgVideo → <Video className="w-3 h-3" />
imgWiFi → <Wifi className="w-3 h-3" />
imgInfo → <Info className="w-3 h-3" />
```

### BookingDetailsPage.tsx
```tsx
imgPlane → <Plane className="w-24 h-24" />
imgPlaneFlyingOverThePlanet → <Plane className="w-8 h-8" />
imgPlane1 → <Plane className="w-4 h-4" />
imgTwoTickets → <Ticket className="w-3 h-3" />
imgTravelator → <Briefcase className="w-3 h-3" />
imgTraveler → <User className="w-3 h-3" />
imgSuitcase → <Luggage className="w-3 h-3" />
imgExpandArrow → <ChevronDown className="w-4 h-4" />
imgCalendar → <Calendar className="w-4 h-4" />
imgPlus → <Plus className="w-4 h-4" />
```

### ConfirmationPage.tsx
```tsx
// Tương tự BookingDetailsPage
```

### OffersPage.tsx
```tsx
imgAlarm → <Clock className="w-4 h-4" />
imgIcons8Copy24Px11 → <Copy className="w-4 h-4" />
```

### HomePage.tsx
```tsx
imgPeople → <Users className="w-5 h-5" />
imgCalendar → <Calendar className="w-5 h-5" />
imgBed → <Hotel className="w-5 h-5" />
imgExpandArrow → <ChevronDown className="w-4 h-4" />
imgPlusMath → <Plus className="w-5 h-5" />
```

## Images (không phải icons) - Dùng Unsplash

### Destinations / Photos
```tsx
// Thay vì figma:asset, dùng Unsplash:

// Paris
imgRectangle5 → "https://images.unsplash.com/photo-1502602898657-3e91760cbb34"

// Bali  
imgRectangle6 → "https://images.unsplash.com/photo-1537996194471-e657df975ab4"

// Tokyo
imgRectangle7 → "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf"

// NYC
imgRectangle10 → "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9"

// Beach
imgRectangle1 → "https://images.unsplash.com/photo-1507525428034-b723cf961d3e"

// Mountain
imgRectangle11 → "https://images.unsplash.com/photo-1506905925346-21bda4d32df4"

// City
imgRectangle12 → "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b"

// Nature
imgRectangle13 → "https://images.unsplash.com/photo-1441974231531-c6227db76b6e"

// Travel
imgRectangle14 → "https://images.unsplash.com/photo-1488646953014-85cb44e25828"

// Adventure
imgRectangle15 → "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b"
```

## Flag Icons

```tsx
// imgImage (Vietnam flag)
// Thay bằng emoji hoặc simple div:
<div className="w-5 h-5 bg-red-600 rounded-full"></div>

// Hoặc dùng emoji:
<span className="text-lg">🇻🇳</span>
```

## Tips

1. **Kích thước nhất quán:** 
   - Small icons: `w-3 h-3` hoặc `w-4 h-4`
   - Medium icons: `w-5 h-5` hoặc `w-6 h-6`
   - Large icons: `w-8 h-8` hoặc `w-12 h-12`

2. **Màu sắc:**
   - Default: `text-gray-600`
   - Primary: `text-blue-600`
   - Success: `text-green-600`
   - Warning: `text-yellow-600`
   - Danger: `text-red-600`

3. **Hover effects:**
   ```tsx
   <Search className="w-5 h-5 text-gray-600 hover:text-blue-600 transition-colors cursor-pointer" />
   ```

4. **Trong inputs:**
   ```tsx
   <div className="relative">
     <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
     <Input className="pl-10" />
   </div>
   ```

## Xem Tất Cả Icons Có Sẵn

https://lucide.dev/icons/

Hoặc search trong project:
```bash
npm run dev
# Vào http://localhost:5173
# Inspect components để xem icons
```

## Auto-replace Script (Optional)

Nếu muốn tự động replace, có thể dùng sed:

```bash
# Ví dụ replace trong 1 file:
sed -i 's/imgSearch/Search/g' FlightsPage.tsx
sed -i 's/imgCalendar/Calendar/g' FlightsPage.tsx

# Nhớ thêm import ở đầu file!
```

Nhưng khuyến nghị làm thủ công để đảm bảo chính xác.
