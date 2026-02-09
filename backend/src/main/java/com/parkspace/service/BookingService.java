package com.parkspace.service;

import com.parkspace.dto.BookingDto;
import com.parkspace.model.Booking;
import com.parkspace.model.ParkingSpace;
import com.parkspace.model.User;
import com.parkspace.repository.BookingRepository;
import com.parkspace.repository.ParkingSpaceRepository;
import com.parkspace.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private ParkingSpaceRepository parkingSpaceRepository;

    @Autowired
    private UserRepository userRepository;

    public Booking createBooking(BookingDto dto, Long renterId) {
        User renter = userRepository.findById(renterId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        ParkingSpace parkingSpace = parkingSpaceRepository.findById(dto.getParkingSpaceId())
                .orElseThrow(() -> new RuntimeException("Parking space not found"));

        if (parkingSpace.getStatus() != ParkingSpace.SpaceStatus.AVAILABLE) {
            throw new RuntimeException("Parking space is not available");
        }

        // Check for conflicting bookings
        List<Booking> conflictingBookings = bookingRepository.findConflictingBookings(
                dto.getParkingSpaceId(), dto.getStartTime(), dto.getEndTime());

        if (!conflictingBookings.isEmpty()) {
            throw new RuntimeException("The parking space is already booked for the selected time period");
        }

        // Calculate total amount
        BigDecimal totalAmount = calculateTotalAmount(parkingSpace, dto.getStartTime(), dto.getEndTime());

        Booking booking = new Booking();
        booking.setRenter(renter);
        booking.setParkingSpace(parkingSpace);
        booking.setStartTime(dto.getStartTime());
        booking.setEndTime(dto.getEndTime());
        booking.setTotalAmount(totalAmount);
        booking.setStatus(Booking.BookingStatus.PENDING);
        booking.setPaymentStatus(Booking.PaymentStatus.PENDING);
        booking.setVehiclePlateNumber(dto.getVehiclePlateNumber());
        booking.setVehicleType(dto.getVehicleType());
        booking.setNotes(dto.getNotes());

        return bookingRepository.save(booking);
    }

    private BigDecimal calculateTotalAmount(ParkingSpace space, LocalDateTime startTime, LocalDateTime endTime) {
        Duration duration = Duration.between(startTime, endTime);
        long hours = duration.toHours();
        if (hours < 1) hours = 1; // Minimum 1 hour

        long days = duration.toDays();

        // If booking is for a day or more and daily rate exists, use daily rate
        if (days >= 1 && space.getDailyRate() != null) {
            long remainingHours = hours - (days * 24);
            BigDecimal dailyTotal = space.getDailyRate().multiply(BigDecimal.valueOf(days));
            BigDecimal hourlyTotal = space.getHourlyRate().multiply(BigDecimal.valueOf(remainingHours));
            return dailyTotal.add(hourlyTotal);
        }

        // Otherwise use hourly rate
        return space.getHourlyRate().multiply(BigDecimal.valueOf(hours));
    }

    public Booking getBookingById(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
    }

    public List<Booking> getBookingsByRenter(Long renterId) {
        return bookingRepository.findByRenterId(renterId);
    }

    public Page<Booking> getBookingsByRenter(Long renterId, Pageable pageable) {
        return bookingRepository.findByRenterId(renterId, pageable);
    }

    public Page<Booking> getBookingsBySpaceOwner(Long ownerId, Pageable pageable) {
        return bookingRepository.findBySpaceOwnerId(ownerId, pageable);
    }

    public List<Booking> getBookingsByParkingSpace(Long parkingSpaceId) {
        return bookingRepository.findByParkingSpaceId(parkingSpaceId);
    }

    public Page<Booking> getAllBookings(Pageable pageable) {
        return bookingRepository.findAll(pageable);
    }

    public Booking confirmBooking(Long id, Long ownerId) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!booking.getParkingSpace().getOwner().getId().equals(ownerId)) {
            throw new RuntimeException("You don't have permission to confirm this booking");
        }

        booking.setStatus(Booking.BookingStatus.CONFIRMED);
        return bookingRepository.save(booking);
    }

    public Booking cancelBooking(Long id, Long userId, String reason) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        // Allow cancellation by renter or space owner
        boolean isRenter = booking.getRenter().getId().equals(userId);
        boolean isOwner = booking.getParkingSpace().getOwner().getId().equals(userId);

        if (!isRenter && !isOwner) {
            throw new RuntimeException("You don't have permission to cancel this booking");
        }

        booking.setStatus(Booking.BookingStatus.CANCELLED);
        booking.setCancelledAt(LocalDateTime.now());
        booking.setCancellationReason(reason);

        return bookingRepository.save(booking);
    }

    public Booking completeBooking(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        booking.setStatus(Booking.BookingStatus.COMPLETED);
        return bookingRepository.save(booking);
    }

    public Booking updatePaymentStatus(Long id, Booking.PaymentStatus paymentStatus) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        booking.setPaymentStatus(paymentStatus);

        // If payment is successful, confirm the booking
        if (paymentStatus == Booking.PaymentStatus.PAID && 
            booking.getStatus() == Booking.BookingStatus.PENDING) {
            booking.setStatus(Booking.BookingStatus.CONFIRMED);
        }

        return bookingRepository.save(booking);
    }

    public long countActiveBookings() {
        return bookingRepository.countByStatus(Booking.BookingStatus.ACTIVE);
    }

    public long countTotalBookings() {
        return bookingRepository.count();
    }

    public long countBookingsBySpaceOwner(Long ownerId) {
        return bookingRepository.findBySpaceOwnerId(ownerId, Pageable.unpaged()).getTotalElements();
    }

    public long countActiveBookingsBySpaceOwner(Long ownerId) {
        return bookingRepository.findBySpaceOwnerId(ownerId, Pageable.unpaged()).stream()
                .filter(booking -> booking.getStatus() == Booking.BookingStatus.ACTIVE || 
                                 booking.getStatus() == Booking.BookingStatus.CONFIRMED)
                .count();
    }
}
