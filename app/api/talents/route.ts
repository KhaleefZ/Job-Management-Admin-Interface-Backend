import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { corsHeaders } from "@/lib/middleware"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get("limit") || "20")
    const offset = parseInt(searchParams.get("offset") || "0")
    const search = searchParams.get("search")
    const skills = searchParams.get("skills")
    const experience = searchParams.get("experience")

    let talents

    if (search || skills || experience) {
      // Filtered search
      let whereConditions = ["u.role = 'candidate'"]
      
      if (search) {
        whereConditions.push(`(u.name ILIKE '%${search}%' OR up.bio ILIKE '%${search}%')`)
      }
      
      if (skills) {
        whereConditions.push(`up.skills && ARRAY['${skills}']`)
      }
      
      if (experience) {
        const expYears = parseInt(experience)
        whereConditions.push(`up.experience_years >= ${expYears}`)
      }

      const whereClause = whereConditions.join(' AND ')

      talents = await sql`
        SELECT 
          u.id, u.name, u.email,
          up.bio, up.skills, up.experience_years, up.location,
          up.hourly_rate, up.availability, up.profile_image_url,
          up.portfolio_url, up.linkedin_url, up.github_url
        FROM users u
        LEFT JOIN user_profiles up ON u.id = up.user_id
        WHERE u.role = 'candidate' AND up.user_id IS NOT NULL
        ORDER BY u.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `
    } else {
      // Get all talents
      talents = await sql`
        SELECT 
          u.id, u.name, u.email,
          up.bio, up.skills, up.experience_years, up.location,
          up.hourly_rate, up.availability, up.profile_image_url,
          up.portfolio_url, up.linkedin_url, up.github_url
        FROM users u
        LEFT JOIN user_profiles up ON u.id = up.user_id
        WHERE u.role = 'candidate' AND up.user_id IS NOT NULL
        ORDER BY u.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `
    }

    // Add mock ratings and format response
    const formattedTalents = talents.map(talent => ({
      id: talent.id,
      name: talent.name,
      title: talent.bio ? talent.bio.substring(0, 50) + '...' : 'Professional',
      location: talent.location || 'Location not specified',
      experience: talent.experience_years ? `${talent.experience_years}+ years` : 'Experience not specified',
      rating: 4.5 + Math.random() * 0.5, // Mock rating between 4.5-5.0
      skills: talent.skills || [],
      image: talent.profile_image_url || '/placeholder-user.jpg',
      hourlyRate: talent.hourly_rate ? `₹${talent.hourly_rate}/hr` : 'Rate not specified',
      availability: talent.availability || 'Unknown',
      description: talent.bio || 'No description available',
      portfolio: talent.portfolio_url,
      linkedin: talent.linkedin_url,
      github: talent.github_url
    }))

    return NextResponse.json({ talents: formattedTalents }, { status: 200, headers: corsHeaders() })
  } catch (error) {
    console.error("Get talents error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500, headers: corsHeaders() })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders() })
}