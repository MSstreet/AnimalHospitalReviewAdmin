package com.pethospital.admin.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "report")
public class Report {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long reportId;

    @Column(nullable = false)
    private Long reviewId;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private Integer reportReason; // 1: 스팸/홍보, 2: 혐오 발언, 3: 허위 정보

    @Column
    private String reportDetail;

    @Column(nullable = false)
    private Integer status = 0; // 0: 처리 대기, 1: 처리 완료

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
} 