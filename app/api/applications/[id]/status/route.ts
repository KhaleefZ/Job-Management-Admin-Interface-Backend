import { type NextRequest, NextResponse } from "next/server"
import { applicationQueries, jobQueries } from "@/lib/database"
import { withAuth, corsHeaders } from "@/lib/middleware"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { user, error } = await withAuth(request, ["employer", "admin"])

    if (error) {
      return error
    }

    const { status } = await request.json()

    // Validation
    const validStatuses = ["applied", "shortlisted", "hired", "rejected"]
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status. Must be one of: " + validStatuses.join(", ") },
        { status: 400, headers: corsHeaders() },
      )
    }

    // For employers, check if they own the job this application is for
    if (user.role === "employer") {
      // First get the application to find the job_id
      const applications = await applicationQueries.getAll()
      const application = applications.find((app: any) => app.id === params.id)

      if (!application) {
        return NextResponse.json({ error: "Application not found" }, { status: 404, headers: corsHeaders() })
      }

      // Check if the employer owns this job
      const jobs = await jobQueries.findById(application.job_id)
      if (jobs.length === 0 || jobs[0].posted_by !== user.id) {
        return NextResponse.json({ error: "Insufficient permissions" }, { status: 403, headers: corsHeaders() })
      }
    }

    const updatedApplications = await applicationQueries.updateStatus(params.id, status)

    if (updatedApplications.length === 0) {
      return NextResponse.json({ error: "Application not found" }, { status: 404, headers: corsHeaders() })
    }

    return NextResponse.json(
      { message: "Application status updated successfully", application: updatedApplications[0] },
      { status: 200, headers: corsHeaders() },
    )
  } catch (error) {
    console.error("Update application status error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500, headers: corsHeaders() })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders() })
}
