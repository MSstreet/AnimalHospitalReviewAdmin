package com.pethospital.admin.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ReviewDTO {
    private Long reviewId;
    private Long hospitalId;
    private String hospitalName;
    private Long userId;
    private String userName;
    private String content;
    private Integer score;
    private Integer kindnessScore;
    private Integer priceScore;
    private Integer effectScore;
    private Integer approveYn;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Integer reportCount;
} 