import { type NextRequest, NextResponse } from "next/server"
import { withAuth, corsHeaders } from "@/lib/middleware"

export async function GET(request: NextRequest) {
  try {
    const { user, error } = await withAuth(request)

    if (error) {
      return error
    }

    return NextResponse.json({ user }, { status: 200, headers: corsHeaders() })
  } catch (error) {
    console.error("Profile error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500, headers: corsHeaders() })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders() })
}
