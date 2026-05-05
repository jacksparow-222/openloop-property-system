import { logSheetsSync } from "./db";

/**
 * Sync a lead to Google Sheets via webhook
 * @param leadData The lead data to sync
 * @param webhookUrl The Google Apps Script webhook URL
 * @returns Promise with success status
 */
export async function syncLeadToGoogleSheets(
  leadData: {
    leadId: string;
    propertyId: string;
    visitorName: string;
    visitorPhone: string;
    intent: string;
    createdAt: Date;
  },
  webhookUrl: string
): Promise<boolean> {
  try {
    if (!webhookUrl) {
      console.warn("[GoogleSheets] No webhook URL provided");
      return false;
    }

    const payload = {
      leadId: leadData.leadId,
      propertyId: leadData.propertyId,
      visitorName: leadData.visitorName,
      visitorPhone: leadData.visitorPhone,
      intent: leadData.intent,
      createdAt: leadData.createdAt.toISOString(),
      timestamp: new Date().toISOString(),
    };

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error("[GoogleSheets] Error syncing lead:", response.statusText);
      await logSheetsSync({
        leadId: leadData.leadId,
        status: "failed",
        errorMessage: `HTTP ${response.status}: ${response.statusText}`,
      });
      return false;
    }

    const result = await response.json();
    
    if (result.status === "success" || result.success === true) {
      await logSheetsSync({
        leadId: leadData.leadId,
        status: "success",
      });
      return true;
    } else {
      console.error("[GoogleSheets] Sync failed:", result);
      await logSheetsSync({
        leadId: leadData.leadId,
        status: "failed",
        errorMessage: result.error || "Unknown error",
      });
      return false;
    }
  } catch (error) {
    console.error("[GoogleSheets] Exception syncing lead:", error);
    await logSheetsSync({
      leadId: leadData.leadId,
      status: "failed",
      errorMessage: error instanceof Error ? error.message : "Unknown error",
    });
    return false;
  }
}

/**
 * Retry syncing a lead to Google Sheets
 * @param leadId The lead ID to retry
 * @param leadData The lead data
 * @param webhookUrl The webhook URL
 * @param maxRetries Maximum number of retries
 * @returns Promise with success status
 */
export async function retrySyncLeadToGoogleSheets(
  leadId: string,
  leadData: any,
  webhookUrl: string,
  maxRetries: number = 3
): Promise<boolean> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    console.log(`[GoogleSheets] Retry attempt ${attempt}/${maxRetries} for lead ${leadId}`);
    
    const success = await syncLeadToGoogleSheets(leadData, webhookUrl);
    
    if (success) {
      return true;
    }

    // Wait before retrying (exponential backoff)
    if (attempt < maxRetries) {
      const delay = Math.pow(2, attempt - 1) * 1000; // 1s, 2s, 4s
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  return false;
}
