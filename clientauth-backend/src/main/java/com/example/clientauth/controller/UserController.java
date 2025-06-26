package com.example.clientauth.controller;

import com.example.clientauth.dto.UserDTO;
import com.example.clientauth.entity.User;
import com.example.clientauth.repository.UserRepository;
import com.example.clientauth.service.FirebaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FirebaseService firebaseService;

    // Returns local database users
    @GetMapping
    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(user -> new UserDTO(user.getId(), user.getUsername(), user.getName()))
                .collect(Collectors.toList());
    }

    // Returns reviewers from local database
    @GetMapping("/reviewers")
    public List<User> getReviewers() {
        return userRepository.findUsersByRoleName("REVIEWER");
    }

    // Returns Firebase user emails
    @GetMapping("/firebase")
    public List<String> getAllFirebaseUsers() {
        return firebaseService.getAllUserEmails();
    }
}
