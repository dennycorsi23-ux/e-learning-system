CREATE TABLE `admin_menu` (
	`id` int AUTO_INCREMENT NOT NULL,
	`label` varchar(100) NOT NULL,
	`path` varchar(255) NOT NULL,
	`icon` varchar(50) NOT NULL DEFAULT 'LayoutDashboard',
	`sort_order` int NOT NULL DEFAULT 0,
	`is_active` boolean NOT NULL DEFAULT true,
	`required_role` enum('admin','examiner','user') DEFAULT 'admin',
	`parent_id` int,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `admin_menu_id` PRIMARY KEY(`id`)
);
