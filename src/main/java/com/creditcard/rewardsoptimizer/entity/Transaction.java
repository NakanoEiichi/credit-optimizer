package com.creditcard.rewardsoptimizer.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "transactions")
public class Transaction {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "card_id")
    private CreditCard creditCard;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "merchant_id")
    private Merchant merchant;
    
    @NotNull
    @Positive
    private BigDecimal amount;
    
    @NotNull
    private LocalDateTime date;
    
    @Column(name = "reward_points")
    private BigDecimal rewardPoints;
    
    @Column(name = "card_reward_points")
    private BigDecimal cardRewardPoints;
    
    @Column(name = "company_reward_points")
    private BigDecimal companyRewardPoints;
    
    @Column(name = "is_optimal")
    private Boolean isOptimal;
    
    // Constructors
    public Transaction() {}
    
    public Transaction(User user, CreditCard creditCard, Merchant merchant, 
                      BigDecimal amount, LocalDateTime date) {
        this.user = user;
        this.creditCard = creditCard;
        this.merchant = merchant;
        this.amount = amount;
        this.date = date;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    
    public CreditCard getCreditCard() { return creditCard; }
    public void setCreditCard(CreditCard creditCard) { this.creditCard = creditCard; }
    
    public Merchant getMerchant() { return merchant; }
    public void setMerchant(Merchant merchant) { this.merchant = merchant; }
    
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    
    public LocalDateTime getDate() { return date; }
    public void setDate(LocalDateTime date) { this.date = date; }
    
    public BigDecimal getRewardPoints() { return rewardPoints; }
    public void setRewardPoints(BigDecimal rewardPoints) { this.rewardPoints = rewardPoints; }
    
    public BigDecimal getCardRewardPoints() { return cardRewardPoints; }
    public void setCardRewardPoints(BigDecimal cardRewardPoints) { this.cardRewardPoints = cardRewardPoints; }
    
    public BigDecimal getCompanyRewardPoints() { return companyRewardPoints; }
    public void setCompanyRewardPoints(BigDecimal companyRewardPoints) { this.companyRewardPoints = companyRewardPoints; }
    
    public Boolean getIsOptimal() { return isOptimal; }
    public void setIsOptimal(Boolean isOptimal) { this.isOptimal = isOptimal; }
}