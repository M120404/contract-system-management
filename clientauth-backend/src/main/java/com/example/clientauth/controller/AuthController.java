package com.example.clientauth.controller;

import com.example.clientauth.entity.User;
import com.example.clientauth.repository.UserRepository;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private FirebaseAuth firebaseAuth;

    // 1. Firebase Google Sign-In
    @PostMapping("/google")
    public ResponseEntity<String> googleSignIn(@RequestBody TokenRequest tokenRequest) {
        return handleFirebaseSignIn(tokenRequest.getIdToken(), "Google");
    }

    // 2. Firebase Facebook Sign-In
    @PostMapping("/facebook")
    public ResponseEntity<String> facebookSignIn(@RequestBody TokenRequest tokenRequest) {
        return handleFirebaseSignIn(tokenRequest.getIdToken(), "Facebook");
    }

    // Firebase Sign-in Logic Shared
    private ResponseEntity<String> handleFirebaseSignIn(String idToken, String provider) {
        try {
            FirebaseToken decodedToken = firebaseAuth.verifyIdToken(idToken);
            String email = decodedToken.getEmail();
            String name = decodedToken.getName() != null ? decodedToken.getName() : "User";

            userRepository.findByUsername(email).orElseGet(() -> {
                User newUser = new User();
                newUser.setUsername(email);
                newUser.setName(name);
                newUser.setFirebaseUid(decodedToken.getUid());
                return userRepository.save(newUser);
            });

            return ResponseEntity.ok(provider + " authentication successful");

        } catch (FirebaseAuthException e) {
            return ResponseEntity.badRequest().body("Invalid " + provider + " token");
        }
    }

    // 3. Local Signup
    @PostMapping("/signup")
    public ResponseEntity<String> localSignup(@RequestBody SignupRequest signupRequest) {
        if (userRepository.findByUsername(signupRequest.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Username already exists");
        }

        User user = new User();
        user.setUsername(signupRequest.getUsername());
        user.setPassword(passwordEncoder.encode(signupRequest.getPassword()));
        user.setName(signupRequest.getName());

        userRepository.save(user);

        return ResponseEntity.ok("User registered successfully");
    }

    // 4. Local Login
    @PostMapping("/login")
    public ResponseEntity<String> loginLocal(@RequestBody LoginRequest loginRequest) {
        Optional<User> optionalUser = userRepository.findByUsername(loginRequest.getUsername());

        if (optionalUser.isEmpty()) {
            return ResponseEntity.badRequest().body("Invalid username or password");
        }
        
        
        
        User user = optionalUser.get();

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            return ResponseEntity.badRequest().body("Invalid username or password");
        }

        return ResponseEntity.ok("Login successful");
    }

    // DTOs
    public static class TokenRequest {
        private String idToken;
        public String getIdToken() { return idToken; }
        public void setIdToken(String idToken) { this.idToken = idToken; }
    }

    public static class SignupRequest {
        private String username;
        private String password;
        private String name;

        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }

        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
    }

    public static class LoginRequest {
        private String username;
        private String password;

        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }

        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }
}
