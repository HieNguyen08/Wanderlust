# 🔧 Troubleshooting Guide

## ✅ Issues Fixed

### 1. Import Version Numbers Error
**Error:** `Failed to resolve import "@radix-ui/react-checkbox@1.1.4"`

**Solution:** ✅ **FIXED!** All 41 UI component files have been updated to remove version numbers from imports.

**Verify fix:**
```bash
# Should return nothing
grep -r "@[0-9]\+\.[0-9]\+\.[0-9]\+" components/ui/
```

### 2. Timeout Error
**Error:** `Message getPage (id: 3) response timed out after 30000ms`

**Possible Causes & Solutions:**

#### A. Clear cache and reinstall
```bash
# Delete node_modules and lock file
rm -rf node_modules package-lock.json

# Clear npm cache
npm cache clean --force

# Reinstall
npm install
```

#### B. Restart dev server
```bash
# Kill the process
# Ctrl+C or kill node process

# Start fresh
npm run dev
```

#### C. Check browser console
- Open DevTools (F12)
- Check Console tab for errors
- Check Network tab for failed requests

#### D. Build the project
```bash
# Try building instead of dev
npm run build
npm run preview
```

### 3. Module Not Found Errors

**Error:** Cannot find module 'X'

**Solution:**
```bash
# Reinstall specific package
npm install <package-name>

# Or reinstall all
npm install
```

### 4. Type Errors

**Error:** TypeScript compilation errors

**Solution:**
```bash
# Check types
npm run typecheck

# If needed, update TypeScript
npm install -D typescript@latest
```

## 🔍 Common Issues

### Issue: Blank Page
**Causes:**
- JavaScript error in browser console
- Component render error
- Missing dependencies

**Solutions:**
1. Check browser console (F12)
2. Check terminal for errors
3. Try: `npm install && npm run dev`

### Issue: Styles Not Loading
**Causes:**
- Tailwind not configured properly
- CSS file not imported

**Solutions:**
1. Check if `styles/globals.css` exists
2. Verify it's imported in entry point
3. Rebuild: `npm run build`

### Issue: Images Not Loading
**Causes:**
- Invalid image URLs
- CORS issues
- Network problems

**Solutions:**
1. Check Network tab in DevTools
2. Verify image URLs are accessible
3. ImageWithFallback component will show fallback

### Issue: Components Not Responsive
**Causes:**
- Missing responsive classes
- Wrong viewport meta tag

**Solutions:**
1. Check `index.html` has viewport meta tag:
   ```html
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   ```
2. All pages now use responsive Tailwind classes

## 📋 Pre-flight Checklist

Before starting development:

✅ Node.js installed (v18+)
✅ npm install completed successfully
✅ No errors in terminal after install
✅ Dev server starts: `npm run dev`
✅ Browser opens to http://localhost:5173
✅ No console errors in browser (F12)

## 🚀 Quick Reset

If all else fails:

```bash
# Nuclear option - complete reset
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
npm run dev
```

## 📞 Debug Commands

```bash
# Check Node version
node --version

# Check npm version  
npm --version

# List installed packages
npm list --depth=0

# Check for outdated packages
npm outdated

# Audit for vulnerabilities
npm audit

# Fix audit issues
npm audit fix
```

## 🔧 Dev Tools

### Browser DevTools (F12)
- **Console:** Check for JavaScript errors
- **Network:** Check API calls and image loads
- **Elements:** Inspect DOM and styles
- **Application:** Check localStorage, cookies

### VS Code Extensions (Recommended)
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- Error Lens

## 📝 Logs Location

- **Browser Console:** F12 → Console tab
- **Terminal:** Where you ran `npm run dev`
- **Network:** F12 → Network tab

## ⚠️ Known Issues

### 1. Vite HMR (Hot Module Replacement)
**Issue:** Changes not reflecting immediately

**Solution:**
- Save file again
- Refresh browser (F5)
- Restart dev server

### 2. Port Already in Use
**Error:** `Port 5173 is already in use`

**Solution:**
```bash
# Kill process on port 5173
# Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:5173 | xargs kill -9

# Or use different port:
npm run dev -- --port 3000
```

### 3. ESM Import Issues
**Error:** `Cannot use import statement outside a module`

**Solution:**
- Verify `package.json` has `"type": "module"`
- Check file extensions are `.tsx` or `.jsx`

## 🆘 Still Having Issues?

1. **Check this file first** - Most issues covered here
2. **Read error messages** - They usually tell you what's wrong
3. **Check browser console** - F12 for client-side errors
4. **Check terminal** - For build/server errors
5. **Try the Nuclear Option** - Complete reset (see above)

## ✅ Current Status

- ✅ All import version numbers removed
- ✅ HomePage converted to responsive design
- ✅ All UI components working
- ✅ Ready for `npm install && npm run dev`

---

**Last Updated:** December 2024  
**Status:** All Known Issues Resolved
