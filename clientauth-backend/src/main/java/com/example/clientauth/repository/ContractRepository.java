package com.example.clientauth.repository;

import com.example.clientauth.entity.Contract;

import com.example.clientauth.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface ContractRepository extends JpaRepository<Contract, Long> {

    List<Contract> findByCreatedBy(User createdBy);

    List<Contract> findByStatus(String status);
    
    List<Contract> findByTitleContainingIgnoreCase(String title);
    
    List<Contract> findByFirebaseUid(String firebaseUid);
	    
}

