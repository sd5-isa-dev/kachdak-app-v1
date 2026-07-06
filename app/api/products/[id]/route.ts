import { NextRequest, NextResponse } from "next/server";
import { db } from "@/src/db";
import { products } from "@/src/db/schema";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);
    if (isNaN(id)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

    const product = await db.select().from(products).where(eq(products.id, id)).limit(1);
    
    if (product.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product[0]);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
