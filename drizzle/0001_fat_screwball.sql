CREATE TABLE `leads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`leadId` varchar(64) NOT NULL,
	`propertyId` varchar(64) NOT NULL,
	`visitorName` varchar(255) NOT NULL,
	`visitorPhone` varchar(20) NOT NULL,
	`intent` enum('Buy Now','This Week','Exploring') NOT NULL,
	`status` enum('New','Engaged','Booked','Cold') NOT NULL DEFAULT 'New',
	`smsSent` int DEFAULT 0,
	`sheetsSync` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `leads_id` PRIMARY KEY(`id`),
	CONSTRAINT `leads_leadId_unique` UNIQUE(`leadId`)
);
--> statement-breakpoint
CREATE TABLE `properties` (
	`id` int AUTO_INCREMENT NOT NULL,
	`propertyId` varchar(64) NOT NULL,
	`name` varchar(255) NOT NULL,
	`address` text,
	`price` decimal(12,2),
	`agentPhone` varchar(20),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `properties_id` PRIMARY KEY(`id`),
	CONSTRAINT `properties_propertyId_unique` UNIQUE(`propertyId`)
);
--> statement-breakpoint
CREATE TABLE `sheetsSyncLog` (
	`id` int AUTO_INCREMENT NOT NULL,
	`leadId` varchar(64) NOT NULL,
	`syncedAt` timestamp NOT NULL DEFAULT (now()),
	`status` enum('success','failed','pending') NOT NULL DEFAULT 'pending',
	`errorMessage` text,
	CONSTRAINT `sheetsSyncLog_id` PRIMARY KEY(`id`)
);
