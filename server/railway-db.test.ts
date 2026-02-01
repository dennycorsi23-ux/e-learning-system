import { describe, expect, it } from "vitest";

describe("Railway Database Connection", () => {
  it("should have RAILWAY_DATABASE_URL environment variable set", () => {
    const dbUrl = process.env.RAILWAY_DATABASE_URL;
    
    // Check that the environment variable is set
    expect(dbUrl).toBeDefined();
    expect(dbUrl).not.toBe("");
    expect(dbUrl).toContain("mysql://");
  });
});
