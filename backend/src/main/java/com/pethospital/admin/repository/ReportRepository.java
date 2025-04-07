package com.pethospital.admin.repository;

import com.pethospital.admin.model.Report;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ReportRepository extends JpaRepository<Report, Long> {
    Page<Report> findByReviewId(Long reviewId, Pageable pageable);
    
    Page<Report> findByStatus(Integer status, Pageable pageable);
    
    @Query("SELECT COUNT(r) FROM Report r WHERE r.reviewId = :reviewId")
    Long countByReviewId(@Param("reviewId") Long reviewId);
    
    @Query("SELECT COUNT(r) FROM Report r WHERE r.status = :status")
    Long countByStatus(@Param("status") Integer status);
} 