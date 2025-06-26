package com.example.clientauth.service;

import com.example.clientauth.entity.Contract;

import com.example.clientauth.entity.User;
import com.example.clientauth.entity.AuditLog;
import com.example.clientauth.repository.ContractRepository;
import com.example.clientauth.repository.UserRepository;
import com.example.clientauth.repository.AuditLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Optional;
import java.util.*;

@Service
public class ContractService {

    @Autowired
    private ContractRepository contractRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuditLogRepository auditLogRepository;

    public void assignForReview(Long contractId, Long reviewerId) {
        Optional<Contract> contractOpt = contractRepository.findById(contractId);
        Optional<User> userOpt = userRepository.findById(reviewerId);

        if (contractOpt.isPresent() && userOpt.isPresent()) {
            Contract contract = contractOpt.get();
            User reviewer = userOpt.get();

            contract.setReviewer(reviewer);
            contractRepository.save(contract);

            // Save audit log
            saveAuditLog("Assigned for Review", "reviewerId", "none", reviewer.getUsername(), contract, reviewer);
        } else {
            throw new RuntimeException("Contract or Reviewer not found");
        }
    }

    private void saveAuditLog(String action, String fieldName, String oldValue, String newValue,
                              Contract contract, User user) {
        AuditLog log = new AuditLog();
        log.setAction(action);
        log.setFieldName(fieldName);
        log.setOldValue(oldValue);
        log.setNewValue(newValue);
        log.setContract(contract);
        log.setPerformedBy(user);
        log.setPerformedAt(new Date());
        auditLogRepository.save(log);
    }
    
    public List<Contract> getContractsByFirebaseUid(String uid) {
        return contractRepository.findByFirebaseUid(uid);
    }
}
