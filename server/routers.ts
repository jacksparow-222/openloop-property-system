import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { createProperty, getProperties, getPropertyByPropertyId, updateProperty, deleteProperty, createLead, getLeads, getLeadsByPropertyId, updateLeadStatus, updateLeadSmsStatus, updateLeadSheetsSyncStatus, logSheetsSync } from "./db";
import { nanoid } from "nanoid";
import { sendSMS, generateSmsMessage } from "./twilioSms";
import { syncLeadToGoogleSheets } from "./googleSheetsSync";
import { notifyOwner } from "./_core/notification";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  properties: router({
    list: protectedProcedure.query(async () => {
      return await getProperties();
    }),

    getByPropertyId: publicProcedure.input(z.object({ propertyId: z.string() })).query(async ({ input }) => {
      return await getPropertyByPropertyId(input.propertyId);
    }),

    create: protectedProcedure
      .input(z.object({
        propertyId: z.string().optional(),
        name: z.string().min(1),
        address: z.string().optional(),
        price: z.string().optional(),
        agentPhone: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const propertyId = input.propertyId || nanoid(12);
        return await createProperty({
          propertyId,
          name: input.name,
          address: input.address || null,
          price: input.price ? (parseFloat(input.price) as any) : null,
          agentPhone: input.agentPhone || null,
        });
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        address: z.string().optional(),
        price: z.string().optional(),
        agentPhone: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        const updateData: any = {};
        if (data.name) updateData.name = data.name;
        if (data.address) updateData.address = data.address;
        if (data.price) updateData.price = parseFloat(data.price);
        if (data.agentPhone) updateData.agentPhone = data.agentPhone;
        return await updateProperty(id, updateData);
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await deleteProperty(input.id);
      }),
  }),

  leads: router({
    list: protectedProcedure.query(async () => {
      return await getLeads();
    }),

    getByPropertyId: protectedProcedure
      .input(z.object({ propertyId: z.string() }))
      .query(async ({ input }) => {
        return await getLeadsByPropertyId(input.propertyId);
      }),

    submit: publicProcedure
      .input(z.object({
        propertyId: z.string(),
        visitorName: z.string().min(1),
        visitorPhone: z.string().min(1),
        intent: z.enum(["Buy Now", "This Week", "Exploring"]),
      }))
      .mutation(async ({ input }) => {
        // Verify property exists
        const property = await getPropertyByPropertyId(input.propertyId);
        if (!property) {
          throw new Error("Property not found");
        }

        const leadId = nanoid(12);
        const now = new Date();

        // Create lead record
        await createLead({
          leadId,
          propertyId: input.propertyId,
          visitorName: input.visitorName,
          visitorPhone: input.visitorPhone,
          intent: input.intent,
          status: "New",
          smsSent: 0,
          sheetsSync: 0,
        });

        // Send SMS asynchronously (don't wait for response)
        (async () => {
          try {
            const message = generateSmsMessage(input.visitorName, property.name, input.intent);
            const smsSid = await sendSMS(input.visitorPhone, message);
            if (smsSid) {
              await updateLeadSmsStatus(leadId, true);
            }
          } catch (error) {
            console.error("Error sending SMS:", error);
          }
        })();

        // Sync to Google Sheets asynchronously
        (async () => {
          try {
            const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
            if (webhookUrl) {
              const success = await syncLeadToGoogleSheets(
                {
                  leadId,
                  propertyId: input.propertyId,
                  visitorName: input.visitorName,
                  visitorPhone: input.visitorPhone,
                  intent: input.intent,
                  createdAt: now,
                },
                webhookUrl
              );
              if (success) {
                await updateLeadSheetsSyncStatus(leadId, true);
              }
            }
          } catch (error) {
            console.error("Error syncing to Google Sheets:", error);
          }
        })();

        // Send owner notification
        try {
          await notifyOwner({
            title: `New Lead: ${input.visitorName}`,
            content: `New inquiry for ${property.name} from ${input.visitorName} (${input.visitorPhone}). Intent: ${input.intent}`,
          });
        } catch (error) {
          console.error("Error sending owner notification:", error);
        }

        return { leadId, success: true };
      }),

    updateStatus: protectedProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["New", "Engaged", "Booked", "Cold"]),
      }))
      .mutation(async ({ input }) => {
        return await updateLeadStatus(input.id, input.status);
      }),

    updateSmsStatus: protectedProcedure
      .input(z.object({
        leadId: z.string(),
        sent: z.boolean(),
      }))
      .mutation(async ({ input }) => {
        return await updateLeadSmsStatus(input.leadId, input.sent);
      }),

    updateSheetsSyncStatus: protectedProcedure
      .input(z.object({
        leadId: z.string(),
        synced: z.boolean(),
      }))
      .mutation(async ({ input }) => {
        return await updateLeadSheetsSyncStatus(input.leadId, input.synced);
      }),
  }),
});

export type AppRouter = typeof appRouter;
