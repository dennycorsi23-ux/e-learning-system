import { describe, expect, it, vi } from "vitest";
import { hashPassword, verifyPassword, validatePassword, validateEmail } from "./services/authService";

describe("Auth Service - Password Hashing", () => {
  it("should hash a password correctly", async () => {
    const password = "TestPassword123!";
    const hash = await hashPassword(password);
    
    expect(hash).toBeDefined();
    expect(hash).not.toBe(password);
    expect(hash.length).toBeGreaterThan(50); // bcrypt hashes are ~60 chars
  });

  it("should verify a correct password", async () => {
    const password = "TestPassword123!";
    const hash = await hashPassword(password);
    
    const isValid = await verifyPassword(password, hash);
    expect(isValid).toBe(true);
  });

  it("should reject an incorrect password", async () => {
    const password = "TestPassword123!";
    const hash = await hashPassword(password);
    
    const isValid = await verifyPassword("WrongPassword123!", hash);
    expect(isValid).toBe(false);
  });
});

describe("Auth Service - Password Validation", () => {
  it("should accept a valid password", () => {
    const result = validatePassword("ValidPass123");
    expect(result.valid).toBe(true);
  });

  it("should reject a password shorter than 8 characters", () => {
    const result = validatePassword("Short1A");
    expect(result.valid).toBe(false);
    expect(result.message).toContain("8 caratteri");
  });

  it("should reject a password without uppercase", () => {
    const result = validatePassword("lowercase123");
    expect(result.valid).toBe(false);
    expect(result.message).toContain("maiuscola");
  });

  it("should reject a password without lowercase", () => {
    const result = validatePassword("UPPERCASE123");
    expect(result.valid).toBe(false);
    expect(result.message).toContain("minuscola");
  });

  it("should reject a password without numbers", () => {
    const result = validatePassword("NoNumbersHere");
    expect(result.valid).toBe(false);
    expect(result.message).toContain("numero");
  });
});

describe("Auth Service - Email Validation", () => {
  it("should accept a valid email", () => {
    expect(validateEmail("test@example.com")).toBe(true);
    expect(validateEmail("user.name@domain.it")).toBe(true);
    expect(validateEmail("admin@certificalingua.it")).toBe(true);
  });

  it("should reject an invalid email", () => {
    expect(validateEmail("invalid")).toBe(false);
    expect(validateEmail("no@domain")).toBe(false);
    expect(validateEmail("@nodomain.com")).toBe(false);
    expect(validateEmail("spaces in@email.com")).toBe(false);
  });
});
