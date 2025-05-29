import { CreditCard, CardMerchantReward, Merchant } from "@shared/schema";

/**
 * Gets the card icon class based on card type
 */
export const getCardIconClass = (cardType: string): string => {
  const type = cardType.toLowerCase();
  if (type.includes("visa")) {
    return "fa-cc-visa text-blue-700";
  } else if (type.includes("mastercard")) {
    return "fa-cc-mastercard text-red-500";
  } else if (type.includes("amex")) {
    return "fa-cc-amex text-blue-500";
  } else if (type.includes("jcb")) {
    return "fa-cc-jcb text-green-600";
  }
  return "fa-credit-card text-neutral-600";
};

/**
 * Calculates rewards for a given purchase
 */
export const calculateReward = (
  amount: number, 
  rewardRate: number
): number => {
  return (amount * rewardRate) / 100;
};

/**
 * Finds the optimal card for a merchant
 */
export const findOptimalCard = (
  cards: CreditCard[],
  merchantId: number,
  cardMerchantRewards: CardMerchantReward[]
): CreditCard | null => {
  if (!cards || cards.length === 0) {
    return null;
  }
  
  // Find the card with highest reward rate for this merchant
  let optimalCard = cards[0];
  let highestRate = optimalCard.baseRewardRate;
  
  // Check if there are merchant-specific reward rates
  const merchantSpecificRewards = cardMerchantRewards.filter(
    reward => reward.merchantId === merchantId
  );
  
  if (merchantSpecificRewards.length > 0) {
    // Find the card with the highest merchant-specific reward rate
    for (const reward of merchantSpecificRewards) {
      const card = cards.find(c => c.id === reward.cardId);
      if (card && reward.rewardRate > highestRate) {
        optimalCard = card;
        highestRate = reward.rewardRate;
      }
    }
  } else {
    // No merchant-specific rates, find card with highest base rate
    for (const card of cards) {
      if (card.baseRewardRate > highestRate) {
        optimalCard = card;
        highestRate = card.baseRewardRate;
      }
    }
  }
  
  return optimalCard;
};

/**
 * Gets the reward rate for a specific card and merchant
 */
export const getRewardRate = (
  card: CreditCard,
  merchantId: number,
  cardMerchantRewards: CardMerchantReward[]
): number => {
  // Check if there's a merchant-specific reward rate
  const specificReward = cardMerchantRewards.find(
    reward => reward.cardId === card.id && reward.merchantId === merchantId
  );
  
  return specificReward ? specificReward.rewardRate : card.baseRewardRate;
};
