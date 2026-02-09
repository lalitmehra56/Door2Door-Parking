package com.parkspace.service;

import com.parkspace.dto.ParkingSpaceDto;
import com.parkspace.model.ParkingSpace;
import com.parkspace.model.User;
import com.parkspace.repository.ParkingSpaceRepository;
import com.parkspace.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@Transactional
public class ParkingSpaceService {

    @Autowired
    private ParkingSpaceRepository parkingSpaceRepository;

    @Autowired
    private UserRepository userRepository;

    public ParkingSpace createSpace(ParkingSpaceDto dto, Long ownerId) {
        User owner = userRepository.findById(ownerId)
                .orElseThrow(() -> new RuntimeException("Owner not found"));

        ParkingSpace space = new ParkingSpace();
        updateSpaceFromDto(space, dto);
        space.setOwner(owner);
        space.setStatus(ParkingSpace.SpaceStatus.AVAILABLE); // Automatically available
        space.setApprovalStatus(ParkingSpace.ApprovalStatus.APPROVED); // Auto-approved
        space.setApprovedAt(java.time.LocalDateTime.now());

        return parkingSpaceRepository.save(space);
    }

    public ParkingSpace updateSpace(Long id, ParkingSpaceDto dto, Long ownerId) {
        ParkingSpace space = parkingSpaceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Parking space not found"));

        if (!space.getOwner().getId().equals(ownerId)) {
            throw new RuntimeException("You don't have permission to update this space");
        }

        updateSpaceFromDto(space, dto);
        return parkingSpaceRepository.save(space);
    }

    private void updateSpaceFromDto(ParkingSpace space, ParkingSpaceDto dto) {
        space.setTitle(dto.getTitle());
        space.setDescription(dto.getDescription());
        space.setAddress(dto.getAddress());
        space.setCity(dto.getCity());
        space.setState(dto.getState());
        space.setZipCode(dto.getZipCode());
        space.setLatitude(dto.getLatitude());
        space.setLongitude(dto.getLongitude());
        space.setHourlyRate(dto.getHourlyRate());
        space.setDailyRate(dto.getDailyRate());
        space.setMonthlyRate(dto.getMonthlyRate());
        if (dto.getSpaceType() != null) {
            space.setSpaceType(dto.getSpaceType());
        }
        if (dto.getVehicleType() != null) {
            space.setVehicleType(dto.getVehicleType());
        }
        space.setCovered(dto.isCovered());
        space.setHasElectricCharging(dto.isHasElectricCharging());
        space.setHasSecurityCamera(dto.isHasSecurityCamera());
        space.set24Hours(dto.is24Hours());
        space.setImageUrl(dto.getImageUrl());
        space.setImageUrls(dto.getImageUrls());
        space.setOwnershipDocumentUrl(dto.getOwnershipDocumentUrl());
        space.setIdProofUrl(dto.getIdProofUrl());
        space.setAddressProofUrl(dto.getAddressProofUrl());
    }

    public ParkingSpace getSpaceById(Long id) {
        return parkingSpaceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Parking space not found"));
    }

    public Page<ParkingSpace> getAllAvailableSpaces(Pageable pageable) {
        return parkingSpaceRepository.findAllAvailable(pageable);
    }

    public Page<ParkingSpace> searchByLocation(String location, Pageable pageable) {
        return parkingSpaceRepository.searchByLocation(location, pageable);
    }

    public Page<ParkingSpace> getSpacesByPriceRange(BigDecimal minRate, BigDecimal maxRate, Pageable pageable) {
        return parkingSpaceRepository.findByPriceRange(minRate, maxRate, pageable);
    }

    public Page<ParkingSpace> getSpacesByType(ParkingSpace.SpaceType spaceType, Pageable pageable) {
        return parkingSpaceRepository.findBySpaceType(spaceType, pageable);
    }

    public List<ParkingSpace> getSpacesByOwner(Long ownerId) {
        return parkingSpaceRepository.findByOwnerId(ownerId);
    }

    public Page<ParkingSpace> getAllSpaces(Pageable pageable) {
        return parkingSpaceRepository.findAll(pageable);
    }

    public ParkingSpace updateSpaceStatus(Long id, ParkingSpace.SpaceStatus status, Long ownerId) {
        ParkingSpace space = parkingSpaceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Parking space not found"));

        if (!space.getOwner().getId().equals(ownerId)) {
            throw new RuntimeException("You don't have permission to update this space");
        }

        space.setStatus(status);
        return parkingSpaceRepository.save(space);
    }

    public void deleteSpace(Long id, Long ownerId) {
        ParkingSpace space = parkingSpaceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Parking space not found"));

        if (!space.getOwner().getId().equals(ownerId)) {
            throw new RuntimeException("You don't have permission to delete this space");
        }

        parkingSpaceRepository.delete(space);
    }

    public long countAvailableSpaces() {
        return parkingSpaceRepository.countByStatus(ParkingSpace.SpaceStatus.AVAILABLE);
    }

    public long countTotalSpaces() {
        return parkingSpaceRepository.count();
    }

    // Admin approval methods
    public Page<ParkingSpace> getPendingApprovalSpaces(Pageable pageable) {
        return parkingSpaceRepository.findByApprovalStatus(ParkingSpace.ApprovalStatus.PENDING, pageable);
    }

    public ParkingSpace approveSpace(Long id, Long adminId, String notes) {
        ParkingSpace space = parkingSpaceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Parking space not found"));

        space.setApprovalStatus(ParkingSpace.ApprovalStatus.APPROVED);
        space.setStatus(ParkingSpace.SpaceStatus.AVAILABLE); // Now available for booking
        space.setApprovedAt(java.time.LocalDateTime.now());
        space.setApprovedBy(adminId);
        if (notes != null) {
            space.setAdminNotes(notes);
        }

        return parkingSpaceRepository.save(space);
    }

    public ParkingSpace rejectSpace(Long id, Long adminId, String reason) {
        ParkingSpace space = parkingSpaceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Parking space not found"));

        space.setApprovalStatus(ParkingSpace.ApprovalStatus.REJECTED);
        space.setStatus(ParkingSpace.SpaceStatus.INACTIVE);
        space.setApprovedBy(adminId);
        space.setAdminNotes(reason);

        return parkingSpaceRepository.save(space);
    }

    public ParkingSpace requestMoreInfo(Long id, Long adminId, String info) {
        ParkingSpace space = parkingSpaceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Parking space not found"));

        space.setApprovalStatus(ParkingSpace.ApprovalStatus.NEEDS_INFO);
        space.setApprovedBy(adminId);
        space.setAdminNotes(info);

        return parkingSpaceRepository.save(space);
    }

    public long countPendingApprovals() {
        return parkingSpaceRepository.countByApprovalStatus(ParkingSpace.ApprovalStatus.PENDING);
    }

    public long countSpacesByOwner(Long ownerId) {
        return parkingSpaceRepository.findByOwnerId(ownerId).size();
    }

    public long countAvailableSpacesByOwner(Long ownerId) {
        return parkingSpaceRepository.findByOwnerId(ownerId).stream()
                .filter(space -> space.getStatus() == ParkingSpace.SpaceStatus.AVAILABLE)
                .count();
    }
}
