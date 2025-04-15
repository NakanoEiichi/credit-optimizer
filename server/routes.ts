import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertCreditCardSchema, insertMerchantSchema, insertTransactionSchema, insertCardMerchantRewardSchema, insertFavoriteMerchantSchema } from "@shared/schema";
import { z } from "zod";
import { ZodError } from "zod";
import { generateVerificationCode, sendVerificationEmail, storeVerificationCode, verifyCode } from "./utils/email";

export async function registerRoutes(app: Express): Promise<Server> {
  // API Routes
  
  // Authentication routes
  // 認証コードを送信するエンドポイント（サインアップ時）
  app.post("/api/auth/send-verification", async (req, res) => {
    try {
      const { username, email } = req.body;
      
      // バリデーション
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }
      
      // ユーザー名が既に存在するか確認
      if (username) {
        const existingUser = await storage.getUserByUsername(username);
        if (existingUser) {
          return res.status(400).json({ error: "Username already exists" });
        }
      }
      
      // 認証コード生成・保存・送信
      const verificationCode = generateVerificationCode();
      storeVerificationCode(email, verificationCode);
      
      // メール送信
      await sendVerificationEmail(email, verificationCode);
      
      // 成功レスポンス
      res.json({ success: true, message: "Verification code sent" });
    } catch (error) {
      res.status(500).json({ error: "Failed to send verification code" });
    }
  });
  
  // ユーザー登録処理
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { username, email, password, verificationCode } = req.body;
      
      // バリデーション
      if (!username || !email || !password || !verificationCode) {
        return res.status(400).json({ error: "All fields are required" });
      }
      
      // 認証コード検証
      const isCodeValid = verifyCode(email, verificationCode);
      if (!isCodeValid) {
        return res.status(400).json({ error: "Invalid or expired verification code" });
      }
      
      // ユーザー登録
      const userData = insertUserSchema.parse({
        username,
        email,
        password,
      });
      
      const user = await storage.createUser(userData);
      
      // パスワードを除外したユーザー情報を返す
      const { password: _, ...userWithoutPassword } = user;
      res.status(201).json({ success: true, user: userWithoutPassword });
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Registration failed" });
      }
    }
  });
  
  // ログイン処理（第1段階: 認証コード送信）
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      // バリデーション
      if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
      }
      
      // ユーザー確認
      const user = await storage.getUserByUsername(username);
      if (!user || user.password !== password) { // 実際の実装ではパスワードのハッシュ比較が必要
        return res.status(401).json({ error: "Invalid username or password" });
      }
      
      // 二段階認証のために認証コード送信
      const verificationCode = generateVerificationCode();
      storeVerificationCode(user.email, verificationCode);
      
      // メール送信
      await sendVerificationEmail(user.email, verificationCode);
      
      res.json({ success: true, message: "Verification code sent" });
    } catch (error) {
      res.status(500).json({ error: "Login failed" });
    }
  });
  
  // ログイン処理（第2段階: 認証コード検証）
  app.post("/api/auth/verify-login", async (req, res) => {
    try {
      const { username, verificationCode } = req.body;
      
      // バリデーション
      if (!username || !verificationCode) {
        return res.status(400).json({ error: "Username and verification code are required" });
      }
      
      // ユーザー確認
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ error: "Invalid username" });
      }
      
      // 認証コード検証
      const isCodeValid = verifyCode(user.email, verificationCode);
      if (!isCodeValid) {
        return res.status(401).json({ error: "Invalid or expired verification code" });
      }
      
      // 認証成功
      // 実際の実装ではここでセッションを作成
      
      // パスワードを除外したユーザー情報を返す
      const { password: _, ...userWithoutPassword } = user;
      res.json({ success: true, user: userWithoutPassword });
    } catch (error) {
      res.status(500).json({ error: "Verification failed" });
    }
  });
  
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

  // Transaction routes
  app.get("/api/transactions", async (req, res) => {
    try {
      // For demo, we'll use a default user ID
      const userId = 1;
      const period = req.query.period as string || 'week';
      const transactions = await storage.getTransactions(userId, period);
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
