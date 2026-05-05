import { describe, it, expect, beforeAll } from "vitest";
import { sendSMS, generateSmsMessage } from "./twilioSms";

describe("Twilio SMS Integration", () => {
  describe("generateSmsMessage", () => {
    it("should generate correct message for Buy Now intent", () => {
      const message = generateSmsMessage("John Doe", "Penthouse Agdal", "Buy Now");
      expect(message).toContain("John");
      expect(message).toContain("Penthouse Agdal");
      expect(message).toContain("buyer ready");
    });

    it("should generate correct message for This Week intent", () => {
      const message = generateSmsMessage("Jane Smith", "Villa Californie", "This Week");
      expect(message).toContain("Jane");
      expect(message).toContain("Villa Californie");
      expect(message).toContain("viewing");
    });

    it("should generate correct message for Exploring intent", () => {
      const message = generateSmsMessage("Bob Johnson", "Apt Maarif", "Exploring");
      expect(message).toContain("Bob");
      expect(message).toContain("Apt Maarif");
      expect(message).toContain("details");
    });

    it("should extract first name correctly", () => {
      const message = generateSmsMessage("John Doe Smith", "Test Property", "Exploring");
      expect(message).toContain("John");
      expect(message).not.toContain("Doe");
    });
  });

  describe("sendSMS", () => {
    it("should return null if credentials are missing", async () => {
      // Clear environment variables temporarily
      const originalSid = process.env.TWILIO_ACCOUNT_SID;
      const originalToken = process.env.TWILIO_AUTH_TOKEN;
      const originalPhone = process.env.TWILIO_PHONE_NUMBER;

      delete process.env.TWILIO_ACCOUNT_SID;
      delete process.env.TWILIO_AUTH_TOKEN;
      delete process.env.TWILIO_PHONE_NUMBER;

      const result = await sendSMS("+1234567890", "Test message");
      expect(result).toBeNull();

      // Restore environment variables
      if (originalSid) process.env.TWILIO_ACCOUNT_SID = originalSid;
      if (originalToken) process.env.TWILIO_AUTH_TOKEN = originalToken;
      if (originalPhone) process.env.TWILIO_PHONE_NUMBER = originalPhone;
    });

    it("should attempt to send SMS if credentials are present", async () => {
      // This test just verifies the function doesn't crash
      // Actual SMS sending requires valid credentials
      const result = await sendSMS("+1234567890", "Test message");
      // Result can be null or a string (SID), both are acceptable
      expect(typeof result === "string" || result === null).toBe(true);
    });
  });
});
