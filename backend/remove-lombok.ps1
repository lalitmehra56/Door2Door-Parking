# Script to remove Lombok from remaining files

Write-Host "Removing Lombok from Java files..." -ForegroundColor Cyan

# BookingDto.java - Remove @Data and add getters/setters
$bookingDtoPath = "src/main/java/com/parkspace/dto/BookingDto.java"
$bookingDtoGettersSetters = @"

    public BookingDto() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getParkingSpaceId() {
        return parkingSpaceId;
    }

    public void setParkingSpaceId(Long parkingSpaceId) {
        this.parkingSpaceId = parkingSpaceId;
    }

    public Long getRenterId() {
        return renterId;
    }

    public void setRenterId(Long renterId) {
        this.renterId = renterId;
    }

    public String getRenterName() {
        return renterName;
    }

    public void setRenterName(String renterName) {
        this.renterName = renterName;
    }

    public String getRenterEmail() {
        return renterEmail;
    }

    public void setRenterEmail(String renterEmail) {
        this.renterEmail = renterEmail;
    }

    public String getParkingSpaceTitle() {
        return parkingSpaceTitle;
    }

    public void setParkingSpaceTitle(String parkingSpaceTitle) {
        this.parkingSpaceTitle = parkingSpaceTitle;
    }

    public String getParkingSpaceAddress() {
        return parkingSpaceAddress;
    }

    public void setParkingSpaceAddress(String parkingSpaceAddress) {
        this.parkingSpaceAddress = parkingSpaceAddress;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public Booking.BookingStatus getStatus() {
        return status;
    }

    public void setStatus(Booking.BookingStatus status) {
        this.status = status;
    }

    public Booking.PaymentStatus getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(Booking.PaymentStatus paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public String getVehiclePlateNumber() {
        return vehiclePlateNumber;
    }

    public void setVehiclePlateNumber(String vehiclePlateNumber) {
        this.vehiclePlateNumber = vehiclePlateNumber;
    }

    public String getVehicleType() {
        return vehicleType;
    }

    public void setVehicleType(String vehicleType) {
        this.vehicleType = vehicleType;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
"@

$content = Get-Content $bookingDtoPath -Raw
$content = $content -replace "import lombok\.Data;", ""
$content = $content -replace "@Data\s+public class BookingDto", "public class BookingDto"
$content = $content -replace "(\s+private LocalDateTime createdAt;)", "`$1$bookingDtoGettersSetters"
Set-Content $bookingDtoPath -Value $content
Write-Host "✅ Updated BookingDto.java" -ForegroundColor Green

Write-Host "`n✅ Lombok removal complete!" -ForegroundColor Cyan
Write-Host "Now you can compile the project with: mvn clean compile" -ForegroundColor Yellow
