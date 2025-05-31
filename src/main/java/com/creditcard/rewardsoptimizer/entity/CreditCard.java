package com.creditcard.rewardsoptimizer.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;

@Entity
@Table(name = "credit_cards")
public class CreditCard {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @NotBlank
    @Column(name = "card_type")
    private String cardType;
    
    @NotBlank
    @Column(name = "last_four", length = 4)
    private String lastFour;
    
    @NotBlank
    @Column(name = "expiry_date")
    private String expiryDate;
    
    @Positive
    @Column(name = "base_reward_rate", precision = 5, scale = 2)
    private BigDecimal baseRewardRate;
    
    private String nickname;
    
    private String issuer;
    
    @Column(name = "logo_url")
    private String logoUrl;
    
    // Constructors
    public CreditCard() {}
    
    public CreditCard(User user, String cardType, String lastFour, String expiryDate, 
                     BigDecimal baseRewardRate, String nickname, String issuer, String logoUrl) {
        this.user = user;
        this.cardType = cardType;
        this.lastFour = lastFour;
        this.expiryDate = expiryDate;
        this.baseRewardRate = baseRewardRate;
        this.nickname = nickname;
        this.issuer = issuer;
        this.logoUrl = logoUrl;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    
    public String getCardType() { return cardType; }
    public void setCardType(String cardType) { this.cardType = cardType; }
    
    public String getLastFour() { return lastFour; }
    public void setLastFour(String lastFour) { this.lastFour = lastFour; }
    
    public String getExpiryDate() { return expiryDate; }
    public void setExpiryDate(String expiryDate) { this.expiryDate = expiryDate; }
    
    public BigDecimal getBaseRewardRate() { return baseRewardRate; }
    public void setBaseRewardRate(BigDecimal baseRewardRate) { this.baseRewardRate = baseRewardRate; }
    
    public String getNickname() { return nickname; }
    public void setNickname(String nickname) { this.nickname = nickname; }
    
    public String getIssuer() { return issuer; }
    public void setIssuer(String issuer) { this.issuer = issuer; }
    
    public String getLogoUrl() { return logoUrl; }
    public void setLogoUrl(String logoUrl) { this.logoUrl = logoUrl; }
}