CREATE TABLE `audit_log` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`action` varchar(100) NOT NULL,
	`entityType` varchar(50),
	`entityId` int,
	`oldValue` json,
	`newValue` json,
	`ipAddress` varchar(45),
	`userAgent` text,
	`timestamp` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `audit_log_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `certificates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`examId` int NOT NULL,
	`userId` int NOT NULL,
	`certificateNumber` varchar(50) NOT NULL,
	`verificationCode` varchar(100) NOT NULL,
	`languageId` int NOT NULL,
	`qcerLevelId` int NOT NULL,
	`listeningScore` int,
	`readingScore` int,
	`writingScore` int,
	`speakingScore` int,
	`totalScore` int,
	`issueDate` timestamp NOT NULL DEFAULT (now()),
	`expiryDate` timestamp,
	`examDate` timestamp NOT NULL,
	`examCenterName` varchar(200),
	`certificatePdfUrl` text,
	`certificateWithConversionUrl` text,
	`status` enum('active','revoked','expired') DEFAULT 'active',
	`revokedAt` timestamp,
	`revokedReason` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `certificates_id` PRIMARY KEY(`id`),
	CONSTRAINT `certificates_certificateNumber_unique` UNIQUE(`certificateNumber`),
	CONSTRAINT `certificates_verificationCode_unique` UNIQUE(`verificationCode`)
);
--> statement-breakpoint
CREATE TABLE `course_enrollments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`courseId` int NOT NULL,
	`status` enum('pending','active','completed','cancelled') DEFAULT 'pending',
	`enrolledAt` timestamp NOT NULL DEFAULT (now()),
	`completedAt` timestamp,
	`progress` int DEFAULT 0,
	`notes` text,
	CONSTRAINT `course_enrollments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `course_materials` (
	`id` int AUTO_INCREMENT NOT NULL,
	`courseId` int NOT NULL,
	`title` varchar(200) NOT NULL,
	`description` text,
	`type` enum('document','video','audio','link','exercise') NOT NULL,
	`fileUrl` text,
	`externalUrl` text,
	`duration` int,
	`displayOrder` int DEFAULT 0,
	`isRequired` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `course_materials_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `courses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`languageId` int NOT NULL,
	`qcerLevelId` int NOT NULL,
	`title` varchar(200) NOT NULL,
	`description` text,
	`objectives` text,
	`duration` int,
	`price` decimal(10,2),
	`currency` varchar(3) DEFAULT 'EUR',
	`isActive` boolean DEFAULT true,
	`displayOrder` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `courses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `exam_answers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`examId` int NOT NULL,
	`questionId` int NOT NULL,
	`answerText` text,
	`answerAudioUrl` text,
	`answerVideoUrl` text,
	`selectedOptionId` varchar(50),
	`isCorrect` boolean,
	`score` int,
	`feedback` text,
	`answeredAt` timestamp NOT NULL DEFAULT (now()),
	`gradedAt` timestamp,
	`gradedBy` int,
	CONSTRAINT `exam_answers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `exam_centers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(200) NOT NULL,
	`code` varchar(50),
	`address` text NOT NULL,
	`city` varchar(100) NOT NULL,
	`province` varchar(50) NOT NULL,
	`postalCode` varchar(10),
	`region` varchar(100),
	`country` varchar(100) DEFAULT 'Italia',
	`phone` varchar(20),
	`email` varchar(320),
	`contactPerson` varchar(200),
	`maxCapacity` int DEFAULT 50,
	`hasComputerLab` boolean DEFAULT false,
	`computerCount` int DEFAULT 0,
	`hasAudioEquipment` boolean DEFAULT false,
	`hasVideoConference` boolean DEFAULT false,
	`hasAccessibility` boolean DEFAULT false,
	`supportsRemoteExams` boolean DEFAULT false,
	`remotePlatformUrl` text,
	`isActive` boolean DEFAULT true,
	`isAccredited` boolean DEFAULT false,
	`accreditationDate` timestamp,
	`accreditationExpiry` timestamp,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `exam_centers_id` PRIMARY KEY(`id`),
	CONSTRAINT `exam_centers_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `exam_questions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`languageId` int NOT NULL,
	`qcerLevelId` int NOT NULL,
	`skill` enum('listening','reading','writing','speaking') NOT NULL,
	`questionType` enum('multiple_choice','fill_blank','true_false','matching','essay','oral_response') NOT NULL,
	`questionText` text NOT NULL,
	`questionAudioUrl` text,
	`questionImageUrl` text,
	`options` json,
	`correctAnswer` text,
	`points` int DEFAULT 1,
	`timeLimit` int,
	`rubric` text,
	`isActive` boolean DEFAULT true,
	`displayOrder` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `exam_questions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `exam_registrations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`examSessionId` int NOT NULL,
	`status` enum('pending','confirmed','cancelled','completed','no_show') DEFAULT 'pending',
	`paymentStatus` enum('pending','paid','refunded') DEFAULT 'pending',
	`paymentReference` varchar(100),
	`registeredAt` timestamp NOT NULL DEFAULT (now()),
	`confirmedAt` timestamp,
	`notes` text,
	CONSTRAINT `exam_registrations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `exam_sessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`languageId` int NOT NULL,
	`qcerLevelId` int NOT NULL,
	`examCenterId` int,
	`title` varchar(200) NOT NULL,
	`description` text,
	`examDate` timestamp NOT NULL,
	`startTime` varchar(10),
	`endTime` varchar(10),
	`maxParticipants` int DEFAULT 30,
	`currentParticipants` int DEFAULT 0,
	`registrationDeadline` timestamp,
	`price` decimal(10,2),
	`isRemote` boolean DEFAULT false,
	`status` enum('scheduled','ongoing','completed','cancelled') DEFAULT 'scheduled',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `exam_sessions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `examiner_training` (
	`id` int AUTO_INCREMENT NOT NULL,
	`examinerId` int NOT NULL,
	`trainingTitle` varchar(200) NOT NULL,
	`trainingType` enum('initial','refresher','specialization','certification') NOT NULL,
	`provider` varchar(200),
	`hours` int NOT NULL,
	`completedAt` timestamp NOT NULL,
	`certificateUrl` text,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `examiner_training_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `examiners` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`employeeCode` varchar(50),
	`specializations` json,
	`qualifications` text,
	`certifications` text,
	`lastTrainingDate` timestamp,
	`trainingHours` int DEFAULT 0,
	`trainingNotes` text,
	`isActive` boolean DEFAULT true,
	`canGradeWriting` boolean DEFAULT false,
	`canGradeSpeaking` boolean DEFAULT false,
	`maxExamsPerDay` int DEFAULT 10,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `examiners_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `exams` (
	`id` int AUTO_INCREMENT NOT NULL,
	`registrationId` int NOT NULL,
	`userId` int NOT NULL,
	`examSessionId` int NOT NULL,
	`status` enum('not_started','in_progress','completed','invalidated') DEFAULT 'not_started',
	`startedAt` timestamp,
	`completedAt` timestamp,
	`listeningScore` int,
	`readingScore` int,
	`writingScore` int,
	`speakingScore` int,
	`totalScore` int,
	`passed` boolean,
	`proctoringStatus` enum('clean','warning','flagged','invalidated') DEFAULT 'clean',
	`proctoringNotes` text,
	`screenRecordingUrl` text,
	`webcamRecordingUrl` text,
	`examinerId` int,
	`examinerNotes` text,
	`gradedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `exams_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `faqs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`question` text NOT NULL,
	`answer` text NOT NULL,
	`category` varchar(100),
	`isPublished` boolean DEFAULT true,
	`displayOrder` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `faqs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `languages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(10) NOT NULL,
	`name` varchar(100) NOT NULL,
	`nativeName` varchar(100),
	`isActive` boolean DEFAULT true,
	`displayOrder` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `languages_id` PRIMARY KEY(`id`),
	CONSTRAINT `languages_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `material_progress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`materialId` int NOT NULL,
	`isCompleted` boolean DEFAULT false,
	`completedAt` timestamp,
	`timeSpent` int DEFAULT 0,
	`lastAccessedAt` timestamp,
	CONSTRAINT `material_progress_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ministry_reports` (
	`id` int AUTO_INCREMENT NOT NULL,
	`year` int NOT NULL,
	`reportType` enum('annual','quarterly','special') DEFAULT 'annual',
	`title` varchar(200) NOT NULL,
	`content` text,
	`pdfUrl` text,
	`status` enum('draft','submitted','approved') DEFAULT 'draft',
	`submittedAt` timestamp,
	`approvedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `ministry_reports_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`title` varchar(200) NOT NULL,
	`message` text NOT NULL,
	`type` enum('info','success','warning','error') DEFAULT 'info',
	`isRead` boolean DEFAULT false,
	`readAt` timestamp,
	`link` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(200) NOT NULL,
	`title` varchar(200) NOT NULL,
	`content` text,
	`metaDescription` text,
	`isPublished` boolean DEFAULT false,
	`displayOrder` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `pages_id` PRIMARY KEY(`id`),
	CONSTRAINT `pages_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `pricing` (
	`id` int AUTO_INCREMENT NOT NULL,
	`languageId` int,
	`qcerLevelId` int,
	`examType` enum('standard','remote','express') DEFAULT 'standard',
	`price` decimal(10,2) NOT NULL,
	`currency` varchar(3) DEFAULT 'EUR',
	`description` text,
	`isActive` boolean DEFAULT true,
	`validFrom` timestamp,
	`validUntil` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `pricing_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `proctoring_events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`examId` int NOT NULL,
	`eventType` enum('face_not_detected','multiple_faces','face_mismatch','eye_tracking_violation','tab_switch','browser_unfocus','screen_share_stopped','audio_anomaly','object_detected','identity_verification_failed','connection_lost','other') NOT NULL,
	`severity` enum('low','medium','high','critical') DEFAULT 'medium',
	`description` text,
	`screenshotUrl` text,
	`timestamp` timestamp NOT NULL DEFAULT (now()),
	`reviewed` boolean DEFAULT false,
	`reviewedBy` int,
	`reviewedAt` timestamp,
	`reviewNotes` text,
	CONSTRAINT `proctoring_events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `qcer_levels` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(5) NOT NULL,
	`name` varchar(100) NOT NULL,
	`description` text,
	`globalScaleDescription` text,
	`displayOrder` int NOT NULL,
	`minScore` int DEFAULT 0,
	`maxScore` int DEFAULT 100,
	`passingScore` int DEFAULT 60,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `qcer_levels_id` PRIMARY KEY(`id`),
	CONSTRAINT `qcer_levels_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `sample_exams` (
	`id` int AUTO_INCREMENT NOT NULL,
	`languageId` int NOT NULL,
	`qcerLevelId` int NOT NULL,
	`skill` enum('listening','reading','writing','speaking') NOT NULL,
	`title` varchar(200) NOT NULL,
	`description` text,
	`content` text,
	`audioUrl` text,
	`pdfUrl` text,
	`isActive` boolean DEFAULT true,
	`displayOrder` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `sample_exams_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `site_settings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`settingKey` varchar(100) NOT NULL,
	`settingValue` text,
	`settingType` enum('text','html','json','number','boolean','image') DEFAULT 'text',
	`category` varchar(50),
	`description` text,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `site_settings_id` PRIMARY KEY(`id`),
	CONSTRAINT `site_settings_settingKey_unique` UNIQUE(`settingKey`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('user','admin','examiner','student') NOT NULL DEFAULT 'user';--> statement-breakpoint
ALTER TABLE `users` ADD `spidCode` varchar(64);--> statement-breakpoint
ALTER TABLE `users` ADD `fiscalCode` varchar(16);--> statement-breakpoint
ALTER TABLE `users` ADD `spidVerified` boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE `users` ADD `spidVerifiedAt` timestamp;--> statement-breakpoint
ALTER TABLE `users` ADD `firstName` varchar(100);--> statement-breakpoint
ALTER TABLE `users` ADD `lastName` varchar(100);--> statement-breakpoint
ALTER TABLE `users` ADD `birthDate` timestamp;--> statement-breakpoint
ALTER TABLE `users` ADD `birthPlace` varchar(200);--> statement-breakpoint
ALTER TABLE `users` ADD `phone` varchar(20);--> statement-breakpoint
ALTER TABLE `users` ADD `address` text;--> statement-breakpoint
ALTER TABLE `users` ADD `city` varchar(100);--> statement-breakpoint
ALTER TABLE `users` ADD `province` varchar(50);--> statement-breakpoint
ALTER TABLE `users` ADD `postalCode` varchar(10);--> statement-breakpoint
ALTER TABLE `users` ADD `country` varchar(100) DEFAULT 'Italia';--> statement-breakpoint
ALTER TABLE `users` ADD `documentType` varchar(50);--> statement-breakpoint
ALTER TABLE `users` ADD `documentNumber` varchar(50);--> statement-breakpoint
ALTER TABLE `users` ADD `documentExpiry` timestamp;--> statement-breakpoint
ALTER TABLE `users` ADD `documentImageUrl` text;--> statement-breakpoint
ALTER TABLE `users` ADD `profileImageUrl` text;