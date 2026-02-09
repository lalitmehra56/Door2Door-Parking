package com.parkspace.repository;

import com.parkspace.model.Booking;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByRenterId(Long renterId);

    Page<Booking> findByRenterId(Long renterId, Pageable pageable);

    List<Booking> findByParkingSpaceId(Long parkingSpaceId);

    Page<Booking> findByParkingSpaceId(Long parkingSpaceId, Pageable pageable);

    List<Booking> findByRenterIdAndStatus(Long renterId, Booking.BookingStatus status);

    @Query("SELECT b FROM Booking b WHERE b.parkingSpace.owner.id = :ownerId")
    Page<Booking> findBySpaceOwnerId(@Param("ownerId") Long ownerId, Pageable pageable);

    @Query("SELECT b FROM Booking b WHERE b.parkingSpace.id = :spaceId AND " +
            "b.status NOT IN ('CANCELLED', 'COMPLETED') AND " +
            "((b.startTime BETWEEN :startTime AND :endTime) OR " +
            "(b.endTime BETWEEN :startTime AND :endTime) OR " +
            "(b.startTime <= :startTime AND b.endTime >= :endTime))")
    List<Booking> findConflictingBookings(@Param("spaceId") Long spaceId,
                                          @Param("startTime") LocalDateTime startTime,
                                          @Param("endTime") LocalDateTime endTime);

    @Query("SELECT b FROM Booking b WHERE b.status = :status AND b.startTime <= :now")
    List<Booking> findPendingBookingsToActivate(@Param("status") Booking.BookingStatus status,
                                                 @Param("now") LocalDateTime now);

    @Query("SELECT b FROM Booking b WHERE b.status = 'ACTIVE' AND b.endTime <= :now")
    List<Booking> findActiveBookingsToComplete(@Param("now") LocalDateTime now);

    @Query("SELECT COUNT(b) FROM Booking b WHERE b.renter.id = :renterId AND b.status = :status")
    long countByRenterIdAndStatus(@Param("renterId") Long renterId,
                                  @Param("status") Booking.BookingStatus status);

    @Query("SELECT COUNT(b) FROM Booking b WHERE b.status = :status")
    long countByStatus(@Param("status") Booking.BookingStatus status);
}
