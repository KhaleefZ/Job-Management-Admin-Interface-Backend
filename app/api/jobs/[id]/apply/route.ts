import { type NextRequest, NextResponse } from "next/server"
import { applicationQueries, jobQueries } from "@/lib/database"
import { withAuth, corsHeaders } from "@/lib/middleware"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { user, error } = await withAuth(request, ["candidate"])

    if (error) {
      return error
    }

    const { 
      full_name, 
      email, 
      phone, 
      cover_letter, 
      resume_url, 
      resume_filename 
    } = await request.json()

    // Check if job exists
    const jobs = await jobQueries.findById(params.id)
    if (jobs.length === 0) {
      return NextResponse.json({ error: "Job not found" }, { status: 404, headers: corsHeaders() })
    }

    const job = jobs[0]
    if (job.status !== "open") {
      return NextResponse.json({ error: "Job is not open for applications" }, { status: 400, headers: corsHeaders() })
    }

    // Check if user has already applied
    const existingApplications = await applicationQueries.checkExisting(params.id, user.id)
    if (existingApplications.length > 0) {
      return NextResponse.json(
        { error: "You have already applied to this job" },
        { status: 409, headers: corsHeaders() },
      )
    }

    // Create enhanced application
    const newApplications = await applicationQueries.create({
      job_id: params.id,
      user_id: user.id,
      full_name: full_name || null,
      email: email || null,
      phone: phone || null,
      cover_letter: cover_letter || null,
      resume_url: resume_url || null,
      resume_filename: resume_filename || null,
    })

    return NextResponse.json(
      { message: "Application submitted successfully", application: newApplications[0] },
      { status: 201, headers: corsHeaders() },
    )
  } catch (error) {
    console.error("Apply to job error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500, headers: corsHeaders() })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders() })
}
