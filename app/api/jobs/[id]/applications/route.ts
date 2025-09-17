import { type NextRequest, NextResponse } from "next/server"
import { applicationQueries, jobQueries } from "@/lib/database"
import { withAuth, corsHeaders } from "@/lib/middleware"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { user, error } = await withAuth(request, ["employer", "admin"])

    if (error) {
      return error
    }

    // For employers, check if they own the job
    if (user.role === "employer") {
      const jobs = await jobQueries.findById(params.id)
      if (jobs.length === 0) {
        return NextResponse.json({ error: "Job not found" }, { status: 404, headers: corsHeaders() })
      }

      if (jobs[0].posted_by !== user.id) {
        return NextResponse.json({ error: "Insufficient permissions" }, { status: 403, headers: corsHeaders() })
      }
    }

    const applications = await applicationQueries.getByJob(params.id)

    return NextResponse.json({ applications }, { status: 200, headers: corsHeaders() })
  } catch (error) {
    console.error("Get job applications error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500, headers: corsHeaders() })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders() })
}
