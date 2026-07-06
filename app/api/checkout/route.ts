import { NextRequest, NextResponse } from "next/server";
import { db } from "@/src/db";
import { cartItems } from "@/src/db/schema";
import { getAuthenticatedUser } from "@/src/lib/auth-middleware";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req);

    // clear the cart
    await db.delete(cartItems).where(eq(cartItems.userId, user.dbId));

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}
