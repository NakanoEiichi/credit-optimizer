package com.creditcard.rewardsoptimizer.service;

import com.creditcard.rewardsoptimizer.entity.CreditCard;
import com.creditcard.rewardsoptimizer.entity.User;
import com.creditcard.rewardsoptimizer.repository.CreditCardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class CreditCardService {
    
    @Autowired
    private CreditCardRepository creditCardRepository;
    
    public List<CreditCard> getCreditCardsByUser(User user) {
        return creditCardRepository.findByUserOrderByIdDesc(user);
    }
    
    public Optional<CreditCard> getCreditCardById(Long id) {
        return creditCardRepository.findById(id);
    }
    
    public CreditCard saveCreditCard(CreditCard creditCard) {
        return creditCardRepository.save(creditCard);
    }
    
    public void deleteCreditCard(Long id) {
        creditCardRepository.deleteById(id);
    }
}