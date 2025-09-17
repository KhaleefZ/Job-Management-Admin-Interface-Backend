import { type NextRequest, NextResponse } from "next/server"
import { userQueries } from "@/lib/database"
import { withAuth, corsHeaders } from "@/lib/middleware"

export async function GET(request: NextRequest) {
  try {
    const { user, error } = await withAuth(request, ["admin"])

    if (error) {
      return error
    }

    const users = await userQueries.getAll()

    return NextResponse.json({ users }, { status: 200, headers: corsHeaders() })
  } catch (error) {
    console.error("Get users error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500, headers: corsHeaders() })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders() })
}
