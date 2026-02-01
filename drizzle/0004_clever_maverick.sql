ALTER TABLE `exam_sessions` MODIFY COLUMN `status` enum('draft','open','confirmed','ongoing','completed','approved','cancelled') DEFAULT 'draft';--> statement-breakpoint
ALTER TABLE `exam_sessions` ADD `requestNumber` varchar(20);--> statement-breakpoint
ALTER TABLE `exam_sessions` ADD `examinerId` int;--> statement-breakpoint
ALTER TABLE `exam_sessions` ADD `zipPassword` varchar(20);--> statement-breakpoint
ALTER TABLE `exam_sessions` ADD `approvedAt` timestamp;--> statement-breakpoint
ALTER TABLE `exam_sessions` ADD `approvedBy` int;