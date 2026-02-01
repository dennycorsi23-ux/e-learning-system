import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import * as db from "./db";
import { generateCertificateHTML, generateCertificateNumber, generateVerificationCode } from "./services/certificateGenerator";
import { loginWithEmailPassword, registerUser, changePassword, setUserPassword } from "./services/authService";
import { SPID_IDP_LIST, generateSpidAuthnRequest, validateSpidProfileForExam, SpidUserProfile } from "./services/spidService";
import { SignJWT, jwtVerify } from "jose";
import { ENV } from "./_core/env";

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
    
    // Login con email e password
    login: publicProcedure
      .input(z.object({
        email: z.string().email(),
        password: z.string().min(1),
      }))
      .mutation(async ({ input, ctx }) => {
        const result = await loginWithEmailPassword(input.email, input.password);
        
        if (!result.success || !result.user) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: result.error || "Login fallito" });
        }
        
        // Genera JWT token con i campi richiesti da verifySession
        const secret = new TextEncoder().encode(ENV.cookieSecret);
        const token = await new SignJWT({ 
          openId: result.user.openId,
          appId: ENV.appId || "certifica-lingua",
          name: result.user.name || result.user.email || "",
        })
          .setProtectedHeader({ alg: "HS256", typ: "JWT" })
          .setIssuedAt()
          .setExpirationTime("7d")
          .sign(secret);
        
        // Imposta il cookie di sessione
        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie(COOKIE_NAME, token, {
          ...cookieOptions,
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 giorni
        });
        
        return { success: true, user: result.user };
      }),
    
    // Registrazione nuovo utente (solo admin)
    register: adminProcedure
      .input(z.object({
        email: z.string().email(),
        password: z.string().min(8),
        name: z.string().min(1),
        role: z.enum(["user", "admin", "examiner", "student"]),
        fiscalCode: z.string().optional(),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        phone: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const result = await registerUser(input);
        if (!result.success) {
          throw new TRPCError({ code: "BAD_REQUEST", message: result.error || "Registrazione fallita" });
        }
        return result;
      }),
    
    // Cambio password (utente autenticato)
    changePassword: protectedProcedure
      .input(z.object({
        oldPassword: z.string().min(1),
        newPassword: z.string().min(8),
      }))
      .mutation(async ({ input, ctx }) => {
        const result = await changePassword(ctx.user.id, input.oldPassword, input.newPassword);
        if (!result.success) {
          throw new TRPCError({ code: "BAD_REQUEST", message: result.error || "Cambio password fallito" });
        }
        return result;
      }),
    
    // Imposta password per un utente (solo admin)
    setUserPassword: adminProcedure
      .input(z.object({
        userId: z.number(),
        newPassword: z.string().min(8),
      }))
      .mutation(async ({ input }) => {
        const result = await setUserPassword(input.userId, input.newPassword);
        if (!result.success) {
          throw new TRPCError({ code: "BAD_REQUEST", message: result.error || "Impostazione password fallita" });
        }
        return result;
      }),
    
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
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().min(1).optional(),
        address: z.string().min(1).optional(),
        city: z.string().min(1).optional(),
        province: z.string().min(1).optional(),
        postalCode: z.string().optional(),
        region: z.string().optional(),
        phone: z.string().optional(),
        email: z.string().email().optional(),
        maxCapacity: z.number().optional(),
        hasComputerLab: z.boolean().optional(),
        supportsRemoteExams: z.boolean().optional(),
        isActive: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return db.updateExamCenter(id, data);
      }),
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return db.deleteExamCenter(input.id);
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
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        languageId: z.number().optional(),
        qcerLevelId: z.number().optional(),
        examCenterId: z.number().optional(),
        title: z.string().min(1).optional(),
        description: z.string().optional(),
        examDate: z.date().optional(),
        startTime: z.string().optional(),
        maxParticipants: z.number().optional(),
        price: z.string().optional(),
        isRemote: z.boolean().optional(),
        status: z.enum(["scheduled", "in_progress", "completed", "cancelled"]).optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return db.updateExamSession(id, data as any);
      }),
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return db.deleteExamSession(input.id);
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
    generatePDF: protectedProcedure
      .input(z.object({ certificateId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const cert = await db.getCertificateById(input.certificateId);
        if (!cert) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Certificato non trovato" });
        }
        
        // Get user data
        const user = await db.getUserById(cert.userId);
        if (!user) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Utente non trovato" });
        }
        
        // Generate certificate HTML
        const html = generateCertificateHTML(
          {
            candidate: {
              firstName: user.firstName || user.name || "Nome",
              lastName: user.lastName || "Cognome",
              fiscalCode: user.fiscalCode || "XXXXXX00X00X000X",
              birthDate: user.birthDate || new Date(1990, 0, 1),
              birthPlace: user.birthPlace || "Italia",
            },
            language: "Inglese",
            languageNative: "English",
            qcerLevel: "B2", // TODO: fetch from qcerLevels table using cert.qcerLevelId
            scores: {
              listening: cert.listeningScore || 0,
              reading: cert.readingScore || 0,
              writing: cert.writingScore || 0,
              speaking: cert.speakingScore || 0,
              total: cert.totalScore || 0,
            },
            examDate: cert.examDate || new Date(),
            examCenter: cert.examCenterName || "Sede Centrale",
            examCenterCity: "Roma",
          },
          {
            name: "CertificaLingua",
            address: "Via Roma 1",
            city: "Roma",
            phone: "+39 06 1234567",
            email: "info@certificalingua.it",
            website: "www.certificalingua.it",
            accreditationNumber: "MIM-2024-001",
          },
          cert.certificateNumber || generateCertificateNumber(),
          cert.verificationCode || generateVerificationCode()
        );
        
        return { html, certificateNumber: cert.certificateNumber };
      }),
  }),

  // ============================================
  // COURSES
  // ============================================
  courses: router({
    list: publicProcedure.query(async () => {
      return db.getAllCourses();
    }),
    listAll: adminProcedure.query(async () => {
      return db.getAllCourses(false); // Include inactive
    }),
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return db.getCourseById(input.id);
      }),
    myEnrollments: protectedProcedure.query(async ({ ctx }) => {
      return db.getUserEnrollments(ctx.user.id);
    }),
    create: adminProcedure
      .input(z.object({
        languageId: z.number(),
        qcerLevelId: z.number(),
        title: z.string().min(1),
        description: z.string().optional(),
        objectives: z.string().optional(),
        duration: z.number().optional(),
        price: z.string().optional(),
        isActive: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        return db.createCourse(input);
      }),
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        languageId: z.number().optional(),
        qcerLevelId: z.number().optional(),
        title: z.string().min(1).optional(),
        description: z.string().optional(),
        objectives: z.string().optional(),
        duration: z.number().optional(),
        price: z.string().optional(),
        isActive: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return db.updateCourse(id, data);
      }),
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return db.deleteCourse(input.id);
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
      create: adminProcedure
        .input(z.object({
          email: z.string().email(),
          password: z.string().min(8),
          name: z.string().min(1),
          role: z.enum(["user", "admin", "examiner", "student"]),
          firstName: z.string().optional(),
          lastName: z.string().optional(),
          phone: z.string().optional(),
          fiscalCode: z.string().optional(),
        }))
        .mutation(async ({ input }) => {
          return registerUser(input);
        }),
      update: adminProcedure
        .input(z.object({
          id: z.number(),
          name: z.string().optional(),
          email: z.string().email().optional(),
          role: z.enum(["user", "admin", "examiner", "student"]).optional(),
          firstName: z.string().optional(),
          lastName: z.string().optional(),
          phone: z.string().optional(),
          fiscalCode: z.string().optional(),
        }))
        .mutation(async ({ input }) => {
          const { id, ...data } = input;
          return db.updateUser(id, data);
        }),
      updateRole: adminProcedure
        .input(z.object({
          userId: z.number(),
          role: z.enum(["user", "admin", "examiner", "student"]),
        }))
        .mutation(async ({ input }) => {
          return db.updateUser(input.userId, { role: input.role });
        }),
      delete: adminProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ input }) => {
          return db.deleteUser(input.id);
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
  // SPID
  // ============================================
  spid: router({
    // Lista degli Identity Provider SPID disponibili
    idpList: publicProcedure.query(() => {
      return SPID_IDP_LIST.map(idp => ({
        id: idp.id,
        name: idp.name,
        logoUrl: idp.logoUrl,
      }));
    }),
    
    // Genera URL per autenticazione SPID
    getAuthUrl: publicProcedure
      .input(z.object({
        idpId: z.string(),
        returnUrl: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const idp = SPID_IDP_LIST.find(i => i.id === input.idpId);
        if (!idp) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Identity Provider non valido" });
        }
        
        // In produzione, usare l'URL reale del sito
        const baseUrl = process.env.SITE_URL || "https://certificalingua.it";
        const spEntityId = baseUrl;
        const acsUrl = `${baseUrl}/api/spid/callback`;
        
        // Genera la richiesta SAML
        const authnRequest = generateSpidAuthnRequest(
          idp.ssoUrl,
          spEntityId,
          acsUrl,
          2 // Livello SPID 2 per certificazioni
        );
        
        // Codifica in Base64
        const encodedRequest = Buffer.from(authnRequest).toString("base64");
        
        // Costruisci URL di redirect
        const redirectUrl = `${idp.ssoUrl}?SAMLRequest=${encodeURIComponent(encodedRequest)}`;
        
        return {
          url: redirectUrl,
          idpId: idp.id,
          idpName: idp.name,
        };
      }),
    
    // Valida profilo SPID per esame
    validateProfile: protectedProcedure
      .input(z.object({
        spidCode: z.string(),
        fiscalNumber: z.string(),
        name: z.string(),
        familyName: z.string(),
        dateOfBirth: z.string().optional(),
        placeOfBirth: z.string().optional(),
        email: z.string().optional(),
        gender: z.enum(["M", "F"]).optional(),
      }))
      .mutation(async ({ input }) => {
        const profile: SpidUserProfile = {
          spidCode: input.spidCode,
          fiscalNumber: input.fiscalNumber,
          name: input.name,
          familyName: input.familyName,
          dateOfBirth: input.dateOfBirth,
          placeOfBirth: input.placeOfBirth,
          email: input.email,
          gender: input.gender,
        };
        
        return validateSpidProfileForExam(profile);
      }),
    
    // Salva dati SPID nel profilo utente
    saveToProfile: protectedProcedure
      .input(z.object({
        spidCode: z.string(),
        fiscalNumber: z.string(),
        name: z.string(),
        familyName: z.string(),
        dateOfBirth: z.string().optional(),
        placeOfBirth: z.string().optional(),
        email: z.string().optional(),
        gender: z.enum(["M", "F"]).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        // Aggiorna il profilo utente con i dati SPID
        await db.updateUser(ctx.user.id, {
          spidCode: input.spidCode,
          fiscalCode: input.fiscalNumber,
          firstName: input.name,
          lastName: input.familyName,
          birthDate: input.dateOfBirth ? new Date(input.dateOfBirth) : undefined,
          birthPlace: input.placeOfBirth,
          spidVerified: true,
          spidVerifiedAt: new Date(),
        });
        
        return { success: true };
      }),
    
    // Verifica se l'utente ha SPID verificato
    checkVerification: protectedProcedure.query(async ({ ctx }) => {
      const user = await db.getUserById(ctx.user.id);
      return {
        verified: user?.spidVerified || false,
        spidCode: user?.spidCode,
        verifiedAt: user?.spidVerifiedAt,
      };
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
