import { useState } from "react";
import HomePage from "./HomePage";
import FlightsPage from "./FlightsPage";
import SearchPage from "./SearchPage";
import BookingDetailsPage from "./BookingDetailsPage";
import ConfirmationPage from "./ConfirmationPage";
import OffersPage from "./OffersPage";
import HotelLandingPage from "./HotelLandingPage";
import HotelListPage from "./HotelListPage";
import HotelDetailPage from "./HotelDetailPage";
import VisaLandingPage from "./VisaLandingPage";
import VisaApplicationPage from "./VisaApplicationPage";
import VisaDocumentsPage from "./VisaDocumentsPage";
import VisaPaymentPage from "./VisaPaymentPage";
import VisaConfirmationPage from "./VisaConfirmationPage";
import ActivitiesPage from "./ActivitiesPage";
import ActivityDetailPage from "./ActivityDetailPage";
import TravelGuidePage from "./TravelGuidePage";
import GuideDetailPage from "./GuideDetailPage";
import AboutPage from "./AboutPage";
import PromotionsPage from "./PromotionsPage";
import TourDetailPage from "./TourDetailPage";
import CarRentalLandingPage from "./CarRentalLandingPage";
import CarRentalListPage from "./CarRentalListPage";
import CarDetailPage from "./CarDetailPage";
import CarPaymentPage from "./CarPaymentPage";
import CarThankYouPage from "./CarThankYouPage";

export type PageType = "home" | "flights" | "search" | "booking" | "confirmation" | "offers" | "hotel" | "hotel-list" | "hotel-detail" | "visa" | "visa-application" | "visa-documents" | "visa-payment" | "visa-confirmation" | "activities" | "activity-detail" | "activity-booking" | "travel-guide" | "guide-detail" | "about" | "promotions" | "tour-detail" | "car-rental" | "car-list" | "car-detail" | "car-payment" | "car-thankyou";

export default function MainApp() {
  const [currentPage, setCurrentPage] = useState<PageType>("home");
  const [pageData, setPageData] = useState<any>(null);

  const handleNavigate = (page: PageType, data?: any) => {
    setCurrentPage(page);
    setPageData(data);
  };

  return (
    <div>
      {currentPage === "home" && <HomePage onNavigate={handleNavigate} />}
      {currentPage === "flights" && <FlightsPage onNavigate={handleNavigate} />}
      {currentPage === "search" && <SearchPage onNavigate={handleNavigate} />}
      {currentPage === "booking" && <BookingDetailsPage onNavigate={handleNavigate} />}
      {currentPage === "confirmation" && <ConfirmationPage onNavigate={handleNavigate} />}
      {currentPage === "offers" && <OffersPage onNavigate={handleNavigate} />}
      {currentPage === "hotel" && <HotelLandingPage onNavigate={handleNavigate} />}
      {currentPage === "hotel-list" && <HotelListPage searchParams={pageData} onNavigate={handleNavigate} />}
      {currentPage === "hotel-detail" && pageData && <HotelDetailPage hotel={pageData} onNavigate={handleNavigate} />}
      {currentPage === "visa" && <VisaLandingPage onNavigate={handleNavigate} />}
      {currentPage === "visa-application" && <VisaApplicationPage country={pageData?.country} onNavigate={handleNavigate} />}
      {currentPage === "visa-documents" && <VisaDocumentsPage country={pageData?.country} formData={pageData?.formData} onNavigate={handleNavigate} />}
      {currentPage === "visa-payment" && <VisaPaymentPage country={pageData?.country} formData={pageData?.formData} documents={pageData?.documents} onNavigate={handleNavigate} />}
      {currentPage === "visa-confirmation" && <VisaConfirmationPage {...pageData} onNavigate={handleNavigate} />}
      {currentPage === "activities" && <ActivitiesPage onNavigate={handleNavigate} />}
      {currentPage === "activity-detail" && pageData && <ActivityDetailPage activity={pageData} onNavigate={handleNavigate} />}
      {currentPage === "travel-guide" && <TravelGuidePage onNavigate={handleNavigate} />}
      {currentPage === "guide-detail" && pageData && <GuideDetailPage destination={pageData} onNavigate={handleNavigate} />}
      {currentPage === "about" && <AboutPage onNavigate={handleNavigate} />}
      {currentPage === "promotions" && <PromotionsPage onNavigate={handleNavigate} />}
      {currentPage === "tour-detail" && pageData && <TourDetailPage tour={pageData} onNavigate={handleNavigate} />}
      {currentPage === "car-rental" && <CarRentalLandingPage onNavigate={handleNavigate} />}
      {currentPage === "car-list" && <CarRentalListPage onNavigate={handleNavigate} />}
      {currentPage === "car-detail" && pageData && <CarDetailPage car={pageData} onNavigate={handleNavigate} />}
      {currentPage === "car-payment" && pageData && <CarPaymentPage car={pageData} onNavigate={handleNavigate} />}
      {currentPage === "car-thankyou" && pageData && <CarThankYouPage car={pageData} onNavigate={handleNavigate} />}
    </div>
  );
}
