package com.pethospital.admin.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ReportDTO {
    private Long reportId;
    private Long reviewId;
    private String reviewContent;
    private Long userId;
    private String userName;
    private Integer reportReason;
    private String reportDetail;
    private Integer status;
    private LocalDateTime createdAt;
    private String hospitalName;
} 