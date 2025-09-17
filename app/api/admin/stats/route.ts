import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/database"
import { withAuth, corsHeaders } from "@/lib/middleware"

export async function GET(request: NextRequest) {
  try {
    const { user, error } = await withAuth(request, ["admin"])

    if (error) {
      return error
    }

    const { searchParams } = new URL(request.url)
    const period = searchParams.get("period") || "30" // days

    // Get statistics for the specified period
    const [userGrowth, jobGrowth, applicationGrowth, topEmployers, popularJobTypes, applicationConversionRate] =
      await Promise.all([
        // User growth over time
        sql`
        SELECT 
          DATE(created_at) as date,
          COUNT(*) as count
        FROM users 
        WHERE created_at >= NOW() - INTERVAL '${period} days'
        GROUP BY DATE(created_at)
        ORDER BY date
      `,

        // Job growth over time
        sql`
        SELECT 
          DATE(created_at) as date,
          COUNT(*) as count
        FROM jobs 
        WHERE created_at >= NOW() - INTERVAL '${period} days'
        GROUP BY DATE(created_at)
        ORDER BY date
      `,

        // Application growth over time
        sql`
        SELECT 
          DATE(applied_at) as date,
          COUNT(*) as count
        FROM applications 
        WHERE applied_at >= NOW() - INTERVAL '${period} days'
        GROUP BY DATE(applied_at)
        ORDER BY date
      `,

        // Top employers by job count
        sql`
        SELECT 
          u.name,
          u.email,
          COUNT(j.id) as job_count
        FROM users u
        JOIN jobs j ON u.id = j.posted_by
        WHERE u.role = 'employer'
        GROUP BY u.id, u.name, u.email
        ORDER BY job_count DESC
        LIMIT 10
      `,

        // Popular job types
        sql`
        SELECT 
          job_type,
          COUNT(*) as count
        FROM jobs
        WHERE created_at >= NOW() - INTERVAL '${period} days'
        GROUP BY job_type
        ORDER BY count DESC
      `,

        // Application conversion rate
        sql`
        SELECT 
          status,
          COUNT(*) as count,
          ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 2) as percentage
        FROM applications
        WHERE applied_at >= NOW() - INTERVAL '${period} days'
        GROUP BY status
      `,
      ])

    const stats = {
      period: Number.parseInt(period),
      growth: {
        users: userGrowth,
        jobs: jobGrowth,
        applications: applicationGrowth,
      },
      insights: {
        topEmployers,
        popularJobTypes,
        applicationConversionRate,
      },
    }

    return NextResponse.json({ stats }, { status: 200, headers: corsHeaders() })
  } catch (error) {
    console.error("Get stats error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500, headers: corsHeaders() })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders() })
}
