import { 
  User, InsertUser, 
  CreditCard, InsertCreditCard, 
  Merchant, InsertMerchant,
  Transaction, InsertTransaction,
  CardMerchantReward, InsertCardMerchantReward,
  FavoriteMerchant, InsertFavoriteMerchant,
  users as usersTable,
  creditCards as creditCardsTable,
  merchants as merchantsTable,
  transactions as transactionsTable,
  cardMerchantRewards as cardMerchantRewardsTable,
  favoriteMerchants as favoriteMerchantsTable
} from "@shared/schema";
import { format, addDays, subDays, parseISO } from "date-fns";
import { eq } from "drizzle-orm";
import { db } from "./db";

// Define the storage interface with all required methods
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Credit Card methods
  getCreditCards(userId: number): Promise<CreditCard[]>;
  getCreditCard(id: number): Promise<CreditCard | undefined>;
  createCreditCard(card: InsertCreditCard): Promise<CreditCard>;
  
  // Merchant methods
  getMerchants(userId?: number): Promise<(Merchant & { rewardRate: number, isFavorite: boolean })[]>;
  getMerchant(id: number): Promise<Merchant | undefined>;
  createMerchant(merchant: InsertMerchant): Promise<Merchant>;
  
  // Transaction methods
  getTransactions(userId: number, period?: string): Promise<(Transaction & { card?: CreditCard, merchant?: Merchant })[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  
  // Card-Merchant Reward methods
  getCardMerchantRewards(cardId?: number, merchantId?: number): Promise<CardMerchantReward[]>;
  createCardMerchantReward(reward: InsertCardMerchantReward): Promise<CardMerchantReward>;
  
  // Favorite Merchant methods
  getFavoriteMerchants(userId: number): Promise<FavoriteMerchant[]>;
  toggleFavoriteMerchant(userId: number, merchantId: number): Promise<FavoriteMerchant | undefined>;
  
  // Additional application-specific methods
  getRewardsSummary(userId: number): Promise<any>;
  getRecommendedCard(userId: number): Promise<any>;
  getWalletBalance(userId: number): Promise<any>;
  getWalletTransactions(userId: number, rewardType: string): Promise<any>;
  getRecommendation(userId: number, merchantName: string): Promise<any>;
}

// Database storage implementation using MySQL
export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    try {
      const users = await db.select().from(usersTable).where(eq(usersTable.id, id));
      return users[0];
    } catch (error) {
      console.error("Database connection error, falling back to memory storage");
      return this.memStorage.getUser(id);
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const users = await db.select().from(usersTable).where(eq(usersTable.username, username));
      return users[0];
    } catch (error) {
      console.error("Database connection error, falling back to memory storage");
      return this.memStorage.getUserByUsername(username);
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    try {
      const users = await db.insert(usersTable).values(insertUser).returning();
      return users[0];
    } catch (error) {
      console.error("Database connection error, falling back to memory storage");
      return this.memStorage.createUser(insertUser);
    }
  }

  // Fallback memory storage for when database is unavailable
  private memStorage = new MemStorage();
}

// In-memory storage implementation (fallback)
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private creditCards: Map<number, CreditCard>;
  private merchants: Map<number, Merchant>;
  private transactions: Map<number, Transaction>;
  private cardMerchantRewards: Map<number, CardMerchantReward>;
  private favoriteMerchants: Map<number, FavoriteMerchant>;
  
  private userCounter: number;
  private cardCounter: number;
  private merchantCounter: number;
  private transactionCounter: number;
  private rewardCounter: number;
  private favoriteCounter: number;

  constructor() {
    this.users = new Map();
    this.creditCards = new Map();
    this.merchants = new Map();
    this.transactions = new Map();
    this.cardMerchantRewards = new Map();
    this.favoriteMerchants = new Map();
    
    this.userCounter = 1;
    this.cardCounter = 1;
    this.merchantCounter = 1;
    this.transactionCounter = 1;
    this.rewardCounter = 1;
    this.favoriteCounter = 1;
    
    // Initialize with sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Create a sample user
    const sampleUser: User = {
      id: 1,
      username: "sample_user",
      password: "hashed_password",
      email: "user@example.com",
      createdAt: new Date()
    };
    this.users.set(sampleUser.id, sampleUser);
    this.userCounter++;

    // Create sample credit cards
    const creditCards: InsertCreditCard[] = [
      {
        userId: 1,
        cardType: "VISA",
        lastFour: "4582",
        expiryDate: "05/26",
        baseRewardRate: 1.0,
      },
      {
        userId: 1,
        cardType: "MasterCard",
        lastFour: "7821",
        expiryDate: "12/24",
        baseRewardRate: 1.5,
      },
      {
        userId: 1,
        cardType: "Amex",
        lastFour: "3901",
        expiryDate: "09/25",
        baseRewardRate: 0.8,
      }
    ];

    creditCards.forEach(card => {
      const newCard: CreditCard = {
        ...card,
        id: this.cardCounter++,
        nickname: card.nickname || null
      };
      this.creditCards.set(newCard.id, newCard);
    });

    // Create sample merchants
    const merchants: InsertMerchant[] = [
      { name: "Amazon", category: "オンラインショッピング", logoUrl: "" },
      { name: "楽天", category: "オンラインショッピング", logoUrl: "" },
      { name: "星野珈琲", category: "飲食", logoUrl: "" },
      { name: "ENEOS", category: "ガソリンスタンド", logoUrl: "" },
      { name: "セブンイレブン", category: "コンビニ", logoUrl: "" },
      { name: "Apple", category: "テクノロジー", logoUrl: "" }
    ];

    merchants.forEach(merchant => {
      const newMerchant: Merchant = {
        ...merchant,
        id: this.merchantCounter++,
        category: merchant.category || null,
        logoUrl: merchant.logoUrl || null
      };
      this.merchants.set(newMerchant.id, newMerchant);
    });

    // Create special merchant rewards
    const merchantRewards: InsertCardMerchantReward[] = [
      { cardId: 1, merchantId: 1, rewardRate: 1.5 }, // VISA for Amazon
      { cardId: 2, merchantId: 1, rewardRate: 2.5 }, // MasterCard for Amazon
      { cardId: 1, merchantId: 2, rewardRate: 2.0 }, // VISA for 楽天
      { cardId: 3, merchantId: 4, rewardRate: 2.0 }, // Amex for ENEOS
    ];

    merchantRewards.forEach(reward => {
      const newReward: CardMerchantReward = {
        ...reward,
        id: this.rewardCounter++
      };
      this.cardMerchantRewards.set(newReward.id, newReward);
    });

    // Create sample transactions
    const now = new Date();
    const transactions: InsertTransaction[] = [
      {
        userId: 1,
        cardId: 1,
        merchantId: 1,
        amount: 12800,
        date: subDays(now, 2),
        rewardPoints: 128,
        cardRewardPoints: 128,
        companyRewardPoints: 100,
        isOptimal: false
      },
      {
        userId: 1,
        cardId: 2,
        merchantId: 3,
        amount: 1350,
        date: subDays(now, 3),
        rewardPoints: 20,
        cardRewardPoints: 20,
        companyRewardPoints: 100,
        isOptimal: true
      },
      {
        userId: 1,
        cardId: 3,
        merchantId: 4,
        amount: 5600,
        date: subDays(now, 4),
        rewardPoints: 45,
        cardRewardPoints: 45,
        companyRewardPoints: 100,
        isOptimal: false
      }
    ];

    transactions.forEach(transaction => {
      const newTransaction: Transaction = {
        ...transaction,
        id: this.transactionCounter++,
        date: transaction.date || new Date(),
        cardId: transaction.cardId || null,
        merchantId: transaction.merchantId || null,
        rewardPoints: transaction.rewardPoints || null,
        cardRewardPoints: transaction.cardRewardPoints || null,
        companyRewardPoints: transaction.companyRewardPoints || null,
        isOptimal: transaction.isOptimal || null
      };
      this.transactions.set(newTransaction.id, newTransaction);
    });

    // Create sample favorite merchants
    const favoriteMerchants: InsertFavoriteMerchant[] = [
      { userId: 1, merchantId: 1 }, // Amazon
      { userId: 1, merchantId: 3 }  // 星野珈琲
    ];

    favoriteMerchants.forEach(favorite => {
      const newFavorite: FavoriteMerchant = {
        ...favorite,
        id: this.favoriteCounter++
      };
      this.favoriteMerchants.set(newFavorite.id, newFavorite);
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCounter++;
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  // Credit Card methods
  async getCreditCards(userId: number): Promise<CreditCard[]> {
    return Array.from(this.creditCards.values()).filter(
      (card) => card.userId === userId
    );
  }

  async getCreditCard(id: number): Promise<CreditCard | undefined> {
    return this.creditCards.get(id);
  }

  async createCreditCard(insertCard: InsertCreditCard): Promise<CreditCard> {
    const id = this.cardCounter++;
    const card: CreditCard = { 
      ...insertCard, 
      id,
      nickname: insertCard.nickname || null
    };
    this.creditCards.set(id, card);
    return card;
  }

  // Merchant methods
  async getMerchants(userId?: number): Promise<(Merchant & { rewardRate: number, isFavorite: boolean })[]> {
    const merchants = Array.from(this.merchants.values());
    const favoriteIds = userId 
      ? Array.from(this.favoriteMerchants.values())
          .filter(fav => fav.userId === userId)
          .map(fav => fav.merchantId)
      : [];
    
    // For each merchant, find the best reward rate available across all cards
    return merchants.map(merchant => {
      const merchantRewards = Array.from(this.cardMerchantRewards.values())
        .filter(reward => reward.merchantId === merchant.id);
      
      let bestRate = 1.0; // Default rate if no special rates found
      
      if (merchantRewards.length > 0) {
        bestRate = Math.max(...merchantRewards.map(reward => reward.rewardRate));
      }
      
      return {
        ...merchant,
        rewardRate: bestRate,
        isFavorite: favoriteIds.includes(merchant.id)
      };
    });
  }

  async getMerchant(id: number): Promise<Merchant | undefined> {
    return this.merchants.get(id);
  }

  async createMerchant(insertMerchant: InsertMerchant): Promise<Merchant> {
    const id = this.merchantCounter++;
    const merchant: Merchant = { 
      ...insertMerchant, 
      id,
      category: insertMerchant.category || null,
      logoUrl: insertMerchant.logoUrl || null
    };
    this.merchants.set(id, merchant);
    return merchant;
  }

  // Transaction methods
  async getTransactions(
    userId: number, 
    period: string = 'week'
  ): Promise<(Transaction & { card?: CreditCard, merchant?: Merchant })[]> {
    const transactions = Array.from(this.transactions.values())
      .filter((transaction) => transaction.userId === userId);
    
    // Filter by period
    let filteredTransactions = transactions;
    const now = new Date();
    
    if (period === 'week') {
      filteredTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.date);
        const oneWeekAgo = subDays(now, 7);
        return transactionDate >= oneWeekAgo;
      });
    } else if (period === 'month') {
      filteredTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.date);
        const oneMonthAgo = subDays(now, 30);
        return transactionDate >= oneMonthAgo;
      });
    } else if (period === 'year') {
      filteredTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.date);
        const oneYearAgo = subDays(now, 365);
        return transactionDate >= oneYearAgo;
      });
    }
    
    // Enrich with card and merchant data
    return filteredTransactions.map(transaction => {
      const card = transaction.cardId ? this.creditCards.get(transaction.cardId) : undefined;
      const merchant = transaction.merchantId ? this.merchants.get(transaction.merchantId) : undefined;
      
      return {
        ...transaction,
        card,
        merchant
      };
    });
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const id = this.transactionCounter++;
    const transaction: Transaction = { 
      ...insertTransaction, 
      id,
      date: insertTransaction.date || new Date(),
      cardId: insertTransaction.cardId || null,
      merchantId: insertTransaction.merchantId || null,
      rewardPoints: insertTransaction.rewardPoints || null,
      cardRewardPoints: insertTransaction.cardRewardPoints || null,
      companyRewardPoints: insertTransaction.companyRewardPoints || null,
      isOptimal: insertTransaction.isOptimal || null
    };
    this.transactions.set(id, transaction);
    return transaction;
  }

  // Card-Merchant Reward methods
  async getCardMerchantRewards(
    cardId?: number, 
    merchantId?: number
  ): Promise<CardMerchantReward[]> {
    let rewards = Array.from(this.cardMerchantRewards.values());
    
    if (cardId) {
      rewards = rewards.filter(reward => reward.cardId === cardId);
    }
    
    if (merchantId) {
      rewards = rewards.filter(reward => reward.merchantId === merchantId);
    }
    
    return rewards;
  }

  async createCardMerchantReward(
    insertReward: InsertCardMerchantReward
  ): Promise<CardMerchantReward> {
    const id = this.rewardCounter++;
    const reward: CardMerchantReward = { ...insertReward, id };
    this.cardMerchantRewards.set(id, reward);
    return reward;
  }

  // Favorite Merchant methods
  async getFavoriteMerchants(userId: number): Promise<FavoriteMerchant[]> {
    return Array.from(this.favoriteMerchants.values()).filter(
      favorite => favorite.userId === userId
    );
  }

  async toggleFavoriteMerchant(
    userId: number, 
    merchantId: number
  ): Promise<FavoriteMerchant | undefined> {
    // Check if already favorited
    const existing = Array.from(this.favoriteMerchants.values()).find(
      fav => fav.userId === userId && fav.merchantId === merchantId
    );
    
    if (existing) {
      // If exists, remove it
      this.favoriteMerchants.delete(existing.id);
      return undefined;
    } else {
      // If doesn't exist, add it
      const id = this.favoriteCounter++;
      const favorite: FavoriteMerchant = { id, userId, merchantId };
      this.favoriteMerchants.set(id, favorite);
      return favorite;
    }
  }

  // Additional application-specific methods
  async getRewardsSummary(userId: number): Promise<any> {
    // Calculate company points, card points, and potential extra points
    const transactions = Array.from(this.transactions.values())
      .filter(transaction => transaction.userId === userId);
    
    let companyPoints = 0;
    let cardPoints = 0;
    let potentialExtraPoints = 0;
    
    transactions.forEach(transaction => {
      companyPoints += transaction.companyRewardPoints || 0;
      cardPoints += transaction.cardRewardPoints || 0;
      
      // Calculate potential points if optimal card was used
      const merchantId = transaction.merchantId;
      if (merchantId) {
        const allCards = Array.from(this.creditCards.values())
          .filter(card => card.userId === userId);
        
        const merchantRewards = Array.from(this.cardMerchantRewards.values())
          .filter(reward => reward.merchantId === merchantId);
        
        let bestRate = Math.max(...allCards.map(card => {
          const specialRate = merchantRewards.find(r => r.cardId === card.id);
          return specialRate ? specialRate.rewardRate : card.baseRewardRate;
        }));
        
        const actualCard = transaction.cardId 
          ? this.creditCards.get(transaction.cardId) 
          : undefined;
        
        const actualRate = actualCard 
          ? (merchantRewards.find(r => r.cardId === actualCard.id)?.rewardRate || actualCard.baseRewardRate)
          : 0;
        
        if (bestRate > actualRate) {
          const optimalPoints = transaction.amount * bestRate / 100;
          const actualPoints = transaction.cardRewardPoints || 0;
          potentialExtraPoints += (optimalPoints - actualPoints);
        }
      }
    });
    
    return {
      companyPoints,
      companyPointsPercentChange: 12.5, // Mock percentage change
      cardPoints,
      cardPointsPercentChange: 8.2, // Mock percentage change
      potentialExtraPoints
    };
  }

  async getRecommendedCard(userId: number): Promise<any> {
    // Return a recommended card based on user's transaction history
    return {
      id: 999, // Not an actual card in our system
      name: "楽天カード",
      features: [
        { name: "ポイント還元率高い" },
        { name: "年会費無料" },
        { name: "特典豊富" }
      ],
      baseRewardRate: "1.0%〜3.0%",
      annualFee: "無料",
      brands: "VISA / Mastercard / JCB",
      benefits: [
        { description: "楽天市場での買い物でポイント3倍" },
        { description: "楽天ポイントが貯まりやすく使いやすい" },
        { description: "楽天経済圏でさらにポイント還元率アップ" }
      ],
      cardType: "VISA"
    };
  }

  async getWalletBalance(userId: number): Promise<any> {
    // Return wallet balance information
    return {
      availableBalance: 12500,
      pendingBalance: 3800,
      transactions: [
        {
          id: 1,
          date: "2023-11-15T10:00:00Z",
          amount: 5000,
          status: "completed",
          description: "ポイント引き出し"
        },
        {
          id: 2,
          date: "2023-11-01T14:30:00Z",
          amount: 3000,
          status: "completed",
          description: "ポイント引き出し"
        }
      ]
    };
  }

  async getWalletTransactions(userId: number, rewardType: string = 'company'): Promise<any> {
    // Get transactions for wallet view based on reward type
    const transactions = Array.from(this.transactions.values())
      .filter(transaction => transaction.userId === userId);
    
    // Enrich with additional data
    return transactions.map(transaction => {
      const merchant = transaction.merchantId 
        ? this.merchants.get(transaction.merchantId) 
        : undefined;
      
      const card = transaction.cardId 
        ? this.creditCards.get(transaction.cardId) 
        : undefined;
      
      const merchantRewards = transaction.merchantId 
        ? Array.from(this.cardMerchantRewards.values())
            .filter(reward => reward.merchantId === transaction.merchantId)
        : [];
      
      const cardRewardRate = card 
        ? (merchantRewards.find(r => r.cardId === card.id)?.rewardRate || card.baseRewardRate)
        : 0;
      
      return {
        ...transaction,
        merchantName: merchant?.name || "Unknown Merchant",
        cardType: card?.cardType || "Unknown Card",
        lastFour: card?.lastFour || "0000",
        rewardRate: cardRewardRate,
        optimalCard: transaction.isOptimal
      };
    });
  }

  async getRecommendation(userId: number, merchantName: string): Promise<any> {
    // Get a recommendation for checkout
    const merchant = Array.from(this.merchants.values())
      .find(m => m.name.toLowerCase() === merchantName.toLowerCase());
    
    if (!merchant) {
      throw new Error("Merchant not found");
    }
    
    const cards = Array.from(this.creditCards.values())
      .filter(card => card.userId === userId);
    
    if (cards.length === 0) {
      throw new Error("No credit cards found for user");
    }
    
    const merchantRewards = Array.from(this.cardMerchantRewards.values())
      .filter(reward => reward.merchantId === merchant.id);
    
    // Find best card for this merchant
    let bestCard = cards[0];
    let bestRate = merchantRewards.find(r => r.cardId === bestCard.id)?.rewardRate || bestCard.baseRewardRate;
    
    for (const card of cards) {
      const rate = merchantRewards.find(r => r.cardId === card.id)?.rewardRate || card.baseRewardRate;
      if (rate > bestRate) {
        bestCard = card;
        bestRate = rate;
      }
    }
    
    // Sample purchase amount
    const sampleAmount = 14000;
    
    // Get other cards (not the best one)
    const otherCards = cards
      .filter(card => card.id !== bestCard.id)
      .map(card => {
        const rate = merchantRewards.find(r => r.cardId === card.id)?.rewardRate || card.baseRewardRate;
        return {
          ...card,
          rewardRate: rate,
          estimatedPoints: Math.round(sampleAmount * rate / 100)
        };
      });
    
    return {
      isOpen: true,
      merchantName: merchant.name,
      optimalCard: {
        ...bestCard,
        rewardRate: bestRate,
        estimatedPoints: Math.round(sampleAmount * bestRate / 100)
      },
      otherCards
    };
  }
}

export const storage = new DatabaseStorage();
