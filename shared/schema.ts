import { mysqlTable, text, int, boolean, varchar, timestamp, decimal, double } from "drizzle-orm/mysql-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  username: varchar("username", { length: 50 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  email: varchar("email", { length: 100 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
});

// Credit card schema
export const creditCards = mysqlTable("credit_cards", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull().references(() => users.id),
  cardType: varchar("card_type", { length: 50 }).notNull(), // visa, mastercard, amex, etc.
  lastFour: varchar("last_four", { length: 4 }).notNull(),
  expiryDate: varchar("expiry_date", { length: 7 }).notNull(),
  baseRewardRate: double("base_reward_rate").notNull(), // percentage as decimal
  nickname: varchar("nickname", { length: 100 }),
});

export const insertCreditCardSchema = createInsertSchema(creditCards).pick({
  userId: true,
  cardType: true,
  lastFour: true,
  expiryDate: true,
  baseRewardRate: true,
  nickname: true,
});

// Merchant schema
export const merchants = mysqlTable("merchants", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  category: varchar("category", { length: 50 }),
  logoUrl: varchar("logo_url", { length: 255 }),
});

export const insertMerchantSchema = createInsertSchema(merchants).omit({
  id: true,
});

// Card-merchant reward rate mapping
export const cardMerchantRewards = mysqlTable("card_merchant_rewards", {
  id: int("id").autoincrement().primaryKey(),
  cardId: int("card_id").notNull().references(() => creditCards.id),
  merchantId: int("merchant_id").notNull().references(() => merchants.id),
  rewardRate: double("reward_rate").notNull(), // percentage as decimal
});

export const insertCardMerchantRewardSchema = createInsertSchema(cardMerchantRewards).pick({
  cardId: true,
  merchantId: true,
  rewardRate: true,
});

// Transaction schema
export const transactions = mysqlTable("transactions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull().references(() => users.id),
  cardId: int("card_id").references(() => creditCards.id),
  merchantId: int("merchant_id").references(() => merchants.id),
  amount: double("amount").notNull(),
  date: timestamp("date").defaultNow().notNull(),
  rewardPoints: double("reward_points"),
  cardRewardPoints: double("card_reward_points"),
  companyRewardPoints: double("company_reward_points"),
  isOptimal: boolean("is_optimal").default(false),
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
});

// Favorite merchants
export const favoriteMerchants = mysqlTable("favorite_merchants", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull().references(() => users.id),
  merchantId: int("merchant_id").notNull().references(() => merchants.id),
});

export const insertFavoriteMerchantSchema = createInsertSchema(favoriteMerchants).omit({
  id: true,
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
