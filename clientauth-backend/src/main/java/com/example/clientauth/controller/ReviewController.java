package com.example.clientauth.controller;

import com.example.clientauth.service.ContractService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import com.example.clientauth.model.AssignReviewRequest;
import com.example.clientauth.service.ReviewService;


@RestController
@RequestMapping("/reviews")
@CrossOrigin(origins = "http://localhost:3000")
public class ReviewController {

    @Autowired
    private ContractService contractService;

    @PostMapping("/assign")
    public ResponseEntity<String> assignForReview(
            @RequestParam Long contractId,
            @RequestParam Long reviewerId
    ) {
        try {
            contractService.assignForReview(contractId, reviewerId);
            return ResponseEntity.ok("Contract assigned for review to user ID: " + reviewerId);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to assign contract for review");
        }
    }
    
    @Autowired
    private ReviewService reviewService;

    @PostMapping("/{contractId}/assign-review")
    public String assignContractForReview(
            @PathVariable Long contractId,
            @RequestBody AssignReviewRequest request
    ) {
        reviewService.assignContractToReviewer(contractId, request.getReviewerId());
        return "Contract assigned to reviewer successfully.";
    }
}
