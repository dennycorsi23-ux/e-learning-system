import { describe, expect, it } from "vitest";
import { 
  generateCertificateNumber, 
  generateVerificationCode,
  generateCertificateHTML 
} from "./services/certificateGenerator";

describe("Certificate Generator", () => {
  describe("generateCertificateNumber", () => {
    it("generates a certificate number with correct format", () => {
      const certNumber = generateCertificateNumber();
      
      // Should start with CL-
      expect(certNumber).toMatch(/^CL-/);
      
      // Should contain the current year
      const currentYear = new Date().getFullYear();
      expect(certNumber).toContain(currentYear.toString());
      
      // Should have format CL-YYYY-XXXXXXXX (8 chars random after CL-YYYY-)
      // nanoid can include - and _ characters
      expect(certNumber).toMatch(/^CL-\d{4}-[A-Z0-9_-]{8}$/);
    });

    it("generates unique certificate numbers", () => {
      const numbers = new Set<string>();
      for (let i = 0; i < 100; i++) {
        numbers.add(generateCertificateNumber());
      }
      // All 100 should be unique
      expect(numbers.size).toBe(100);
    });
  });

  describe("generateVerificationCode", () => {
    it("generates a verification code with correct length", () => {
      const code = generateVerificationCode();
      
      // Should be 16 characters
      expect(code).toHaveLength(16);
      
      // Should be uppercase
      expect(code).toBe(code.toUpperCase());
    });

    it("generates unique verification codes", () => {
      const codes = new Set<string>();
      for (let i = 0; i < 100; i++) {
        codes.add(generateVerificationCode());
      }
      // All 100 should be unique
      expect(codes.size).toBe(100);
    });
  });

  describe("generateCertificateHTML", () => {
    const mockCertificateData = {
      candidate: {
        firstName: "Mario",
        lastName: "Rossi",
        fiscalCode: "RSSMRA80A01H501Z",
        birthDate: new Date(1980, 0, 1),
        birthPlace: "Roma",
      },
      language: "Inglese",
      languageNative: "English",
      qcerLevel: "B2",
      scores: {
        listening: 85,
        reading: 78,
        writing: 72,
        speaking: 80,
        total: 79,
      },
      examDate: new Date(2024, 5, 15),
      examCenter: "Centro Esami Roma",
      examCenterCity: "Roma",
    };

    const mockEntityInfo = {
      name: "CertificaLingua",
      address: "Via Roma 1",
      city: "Roma",
      phone: "+39 06 1234567",
      email: "info@certificalingua.it",
      website: "www.certificalingua.it",
      accreditationNumber: "MIM-2024-001",
    };

    it("generates valid HTML with candidate name", () => {
      const html = generateCertificateHTML(
        mockCertificateData,
        mockEntityInfo,
        "CL-2024-TEST1234",
        "VERIFYCODE123456"
      );

      // Should contain candidate name
      expect(html).toContain("MARIO");
      expect(html).toContain("ROSSI");
    });

    it("includes QCER level in the certificate", () => {
      const html = generateCertificateHTML(
        mockCertificateData,
        mockEntityInfo,
        "CL-2024-TEST1234",
        "VERIFYCODE123456"
      );

      // Should contain QCER level
      expect(html).toContain("B2");
      expect(html).toContain("Livello QCER");
    });

    it("includes all four skill scores", () => {
      const html = generateCertificateHTML(
        mockCertificateData,
        mockEntityInfo,
        "CL-2024-TEST1234",
        "VERIFYCODE123456"
      );

      // Should contain all scores
      expect(html).toContain("85/100");
      expect(html).toContain("78/100");
      expect(html).toContain("72/100");
      expect(html).toContain("80/100");
    });

    it("includes DM 62/2022 reference", () => {
      const html = generateCertificateHTML(
        mockCertificateData,
        mockEntityInfo,
        "CL-2024-TEST1234",
        "VERIFYCODE123456"
      );

      // Should reference DM 62/2022
      expect(html).toContain("D.M. n. 62");
      expect(html).toContain("10 marzo 2022");
    });

    it("includes verification code", () => {
      const html = generateCertificateHTML(
        mockCertificateData,
        mockEntityInfo,
        "CL-2024-TEST1234",
        "VERIFYCODE123456"
      );

      // Should contain verification code
      expect(html).toContain("VERIFYCODE123456");
    });

    it("includes certificate number", () => {
      const html = generateCertificateHTML(
        mockCertificateData,
        mockEntityInfo,
        "CL-2024-TEST1234",
        "VERIFYCODE123456"
      );

      // Should contain certificate number
      expect(html).toContain("CL-2024-TEST1234");
    });

    it("includes entity information", () => {
      const html = generateCertificateHTML(
        mockCertificateData,
        mockEntityInfo,
        "CL-2024-TEST1234",
        "VERIFYCODE123456"
      );

      // Should contain entity info
      expect(html).toContain("CertificaLingua");
      expect(html).toContain("Via Roma 1");
      expect(html).toContain("MIM-2024-001");
    });

    it("includes QCER conversion table", () => {
      const html = generateCertificateHTML(
        mockCertificateData,
        mockEntityInfo,
        "CL-2024-TEST1234",
        "VERIFYCODE123456"
      );

      // Should contain all QCER levels in the table
      expect(html).toContain("A1");
      expect(html).toContain("A2");
      expect(html).toContain("B1");
      expect(html).toContain("B2");
      expect(html).toContain("C1");
      expect(html).toContain("C2");
      
      // Should contain QCER table header
      expect(html).toContain("Quadro Comune Europeo di Riferimento");
    });

    it("highlights the achieved level in the QCER table", () => {
      const html = generateCertificateHTML(
        mockCertificateData,
        mockEntityInfo,
        "CL-2024-TEST1234",
        "VERIFYCODE123456"
      );

      // The B2 row should be highlighted
      expect(html).toContain("highlight");
    });
  });
});
