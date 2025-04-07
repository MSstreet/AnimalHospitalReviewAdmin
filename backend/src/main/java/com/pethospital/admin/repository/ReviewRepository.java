package com.pethospital.admin.repository;

import com.pethospital.admin.model.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    Page<Review> findByHospitalId(Long hospitalId, Pageable pageable);
    
    Page<Review> findByUserId(Long userId, Pageable pageable);
    
    @Query("SELECT r FROM Review r WHERE r.approveYn = :approveYn")
    Page<Review> findByApproveYn(@Param("approveYn") Integer approveYn, Pageable pageable);
    
    @Query("SELECT COUNT(r) FROM Review r WHERE r.hospitalId = :hospitalId")
    Long countByHospitalId(@Param("hospitalId") Long hospitalId);
} 