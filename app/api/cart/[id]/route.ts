import { NextRequest, NextResponse } from "next/server";
import { db } from "@/src/db";
import { cartItems } from "@/src/db/schema";
import { getAuthenticatedUser } from "@/src/lib/auth-middleware";
import { eq, and } from "drizzle-orm";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthenticatedUser(req);
    const { quantity } = await req.json();
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const updated = await db.update(cartItems)
      .set({ quantity })
      .where(and(eq(cartItems.id, id), eq(cartItems.userId, user.dbId)))
      .returning();

    if (updated.length === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(updated[0]);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthenticatedUser(req);
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const deleted = await db.delete(cartItems)
      .where(and(eq(cartItems.id, id), eq(cartItems.userId, user.dbId)))
      .returning();

    if (deleted.length === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}
