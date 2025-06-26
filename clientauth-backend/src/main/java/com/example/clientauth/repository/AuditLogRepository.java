package com.example.clientauth.repository;

import com.example.clientauth.entity.AuditLog;
import com.example.clientauth.entity.Contract;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
	List<AuditLog> findByContractId(Long contractId);
    List<AuditLog> findByContractOrderByPerformedAtDesc(Contract contract);
}
