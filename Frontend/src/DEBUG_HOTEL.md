# 🔍 Debug Hotel Flow - Quick Check

## ✅ Files Checklist

### Pages (Should Exist):
- [x] `/HomePage.tsx` - ✅ Updated with onNavigate
- [x] `/HotelListPage.tsx` - ✅ Created
- [x] `/HotelDetailPage.tsx` - ✅ Created
- [x] `/MainApp.tsx` - ✅ Updated with routes

### Components (Should Exist):
- [x] `/components/HotelCardGrid.tsx` - ✅
- [x] `/components/HotelCardList.tsx` - ✅
- [x] `/components/HotelFilterSidebar.tsx` - ✅
- [x] `/components/HotelTopBar.tsx` - ✅

### UI Components (Should Exist):
- [x] `/components/ui/slider.tsx` - ✅
- [x] `/components/ui/checkbox.tsx` - ✅
- [x] `/components/ui/select.tsx` - ✅
- [x] `/components/ui/button.tsx` - ✅
- [x] `/components/ui/badge.tsx` - ✅

---

## 🔧 Quick Verification Commands

### 1. Check if files exist:
```bash
# On Windows PowerShell
ls HomePage.tsx, HotelListPage.tsx, HotelDetailPage.tsx, MainApp.tsx

# On macOS/Linux
ls -la HomePage.tsx HotelListPage.tsx HotelDetailPage.tsx MainApp.tsx
```

### 2. Check components:
```bash
# On Windows
ls components/Hotel*.tsx

# On macOS/Linux
ls -la components/Hotel*.tsx
```

### 3. Start dev server:
```bash
npm run dev
```

---

## 🐛 Common Issues & Fixes

### Issue 1: "Module not found: HotelListPage"
**Fix:**
```bash
# Check if file exists
ls HotelListPage.tsx

# If not, file wasn't created. Re-run creation.
```

### Issue 2: "TypeError: onNavigate is not a function"
**Fix:**
Check HomePage.tsx line 130-132:
```tsx
interface HomePageProps {
  onNavigate: (page: PageType, data?: any) => void;  // ← Should have data?: any
}
```

### Issue 3: "Cannot find module '@radix-ui/react-slider'"
**Fix:**
```bash
npm install @radix-ui/react-slider
```

### Issue 4: Search button doesn't work
**Fix:**
Check HomePage.tsx SearchBar component has:
```tsx
function SearchBar({ onNavigate }: { onNavigate: (page: PageType, data?: any) => void }) {
  // ... 
  const handleSearch = () => {
    onNavigate("hotel-list", searchParams);  // ← This line must exist
  };
  
  return (
    // ...
    <Button onClick={handleSearch}>  {/* ← onClick must call handleSearch */}
      Tìm
    </Button>
  );
}
```

And in HomePage, pass onNavigate:
```tsx
<SearchBar onNavigate={onNavigate} />  {/* ← Must pass prop */}
```

---

## ✅ Verification Steps

### Step 1: Check MainApp.tsx
```tsx
// Should have these imports:
import HotelListPage from "./HotelListPage";
import HotelDetailPage from "./HotelDetailPage";

// Should have these types:
export type PageType = "home" | "flights" | "search" | "booking" | "confirmation" | "offers" | "hotel-list" | "hotel-detail";

// Should have these routes:
{currentPage === "hotel-list" && <HotelListPage searchParams={pageData} onNavigate={handleNavigate} />}
{currentPage === "hotel-detail" && pageData && <HotelDetailPage hotel={pageData} onNavigate={handleNavigate} />}
```

### Step 2: Check HomePage.tsx
```tsx
// Interface should have:
interface HomePageProps {
  onNavigate: (page: PageType, data?: any) => void;  // ← data?: any is important
}

// SearchBar should have:
function SearchBar({ onNavigate }: { onNavigate: (page: PageType, data?: any) => void }) {
  const handleSearch = () => {
    const searchParams = { /* ... */ };
    onNavigate("hotel-list", searchParams);  // ← This navigates to hotel list
  };
  // ...
}

// In return, should have:
<SearchBar onNavigate={onNavigate} />  // ← Pass the prop
```

### Step 3: Open Browser Console
```
Press F12 → Console tab
Look for errors
```

**Expected: No errors**

If you see errors like:
- ❌ "Cannot find module" → Missing import
- ❌ "TypeError" → Props not passed correctly
- ❌ "ReferenceError" → Variable not defined

---

## 🧪 Manual Test

### Test 1: HomePage Loads
```
1. Open http://localhost:5173
2. Should see hero image with beach
3. Should see yellow search bar
4. No errors in console
```
✅ PASS / ❌ FAIL

### Test 2: Search Button Works
```
1. Click "Tìm" button in search bar
2. Should navigate to new page
3. Should see "Tìm thấy 6 cơ sở lưu trú"
4. Should see hotel cards
```
✅ PASS / ❌ FAIL

### Test 3: Hotels Display
```
1. Count number of hotel cards
2. Should be 6 hotels
3. Each has image, name, price
4. Each has "Chọn" button
```
✅ PASS / ❌ FAIL

### Test 4: View Toggle
```
1. Click [List] button
2. Cards change to horizontal layout
3. Click [Grid] button
4. Cards change back to vertical layout
```
✅ PASS / ❌ FAIL

### Test 5: Hotel Detail
```
1. Click "Chọn" on any hotel
2. Navigate to detail page
3. See hotel image, name, amenities
4. See "Đặt phòng ngay" button
```
✅ PASS / ❌ FAIL

---

## 📊 Debug Console Commands

Open browser console (F12) and run:

### Check current page:
```javascript
// Type in console:
console.log("Current page should be visible");
```

### Check if components loaded:
```javascript
// Should see component names in React DevTools
// Install React DevTools extension if needed
```

---

## 🔍 Code Verification Snippets

### HomePage.tsx - Key Lines to Check:

Line ~46-66:
```tsx
function SearchBar({ onNavigate }: { onNavigate: (page: PageType, data?: any) => void }) {
  const [location, setLocation] = useState("Đà Nẵng, Việt Nam");
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [guests, setGuests] = useState("2 người lớn · 0 trẻ em · 1 phòng");

  const handleSearch = () => {
    const searchParams = {
      destination: location,
      checkIn: checkIn?.toISOString(),
      checkOut: checkOut?.toISOString(),
      guests: { adults: 2, children: 0, rooms: 1 },
    };
    onNavigate("hotel-list", searchParams);  // ← KEY LINE
  };
```

Line ~130:
```tsx
interface HomePageProps {
  onNavigate: (page: PageType, data?: any) => void;  // ← KEY LINE
}
```

Line ~196 (approximate):
```tsx
<SearchBar onNavigate={onNavigate} />  {/* ← KEY LINE */}
```

### MainApp.tsx - Key Lines to Check:

Line ~1-9:
```tsx
import { useState } from "react";
import HomePage from "./HomePage";
import FlightsPage from "./FlightsPage";
import SearchPage from "./SearchPage";
import BookingDetailsPage from "./BookingDetailsPage";
import ConfirmationPage from "./ConfirmationPage";
import OffersPage from "./OffersPage";
import HotelListPage from "./HotelListPage";  // ← KEY LINE
import HotelDetailPage from "./HotelDetailPage";  // ← KEY LINE
```

Line ~11:
```tsx
export type PageType = "home" | "flights" | "search" | "booking" | "confirmation" | "offers" | "hotel-list" | "hotel-detail";
// ← "hotel-list" and "hotel-detail" must be here
```

Line ~17-20:
```tsx
const handleNavigate = (page: PageType, data?: any) => {
  setCurrentPage(page);
  setPageData(data);  // ← KEY LINE - stores search params
};
```

Line ~30-31:
```tsx
{currentPage === "hotel-list" && <HotelListPage searchParams={pageData} onNavigate={handleNavigate} />}
{currentPage === "hotel-detail" && pageData && <HotelDetailPage hotel={pageData} onNavigate={handleNavigate} />}
```

---

## 🚨 If Still Not Working

### Nuclear Option (Reset Everything):

```bash
# 1. Stop dev server (Ctrl+C)

# 2. Clear node_modules and reinstall
rm -rf node_modules
npm install

# 3. Clear browser cache
# In browser: Ctrl+Shift+Delete → Clear cache

# 4. Hard refresh
# Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

# 5. Restart dev server
npm run dev
```

### Check TypeScript Errors:

```bash
# Run TypeScript check
npx tsc --noEmit

# Should show any type errors
```

### Check Vite Build:

```bash
# Try building
npm run build

# If build fails, it will show specific errors
```

---

## ✅ Success Indicators

You know it's working when:

1. ✅ No console errors
2. ✅ HomePage loads with search bar
3. ✅ Click "Tìm" → Page changes
4. ✅ See "Tìm thấy 6 cơ sở lưu trú tại Đà Nẵng"
5. ✅ See 6 hotel cards
6. ✅ Can toggle Grid/List views
7. ✅ Click "Chọn" → See hotel detail page

---

## 📞 Quick Debug Checklist

Run through this in 60 seconds:

- [ ] Files exist (HotelListPage.tsx, HotelDetailPage.tsx)
- [ ] MainApp imports HotelListPage and HotelDetailPage
- [ ] MainApp has "hotel-list" and "hotel-detail" in PageType
- [ ] MainApp has routes for both pages
- [ ] HomePage interface has `data?: any` in onNavigate
- [ ] SearchBar receives onNavigate prop
- [ ] SearchBar has handleSearch function
- [ ] SearchBar button calls handleSearch onClick
- [ ] HomePage passes onNavigate to SearchBar
- [ ] No console errors
- [ ] npm run dev is running

If all ✅ → **Should work!**

If any ❌ → Check that specific item above.

---

**TL;DR Quick Fix:**

```bash
# 1. Verify files exist
ls HotelListPage.tsx HotelDetailPage.tsx

# 2. Check no errors
npm run dev
# Open http://localhost:5173
# Press F12 → Console → Should be no errors

# 3. Test click
# Click "Tìm" button → Should see hotels

# 4. If not working
# Check HomePage.tsx line 130: data?: any
# Check MainApp.tsx line 8-9: imports
# Hard refresh: Ctrl+Shift+R
```

Done! 🎉
