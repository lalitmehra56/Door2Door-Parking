package com.parkspace.controller;

import com.parkspace.dto.ParkingSpaceDto;
import com.parkspace.model.ParkingSpace;
import com.parkspace.security.UserDetailsImpl;
import com.parkspace.service.ParkingSpaceService;
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

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/spaces")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ParkingSpaceController {

    @Autowired
    private ParkingSpaceService parkingSpaceService;

    // Public endpoints
    @GetMapping("/available")
    public ResponseEntity<?> getAvailableSpaces(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        
        Sort sort = sortDir.equalsIgnoreCase("asc") 
                ? Sort.by(sortBy).ascending() 
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<ParkingSpace> spaces = parkingSpaceService.getAllAvailableSpaces(pageable);
        Page<ParkingSpaceDto> spaceDtos = spaces.map(ParkingSpaceDto::fromEntity);
        
        return ResponseEntity.ok(spaceDtos);
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchSpaces(
            @RequestParam String location,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<ParkingSpace> spaces = parkingSpaceService.searchByLocation(location, pageable);
        Page<ParkingSpaceDto> spaceDtos = spaces.map(ParkingSpaceDto::fromEntity);
        
        return ResponseEntity.ok(spaceDtos);
    }

    @GetMapping("/filter/price")
    public ResponseEntity<?> filterByPrice(
            @RequestParam BigDecimal minRate,
            @RequestParam BigDecimal maxRate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<ParkingSpace> spaces = parkingSpaceService.getSpacesByPriceRange(minRate, maxRate, pageable);
        Page<ParkingSpaceDto> spaceDtos = spaces.map(ParkingSpaceDto::fromEntity);
        
        return ResponseEntity.ok(spaceDtos);
    }

    @GetMapping("/filter/type")
    public ResponseEntity<?> filterByType(
            @RequestParam ParkingSpace.SpaceType spaceType,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<ParkingSpace> spaces = parkingSpaceService.getSpacesByType(spaceType, pageable);
        Page<ParkingSpaceDto> spaceDtos = spaces.map(ParkingSpaceDto::fromEntity);
        
        return ResponseEntity.ok(spaceDtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getSpaceById(@PathVariable Long id) {
        try {
            ParkingSpace space = parkingSpaceService.getSpaceById(id);
            return ResponseEntity.ok(ParkingSpaceDto.fromEntity(space));
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    // Authenticated endpoints
    @PostMapping
    @PreAuthorize("hasRole('SPACE_OWNER') or hasRole('ADMIN')")
    public ResponseEntity<?> createSpace(
            @Valid @RequestBody ParkingSpaceDto dto,
            @AuthenticationPrincipal UserDetailsImpl currentUser) {
        try {
            ParkingSpace space = parkingSpaceService.createSpace(dto, currentUser.getId());
            return ResponseEntity.ok(ParkingSpaceDto.fromEntity(space));
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('SPACE_OWNER') or hasRole('ADMIN')")
    public ResponseEntity<?> updateSpace(
            @PathVariable Long id,
            @Valid @RequestBody ParkingSpaceDto dto,
            @AuthenticationPrincipal UserDetailsImpl currentUser) {
        try {
            ParkingSpace space = parkingSpaceService.updateSpace(id, dto, currentUser.getId());
            return ResponseEntity.ok(ParkingSpaceDto.fromEntity(space));
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('SPACE_OWNER') or hasRole('ADMIN')")
    public ResponseEntity<?> updateSpaceStatus(
            @PathVariable Long id,
            @RequestParam ParkingSpace.SpaceStatus status,
            @AuthenticationPrincipal UserDetailsImpl currentUser) {
        try {
            ParkingSpace space = parkingSpaceService.updateSpaceStatus(id, status, currentUser.getId());
            return ResponseEntity.ok(ParkingSpaceDto.fromEntity(space));
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SPACE_OWNER') or hasRole('ADMIN')")
    public ResponseEntity<?> deleteSpace(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetailsImpl currentUser) {
        try {
            parkingSpaceService.deleteSpace(id, currentUser.getId());
            Map<String, String> response = new HashMap<>();
            response.put("message", "Parking space deleted successfully");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/my-spaces")
    @PreAuthorize("hasRole('SPACE_OWNER') or hasRole('ADMIN')")
    public ResponseEntity<?> getMySpaces(@AuthenticationPrincipal UserDetailsImpl currentUser) {
        List<ParkingSpace> spaces = parkingSpaceService.getSpacesByOwner(currentUser.getId());
        List<ParkingSpaceDto> spaceDtos = spaces.stream()
                .map(ParkingSpaceDto::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(spaceDtos);
    }

    @GetMapping("/owner/stats")
    @PreAuthorize("hasRole('SPACE_OWNER') or hasRole('ADMIN')")
    public ResponseEntity<?> getOwnerStats(@AuthenticationPrincipal UserDetailsImpl currentUser) {
        Map<String, Long> stats = new HashMap<>();
        stats.put("totalSpaces", parkingSpaceService.countSpacesByOwner(currentUser.getId()));
        stats.put("availableSpaces", parkingSpaceService.countAvailableSpacesByOwner(currentUser.getId()));
        return ResponseEntity.ok(stats);
    }

    // Admin endpoints
    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllSpaces(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<ParkingSpace> spaces = parkingSpaceService.getAllSpaces(pageable);
        Page<ParkingSpaceDto> spaceDtos = spaces.map(ParkingSpaceDto::fromEntity);
        
        return ResponseEntity.ok(spaceDtos);
    }

    @GetMapping("/admin/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getStats() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("totalSpaces", parkingSpaceService.countTotalSpaces());
        stats.put("availableSpaces", parkingSpaceService.countAvailableSpaces());
        stats.put("pendingApprovals", parkingSpaceService.countPendingApprovals());
        return ResponseEntity.ok(stats);
    }

    // Admin approval endpoints
    @GetMapping("/admin/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getPendingApprovals(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<ParkingSpace> spaces = parkingSpaceService.getPendingApprovalSpaces(pageable);
        Page<ParkingSpaceDto> spaceDtos = spaces.map(ParkingSpaceDto::fromEntity);
        
        return ResponseEntity.ok(spaceDtos);
    }

    @PatchMapping("/admin/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> approveSpace(
            @PathVariable Long id,
            @RequestParam(required = false) String notes,
            @AuthenticationPrincipal UserDetailsImpl currentUser) {
        try {
            ParkingSpace space = parkingSpaceService.approveSpace(id, currentUser.getId(), notes);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Parking space approved successfully");
            response.put("space", ParkingSpaceDto.fromEntity(space));
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PatchMapping("/admin/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> rejectSpace(
            @PathVariable Long id,
            @RequestParam String reason,
            @AuthenticationPrincipal UserDetailsImpl currentUser) {
        try {
            ParkingSpace space = parkingSpaceService.rejectSpace(id, currentUser.getId(), reason);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Parking space rejected");
            response.put("space", ParkingSpaceDto.fromEntity(space));
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PatchMapping("/admin/{id}/request-info")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> requestMoreInfo(
            @PathVariable Long id,
            @RequestParam String info,
            @AuthenticationPrincipal UserDetailsImpl currentUser) {
        try {
            ParkingSpace space = parkingSpaceService.requestMoreInfo(id, currentUser.getId(), info);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Information request sent to owner");
            response.put("space", ParkingSpaceDto.fromEntity(space));
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}
