package com.creditcard.rewardsoptimizer.controller;

import com.creditcard.rewardsoptimizer.entity.CreditCard;
import com.creditcard.rewardsoptimizer.entity.User;
import com.creditcard.rewardsoptimizer.service.CreditCardService;
import com.creditcard.rewardsoptimizer.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
public class CreditCardController {
    
    @Autowired
    private CreditCardService creditCardService;
    
    @Autowired
    private UserService userService;
    
    @GetMapping("/credit-cards")
    public ResponseEntity<List<CreditCard>> getCreditCards() {
        // デモ用に最初のユーザーを使用
        User user = userService.getUserById(1L).orElse(null);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        
        List<CreditCard> cards = creditCardService.getCreditCardsByUser(user);
        return ResponseEntity.ok(cards);
    }
    
    @PostMapping("/credit-cards")
    public ResponseEntity<CreditCard> createCreditCard(@RequestBody CreditCard creditCard) {
        // デモ用に最初のユーザーを使用
        User user = userService.getUserById(1L).orElse(null);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        
        creditCard.setUser(user);
        CreditCard savedCard = creditCardService.saveCreditCard(creditCard);
        return ResponseEntity.ok(savedCard);
    }
    
    @DeleteMapping("/credit-cards/{id}")
    public ResponseEntity<Void> deleteCreditCard(@PathVariable Long id) {
        creditCardService.deleteCreditCard(id);
        return ResponseEntity.ok().build();
    }
}