import { type NextRequest, NextResponse } from "next/server"
import { jobQueries } from "@/lib/database"
import { withAuth, corsHeaders } from "@/lib/middleware"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const jobs = await jobQueries.findById(params.id)

    if (jobs.length === 0) {
      return NextResponse.json({ error: "Job not found" }, { status: 404, headers: corsHeaders() })
    }

    return NextResponse.json({ job: jobs[0] }, { status: 200, headers: corsHeaders() })
  } catch (error) {
    console.error("Get job error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500, headers: corsHeaders() })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { user, error } = await withAuth(request, ["employer", "admin"])

    if (error) {
      return error
    }

    // Check if job exists and user has permission
    const existingJobs = await jobQueries.findById(params.id)
    if (existingJobs.length === 0) {
      return NextResponse.json({ error: "Job not found" }, { status: 404, headers: corsHeaders() })
    }

    const existingJob = existingJobs[0]
    if (user.role !== "admin" && existingJob.posted_by !== user.id) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403, headers: corsHeaders() })
    }

    const { title, description, location, job_type, salary_min, salary_max, status } = await request.json()

    // Validation
    if (!title || !description || !location || !job_type || !status) {
      return NextResponse.json(
        { error: "Title, description, location, job_type, and status are required" },
        { status: 400, headers: corsHeaders() },
      )
    }

    const validJobTypes = ["full-time", "part-time", "contract", "remote"]
    if (!validJobTypes.includes(job_type)) {
      return NextResponse.json(
        { error: "Invalid job_type. Must be one of: " + validJobTypes.join(", ") },
        { status: 400, headers: corsHeaders() },
      )
    }

    const validStatuses = ["open", "closed", "draft"]
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status. Must be one of: " + validStatuses.join(", ") },
        { status: 400, headers: corsHeaders() },
      )
    }

    const updatedJobs = await jobQueries.update(params.id, {
      title,
      description,
      location,
      job_type,
      salary_min: salary_min || null,
      salary_max: salary_max || null,
      status,
    })

    return NextResponse.json(
      { message: "Job updated successfully", job: updatedJobs[0] },
      { status: 200, headers: corsHeaders() },
    )
  } catch (error) {
    console.error("Update job error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500, headers: corsHeaders() })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { user, error } = await withAuth(request, ["employer", "admin"])

    if (error) {
      return error
    }

    // Check if job exists and user has permission
    const existingJobs = await jobQueries.findById(params.id)
    if (existingJobs.length === 0) {
      return NextResponse.json({ error: "Job not found" }, { status: 404, headers: corsHeaders() })
    }

    const existingJob = existingJobs[0]
    if (user.role !== "admin" && existingJob.posted_by !== user.id) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403, headers: corsHeaders() })
    }

    await jobQueries.delete(params.id)

    return NextResponse.json({ message: "Job deleted successfully" }, { status: 200, headers: corsHeaders() })
  } catch (error) {
    console.error("Delete job error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500, headers: corsHeaders() })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders() })
}
