import { eq, and, desc, asc, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  users, InsertUser, User,
  languages, Language,
  qcerLevels, QcerLevel,
  examCenters, ExamCenter,
  courses, Course,
  courseMaterials, CourseMaterial,
  courseEnrollments, CourseEnrollment,
  materialProgress,
  examSessions, ExamSession,
  examRegistrations, ExamRegistration,
  exams, Exam,
  examQuestions, ExamQuestion,
  examAnswers, ExamAnswer,
  proctoringEvents, ProctoringEvent,
  certificates, Certificate,
  examiners, Examiner,
  examinerTraining,
  siteSettings, SiteSetting,
  pages, Page,
  sampleExams, SampleExam,
  pricing, Pricing,
  auditLog, AuditLog,
  notifications, Notification,
  ministryReports, MinistryReport,
  faqs, Faq
} from "../drizzle/schema";

let _db: ReturnType<typeof drizzle> | null = null;

// Use RAILWAY_DATABASE_URL if available, otherwise fall back to DATABASE_URL
function getDatabaseUrl(): string | undefined {
  return process.env.RAILWAY_DATABASE_URL || process.env.DATABASE_URL;
}

export async function getDb() {
  const dbUrl = getDatabaseUrl();
  if (!_db && dbUrl) {
    try {
      _db = drizzle(dbUrl);
      console.log("[Database] Connected successfully");
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ============================================
// USER QUERIES
// ============================================

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod", "firstName", "lastName", "phone", "address", "city", "province", "postalCode", "country", "fiscalCode", "spidCode"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      (values as any)[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserByEmail(email: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserByFiscalCode(fiscalCode: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.fiscalCode, fiscalCode)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getAllUsers(role?: string) {
  const db = await getDb();
  if (!db) return [];
  if (role) {
    return db.select().from(users).where(eq(users.role, role as any)).orderBy(desc(users.createdAt));
  }
  return db.select().from(users).orderBy(desc(users.createdAt));
}

export async function updateUser(id: number, data: Partial<InsertUser>) {
  const db = await getDb();
  if (!db) return;
  await db.update(users).set({ ...data, updatedAt: new Date() }).where(eq(users.id, id));
}

export async function deleteUser(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(users).where(eq(users.id, id));
}

// ============================================
// LANGUAGE QUERIES
// ============================================

export async function getAllLanguages(activeOnly = true) {
  const db = await getDb();
  if (!db) return [];
  if (activeOnly) {
    return db.select().from(languages).where(eq(languages.isActive, true)).orderBy(asc(languages.displayOrder));
  }
  return db.select().from(languages).orderBy(asc(languages.displayOrder));
}

export async function getLanguageById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(languages).where(eq(languages.id, id)).limit(1);
  return result[0];
}

export async function createLanguage(data: typeof languages.$inferInsert) {
  const db = await getDb();
  if (!db) return;
  await db.insert(languages).values(data);
}

export async function updateLanguage(id: number, data: Partial<typeof languages.$inferInsert>) {
  const db = await getDb();
  if (!db) return;
  await db.update(languages).set(data).where(eq(languages.id, id));
}

// ============================================
// QCER LEVEL QUERIES
// ============================================

export async function getAllQcerLevels() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(qcerLevels).orderBy(asc(qcerLevels.displayOrder));
}

export async function getQcerLevelById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(qcerLevels).where(eq(qcerLevels.id, id)).limit(1);
  return result[0];
}

export async function getQcerLevelByCode(code: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(qcerLevels).where(eq(qcerLevels.code, code)).limit(1);
  return result[0];
}

// ============================================
// EXAM CENTER QUERIES
// ============================================

export async function getAllExamCenters(activeOnly = true) {
  const db = await getDb();
  if (!db) return [];
  if (activeOnly) {
    return db.select().from(examCenters).where(eq(examCenters.isActive, true)).orderBy(asc(examCenters.name));
  }
  return db.select().from(examCenters).orderBy(asc(examCenters.name));
}

export async function getExamCenterById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(examCenters).where(eq(examCenters.id, id)).limit(1);
  return result[0];
}

export async function createExamCenter(data: typeof examCenters.$inferInsert) {
  const db = await getDb();
  if (!db) return;
  await db.insert(examCenters).values(data);
}

export async function updateExamCenter(id: number, data: Partial<typeof examCenters.$inferInsert>) {
  const db = await getDb();
  if (!db) return;
  await db.update(examCenters).set({ ...data, updatedAt: new Date() }).where(eq(examCenters.id, id));
}

// ============================================
// COURSE QUERIES
// ============================================

export async function getAllCourses(activeOnly = true) {
  const db = await getDb();
  if (!db) return [];
  if (activeOnly) {
    return db.select().from(courses).where(eq(courses.isActive, true)).orderBy(asc(courses.displayOrder));
  }
  return db.select().from(courses).orderBy(asc(courses.displayOrder));
}

export async function getCourseById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(courses).where(eq(courses.id, id)).limit(1);
  return result[0];
}

export async function getCoursesByLanguage(languageId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(courses).where(and(eq(courses.languageId, languageId), eq(courses.isActive, true))).orderBy(asc(courses.displayOrder));
}

export async function createCourse(data: typeof courses.$inferInsert) {
  const db = await getDb();
  if (!db) return;
  await db.insert(courses).values(data);
}

export async function updateCourse(id: number, data: Partial<typeof courses.$inferInsert>) {
  const db = await getDb();
  if (!db) return;
  await db.update(courses).set({ ...data, updatedAt: new Date() }).where(eq(courses.id, id));
}

// ============================================
// COURSE MATERIALS QUERIES
// ============================================

export async function getMaterialsByCourse(courseId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(courseMaterials).where(eq(courseMaterials.courseId, courseId)).orderBy(asc(courseMaterials.displayOrder));
}

export async function createCourseMaterial(data: typeof courseMaterials.$inferInsert) {
  const db = await getDb();
  if (!db) return;
  await db.insert(courseMaterials).values(data);
}

// ============================================
// ENROLLMENT QUERIES
// ============================================

export async function getUserEnrollments(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(courseEnrollments).where(eq(courseEnrollments.userId, userId)).orderBy(desc(courseEnrollments.enrolledAt));
}

export async function getCourseEnrollments(courseId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(courseEnrollments).where(eq(courseEnrollments.courseId, courseId));
}

export async function createEnrollment(data: typeof courseEnrollments.$inferInsert) {
  const db = await getDb();
  if (!db) return;
  await db.insert(courseEnrollments).values(data);
}

export async function updateEnrollment(id: number, data: Partial<typeof courseEnrollments.$inferInsert>) {
  const db = await getDb();
  if (!db) return;
  await db.update(courseEnrollments).set(data).where(eq(courseEnrollments.id, id));
}

// ============================================
// EXAM SESSION QUERIES
// ============================================

export async function getAllExamSessions(status?: string) {
  const db = await getDb();
  if (!db) return [];
  if (status) {
    return db.select().from(examSessions).where(eq(examSessions.status, status as any)).orderBy(asc(examSessions.examDate));
  }
  return db.select().from(examSessions).orderBy(asc(examSessions.examDate));
}

export async function getUpcomingExamSessions() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(examSessions)
    .where(and(
      eq(examSessions.status, 'scheduled'),
      sql`${examSessions.examDate} >= NOW()`
    ))
    .orderBy(asc(examSessions.examDate));
}

export async function getExamSessionById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(examSessions).where(eq(examSessions.id, id)).limit(1);
  return result[0];
}

export async function createExamSession(data: typeof examSessions.$inferInsert) {
  const db = await getDb();
  if (!db) return;
  await db.insert(examSessions).values(data);
}

export async function updateExamSession(id: number, data: Partial<typeof examSessions.$inferInsert>) {
  const db = await getDb();
  if (!db) return;
  await db.update(examSessions).set({ ...data, updatedAt: new Date() }).where(eq(examSessions.id, id));
}

// ============================================
// EXAM REGISTRATION QUERIES
// ============================================

export async function getUserExamRegistrations(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(examRegistrations).where(eq(examRegistrations.userId, userId)).orderBy(desc(examRegistrations.registeredAt));
}

export async function getSessionRegistrations(sessionId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(examRegistrations).where(eq(examRegistrations.examSessionId, sessionId));
}

export async function createExamRegistration(data: typeof examRegistrations.$inferInsert) {
  const db = await getDb();
  if (!db) return;
  await db.insert(examRegistrations).values(data);
}

export async function updateExamRegistration(id: number, data: Partial<typeof examRegistrations.$inferInsert>) {
  const db = await getDb();
  if (!db) return;
  await db.update(examRegistrations).set(data).where(eq(examRegistrations.id, id));
}

// ============================================
// EXAM QUERIES
// ============================================

export async function getExamById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(exams).where(eq(exams.id, id)).limit(1);
  return result[0];
}

export async function getUserExams(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(exams).where(eq(exams.userId, userId)).orderBy(desc(exams.createdAt));
}

export async function createExam(data: typeof exams.$inferInsert) {
  const db = await getDb();
  if (!db) return;
  await db.insert(exams).values(data);
}

export async function updateExam(id: number, data: Partial<typeof exams.$inferInsert>) {
  const db = await getDb();
  if (!db) return;
  await db.update(exams).set({ ...data, updatedAt: new Date() }).where(eq(exams.id, id));
}

// ============================================
// EXAM QUESTIONS QUERIES
// ============================================

export async function getQuestionsByLevelAndSkill(levelId: number, skill: string, languageId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(examQuestions)
    .where(and(
      eq(examQuestions.qcerLevelId, levelId),
      eq(examQuestions.skill, skill as any),
      eq(examQuestions.languageId, languageId),
      eq(examQuestions.isActive, true)
    ))
    .orderBy(asc(examQuestions.displayOrder));
}

export async function createExamQuestion(data: typeof examQuestions.$inferInsert) {
  const db = await getDb();
  if (!db) return;
  await db.insert(examQuestions).values(data);
}

// ============================================
// EXAM ANSWERS QUERIES
// ============================================

export async function getExamAnswers(examId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(examAnswers).where(eq(examAnswers.examId, examId));
}

export async function createExamAnswer(data: typeof examAnswers.$inferInsert) {
  const db = await getDb();
  if (!db) return;
  await db.insert(examAnswers).values(data);
}

export async function updateExamAnswer(id: number, data: Partial<typeof examAnswers.$inferInsert>) {
  const db = await getDb();
  if (!db) return;
  await db.update(examAnswers).set(data).where(eq(examAnswers.id, id));
}

// ============================================
// PROCTORING EVENTS QUERIES
// ============================================

export async function getExamProctoringEvents(examId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(proctoringEvents).where(eq(proctoringEvents.examId, examId)).orderBy(desc(proctoringEvents.timestamp));
}

export async function createProctoringEvent(data: typeof proctoringEvents.$inferInsert) {
  const db = await getDb();
  if (!db) return;
  await db.insert(proctoringEvents).values(data);
}

// ============================================
// CERTIFICATE QUERIES
// ============================================

export async function getCertificateById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(certificates).where(eq(certificates.id, id)).limit(1);
  return result[0];
}

export async function getCertificateByVerificationCode(code: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(certificates).where(eq(certificates.verificationCode, code)).limit(1);
  return result[0];
}

export async function getCertificateByNumber(number: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(certificates).where(eq(certificates.certificateNumber, number)).limit(1);
  return result[0];
}

export async function getUserCertificates(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(certificates).where(eq(certificates.userId, userId)).orderBy(desc(certificates.issueDate));
}

export async function createCertificate(data: typeof certificates.$inferInsert) {
  const db = await getDb();
  if (!db) return;
  await db.insert(certificates).values(data);
}

export async function updateCertificate(id: number, data: Partial<typeof certificates.$inferInsert>) {
  const db = await getDb();
  if (!db) return;
  await db.update(certificates).set(data).where(eq(certificates.id, id));
}

// ============================================
// EXAMINER QUERIES
// ============================================

export async function getAllExaminers(activeOnly = true) {
  const db = await getDb();
  if (!db) return [];
  if (activeOnly) {
    return db.select().from(examiners).where(eq(examiners.isActive, true));
  }
  return db.select().from(examiners);
}

export async function getExaminerByUserId(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(examiners).where(eq(examiners.userId, userId)).limit(1);
  return result[0];
}

export async function createExaminer(data: typeof examiners.$inferInsert) {
  const db = await getDb();
  if (!db) return;
  await db.insert(examiners).values(data);
}

export async function updateExaminer(id: number, data: Partial<typeof examiners.$inferInsert>) {
  const db = await getDb();
  if (!db) return;
  await db.update(examiners).set({ ...data, updatedAt: new Date() }).where(eq(examiners.id, id));
}

// ============================================
// SITE SETTINGS QUERIES
// ============================================

export async function getSetting(key: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(siteSettings).where(eq(siteSettings.settingKey, key)).limit(1);
  return result[0];
}

export async function getAllSettings(category?: string) {
  const db = await getDb();
  if (!db) return [];
  if (category) {
    return db.select().from(siteSettings).where(eq(siteSettings.category, category));
  }
  return db.select().from(siteSettings);
}

export async function upsertSetting(key: string, value: string, type: string = 'text', category?: string) {
  const db = await getDb();
  if (!db) return;
  await db.insert(siteSettings).values({
    settingKey: key,
    settingValue: value,
    settingType: type as any,
    category
  }).onDuplicateKeyUpdate({
    set: { settingValue: value, settingType: type as any, category }
  });
}

// ============================================
// PAGES QUERIES
// ============================================

export async function getPageBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(pages).where(eq(pages.slug, slug)).limit(1);
  return result[0];
}

export async function getAllPages(publishedOnly = true) {
  const db = await getDb();
  if (!db) return [];
  if (publishedOnly) {
    return db.select().from(pages).where(eq(pages.isPublished, true)).orderBy(asc(pages.displayOrder));
  }
  return db.select().from(pages).orderBy(asc(pages.displayOrder));
}

export async function createPage(data: typeof pages.$inferInsert) {
  const db = await getDb();
  if (!db) return;
  await db.insert(pages).values(data);
}

export async function updatePage(id: number, data: Partial<typeof pages.$inferInsert>) {
  const db = await getDb();
  if (!db) return;
  await db.update(pages).set({ ...data, updatedAt: new Date() }).where(eq(pages.id, id));
}

// ============================================
// SAMPLE EXAMS QUERIES
// ============================================

export async function getSampleExams(languageId?: number, levelId?: number, skill?: string) {
  const db = await getDb();
  if (!db) return [];
  
  let conditions = [eq(sampleExams.isActive, true)];
  if (languageId) conditions.push(eq(sampleExams.languageId, languageId));
  if (levelId) conditions.push(eq(sampleExams.qcerLevelId, levelId));
  if (skill) conditions.push(eq(sampleExams.skill, skill as any));
  
  return db.select().from(sampleExams).where(and(...conditions)).orderBy(asc(sampleExams.displayOrder));
}

export async function createSampleExam(data: typeof sampleExams.$inferInsert) {
  const db = await getDb();
  if (!db) return;
  await db.insert(sampleExams).values(data);
}

// ============================================
// PRICING QUERIES
// ============================================

export async function getAllPricing(activeOnly = true) {
  const db = await getDb();
  if (!db) return [];
  if (activeOnly) {
    return db.select().from(pricing).where(eq(pricing.isActive, true));
  }
  return db.select().from(pricing);
}

export async function createPricing(data: typeof pricing.$inferInsert) {
  const db = await getDb();
  if (!db) return;
  await db.insert(pricing).values(data);
}

// ============================================
// AUDIT LOG QUERIES
// ============================================

export async function createAuditLog(data: typeof auditLog.$inferInsert) {
  const db = await getDb();
  if (!db) return;
  await db.insert(auditLog).values(data);
}

export async function getAuditLogs(entityType?: string, entityId?: number, limit = 100) {
  const db = await getDb();
  if (!db) return [];
  
  let conditions = [];
  if (entityType) conditions.push(eq(auditLog.entityType, entityType));
  if (entityId) conditions.push(eq(auditLog.entityId, entityId));
  
  if (conditions.length > 0) {
    return db.select().from(auditLog).where(and(...conditions)).orderBy(desc(auditLog.timestamp)).limit(limit);
  }
  return db.select().from(auditLog).orderBy(desc(auditLog.timestamp)).limit(limit);
}

// ============================================
// NOTIFICATION QUERIES
// ============================================

export async function getUserNotifications(userId: number, unreadOnly = false) {
  const db = await getDb();
  if (!db) return [];
  if (unreadOnly) {
    return db.select().from(notifications).where(and(eq(notifications.userId, userId), eq(notifications.isRead, false))).orderBy(desc(notifications.createdAt));
  }
  return db.select().from(notifications).where(eq(notifications.userId, userId)).orderBy(desc(notifications.createdAt));
}

export async function createNotification(data: typeof notifications.$inferInsert) {
  const db = await getDb();
  if (!db) return;
  await db.insert(notifications).values(data);
}

export async function markNotificationRead(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.update(notifications).set({ isRead: true, readAt: new Date() }).where(eq(notifications.id, id));
}

// ============================================
// FAQ QUERIES
// ============================================

export async function getAllFaqs(publishedOnly = true) {
  const db = await getDb();
  if (!db) return [];
  if (publishedOnly) {
    return db.select().from(faqs).where(eq(faqs.isPublished, true)).orderBy(asc(faqs.displayOrder));
  }
  return db.select().from(faqs).orderBy(asc(faqs.displayOrder));
}

export async function createFaq(data: typeof faqs.$inferInsert) {
  const db = await getDb();
  if (!db) return;
  await db.insert(faqs).values(data);
}

export async function updateFaq(id: number, data: Partial<typeof faqs.$inferInsert>) {
  const db = await getDb();
  if (!db) return;
  await db.update(faqs).set({ ...data, updatedAt: new Date() }).where(eq(faqs.id, id));
}

// ============================================
// MINISTRY REPORTS QUERIES
// ============================================

export async function getAllMinistryReports() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(ministryReports).orderBy(desc(ministryReports.year));
}

export async function createMinistryReport(data: typeof ministryReports.$inferInsert) {
  const db = await getDb();
  if (!db) return;
  await db.insert(ministryReports).values(data);
}

export async function updateMinistryReport(id: number, data: Partial<typeof ministryReports.$inferInsert>) {
  const db = await getDb();
  if (!db) return;
  await db.update(ministryReports).set({ ...data, updatedAt: new Date() }).where(eq(ministryReports.id, id));
}

// ============================================
// STATISTICS QUERIES
// ============================================

export async function getDashboardStats() {
  const db = await getDb();
  if (!db) return null;
  
  const [userCount] = await db.select({ count: sql<number>`count(*)` }).from(users);
  const [examCount] = await db.select({ count: sql<number>`count(*)` }).from(exams);
  const [certCount] = await db.select({ count: sql<number>`count(*)` }).from(certificates);
  const [centerCount] = await db.select({ count: sql<number>`count(*)` }).from(examCenters).where(eq(examCenters.isActive, true));
  
  return {
    totalUsers: userCount?.count || 0,
    totalExams: examCount?.count || 0,
    totalCertificates: certCount?.count || 0,
    totalCenters: centerCount?.count || 0
  };
}
