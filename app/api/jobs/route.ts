import { type NextRequest, NextResponse } from "next/server"
import { jobQueries } from "@/lib/database"
import { withAuth, corsHeaders } from "@/lib/middleware"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Extract query parameters for filtering
    const filters = {
      title: searchParams.get("title") || undefined,
      location: searchParams.get("location") || undefined,
      job_type: searchParams.get("job_type") || undefined,
      salary_min: searchParams.get("salary_min") ? Number.parseInt(searchParams.get("salary_min")!) : undefined,
      salary_max: searchParams.get("salary_max") ? Number.parseInt(searchParams.get("salary_max")!) : undefined,
    }

    // Remove undefined values
    const cleanFilters = Object.fromEntries(Object.entries(filters).filter(([_, value]) => value !== undefined))

    const jobs = await jobQueries.getAll(cleanFilters)

    return NextResponse.json({ jobs }, { status: 200, headers: corsHeaders() })
  } catch (error) {
    console.error("Get jobs error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500, headers: corsHeaders() })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user, error } = await withAuth(request, ["employer", "admin"])

    if (error) {
      return error
    }

    const { title, description, location, job_type, salary_min, salary_max, status = "draft" } = await request.json()

    // Validation
    if (!title || !description || !location || !job_type) {
      return NextResponse.json(
        { error: "Title, description, location, and job_type are required" },
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

    const newJobs = await jobQueries.create({
      title,
      description,
      location,
      job_type,
      salary_min: salary_min || null,
      salary_max: salary_max || null,
      status,
      posted_by: user.id,
    })

    return NextResponse.json(
      { message: "Job created successfully", job: newJobs[0] },
      { status: 201, headers: corsHeaders() },
    )
  } catch (error) {
    console.error("Create job error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500, headers: corsHeaders() })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders() })
}
