package com.nguyenduytuong.example05.service.impl;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import com.nguyenduytuong.example05.entity.Review;
import com.nguyenduytuong.example05.payloads.ReviewDTO;
import com.nguyenduytuong.example05.payloads.ReviewResponse;
import com.nguyenduytuong.example05.repository.ReviewRepository;
import com.nguyenduytuong.example05.service.ReviewService;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final ModelMapper modelMapper;

    @Autowired
    public ReviewServiceImpl(ReviewRepository reviewRepository, ModelMapper modelMapper) {
        this.reviewRepository = reviewRepository;
        this.modelMapper = modelMapper;
    }

    @Override
    public ReviewResponse getAllReviews(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder) {
        Sort sort = sortOrder.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(pageNumber, pageSize, sort);
        Page<Review> pageReviews = reviewRepository.findAll(pageable);

        List<ReviewDTO> reviewDTOs = pageReviews.getContent()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());

        return ReviewResponse.builder()
                .reviews(reviewDTOs)
                .pageNumber(pageReviews.getNumber())
                .pageSize(pageReviews.getSize())
                .totalElements(pageReviews.getTotalElements())
                .totalPages(pageReviews.getTotalPages())
                .lastPage(pageReviews.isLast())
                .build();
    }

    @Override
    public ReviewDTO getReviewById(Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found with ID: " + reviewId));
        return convertToDTO(review);
    }

    @Override
    public ReviewDTO updateReview(Long reviewId, ReviewDTO reviewDTO) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found with ID: " + reviewId));

        review.setContent(reviewDTO.getContent());
        review.setRating(reviewDTO.getRating());
        review.setUpdatedAt(java.time.LocalDateTime.now());

        Review updatedReview = reviewRepository.save(review);
        return convertToDTO(updatedReview);
    }

    @Override
    public String deleteReview(Long reviewId) {
        reviewRepository.deleteById(reviewId);
        return "Review deleted successfully!";
    }

    @Override
    public List<ReviewDTO> getReviewsByProduct(Long productId) {
        return reviewRepository.findByProduct_ProductId(productId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ReviewDTO> getReviewsByUser(Long userId) {
        return reviewRepository.findByUser_UserId(userId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ReviewDTO> getReviewsByEmail(String email) {
        return reviewRepository.findByUserEmail(email)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private ReviewDTO convertToDTO(Review review) {
        return ReviewDTO.builder()
                .id(review.getId())
                .content(review.getContent())
                .rating(review.getRating())
                .userId(review.getUser().getUserId())
                .userName(review.getUser().getFirstName())
                .productId(review.getProduct().getProductId())
                .productName(review.getProduct().getProductName())
                .createdAt(review.getCreatedAt())
                .updatedAt(review.getUpdatedAt())
                .build();
    }
}
