package com.parkspace.repository;

import com.parkspace.model.ParkingSpace;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ParkingSpaceRepository extends JpaRepository<ParkingSpace, Long> {

    List<ParkingSpace> findByOwnerId(Long ownerId);

    Page<ParkingSpace> findByStatus(ParkingSpace.SpaceStatus status, Pageable pageable);

    @Query("SELECT p FROM ParkingSpace p WHERE p.status = 'AVAILABLE'")
    Page<ParkingSpace> findAllAvailable(Pageable pageable);

    @Query("SELECT p FROM ParkingSpace p WHERE p.status = 'AVAILABLE' AND " +
            "(LOWER(p.city) LIKE LOWER(CONCAT('%', :location, '%')) OR " +
            "LOWER(p.address) LIKE LOWER(CONCAT('%', :location, '%')) OR " +
            "LOWER(p.zipCode) LIKE LOWER(CONCAT('%', :location, '%')))")
    Page<ParkingSpace> searchByLocation(@Param("location") String location, Pageable pageable);

    @Query("SELECT p FROM ParkingSpace p WHERE p.status = 'AVAILABLE' AND " +
            "p.hourlyRate BETWEEN :minRate AND :maxRate")
    Page<ParkingSpace> findByPriceRange(@Param("minRate") BigDecimal minRate,
                                         @Param("maxRate") BigDecimal maxRate,
                                         Pageable pageable);

    @Query("SELECT p FROM ParkingSpace p WHERE p.status = 'AVAILABLE' AND " +
            "p.spaceType = :spaceType")
    Page<ParkingSpace> findBySpaceType(@Param("spaceType") ParkingSpace.SpaceType spaceType,
                                        Pageable pageable);

    @Query("SELECT p FROM ParkingSpace p WHERE p.status = 'AVAILABLE' AND " +
            "p.vehicleType = :vehicleType")
    Page<ParkingSpace> findByVehicleType(@Param("vehicleType") ParkingSpace.VehicleType vehicleType,
                                          Pageable pageable);

    @Query("SELECT COUNT(p) FROM ParkingSpace p WHERE p.status = :status")
    long countByStatus(@Param("status") ParkingSpace.SpaceStatus status);

    // Approval workflow queries
    Page<ParkingSpace> findByApprovalStatus(ParkingSpace.ApprovalStatus approvalStatus, Pageable pageable);

    @Query("SELECT COUNT(p) FROM ParkingSpace p WHERE p.approvalStatus = :status")
    long countByApprovalStatus(@Param("status") ParkingSpace.ApprovalStatus status);

    @Query("SELECT p FROM ParkingSpace p WHERE p.owner.id = :ownerId AND p.approvalStatus = :status")
    List<ParkingSpace> findByOwnerIdAndApprovalStatus(@Param("ownerId") Long ownerId, 
                                                       @Param("status") ParkingSpace.ApprovalStatus status);
}
