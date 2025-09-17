import { type NextRequest, NextResponse } from "next/server"
import { authenticateUser, generateToken } from "@/lib/auth"
import { corsHeaders } from "@/lib/middleware"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validation
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400, headers: corsHeaders() })
    }

    // Authenticate user
    const user = await authenticateUser(email, password)
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401, headers: corsHeaders() })
    }

    // Generate token
    const token = generateToken(user)

    return NextResponse.json(
      {
        message: "Login successful",
        user,
        token,
      },
      { status: 200, headers: corsHeaders() },
    )
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500, headers: corsHeaders() })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders() })
}
