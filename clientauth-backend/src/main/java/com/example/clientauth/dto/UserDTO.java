package com.example.clientauth.dto;

public class UserDTO {
    private Long id;
    private String username;
    private String name;

    public UserDTO(Long id, String username, String name) {
        this.id = id;
        this.username = username;
        this.name = name;
    }

    // Getters
    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public String getName() {
        return name;
    }
}
