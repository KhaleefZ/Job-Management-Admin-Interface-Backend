import { type NextRequest, NextResponse } from "next/server"
import { getUserFromToken } from "./auth"

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string
    email: string
    role: "candidate" | "employer" | "admin"
  }
}

export async function withAuth(
  request: NextRequest,
  requiredRoles?: string[],
): Promise<{ user: any; error?: NextResponse }> {
  try {
    const authHeader = request.headers.get("authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return {
        user: null,
        error: NextResponse.json({ error: "Authorization header required" }, { status: 401 }),
      }
    }

    const token = authHeader.substring(7)
    const user = await getUserFromToken(token)

    if (!user) {
      return {
        user: null,
        error: NextResponse.json({ error: "Invalid or expired token" }, { status: 401 }),
      }
    }

    if (requiredRoles && !requiredRoles.includes(user.role)) {
      return {
        user: null,
        error: NextResponse.json({ error: "Insufficient permissions" }, { status: 403 }),
      }
    }

    return { user }
  } catch (error) {
    return {
      user: null,
      error: NextResponse.json({ error: "Authentication failed" }, { status: 401 }),
    }
  }
}

export function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  }
}
