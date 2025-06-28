package com.example.clientauth.dto;

import java.util.List;

public class ContractDTO {
    private Long id; // ✅ Needed for frontend to identify/edit/delete contracts
    private String title;
    private String customer;
    private String contractNumber;
    private String contractType;
    private String rep;
    private String effectiveDate;
    private String invoiceTiming;
    private String lastStatementDate;
    private String lastInvoicedDate;
    private Double unusedAmount;
    private Double overageAmount;
    private String description;
    private Long contractTemplateId;
    private String createdByEmail;
    private String status; // ✅ Needed to show status like DRAFT, PENDING_REVIEW, etc.
    private List<Long> subcontractIds;

    // ✅ Getters and Setters for all fields

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getCustomer() {
        return customer;
    }

    public void setCustomer(String customer) {
        this.customer = customer;
    }

    public String getContractNumber() {
        return contractNumber;
    }

    public void setContractNumber(String contractNumber) {
        this.contractNumber = contractNumber;
    }

    public String getContractType() {
        return contractType;
    }

    public void setContractType(String contractType) {
        this.contractType = contractType;
    }

    public String getRep() {
        return rep;
    }

    public void setRep(String rep) {
        this.rep = rep;
    }

    public String getEffectiveDate() {
        return effectiveDate;
    }

    public void setEffectiveDate(String effectiveDate) {
        this.effectiveDate = effectiveDate;
    }

    public String getInvoiceTiming() {
        return invoiceTiming;
    }

    public void setInvoiceTiming(String invoiceTiming) {
        this.invoiceTiming = invoiceTiming;
    }

    public String getLastStatementDate() {
        return lastStatementDate;
    }

    public void setLastStatementDate(String lastStatementDate) {
        this.lastStatementDate = lastStatementDate;
    }

    public String getLastInvoicedDate() {
        return lastInvoicedDate;
    }

    public void setLastInvoicedDate(String lastInvoicedDate) {
        this.lastInvoicedDate = lastInvoicedDate;
    }

    public Double getUnusedAmount() {
        return unusedAmount;
    }

    public void setUnusedAmount(Double unusedAmount) {
        this.unusedAmount = unusedAmount;
    }

    public Double getOverageAmount() {
        return overageAmount;
    }

    public void setOverageAmount(Double overageAmount) {
        this.overageAmount = overageAmount;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Long getContractTemplateId() {
        return contractTemplateId;
    }

    public void setContractTemplateId(Long contractTemplateId) {
        this.contractTemplateId = contractTemplateId;
    }

    public String getCreatedByEmail() {
        return createdByEmail;
    }

    public void setCreatedByEmail(String createdByEmail) {
        this.createdByEmail = createdByEmail;
    }

    public List<Long> getSubcontractIds() {
        return subcontractIds;
    }

    public void setSubcontractIds(List<Long> subcontractIds) {
        this.subcontractIds = subcontractIds;
    }
}
