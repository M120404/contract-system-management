package com.example.clientauth.repository;

import com.example.clientauth.entity.SubContract;
import com.example.clientauth.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SubContractRepository extends JpaRepository<SubContract, Long> {
    List<SubContract> findByVendor(User vendor);
    List<SubContract> findByMainContractId(Long mainContractId);
}
