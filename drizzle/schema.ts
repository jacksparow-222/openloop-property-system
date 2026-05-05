import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Properties table for real estate listings.
 * Each property gets a unique ID and can have multiple leads.
 */
export const properties = mysqlTable("properties", {
  id: int("id").autoincrement().primaryKey(),
  propertyId: varchar("propertyId", { length: 64 }).notNull().unique(), // Unique identifier for QR codes
  name: varchar("name", { length: 255 }).notNull(),
  address: text("address"),
  price: decimal("price", { precision: 12, scale: 2 }),
  agentPhone: varchar("agentPhone", { length: 20 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Property = typeof properties.$inferSelect;
export type InsertProperty = typeof properties.$inferInsert;

/**
 * Leads table for tracking form submissions.
 * Each lead is associated with a property and contains visitor information.
 */
export const leads = mysqlTable("leads", {
  id: int("id").autoincrement().primaryKey(),
  leadId: varchar("leadId", { length: 64 }).notNull().unique(), // Unique lead identifier
  propertyId: varchar("propertyId", { length: 64 }).notNull(), // Foreign key to properties
  visitorName: varchar("visitorName", { length: 255 }).notNull(),
  visitorPhone: varchar("visitorPhone", { length: 20 }).notNull(),
  intent: mysqlEnum("intent", ["Buy Now", "This Week", "Exploring"]).notNull(),
  status: mysqlEnum("status", ["New", "Engaged", "Booked", "Cold"]).default("New").notNull(),
  smsSent: int("smsSent").default(0), // Boolean: 1 = sent, 0 = not sent
  sheetsSync: int("sheetsSync").default(0), // Boolean: 1 = synced, 0 = not synced
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Lead = typeof leads.$inferSelect;
export type InsertLead = typeof leads.$inferInsert;

/**
 * Google Sheets sync log for tracking synced leads.
 */
export const sheetsSyncLog = mysqlTable("sheetsSyncLog", {
  id: int("id").autoincrement().primaryKey(),
  leadId: varchar("leadId", { length: 64 }).notNull(),
  syncedAt: timestamp("syncedAt").defaultNow().notNull(),
  status: mysqlEnum("status", ["success", "failed", "pending"]).default("pending").notNull(),
  errorMessage: text("errorMessage"),
});

export type SheetsSyncLog = typeof sheetsSyncLog.$inferSelect;
export type InsertSheetsSyncLog = typeof sheetsSyncLog.$inferInsert;

// Relations
export const propertiesRelations = relations(properties, ({ many }) => ({
  leads: many(leads),
}));

export const leadsRelations = relations(leads, ({ one }) => ({
  property: one(properties, {
    fields: [leads.propertyId],
    references: [properties.propertyId],
  }),
}));