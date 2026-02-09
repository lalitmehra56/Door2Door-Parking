package com.parkspace.dto;

import com.parkspace.model.Booking;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class BookingDto {

    private Long id;

    @NotNull(message = "Parking space ID is required")
    private Long parkingSpaceId;

    private Long renterId;

    private String renterName;

    private String renterEmail;

    private String parkingSpaceTitle;

    private String parkingSpaceAddress;

    @NotNull(message = "Start time is required")
    private LocalDateTime startTime;

    @NotNull(message = "End time is required")
    private LocalDateTime endTime;

    private BigDecimal totalAmount;

    private Booking.BookingStatus status;

    private Booking.PaymentStatus paymentStatus;

    private String vehiclePlateNumber;

    private String vehicleType;

    private String notes;

    private LocalDateTime createdAt;

    public BookingDto() {
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getParkingSpaceId() { return parkingSpaceId; }
    public void setParkingSpaceId(Long parkingSpaceId) { this.parkingSpaceId = parkingSpaceId; }

    public Long getRenterId() { return renterId; }
    public void setRenterId(Long renterId) { this.renterId = renterId; }

    public String getRenterName() { return renterName; }
    public void setRenterName(String renterName) { this.renterName = renterName; }

    public String getRenterEmail() { return renterEmail; }
    public void setRenterEmail(String renterEmail) { this.renterEmail = renterEmail; }

    public String getParkingSpaceTitle() { return parkingSpaceTitle; }
    public void setParkingSpaceTitle(String parkingSpaceTitle) { this.parkingSpaceTitle = parkingSpaceTitle; }

    public String getParkingSpaceAddress() { return parkingSpaceAddress; }
    public void setParkingSpaceAddress(String parkingSpaceAddress) { this.parkingSpaceAddress = parkingSpaceAddress; }

    public LocalDateTime getStartTime() { return startTime; }
    public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }

    public LocalDateTime getEndTime() { return endTime; }
    public void setEndTime(LocalDateTime endTime) { this.endTime = endTime; }

    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }

    public Booking.BookingStatus getStatus() { return status; }
    public void setStatus(Booking.BookingStatus status) { this.status = status; }

    public Booking.PaymentStatus getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(Booking.PaymentStatus paymentStatus) { this.paymentStatus = paymentStatus; }

    public String getVehiclePlateNumber() { return vehiclePlateNumber; }
    public void setVehiclePlateNumber(String vehiclePlateNumber) { this.vehiclePlateNumber = vehiclePlateNumber; }

    public String getVehicleType() { return vehicleType; }
    public void setVehicleType(String vehicleType) { this.vehicleType = vehicleType; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static BookingDto fromEntity(Booking booking) {
        BookingDto dto = new BookingDto();
        dto.setId(booking.getId());
        dto.setParkingSpaceId(booking.getParkingSpace().getId());
        dto.setRenterId(booking.getRenter().getId());
        dto.setRenterName(booking.getRenter().getFullName());
        dto.setRenterEmail(booking.getRenter().getEmail());
        dto.setParkingSpaceTitle(booking.getParkingSpace().getTitle());
        dto.setParkingSpaceAddress(booking.getParkingSpace().getAddress());
        dto.setStartTime(booking.getStartTime());
        dto.setEndTime(booking.getEndTime());
        dto.setTotalAmount(booking.getTotalAmount());
        dto.setStatus(booking.getStatus());
        dto.setPaymentStatus(booking.getPaymentStatus());
        dto.setVehiclePlateNumber(booking.getVehiclePlateNumber());
        dto.setVehicleType(booking.getVehicleType());
        dto.setNotes(booking.getNotes());
        dto.setCreatedAt(booking.getCreatedAt());
        return dto;
    }
}
