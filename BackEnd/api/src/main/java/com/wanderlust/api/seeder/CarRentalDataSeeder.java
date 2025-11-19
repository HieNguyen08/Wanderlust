package com.wanderlust.api.seeder;

import com.wanderlust.api.entity.CarRental;
import com.wanderlust.api.entity.types.*;
import com.wanderlust.api.repository.CarRentalRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Component
public class CarRentalDataSeeder {

    private static final Logger logger = LoggerFactory.getLogger(CarRentalDataSeeder.class);
    private final CarRentalRepository carRentalRepository;

    public CarRentalDataSeeder(CarRentalRepository carRentalRepository) {
        this.carRentalRepository = carRentalRepository;
    }

    public void seedCarRentals() {
        long carCount = carRentalRepository.count();
        
        if (carCount > 0) {
            logger.info("Deleting existing {} cars to reseed with new structure...", carCount);
            carRentalRepository.deleteAll();
        }

        logger.info("Starting car rental seed...");

        List<CarRental> cars = new ArrayList<>();

        // ============ SPORT CARS ============
        
        // 1. Koenigsegg
        CarRental koenigsegg = new CarRental();
        koenigsegg.setVendorId("vendor-sport-1");
        koenigsegg.setLocationId("location-hanoi");
        koenigsegg.setBrand("Koenigsegg");
        koenigsegg.setModel("Agera RS");
        koenigsegg.setYear(2023);
        koenigsegg.setType(CarType.SPORT);
        koenigsegg.setTransmission(TransmissionType.MANUAL);
        koenigsegg.setFuelType(FuelType.GASOLINE);
        koenigsegg.setSeats(2);
        koenigsegg.setDoors(2);
        koenigsegg.setLuggage(1);
        koenigsegg.setColor("Red");
        koenigsegg.setLicensePlate("30A-12345");
        koenigsegg.setImages(Arrays.asList(
            new CarRental.CarImage("https://images.unsplash.com/photo-1742056024244-02a093dae0b5?w=800", "Front view"),
            new CarRental.CarImage("https://images.unsplash.com/photo-1742056024244-02a093dae0b5?w=800", "Side view")
        ));
        koenigsegg.setFeatures(Arrays.asList("GPS", "Sport Mode", "Racing Seats", "Carbon Fiber Body"));
        koenigsegg.setPricePerDay(new BigDecimal("2400000")); // 99 USD ~ 2.4M VND
        koenigsegg.setPricePerHour(new BigDecimal("150000"));
        koenigsegg.setWithDriver(true);
        koenigsegg.setDriverPrice(new BigDecimal("500000"));
        koenigsegg.setInsurance(new CarRental.InsuranceInfo("Premium", "Full coverage including racing damages", new BigDecimal("300000")));
        koenigsegg.setDeposit(new BigDecimal("50000000"));
        koenigsegg.setFuelPolicy(FuelPolicy.FULL_TO_FULL);
        koenigsegg.setMileageLimit(200);
        koenigsegg.setMinRentalDays(1);
        koenigsegg.setDeliveryAvailable(true);
        koenigsegg.setDeliveryFee(new BigDecimal("200000"));
        koenigsegg.setStatus(CarStatus.AVAILABLE);
        koenigsegg.setAverageRating(new BigDecimal("4.9"));
        koenigsegg.setTotalReviews(156);
        koenigsegg.setTotalTrips(234);
        cars.add(koenigsegg);

        // 2. Nissan GT-R
        CarRental nissanGTR = new CarRental();
        nissanGTR.setVendorId("vendor-sport-2");
        nissanGTR.setLocationId("location-hanoi");
        nissanGTR.setBrand("Nissan");
        nissanGTR.setModel("GT-R NISMO");
        nissanGTR.setYear(2024);
        nissanGTR.setType(CarType.SPORT);
        nissanGTR.setTransmission(TransmissionType.MANUAL);
        nissanGTR.setFuelType(FuelType.GASOLINE);
        nissanGTR.setSeats(2);
        nissanGTR.setDoors(2);
        nissanGTR.setLuggage(1);
        nissanGTR.setColor("Silver");
        nissanGTR.setLicensePlate("30A-67890");
        nissanGTR.setImages(Arrays.asList(
            new CarRental.CarImage("https://images.unsplash.com/photo-1731142582229-e0ee70302c02?w=800", "Front view"),
            new CarRental.CarImage("https://images.unsplash.com/photo-1731142582229-e0ee70302c02?w=800", "Interior")
        ));
        nissanGTR.setFeatures(Arrays.asList("GPS", "Turbo", "Sport Suspension", "Brembo Brakes"));
        nissanGTR.setPricePerDay(new BigDecimal("1920000")); // 80 USD
        nissanGTR.setPricePerHour(new BigDecimal("120000"));
        nissanGTR.setWithDriver(true);
        nissanGTR.setDriverPrice(new BigDecimal("500000"));
        nissanGTR.setInsurance(new CarRental.InsuranceInfo("Premium", "Comprehensive coverage", new BigDecimal("250000")));
        nissanGTR.setDeposit(new BigDecimal("30000000"));
        nissanGTR.setFuelPolicy(FuelPolicy.FULL_TO_FULL);
        nissanGTR.setMileageLimit(250);
        nissanGTR.setMinRentalDays(1);
        nissanGTR.setDeliveryAvailable(true);
        nissanGTR.setDeliveryFee(new BigDecimal("150000"));
        nissanGTR.setStatus(CarStatus.AVAILABLE);
        nissanGTR.setAverageRating(new BigDecimal("4.8"));
        nissanGTR.setTotalReviews(289);
        nissanGTR.setTotalTrips(412);
        cars.add(nissanGTR);

        // 3. Rolls-Royce
        CarRental rollsRoyce = new CarRental();
        rollsRoyce.setVendorId("vendor-luxury-1");
        rollsRoyce.setLocationId("location-hcm");
        rollsRoyce.setBrand("Rolls-Royce");
        rollsRoyce.setModel("Phantom");
        rollsRoyce.setYear(2024);
        rollsRoyce.setType(CarType.SPORT);
        rollsRoyce.setTransmission(TransmissionType.AUTOMATIC);
        rollsRoyce.setFuelType(FuelType.GASOLINE);
        rollsRoyce.setSeats(4);
        rollsRoyce.setDoors(4);
        rollsRoyce.setLuggage(3);
        rollsRoyce.setColor("Black");
        rollsRoyce.setLicensePlate("51A-11111");
        rollsRoyce.setImages(Arrays.asList(
            new CarRental.CarImage("https://images.unsplash.com/photo-1653047256226-5abbfa82f1d7?w=800", "Luxury front"),
            new CarRental.CarImage("https://images.unsplash.com/photo-1653047256226-5abbfa82f1d7?w=800", "Interior")
        ));
        rollsRoyce.setFeatures(Arrays.asList("Starlight Headliner", "Massage Seats", "Champagne Cooler", "Premium Sound System"));
        rollsRoyce.setPricePerDay(new BigDecimal("2304000")); // 96 USD
        rollsRoyce.setPricePerHour(new BigDecimal("144000"));
        rollsRoyce.setWithDriver(true);
        rollsRoyce.setDriverPrice(new BigDecimal("800000"));
        rollsRoyce.setInsurance(new CarRental.InsuranceInfo("Platinum", "Ultra-premium coverage", new BigDecimal("500000")));
        rollsRoyce.setDeposit(new BigDecimal("100000000"));
        rollsRoyce.setFuelPolicy(FuelPolicy.FULL_TO_FULL);
        rollsRoyce.setMileageLimit(150);
        rollsRoyce.setMinRentalDays(1);
        rollsRoyce.setDeliveryAvailable(true);
        rollsRoyce.setDeliveryFee(new BigDecimal("500000"));
        rollsRoyce.setStatus(CarStatus.AVAILABLE);
        rollsRoyce.setAverageRating(new BigDecimal("4.9"));
        rollsRoyce.setTotalReviews(98);
        rollsRoyce.setTotalTrips(145);
        cars.add(rollsRoyce);

        // ============ SUV CARS ============

        // 4. All New Rush
        CarRental rush = new CarRental();
        rush.setVendorId("vendor-suv-1");
        rush.setLocationId("location-danang");
        rush.setBrand("Toyota");
        rush.setModel("Rush");
        rush.setYear(2024);
        rush.setType(CarType.SUV);
        rush.setTransmission(TransmissionType.AUTOMATIC);
        rush.setFuelType(FuelType.GASOLINE);
        rush.setSeats(7);
        rush.setDoors(5);
        rush.setLuggage(4);
        rush.setColor("White");
        rush.setLicensePlate("43A-22222");
        rush.setImages(Arrays.asList(
            new CarRental.CarImage("https://images.unsplash.com/photo-1698413935252-04ed6377296d?w=800", "SUV exterior"),
            new CarRental.CarImage("https://images.unsplash.com/photo-1698413935252-04ed6377296d?w=800", "Spacious interior")
        ));
        rush.setFeatures(Arrays.asList("7 Seats", "Roof Rack", "Parking Sensors", "Apple CarPlay"));
        rush.setPricePerDay(new BigDecimal("1728000")); // 72 USD
        rush.setPricePerHour(new BigDecimal("100000"));
        rush.setWithDriver(true);
        rush.setDriverPrice(new BigDecimal("400000"));
        rush.setInsurance(new CarRental.InsuranceInfo("Standard", "Basic coverage", new BigDecimal("150000")));
        rush.setDeposit(new BigDecimal("10000000"));
        rush.setFuelPolicy(FuelPolicy.FULL_TO_FULL);
        rush.setMileageLimit(null); // Unlimited
        rush.setMinRentalDays(1);
        rush.setDeliveryAvailable(true);
        rush.setDeliveryFee(new BigDecimal("100000"));
        rush.setStatus(CarStatus.AVAILABLE);
        rush.setAverageRating(new BigDecimal("4.7"));
        rush.setTotalReviews(445);
        rush.setTotalTrips(789);
        cars.add(rush);

        // 5. Honda CR-V
        CarRental crv = new CarRental();
        crv.setVendorId("vendor-suv-2");
        crv.setLocationId("location-hcm");
        crv.setBrand("Honda");
        crv.setModel("CR-V");
        crv.setYear(2024);
        crv.setType(CarType.SUV);
        crv.setTransmission(TransmissionType.AUTOMATIC);
        crv.setFuelType(FuelType.GASOLINE);
        crv.setSeats(7);
        crv.setDoors(5);
        crv.setLuggage(5);
        crv.setColor("Gray");
        crv.setLicensePlate("51B-33333");
        crv.setImages(Arrays.asList(
            new CarRental.CarImage("https://images.unsplash.com/photo-1706752986827-f784d768d4c3?w=800", "Modern SUV"),
            new CarRental.CarImage("https://images.unsplash.com/photo-1706752986827-f784d768d4c3?w=800", "Dashboard")
        ));
        crv.setFeatures(Arrays.asList("Honda Sensing", "Panoramic Sunroof", "LED Headlights", "Leather Seats"));
        crv.setPricePerDay(new BigDecimal("1920000")); // 80 USD
        crv.setPricePerHour(new BigDecimal("120000"));
        crv.setWithDriver(true);
        crv.setDriverPrice(new BigDecimal("450000"));
        crv.setInsurance(new CarRental.InsuranceInfo("Standard", "Standard coverage", new BigDecimal("180000")));
        crv.setDeposit(new BigDecimal("12000000"));
        crv.setFuelPolicy(FuelPolicy.FULL_TO_FULL);
        crv.setMileageLimit(null);
        crv.setMinRentalDays(1);
        crv.setDeliveryAvailable(true);
        crv.setDeliveryFee(new BigDecimal("120000"));
        crv.setStatus(CarStatus.AVAILABLE);
        crv.setAverageRating(new BigDecimal("4.8"));
        crv.setTotalReviews(567);
        crv.setTotalTrips(891);
        cars.add(crv);

        // 6. Daihatsu Terios
        CarRental terios = new CarRental();
        terios.setVendorId("vendor-suv-3");
        terios.setLocationId("location-danang");
        terios.setBrand("Daihatsu");
        terios.setModel("Terios");
        terios.setYear(2023);
        terios.setType(CarType.SUV);
        terios.setTransmission(TransmissionType.MANUAL);
        terios.setFuelType(FuelType.GASOLINE);
        terios.setSeats(7);
        terios.setDoors(5);
        terios.setLuggage(3);
        terios.setColor("Silver");
        terios.setLicensePlate("43B-44444");
        terios.setImages(Arrays.asList(
            new CarRental.CarImage("https://images.unsplash.com/photo-1698413935252-04ed6377296d?w=800", "Compact SUV"),
            new CarRental.CarImage("https://images.unsplash.com/photo-1698413935252-04ed6377296d?w=800", "Interior")
        ));
        terios.setFeatures(Arrays.asList("Roof Rails", "Fog Lights", "Power Windows", "Central Locking"));
        terios.setPricePerDay(new BigDecimal("1824000")); // 76 USD
        terios.setPricePerHour(new BigDecimal("110000"));
        terios.setWithDriver(true);
        terios.setDriverPrice(new BigDecimal("400000"));
        terios.setInsurance(new CarRental.InsuranceInfo("Basic", "Third-party coverage", new BigDecimal("120000")));
        terios.setDeposit(new BigDecimal("8000000"));
        terios.setFuelPolicy(FuelPolicy.FULL_TO_FULL);
        terios.setMileageLimit(null);
        terios.setMinRentalDays(1);
        terios.setDeliveryAvailable(true);
        terios.setDeliveryFee(new BigDecimal("100000"));
        terios.setStatus(CarStatus.AVAILABLE);
        terios.setAverageRating(new BigDecimal("4.6"));
        terios.setTotalReviews(334);
        terios.setTotalTrips(556);
        cars.add(terios);

        // ============ SEDAN CARS ============

        // 7. Toyota Camry
        CarRental camry = new CarRental();
        camry.setVendorId("vendor-sedan-1");
        camry.setLocationId("location-hanoi");
        camry.setBrand("Toyota");
        camry.setModel("Camry");
        camry.setYear(2024);
        camry.setType(CarType.SEDAN);
        camry.setTransmission(TransmissionType.AUTOMATIC);
        camry.setFuelType(FuelType.HYBRID);
        camry.setSeats(5);
        camry.setDoors(4);
        camry.setLuggage(3);
        camry.setColor("Black");
        camry.setLicensePlate("30B-55555");
        camry.setImages(Arrays.asList(
            new CarRental.CarImage("https://images.unsplash.com/photo-1621839673705-6617adf9e890?w=800", "Elegant sedan"),
            new CarRental.CarImage("https://images.unsplash.com/photo-1621839673705-6617adf9e890?w=800", "Premium interior")
        ));
        camry.setFeatures(Arrays.asList("Hybrid Engine", "Adaptive Cruise Control", "JBL Sound System", "Wireless Charging"));
        camry.setPricePerDay(new BigDecimal("1680000")); // 70 USD
        camry.setPricePerHour(new BigDecimal("100000"));
        camry.setWithDriver(true);
        camry.setDriverPrice(new BigDecimal("450000"));
        camry.setInsurance(new CarRental.InsuranceInfo("Standard", "Comprehensive", new BigDecimal("160000")));
        camry.setDeposit(new BigDecimal("10000000"));
        camry.setFuelPolicy(FuelPolicy.FULL_TO_FULL);
        camry.setMileageLimit(null);
        camry.setMinRentalDays(1);
        camry.setDeliveryAvailable(true);
        camry.setDeliveryFee(new BigDecimal("100000"));
        camry.setStatus(CarStatus.AVAILABLE);
        camry.setAverageRating(new BigDecimal("4.8"));
        camry.setTotalReviews(678);
        camry.setTotalTrips(1023);
        cars.add(camry);

        // 8. Honda Accord
        CarRental accord = new CarRental();
        accord.setVendorId("vendor-sedan-2");
        accord.setLocationId("location-hcm");
        accord.setBrand("Honda");
        accord.setModel("Accord");
        accord.setYear(2024);
        accord.setType(CarType.SEDAN);
        accord.setTransmission(TransmissionType.AUTOMATIC);
        accord.setFuelType(FuelType.GASOLINE);
        accord.setSeats(5);
        accord.setDoors(4);
        accord.setLuggage(3);
        accord.setColor("White");
        accord.setLicensePlate("51C-66666");
        accord.setImages(Arrays.asList(
            new CarRental.CarImage("https://images.unsplash.com/photo-1617531653520-bd466ee81a93?w=800", "Sporty sedan"),
            new CarRental.CarImage("https://images.unsplash.com/photo-1617531653520-bd466ee81a93?w=800", "Cockpit")
        ));
        accord.setFeatures(Arrays.asList("Turbo Engine", "Lane Keeping Assist", "Auto Emergency Braking", "Smart Entry"));
        accord.setPricePerDay(new BigDecimal("1680000")); // 70 USD
        accord.setPricePerHour(new BigDecimal("100000"));
        accord.setWithDriver(true);
        accord.setDriverPrice(new BigDecimal("450000"));
        accord.setInsurance(new CarRental.InsuranceInfo("Standard", "Full coverage", new BigDecimal("160000")));
        accord.setDeposit(new BigDecimal("10000000"));
        accord.setFuelPolicy(FuelPolicy.FULL_TO_FULL);
        accord.setMileageLimit(null);
        accord.setMinRentalDays(1);
        accord.setDeliveryAvailable(true);
        accord.setDeliveryFee(new BigDecimal("100000"));
        accord.setStatus(CarStatus.AVAILABLE);
        accord.setAverageRating(new BigDecimal("4.7"));
        accord.setTotalReviews(543);
        accord.setTotalTrips(876);
        cars.add(accord);

        // ============ MPV CARS ============

        // 9. Toyota Innova
        CarRental innova = new CarRental();
        innova.setVendorId("vendor-mpv-1");
        innova.setLocationId("location-danang");
        innova.setBrand("Toyota");
        innova.setModel("Innova Zenix");
        innova.setYear(2024);
        innova.setType(CarType.VAN);
        innova.setTransmission(TransmissionType.AUTOMATIC);
        innova.setFuelType(FuelType.HYBRID);
        innova.setSeats(7);
        innova.setDoors(5);
        innova.setLuggage(5);
        innova.setColor("Gray");
        innova.setLicensePlate("43C-77777");
        innova.setImages(Arrays.asList(
            new CarRental.CarImage("https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800", "Family MPV"),
            new CarRental.CarImage("https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800", "Spacious cabin")
        ));
        innova.setFeatures(Arrays.asList("Captain Seats", "3-Zone AC", "Power Sliding Doors", "360 Camera"));
        innova.setPricePerDay(new BigDecimal("1920000")); // 80 USD
        innova.setPricePerHour(new BigDecimal("120000"));
        innova.setWithDriver(true);
        innova.setDriverPrice(new BigDecimal("500000"));
        innova.setInsurance(new CarRental.InsuranceInfo("Standard", "Family coverage", new BigDecimal("180000")));
        innova.setDeposit(new BigDecimal("12000000"));
        innova.setFuelPolicy(FuelPolicy.FULL_TO_FULL);
        innova.setMileageLimit(null);
        innova.setMinRentalDays(1);
        innova.setDeliveryAvailable(true);
        innova.setDeliveryFee(new BigDecimal("120000"));
        innova.setStatus(CarStatus.AVAILABLE);
        innova.setAverageRating(new BigDecimal("4.8"));
        innova.setTotalReviews(789);
        innova.setTotalTrips(1234);
        cars.add(innova);

        // 10. Kia Carnival
        CarRental carnival = new CarRental();
        carnival.setVendorId("vendor-mpv-2");
        carnival.setLocationId("location-hcm");
        carnival.setBrand("Kia");
        carnival.setModel("Carnival");
        carnival.setYear(2024);
        carnival.setType(CarType.VAN);
        carnival.setTransmission(TransmissionType.AUTOMATIC);
        carnival.setFuelType(FuelType.DIESEL);
        carnival.setSeats(8);
        carnival.setDoors(5);
        carnival.setLuggage(6);
        carnival.setColor("Blue");
        carnival.setLicensePlate("51D-88888");
        carnival.setImages(Arrays.asList(
            new CarRental.CarImage("https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800", "Luxury MPV"),
            new CarRental.CarImage("https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800", "VIP interior")
        ));
        carnival.setFeatures(Arrays.asList("VIP Lounge Seats", "Dual Sunroof", "Premium Audio", "Rear Entertainment"));
        carnival.setPricePerDay(new BigDecimal("2160000")); // 90 USD
        carnival.setPricePerHour(new BigDecimal("135000"));
        carnival.setWithDriver(true);
        carnival.setDriverPrice(new BigDecimal("550000"));
        carnival.setInsurance(new CarRental.InsuranceInfo("Premium", "Full protection", new BigDecimal("220000")));
        carnival.setDeposit(new BigDecimal("15000000"));
        carnival.setFuelPolicy(FuelPolicy.FULL_TO_FULL);
        carnival.setMileageLimit(null);
        carnival.setMinRentalDays(1);
        carnival.setDeliveryAvailable(true);
        carnival.setDeliveryFee(new BigDecimal("150000"));
        carnival.setStatus(CarStatus.AVAILABLE);
        carnival.setAverageRating(new BigDecimal("4.9"));
        carnival.setTotalReviews(432);
        carnival.setTotalTrips(678);
        cars.add(carnival);

        // Save all cars
        carRentalRepository.saveAll(cars);
        
        logger.info("Successfully seeded {} cars to database!", cars.size());
    }
}
