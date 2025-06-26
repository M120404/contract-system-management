package com.example.clientauth.controller;

import com.example.clientauth.dto.AuditLogDTO;
import com.example.clientauth.entity.AuditLog;
import com.example.clientauth.repository.AuditLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/audit-logs")
public class AuditLogController {

    @Autowired
    private AuditLogRepository auditLogRepository;

    @GetMapping
    public List<AuditLogDTO> getAllLogs() {
        return auditLogRepository.findAll().stream()
                .map(log -> new AuditLogDTO(
                        log.getAction(),
                        log.getFieldName(),
                        log.getOldValue(),
                        log.getNewValue(),
                        log.getPerformedBy().getUsername(),
                        log.getPerformedAt()
                ))
                .collect(Collectors.toList());
    }
    @GetMapping("/contract/{contractId}")
    public List<AuditLog> getLogsForContract(@PathVariable Long contractId) {
        return auditLogRepository.findByContractId(contractId);
    }
}
