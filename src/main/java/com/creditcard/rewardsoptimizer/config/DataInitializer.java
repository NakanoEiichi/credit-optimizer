package com.creditcard.rewardsoptimizer.config;

import com.creditcard.rewardsoptimizer.entity.CreditCard;
import com.creditcard.rewardsoptimizer.entity.Merchant;
import com.creditcard.rewardsoptimizer.entity.User;
import com.creditcard.rewardsoptimizer.repository.CreditCardRepository;
import com.creditcard.rewardsoptimizer.repository.MerchantRepository;
import com.creditcard.rewardsoptimizer.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;

@Component
public class DataInitializer implements CommandLineRunner {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private CreditCardRepository creditCardRepository;
    
    @Autowired
    private MerchantRepository merchantRepository;
    
    @Override
    public void run(String... args) throws Exception {
        // Initialize sample data if database is empty
        if (userRepository.count() == 0) {
            initializeSampleData();
        }
    }
    
    private void initializeSampleData() {
        // Create sample user
        User user = new User("testuser", "password123", "user@example.com");
        user = userRepository.save(user);
        
        // Create sample credit cards
        CreditCard card1 = new CreditCard(user, "VISA", "1234", "12/26", 
                                         new BigDecimal("1.0"), "メインカード", "楽天カード", 
                                         "https://example.com/rakuten-logo.png");
        creditCardRepository.save(card1);
        
        CreditCard card2 = new CreditCard(user, "MasterCard", "5678", "03/27", 
                                         new BigDecimal("0.5"), "サブカード", "イオンカード", 
                                         "https://example.com/aeon-logo.png");
        creditCardRepository.save(card2);
        
        // Create sample merchants
        Merchant amazon = new Merchant("Amazon", "https://example.com/amazon-logo.png", "オンラインショッピング");
        merchantRepository.save(amazon);
        
        Merchant seven = new Merchant("セブンイレブン", "https://example.com/seven-logo.png", "コンビニ");
        merchantRepository.save(seven);
        
        System.out.println("Sample data initialized successfully!");
    }
}