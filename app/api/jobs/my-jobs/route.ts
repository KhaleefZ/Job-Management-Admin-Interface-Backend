import { type NextRequest, NextResponse } from "next/server"
import { jobQueries } from "@/lib/database"
import { withAuth, corsHeaders } from "@/lib/middleware"

export async function GET(request: NextRequest) {
  try {
    const { user, error } = await withAuth(request, ["employer", "admin"])

    if (error) {
      return error
    }

    const jobs = await jobQueries.getByEmployer(user.id)

    return NextResponse.json({ jobs }, { status: 200, headers: corsHeaders() })
  } catch (error) {
    console.error("Get my jobs error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500, headers: corsHeaders() })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders() })
}
