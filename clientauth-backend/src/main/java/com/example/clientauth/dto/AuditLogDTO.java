package com.example.clientauth.dto;

import java.util.Date;

public class AuditLogDTO {
    private String action;
    private String fieldName;
    private String oldValue;
    private String newValue;
    private String performedBy;
    private Date performedAt;

    public AuditLogDTO(String action, String fieldName, String oldValue, String newValue, String performedBy, Date performedAt) {
        this.action = action;
        this.fieldName = fieldName;
        this.oldValue = oldValue;
        this.newValue = newValue;
        this.performedBy = performedBy;
        this.performedAt = performedAt;
    }

    // Getters
    public String getAction() {
        return action;
    }

    public String getFieldName() {
        return fieldName;
    }

    public String getOldValue() {
        return oldValue;
    }

    public String getNewValue() {
        return newValue;
    }

    public String getPerformedBy() {
        return performedBy;
    }

    public Date getPerformedAt() {
        return performedAt;
    }
}
