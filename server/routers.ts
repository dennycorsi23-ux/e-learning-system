import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import * as db from "./db";

// Admin procedure - requires admin role
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Accesso riservato agli amministratori" });
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,
  
  // ============================================
  // AUTH
  // ============================================
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ============================================
  // LANGUAGES
  // ============================================
  languages: router({
    list: publicProcedure.query(async () => {
      return db.getAllLanguages();
    }),
    create: adminProcedure
      .input(z.object({
        code: z.string().min(2).max(10),
        name: z.string().min(1).max(100),
        nativeName: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return db.createLanguage(input);
      }),
  }),

  // ============================================
  // QCER LEVELS
  // ============================================
  qcerLevels: router({
    list: publicProcedure.query(async () => {
      return db.getAllQcerLevels();
    }),
  }),

  // ============================================
  // EXAM CENTERS (SEDI)
  // ============================================
  examCenters: router({
    list: publicProcedure.query(async () => {
      return db.getAllExamCenters();
    }),
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return db.getExamCenterById(input.id);
      }),
    create: adminProcedure
      .input(z.object({
        name: z.string().min(1),
        address: z.string().min(1),
        city: z.string().min(1),
        province: z.string().min(1),
        postalCode: z.string().optional(),
        region: z.string().optional(),
        phone: z.string().optional(),
        email: z.string().email().optional(),
        maxCapacity: z.number().optional(),
        hasComputerLab: z.boolean().optional(),
        supportsRemoteExams: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        return db.createExamCenter(input);
      }),
  }),

  // ============================================
  // EXAM SESSIONS
  // ============================================
  examSessions: router({
    list: publicProcedure.query(async () => {
      return db.getAllExamSessions();
    }),
    upcoming: publicProcedure.query(async () => {
      return db.getUpcomingExamSessions();
    }),
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return db.getExamSessionById(input.id);
      }),
    create: adminProcedure
      .input(z.object({
        languageId: z.number(),
        qcerLevelId: z.number(),
        examCenterId: z.number().optional(),
        title: z.string().min(1),
        description: z.string().optional(),
        examDate: z.date(),
        startTime: z.string().optional(),
        maxParticipants: z.number().optional(),
        price: z.string().optional(),
        isRemote: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        return db.createExamSession(input);
      }),
  }),

  // ============================================
  // EXAM REGISTRATIONS
  // ============================================
  examRegistrations: router({
    myRegistrations: protectedProcedure.query(async ({ ctx }) => {
      return db.getUserExamRegistrations(ctx.user.id);
    }),
    register: protectedProcedure
      .input(z.object({ examSessionId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        return db.createExamRegistration({
          userId: ctx.user.id,
          examSessionId: input.examSessionId,
        });
      }),
    cancel: protectedProcedure
      .input(z.object({ registrationId: z.number() }))
      .mutation(async ({ input }) => {
        return db.updateExamRegistration(input.registrationId, { status: "cancelled" });
      }),
  }),

  // ============================================
  // CERTIFICATES
  // ============================================
  certificates: router({
    myCertificates: protectedProcedure.query(async ({ ctx }) => {
      return db.getUserCertificates(ctx.user.id);
    }),
    verify: publicProcedure
      .input(z.object({ code: z.string().min(1) }))
      .query(async ({ input }) => {
        return db.getCertificateByVerificationCode(input.code);
      }),
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return db.getCertificateById(input.id);
      }),
  }),

  // ============================================
  // COURSES
  // ============================================
  courses: router({
    list: publicProcedure.query(async () => {
      return db.getAllCourses();
    }),
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return db.getCourseById(input.id);
      }),
    myEnrollments: protectedProcedure.query(async ({ ctx }) => {
      return db.getUserEnrollments(ctx.user.id);
    }),
  }),

  // ============================================
  // PRICING
  // ============================================
  pricing: router({
    list: publicProcedure.query(async () => {
      return db.getAllPricing();
    }),
  }),

  // ============================================
  // FAQ
  // ============================================
  faqs: router({
    list: publicProcedure.query(async () => {
      return db.getAllFaqs();
    }),
    create: adminProcedure
      .input(z.object({
        question: z.string().min(1),
        answer: z.string().min(1),
        category: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return db.createFaq(input);
      }),
  }),

  // ============================================
  // SAMPLE EXAMS
  // ============================================
  sampleExams: router({
    list: publicProcedure.query(async () => {
      return db.getSampleExams();
    }),
    getByLevelAndSkill: publicProcedure
      .input(z.object({
        qcerLevelId: z.number(),
        skill: z.enum(["listening", "reading", "writing", "speaking"]),
      }))
      .query(async ({ input }) => {
        return db.getSampleExams(undefined, input.qcerLevelId, input.skill);
      }),
  }),

  // ============================================
  // ADMIN
  // ============================================
  admin: router({
    users: router({
      list: adminProcedure.query(async () => {
        return db.getAllUsers();
      }),
      getById: adminProcedure
        .input(z.object({ id: z.number() }))
        .query(async ({ input }) => {
          return db.getUserById(input.id);
        }),
      updateRole: adminProcedure
        .input(z.object({
          userId: z.number(),
          role: z.enum(["user", "admin", "examiner", "student"]),
        }))
        .mutation(async ({ input }) => {
          return db.updateUser(input.userId, { role: input.role });
        }),
    }),
    
    stats: router({
      dashboard: adminProcedure.query(async () => {
        return db.getDashboardStats();
      }),
    }),

    certificates: router({
      list: adminProcedure.query(async () => {
        // Get all certificates by not filtering by user
        const dbInstance = await db.getDb();
        if (!dbInstance) return [];
        const { certificates } = await import("../drizzle/schema");
        const { desc } = await import("drizzle-orm");
        return dbInstance.select().from(certificates).orderBy(desc(certificates.issueDate));
      }),
      revoke: adminProcedure
        .input(z.object({
          certificateId: z.number(),
          reason: z.string().min(1),
        }))
        .mutation(async ({ input }) => {
          return db.updateCertificate(input.certificateId, { 
            status: "revoked", 
            revokedAt: new Date(),
            revokedReason: input.reason 
          });
        }),
    }),

    examSessions: router({
      list: adminProcedure.query(async () => {
        return db.getAllExamSessions();
      }),
    }),
  }),

  // ============================================
  // USER PROFILE
  // ============================================
  profile: router({
    get: protectedProcedure.query(async ({ ctx }) => {
      return db.getUserById(ctx.user.id);
    }),
    update: protectedProcedure
      .input(z.object({
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        phone: z.string().optional(),
        address: z.string().optional(),
        city: z.string().optional(),
        province: z.string().optional(),
        postalCode: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return db.updateUser(ctx.user.id, input);
      }),
  }),
});

export type AppRouter = typeof appRouter;
