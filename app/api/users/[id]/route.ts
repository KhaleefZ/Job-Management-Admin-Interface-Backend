import { type NextRequest, NextResponse } from "next/server"
import { userQueries } from "@/lib/database"
import { withAuth, corsHeaders } from "@/lib/middleware"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { user, error } = await withAuth(request)

    if (error) {
      return error
    }

    // Users can only view their own profile unless they're admin
    if (user.role !== "admin" && user.id !== params.id) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403, headers: corsHeaders() })
    }

    const users = await userQueries.findById(params.id)

    if (users.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404, headers: corsHeaders() })
    }

    const { password: _, ...userWithoutPassword } = users[0]

    return NextResponse.json({ user: userWithoutPassword }, { status: 200, headers: corsHeaders() })
  } catch (error) {
    console.error("Get user error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500, headers: corsHeaders() })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { user, error } = await withAuth(request, ["admin"])

    if (error) {
      return error
    }

    await userQueries.delete(params.id)

    return NextResponse.json({ message: "User deleted successfully" }, { status: 200, headers: corsHeaders() })
  } catch (error) {
    console.error("Delete user error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500, headers: corsHeaders() })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders() })
}
