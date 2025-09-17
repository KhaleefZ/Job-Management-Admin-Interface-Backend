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
    const reportType = searchParams.get("type") || "summary"
    const startDate = searchParams.get("start_date")
    const endDate = searchParams.get("end_date")

    let dateFilter = ""
    const params: any[] = []

    if (startDate && endDate) {
      dateFilter = "WHERE created_at >= $1 AND created_at <= $2"
      params.push(startDate, endDate)
    }

    let reportData: any = {}

    switch (reportType) {
      case "users":
        reportData = await sql`
          SELECT 
            u.*,
            COUNT(CASE WHEN u.role = 'candidate' THEN a.id END) as applications_count,
            COUNT(CASE WHEN u.role = 'employer' THEN j.id END) as jobs_posted
          FROM users u
          LEFT JOIN applications a ON u.id = a.user_id
          LEFT JOIN jobs j ON u.id = j.posted_by
          ${dateFilter ? sql.unsafe(dateFilter) : sql``}
          GROUP BY u.id
          ORDER BY u.created_at DESC
        `
        break

      case "jobs":
        reportData = await sql`
          SELECT 
            j.*,
            u.name as employer_name,
            u.email as employer_email,
            COUNT(a.id) as applications_count
          FROM jobs j
          JOIN users u ON j.posted_by = u.id
          LEFT JOIN applications a ON j.id = a.job_id
          ${dateFilter ? sql.unsafe(dateFilter) : sql``}
          GROUP BY j.id, u.name, u.email
          ORDER BY j.created_at DESC
        `
        break

      case "applications":
        reportData = await sql`
          SELECT 
            a.*,
            u.name as applicant_name,
            u.email as applicant_email,
            j.title as job_title,
            emp.name as employer_name
          FROM applications a
          JOIN users u ON a.user_id = u.id
          JOIN jobs j ON a.job_id = j.id
          JOIN users emp ON j.posted_by = emp.id
          ${dateFilter ? sql.unsafe("WHERE a.applied_at >= $1 AND a.applied_at <= $2") : sql``}
          ORDER BY a.applied_at DESC
        `
        break

      default:
        // Summary report
        const [userStats, jobStats, applicationStats] = await Promise.all([
          sql`
            SELECT 
              role,
              COUNT(*) as count,
              DATE_TRUNC('month', created_at) as month
            FROM users
            ${dateFilter ? sql.unsafe(dateFilter) : sql``}
            GROUP BY role, DATE_TRUNC('month', created_at)
            ORDER BY month DESC
          `,
          sql`
            SELECT 
              status,
              job_type,
              COUNT(*) as count,
              AVG(salary_min) as avg_salary_min,
              AVG(salary_max) as avg_salary_max
            FROM jobs
            ${dateFilter ? sql.unsafe(dateFilter) : sql``}
            GROUP BY status, job_type
          `,
          sql`
            SELECT 
              status,
              COUNT(*) as count,
              DATE_TRUNC('week', applied_at) as week
            FROM applications
            ${dateFilter ? sql.unsafe("WHERE applied_at >= $1 AND applied_at <= $2") : sql``}
            GROUP BY status, DATE_TRUNC('week', applied_at)
            ORDER BY week DESC
          `,
        ])

        reportData = {
          users: userStats,
          jobs: jobStats,
          applications: applicationStats,
        }
    }

    return NextResponse.json(
      {
        report: {
          type: reportType,
          generated_at: new Date().toISOString(),
          date_range: { start: startDate, end: endDate },
          data: reportData,
        },
      },
      { status: 200, headers: corsHeaders() },
    )
  } catch (error) {
    console.error("Get reports error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500, headers: corsHeaders() })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders() })
}
