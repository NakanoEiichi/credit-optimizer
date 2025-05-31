package com.creditcard.rewardsoptimizer.repository;

import com.creditcard.rewardsoptimizer.entity.Merchant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MerchantRepository extends JpaRepository<Merchant, Long> {
    List<Merchant> findByNameContainingIgnoreCase(String name);
    List<Merchant> findByCategory(String category);
}