package com.example.clientauth.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class WebController {

    @GetMapping("/")
    public String index() {
        // This forwards the request to index.html inside /static folder
        return "forward:/index.html";
    }
}
