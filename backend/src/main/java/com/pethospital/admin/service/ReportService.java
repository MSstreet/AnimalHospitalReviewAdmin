package com.pethospital.admin.service;

import com.pethospital.admin.dto.ReportDTO;
import com.pethospital.admin.model.Report;
import com.pethospital.admin.repository.ReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ReportService {
    @Autowired
    private ReportRepository reportRepository;

    @Transactional(readOnly = true)
    public Page<ReportDTO> getAllReports(Pageable pageable) {
        return reportRepository.findAll(pageable)
                .map(this::convertToDTO);
    }

    @Transactional(readOnly = true)
    public Page<ReportDTO> getReportsByReviewId(Long reviewId, Pageable pageable) {
        return reportRepository.findByReviewId(reviewId, pageable)
                .map(this::convertToDTO);
    }

    @Transactional(readOnly = true)
    public Page<ReportDTO> getReportsByStatus(Integer status, Pageable pageable) {
        return reportRepository.findByStatus(status, pageable)
                .map(this::convertToDTO);
    }

    @Transactional
    public void updateReportStatus(Long reportId, Integer status) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new RuntimeException("Report not found"));
        report.setStatus(status);
        reportRepository.save(report);
    }

    @Transactional
    public void deleteReport(Long reportId) {
        reportRepository.deleteById(reportId);
    }

    private ReportDTO convertToDTO(Report report) {
        ReportDTO dto = new ReportDTO();
        dto.setReportId(report.getReportId());
        dto.setReviewId(report.getReviewId());
        dto.setUserId(report.getUserId());
        dto.setReportReason(report.getReportReason());
        dto.setReportDetail(report.getReportDetail());
        dto.setStatus(report.getStatus());
        dto.setCreatedAt(report.getCreatedAt());
        return dto;
    }
} 