import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { withAuth, corsHeaders } from "@/lib/middleware"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    const { user, error } = await withAuth(request)

    if (error) {
      return error
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")

    let bookings

    if (user.role === 'admin') {
      // Admin can see all bookings
      if (status) {
        bookings = await sql`
          SELECT 
            cb.*, 
            c.name as candidate_name, c.email as candidate_email,
            e.name as employer_name, e.email as employer_email,
            j.title as job_title, j.company_name
          FROM call_bookings cb
          LEFT JOIN users c ON cb.candidate_id = c.id
          LEFT JOIN users e ON cb.employer_id = e.id
          LEFT JOIN jobs j ON cb.job_id = j.id
          WHERE cb.status = ${status}
          ORDER BY cb.scheduled_at ASC
        `
      } else {
        bookings = await sql`
          SELECT 
            cb.*, 
            c.name as candidate_name, c.email as candidate_email,
            e.name as employer_name, e.email as employer_email,
            j.title as job_title, j.company_name
          FROM call_bookings cb
          LEFT JOIN users c ON cb.candidate_id = c.id
          LEFT JOIN users e ON cb.employer_id = e.id
          LEFT JOIN jobs j ON cb.job_id = j.id
          ORDER BY cb.scheduled_at ASC
        `
      }
    } else {
      // Users can only see their own bookings
      const userIdFilter = user.role === 'candidate' ? 'candidate_id' : 'employer_id'
      
      if (status) {
        if (user.role === 'candidate') {
          bookings = await sql`
            SELECT 
              cb.*, 
              c.name as candidate_name, c.email as candidate_email,
              e.name as employer_name, e.email as employer_email,
              j.title as job_title
            FROM call_bookings cb
            LEFT JOIN users c ON cb.candidate_id = c.id
            LEFT JOIN users e ON cb.employer_id = e.id
            LEFT JOIN jobs j ON cb.job_id = j.id
            WHERE cb.candidate_id = ${user.id} AND cb.status = ${status}
            ORDER BY cb.scheduled_at ASC
          `
        } else {
          bookings = await sql`
            SELECT 
              cb.*, 
              c.name as candidate_name, c.email as candidate_email,
              e.name as employer_name, e.email as employer_email,
              j.title as job_title
            FROM call_bookings cb
            LEFT JOIN users c ON cb.candidate_id = c.id
            LEFT JOIN users e ON cb.employer_id = e.id
            LEFT JOIN jobs j ON cb.job_id = j.id
            WHERE cb.employer_id = ${user.id} AND cb.status = ${status}
            ORDER BY cb.scheduled_at ASC
          `
        }
      } else {
        if (user.role === 'candidate') {
          bookings = await sql`
            SELECT 
              cb.*, 
              c.name as candidate_name, c.email as candidate_email,
              e.name as employer_name, e.email as employer_email,
              j.title as job_title
            FROM call_bookings cb
            LEFT JOIN users c ON cb.candidate_id = c.id
            LEFT JOIN users e ON cb.employer_id = e.id
            LEFT JOIN jobs j ON cb.job_id = j.id
            WHERE cb.candidate_id = ${user.id}
            ORDER BY cb.scheduled_at ASC
          `
        } else {
          bookings = await sql`
            SELECT 
              cb.*, 
              c.name as candidate_name, c.email as candidate_email,
              e.name as employer_name, e.email as employer_email,
              j.title as job_title
            FROM call_bookings cb
            LEFT JOIN users c ON cb.candidate_id = c.id
            LEFT JOIN users e ON cb.employer_id = e.id
            LEFT JOIN jobs j ON cb.job_id = j.id
            WHERE cb.employer_id = ${user.id}
            ORDER BY cb.scheduled_at ASC
          `
        }
      }
    }

    return NextResponse.json({ bookings }, { status: 200, headers: corsHeaders() })
  } catch (error) {
    console.error("Get call bookings error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500, headers: corsHeaders() })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user, error } = await withAuth(request)

    if (error) {
      return error
    }

    const { 
      candidate_id, 
      employer_id, 
      job_id, 
      scheduled_at, 
      duration_minutes, 
      notes 
    } = await request.json()

    if (!candidate_id || !employer_id || !scheduled_at) {
      return NextResponse.json(
        { error: "Candidate ID, Employer ID, and scheduled time are required" },
        { status: 400, headers: corsHeaders() }
      )
    }

    // Validate that the user can book this call
    if (user.role === 'candidate' && user.id !== candidate_id) {
      return NextResponse.json(
        { error: "Candidates can only book calls for themselves" },
        { status: 403, headers: corsHeaders() }
      )
    }

    if (user.role === 'employer' && user.id !== employer_id) {
      return NextResponse.json(
        { error: "Employers can only book calls for themselves" },
        { status: 403, headers: corsHeaders() }
      )
    }

    // Check if the scheduled time is in the future
    const scheduledDate = new Date(scheduled_at)
    if (scheduledDate <= new Date()) {
      return NextResponse.json(
        { error: "Scheduled time must be in the future" },
        { status: 400, headers: corsHeaders() }
      )
    }

    const newBooking = await sql`
      INSERT INTO call_bookings (
        candidate_id, employer_id, job_id, scheduled_at, 
        duration_minutes, notes, status
      ) VALUES (
        ${candidate_id}, ${employer_id}, ${job_id || null}, 
        ${scheduled_at}, ${duration_minutes || 30}, 
        ${notes || null}, 'scheduled'
      )
      RETURNING *
    `

    return NextResponse.json(
      { 
        message: "Call booking created successfully", 
        booking: newBooking[0] 
      },
      { status: 201, headers: corsHeaders() }
    )
  } catch (error) {
    console.error("Create call booking error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500, headers: corsHeaders() })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders() })
}