import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/src/lib/firebase-admin";
import { getOrCreateUser } from "@/src/db/users";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await adminAuth.verifyIdToken(token);

    const user = await getOrCreateUser(
      decodedToken.uid,
      decodedToken.email || ""
    );

    return NextResponse.json({ user });
  } catch (error: any) {
    console.error("Sync error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
