"use server";

import { db } from "@/lib/db/client";
import { addresses } from "@/lib/db/schema";
import { addressSchema, type AddressInput } from "@/lib/validation/address";
import { auth } from "@/lib/db/auth";
import { headers } from "next/headers";
import { eq, and } from "drizzle-orm";
import { nanoid } from "nanoid";

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) throw new Error("Unauthorized");
  return session.user.id;
}

export async function createAddress(formData: AddressInput) {
  const userId = await getUserId();
  const parsed = addressSchema.parse(formData);
  const id = `addr_${nanoid(16)}`;

  if (parsed.isDefault) {
    await db
      .update(addresses)
      .set({ isDefault: false })
      .where(eq(addresses.userId, userId));
  }

  await db.insert(addresses).values({ ...parsed, id, userId });
  return { success: true, id };
}

export async function updateAddress(id: string, formData: AddressInput) {
  const userId = await getUserId();
  const parsed = addressSchema.parse(formData);

  const existing = await db
    .select()
    .from(addresses)
    .where(and(eq(addresses.id, id), eq(addresses.userId, userId)))
    .limit(1);

  if (existing.length === 0) throw new Error("Address not found");

  if (parsed.isDefault) {
    await db
      .update(addresses)
      .set({ isDefault: false })
      .where(eq(addresses.userId, userId));
  }

  await db
    .update(addresses)
    .set({ ...parsed, updatedAt: new Date() })
    .where(eq(addresses.id, id));

  return { success: true };
}

export async function deleteAddress(id: string) {
  const userId = await getUserId();

  const existing = await db
    .select()
    .from(addresses)
    .where(and(eq(addresses.id, id), eq(addresses.userId, userId)))
    .limit(1);

  if (existing.length === 0) throw new Error("Address not found");

  await db.delete(addresses).where(eq(addresses.id, id));
  return { success: true };
}

export async function setDefaultAddress(id: string) {
  const userId = await getUserId();

  const existing = await db
    .select()
    .from(addresses)
    .where(and(eq(addresses.id, id), eq(addresses.userId, userId)))
    .limit(1);

  if (existing.length === 0) throw new Error("Address not found");

  await db
    .update(addresses)
    .set({ isDefault: false })
    .where(eq(addresses.userId, userId));

  await db
    .update(addresses)
    .set({ isDefault: true, updatedAt: new Date() })
    .where(eq(addresses.id, id));

  return { success: true };
}

export async function getUserAddresses() {
  const userId = await getUserId();
  const result = await db
    .select()
    .from(addresses)
    .where(eq(addresses.userId, userId))
    .orderBy(addresses.createdAt);
  return result;
}
