package com.pethospital.admin.controller;

import com.pethospital.admin.dto.ReportDTO;
import com.pethospital.admin.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/reports")
public class ReportController {
    @Autowired
    private ReportService reportService;

    @GetMapping
    public ResponseEntity<Page<ReportDTO>> getAllReports(
            @PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(reportService.getAllReports(pageable));
    }

    @GetMapping("/review/{reviewId}")
    public ResponseEntity<Page<ReportDTO>> getReportsByReviewId(
            @PathVariable Long reviewId,
            @PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(reportService.getReportsByReviewId(reviewId, pageable));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<Page<ReportDTO>> getReportsByStatus(
            @PathVariable Integer status,
            @PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(reportService.getReportsByStatus(status, pageable));
    }

    @PutMapping("/{reportId}/status")
    public ResponseEntity<Void> updateReportStatus(
            @PathVariable Long reportId,
            @RequestParam Integer status) {
        reportService.updateReportStatus(reportId, status);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{reportId}")
    public ResponseEntity<Void> deleteReport(@PathVariable Long reportId) {
        reportService.deleteReport(reportId);
        return ResponseEntity.ok().build();
    }
} 