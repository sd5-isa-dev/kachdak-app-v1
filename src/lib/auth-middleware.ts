import { adminAuth } from '@/src/lib/firebase-admin';
import { NextRequest } from 'next/server';
import { db } from '@/src/db';
import { users } from '@/src/db/schema';
import { eq } from 'drizzle-orm';

export async function getAuthenticatedUser(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Unauthorized');
  }

  const token = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    
    // Get user id from database
    const dbUser = await db.select().from(users).where(eq(users.uid, decodedToken.uid)).limit(1);
    
    if (dbUser.length === 0) {
        throw new Error("User not found in DB");
    }

    return { ...decodedToken, dbId: dbUser[0].id };
  } catch (error) {
    console.error('Auth error:', error);
    throw new Error('Unauthorized');
  }
}
