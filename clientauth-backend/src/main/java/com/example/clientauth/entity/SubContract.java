package com.example.clientauth.entity;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "sub_contracts")
public class SubContract {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;

    @Temporal(TemporalType.DATE)
    private Date startDate;

    @Temporal(TemporalType.DATE)
    private Date endDate;

    private Double value;

    private String status;

    @Lob
    private String terms;

    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt = new Date();

    @Temporal(TemporalType.TIMESTAMP)
    private Date updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contract_id")
    private Contract contract;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "main_contract_id")
    private Contract mainContract;

    @ManyToOne
    @JoinColumn(name = "vendor_id")
    private User vendor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_contract_id")
    private Contract parentContract;

    public SubContract() {}

    public SubContract(String title, String status, String description, Date startDate, Date endDate, Double value, Contract contract) {
        this.title = title;
        this.status = status;
        this.description = description;
        this.startDate = startDate;
        this.endDate = endDate;
        this.value = value;
        this.contract = contract;
    }


    // ======= Getters and Setters =======

    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }

    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }

    public void setDescription(String description) { this.description = description; }

    public Date getStartDate() { return startDate; }

    public void setStartDate(Date startDate) { this.startDate = startDate; }

    public Date getEndDate() { return endDate; }

    public void setEndDate(Date endDate) { this.endDate = endDate; }

    public Double getValue() { return value; }

    public void setValue(Double value) { this.value = value; }

    public String getStatus() { return status; }

    public void setStatus(String status) { this.status = status; }

    public String getTerms() { return terms; }

    public void setTerms(String terms) { this.terms = terms; }

    public Date getCreatedAt() { return createdAt; }

    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }

    public Date getUpdatedAt() { return updatedAt; }

    public void setUpdatedAt(Date updatedAt) { this.updatedAt = updatedAt; }

    public Contract getMainContract() { return mainContract; }

    public void setMainContract(Contract mainContract) { this.mainContract = mainContract; }

    public User getVendor() { return vendor; }

    public void setVendor(User vendor) { this.vendor = vendor; }
    
    public Contract getParentContract() {
        return parentContract;
    }

    public void setParentContract(Contract parentContract) {
        this.parentContract = parentContract;
    }
    
    public void setContract(Contract contract) {
        this.contract = contract;
    }

}
