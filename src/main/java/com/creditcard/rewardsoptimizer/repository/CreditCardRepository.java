package com.creditcard.rewardsoptimizer.repository;

import com.creditcard.rewardsoptimizer.entity.CreditCard;
import com.creditcard.rewardsoptimizer.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CreditCardRepository extends JpaRepository<CreditCard, Long> {
    List<CreditCard> findByUser(User user);
    List<CreditCard> findByUserOrderByIdDesc(User user);
}