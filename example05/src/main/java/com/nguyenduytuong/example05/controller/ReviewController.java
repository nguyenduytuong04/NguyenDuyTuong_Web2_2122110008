package com.nguyenduytuong.example05.controller;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.nguyenduytuong.example05.config.AppConstants;
import com.nguyenduytuong.example05.payloads.ReviewDTO;
import com.nguyenduytuong.example05.payloads.ReviewResponse;
import com.nguyenduytuong.example05.service.ReviewService;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@SecurityRequirement(name = "E-Commerce Application")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    // 1️⃣ API: Lấy danh sách tất cả đánh giá (chỉ Admin)
    @GetMapping("/admin")
    public ResponseEntity<ReviewResponse> getReviews(
            @RequestParam(name = "pageNumber", defaultValue = AppConstants.PAGE_NUMBER, required = false) Integer pageNumber,
            @RequestParam(name = "pageSize", defaultValue = AppConstants.PAGE_SIZE, required = false) Integer pageSize,
            @RequestParam(name = "sortBy", defaultValue = AppConstants.SORT_REVIEWS_BY, required = false) String sortBy,
            @RequestParam(name = "sortOrder", defaultValue = AppConstants.SORT_DIR, required = false) String sortOrder) {
        ReviewResponse reviewResponse = reviewService.getAllReviews(pageNumber, pageSize, sortBy, sortOrder);
        return ResponseEntity.ok(reviewResponse);
    }

    // 2️⃣ API: Lấy một đánh giá theo ID
    @GetMapping("/{reviewId}")
    public ResponseEntity<ReviewDTO> getReview(@PathVariable Long reviewId) {
        ReviewDTO review = reviewService.getReviewById(reviewId);
        return ResponseEntity.ok(review);
    }

    // 3️⃣ API: Cập nhật đánh giá (chỉ khách hàng sở hữu đánh giá mới được sửa)
    @PutMapping("/{reviewId}")
    public ResponseEntity<ReviewDTO> updateReview(@RequestBody ReviewDTO reviewDTO, @PathVariable Long reviewId) {
        ReviewDTO updatedReview = reviewService.updateReview(reviewId, reviewDTO);
        return ResponseEntity.ok(updatedReview);
    }

    // 4️⃣ API: Xóa đánh giá (Admin hoặc chủ đánh giá mới được xóa)
    @DeleteMapping("/admin/{reviewId}")
    public ResponseEntity<String> deleteReview(@PathVariable Long reviewId) {
        String status = reviewService.deleteReview(reviewId);
        return ResponseEntity.ok(status);
    }

    // 5️⃣ API: Lấy danh sách đánh giá theo sản phẩm
    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ReviewDTO>> getReviewsByProduct(@PathVariable Long productId) {
        List<ReviewDTO> reviews = reviewService.getReviewsByProduct(productId);
        return ResponseEntity.ok(reviews);
    }

    // 6️⃣ API: Lấy danh sách đánh giá theo User ID
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ReviewDTO>> getReviewsByUser(@PathVariable Long userId) {
        List<ReviewDTO> reviews = reviewService.getReviewsByUser(userId);
        return ResponseEntity.ok(reviews);
    }

    // 7️⃣ API: Lấy danh sách đánh giá theo email (nếu cần)
    @GetMapping("/user/email/{email}")
    public ResponseEntity<List<ReviewDTO>> getReviewsByEmail(@PathVariable String email) {
        List<ReviewDTO> reviews = reviewService.getReviewsByEmail(email);
        return ResponseEntity.ok(reviews);
    }
}
