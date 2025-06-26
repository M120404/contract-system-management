package com.example.clientauth.service;

import com.example.clientauth.entity.ContractTemplate;
import com.example.clientauth.repository.ContractTemplateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class TemplateService {

    @Autowired
    private ContractTemplateRepository templateRepository;

    public List<ContractTemplate> getAllTemplates() {
        return templateRepository.findAll();
    }

    public ContractTemplate getTemplateById(Long id) {
        return templateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Template not found with ID: " + id));
    }

    public ContractTemplate saveTemplate(String templateName, String category, String version,
                                         LocalDate effectiveDate, String filePath) {
        ContractTemplate template = new ContractTemplate();
        template.setName(templateName);
        template.setCategory(category);
        template.setVersion(version);
        template.setEffectiveDate(effectiveDate);
        template.setTemplateFilePath(filePath);
        return templateRepository.save(template);
    }
}
