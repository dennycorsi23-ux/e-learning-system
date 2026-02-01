import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, json, decimal } from "drizzle-orm/mysql-core";

// ============================================
// USERS & AUTHENTICATION
// ============================================

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  passwordHash: varchar("passwordHash", { length: 255 }), // For email/password auth
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin", "examiner", "student"]).default("user").notNull(),
  // SPID data
  spidCode: varchar("spidCode", { length: 64 }),
  fiscalCode: varchar("fiscalCode", { length: 16 }),
  spidVerified: boolean("spidVerified").default(false),
  spidVerifiedAt: timestamp("spidVerifiedAt"),
  // Personal data
  firstName: varchar("firstName", { length: 100 }),
  lastName: varchar("lastName", { length: 100 }),
  birthDate: timestamp("birthDate"),
  birthPlace: varchar("birthPlace", { length: 200 }),
  phone: varchar("phone", { length: 20 }),
  address: text("address"),
  city: varchar("city", { length: 100 }),
  province: varchar("province", { length: 50 }),
  postalCode: varchar("postalCode", { length: 10 }),
  country: varchar("country", { length: 100 }).default("Italia"),
  documentType: varchar("documentType", { length: 50 }),
  documentNumber: varchar("documentNumber", { length: 50 }),
  documentExpiry: timestamp("documentExpiry"),
  documentImageUrl: text("documentImageUrl"),
  profileImageUrl: text("profileImageUrl"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ============================================
// LANGUAGES
// ============================================

export const languages = mysqlTable("languages", {
  id: int("id").autoincrement().primaryKey(),
  code: varchar("code", { length: 10 }).notNull().unique(), // en, fr, de, es, etc.
  name: varchar("name", { length: 100 }).notNull(), // Inglese, Francese, etc.
  nativeName: varchar("nativeName", { length: 100 }), // English, Français, etc.
  isActive: boolean("isActive").default(true),
  displayOrder: int("displayOrder").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Language = typeof languages.$inferSelect;

// ============================================
// QCER LEVELS
// ============================================

export const qcerLevels = mysqlTable("qcer_levels", {
  id: int("id").autoincrement().primaryKey(),
  code: varchar("code", { length: 5 }).notNull().unique(), // A1, A2, B1, B2, C1, C2
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  globalScaleDescription: text("globalScaleDescription"), // From QCER Global Scale
  displayOrder: int("displayOrder").notNull(),
  minScore: int("minScore").default(0),
  maxScore: int("maxScore").default(100),
  passingScore: int("passingScore").default(60),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type QcerLevel = typeof qcerLevels.$inferSelect;

// ============================================
// EXAM CENTERS (SEDI)
// ============================================

export const examCenters = mysqlTable("exam_centers", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  code: varchar("code", { length: 50 }).unique(),
  address: text("address").notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  province: varchar("province", { length: 50 }).notNull(),
  postalCode: varchar("postalCode", { length: 10 }),
  region: varchar("region", { length: 100 }),
  country: varchar("country", { length: 100 }).default("Italia"),
  phone: varchar("phone", { length: 20 }),
  email: varchar("email", { length: 320 }),
  contactPerson: varchar("contactPerson", { length: 200 }),
  // Capacity and facilities
  maxCapacity: int("maxCapacity").default(50),
  hasComputerLab: boolean("hasComputerLab").default(false),
  computerCount: int("computerCount").default(0),
  hasAudioEquipment: boolean("hasAudioEquipment").default(false),
  hasVideoConference: boolean("hasVideoConference").default(false),
  hasAccessibility: boolean("hasAccessibility").default(false),
  // Remote exam capabilities
  supportsRemoteExams: boolean("supportsRemoteExams").default(false),
  remotePlatformUrl: text("remotePlatformUrl"),
  // Status
  isActive: boolean("isActive").default(true),
  isAccredited: boolean("isAccredited").default(false),
  accreditationDate: timestamp("accreditationDate"),
  accreditationExpiry: timestamp("accreditationExpiry"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ExamCenter = typeof examCenters.$inferSelect;

// ============================================
// COURSES
// ============================================

export const courses = mysqlTable("courses", {
  id: int("id").autoincrement().primaryKey(),
  languageId: int("languageId").notNull(),
  qcerLevelId: int("qcerLevelId").notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  objectives: text("objectives"),
  duration: int("duration"), // hours
  price: decimal("price", { precision: 10, scale: 2 }),
  currency: varchar("currency", { length: 3 }).default("EUR"),
  isActive: boolean("isActive").default(true),
  displayOrder: int("displayOrder").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Course = typeof courses.$inferSelect;

// ============================================
// COURSE MATERIALS
// ============================================

export const courseMaterials = mysqlTable("course_materials", {
  id: int("id").autoincrement().primaryKey(),
  courseId: int("courseId").notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  type: mysqlEnum("type", ["document", "video", "audio", "link", "exercise"]).notNull(),
  fileUrl: text("fileUrl"),
  externalUrl: text("externalUrl"),
  duration: int("duration"), // minutes for video/audio
  displayOrder: int("displayOrder").default(0),
  isRequired: boolean("isRequired").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type CourseMaterial = typeof courseMaterials.$inferSelect;

// ============================================
// COURSE ENROLLMENTS
// ============================================

export const courseEnrollments = mysqlTable("course_enrollments", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  courseId: int("courseId").notNull(),
  status: mysqlEnum("status", ["pending", "active", "completed", "cancelled"]).default("pending"),
  enrolledAt: timestamp("enrolledAt").defaultNow().notNull(),
  completedAt: timestamp("completedAt"),
  progress: int("progress").default(0), // percentage
  notes: text("notes"),
});

export type CourseEnrollment = typeof courseEnrollments.$inferSelect;

// ============================================
// MATERIAL PROGRESS
// ============================================

export const materialProgress = mysqlTable("material_progress", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  materialId: int("materialId").notNull(),
  isCompleted: boolean("isCompleted").default(false),
  completedAt: timestamp("completedAt"),
  timeSpent: int("timeSpent").default(0), // seconds
  lastAccessedAt: timestamp("lastAccessedAt"),
});

// ============================================
// EXAM SESSIONS
// ============================================

export const examSessions = mysqlTable("exam_sessions", {
  id: int("id").autoincrement().primaryKey(),
  languageId: int("languageId").notNull(),
  qcerLevelId: int("qcerLevelId").notNull(),
  examCenterId: int("examCenterId"),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  examDate: timestamp("examDate").notNull(),
  startTime: varchar("startTime", { length: 10 }), // HH:MM
  endTime: varchar("endTime", { length: 10 }),
  maxParticipants: int("maxParticipants").default(30),
  currentParticipants: int("currentParticipants").default(0),
  registrationDeadline: timestamp("registrationDeadline"),
  price: decimal("price", { precision: 10, scale: 2 }),
  isRemote: boolean("isRemote").default(false),
  status: mysqlEnum("status", ["scheduled", "ongoing", "completed", "cancelled"]).default("scheduled"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ExamSession = typeof examSessions.$inferSelect;

// ============================================
// EXAM REGISTRATIONS
// ============================================

export const examRegistrations = mysqlTable("exam_registrations", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  examSessionId: int("examSessionId").notNull(),
  status: mysqlEnum("status", ["pending", "confirmed", "cancelled", "completed", "no_show"]).default("pending"),
  paymentStatus: mysqlEnum("paymentStatus", ["pending", "paid", "refunded"]).default("pending"),
  paymentReference: varchar("paymentReference", { length: 100 }),
  registeredAt: timestamp("registeredAt").defaultNow().notNull(),
  confirmedAt: timestamp("confirmedAt"),
  notes: text("notes"),
});

export type ExamRegistration = typeof examRegistrations.$inferSelect;

// ============================================
// EXAMS (Individual exam attempts)
// ============================================

export const exams = mysqlTable("exams", {
  id: int("id").autoincrement().primaryKey(),
  registrationId: int("registrationId").notNull(),
  userId: int("userId").notNull(),
  examSessionId: int("examSessionId").notNull(),
  status: mysqlEnum("status", ["not_started", "in_progress", "completed", "invalidated"]).default("not_started"),
  startedAt: timestamp("startedAt"),
  completedAt: timestamp("completedAt"),
  // Scores per skill (0-100)
  listeningScore: int("listeningScore"),
  readingScore: int("readingScore"),
  writingScore: int("writingScore"),
  speakingScore: int("speakingScore"),
  totalScore: int("totalScore"),
  passed: boolean("passed"),
  // Proctoring
  proctoringStatus: mysqlEnum("proctoringStatus", ["clean", "warning", "flagged", "invalidated"]).default("clean"),
  proctoringNotes: text("proctoringNotes"),
  screenRecordingUrl: text("screenRecordingUrl"),
  webcamRecordingUrl: text("webcamRecordingUrl"),
  // Examiner
  examinerId: int("examinerId"),
  examinerNotes: text("examinerNotes"),
  gradedAt: timestamp("gradedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Exam = typeof exams.$inferSelect;

// ============================================
// EXAM QUESTIONS
// ============================================

export const examQuestions = mysqlTable("exam_questions", {
  id: int("id").autoincrement().primaryKey(),
  languageId: int("languageId").notNull(),
  qcerLevelId: int("qcerLevelId").notNull(),
  skill: mysqlEnum("skill", ["listening", "reading", "writing", "speaking"]).notNull(),
  questionType: mysqlEnum("questionType", ["multiple_choice", "fill_blank", "true_false", "matching", "essay", "oral_response"]).notNull(),
  questionText: text("questionText").notNull(),
  questionAudioUrl: text("questionAudioUrl"), // For listening
  questionImageUrl: text("questionImageUrl"),
  options: json("options"), // For multiple choice: [{id, text, isCorrect}]
  correctAnswer: text("correctAnswer"),
  points: int("points").default(1),
  timeLimit: int("timeLimit"), // seconds
  rubric: text("rubric"), // Grading criteria for essays/oral
  isActive: boolean("isActive").default(true),
  displayOrder: int("displayOrder").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ExamQuestion = typeof examQuestions.$inferSelect;

// ============================================
// EXAM ANSWERS
// ============================================

export const examAnswers = mysqlTable("exam_answers", {
  id: int("id").autoincrement().primaryKey(),
  examId: int("examId").notNull(),
  questionId: int("questionId").notNull(),
  answerText: text("answerText"),
  answerAudioUrl: text("answerAudioUrl"), // For speaking
  answerVideoUrl: text("answerVideoUrl"),
  selectedOptionId: varchar("selectedOptionId", { length: 50 }),
  isCorrect: boolean("isCorrect"),
  score: int("score"),
  feedback: text("feedback"),
  answeredAt: timestamp("answeredAt").defaultNow().notNull(),
  gradedAt: timestamp("gradedAt"),
  gradedBy: int("gradedBy"),
});

export type ExamAnswer = typeof examAnswers.$inferSelect;

// ============================================
// PROCTORING EVENTS
// ============================================

export const proctoringEvents = mysqlTable("proctoring_events", {
  id: int("id").autoincrement().primaryKey(),
  examId: int("examId").notNull(),
  eventType: mysqlEnum("eventType", [
    "face_not_detected",
    "multiple_faces",
    "face_mismatch",
    "eye_tracking_violation",
    "tab_switch",
    "browser_unfocus",
    "screen_share_stopped",
    "audio_anomaly",
    "object_detected",
    "identity_verification_failed",
    "connection_lost",
    "other"
  ]).notNull(),
  severity: mysqlEnum("severity", ["low", "medium", "high", "critical"]).default("medium"),
  description: text("description"),
  screenshotUrl: text("screenshotUrl"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  reviewed: boolean("reviewed").default(false),
  reviewedBy: int("reviewedBy"),
  reviewedAt: timestamp("reviewedAt"),
  reviewNotes: text("reviewNotes"),
});

export type ProctoringEvent = typeof proctoringEvents.$inferSelect;

// ============================================
// CERTIFICATES
// ============================================

export const certificates = mysqlTable("certificates", {
  id: int("id").autoincrement().primaryKey(),
  examId: int("examId").notNull(),
  userId: int("userId").notNull(),
  certificateNumber: varchar("certificateNumber", { length: 50 }).notNull().unique(),
  verificationCode: varchar("verificationCode", { length: 100 }).notNull().unique(),
  languageId: int("languageId").notNull(),
  qcerLevelId: int("qcerLevelId").notNull(),
  // Scores
  listeningScore: int("listeningScore"),
  readingScore: int("readingScore"),
  writingScore: int("writingScore"),
  speakingScore: int("speakingScore"),
  totalScore: int("totalScore"),
  // Certificate data
  issueDate: timestamp("issueDate").defaultNow().notNull(),
  expiryDate: timestamp("expiryDate"),
  examDate: timestamp("examDate").notNull(),
  examCenterName: varchar("examCenterName", { length: 200 }),
  // Files
  certificatePdfUrl: text("certificatePdfUrl"),
  certificateWithConversionUrl: text("certificateWithConversionUrl"), // With QCER table on back
  // Status
  status: mysqlEnum("status", ["active", "revoked", "expired"]).default("active"),
  revokedAt: timestamp("revokedAt"),
  revokedReason: text("revokedReason"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Certificate = typeof certificates.$inferSelect;

// ============================================
// EXAMINERS
// ============================================

export const examiners = mysqlTable("examiners", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  employeeCode: varchar("employeeCode", { length: 50 }),
  specializations: json("specializations"), // Array of language codes
  qualifications: text("qualifications"),
  certifications: text("certifications"),
  // Training tracking
  lastTrainingDate: timestamp("lastTrainingDate"),
  trainingHours: int("trainingHours").default(0),
  trainingNotes: text("trainingNotes"),
  // Status
  isActive: boolean("isActive").default(true),
  canGradeWriting: boolean("canGradeWriting").default(false),
  canGradeSpeaking: boolean("canGradeSpeaking").default(false),
  maxExamsPerDay: int("maxExamsPerDay").default(10),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Examiner = typeof examiners.$inferSelect;

// ============================================
// EXAMINER TRAINING
// ============================================

export const examinerTraining = mysqlTable("examiner_training", {
  id: int("id").autoincrement().primaryKey(),
  examinerId: int("examinerId").notNull(),
  trainingTitle: varchar("trainingTitle", { length: 200 }).notNull(),
  trainingType: mysqlEnum("trainingType", ["initial", "refresher", "specialization", "certification"]).notNull(),
  provider: varchar("provider", { length: 200 }),
  hours: int("hours").notNull(),
  completedAt: timestamp("completedAt").notNull(),
  certificateUrl: text("certificateUrl"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ============================================
// SITE SETTINGS
// ============================================

export const siteSettings = mysqlTable("site_settings", {
  id: int("id").autoincrement().primaryKey(),
  settingKey: varchar("settingKey", { length: 100 }).notNull().unique(),
  settingValue: text("settingValue"),
  settingType: mysqlEnum("settingType", ["text", "html", "json", "number", "boolean", "image"]).default("text"),
  category: varchar("category", { length: 50 }),
  description: text("description"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SiteSetting = typeof siteSettings.$inferSelect;

// ============================================
// PAGES (CMS)
// ============================================

export const pages = mysqlTable("pages", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 200 }).notNull().unique(),
  title: varchar("title", { length: 200 }).notNull(),
  content: text("content"),
  metaDescription: text("metaDescription"),
  isPublished: boolean("isPublished").default(false),
  displayOrder: int("displayOrder").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Page = typeof pages.$inferSelect;

// ============================================
// SAMPLE EXAMS (Public examples)
// ============================================

export const sampleExams = mysqlTable("sample_exams", {
  id: int("id").autoincrement().primaryKey(),
  languageId: int("languageId").notNull(),
  qcerLevelId: int("qcerLevelId").notNull(),
  skill: mysqlEnum("skill", ["listening", "reading", "writing", "speaking"]).notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  content: text("content"), // HTML or markdown
  audioUrl: text("audioUrl"),
  pdfUrl: text("pdfUrl"),
  isActive: boolean("isActive").default(true),
  displayOrder: int("displayOrder").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SampleExam = typeof sampleExams.$inferSelect;

// ============================================
// PRICING
// ============================================

export const pricing = mysqlTable("pricing", {
  id: int("id").autoincrement().primaryKey(),
  languageId: int("languageId"),
  qcerLevelId: int("qcerLevelId"),
  examType: mysqlEnum("examType", ["standard", "remote", "express"]).default("standard"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).default("EUR"),
  description: text("description"),
  isActive: boolean("isActive").default(true),
  validFrom: timestamp("validFrom"),
  validUntil: timestamp("validUntil"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Pricing = typeof pricing.$inferSelect;

// ============================================
// AUDIT LOG
// ============================================

export const auditLog = mysqlTable("audit_log", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  action: varchar("action", { length: 100 }).notNull(),
  entityType: varchar("entityType", { length: 50 }),
  entityId: int("entityId"),
  oldValue: json("oldValue"),
  newValue: json("newValue"),
  ipAddress: varchar("ipAddress", { length: 45 }),
  userAgent: text("userAgent"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export type AuditLog = typeof auditLog.$inferSelect;

// ============================================
// NOTIFICATIONS
// ============================================

export const notifications = mysqlTable("notifications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  message: text("message").notNull(),
  type: mysqlEnum("type", ["info", "success", "warning", "error"]).default("info"),
  isRead: boolean("isRead").default(false),
  readAt: timestamp("readAt"),
  link: text("link"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Notification = typeof notifications.$inferSelect;

// ============================================
// MINISTRY REPORTS
// ============================================

export const ministryReports = mysqlTable("ministry_reports", {
  id: int("id").autoincrement().primaryKey(),
  year: int("year").notNull(),
  reportType: mysqlEnum("reportType", ["annual", "quarterly", "special"]).default("annual"),
  title: varchar("title", { length: 200 }).notNull(),
  content: text("content"),
  pdfUrl: text("pdfUrl"),
  status: mysqlEnum("status", ["draft", "submitted", "approved"]).default("draft"),
  submittedAt: timestamp("submittedAt"),
  approvedAt: timestamp("approvedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type MinistryReport = typeof ministryReports.$inferSelect;

// ============================================
// FAQ
// ============================================

export const faqs = mysqlTable("faqs", {
  id: int("id").autoincrement().primaryKey(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  category: varchar("category", { length: 100 }),
  isPublished: boolean("isPublished").default(true),
  displayOrder: int("displayOrder").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Faq = typeof faqs.$inferSelect;
