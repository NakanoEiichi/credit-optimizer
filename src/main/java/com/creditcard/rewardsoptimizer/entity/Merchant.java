package com.creditcard.rewardsoptimizer.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "merchants")
public class Merchant {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank
    private String name;
    
    @Column(name = "logo_url")
    private String logoUrl;
    
    private String category;
    
    // Constructors
    public Merchant() {}
    
    public Merchant(String name, String logoUrl, String category) {
        this.name = name;
        this.logoUrl = logoUrl;
        this.category = category;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getLogoUrl() { return logoUrl; }
    public void setLogoUrl(String logoUrl) { this.logoUrl = logoUrl; }
    
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
}