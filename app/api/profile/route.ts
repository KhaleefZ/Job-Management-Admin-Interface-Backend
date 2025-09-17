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

    const profile = await sql`
      SELECT 
        up.*,
        u.name, u.email, u.role
      FROM user_profiles up
      JOIN users u ON up.user_id = u.id
      WHERE up.user_id = ${user.id}
    `

    if (profile.length === 0) {
      // Create default profile if it doesn't exist
      const newProfile = await sql`
        INSERT INTO user_profiles (user_id)
        VALUES (${user.id})
        RETURNING *
      `
      
      const userInfo = await sql`
        SELECT name, email, role FROM users WHERE id = ${user.id}
      `

      return NextResponse.json({ 
        profile: { ...newProfile[0], ...userInfo[0] } 
      }, { status: 200, headers: corsHeaders() })
    }

    return NextResponse.json({ profile: profile[0] }, { status: 200, headers: corsHeaders() })
  } catch (error) {
    console.error("Get user profile error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500, headers: corsHeaders() })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { user, error } = await withAuth(request)

    if (error) {
      return error
    }

    const {
      bio,
      skills,
      experience_years,
      location,
      hourly_rate,
      availability,
      profile_image_url,
      resume_url,
      portfolio_url,
      linkedin_url,
      github_url
    } = await request.json()

    // Check if profile exists
    const existingProfile = await sql`
      SELECT id FROM user_profiles WHERE user_id = ${user.id}
    `

    let updatedProfile

    if (existingProfile.length === 0) {
      // Create new profile
      updatedProfile = await sql`
        INSERT INTO user_profiles (
          user_id, bio, skills, experience_years, location, 
          hourly_rate, availability, profile_image_url, resume_url,
          portfolio_url, linkedin_url, github_url
        ) VALUES (
          ${user.id}, ${bio || null}, ${skills || null}, 
          ${experience_years || null}, ${location || null},
          ${hourly_rate || null}, ${availability || null}, 
          ${profile_image_url || null}, ${resume_url || null},
          ${portfolio_url || null}, ${linkedin_url || null}, 
          ${github_url || null}
        )
        RETURNING *
      `
    } else {
      // Update existing profile
      updatedProfile = await sql`
        UPDATE user_profiles SET
          bio = ${bio || null},
          skills = ${skills || null},
          experience_years = ${experience_years || null},
          location = ${location || null},
          hourly_rate = ${hourly_rate || null},
          availability = ${availability || null},
          profile_image_url = ${profile_image_url || null},
          resume_url = ${resume_url || null},
          portfolio_url = ${portfolio_url || null},
          linkedin_url = ${linkedin_url || null},
          github_url = ${github_url || null},
          updated_at = NOW()
        WHERE user_id = ${user.id}
        RETURNING *
      `
    }

    return NextResponse.json({
      message: "Profile updated successfully",
      profile: updatedProfile[0]
    }, { status: 200, headers: corsHeaders() })
  } catch (error) {
    console.error("Update user profile error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500, headers: corsHeaders() })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders() })
}