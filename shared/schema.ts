import { pgTable, text, serial, integer, boolean, varchar, timestamp, uniqueIndex, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
});

// Credit card schema
export const creditCards = pgTable("credit_cards", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  cardType: text("card_type").notNull(), // visa, mastercard, amex, etc.
  lastFour: text("last_four").notNull(),
  expiryDate: text("expiry_date").notNull(),
  baseRewardRate: doublePrecision("base_reward_rate").notNull(), // percentage as decimal
  nickname: text("nickname"),
  issuer: text("issuer"), // カード発行者名
  logoUrl: text("logo_url"), // 外部データベースから取得するロゴURL
});

export const insertCreditCardSchema = createInsertSchema(creditCards).pick({
  userId: true,
  cardType: true,
  lastFour: true,
  expiryDate: true,
  baseRewardRate: true,
  nickname: true,
  issuer: true,
  logoUrl: true,
});

// Merchant schema
export const merchants = pgTable("merchants", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category"),
  logoUrl: text("logo_url"),
});

export const insertMerchantSchema = createInsertSchema(merchants).pick({
  name: true,
  category: true,
  logoUrl: true,
});

// Card-merchant reward rate mapping
export const cardMerchantRewards = pgTable("card_merchant_rewards", {
  id: serial("id").primaryKey(),
  cardId: integer("card_id").notNull().references(() => creditCards.id),
  merchantId: integer("merchant_id").notNull().references(() => merchants.id),
  rewardRate: doublePrecision("reward_rate").notNull(), // percentage as decimal
});

export const insertCardMerchantRewardSchema = createInsertSchema(cardMerchantRewards).pick({
  cardId: true,
  merchantId: true,
  rewardRate: true,
});

// Transaction schema
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  cardId: integer("card_id").references(() => creditCards.id),
  merchantId: integer("merchant_id").references(() => merchants.id),
  amount: doublePrecision("amount").notNull(),
  date: timestamp("date").defaultNow().notNull(),
  rewardPoints: doublePrecision("reward_points"),
  cardRewardPoints: doublePrecision("card_reward_points"),
  companyRewardPoints: doublePrecision("company_reward_points"),
  isOptimal: boolean("is_optimal").default(false),
});

export const insertTransactionSchema = createInsertSchema(transactions).pick({
  userId: true,
  cardId: true,
  merchantId: true,
  amount: true,
  date: true,
  rewardPoints: true,
  cardRewardPoints: true,
  companyRewardPoints: true,
  isOptimal: true,
});

// Favorite merchants
export const favoriteMerchants = pgTable("favorite_merchants", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  merchantId: integer("merchant_id").notNull().references(() => merchants.id),
});

export const insertFavoriteMerchantSchema = createInsertSchema(favoriteMerchants).pick({
  userId: true,
  merchantId: true,
});

// Define types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type CreditCard = typeof creditCards.$inferSelect;
export type InsertCreditCard = z.infer<typeof insertCreditCardSchema>;

export type Merchant = typeof merchants.$inferSelect;
export type InsertMerchant = z.infer<typeof insertMerchantSchema>;

export type CardMerchantReward = typeof cardMerchantRewards.$inferSelect;
export type InsertCardMerchantReward = z.infer<typeof insertCardMerchantRewardSchema>;

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;

export type FavoriteMerchant = typeof favoriteMerchants.$inferSelect;
export type InsertFavoriteMerchant = z.infer<typeof insertFavoriteMerchantSchema>;
