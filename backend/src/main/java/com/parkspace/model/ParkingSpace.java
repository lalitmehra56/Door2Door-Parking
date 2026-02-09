package com.parkspace.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "parking_spaces")
public class ParkingSpace {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String title;

    @Column(length = 1000)
    private String description;

    @NotBlank
    private String address;

    private String city;

    private String state;

    private String zipCode;

    private Double latitude;

    private Double longitude;

    @NotNull
    @Positive
    private BigDecimal hourlyRate;

    private BigDecimal dailyRate;

    private BigDecimal monthlyRate;

    @Enumerated(EnumType.STRING)
    private SpaceType spaceType = SpaceType.STANDARD;

    @Enumerated(EnumType.STRING)
    private VehicleType vehicleType = VehicleType.CAR;

    @Enumerated(EnumType.STRING)
    private SpaceStatus status = SpaceStatus.AVAILABLE;

    private boolean covered;

    private boolean hasElectricCharging;

    private boolean hasSecurityCamera;

    private boolean is24Hours;

    // Images - base64 or URLs
    @Lob
    @Column(columnDefinition = "CLOB")
    private String imageUrl;

    @Lob
    @Column(columnDefinition = "CLOB")
    private String imageUrls; // Multiple images comma separated

    // Documents for verification
    @Column(length = 500)
    private String ownershipDocumentUrl;

    @Column(length = 500)
    private String idProofUrl;

    @Column(length = 500)
    private String addressProofUrl;

    // Approval workflow
    @Enumerated(EnumType.STRING)
    private ApprovalStatus approvalStatus = ApprovalStatus.PENDING;

    @Column(length = 1000)
    private String adminNotes; // Notes from admin for approval/rejection

    private LocalDateTime approvedAt;

    private Long approvedBy; // Admin user ID who approved

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @OneToMany(mappedBy = "parkingSpace", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<Booking> bookings = new HashSet<>();

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public ParkingSpace() {}

    public ParkingSpace(Long id, String title, String description, String address, String city, String state, String zipCode, Double latitude, Double longitude, BigDecimal hourlyRate, BigDecimal dailyRate, BigDecimal monthlyRate, SpaceType spaceType, VehicleType vehicleType, SpaceStatus status, boolean covered, boolean hasElectricCharging, boolean hasSecurityCamera, boolean is24Hours, String imageUrl, String imageUrls, String ownershipDocumentUrl, String idProofUrl, String addressProofUrl, ApprovalStatus approvalStatus, String adminNotes, LocalDateTime approvedAt, Long approvedBy, User owner, Set<Booking> bookings, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.address = address;
        this.city = city;
        this.state = state;
        this.zipCode = zipCode;
        this.latitude = latitude;
        this.longitude = longitude;
        this.hourlyRate = hourlyRate;
        this.dailyRate = dailyRate;
        this.monthlyRate = monthlyRate;
        this.spaceType = spaceType;
        this.vehicleType = vehicleType;
        this.status = status;
        this.covered = covered;
        this.hasElectricCharging = hasElectricCharging;
        this.hasSecurityCamera = hasSecurityCamera;
        this.is24Hours = is24Hours;
        this.imageUrl = imageUrl;
        this.imageUrls = imageUrls;
        this.ownershipDocumentUrl = ownershipDocumentUrl;
        this.idProofUrl = idProofUrl;
        this.addressProofUrl = addressProofUrl;
        this.approvalStatus = approvalStatus;
        this.adminNotes = adminNotes;
        this.approvedAt = approvedAt;
        this.approvedBy = approvedBy;
        this.owner = owner;
        this.bookings = bookings;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getState() { return state; }
    public void setState(String state) { this.state = state; }
    public String getZipCode() { return zipCode; }
    public void setZipCode(String zipCode) { this.zipCode = zipCode; }
    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }
    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
    public BigDecimal getHourlyRate() { return hourlyRate; }
    public void setHourlyRate(BigDecimal hourlyRate) { this.hourlyRate = hourlyRate; }
    public BigDecimal getDailyRate() { return dailyRate; }
    public void setDailyRate(BigDecimal dailyRate) { this.dailyRate = dailyRate; }
    public BigDecimal getMonthlyRate() { return monthlyRate; }
    public void setMonthlyRate(BigDecimal monthlyRate) { this.monthlyRate = monthlyRate; }
    public SpaceType getSpaceType() { return spaceType; }
    public void setSpaceType(SpaceType spaceType) { this.spaceType = spaceType; }
    public VehicleType getVehicleType() { return vehicleType; }
    public void setVehicleType(VehicleType vehicleType) { this.vehicleType = vehicleType; }
    public SpaceStatus getStatus() { return status; }
    public void setStatus(SpaceStatus status) { this.status = status; }
    public boolean isCovered() { return covered; }
    public void setCovered(boolean covered) { this.covered = covered; }
    public boolean isHasElectricCharging() { return hasElectricCharging; }
    public void setHasElectricCharging(boolean hasElectricCharging) { this.hasElectricCharging = hasElectricCharging; }
    public boolean isHasSecurityCamera() { return hasSecurityCamera; }
    public void setHasSecurityCamera(boolean hasSecurityCamera) { this.hasSecurityCamera = hasSecurityCamera; }
    public boolean is24Hours() { return is24Hours; }
    public void set24Hours(boolean is24Hours) { this.is24Hours = is24Hours; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public String getImageUrls() { return imageUrls; }
    public void setImageUrls(String imageUrls) { this.imageUrls = imageUrls; }
    public String getOwnershipDocumentUrl() { return ownershipDocumentUrl; }
    public void setOwnershipDocumentUrl(String ownershipDocumentUrl) { this.ownershipDocumentUrl = ownershipDocumentUrl; }
    public String getIdProofUrl() { return idProofUrl; }
    public void setIdProofUrl(String idProofUrl) { this.idProofUrl = idProofUrl; }
    public String getAddressProofUrl() { return addressProofUrl; }
    public void setAddressProofUrl(String addressProofUrl) { this.addressProofUrl = addressProofUrl; }
    public ApprovalStatus getApprovalStatus() { return approvalStatus; }
    public void setApprovalStatus(ApprovalStatus approvalStatus) { this.approvalStatus = approvalStatus; }
    public String getAdminNotes() { return adminNotes; }
    public void setAdminNotes(String adminNotes) { this.adminNotes = adminNotes; }
    public LocalDateTime getApprovedAt() { return approvedAt; }
    public void setApprovedAt(LocalDateTime approvedAt) { this.approvedAt = approvedAt; }
    public Long getApprovedBy() { return approvedBy; }
    public void setApprovedBy(Long approvedBy) { this.approvedBy = approvedBy; }
    public User getOwner() { return owner; }
    public void setOwner(User owner) { this.owner = owner; }
    public Set<Booking> getBookings() { return bookings; }
    public void setBookings(Set<Booking> bookings) { this.bookings = bookings; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public enum SpaceType {
        STANDARD,
        COMPACT,
        LARGE,
        HANDICAP,
        MOTORCYCLE,
        EV_CHARGING
    }

    public enum VehicleType {
        CAR,
        MOTORCYCLE,
        TRUCK,
        SUV,
        VAN,
        ANY
    }

    public enum SpaceStatus {
        AVAILABLE,
        OCCUPIED,
        RESERVED,
        MAINTENANCE,
        INACTIVE
    }

    public enum ApprovalStatus {
        PENDING,      // Waiting for admin review
        APPROVED,     // Admin approved
        REJECTED,     // Admin rejected
        NEEDS_INFO    // Admin needs more information
    }
}
