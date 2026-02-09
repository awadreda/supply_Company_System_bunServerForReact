CREATE TABLE `customers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`first_name` text NOT NULL,
	`middle_name` text,
	`last_name` text NOT NULL,
	`house_no` text NOT NULL,
	`street_name` text NOT NULL,
	`city` text NOT NULL,
	`zip_code` text NOT NULL,
	`phone` text NOT NULL,
	`credit_limit` real DEFAULT 0 NOT NULL,
	`created_at` text,
	`updated_at` text,
	`user_id` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `orderItems` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`orderID` integer NOT NULL,
	`productID` integer NOT NULL,
	`quantity` integer NOT NULL,
	`itemTotalPrice` real NOT NULL,
	`deliveryStatus` text NOT NULL,
	`created_at` text,
	`updated_at` text,
	FOREIGN KEY (`orderID`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`productID`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`customerID` integer NOT NULL,
	`totalPrice` real NOT NULL,
	`dueDate` text NOT NULL,
	`orderStatus` text NOT NULL,
	`isPaid` integer DEFAULT false NOT NULL,
	`created_at` text,
	`updated_at` text,
	FOREIGN KEY (`customerID`) REFERENCES `customers`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`costPrice` real NOT NULL,
	`sellPrice` real NOT NULL,
	`currentQuantity` integer NOT NULL,
	`reorderLevel` integer NOT NULL,
	`reorderQuantity` integer NOT NULL,
	`images` text,
	`created_at` text,
	`updated_at` text
);
--> statement-breakpoint
CREATE TABLE `redeemCodes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`code` text NOT NULL,
	`amount` real NOT NULL,
	`usedAt` text,
	`usedByCustomerID` integer,
	FOREIGN KEY (`usedByCustomerID`) REFERENCES `customers`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `redeemCodes_code_unique` ON `redeemCodes` (`code`);--> statement-breakpoint
CREATE TABLE `reorderNotices` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`productID` integer NOT NULL,
	`productName` text NOT NULL,
	`reorderQuantity` integer NOT NULL,
	`currentQuantity` integer NOT NULL,
	`isResolved` integer DEFAULT false NOT NULL,
	`created_at` text,
	`updated_at` text,
	FOREIGN KEY (`productID`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`role` text DEFAULT 'customer' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);