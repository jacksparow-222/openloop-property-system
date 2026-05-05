import { ENV } from "./_core/env";

/**
 * Send an SMS message via Twilio
 * @param toPhone The recipient's phone number
 * @param message The message to send
 * @returns Promise with the message SID or error
 */
export async function sendSMS(toPhone: string, message: string): Promise<string | null> {
  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromPhone = process.env.TWILIO_PHONE_NUMBER;

    if (!accountSid || !authToken || !fromPhone) {
      console.warn("[Twilio] Missing credentials: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, or TWILIO_PHONE_NUMBER");
      return null;
    }

    const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;

    const body = new URLSearchParams({
      From: fromPhone,
      To: toPhone,
      Body: message,
    });

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("[Twilio] Error sending SMS:", error);
      return null;
    }

    const result = await response.json();
    return result.sid || null;
  } catch (error) {
    console.error("[Twilio] Exception sending SMS:", error);
    return null;
  }
}

/**
 * Generate a customized SMS message based on intent
 * @param visitorName The visitor's name
 * @param propertyName The property name
 * @param intent The visitor's intent (Buy Now, This Week, Exploring)
 * @returns The customized SMS message
 */
export function generateSmsMessage(visitorName: string, propertyName: string, intent: string): string {
  const firstName = visitorName.split(" ")[0];

  switch (intent) {
    case "Buy Now":
      return `Hi ${firstName}, thanks for your interest in ${propertyName}! We have a buyer ready. Call us today to discuss. -OpenLoop`;

    case "This Week":
      return `Hi ${firstName}, let's schedule a viewing of ${propertyName} this week! Reply with your availability. -OpenLoop`;

    case "Exploring":
      return `Hi ${firstName}, thanks for exploring ${propertyName}! We'll send you more details soon. -OpenLoop`;

    default:
      return `Hi ${firstName}, thanks for your interest in ${propertyName}! We'll be in touch soon. -OpenLoop`;
  }
}
