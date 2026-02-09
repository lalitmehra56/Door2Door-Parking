package com.parkspace.config;

import com.parkspace.model.Booking;
import com.parkspace.model.ParkingSpace;
import com.parkspace.model.User;
import com.parkspace.repository.BookingRepository;
import com.parkspace.repository.ParkingSpaceRepository;
import com.parkspace.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;

@Configuration
public class DataLoader {

    @Bean
    CommandLineRunner initDatabase(
            UserRepository userRepository,
            ParkingSpaceRepository parkingSpaceRepository,
            BookingRepository bookingRepository,
            PasswordEncoder passwordEncoder) {
        
        return args -> {
            // Only load data if database is empty
            if (userRepository.count() > 0) {
                return;
            }

            System.out.println("Loading sample data...");

            // Create Users
            User user1 = new User();
            user1.setFullName("Raj Kumar");
            user1.setEmail("raj.kumar@example.com");
            user1.setPhone("+919876543210");
            user1.setPassword(passwordEncoder.encode("password123"));
            user1.setRole(User.Role.USER);
            user1 = userRepository.save(user1);

            User user2 = new User();
            user2.setFullName("Priya Sharma");
            user2.setEmail("priya.sharma@example.com");
            user2.setPhone("+919988776655");
            user2.setPassword(passwordEncoder.encode("password123"));
            user2.setRole(User.Role.USER);
            user2 = userRepository.save(user2);

            User owner1 = new User();
            owner1.setFullName("Amit Patel");
            owner1.setEmail("amit.patel@example.com");
            owner1.setPhone("+919123456789");
            owner1.setPassword(passwordEncoder.encode("password123"));
            owner1.setRole(User.Role.SPACE_OWNER);
            owner1 = userRepository.save(owner1);

            User owner2 = new User();
            owner2.setFullName("Sneha Reddy");
            owner2.setEmail("sneha.reddy@example.com");
            owner2.setPhone("+919876512345");
            owner2.setPassword(passwordEncoder.encode("password123"));
            owner2.setRole(User.Role.SPACE_OWNER);
            owner2 = userRepository.save(owner2);

            User owner3 = new User();
            owner3.setFullName("Vikram Singh");
            owner3.setEmail("vikram.singh@example.com");
            owner3.setPhone("+919555512345");
            owner3.setPassword(passwordEncoder.encode("password123"));
            owner3.setRole(User.Role.SPACE_OWNER);
            owner3 = userRepository.save(owner3);

            User admin = new User();
            admin.setFullName("Admin User");
            admin.setEmail("admin@doortodoorparking.com");
            admin.setPhone("+919000000000");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(User.Role.ADMIN);
            admin = userRepository.save(admin);

            System.out.println("Created " + userRepository.count() + " users");

            // Create Parking Spaces (Indian locations with INR currency)
            ParkingSpace space1 = new ParkingSpace();
            space1.setTitle("Connaught Place Covered Parking");
            space1.setDescription("Secure covered parking space in the heart of CP. Perfect for daily commuters. 24/7 access with security cameras.");
            space1.setAddress("Barakhamba Road, Block A");
            space1.setCity("New Delhi");
            space1.setState("Delhi");
            space1.setZipCode("110001");
            space1.setLatitude(28.6304);
            space1.setLongitude(77.2177);
            space1.setHourlyRate(new BigDecimal("50.00"));
            space1.setDailyRate(new BigDecimal("300.00"));
            space1.setMonthlyRate(new BigDecimal("4000.00"));
            space1.setSpaceType(ParkingSpace.SpaceType.STANDARD);
            space1.setVehicleType(ParkingSpace.VehicleType.CAR);
            space1.setStatus(ParkingSpace.SpaceStatus.AVAILABLE);
            space1.setCovered(true);
            space1.setHasElectricCharging(false);
            space1.setHasSecurityCamera(true);
            space1.set24Hours(true);
            space1.setImageUrl("https://images.unsplash.com/photo-1590674899484-d5640e854abe");
            space1.setApprovalStatus(ParkingSpace.ApprovalStatus.APPROVED);
            space1.setApprovedAt(LocalDateTime.now().minusDays(5));
            space1.setOwner(owner1);
            space1 = parkingSpaceRepository.save(space1);

            ParkingSpace space2 = new ParkingSpace();
            space2.setTitle("IGI Airport Long-Term Parking");
            space2.setDescription("Convenient parking near Indira Gandhi Airport. Ideal for travelers. Covered parking with shuttle service available.");
            space2.setAddress("Aerocity, Hospitality District");
            space2.setCity("New Delhi");
            space2.setState("Delhi");
            space2.setZipCode("110037");
            space2.setLatitude(28.5562);
            space2.setLongitude(77.0999);
            space2.setHourlyRate(new BigDecimal("40.00"));
            space2.setDailyRate(new BigDecimal("250.00"));
            space2.setMonthlyRate(new BigDecimal("3500.00"));
            space2.setSpaceType(ParkingSpace.SpaceType.LARGE);
            space2.setVehicleType(ParkingSpace.VehicleType.ANY);
            space2.setStatus(ParkingSpace.SpaceStatus.AVAILABLE);
            space2.setCovered(true);
            space2.setHasElectricCharging(false);
            space2.setHasSecurityCamera(true);
            space2.set24Hours(true);
            space2.setImageUrl("https://images.unsplash.com/photo-1506521781263-d8422e82f27a");
            space2.setApprovalStatus(ParkingSpace.ApprovalStatus.APPROVED);
            space2.setApprovedAt(LocalDateTime.now().minusDays(10));
            space2.setOwner(owner1);
            space2 = parkingSpaceRepository.save(space2);

            ParkingSpace space3 = new ParkingSpace();
            space3.setTitle("Bandra West Private Parking");
            space3.setDescription("Private parking space in prime Bandra location. Safe neighborhood with easy street access. Close to linking road.");
            space3.setAddress("Hill Road, Bandra West");
            space3.setCity("Mumbai");
            space3.setState("Maharashtra");
            space3.setZipCode("400050");
            space3.setLatitude(19.0596);
            space3.setLongitude(72.8295);
            space3.setHourlyRate(new BigDecimal("60.00"));
            space3.setDailyRate(new BigDecimal("400.00"));
            space3.setMonthlyRate(new BigDecimal("5000.00"));
            space3.setSpaceType(ParkingSpace.SpaceType.STANDARD);
            space3.setVehicleType(ParkingSpace.VehicleType.CAR);
            space3.setStatus(ParkingSpace.SpaceStatus.AVAILABLE);
            space3.setCovered(false);
            space3.setHasElectricCharging(false);
            space3.setHasSecurityCamera(false);
            space3.set24Hours(false);
            space3.setImageUrl("https://images.unsplash.com/photo-1558618666-fcd25c85cd64");
            space3.setApprovalStatus(ParkingSpace.ApprovalStatus.APPROVED);
            space3.setApprovedAt(LocalDateTime.now().minusDays(3));
            space3.setOwner(owner2);
            space3 = parkingSpaceRepository.save(space3);

            ParkingSpace space4 = new ParkingSpace();
            space4.setTitle("Cyber City EV Charging Station");
            space4.setDescription("Premium parking space with EV charging. Perfect for electric vehicles. Located in Gurgaon's prime business district.");
            space4.setAddress("DLF Cyber Hub, Phase 2");
            space4.setCity("Gurgaon");
            space4.setState("Haryana");
            space4.setZipCode("122002");
            space4.setLatitude(28.4943);
            space4.setLongitude(77.0869);
            space4.setHourlyRate(new BigDecimal("80.00"));
            space4.setDailyRate(new BigDecimal("500.00"));
            space4.setMonthlyRate(new BigDecimal("6000.00"));
            space4.setSpaceType(ParkingSpace.SpaceType.EV_CHARGING);
            space4.setVehicleType(ParkingSpace.VehicleType.CAR);
            space4.setStatus(ParkingSpace.SpaceStatus.AVAILABLE);
            space4.setCovered(true);
            space4.setHasElectricCharging(true);
            space4.setHasSecurityCamera(true);
            space4.set24Hours(true);
            space4.setImageUrl("https://images.unsplash.com/photo-1593941707882-a5bba14938c7");
            space4.setApprovalStatus(ParkingSpace.ApprovalStatus.APPROVED);
            space4.setApprovedAt(LocalDateTime.now().minusDays(7));
            space4.setOwner(owner2);
            space4 = parkingSpaceRepository.save(space4);

            ParkingSpace space5 = new ParkingSpace();
            space5.setTitle("Koramangala Two-Wheeler Parking");
            space5.setDescription("Compact space perfect for motorcycles and scooters. Secure area with dedicated two-wheeler parking in tech hub.");
            space5.setAddress("80 Feet Road, 5th Block");
            space5.setCity("Bengaluru");
            space5.setState("Karnataka");
            space5.setZipCode("560095");
            space5.setLatitude(12.9352);
            space5.setLongitude(77.6245);
            space5.setHourlyRate(new BigDecimal("20.00"));
            space5.setDailyRate(new BigDecimal("100.00"));
            space5.setMonthlyRate(new BigDecimal("1000.00"));
            space5.setSpaceType(ParkingSpace.SpaceType.MOTORCYCLE);
            space5.setVehicleType(ParkingSpace.VehicleType.MOTORCYCLE);
            space5.setStatus(ParkingSpace.SpaceStatus.AVAILABLE);
            space5.setCovered(false);
            space5.setHasElectricCharging(false);
            space5.setHasSecurityCamera(true);
            space5.set24Hours(true);
            space5.setImageUrl("https://images.unsplash.com/photo-1558618666-fcd25c85cd64");
            space5.setApprovalStatus(ParkingSpace.ApprovalStatus.APPROVED);
            space5.setApprovedAt(LocalDateTime.now().minusDays(2));
            space5.setOwner(owner3);
            space5 = parkingSpaceRepository.save(space5);

            ParkingSpace space6 = new ParkingSpace();
            space6.setTitle("Sector 18 Secure Garage");
            space6.setDescription("Indoor garage parking with 24/7 access. Very secure with gated entry. Close to Noida Metro.");
            space6.setAddress("Atta Market Road, Sector 18");
            space6.setCity("Noida");
            space6.setState("Uttar Pradesh");
            space6.setZipCode("201301");
            space6.setLatitude(28.5686);
            space6.setLongitude(77.3250);
            space6.setHourlyRate(new BigDecimal("45.00"));
            space6.setDailyRate(new BigDecimal("280.00"));
            space6.setMonthlyRate(new BigDecimal("3800.00"));
            space6.setSpaceType(ParkingSpace.SpaceType.STANDARD);
            space6.setVehicleType(ParkingSpace.VehicleType.CAR);
            space6.setStatus(ParkingSpace.SpaceStatus.AVAILABLE);
            space6.setCovered(true);
            space6.setHasElectricCharging(false);
            space6.setHasSecurityCamera(true);
            space6.set24Hours(true);
            space6.setImageUrl("https://images.unsplash.com/photo-1506521781263-d8422e82f27a");
            space6.setApprovalStatus(ParkingSpace.ApprovalStatus.APPROVED);
            space6.setApprovedAt(LocalDateTime.now().minusDays(4));
            space6.setOwner(owner3);
            space6 = parkingSpaceRepository.save(space6);

            ParkingSpace space7 = new ParkingSpace();
            space7.setTitle("Khan Market Premium Parking");
            space7.setDescription("Premium parking in Khan Market area. High security, valet service available. Perfect for shopping and dining.");
            space7.setAddress("Middle Lane, Khan Market");
            space7.setCity("New Delhi");
            space7.setState("Delhi");
            space7.setZipCode("110003");
            space7.setLatitude(28.5998);
            space7.setLongitude(77.2282);
            space7.setHourlyRate(new BigDecimal("100.00"));
            space7.setDailyRate(new BigDecimal("600.00"));
            space7.setMonthlyRate(new BigDecimal("8000.00"));
            space7.setSpaceType(ParkingSpace.SpaceType.STANDARD);
            space7.setVehicleType(ParkingSpace.VehicleType.ANY);
            space7.setStatus(ParkingSpace.SpaceStatus.AVAILABLE);
            space7.setCovered(true);
            space7.setHasElectricCharging(true);
            space7.setHasSecurityCamera(true);
            space7.set24Hours(true);
            space7.setImageUrl("https://images.unsplash.com/photo-1590674899484-d5640e854abe");
            space7.setApprovalStatus(ParkingSpace.ApprovalStatus.APPROVED);
            space7.setApprovedAt(LocalDateTime.now().minusDays(8));
            space7.setOwner(owner1);
            space7 = parkingSpaceRepository.save(space7);

            // Auto-approved space
            ParkingSpace space8 = new ParkingSpace();
            space8.setTitle("Pune Budget Parking");
            space8.setDescription("Affordable outdoor parking space near IT park. Great for long-term parking for daily commuters.");
            space8.setAddress("Hinjewadi Phase 1, Rajiv Gandhi Infotech Park");
            space8.setCity("Pune");
            space8.setState("Maharashtra");
            space8.setZipCode("411057");
            space8.setLatitude(18.5912);
            space8.setLongitude(73.7389);
            space8.setHourlyRate(new BigDecimal("25.00"));
            space8.setDailyRate(new BigDecimal("150.00"));
            space8.setMonthlyRate(new BigDecimal("1800.00"));
            space8.setSpaceType(ParkingSpace.SpaceType.COMPACT);
            space8.setVehicleType(ParkingSpace.VehicleType.CAR);
            space8.setStatus(ParkingSpace.SpaceStatus.AVAILABLE);
            space8.setCovered(false);
            space8.setHasElectricCharging(false);
            space8.setHasSecurityCamera(false);
            space8.set24Hours(false);
            space8.setImageUrl("https://images.unsplash.com/photo-1558618666-fcd25c85cd64");
            space8.setApprovalStatus(ParkingSpace.ApprovalStatus.APPROVED);
            space8.setApprovedAt(LocalDateTime.now().minusDays(1));
            space8.setOwner(owner2);
            space8 = parkingSpaceRepository.save(space8);

            System.out.println("Created " + parkingSpaceRepository.count() + " parking spaces");

            // Create Bookings (with Indian vehicle plates and INR amounts)
            Booking booking1 = new Booking();
            booking1.setRenter(user1);
            booking1.setParkingSpace(space1);
            booking1.setStartTime(LocalDateTime.now().plusDays(1));
            booking1.setEndTime(LocalDateTime.now().plusDays(1).plusHours(8));
            booking1.setTotalAmount(new BigDecimal("400.00"));
            booking1.setStatus(Booking.BookingStatus.CONFIRMED);
            booking1.setPaymentStatus(Booking.PaymentStatus.PAID);
            booking1.setVehiclePlateNumber("DL-3C-AB-1234");
            booking1.setVehicleType("Sedan");
            booking1.setNotes("Need parking for office work");
            bookingRepository.save(booking1);

            Booking booking2 = new Booking();
            booking2.setRenter(user1);
            booking2.setParkingSpace(space2);
            booking2.setStartTime(LocalDateTime.now().plusDays(5));
            booking2.setEndTime(LocalDateTime.now().plusDays(10));
            booking2.setTotalAmount(new BigDecimal("1250.00"));
            booking2.setStatus(Booking.BookingStatus.PENDING);
            booking2.setPaymentStatus(Booking.PaymentStatus.PENDING);
            booking2.setVehiclePlateNumber("DL-3C-AB-1234");
            booking2.setVehicleType("Sedan");
            booking2.setNotes("Traveling for vacation, need airport parking");
            bookingRepository.save(booking2);

            Booking booking3 = new Booking();
            booking3.setRenter(user2);
            booking3.setParkingSpace(space3);
            booking3.setStartTime(LocalDateTime.now().minusDays(2));
            booking3.setEndTime(LocalDateTime.now().plusDays(3));
            booking3.setTotalAmount(new BigDecimal("2000.00"));
            booking3.setStatus(Booking.BookingStatus.ACTIVE);
            booking3.setPaymentStatus(Booking.PaymentStatus.PAID);
            booking3.setVehiclePlateNumber("MH-02-XY-5678");
            booking3.setVehicleType("SUV");
            booking3.setNotes("Extended stay in Mumbai");
            bookingRepository.save(booking3);

            Booking booking4 = new Booking();
            booking4.setRenter(user2);
            booking4.setParkingSpace(space4);
            booking4.setStartTime(LocalDateTime.now().plusDays(2).plusHours(10));
            booking4.setEndTime(LocalDateTime.now().plusDays(2).plusHours(18));
            booking4.setTotalAmount(new BigDecimal("640.00"));
            booking4.setStatus(Booking.BookingStatus.CONFIRMED);
            booking4.setPaymentStatus(Booking.PaymentStatus.PAID);
            booking4.setVehiclePlateNumber("MH-02-XY-5678");
            booking4.setVehicleType("Tata Nexon EV");
            booking4.setNotes("Need EV charging for electric vehicle");
            bookingRepository.save(booking4);

            Booking booking5 = new Booking();
            booking5.setRenter(user1);
            booking5.setParkingSpace(space7);
            booking5.setStartTime(LocalDateTime.now().minusDays(5));
            booking5.setEndTime(LocalDateTime.now().minusDays(5).plusHours(6));
            booking5.setTotalAmount(new BigDecimal("600.00"));
            booking5.setStatus(Booking.BookingStatus.COMPLETED);
            booking5.setPaymentStatus(Booking.PaymentStatus.PAID);
            booking5.setVehiclePlateNumber("DL-3C-AB-1234");
            booking5.setVehicleType("Sedan");
            booking5.setNotes("Shopping at Khan Market");
            bookingRepository.save(booking5);

            Booking booking6 = new Booking();
            booking6.setRenter(user2);
            booking6.setParkingSpace(space1);
            booking6.setStartTime(LocalDateTime.now().minusDays(10));
            booking6.setEndTime(LocalDateTime.now().minusDays(10).plusHours(4));
            booking6.setTotalAmount(new BigDecimal("200.00"));
            booking6.setStatus(Booking.BookingStatus.CANCELLED);
            booking6.setPaymentStatus(Booking.PaymentStatus.REFUNDED);
            booking6.setVehiclePlateNumber("MH-02-XY-5678");
            booking6.setVehicleType("SUV");
            booking6.setCancelledAt(LocalDateTime.now().minusDays(11));
            booking6.setCancellationReason("Plans changed");
            bookingRepository.save(booking6);

            System.out.println("Created " + bookingRepository.count() + " bookings");
            System.out.println("\n=== Sample Data Loaded Successfully (Indian Version) ===");
            System.out.println("\nTest User Credentials:");
            System.out.println("Regular Users:");
            System.out.println("  - Email: raj.kumar@example.com | Password: password123");
            System.out.println("  - Email: priya.sharma@example.com | Password: password123");
            System.out.println("\nSpace Owners:");
            System.out.println("  - Email: amit.patel@example.com | Password: password123");
            System.out.println("  - Email: sneha.reddy@example.com | Password: password123");
            System.out.println("  - Email: vikram.singh@example.com | Password: password123");
            System.out.println("\nAdmin:");
            System.out.println("  - Email: admin@doortodoorparking.com | Password: admin123");
            System.out.println("\nLocations: Delhi, Mumbai, Gurgaon, Bengaluru, Noida, Pune");
            System.out.println("Currency: INR (₹)");
            System.out.println("\n======================================\n");
        };
    }
}
