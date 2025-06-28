package com.example.clientauth.controller;

import com.example.clientauth.dto.ContractDTO;
import com.example.clientauth.entity.*;
import com.example.clientauth.repository.*;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/contracts")
@CrossOrigin(origins = "http://localhost:3000")
public class ContractController {

    @Autowired
    private ContractRepository contractRepository;

    @Autowired
    private ContractTemplateRepository templateRepository;

    @Autowired
    private SubContractRepository subcontractRepository;

    @Autowired
    private UserRepository userRepository;

    private final SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

    private Date safeParseDate(String dateStr) {
        try {
            return (dateStr != null && !dateStr.trim().isEmpty()) ? sdf.parse(dateStr) : null;
        } catch (Exception e) {
            return null;
        }
    }

    private ContractDTO convertToDTO(Contract contract) {
        ContractDTO dto = new ContractDTO();
        dto.setId(contract.getId());
        dto.setTitle(contract.getTitle());
        dto.setCustomer(contract.getCustomer());
        dto.setContractNumber(contract.getContractNumber());
        dto.setContractType(contract.getContractType());
        dto.setCreatedByEmail(contract.getCreatedBy() != null ? contract.getCreatedBy().getEmail() : null);
        dto.setRep(contract.getRep());
        dto.setInvoiceTiming(contract.getInvoiceTiming());
        dto.setDescription(contract.getDescription());

        if (contract.getEffectiveDate() != null)
            dto.setEffectiveDate(sdf.format(contract.getEffectiveDate()));
        if (contract.getLastInvoicedDate() != null)
            dto.setLastInvoicedDate(sdf.format(contract.getLastInvoicedDate()));
        if (contract.getLastStatementDate() != null)
            dto.setLastStatementDate(sdf.format(contract.getLastStatementDate()));

        dto.setUnusedAmount(contract.getUnusedAmount());
        dto.setOverageAmount(contract.getOverageAmount());
        dto.setStatus(contract.getStatus() != null ? contract.getStatus().name() : null);

        if (contract.getContractTemplate() != null)
            dto.setContractTemplateId(contract.getContractTemplate().getId());

        if (contract.getSubContracts() != null) {
            List<Long> subIds = contract.getSubContracts().stream()
                    .map(SubContract::getId)
                    .collect(Collectors.toList());
            dto.setSubcontractIds(subIds);
        }

        return dto;
    }

    @GetMapping("/my-auth")
    public ResponseEntity<List<ContractDTO>> getMyContractsByToken(@RequestHeader("Authorization") String authorizationHeader) {
        try {
            String idToken = authorizationHeader.replace("Bearer ", "");
            FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(idToken);
            String email = decodedToken.getEmail();

            List<User> userList = userRepository.findByEmail(email);
            if (userList.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }

            User user = userList.get(0);
            List<Contract> contracts = contractRepository.findByCreatedBy(user);
            List<ContractDTO> dtos = contracts.stream().map(this::convertToDTO).collect(Collectors.toList());

            return ResponseEntity.ok(dtos);
        } catch (Exception e) {
            e.printStackTrace(); // Debugging Firebase token issues
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @GetMapping
    public List<ContractDTO> getAllContracts() {
        return contractRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @GetMapping("/search")
    public List<ContractDTO> searchContracts(@RequestParam(required = false) Long id,
                                             @RequestParam(required = false) String title) {
        List<Contract> result;
        if (id != null) {
            result = contractRepository.findById(id).map(List::of).orElse(List.of());
        } else if (title != null && !title.isEmpty()) {
            result = contractRepository.findByTitleContainingIgnoreCase(title);
        } else {
            result = contractRepository.findAll();
        }

        return result.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @PostMapping("/{id}/assign-reviewer")
    public ResponseEntity<?> assignReviewer(@PathVariable Long id, @RequestParam String username) {
        Optional<Contract> contractOpt = contractRepository.findById(id);
        Optional<User> reviewerOpt = userRepository.findByUsername(username);

        if (contractOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Contract not found");
        }

        Contract contract = contractOpt.get();
        contract.setReviewerEmail(username);
        reviewerOpt.ifPresent(contract::setReviewer);
        contract.setStatus(ContractStatus.PENDING_REVIEW);
        contractRepository.save(contract);

        return ResponseEntity.ok("Reviewer assigned and contract set to PENDING_REVIEW");
    }

    @PostMapping
    public ResponseEntity<?> createContract(
            @RequestBody ContractDTO contractDTO,
            @RequestHeader("Authorization") String token) {
        try {
            List<User> userList = userRepository.findByEmail(contractDTO.getCreatedByEmail());
            if (userList.isEmpty()) {
                return ResponseEntity.badRequest().body("Invalid user email: " + contractDTO.getCreatedByEmail());
            }

            User user = userList.get(0);

            Contract contract = new Contract();
            contract.setCreatedBy(user);
            contract.setStatus(ContractStatus.DRAFT);
            contract.setCreatedAt(new Date());
            contract.setTitle(contractDTO.getTitle());
            contract.setCustomer(contractDTO.getCustomer());
            contract.setContractNumber(contractDTO.getContractNumber());
            contract.setContractType(contractDTO.getContractType());
            contract.setRep(contractDTO.getRep());
            contract.setInvoiceTiming(contractDTO.getInvoiceTiming());
            contract.setDescription(contractDTO.getDescription());

            contract.setEffectiveDate(safeParseDate(contractDTO.getEffectiveDate()));
            contract.setLastStatementDate(safeParseDate(contractDTO.getLastStatementDate()));
            contract.setLastInvoicedDate(safeParseDate(contractDTO.getLastInvoicedDate()));

            contract.setUnusedAmount(contractDTO.getUnusedAmount() != null ? contractDTO.getUnusedAmount() : 0.0);
            contract.setOverageAmount(contractDTO.getOverageAmount() != null ? contractDTO.getOverageAmount() : 0.0);

            if (contractDTO.getContractTemplateId() != null) {
                templateRepository.findById(contractDTO.getContractTemplateId())
                        .ifPresent(contract::setContractTemplate);
            }

            if (contractDTO.getSubcontractIds() != null && !contractDTO.getSubcontractIds().isEmpty()) {
                List<SubContract> subcontracts = subcontractRepository.findAllById(contractDTO.getSubcontractIds());
                for (SubContract subcontract : subcontracts) {
                    subcontract.setContract(contract);
                }
                contract.setSubContracts(subcontracts);
            }

            Contract saved = contractRepository.save(contract);
            return ResponseEntity.ok(convertToDTO(saved));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error creating contract: " + e.getMessage());
        }
    }

    @GetMapping("/my")
    public ResponseEntity<?> getMyContracts(@RequestParam String email) {
        List<User> userList = userRepository.findByEmail(email);
        if (userList.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found: " + email);
        }

        User user = userList.get(0);
        List<Contract> contracts = contractRepository.findByCreatedBy(user);
        List<ContractDTO> contractDTOs = contracts.stream().map(this::convertToDTO).collect(Collectors.toList());

        return ResponseEntity.ok(contractDTOs);
    }

    @GetMapping("/status/{status}")
    public List<ContractDTO> getContractsByStatus(@PathVariable String status) {
        return contractRepository.findByStatus(status.toUpperCase()).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @PostMapping("/{id}/submit")
    public ResponseEntity<?> submitForReview(@PathVariable Long id) {
        Optional<Contract> contractOpt = contractRepository.findById(id);
        if (contractOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Contract not found");
        }

        Contract contract = contractOpt.get();
        contract.setStatus(ContractStatus.PENDING_REVIEW);
        contract.setUpdatedAt(new Date());

        Contract updated = contractRepository.save(contract);
        return ResponseEntity.ok(convertToDTO(updated));
    }

    @PostMapping("/{id}/renew")
    public ResponseEntity<?> renewContract(@PathVariable Long id,
                                           @RequestBody Contract request,
                                           @RequestParam String createdBy) {
        Optional<Contract> originalOpt = contractRepository.findById(id);
        Optional<User> userOpt = userRepository.findByUsername(createdBy);

        if (originalOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Original contract not found");
        }
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid user: " + createdBy);
        }

        Contract original = originalOpt.get();
        Contract renewed = new Contract();

        renewed.setTitle(request.getTitle() != null ? request.getTitle() : original.getTitle() + " (Renewal)");
        renewed.setDescription(original.getDescription());
        renewed.setContractType(original.getContractType());
        renewed.setStatus(ContractStatus.DRAFT);
        renewed.setStartDate(request.getStartDate());
        renewed.setEndDate(request.getEndDate());
        renewed.setValue(request.getValue() != null ? request.getValue() : original.getValue());
        renewed.setTerms(original.getTerms());
        renewed.setSpecialConditions(original.getSpecialConditions());
        renewed.setCreatedBy(userOpt.get());
        renewed.setCreatedAt(new Date());
        renewed.setReviewer(original.getReviewer());
        renewed.setReviewerEmail(original.getReviewerEmail());
        renewed.setIsRenewal(true);
        renewed.setParentContractID(original.getId());
        renewed.setContractTemplate(original.getContractTemplate());

        Contract savedRenewed = contractRepository.save(renewed);
        return ResponseEntity.ok(convertToDTO(savedRenewed));
    }
}
