package com.example.clientauth.entity;

import jakarta.persistence.*;
import java.util.Date;

@Entity
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String action; // e.g., "Status changed", "Field updated"
    private String fieldName;
    private String oldValue;
    private String newValue;

    @ManyToOne
    private Contract contract;

    @ManyToOne
    private User performedBy;

    @Temporal(TemporalType.TIMESTAMP)
    private Date performedAt;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }

    public String getFieldName() { return fieldName; }
    public void setFieldName(String fieldName) { this.fieldName = fieldName; }

    public String getOldValue() { return oldValue; }
    public void setOldValue(String oldValue) { this.oldValue = oldValue; }

    public String getNewValue() { return newValue; }
    public void setNewValue(String newValue) { this.newValue = newValue; }

    public Contract getContract() { return contract; }
    public void setContract(Contract contract) { this.contract = contract; }

    public User getPerformedBy() { return performedBy; }
    public void setPerformedBy(User performedBy) { this.performedBy = performedBy; }

    public Date getPerformedAt() { return performedAt; }
    public void setPerformedAt(Date performedAt) { this.performedAt = performedAt; }
        
}
