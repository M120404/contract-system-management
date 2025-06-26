package com.example.clientauth.service;

import com.google.firebase.auth.*;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class FirebaseService {

    public List<String> getAllUserEmails() {
        List<String> emails = new ArrayList<>();
        try {
            ListUsersPage page = FirebaseAuth.getInstance().listUsers(null);
            for (ExportedUserRecord user : page.iterateAll()) {
                if (user.getEmail() != null) {
                    emails.add(user.getEmail());
                }
            }
        } catch (FirebaseAuthException e) {
            e.printStackTrace();
        }
        return emails;
    }
    public FirebaseToken verifyToken(String idToken) throws Exception {
        return FirebaseAuth.getInstance().verifyIdToken(idToken);
    }
}
