import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, properties, leads, sheetsSyncLog, InsertProperty, InsertLead, InsertSheetsSyncLog } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ── Property queries ──
export async function createProperty(data: InsertProperty) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.insert(properties).values(data);
}

export async function getProperties() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.select().from(properties).orderBy(properties.createdAt);
}

export async function getPropertyByPropertyId(propertyId: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.select().from(properties).where(eq(properties.propertyId, propertyId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateProperty(id: number, data: Partial<InsertProperty>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.update(properties).set(data).where(eq(properties.id, id));
}

export async function deleteProperty(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.delete(properties).where(eq(properties.id, id));
}

// ── Lead queries ──
export async function createLead(data: InsertLead) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.insert(leads).values(data);
}

export async function getLeads() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.select().from(leads).orderBy(leads.createdAt);
}

export async function getLeadsByPropertyId(propertyId: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.select().from(leads).where(eq(leads.propertyId, propertyId)).orderBy(leads.createdAt);
}

export async function updateLeadStatus(id: number, status: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.update(leads).set({ status: status as any }).where(eq(leads.id, id));
}

export async function updateLeadSmsStatus(leadId: string, sent: boolean) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.update(leads).set({ smsSent: sent ? 1 : 0 }).where(eq(leads.leadId, leadId));
}

export async function updateLeadSheetsSyncStatus(leadId: string, synced: boolean) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.update(leads).set({ sheetsSync: synced ? 1 : 0 }).where(eq(leads.leadId, leadId));
}

// ── Sheets sync log queries ──
export async function logSheetsSync(data: InsertSheetsSyncLog) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.insert(sheetsSyncLog).values(data);
}
