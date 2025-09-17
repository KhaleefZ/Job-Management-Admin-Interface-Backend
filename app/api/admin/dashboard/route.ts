import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/database"
import { withAuth, corsHeaders } from "@/lib/middleware"

export async function GET(request: NextRequest) {
  try {
    const { user, error } = await withAuth(request, ["admin"])

    if (error) {
      return error
    }

    // Get dashboard statistics
    const [
      totalUsers,
      totalJobs,
      totalApplications,
      activeJobs,
      recentApplications,
      usersByRole,
      jobsByStatus,
      applicationsByStatus,
    ] = await Promise.all([
      // Total users
      sql`SELECT COUNT(*) as count FROM users`,

      // Total jobs
      sql`SELECT COUNT(*) as count FROM jobs`,

      // Total applications
      sql`SELECT COUNT(*) as count FROM applications`,

      // Active jobs
      sql`SELECT COUNT(*) as count FROM jobs WHERE status = 'open'`,

      // Recent applications (last 7 days)
      sql`SELECT COUNT(*) as count FROM applications WHERE applied_at >= NOW() - INTERVAL '7 days'`,

      // Users by role
      sql`SELECT role, COUNT(*) as count FROM users GROUP BY role`,

      // Jobs by status
      sql`SELECT status, COUNT(*) as count FROM jobs GROUP BY status`,

      // Applications by status
      sql`SELECT status, COUNT(*) as count FROM applications GROUP BY status`,
    ])

    // Get recent activities
    const recentActivities = await sql`
      SELECT 
        'application' as type,
        a.id,
        u.name as user_name,
        j.title as job_title,
        a.status,
        a.applied_at as created_at
      FROM applications a
      JOIN users u ON a.user_id = u.id
      JOIN jobs j ON a.job_id = j.id
      ORDER BY a.applied_at DESC
      LIMIT 10
    `

    const dashboardData = {
      stats: {
        totalUsers: Number.parseInt(totalUsers[0].count),
        totalJobs: Number.parseInt(totalJobs[0].count),
        totalApplications: Number.parseInt(totalApplications[0].count),
        activeJobs: Number.parseInt(activeJobs[0].count),
        recentApplications: Number.parseInt(recentApplications[0].count),
      },
      charts: {
        usersByRole: usersByRole.map((item: any) => ({
          role: item.role,
          count: Number.parseInt(item.count),
        })),
        jobsByStatus: jobsByStatus.map((item: any) => ({
          status: item.status,
          count: Number.parseInt(item.count),
        })),
        applicationsByStatus: applicationsByStatus.map((item: any) => ({
          status: item.status,
          count: Number.parseInt(item.count),
        })),
      },
      recentActivities,
    }

    return NextResponse.json({ dashboard: dashboardData }, { status: 200, headers: corsHeaders() })
  } catch (error) {
    console.error("Get dashboard error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500, headers: corsHeaders() })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders() })
}
