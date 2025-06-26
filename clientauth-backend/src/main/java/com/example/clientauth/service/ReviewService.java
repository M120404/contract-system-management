package com.example.clientauth.service;

import com.example.clientauth.entity.Contract;
import com.example.clientauth.entity.ContractStatus;
import com.example.clientauth.entity.User;
import com.example.clientauth.repository.ContractRepository;
import com.example.clientauth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ReviewService {

    @Autowired
    private ContractRepository contractRepository;

    @Autowired
    private UserRepository userRepository;

    public void assignContractToReviewer(Long contractId, Long reviewerId) {
        Optional<Contract> optionalContract = contractRepository.findById(contractId);
        Optional<User> optionalUser = userRepository.findById(reviewerId);

        if (optionalContract.isEmpty() || optionalUser.isEmpty()) {
            throw new RuntimeException("Contract or Reviewer not found.");
        }

        Contract contract = optionalContract.get();
        User reviewer = optionalUser.get();

        contract.setReviewer(reviewer);
        contract.setStatus(ContractStatus.valueOf("PENDING_REVIEW"));

        contractRepository.save(contract);
    }
}
