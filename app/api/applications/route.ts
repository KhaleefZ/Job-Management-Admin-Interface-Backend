import { type NextRequest, NextResponse } from "next/server"
import { applicationQueries } from "@/lib/database"
import { withAuth, corsHeaders } from "@/lib/middleware"

export async function GET(request: NextRequest) {
  try {
    const { user, error } = await withAuth(request)

    if (error) {
      return error
    }

    let applications

    if (user.role === "admin") {
      // Admin can see all applications
      applications = await applicationQueries.getAll()
    } else if (user.role === "candidate") {
      // Candidates can only see their own applications
      applications = await applicationQueries.getByUser(user.id)
    } else {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403, headers: corsHeaders() })
    }

    return NextResponse.json({ applications }, { status: 200, headers: corsHeaders() })
  } catch (error) {
    console.error("Get applications error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500, headers: corsHeaders() })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders() })
}
