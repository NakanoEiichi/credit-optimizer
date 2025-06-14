CREATE TABLE `card_merchant_rewards` (
	`id` int AUTO_INCREMENT NOT NULL,
	`card_id` int NOT NULL,
	`merchant_id` int NOT NULL,
	`reward_rate` double NOT NULL,
	CONSTRAINT `card_merchant_rewards_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `credit_cards` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`card_type` varchar(50) NOT NULL,
	`last_four` varchar(4) NOT NULL,
	`expiry_date` varchar(7) NOT NULL,
	`base_reward_rate` double NOT NULL,
	`nickname` varchar(100),
	CONSTRAINT `credit_cards_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `favorite_merchants` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`merchant_id` int NOT NULL,
	CONSTRAINT `favorite_merchants_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `merchants` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`category` varchar(50),
	`logo_url` varchar(255),
	CONSTRAINT `merchants_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `transactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`card_id` int,
	`merchant_id` int,
	`amount` double NOT NULL,
	`date` timestamp NOT NULL DEFAULT (now()),
	`reward_points` double,
	`card_reward_points` double,
	`company_reward_points` double,
	`is_optimal` boolean DEFAULT false,
	CONSTRAINT `transactions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`username` varchar(50) NOT NULL,
	`password` varchar(255) NOT NULL,
	`email` varchar(100) NOT NULL,
	`phone_number` varchar(20) NOT NULL,
	`date_of_birth` date NOT NULL,
	`occupation` varchar(100),
	`prefecture` varchar(50),
	`annual_income` int,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	`deleted_at` timestamp,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_username_unique` UNIQUE(`username`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `card_merchant_rewards` ADD CONSTRAINT `card_merchant_rewards_card_id_credit_cards_id_fk` FOREIGN KEY (`card_id`) REFERENCES `credit_cards`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `card_merchant_rewards` ADD CONSTRAINT `card_merchant_rewards_merchant_id_merchants_id_fk` FOREIGN KEY (`merchant_id`) REFERENCES `merchants`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `credit_cards` ADD CONSTRAINT `credit_cards_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `favorite_merchants` ADD CONSTRAINT `favorite_merchants_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `favorite_merchants` ADD CONSTRAINT `favorite_merchants_merchant_id_merchants_id_fk` FOREIGN KEY (`merchant_id`) REFERENCES `merchants`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_card_id_credit_cards_id_fk` FOREIGN KEY (`card_id`) REFERENCES `credit_cards`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_merchant_id_merchants_id_fk` FOREIGN KEY (`merchant_id`) REFERENCES `merchants`(`id`) ON DELETE no action ON UPDATE no action;