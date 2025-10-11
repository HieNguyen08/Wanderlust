#!/bin/bash

# Script to fix all version numbers in import statements
# Run: bash fix-all-imports.sh

echo "Fixing all import version numbers..."

# Fix all files in components/ui/
find components/ui -name "*.tsx" -o -name "*.ts" | while read file; do
  echo "Processing: $file"
  
  # Remove version numbers from @radix-ui packages
  sed -i 's/@radix-ui\/react-\([a-z-]*\)@[0-9.]*"/@radix-ui\/react-\1"/g' "$file"
  
  # Remove version numbers from lucide-react
  sed -i 's/lucide-react@[0-9.]*"/lucide-react"/g' "$file"
  
  # Remove version numbers from class-variance-authority
  sed -i 's/class-variance-authority@[0-9.]*"/class-variance-authority"/g' "$file"
  
  # Remove version numbers from react-hook-form
  sed -i 's/react-hook-form@[0-9.]*"/react-hook-form"/g' "$file"
  
  # Remove version numbers from react-day-picker
  sed -i 's/react-day-picker@[0-9.]*"/react-day-picker"/g' "$file"
  
  # Remove version numbers from embla-carousel-react
  sed -i 's/embla-carousel-react@[0-9.]*"/embla-carousel-react"/g' "$file"
  
  # Remove version numbers from recharts
  sed -i 's/recharts@[0-9.]*"/recharts"/g' "$file"
  
  # Remove version numbers from cmdk
  sed -i 's/cmdk@[0-9.]*"/cmdk"/g' "$file"
  
  # Remove version numbers from input-otp
  sed -i 's/input-otp@[0-9.]*"/input-otp"/g' "$file"
  
  # Remove version numbers from react-resizable-panels
  sed -i 's/react-resizable-panels@[0-9.]*"/react-resizable-panels"/g' "$file"
  
  # Remove version numbers from vaul
  sed -i 's/vaul@[0-9.]*"/vaul"/g' "$file"
  
  # Remove version numbers from sonner
  sed -i 's/sonner@[0-9.]*"/sonner"/g' "$file"
  
  # Remove version numbers from next-themes
  sed -i 's/next-themes@[0-9.]*"/next-themes"/g' "$file"
done

echo "Done! All version numbers removed from imports."
echo "Please verify the changes with: git diff components/ui/"
