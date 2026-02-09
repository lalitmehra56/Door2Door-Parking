package com.parkspace.dto;

import com.parkspace.model.ParkingSpace;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;

public class ParkingSpaceDto {

    private Long id;

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @NotBlank(message = "Address is required")
    private String address;

    private String city;

    private String state;

    private String zipCode;

    private Double latitude;

    private Double longitude;

    @NotNull(message = "Hourly rate is required")
    @Positive(message = "Hourly rate must be positive")
    private BigDecimal hourlyRate;

    private BigDecimal dailyRate;

    private BigDecimal monthlyRate;

    private ParkingSpace.SpaceType spaceType;

    private ParkingSpace.VehicleType vehicleType;

    private ParkingSpace.SpaceStatus status;

    private boolean covered;

    private boolean hasElectricCharging;

    private boolean hasSecurityCamera;

    private boolean is24Hours;

    private String imageUrl;

    private String imageUrls; // Multiple images comma separated

    // Documents for verification
    private String ownershipDocumentUrl;
    private String idProofUrl;
    private String addressProofUrl;

    // Approval status
    private ParkingSpace.ApprovalStatus approvalStatus;
    private String adminNotes;

    private Long ownerId;

    private String ownerName;
    private String ownerEmail;
    private String ownerPhone;

    public ParkingSpaceDto() {}

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
    public ParkingSpace.SpaceType getSpaceType() { return spaceType; }
    public void setSpaceType(ParkingSpace.SpaceType spaceType) { this.spaceType = spaceType; }
    public ParkingSpace.VehicleType getVehicleType() { return vehicleType; }
    public void setVehicleType(ParkingSpace.VehicleType vehicleType) { this.vehicleType = vehicleType; }
    public ParkingSpace.SpaceStatus getStatus() { return status; }
    public void setStatus(ParkingSpace.SpaceStatus status) { this.status = status; }
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
    public ParkingSpace.ApprovalStatus getApprovalStatus() { return approvalStatus; }
    public void setApprovalStatus(ParkingSpace.ApprovalStatus approvalStatus) { this.approvalStatus = approvalStatus; }
    public String getAdminNotes() { return adminNotes; }
    public void setAdminNotes(String adminNotes) { this.adminNotes = adminNotes; }
    public Long getOwnerId() { return ownerId; }
    public void setOwnerId(Long ownerId) { this.ownerId = ownerId; }
    public String getOwnerName() { return ownerName; }
    public void setOwnerName(String ownerName) { this.ownerName = ownerName; }
    public String getOwnerEmail() { return ownerEmail; }
    public void setOwnerEmail(String ownerEmail) { this.ownerEmail = ownerEmail; }
    public String getOwnerPhone() { return ownerPhone; }
    public void setOwnerPhone(String ownerPhone) { this.ownerPhone = ownerPhone; }

    public static ParkingSpaceDto fromEntity(ParkingSpace space) {
        ParkingSpaceDto dto = new ParkingSpaceDto();
        dto.setId(space.getId());
        dto.setTitle(space.getTitle());
        dto.setDescription(space.getDescription());
        dto.setAddress(space.getAddress());
        dto.setCity(space.getCity());
        dto.setState(space.getState());
        dto.setZipCode(space.getZipCode());
        dto.setLatitude(space.getLatitude());
        dto.setLongitude(space.getLongitude());
        dto.setHourlyRate(space.getHourlyRate());
        dto.setDailyRate(space.getDailyRate());
        dto.setMonthlyRate(space.getMonthlyRate());
        dto.setSpaceType(space.getSpaceType());
        dto.setVehicleType(space.getVehicleType());
        dto.setStatus(space.getStatus());
        dto.setCovered(space.isCovered());
        dto.setHasElectricCharging(space.isHasElectricCharging());
        dto.setHasSecurityCamera(space.isHasSecurityCamera());
        dto.set24Hours(space.is24Hours());
        dto.setImageUrl(space.getImageUrl());
        dto.setImageUrls(space.getImageUrls());
        dto.setOwnershipDocumentUrl(space.getOwnershipDocumentUrl());
        dto.setIdProofUrl(space.getIdProofUrl());
        dto.setAddressProofUrl(space.getAddressProofUrl());
        dto.setApprovalStatus(space.getApprovalStatus());
        dto.setAdminNotes(space.getAdminNotes());
        if (space.getOwner() != null) {
            dto.setOwnerId(space.getOwner().getId());
            dto.setOwnerName(space.getOwner().getFullName());
            dto.setOwnerEmail(space.getOwner().getEmail());
            dto.setOwnerPhone(space.getOwner().getPhone());
        }
        return dto;
    }
}
