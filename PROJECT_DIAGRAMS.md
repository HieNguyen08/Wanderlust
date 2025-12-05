# Wanderlust Travel Platform - System Diagrams

## Table of Contents
1. [Class Diagram - Core Entities](#class-diagram---core-entities)
2. [Class Diagram - User Management](#class-diagram---user-management)
3. [Class Diagram - Booking System](#class-diagram---booking-system)
4. [Class Diagram - AI Chatbot Module](#class-diagram---ai-chatbot-module)
5. [Sequence Diagram - User Authentication](#sequence-diagram---user-authentication)
6. [Sequence Diagram - Flight Booking](#sequence-diagram---flight-booking)
7. [Sequence Diagram - Hotel Booking](#sequence-diagram---hotel-booking)
8. [Sequence Diagram - AI Chatbot Itinerary Planning](#sequence-diagram---ai-chatbot-itinerary-planning)
9. [Sequence Diagram - POI Data Crawler](#sequence-diagram---poi-data-crawler)
10. [Activity Diagram - Booking Process](#activity-diagram---booking-process)
11. [Activity Diagram - Payment Process](#activity-diagram---payment-process)
12. [Activity Diagram - Itinerary Generation (plusTour Algorithm)](#activity-diagram---itinerary-generation-plustour-algorithm)
13. [Component Diagram - System Architecture](#component-diagram---system-architecture)

---

## Class Diagram - Core Entities

```mermaid
classDiagram
    class User {
        +String userId
        +String firstName
        +String lastName
        +String email
        +String mobile
        +String password
        +Role role
        +Gender gender
        +LocalDate dateOfBirth
        +String address
        +String passportNumber
        +MembershipLevel membershipLevel
        +Integer loyaltyPoints
        +Integer totalTrips
        +LocalDateTime createdAt
        +NotificationSettings notificationSettings
        +Boolean isBlocked
    }

    class Booking {
        +String id
        +String bookingCode
        +String userId
        +BookingType bookingType
        +String flightId
        +String hotelId
        +String roomId
        +String carRentalId
        +String activityId
        +LocalDate startDate
        +LocalDate endDate
        +GuestInfo guestInfo
        +BigDecimal totalPrice
        +BookingStatus status
        +PaymentStatus paymentStatus
        +PaymentMethod paymentMethod
        +LocalDateTime bookingDate
    }

    class Flight {
        +String id
        +String flightNumber
        +String airlineCode
        +String airlineName
        +String departureAirportCode
        +String departureCity
        +String arrivalAirportCode
        +String arrivalCity
        +LocalDateTime departureTime
        +LocalDateTime arrivalTime
        +Integer durationMinutes
        +Boolean isDirect
        +Map~String,CabinClass~ cabinClasses
        +Integer availableSeats
        +FlightStatus status
    }

    class Hotel {
        +String hotelID
        +String vendorId
        +String name
        +HotelType hotel_Type
        +Integer starRating
        +String address
        +BigDecimal latitude
        +BigDecimal longitude
        +List~HotelImage~ images
        +List~String~ amenities
        +HotelPolicies policies
        +BigDecimal averageRating
        +Integer totalReviews
        +BigDecimal lowestPrice
        +HotelStatusType status
    }

    class Room {
        +String roomID
        +String hotelID
        +String roomType
        +Integer capacity
        +Integer quantity
        +BigDecimal pricePerNight
        +List~String~ amenities
        +List~String~ images
        +Boolean isAvailable
    }

    class Payment {
        +String paymentId
        +String bookingId
        +String userId
        +BigDecimal amount
        +String currency
        +PaymentMethod method
        +PaymentStatus status
        +String transactionId
        +LocalDateTime paymentDate
        +Map~String,Object~ metadata
    }

    class Wallet {
        +String walletId
        +String userId
        +BigDecimal balance
        +String currency
        +Boolean isActive
        +LocalDateTime createdAt
        +LocalDateTime lastTransactionAt
    }

    class WalletTransaction {
        +String transactionId
        +String walletId
        +String userId
        +TransactionType type
        +BigDecimal amount
        +BigDecimal balanceBefore
        +BigDecimal balanceAfter
        +String description
        +String referenceId
        +TransactionStatus status
        +LocalDateTime createdAt
    }

    class ReviewComment {
        +String id
        +String userId
        +String targetId
        +ReviewTargetType targetType
        +Integer rating
        +String title
        +String comment
        +List~String~ images
        +Boolean isVerified
        +Integer helpfulCount
        +LocalDateTime createdAt
    }

    class Notification {
        +String id
        +String userId
        +String title
        +String message
        +NotificationType type
        +Boolean isRead
        +Map~String,Object~ data
        +LocalDateTime createdAt
    }

    %% Relationships
    User "1" --> "0..*" Booking : creates
    User "1" --> "0..1" Wallet : owns
    User "1" --> "0..*" ReviewComment : writes
    User "1" --> "0..*" Notification : receives
    Booking "1" --> "0..1" Flight : references
    Booking "1" --> "0..1" Hotel : references
    Booking "1" --> "0..1" Room : references
    Booking "1" --> "1" Payment : has
    Hotel "1" --> "0..*" Room : contains
    Wallet "1" --> "0..*" WalletTransaction : has
```

---

## Class Diagram - User Management

```mermaid
classDiagram
    class User {
        <<Entity>>
        +String userId
        +String email
        +String password
        +Role role
        +MembershipLevel membershipLevel
        +Integer loyaltyPoints
        +String refreshToken
        +LocalDateTime lastLoginAt
    }

    class Role {
        <<Enum>>
        USER
        VENDOR
        ADMIN
    }

    class MembershipLevel {
        <<Enum>>
        BRONZE
        SILVER
        GOLD
        PLATINUM
    }

    class UserService {
        <<Service>>
        -UserRepository userRepository
        -PasswordEncoder passwordEncoder
        +Optional~User~ findById(String id)
        +List~User~ findAll()
        +User save(User user)
        +void deleteById(String id)
        +Optional~User~ findByEmail(String email)
        +User updateUserProfile(String userId, UserProfileDTO dto)
    }

    class AuthController {
        <<Controller>>
        -AuthenticationManager authManager
        -JwtService jwtService
        -UserService userService
        +ResponseEntity login(LoginRequest req)
        +ResponseEntity register(RegisterRequest req)
        +ResponseEntity refreshToken(String token)
        +ResponseEntity logout(String token)
    }

    class JwtService {
        <<Service>>
        -String secretKey
        -long expirationTime
        +String generateToken(UserDetails user)
        +String extractUsername(String token)
        +Boolean validateToken(String token)
        +Claims extractClaims(String token)
    }

    class CustomUserDetailsService {
        <<Service>>
        -UserRepository userRepository
        +UserDetails loadUserByUsername(String email)
    }

    class SecurityConfig {
        <<Configuration>>
        -JwtAuthenticationFilter jwtFilter
        -CustomUserDetailsService userDetailsService
        +SecurityFilterChain filterChain(HttpSecurity http)
        +PasswordEncoder passwordEncoder()
        +AuthenticationManager authManager()
    }

    class UserRepository {
        <<Interface>>
        +Optional~User~ findByEmail(String email)
        +List~User~ findByRole(Role role)
        +Boolean existsByEmail(String email)
    }

    %% Relationships
    User --> Role : has
    User --> MembershipLevel : has
    UserService --> UserRepository : uses
    UserService --> User : manages
    AuthController --> UserService : uses
    AuthController --> JwtService : uses
    JwtService --> User : generates token for
    CustomUserDetailsService --> UserRepository : uses
    SecurityConfig --> JwtService : configures
    SecurityConfig --> CustomUserDetailsService : uses
```

---

## Class Diagram - Booking System

```mermaid
classDiagram
    class Booking {
        <<Entity>>
        +String id
        +String bookingCode
        +String userId
        +BookingType bookingType
        +String flightId
        +String hotelId
        +String roomId
        +BigDecimal totalPrice
        +BookingStatus status
        +PaymentStatus paymentStatus
    }

    class BookingType {
        <<Enum>>
        FLIGHT
        HOTEL
        CAR_RENTAL
        ACTIVITY
        PACKAGE
    }

    class BookingStatus {
        <<Enum>>
        PENDING
        CONFIRMED
        CANCELLED
        COMPLETED
        REFUNDED
    }

    class PaymentStatus {
        <<Enum>>
        PENDING
        PAID
        FAILED
        REFUNDED
    }

    class BookingService {
        <<Service>>
        -BookingRepository bookingRepository
        -FlightService flightService
        -HotelService hotelService
        -PaymentService paymentService
        -NotificationService notificationService
        +Booking createBooking(BookingRequest req)
        +Booking confirmBooking(String bookingId)
        +void cancelBooking(String bookingId)
        +List~Booking~ getUserBookings(String userId)
        +Booking getBookingByCode(String code)
    }

    class BookingController {
        <<Controller>>
        -BookingService bookingService
        +ResponseEntity createBooking(BookingRequest)
        +ResponseEntity getBooking(String id)
        +ResponseEntity getUserBookings(String userId)
        +ResponseEntity cancelBooking(String id)
        +ResponseEntity confirmBooking(String id)
    }

    class PaymentService {
        <<Service>>
        -PaymentRepository paymentRepository
        -WalletService walletService
        -VNPayService vnpayService
        +Payment processPayment(PaymentRequest req)
        +Payment refundPayment(String paymentId)
        +PaymentStatus checkPaymentStatus(String txId)
    }

    class Payment {
        <<Entity>>
        +String paymentId
        +String bookingId
        +String userId
        +BigDecimal amount
        +PaymentMethod method
        +PaymentStatus status
        +String transactionId
    }

    class PaymentMethod {
        <<Enum>>
        WALLET
        VNPAY
        CREDIT_CARD
        BANK_TRANSFER
    }

    class NotificationService {
        <<Service>>
        -NotificationRepository notificationRepository
        +void sendBookingConfirmation(Booking)
        +void sendCancellationNotice(Booking)
        +void sendPaymentReminder(Booking)
    }

    class BookingRepository {
        <<Interface>>
        +Optional~Booking~ findByBookingCode(String)
        +List~Booking~ findByUserId(String)
        +List~Booking~ findByStatus(BookingStatus)
    }

    %% Relationships
    Booking --> BookingType : has
    Booking --> BookingStatus : has
    Booking --> PaymentStatus : has
    Booking "1" --> "1" Payment : requires
    BookingService --> BookingRepository : uses
    BookingService --> FlightService : uses
    BookingService --> HotelService : uses
    BookingService --> PaymentService : uses
    BookingService --> NotificationService : uses
    BookingController --> BookingService : uses
    PaymentService --> Payment : creates
    Payment --> PaymentMethod : has
```

---

## Class Diagram - AI Chatbot Module

```mermaid
classDiagram
    class ChatbotController {
        <<Controller>>
        -ChatbotService chatbotService
        +ResponseEntity chat(ChatRequest)
        +ResponseEntity clearConversation(String id)
        +ResponseEntity healthCheck()
    }

    class ChatbotService {
        <<Service>>
        -OpenAiService openAiService
        -FlightRepository flightRepository
        -HotelRepository hotelRepository
        -ItineraryGenerationService itineraryService
        -Map~String,List~ conversationHistory
        +ChatResponse processMessage(ChatRequest)
        -ExtractedInfo extractTravelInfo(String query)
        -List~Flight~ searchFlights(ExtractedInfo)
        -List~Hotel~ searchHotels(ExtractedInfo)
        -String generateResponse(String, ExtractedInfo, List)
    }

    class ItineraryGenerationService {
        <<Service>>
        -PointOfInterestRepository poiRepository
        -ItineraryRepository itineraryRepository
        +Itinerary generateItinerary(String userId, String dest, LocalDateTime start, LocalDateTime end, UserPreferences)
        -List~ScoredPOI~ scorePOIs(List~POI~, UserPreferences)
        -DaySchedule planDaySchedule(List~ScoredPOI~, UserPreferences)
        -double calculateUserInterest(POI, UserPreferences)
    }

    class POIDataCrawlerService {
        <<Service>>
        -RestTemplate restTemplate
        -PointOfInterestRepository poiRepository
        +void scheduledCrawlAllDestinations()
        +void crawlAllDestinations()
        -List~POI~ crawlFromOpenTripMap(String city)
        -List~POI~ crawlFromGooglePlaces(String city)
        -List~POI~ getFallbackPOIs(String city)
        -void savePOIsToDatabase(List~POI~)
    }

    class POIDataCrawlerController {
        <<Controller>>
        -POIDataCrawlerService crawlerService
        +ResponseEntity crawlAllCities()
        +ResponseEntity crawlSpecificCity(String city)
        +ResponseEntity getCrawlerStatus()
    }

    class PointOfInterest {
        <<Entity>>
        +String id
        +String name
        +String location
        +String category
        +Double popularity
        +Integer avgVisitDuration
        +Map~String,Double~ categoryScores
        +Double latitude
        +Double longitude
        +String description
    }

    class Itinerary {
        <<Entity>>
        +String id
        +String userId
        +String destination
        +Integer durationDays
        +UserPreferences preferences
        +List~DaySchedule~ schedule
        +Double totalProfit
        +Double totalDistance
        +LocalDateTime createdAt
    }

    class UserPreferences {
        +Double culturalInterest
        +Double natureInterest
        +Double foodInterest
        +Double shoppingInterest
        +Double adventureInterest
        +String budgetLevel
        +String pace
    }

    class DaySchedule {
        +Integer dayNumber
        +List~ScheduledVisit~ visits
        +Integer totalMinutes
        +Double totalDistance
    }

    class ScheduledVisit {
        +PointOfInterest poi
        +String startTime
        +String endTime
        +Integer visitDuration
        +Integer travelTimeFromPrevious
        +Double distanceFromPrevious
        +Double profitScore
    }

    class ChatRequest {
        +String message
        +String conversationId
    }

    class ChatResponse {
        +String message
        +String conversationId
        +ExtractedInfo extractedInfo
        +List~Object~ suggestions
    }

    class ExtractedInfo {
        +String requestType
        +String departureCity
        +String destinationCity
        +String dateTime
    }

    %% Relationships
    ChatbotController --> ChatbotService : uses
    ChatbotService --> ItineraryGenerationService : uses
    ChatbotService --> ChatRequest : receives
    ChatbotService --> ChatResponse : returns
    ChatbotService --> ExtractedInfo : extracts
    ItineraryGenerationService --> PointOfInterest : uses
    ItineraryGenerationService --> Itinerary : creates
    POIDataCrawlerController --> POIDataCrawlerService : uses
    POIDataCrawlerService --> PointOfInterest : crawls
    Itinerary --> UserPreferences : has
    Itinerary "1" --> "*" DaySchedule : contains
    DaySchedule "1" --> "*" ScheduledVisit : contains
    ScheduledVisit --> PointOfInterest : references
```

---

## Sequence Diagram - User Authentication

```mermaid
sequenceDiagram
    actor User
    participant Frontend
    participant AuthController
    participant AuthManager
    participant UserDetailsService
    participant UserRepository
    participant JwtService
    participant Database

    User->>Frontend: Enter email & password
    Frontend->>AuthController: POST /api/auth/login
    AuthController->>AuthManager: authenticate(credentials)
    AuthManager->>UserDetailsService: loadUserByUsername(email)
    UserDetailsService->>UserRepository: findByEmail(email)
    UserRepository->>Database: Query users collection
    Database-->>UserRepository: User document
    UserRepository-->>UserDetailsService: User
    UserDetailsService-->>AuthManager: UserDetails
    AuthManager->>AuthManager: Verify password
    
    alt Authentication Success
        AuthManager-->>AuthController: Authentication object
        AuthController->>JwtService: generateToken(user)
        JwtService-->>AuthController: accessToken
        AuthController->>JwtService: generateRefreshToken(user)
        JwtService-->>AuthController: refreshToken
        AuthController->>UserRepository: Update lastLoginAt
        AuthController-->>Frontend: 200 OK {accessToken, refreshToken, user}
        Frontend-->>User: Login successful
    else Authentication Failed
        AuthManager-->>AuthController: AuthenticationException
        AuthController-->>Frontend: 401 Unauthorized
        Frontend-->>User: Invalid credentials
    end
```

---

## Sequence Diagram - Flight Booking

```mermaid
sequenceDiagram
    actor User
    participant Frontend
    participant BookingController
    participant BookingService
    participant FlightService
    participant FlightRepository
    participant PaymentService
    participant WalletService
    participant NotificationService
    participant Database

    User->>Frontend: Select flight & fill info
    Frontend->>BookingController: POST /api/bookings
    BookingController->>BookingService: createBooking(request)
    
    %% Validate flight
    BookingService->>FlightService: validateAvailability(flightId)
    FlightService->>FlightRepository: findById(flightId)
    FlightRepository->>Database: Query flights collection
    Database-->>FlightRepository: Flight document
    FlightRepository-->>FlightService: Flight
    FlightService->>FlightService: Check available seats
    
    alt Flight Available
        FlightService-->>BookingService: Available
        
        %% Create booking
        BookingService->>BookingService: Generate bookingCode
        BookingService->>BookingService: Calculate totalPrice
        BookingService->>Database: Insert booking document
        Database-->>BookingService: Booking created
        
        %% Process payment
        BookingService->>PaymentService: processPayment(booking)
        PaymentService->>WalletService: deductBalance(userId, amount)
        WalletService->>Database: Update wallet balance
        WalletService->>Database: Insert transaction record
        Database-->>WalletService: Success
        WalletService-->>PaymentService: Payment success
        PaymentService->>Database: Insert payment record
        PaymentService-->>BookingService: Payment completed
        
        %% Update booking & flight
        BookingService->>Database: Update booking status = CONFIRMED
        BookingService->>FlightService: decreaseAvailableSeats(flightId)
        FlightService->>Database: Update flight availableSeats
        
        %% Send notification
        BookingService->>NotificationService: sendBookingConfirmation(booking)
        NotificationService->>Database: Insert notification
        NotificationService-->>User: Email/SMS notification
        
        BookingService-->>BookingController: Booking confirmed
        BookingController-->>Frontend: 200 OK {booking}
        Frontend-->>User: Booking successful
        
    else Flight Not Available
        FlightService-->>BookingService: Not available
        BookingService-->>BookingController: FlightUnavailableException
        BookingController-->>Frontend: 400 Bad Request
        Frontend-->>User: Flight not available
    end
```

---

## Sequence Diagram - Hotel Booking

```mermaid
sequenceDiagram
    actor User
    participant Frontend
    participant BookingController
    participant BookingService
    participant HotelService
    participant RoomService
    participant HotelRepository
    participant RoomRepository
    participant PaymentService
    participant NotificationService
    participant Database

    User->>Frontend: Search hotels in city
    Frontend->>HotelService: GET /api/hotels?city=Bangkok
    HotelService->>HotelRepository: findByCity("Bangkok")
    HotelRepository->>Database: Query hotels
    Database-->>HotelRepository: List of hotels
    HotelRepository-->>HotelService: Hotels
    HotelService-->>Frontend: Hotel list with prices
    Frontend-->>User: Display hotels

    User->>Frontend: Select hotel & room
    Frontend->>RoomService: GET /api/hotels/{id}/rooms
    RoomService->>RoomRepository: findByHotelId(hotelId)
    RoomRepository->>Database: Query rooms
    Database-->>RoomRepository: Available rooms
    RoomRepository-->>RoomService: Rooms
    RoomService-->>Frontend: Room list
    Frontend-->>User: Display rooms

    User->>Frontend: Book room with dates
    Frontend->>BookingController: POST /api/bookings
    BookingController->>BookingService: createBooking(request)
    
    %% Validate room availability
    BookingService->>RoomService: checkAvailability(roomId, startDate, endDate)
    RoomService->>Database: Check existing bookings
    Database-->>RoomService: No conflicts
    RoomService-->>BookingService: Room available
    
    %% Create booking
    BookingService->>BookingService: Calculate totalPrice (nights × price)
    BookingService->>Database: Insert booking
    
    %% Process payment
    BookingService->>PaymentService: processPayment(booking)
    PaymentService->>Database: Insert payment & update wallet
    PaymentService-->>BookingService: Payment success
    
    %% Update status
    BookingService->>Database: Update booking status = CONFIRMED
    BookingService->>RoomService: markRoomBooked(roomId, dates)
    RoomService->>Database: Update room availability
    
    %% Notify
    BookingService->>NotificationService: sendBookingConfirmation(booking)
    NotificationService-->>User: Confirmation email
    
    BookingService-->>BookingController: Booking
    BookingController-->>Frontend: 200 OK
    Frontend-->>User: Booking confirmed
```

---

## Sequence Diagram - AI Chatbot Itinerary Planning

```mermaid
sequenceDiagram
    actor User
    participant Frontend
    participant ChatbotController
    participant ChatbotService
    participant OpenAI
    participant ItineraryService
    participant POIRepository
    participant ItineraryRepository
    participant Database

    User->>Frontend: "Plan a 3-day trip to Singapore"
    Frontend->>ChatbotController: POST /api/chatbot/chat
    ChatbotController->>ChatbotService: processMessage(request)
    
    %% Step 1: Extract info with NLP
    ChatbotService->>OpenAI: extractTravelInfo(message)
    Note over ChatbotService,OpenAI: GPT-3.5 extracts:<br/>type=itinerary<br/>destination=Singapore<br/>duration=3 days
    OpenAI-->>ChatbotService: ExtractedInfo
    
    %% Step 2: Generate itinerary with plusTour
    ChatbotService->>ChatbotService: parseStartDate() & parseDuration()
    ChatbotService->>ItineraryService: generateItinerary(userId, "Singapore", dates, preferences)
    
    ItineraryService->>POIRepository: findByLocation("Singapore")
    POIRepository->>Database: Query points_of_interest
    Database-->>POIRepository: List of POIs (30+)
    POIRepository-->>ItineraryService: POIs
    
    %% plusTour Algorithm
    ItineraryService->>ItineraryService: scorePOIs(pois, preferences)
    Note over ItineraryService: Calculate profit score:<br/>profit = 0.6×userInterest + 0.4×popularity
    
    ItineraryService->>ItineraryService: planDaySchedule(scoredPOIs, day1)
    Note over ItineraryService: Apply constraints:<br/>- 480 min/day<br/>- Budget level<br/>- Max 5 POIs/day
    
    ItineraryService->>ItineraryService: planDaySchedule(scoredPOIs, day2)
    ItineraryService->>ItineraryService: planDaySchedule(scoredPOIs, day3)
    
    ItineraryService->>ItineraryRepository: save(itinerary)
    ItineraryRepository->>Database: Insert itinerary document
    Database-->>ItineraryRepository: Saved
    ItineraryRepository-->>ItineraryService: Itinerary with ID
    
    %% Step 3: Format with GPT
    ItineraryService-->>ChatbotService: Optimized Itinerary
    ChatbotService->>OpenAI: formatItineraryWithAI(itinerary)
    Note over ChatbotService,OpenAI: GPT converts structured data<br/>to natural language
    OpenAI-->>ChatbotService: Natural language response
    
    ChatbotService->>ChatbotService: Add to conversation history
    ChatbotService-->>ChatbotController: ChatResponse
    ChatbotController-->>Frontend: 200 OK {message, itinerary}
    Frontend-->>User: Display itinerary with timeline
```

---

## Sequence Diagram - POI Data Crawler

```mermaid
sequenceDiagram
    participant Scheduler
    participant POIDataCrawlerService
    participant RestTemplate
    participant OpenTripMapAPI
    participant POIRepository
    participant Database

    Note over Scheduler: Runs every 12 hours<br/>Cron: 0 0 0/12 * * *
    
    Scheduler->>POIDataCrawlerService: scheduledCrawlAllDestinations()
    POIDataCrawlerService->>POIDataCrawlerService: crawlAllDestinations()
    
    loop For each city [Hanoi, Bangkok, Singapore, Tokyo, Seoul, Bali]
        POIDataCrawlerService->>POIDataCrawlerService: crawlFromOpenTripMap(city)
        POIDataCrawlerService->>RestTemplate: GET opentripmap API
        RestTemplate->>OpenTripMapAPI: Request POIs for city
        
        alt API Success
            OpenTripMapAPI-->>RestTemplate: JSON response
            RestTemplate-->>POIDataCrawlerService: POI data
            POIDataCrawlerService->>POIDataCrawlerService: Parse JSON
            POIDataCrawlerService->>POIDataCrawlerService: Map to PointOfInterest entities
        else API Failed
            OpenTripMapAPI-->>RestTemplate: Error
            RestTemplate-->>POIDataCrawlerService: Exception
            POIDataCrawlerService->>POIDataCrawlerService: getFallbackPOIs(city)
            Note over POIDataCrawlerService: Use hardcoded<br/>fallback data (5 POIs/city)
        end
        
        POIDataCrawlerService->>POIDataCrawlerService: savePOIsToDatabase(pois)
        
        loop For each POI
            POIDataCrawlerService->>POIRepository: findByNameAndLocation(name, location)
            POIRepository->>Database: Query existing POI
            
            alt POI Exists
                Database-->>POIRepository: Existing POI
                POIRepository-->>POIDataCrawlerService: POI found
                POIDataCrawlerService->>POIRepository: update(poi)
                Note over POIDataCrawlerService: Update existing record
            else POI New
                Database-->>POIRepository: Not found
                POIRepository-->>POIDataCrawlerService: Empty
                POIDataCrawlerService->>POIRepository: insert(poi)
                Note over POIDataCrawlerService: Insert new record
            end
            
            POIRepository->>Database: Upsert operation
            Database-->>POIRepository: Success
        end
    end
    
    POIDataCrawlerService-->>Scheduler: Crawl completed
```

---

## Activity Diagram - Booking Process

```mermaid
flowchart TD
    Start([User Starts Booking]) --> SearchService{Select Service Type}
    
    SearchService -->|Flight| SearchFlight[Search Flights]
    SearchService -->|Hotel| SearchHotel[Search Hotels]
    SearchService -->|Car Rental| SearchCar[Search Cars]
    SearchService -->|Activity| SearchActivity[Search Activities]
    
    SearchFlight --> SelectFlight[Select Flight]
    SearchHotel --> SelectRoom[Select Hotel & Room]
    SearchCar --> SelectCarOption[Select Car]
    SearchActivity --> SelectActivityOption[Select Activity]
    
    SelectFlight --> EnterGuest[Enter Guest Information]
    SelectRoom --> EnterGuest
    SelectCarOption --> EnterGuest
    SelectActivityOption --> EnterGuest
    
    EnterGuest --> ReviewBooking[Review Booking Details]
    ReviewBooking --> CheckPrice{Verify Total Price}
    
    CheckPrice -->|Correct| ApplyVoucher{Apply Voucher?}
    CheckPrice -->|Incorrect| RecalculatePrice[Recalculate Price]
    RecalculatePrice --> ReviewBooking
    
    ApplyVoucher -->|Yes| ValidateVoucher{Voucher Valid?}
    ApplyVoucher -->|No| SelectPayment[Select Payment Method]
    
    ValidateVoucher -->|Valid| ApplyDiscount[Apply Discount]
    ValidateVoucher -->|Invalid| ShowError[Show Error Message]
    ShowError --> ApplyVoucher
    
    ApplyDiscount --> SelectPayment
    SelectPayment --> PaymentMethod{Payment Method}
    
    PaymentMethod -->|Wallet| CheckWallet{Sufficient Balance?}
    PaymentMethod -->|VNPay| ProcessVNPay[Process VNPay]
    PaymentMethod -->|Credit Card| ProcessCard[Process Credit Card]
    
    CheckWallet -->|Yes| DeductWallet[Deduct from Wallet]
    CheckWallet -->|No| InsufficientFunds[Show Insufficient Funds]
    InsufficientFunds --> SelectPayment
    
    DeductWallet --> CreateBooking[Create Booking Record]
    ProcessVNPay --> VerifyPayment{Payment Success?}
    ProcessCard --> VerifyPayment
    
    VerifyPayment -->|Success| CreateBooking
    VerifyPayment -->|Failed| PaymentFailed[Payment Failed]
    PaymentFailed --> SelectPayment
    
    CreateBooking --> UpdateInventory{Update Service Inventory}
    UpdateInventory -->|Flight| UpdateSeats[Decrease Available Seats]
    UpdateInventory -->|Hotel| UpdateRoomAvail[Mark Room as Booked]
    UpdateInventory -->|Car| UpdateCarAvail[Reserve Car]
    UpdateInventory -->|Activity| UpdateActivitySlots[Reserve Activity Slot]
    
    UpdateSeats --> ConfirmBooking[Confirm Booking Status]
    UpdateRoomAvail --> ConfirmBooking
    UpdateCarAvail --> ConfirmBooking
    UpdateActivitySlots --> ConfirmBooking
    
    ConfirmBooking --> SendNotification[Send Confirmation Notification]
    SendNotification --> UpdateLoyalty[Update Loyalty Points]
    UpdateLoyalty --> SendEmail[Send Confirmation Email]
    SendEmail --> End([Booking Complete])
    
    style Start fill:#90EE90
    style End fill:#FFB6C1
    style PaymentFailed fill:#FF6B6B
    style InsufficientFunds fill:#FF6B6B
    style ShowError fill:#FFD700
```

---

## Activity Diagram - Payment Process

```mermaid
flowchart TD
    Start([Payment Request Received]) --> ValidateRequest{Validate Request}
    
    ValidateRequest -->|Invalid| ReturnError[Return Validation Error]
    ValidateRequest -->|Valid| CheckMethod{Payment Method?}
    
    ReturnError --> End([End])
    
    CheckMethod -->|WALLET| CheckWalletBalance{Check Wallet Balance}
    CheckMethod -->|VNPAY| InitVNPay[Initialize VNPay Transaction]
    CheckMethod -->|CREDIT_CARD| InitCard[Initialize Card Processing]
    CheckMethod -->|BANK_TRANSFER| InitBankTransfer[Initialize Bank Transfer]
    
    %% Wallet Payment Flow
    CheckWalletBalance -->|Sufficient| CreateWalletTx[Create Wallet Transaction]
    CheckWalletBalance -->|Insufficient| InsufficientBalance[Return Insufficient Balance Error]
    InsufficientBalance --> End
    
    CreateWalletTx --> DeductBalance[Deduct Balance from Wallet]
    DeductBalance --> RecordTransaction[Record Transaction in DB]
    RecordTransaction --> UpdateWalletBalance[Update Wallet Balance]
    UpdateWalletBalance --> CreatePaymentRecord[Create Payment Record]
    
    %% VNPay Flow
    InitVNPay --> RedirectVNPay[Redirect User to VNPay]
    RedirectVNPay --> WaitVNPayCallback[Wait for VNPay Callback]
    WaitVNPayCallback --> VerifyVNPaySign{Verify Signature?}
    
    VerifyVNPaySign -->|Valid| CheckVNPayStatus{Payment Status?}
    VerifyVNPaySign -->|Invalid| VNPayFraud[Mark as Fraud Attempt]
    VNPayFraud --> PaymentFailed
    
    CheckVNPayStatus -->|Success| CreatePaymentRecord
    CheckVNPayStatus -->|Failed| PaymentFailed[Update Payment Status = FAILED]
    
    %% Credit Card Flow
    InitCard --> ValidateCard{Validate Card Details}
    ValidateCard -->|Valid| ChargeCard[Charge Card via Gateway]
    ValidateCard -->|Invalid| CardError[Return Card Validation Error]
    CardError --> End
    
    ChargeCard --> CheckCardResponse{Gateway Response?}
    CheckCardResponse -->|Success| CreatePaymentRecord
    CheckCardResponse -->|Failed| PaymentFailed
    
    %% Bank Transfer Flow
    InitBankTransfer --> GenerateQR[Generate QR Code]
    GenerateQR --> DisplayBankDetails[Display Bank Details]
    DisplayBankDetails --> MarkPending[Mark Payment as PENDING]
    MarkPending --> WaitVerification[Wait for Manual Verification]
    WaitVerification --> AdminVerifies{Admin Verifies?}
    
    AdminVerifies -->|Confirmed| CreatePaymentRecord
    AdminVerifies -->|Rejected| PaymentFailed
    
    %% Common Flow
    CreatePaymentRecord --> UpdateBookingStatus[Update Booking Status = CONFIRMED]
    UpdateBookingStatus --> SendNotification[Send Payment Success Notification]
    SendNotification --> TriggerWebhook{Webhook Configured?}
    
    TriggerWebhook -->|Yes| SendWebhook[Send Webhook to Partner]
    TriggerWebhook -->|No| LogEvent[Log Payment Event]
    
    SendWebhook --> LogEvent
    LogEvent --> PaymentSuccess([Payment Success])
    
    PaymentFailed --> SendFailureNotif[Send Payment Failed Notification]
    SendFailureNotif --> RollbackBooking[Rollback Booking Status]
    RollbackBooking --> End
    
    style Start fill:#90EE90
    style PaymentSuccess fill:#90EE90
    style End fill:#FFB6C1
    style PaymentFailed fill:#FF6B6B
    style InsufficientBalance fill:#FF6B6B
    style VNPayFraud fill:#FF0000
    style CardError fill:#FFD700
```

---

## Activity Diagram - Itinerary Generation (plusTour Algorithm)

```mermaid
flowchart TD
    Start([User Requests Itinerary]) --> ExtractInfo[Extract Info from User Query]
    ExtractInfo --> ParseParams{Parse Parameters}
    
    ParseParams -->|Destination| GetDestination[Destination City]
    ParseParams -->|Duration| GetDuration[Trip Duration Days]
    ParseParams -->|Dates| GetDates[Start & End Dates]
    ParseParams -->|Preferences| GetPreferences[User Preferences]
    
    GetDestination --> FetchPOIs[Fetch POIs from Database]
    GetDuration --> FetchPOIs
    GetDates --> FetchPOIs
    GetPreferences --> FetchPOIs
    
    FetchPOIs --> CheckPOIs{POIs Available?}
    
    CheckPOIs -->|No| TriggerCrawler[Trigger POI Crawler]
    TriggerCrawler --> WaitCrawl[Wait for Crawl Completion]
    WaitCrawl --> FetchPOIs
    
    CheckPOIs -->|Yes| ScorePOIs[Score POIs with plusTour Formula]
    
    ScorePOIs --> CalculateUserInterest["Calculate User Interest<br/>= Σ(preference × category score)"]
    CalculateUserInterest --> CalculateProfit["Calculate Profit Score<br/>profit = 0.6×interest + 0.4×popularity"]
    
    CalculateProfit --> SortPOIs[Sort POIs by Profit Score DESC]
    SortPOIs --> InitSchedule[Initialize Empty Schedule]
    
    InitSchedule --> LoopDays{For Each Day}
    LoopDays -->|Day N| InitDay["Initialize Day Schedule<br/>availableTime = 480 min"]
    
    InitDay --> LoopPOIs{For Each POI}
    LoopPOIs -->|Next POI| CheckConstraints{Check Constraints}
    
    CheckConstraints -->|Budget| CheckBudget{Fits Budget?}
    CheckBudget -->|No| SkipPOI[Skip POI]
    CheckBudget -->|Yes| CheckTime{Fits Time Budget?}
    
    CheckTime -->|No| SkipPOI
    CheckTime -->|Yes| CheckMaxPOIs{Max POIs Reached?}
    
    CheckMaxPOIs -->|Yes| SkipPOI
    CheckMaxPOIs -->|No| AddPOI[Add POI to Day Schedule]
    
    AddPOI --> CalculateTimes["Calculate:<br/>- Visit duration<br/>- Travel time<br/>- Start/End times"]
    CalculateTimes --> UpdateAvailableTime[Update Available Time]
    UpdateAvailableTime --> LoopPOIs
    
    SkipPOI --> LoopPOIs
    
    LoopPOIs -->|All POIs Processed| DayComplete[Day Schedule Complete]
    DayComplete --> AddToSchedule[Add Day to Itinerary]
    AddToSchedule --> LoopDays
    
    LoopDays -->|All Days Complete| CalculateMetrics[Calculate Total Metrics]
    CalculateMetrics --> CalculateTotalProfit["Total Profit = Σ(profit scores)"]
    CalculateTotalProfit --> CalculateTotalDistance["Total Distance = Σ(distances)"]
    CalculateTotalDistance --> CalculateTotalTime["Total Time = Σ(durations)"]
    
    CalculateTotalTime --> CreateItinerary[Create Itinerary Object]
    CreateItinerary --> SaveToDB[Save to itineraries Collection]
    SaveToDB --> FormatWithGPT[Format with GPT for Natural Language]
    
    FormatWithGPT --> ReturnItinerary[Return Optimized Itinerary]
    ReturnItinerary --> End([Itinerary Generated])
    
    style Start fill:#90EE90
    style End fill:#90EE90
    style ScorePOIs fill:#87CEEB
    style CalculateProfit fill:#FFD700
    style AddPOI fill:#98FB98
    style SkipPOI fill:#FFA07A
```

---

## Component Diagram - System Architecture

```mermaid
graph TB
    subgraph "Frontend Layer (React + TypeScript + Vite)"
        UI[User Interface Components]
        API_Client[API Client - Axios]
        State[State Management]
        Router[React Router]
        I18N[i18n - Multilingual]
    end
    
    subgraph "API Gateway Layer"
        Gateway[Spring Boot API Gateway<br/>Port 8080]
        Security[Spring Security + JWT]
        CORS[CORS Configuration]
    end
    
    subgraph "Controller Layer"
        AuthCtrl[AuthController]
        BookingCtrl[BookingController]
        FlightCtrl[FlightController]
        HotelCtrl[HotelController]
        ChatbotCtrl[ChatbotController]
        PaymentCtrl[PaymentController]
        UserCtrl[UserController]
        AdminCtrl[Admin Controllers]
    end
    
    subgraph "Service Layer (Business Logic)"
        AuthSvc[Authentication Service]
        BookingSvc[Booking Service]
        FlightSvc[Flight Service]
        HotelSvc[Hotel Service]
        ChatbotSvc[Chatbot Service]
        ItinerarySvc[Itinerary Generation Service]
        CrawlerSvc[POI Data Crawler Service]
        PaymentSvc[Payment Service]
        WalletSvc[Wallet Service]
        NotificationSvc[Notification Service]
        UserSvc[User Service]
    end
    
    subgraph "Repository Layer"
        UserRepo[User Repository]
        BookingRepo[Booking Repository]
        FlightRepo[Flight Repository]
        HotelRepo[Hotel Repository]
        POIRepo[POI Repository]
        ItineraryRepo[Itinerary Repository]
        PaymentRepo[Payment Repository]
        WalletRepo[Wallet Repository]
    end
    
    subgraph "Database Layer"
        MongoDB[(MongoDB<br/>localhost:27017)]
    end
    
    subgraph "External Services"
        OpenAI[OpenAI API<br/>GPT-3.5-turbo]
        OpenTripMap[OpenTripMap API<br/>POI Data]
        GooglePlaces[Google Places API<br/>Optional]
        VNPay[VNPay Gateway<br/>Payment]
        EmailSvc[Email Service<br/>SMTP]
    end
    
    subgraph "Scheduled Tasks"
        Scheduler[Spring @Scheduled]
        CrawlerJob["POI Crawler Job<br/>(Every 12 hours)"]
    end
    
    %% Frontend Connections
    UI --> API_Client
    API_Client --> Gateway
    State --> UI
    Router --> UI
    I18N --> UI
    
    %% Gateway Connections
    Gateway --> Security
    Gateway --> CORS
    Security --> AuthCtrl
    Security --> BookingCtrl
    Security --> FlightCtrl
    Security --> HotelCtrl
    Security --> ChatbotCtrl
    Security --> PaymentCtrl
    Security --> UserCtrl
    Security --> AdminCtrl
    
    %% Controller to Service Connections
    AuthCtrl --> AuthSvc
    BookingCtrl --> BookingSvc
    FlightCtrl --> FlightSvc
    HotelCtrl --> HotelSvc
    ChatbotCtrl --> ChatbotSvc
    PaymentCtrl --> PaymentSvc
    UserCtrl --> UserSvc
    AdminCtrl --> BookingSvc
    AdminCtrl --> UserSvc
    
    %% Service Layer Connections
    AuthSvc --> UserRepo
    BookingSvc --> BookingRepo
    BookingSvc --> FlightSvc
    BookingSvc --> HotelSvc
    BookingSvc --> PaymentSvc
    BookingSvc --> NotificationSvc
    FlightSvc --> FlightRepo
    HotelSvc --> HotelRepo
    ChatbotSvc --> FlightRepo
    ChatbotSvc --> HotelRepo
    ChatbotSvc --> ItinerarySvc
    ChatbotSvc --> OpenAI
    ItinerarySvc --> POIRepo
    ItinerarySvc --> ItineraryRepo
    CrawlerSvc --> POIRepo
    CrawlerSvc --> OpenTripMap
    CrawlerSvc --> GooglePlaces
    PaymentSvc --> PaymentRepo
    PaymentSvc --> WalletSvc
    PaymentSvc --> VNPay
    WalletSvc --> WalletRepo
    NotificationSvc --> EmailSvc
    UserSvc --> UserRepo
    
    %% Repository to Database
    UserRepo --> MongoDB
    BookingRepo --> MongoDB
    FlightRepo --> MongoDB
    HotelRepo --> MongoDB
    POIRepo --> MongoDB
    ItineraryRepo --> MongoDB
    PaymentRepo --> MongoDB
    WalletRepo --> MongoDB
    
    %% Scheduled Tasks
    Scheduler --> CrawlerJob
    CrawlerJob --> CrawlerSvc
    
    %% Styling
    classDef frontend fill:#61DAFB,stroke:#333,stroke-width:2px,color:#000
    classDef backend fill:#6DB33F,stroke:#333,stroke-width:2px,color:#000
    classDef database fill:#4DB33D,stroke:#333,stroke-width:2px,color:#fff
    classDef external fill:#FF6B6B,stroke:#333,stroke-width:2px,color:#fff
    classDef scheduler fill:#FFD93D,stroke:#333,stroke-width:2px,color:#000
    
    class UI,API_Client,State,Router,I18N frontend
    class Gateway,Security,CORS,AuthCtrl,BookingCtrl,FlightCtrl,HotelCtrl,ChatbotCtrl,PaymentCtrl,UserCtrl,AdminCtrl backend
    class AuthSvc,BookingSvc,FlightSvc,HotelSvc,ChatbotSvc,ItinerarySvc,CrawlerSvc,PaymentSvc,WalletSvc,NotificationSvc,UserSvc backend
    class UserRepo,BookingRepo,FlightRepo,HotelRepo,POIRepo,ItineraryRepo,PaymentRepo,WalletRepo backend
    class MongoDB database
    class OpenAI,OpenTripMap,GooglePlaces,VNPay,EmailSvc external
    class Scheduler,CrawlerJob scheduler
```

---

## End of Document

**Generated:** November 23, 2025  
**Project:** Wanderlust Travel Platform  
**Technology Stack:** Spring Boot 3.4.1 + Java 21 + MongoDB + React 18 + TypeScript + OpenAI GPT-3.5

**Mermaid Diagram Types Included:**
- ✅ Class Diagrams (4)
- ✅ Sequence Diagrams (5)
- ✅ Activity Diagrams (3)
- ✅ Component Diagram (1)

**Total Diagrams:** 13
