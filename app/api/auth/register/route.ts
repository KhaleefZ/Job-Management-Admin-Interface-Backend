import { type NextRequest, NextResponse } from "next/server"
import { userQueries } from "@/lib/database"
import { hashPassword, generateToken } from "@/lib/auth"
import { corsHeaders } from "@/lib/middleware"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, role = "candidate" } = await request.json()

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400, headers: corsHeaders() },
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400, headers: corsHeaders() },
      )
    }

    // Check if user already exists
    const existingUsers = await userQueries.findByEmail(email)
    if (existingUsers.length > 0) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409, headers: corsHeaders() },
      )
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(password)
    const newUsers = await userQueries.create({
      name,
      email,
      password: hashedPassword,
      role,
    })

    const newUser = newUsers[0]
    const { password: _, ...userWithoutPassword } = newUser
    const token = generateToken(userWithoutPassword)

    return NextResponse.json(
      {
        message: "User registered successfully",
        user: userWithoutPassword,
        token,
      },
      { status: 201, headers: corsHeaders() },
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500, headers: corsHeaders() })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders() })
}
