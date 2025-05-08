package com.softwareengineering9.toeicVoca.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ViewForwardingController {

    @GetMapping({"/", "/login"})
    public String forwardToIndex() {
        return "forward:/index.html";
    }
}