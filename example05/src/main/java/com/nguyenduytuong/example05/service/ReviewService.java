package com.nguyenduytuong.example05.service;

import java.util.List;

import com.nguyenduytuong.example05.payloads.ReviewDTO;
import com.nguyenduytuong.example05.payloads.ReviewResponse;

public interface ReviewService {
    ReviewResponse getAllReviews(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder);
    ReviewDTO getReviewById(Long reviewId);
    ReviewDTO updateReview(Long reviewId, ReviewDTO reviewDTO);
    String deleteReview(Long reviewId);
    List<ReviewDTO> getReviewsByProduct(Long productId);
    List<ReviewDTO> getReviewsByUser(Long userId);
    List<ReviewDTO> getReviewsByEmail(String email);
}
