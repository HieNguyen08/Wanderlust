#!/bin/bash

# Script to reorganize pages into /pages directory structure
# Usage: bash restructure-pages.sh

echo "Starting page restructure..."

# Function to update imports in a file
update_imports() {
    local file=$1
    local depth=$2  # Number of "../" needed
    
    local prefix=""
    for ((i=0; i<depth; i++)); do
        prefix+="../"
    done
    
    # Update component imports
    sed -i.bak "s|from \"./components/|from \"${prefix}components/|g" "$file"
    
    # Update MainApp import
    sed -i.bak "s|from \"./MainApp\"|from \"${prefix}MainApp\"|g" "$file"
    
    # Update figma imports
    sed -i.bak "s|from \"./components/figma/|from \"${prefix}components/figma/|g" "$file"
    
    # Update utils imports
    sed -i.bak "s|from \"./utils/|from \"${prefix}utils/|g" "$file"
    
    # Remove backup files
    rm "${file}.bak" 2>/dev/null || true
}

# Create directory structure
mkdir -p pages/{Flights,Search,Booking,Confirmation,Hotels,CarRental,Activities,Visa,TravelGuide,Tours,Offers,Profile,About,Admin,Vendor}

echo "Created directory structure"

# Flights pages
if [ -f "FlightsPage.tsx" ]; then
    cp FlightsPage.tsx pages/Flights/FlightsPage.tsx
    update_imports pages/Flights/FlightsPage.tsx 2
    echo "✓ Copied FlightsPage"
fi

if [ -f "FlightReviewPage.tsx" ]; then
    cp FlightReviewPage.tsx pages/Flights/FlightReviewPage.tsx
    update_imports pages/Flights/FlightReviewPage.tsx 2
    echo "✓ Copied FlightReviewPage"
fi

# Search page
if [ -f "SearchPage.tsx" ]; then
    cp SearchPage.tsx pages/Search/SearchPage.tsx
    update_imports pages/Search/SearchPage.tsx 2
    echo "✓ Copied SearchPage"
fi

# Booking pages
if [ -f "BookingDetailsPage.tsx" ]; then
    cp BookingDetailsPage.tsx pages/Booking/BookingDetailsPage.tsx
    update_imports pages/Booking/BookingDetailsPage.tsx 2
    echo "✓ Copied BookingDetailsPage"
fi

if [ -f "BookingHistoryPage.tsx" ]; then
    cp BookingHistoryPage.tsx pages/Booking/BookingHistoryPage.tsx
    update_imports pages/Booking/BookingHistoryPage.tsx 2
    echo "✓ Copied BookingHistoryPage"
fi

# Confirmation page
if [ -f "ConfirmationPage.tsx" ]; then
    cp ConfirmationPage.tsx pages/Confirmation/ConfirmationPage.tsx
    update_imports pages/Confirmation/ConfirmationPage.tsx 2
    echo "✓ Copied ConfirmationPage"
fi

# Hotel pages
for file in HotelLandingPage HotelListPage HotelDetailPage HotelReviewPage; do
    if [ -f "${file}.tsx" ]; then
        cp "${file}.tsx" "pages/Hotels/${file}.tsx"
        update_imports "pages/Hotels/${file}.tsx" 2
        echo "✓ Copied ${file}"
    fi
done

# Car Rental pages
for file in CarRentalLandingPage CarRentalListPage CarDetailPage CarRentalReviewPage; do
    if [ -f "${file}.tsx" ]; then
        cp "${file}.tsx" "pages/CarRental/${file}.tsx"
        update_imports "pages/CarRental/${file}.tsx" 2
        echo "✓ Copied ${file}"
    fi
done

# Activities pages
for file in ActivitiesPage ActivityDetailPage ActivityReviewPage; do
    if [ -f "${file}.tsx" ]; then
        cp "${file}.tsx" "pages/Activities/${file}.tsx"
        update_imports "pages/Activities/${file}.tsx" 2
        echo "✓ Copied ${file}"
    fi
done

# Visa pages
for file in VisaLandingPage VisaArticleDetailPage VisaConsultationPage VisaTrackingPage VisaApplicationPage VisaDocumentsPage VisaPaymentPage VisaConfirmationPage; do
    if [ -f "${file}.tsx" ]; then
        cp "${file}.tsx" "pages/Visa/${file}.tsx"
        update_imports "pages/Visa/${file}.tsx" 2
        echo "✓ Copied ${file}"
    fi
done

# Travel Guide pages
for file in TravelGuidePage GuideDetailPage TravelArticlePage; do
    if [ -f "${file}.tsx" ]; then
        cp "${file}.tsx" "pages/TravelGuide/${file}.tsx"
        update_imports "pages/TravelGuide/${file}.tsx" 2
        echo "✓ Copied ${file}"
    fi
done

# Tours pages
if [ -f "TourDetailPage.tsx" ]; then
    cp TourDetailPage.tsx pages/Tours/TourDetailPage.tsx
    update_imports pages/Tours/TourDetailPage.tsx 2
    echo "✓ Copied TourDetailPage"
fi

# Offers pages
for file in OffersPage PromotionsPage; do
    if [ -f "${file}.tsx" ]; then
        cp "${file}.tsx" "pages/Offers/${file}.tsx"
        update_imports "pages/Offers/${file}.tsx" 2
        echo "✓ Copied ${file}"
    fi
done

# Profile pages
for file in ProfilePage SavedItemsPage UserVouchersPage UserWalletPage TopUpWalletPage SettingsPage PaymentMethodsPage; do
    if [ -f "${file}.tsx" ]; then
        cp "${file}.tsx" "pages/Profile/${file}.tsx"
        update_imports "pages/Profile/${file}.tsx" 2
        echo "✓ Copied ${file}"
    fi
done

# About page
if [ -f "AboutPage.tsx" ]; then
    cp AboutPage.tsx pages/About/AboutPage.tsx
    update_imports pages/About/AboutPage.tsx 2
    echo "✓ Copied AboutPage"
fi

# Admin pages
for file in AdminDashboard AdminUsersPage AdminBookingsPage AdminHotelsPage AdminActivitiesPage AdminVouchersPage AdminReviewsPage AdminReportsPage AdminRefundsPage AdminRefundWalletPage AdminPendingServicesPage AdminSettingsPage; do
    if [ -f "${file}.tsx" ]; then
        cp "${file}.tsx" "pages/Admin/${file}.tsx"
        update_imports "pages/Admin/${file}.tsx" 2
        echo "✓ Copied ${file}"
    fi
done

# Vendor pages
for file in VendorDashboard VendorServicesPage VendorBookingsPage VendorVouchersPage VendorReviewsPage VendorReportsPage VendorSettingsPage; do
    if [ -f "${file}.tsx" ]; then
        cp "${file}.tsx" "pages/Vendor/${file}.tsx"
        update_imports "pages/Vendor/${file}.tsx" 2
        echo "✓ Copied ${file}"
    fi
done

echo ""
echo "✅ Restructure complete!"
echo ""
echo "Next steps:"
echo "1. Update MainApp.tsx to use new import paths"
echo "2. Test the application"
echo "3. Delete old root-level page files"
