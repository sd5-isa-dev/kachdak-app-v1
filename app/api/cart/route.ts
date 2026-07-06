import { NextRequest, NextResponse } from "next/server";
import { db } from "@/src/db";
import { cartItems } from "@/src/db/schema";
import { getAuthenticatedUser } from "@/src/lib/auth-middleware";
import { eq, and } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req);
    const userCartItems = await db.query.cartItems.findMany({
      where: eq(cartItems.userId, user.dbId),
      with: {
        product: true,
      },
    });

    return NextResponse.json(userCartItems);
  } catch (error: any) {
    console.error("Cart GET error:", error);
    return NextResponse.json({ error: error.message }, { status: error.message === "Unauthorized" ? 401 : 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req);
    const { productId, size, milk, quantity } = await req.json();

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    // Check if same item exists
    const existing = await db.select().from(cartItems).where(
      and(
        eq(cartItems.userId, user.dbId),
        eq(cartItems.productId, productId),
        eq(cartItems.size, size || "Medium"),
        eq(cartItems.milk, milk || 50)
      )
    ).limit(1);

    if (existing.length > 0) {
      const updated = await db.update(cartItems)
        .set({ quantity: existing[0].quantity + (quantity || 1) })
        .where(eq(cartItems.id, existing[0].id))
        .returning();
      return NextResponse.json(updated[0]);
    }

    const inserted = await db.insert(cartItems).values({
      userId: user.dbId,
      productId,
      size: size || "Medium",
      milk: milk || 50,
      quantity: quantity || 1,
    }).returning();

    return NextResponse.json(inserted[0]);
  } catch (error: any) {
    console.error("Cart POST error:", error);
    return NextResponse.json({ error: error.message }, { status: error.message === "Unauthorized" ? 401 : 500 });
  }
}
