package com.example.clientauth.controller;

import com.example.clientauth.entity.ContractTemplate;
import com.example.clientauth.service.TemplateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/templates")
@CrossOrigin(origins = "http://localhost:3000")
public class TemplateController {

    @Autowired
    private TemplateService templateService;

    @PostMapping("/upload")
    public ResponseEntity<String> uploadTemplate(
            @RequestParam("templateName") String templateName,
            @RequestParam("category") String category,
            @RequestParam("version") String version,
            @RequestParam("effectiveDate") String effectiveDateStr,
            @RequestParam("templateFile") MultipartFile file
    ) {
        try {
            // Validate file extension
            String fileName = file.getOriginalFilename();
            if (fileName == null || !fileName.matches(".*\\.(pdf|doc|docx)$")) {
                return ResponseEntity.badRequest().body("Invalid file type. Only .pdf, .doc, and .docx are allowed.");
            }

            Path uploadDir = Paths.get("uploaded_templates");
            if (!Files.exists(uploadDir)) {
                Files.createDirectories(uploadDir);
            }

            String savedFileName = UUID.randomUUID() + "_" + fileName;
            Path filePath = uploadDir.resolve(savedFileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            templateService.saveTemplate(
                    templateName,
                    category,
                    version,
                    LocalDate.parse(effectiveDateStr),
                    filePath.toString()
            );

            return ResponseEntity.ok("Template uploaded successfully!");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Upload failed");
        }
    }

    @GetMapping
    public ResponseEntity<List<ContractTemplate>> getAllTemplates() {
        return ResponseEntity.ok(templateService.getAllTemplates());
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<byte[]> downloadTemplate(@PathVariable Long id) {
        try {
            ContractTemplate template = templateService.getTemplateById(id);
            if (template == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }

            Path path = Paths.get(template.getFilePath());
            byte[] content = Files.readAllBytes(path);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentDisposition(ContentDisposition.attachment()
                    .filename(path.getFileName().toString()).build());

            return new ResponseEntity<>(content, headers, HttpStatus.OK);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

}
