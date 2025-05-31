import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertCreditCardSchema, insertMerchantSchema, insertTransactionSchema, insertCardMerchantRewardSchema, insertFavoriteMerchantSchema } from "@shared/schema";
import { z } from "zod";
import { ZodError } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // API Routes
  
  // User routes
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Failed to create user" });
      }
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUser(id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve user" });
    }
  });

  // Credit Card routes
  app.get("/api/credit-cards", async (req, res) => {
    try {
      // For demo, we'll use a default user ID 
      const userId = 1;
      const cards = await storage.getCreditCards(userId);
      res.json(cards);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve credit cards" });
    }
  });

  app.post("/api/credit-cards", async (req, res) => {
    try {
      // For demo, we'll use a default user ID
      const userId = 1;
      const cardData = insertCreditCardSchema.parse({
        ...req.body,
        userId,
      });
      const card = await storage.createCreditCard(cardData);
      res.status(201).json(card);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Failed to create credit card" });
      }
    }
  });

  // Get card templates for selection
  app.get("/api/card-templates", async (req, res) => {
    try {
      const templates = await storage.getCardTemplates();
      res.json(templates);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Transaction routes
  app.get("/api/transactions", async (req, res) => {
    try {
      // For demo, we'll use a default user ID
      const userId = 1;
      const period = req.query.period as string || 'week';
      const startDate = req.query.startDate as string;
      const endDate = req.query.endDate as string;
      const transactions = await storage.getTransactions(userId, period, startDate, endDate);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve transactions" });
    }
  });

  app.post("/api/transactions", async (req, res) => {
    try {
      const transactionData = insertTransactionSchema.parse(req.body);
      const transaction = await storage.createTransaction(transactionData);
      res.status(201).json(transaction);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Failed to create transaction" });
      }
    }
  });

  // Merchant routes
  app.get("/api/merchants", async (req, res) => {
    try {
      // For demo, we'll use a default user ID for favorites
      const userId = 1;
      const merchants = await storage.getMerchants(userId);
      res.json(merchants);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve merchants" });
    }
  });

  // Favorite merchants routes
  app.post("/api/favorite-merchants", async (req, res) => {
    try {
      const favoriteData = insertFavoriteMerchantSchema.parse(req.body);
      const favorite = await storage.toggleFavoriteMerchant(favoriteData.userId, favoriteData.merchantId);
      res.status(201).json(favorite);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Failed to toggle favorite merchant" });
      }
    }
  });

  // Rewards summary
  app.get("/api/rewards/summary", async (req, res) => {
    try {
      // For demo, we'll use a default user ID
      const userId = 1;
      const summary = await storage.getRewardsSummary(userId);
      res.json(summary);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve rewards summary" });
    }
  });

  // Recommended card
  app.get("/api/recommended-card", async (req, res) => {
    try {
      // For demo, we'll use a default user ID
      const userId = 1;
      const recommendedCard = await storage.getRecommendedCard(userId);
      res.json(recommendedCard);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve recommended card" });
    }
  });

  // Wallet balance and transactions
  app.get("/api/wallet/balance", async (req, res) => {
    try {
      // For demo, we'll use a default user ID
      const userId = 1;
      const balance = await storage.getWalletBalance(userId);
      res.json(balance);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve wallet balance" });
    }
  });

  app.get("/api/wallet/transactions", async (req, res) => {
    try {
      // For demo, we'll use a default user ID
      const userId = 1;
      const rewardType = req.query.rewardType as string || 'company';
      const transactions = await storage.getWalletTransactions(userId, rewardType);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve wallet transactions" });
    }
  });

  // Checkout recommendation
  app.get("/api/recommendation", async (req, res) => {
    try {
      // For demo, we'll use a default user ID
      const userId = 1;
      const url = req.query.url as string || '';
      
      // Extract merchant from URL (in a real implementation this would be more sophisticated)
      const merchantName = url.includes('amazon') ? 'Amazon' : 'Unknown Merchant';
      
      const recommendation = await storage.getRecommendation(userId, merchantName);
      res.json(recommendation);
    } catch (error) {
      res.status(500).json({ error: "Failed to get recommendation" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
