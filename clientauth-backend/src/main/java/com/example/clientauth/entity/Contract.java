package com.example.clientauth.entity;

import jakarta.persistence.*;
import java.util.Date;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
@Table(name = "contracts")
public class Contract {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String customer;
    @Column(name = "contract_number")
    private String contractNumber;
    @JsonProperty("contract_type")
    private String contractType;

    private String rep;
    
    @Column(name = "firebase_uid")
    private String firebaseUid;

    

    @Temporal(TemporalType.DATE)
    private Date effectiveDate;

    private String invoiceTiming;

    @Temporal(TemporalType.DATE)
    private Date lastStatementDate;

    @Temporal(TemporalType.DATE)
    private Date lastInvoicedDate;

    private Double unusedAmount;
    private Double overageAmount;
    private String description;

    @Temporal(TemporalType.DATE)
    private Date startDate;

    @Temporal(TemporalType.DATE)
    private Date endDate;

    private Double value;
    private String terms;
    private String specialConditions;

    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;

    @Temporal(TemporalType.TIMESTAMP)
    private Date updatedAt;

    private Boolean isRenewal;

    private Long parentContractID;

    @ManyToOne
    @JoinColumn(name = "created_by")
    private User createdBy;

    @ManyToOne
    @JoinColumn(name = "reviewer_id")
    private User reviewer;

    @ManyToOne
    @JoinColumn(name = "template_id")
    private ContractTemplate contractTemplate;

    @OneToMany(mappedBy = "contract", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SubContract> subContracts;

    private String reviewerEmail;

    @Enumerated(EnumType.STRING)
    private ContractStatus status = ContractStatus.DRAFT;

    // Getters and Setters

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getCustomer() { return customer; }
    public void setCustomer(String customer) { this.customer = customer; }

    public String getContractNumber() { return contractNumber; }
    public void setContractNumber(String contractNumber) { this.contractNumber = contractNumber; }

    public String getContractType() { return contractType; }
    public void setContractType(String contractType) { this.contractType = contractType; }

    public String getRep() { return rep; }
    public void setRep(String rep) { this.rep = rep; }

    public Date getEffectiveDate() { return effectiveDate; }
    public void setEffectiveDate(Date effectiveDate) { this.effectiveDate = effectiveDate; }

    public String getInvoiceTiming() { return invoiceTiming; }
    public void setInvoiceTiming(String invoiceTiming) { this.invoiceTiming = invoiceTiming; }

    public Date getLastStatementDate() { return lastStatementDate; }
    public void setLastStatementDate(Date lastStatementDate) { this.lastStatementDate = lastStatementDate; }

    public Date getLastInvoicedDate() { return lastInvoicedDate; }
    public void setLastInvoicedDate(Date lastInvoicedDate) { this.lastInvoicedDate = lastInvoicedDate; }

    public Double getUnusedAmount() { return unusedAmount; }
    public void setUnusedAmount(Double unusedAmount) { this.unusedAmount = unusedAmount; }

    public Double getOverageAmount() { return overageAmount; }
    public void setOverageAmount(Double overageAmount) { this.overageAmount = overageAmount; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Date getStartDate() { return startDate; }
    public void setStartDate(Date startDate) { this.startDate = startDate; }

    public Date getEndDate() { return endDate; }
    public void setEndDate(Date endDate) { this.endDate = endDate; }

    public Double getValue() { return value; }
    public void setValue(Double value) { this.value = value; }

    public String getTerms() { return terms; }
    public void setTerms(String terms) { this.terms = terms; }

    public String getSpecialConditions() { return specialConditions; }
    public void setSpecialConditions(String specialConditions) { this.specialConditions = specialConditions; }

    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }

    public Date getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Date updatedAt) { this.updatedAt = updatedAt; }

    public Boolean getIsRenewal() { return isRenewal; }
    public void setIsRenewal(Boolean isRenewal) { this.isRenewal = isRenewal; }

    public Long getParentContractID() { return parentContractID; }
    public void setParentContractID(Long parentContractID) { this.parentContractID = parentContractID; }

    public User getCreatedBy() { return createdBy; }
    public void setCreatedBy(User createdBy) { this.createdBy = createdBy; }

    public User getReviewer() { return reviewer; }
    public void setReviewer(User reviewer) { this.reviewer = reviewer; }

    public ContractTemplate getContractTemplate() { return contractTemplate; }
    public void setContractTemplate(ContractTemplate contractTemplate) { this.contractTemplate = contractTemplate; }

    public List<SubContract> getSubContracts() { return subContracts; }
    public void setSubContracts(List<SubContract> subContracts) { this.subContracts = subContracts; }

    public String getReviewerEmail() { return reviewerEmail; }
    public void setReviewerEmail(String reviewerEmail) { this.reviewerEmail = reviewerEmail; }

    public ContractStatus getStatus() { return status; }
    public void setStatus(ContractStatus status) { this.status = status; }
}
