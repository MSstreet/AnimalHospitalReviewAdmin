package com.pethospital.admin.service;

import com.pethospital.admin.dto.ReviewDTO;
import com.pethospital.admin.model.Review;
import com.pethospital.admin.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewService {
    @Autowired
    private ReviewRepository reviewRepository;

    @Transactional(readOnly = true)
    public Page<ReviewDTO> getAllReviews(Pageable pageable) {
        return reviewRepository.findAll(pageable)
                .map(this::convertToDTO);
    }

    @Transactional(readOnly = true)
    public Page<ReviewDTO> getReviewsByHospitalId(Long hospitalId, Pageable pageable) {
        return reviewRepository.findByHospitalId(hospitalId, pageable)
                .map(this::convertToDTO);
    }

    @Transactional(readOnly = true)
    public Page<ReviewDTO> getReviewsByUserId(Long userId, Pageable pageable) {
        return reviewRepository.findByUserId(userId, pageable)
                .map(this::convertToDTO);
    }

    @Transactional(readOnly = true)
    public Page<ReviewDTO> getReviewsByApproveYn(Integer approveYn, Pageable pageable) {
        return reviewRepository.findByApproveYn(approveYn, pageable)
                .map(this::convertToDTO);
    }

    @Transactional
    public void approveReview(Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));
        review.setApproveYn(1);
        reviewRepository.save(review);
    }

    @Transactional
    public void deleteReview(Long reviewId) {
        reviewRepository.deleteById(reviewId);
    }

    private ReviewDTO convertToDTO(Review review) {
        ReviewDTO dto = new ReviewDTO();
        dto.setReviewId(review.getReviewId());
        dto.setHospitalId(review.getHospitalId());
        dto.setUserId(review.getUserId());
        dto.setContent(review.getContent());
        dto.setScore(review.getScore());
        dto.setKindnessScore(review.getKindnessScore());
        dto.setPriceScore(review.getPriceScore());
        dto.setEffectScore(review.getEffectScore());
        dto.setApproveYn(review.getApproveYn());
        dto.setCreatedAt(review.getCreatedAt());
        dto.setUpdatedAt(review.getUpdatedAt());
        return dto;
    }
} 