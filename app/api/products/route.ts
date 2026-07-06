import { NextResponse } from 'next/server';
import { db } from '@/src/db';
import { products } from '@/src/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const allProducts = await db.select().from(products);
    
    // Seed data if empty
    if (allProducts.length === 0) {
      const initialProducts = [
        {
          name: "Espresso",
          withSubtitle: "with milk",
          category: "Hot Coffees",
          price: "2.50",
          rating: "4.5",
          image: "https://picsum.photos/seed/espresso/400/400",
        },
        {
          name: "Cappuccino",
          withSubtitle: "with 2% milk",
          category: "Hot Coffees",
          price: "5.99",
          rating: "4.5",
          image: "https://picsum.photos/seed/cappuccino/400/400",
        },
        {
          name: "Latte",
          withSubtitle: "with honey",
          category: "Hot Coffees",
          price: "3.20",
          rating: "4.5",
          image: "https://picsum.photos/seed/latte/400/400",
        },
        {
          name: "Americano",
          withSubtitle: "with whole milk",
          category: "Hot Coffees",
          price: "7.00",
          rating: "4.5",
          image: "https://picsum.photos/seed/americano/400/400",
        }
      ];
      
      const seeded = await db.insert(products).values(initialProducts).returning();
      return NextResponse.json(seeded);
    }
    
    return NextResponse.json(allProducts);
  } catch (error: any) {
    console.error("Failed to fetch products", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
