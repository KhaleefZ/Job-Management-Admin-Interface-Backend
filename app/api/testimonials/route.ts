import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { withAuth, corsHeaders } from "@/lib/middleware"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get("limit") || "10")
    const offset = parseInt(searchParams.get("offset") || "0")
    const category = searchParams.get("category") // 'job-seeker' or 'employer'

    let testimonials

    if (category) {
      testimonials = await sql`
        SELECT 
          id, name, role, company, location, rating, 
          testimonial_text, outcome, category, created_at
        FROM testimonials 
        WHERE is_approved = true AND category = ${category}
        ORDER BY created_at DESC 
        LIMIT ${limit} OFFSET ${offset}
      `
    } else {
      testimonials = await sql`
        SELECT 
          id, name, role, company, location, rating, 
          testimonial_text, outcome, category, created_at
        FROM testimonials 
        WHERE is_approved = true
        ORDER BY created_at DESC 
        LIMIT ${limit} OFFSET ${offset}
      `
    }

    return NextResponse.json({ testimonials }, { status: 200, headers: corsHeaders() })
  } catch (error) {
    console.error("Get testimonials error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500, headers: corsHeaders() })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user, error } = await withAuth(request)

    if (error) {
      return error
    }

    const { name, role, company, location, rating, testimonial_text, outcome, category } = await request.json()

    if (!name || !testimonial_text || !rating) {
      return NextResponse.json(
        { error: "Name, testimonial text, and rating are required" },
        { status: 400, headers: corsHeaders() }
      )
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400, headers: corsHeaders() }
      )
    }

    const newTestimonial = await sql`
      INSERT INTO testimonials (
        user_id, name, role, company, location, rating, 
        testimonial_text, outcome, category, is_approved
      ) VALUES (
        ${user.id}, ${name}, ${role || null}, ${company || null}, 
        ${location || null}, ${rating}, ${testimonial_text}, 
        ${outcome || null}, ${category || 'job-seeker'}, false
      )
      RETURNING *
    `

    return NextResponse.json(
      { 
        message: "Testimonial submitted successfully and pending approval", 
        testimonial: newTestimonial[0] 
      },
      { status: 201, headers: corsHeaders() }
    )
  } catch (error) {
    console.error("Create testimonial error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500, headers: corsHeaders() })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders() })
}