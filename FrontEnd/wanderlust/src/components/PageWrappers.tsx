/**
 * Wrapper components for pages that need URL params or location state
 * These components extract data from React Router and pass it to the actual page components
 */

import { useLocation, useParams } from "react-router-dom";
import { usePageContext } from "../router/usePageContext";

// Import page components
import { ActivityDetailPage } from "../pages/Activities";
import CheckoutPage from "../pages/Booking/CheckoutPage";
import PaymentSuccessPage from "../pages/Booking/PaymentSuccessPage";
import { CarDetailPage } from "../pages/CarRental";
import { SeatSelectionPage } from "../pages/Flights";
import LocationDetailPage from "../pages/Home/LocationDetailPage";
import { HotelDetailPage } from "../pages/Hotels";
import { GuideDetailPage, TourDetailPage, TravelArticlePage } from "../pages/TravelGuide";
import { VisaArticleDetailPage } from "../pages/Visa";

/**
 * Wrapper for LocationDetailPage
 * Extracts locationId from URL params
 */
export function LocationDetailPageWrapper() {
  const { id } = useParams<{ id: string }>();
  const context = usePageContext();
  
  return <LocationDetailPage locationId={id!} {...context} />;
}

/**
 * Wrapper for HotelDetailPage
 * Extracts hotel id from URL params and hotel data from location state
 */
export function HotelDetailPageWrapper() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const context = usePageContext();
  const hotel = location.state?.hotel || location.state;
  
  // Pass id from URL params to component
  return <HotelDetailPage hotel={hotel} hotelId={id!} {...context} />;
}

/**
 * Wrapper for CarDetailPage
 * Extracts car data from location state
 */
export function CarDetailPageWrapper() {
  const { id } = useParams<{ id: string }>();  // URL param for future use
  const location = useLocation();
  const context = usePageContext();
  const car = location.state?.car || location.state;
  
  return <CarDetailPage car={car} {...context} />;
}

/**
 * Wrapper for ActivityDetailPage
 * Extracts activity data from location state
 */
export function ActivityDetailPageWrapper() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const context = usePageContext();
  const activity = location.state?.activity || location.state;
  
  return <ActivityDetailPage activity={activity} {...context} />;
}

/**
 * Wrapper for SeatSelectionPage
 * Extracts pageData from location state
 */
export function SeatSelectionPageWrapper() {
  const location = useLocation();
  const context = usePageContext();
  const pageData = location.state;
  
  return <SeatSelectionPage pageData={pageData} {...context} />;
}

/**
 * Wrapper for VisaArticleDetailPage
 * Extracts article data from location state
 */
export function VisaArticleDetailPageWrapper() {
  const { id } = useParams<{ id: string }>();  // URL param for future use
  const location = useLocation();
  const context = usePageContext();
  const article = location.state?.article || location.state;
  
  return <VisaArticleDetailPage article={article} {...context} />;
}

/**
 * Wrapper for GuideDetailPage
 * Extracts guide data from location state
 */
export function GuideDetailPageWrapper() {
  const { id } = useParams<{ id: string }>();  // URL param for future use
  const location = useLocation();
  const context = usePageContext();
  const guide = location.state?.guide || location.state;
  
  return <GuideDetailPage guide={guide} {...context} />;
}

/**
 * Wrapper for TravelArticlePage
 * Extracts article data from location state
 */
export function TravelArticlePageWrapper() {
  const { id } = useParams<{ id: string }>();  // URL param for future use
  const location = useLocation();
  const context = usePageContext();
  const article = location.state?.article || location.state;
  
  return <TravelArticlePage article={article} {...context} />;
}

/**
 * Wrapper for TourDetailPage
 * Extracts tour data from location state
 */
export function TourDetailPageWrapper() {
  const { id } = useParams<{ id: string }>();  // URL param for future use
  const location = useLocation();
  const context = usePageContext();
  const tour = location.state?.tour || location.state;
  
  return <TourDetailPage tour={tour} {...context} />;
}

/**
 * Wrapper for CheckoutPage
 * Extracts bookingData from location state
 */
export function CheckoutPageWrapper() {
  const location = useLocation();
  const context = usePageContext();
  const bookingData = location.state?.bookingData || location.state;
  
  return <CheckoutPage bookingData={bookingData} {...context} />;
}

/**
 * Wrapper for PaymentSuccessPage
 * Extracts sessionId and bookingId from location state
 */
export function PaymentSuccessPageWrapper() {
  const location = useLocation();
  const context = usePageContext();
  const { sessionId, bookingId } = location.state || {};
  
  return <PaymentSuccessPage sessionId={sessionId} bookingId={bookingId} {...context} />;
}
