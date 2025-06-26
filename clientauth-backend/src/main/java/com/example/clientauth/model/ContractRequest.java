// src/main/java/com/example/clientauth/model/ContractRequest.java

package com.example.clientauth.model;

import java.time.LocalDate;
import java.util.List;

public class ContractRequest {
    public String title;
    public String customer;
    public String contractNumber;
    public String contractType;
    public String rep;
    public LocalDate effectiveDate;
    public String invoiceTiming;
    public LocalDate lastStatementDate;
    public LocalDate lastInvoicedDate;
    public Double unusedAmount;
    public Double overageAmount;
    public Long contractTemplateId;
    public String description;
    public List<Long> subcontractIds;
}
