package com.example.clientauth.controller;

import com.example.clientauth.entity.SubContract;
import com.example.clientauth.entity.Contract;
import com.example.clientauth.entity.User;
import com.example.clientauth.exception.ResourceNotFoundException;
import com.example.clientauth.repository.SubContractRepository;
import com.example.clientauth.repository.ContractRepository;
//import com.example.clientauth.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/subcontracts")
@CrossOrigin(origins = "*")
public class SubContractController {

    @Autowired
    private SubContractRepository subContractRepository;

    @Autowired
    private ContractRepository contractRepository;

    /*@Autowired
    private UserRepository userRepository;*/

    @PostMapping
    public ResponseEntity<?> createSubContract(@RequestBody SubContract subContract, Authentication authentication) {
        try {
            User vendor = (User) authentication.getPrincipal(); // Custom User set by FirebaseAuthenticationFilter
            subContract.setVendor(vendor);
            subContract.setCreatedAt(new Date());
            subContract.setUpdatedAt(new Date());
            subContract.setStatus("DRAFT");

            // If main contract is provided
            if (subContract.getMainContract() != null && subContract.getMainContract().getId() != null) {
                Contract parent = contractRepository.findById(subContract.getMainContract().getId())
                        .orElseThrow(() -> new ResourceNotFoundException("Main contract not found"));
                subContract.setMainContract(parent);
            }

            SubContract saved = subContractRepository.save(subContract);
            return ResponseEntity.ok(saved);

        } catch (Exception ex) {
            return ResponseEntity.badRequest().body("Error creating subcontract: " + ex.getMessage());
        }
    }

    @PostMapping("/contracts/{contractId}")
    public ResponseEntity<SubContract> createSubContractUnderContract(
            @PathVariable Long contractId,
            @RequestBody SubContract subContractData,
            Authentication authentication
    ) {
        Contract parentContract = contractRepository.findById(contractId)
                .orElseThrow(() -> new ResourceNotFoundException("Contract not found with ID " + contractId));

        SubContract subContract = new SubContract();
        subContract.setTitle(subContractData.getTitle());
        subContract.setDescription(subContractData.getDescription());
        subContract.setStartDate(subContractData.getStartDate());
        subContract.setEndDate(subContractData.getEndDate());
        subContract.setValue(subContractData.getValue());
        subContract.setTerms(subContractData.getTerms());
        subContract.setCreatedAt(new Date());
        subContract.setUpdatedAt(new Date());
        subContract.setStatus("DRAFT");

        subContract.setMainContract(parentContract);
        subContract.setVendor((User) authentication.getPrincipal());

        SubContract saved = subContractRepository.save(subContract);
        return ResponseEntity.ok(saved);
    }

    @GetMapping
    public List<SubContract> getAll() {
        return subContractRepository.findAll();
    }

    // ✅ Get subcontract by ID
    @GetMapping("/{id}")
    public SubContract getOne(@PathVariable Long id) {
        return subContractRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subcontract not found"));
    }

    // ✅ Get subcontracts by authenticated user
    @GetMapping("/my")
    public List<SubContract> getMySubContracts(Authentication authentication) {
        return subContractRepository.findByVendor((User) authentication.getPrincipal());
    }

    // ✅ Get subcontracts under a specific main contract
    @GetMapping("/contract/{contractId}")
    public List<SubContract> getByMainContract(@PathVariable Long contractId) {
        return subContractRepository.findByMainContractId(contractId);
    }

    // ✅ Update subcontract
    @PutMapping("/{id}")
    public SubContract update(@PathVariable Long id, @RequestBody SubContract updated) {
        SubContract existing = subContractRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subcontract not found"));

        existing.setTitle(updated.getTitle());
        existing.setDescription(updated.getDescription());
        existing.setStartDate(updated.getStartDate());
        existing.setEndDate(updated.getEndDate());
        existing.setValue(updated.getValue());
        existing.setStatus(updated.getStatus());
        existing.setTerms(updated.getTerms());
        existing.setUpdatedAt(new Date());

        return subContractRepository.save(existing);
    }

    // ✅ Delete subcontract
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        SubContract subContract = subContractRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subcontract not found"));
        subContractRepository.delete(subContract);
    }
}
