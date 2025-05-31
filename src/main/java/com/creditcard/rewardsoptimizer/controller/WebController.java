package com.creditcard.rewardsoptimizer.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class WebController {
    
    @GetMapping("/")
    public String home() {
        return "index";
    }
    
    @GetMapping("/cards")
    public String cards() {
        return "cards";
    }
    
    @GetMapping("/transactions")
    public String transactions() {
        return "transactions";
    }
    
    @GetMapping("/wallet")
    public String wallet() {
        return "wallet";
    }
}