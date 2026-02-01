import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the database module
vi.mock("./db", () => ({
  getAllLanguages: vi.fn().mockResolvedValue([
    { id: 1, code: "en", name: "Inglese", nativeName: "English", isActive: true },
    { id: 2, code: "fr", name: "Francese", nativeName: "Français", isActive: true },
  ]),
  getAllQcerLevels: vi.fn().mockResolvedValue([
    { id: 1, code: "A1", name: "Livello A1", displayOrder: 1 },
    { id: 2, code: "A2", name: "Livello A2", displayOrder: 2 },
    { id: 3, code: "B1", name: "Livello B1", displayOrder: 3 },
    { id: 4, code: "B2", name: "Livello B2", displayOrder: 4 },
    { id: 5, code: "C1", name: "Livello C1", displayOrder: 5 },
    { id: 6, code: "C2", name: "Livello C2", displayOrder: 6 },
  ]),
  getAllExamCenters: vi.fn().mockResolvedValue([
    { id: 1, name: "Sede Milano", city: "Milano", province: "MI", isActive: true },
  ]),
  getAllExamSessions: vi.fn().mockResolvedValue([]),
  getUpcomingExamSessions: vi.fn().mockResolvedValue([]),
  getAllCourses: vi.fn().mockResolvedValue([]),
  getAllPricing: vi.fn().mockResolvedValue([]),
  getAllFaqs: vi.fn().mockResolvedValue([
    { id: 1, question: "Come funziona?", answer: "Risposta", isPublished: true },
  ]),
  getSampleExams: vi.fn().mockResolvedValue([]),
  getCertificateByVerificationCode: vi.fn().mockResolvedValue(null),
  getUserCertificates: vi.fn().mockResolvedValue([]),
  getUserExamRegistrations: vi.fn().mockResolvedValue([]),
  getUserEnrollments: vi.fn().mockResolvedValue([]),
  getUserById: vi.fn().mockResolvedValue({ id: 1, name: "Test User", email: "test@test.com" }),
  getAllUsers: vi.fn().mockResolvedValue([]),
  getDashboardStats: vi.fn().mockResolvedValue({
    totalUsers: 10,
    totalExams: 5,
    totalCertificates: 3,
    totalCenters: 2,
  }),
  getDb: vi.fn().mockResolvedValue(null),
}));

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

function createAuthenticatedContext(role: "user" | "admin" = "user"): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "test-user",
      email: "test@example.com",
      name: "Test User",
      loginMethod: "manus",
      role,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

describe("Public API endpoints", () => {
  it("languages.list returns available languages", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    
    const result = await caller.languages.list();
    
    expect(result).toHaveLength(2);
    expect(result[0]).toHaveProperty("code", "en");
    expect(result[1]).toHaveProperty("code", "fr");
  });

  it("qcerLevels.list returns all 6 QCER levels", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    
    const result = await caller.qcerLevels.list();
    
    expect(result).toHaveLength(6);
    expect(result.map(l => l.code)).toEqual(["A1", "A2", "B1", "B2", "C1", "C2"]);
  });

  it("examCenters.list returns active exam centers", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    
    const result = await caller.examCenters.list();
    
    expect(result).toHaveLength(1);
    expect(result[0]).toHaveProperty("name", "Sede Milano");
  });

  it("faqs.list returns published FAQs", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    
    const result = await caller.faqs.list();
    
    expect(result).toHaveLength(1);
    expect(result[0]).toHaveProperty("question", "Come funziona?");
  });

  it("certificates.verify returns null for invalid code", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    
    const result = await caller.certificates.verify({ code: "INVALID-CODE" });
    
    expect(result).toBeNull();
  });
});

describe("Protected API endpoints", () => {
  it("certificates.myCertificates returns user certificates", async () => {
    const ctx = createAuthenticatedContext();
    const caller = appRouter.createCaller(ctx);
    
    const result = await caller.certificates.myCertificates();
    
    expect(result).toEqual([]);
  });

  it("examRegistrations.myRegistrations returns user registrations", async () => {
    const ctx = createAuthenticatedContext();
    const caller = appRouter.createCaller(ctx);
    
    const result = await caller.examRegistrations.myRegistrations();
    
    expect(result).toEqual([]);
  });

  it("courses.myEnrollments returns user enrollments", async () => {
    const ctx = createAuthenticatedContext();
    const caller = appRouter.createCaller(ctx);
    
    const result = await caller.courses.myEnrollments();
    
    expect(result).toEqual([]);
  });

  it("profile.get returns current user profile", async () => {
    const ctx = createAuthenticatedContext();
    const caller = appRouter.createCaller(ctx);
    
    const result = await caller.profile.get();
    
    expect(result).toHaveProperty("name", "Test User");
  });
});

describe("Admin API endpoints", () => {
  it("admin.stats.dashboard returns statistics for admin", async () => {
    const ctx = createAuthenticatedContext("admin");
    const caller = appRouter.createCaller(ctx);
    
    const result = await caller.admin.stats.dashboard();
    
    expect(result).toHaveProperty("totalUsers", 10);
    expect(result).toHaveProperty("totalExams", 5);
    expect(result).toHaveProperty("totalCertificates", 3);
    expect(result).toHaveProperty("totalCenters", 2);
  });

  it("admin.users.list is forbidden for non-admin users", async () => {
    const ctx = createAuthenticatedContext("user");
    const caller = appRouter.createCaller(ctx);
    
    await expect(caller.admin.users.list()).rejects.toThrow("Accesso riservato agli amministratori");
  });

  it("admin.users.list returns users for admin", async () => {
    const ctx = createAuthenticatedContext("admin");
    const caller = appRouter.createCaller(ctx);
    
    const result = await caller.admin.users.list();
    
    expect(result).toEqual([]);
  });
});

describe("Auth endpoints", () => {
  it("auth.me returns null for unauthenticated user", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    
    const result = await caller.auth.me();
    
    expect(result).toBeNull();
  });

  it("auth.me returns user for authenticated user", async () => {
    const ctx = createAuthenticatedContext();
    const caller = appRouter.createCaller(ctx);
    
    const result = await caller.auth.me();
    
    expect(result).toHaveProperty("name", "Test User");
    expect(result).toHaveProperty("email", "test@example.com");
  });

  it("auth.logout clears session cookie", async () => {
    const ctx = createAuthenticatedContext();
    const caller = appRouter.createCaller(ctx);
    
    const result = await caller.auth.logout();
    
    expect(result).toEqual({ success: true });
    expect(ctx.res.clearCookie).toHaveBeenCalled();
  });
});
