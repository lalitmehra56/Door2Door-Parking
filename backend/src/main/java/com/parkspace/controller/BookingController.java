package com.parkspace.controller;

import com.parkspace.dto.BookingDto;
import com.parkspace.model.Booking;
import com.parkspace.security.UserDetailsImpl;
import com.parkspace.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*", maxAge = 3600)
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @PostMapping
    public ResponseEntity<?> createBooking(
            @Valid @RequestBody BookingDto dto,
            @AuthenticationPrincipal UserDetailsImpl currentUser) {
        try {
            Booking booking = bookingService.createBooking(dto, currentUser.getId());
            return ResponseEntity.ok(BookingDto.fromEntity(booking));
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getBooking(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetailsImpl currentUser) {
        try {
            Booking booking = bookingService.getBookingById(id);
            
            // Check if user has permission to view this booking
            boolean isRenter = booking.getRenter().getId().equals(currentUser.getId());
            boolean isOwner = booking.getParkingSpace().getOwner().getId().equals(currentUser.getId());
            boolean isAdmin = currentUser.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
            
            if (!isRenter && !isOwner && !isAdmin) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "You don't have permission to view this booking");
                return ResponseEntity.status(403).body(error);
            }
            
            return ResponseEntity.ok(BookingDto.fromEntity(booking));
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/my-bookings")
    public ResponseEntity<?> getMyBookings(
            @AuthenticationPrincipal UserDetailsImpl currentUser,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Booking> bookings = bookingService.getBookingsByRenter(currentUser.getId(), pageable);
        Page<BookingDto> bookingDtos = bookings.map(BookingDto::fromEntity);
        
        return ResponseEntity.ok(bookingDtos);
    }

    @GetMapping("/space-bookings")
    @PreAuthorize("hasRole('SPACE_OWNER') or hasRole('ADMIN')")
    public ResponseEntity<?> getSpaceOwnerBookings(
            @AuthenticationPrincipal UserDetailsImpl currentUser,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Booking> bookings = bookingService.getBookingsBySpaceOwner(currentUser.getId(), pageable);
        Page<BookingDto> bookingDtos = bookings.map(BookingDto::fromEntity);
        
        return ResponseEntity.ok(bookingDtos);
    }

    @GetMapping("/by-space/{spaceId}")
    @PreAuthorize("hasRole('SPACE_OWNER') or hasRole('ADMIN')")
    public ResponseEntity<?> getBookingsBySpace(@PathVariable Long spaceId) {
        List<Booking> bookings = bookingService.getBookingsByParkingSpace(spaceId);
        List<BookingDto> bookingDtos = bookings.stream()
                .map(BookingDto::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(bookingDtos);
    }

    @GetMapping("/owner/stats")
    @PreAuthorize("hasRole('SPACE_OWNER') or hasRole('ADMIN')")
    public ResponseEntity<?> getOwnerStats(@AuthenticationPrincipal UserDetailsImpl currentUser) {
        Map<String, Long> stats = new HashMap<>();
        stats.put("totalBookings", bookingService.countBookingsBySpaceOwner(currentUser.getId()));
        stats.put("activeBookings", bookingService.countActiveBookingsBySpaceOwner(currentUser.getId()));
        return ResponseEntity.ok(stats);
    }

    @PatchMapping("/{id}/confirm")
    @PreAuthorize("hasRole('SPACE_OWNER') or hasRole('ADMIN')")
    public ResponseEntity<?> confirmBooking(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetailsImpl currentUser) {
        try {
            Booking booking = bookingService.confirmBooking(id, currentUser.getId());
            return ResponseEntity.ok(BookingDto.fromEntity(booking));
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PatchMapping("/{id}/cancel")
    public ResponseEntity<?> cancelBooking(
            @PathVariable Long id,
            @RequestParam(required = false) String reason,
            @AuthenticationPrincipal UserDetailsImpl currentUser) {
        try {
            Booking booking = bookingService.cancelBooking(id, currentUser.getId(), reason);
            return ResponseEntity.ok(BookingDto.fromEntity(booking));
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PatchMapping("/{id}/complete")
    @PreAuthorize("hasRole('SPACE_OWNER') or hasRole('ADMIN')")
    public ResponseEntity<?> completeBooking(@PathVariable Long id) {
        try {
            Booking booking = bookingService.completeBooking(id);
            return ResponseEntity.ok(BookingDto.fromEntity(booking));
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PatchMapping("/{id}/payment")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updatePaymentStatus(
            @PathVariable Long id,
            @RequestParam Booking.PaymentStatus paymentStatus) {
        try {
            Booking booking = bookingService.updatePaymentStatus(id, paymentStatus);
            return ResponseEntity.ok(BookingDto.fromEntity(booking));
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // Admin endpoints
    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllBookings(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Booking> bookings = bookingService.getAllBookings(pageable);
        Page<BookingDto> bookingDtos = bookings.map(BookingDto::fromEntity);
        
        return ResponseEntity.ok(bookingDtos);
    }

    @GetMapping("/admin/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getStats() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("totalBookings", bookingService.countTotalBookings());
        stats.put("activeBookings", bookingService.countActiveBookings());
        return ResponseEntity.ok(stats);
    }
}
