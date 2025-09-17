import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { userQueries } from "./database"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production"

export interface User {
  id: string
  name: string
  email: string
  role: "candidate" | "employer" | "admin"
  created_at: string
  updated_at: string
}

export interface AuthUser extends User {
  password: string
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateToken(user: User): string {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: "7d" },
  )
}

export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    throw new Error("Invalid token")
  }
}

export async function authenticateUser(email: string, password: string): Promise<User | null> {
  try {
    const users = await userQueries.findByEmail(email)
    if (users.length === 0) {
      return null
    }

    const user = users[0] as AuthUser
    const isValidPassword = await verifyPassword(password, user.password)

    if (!isValidPassword) {
      return null
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user
    return userWithoutPassword
  } catch (error) {
    console.error("Authentication error:", error)
    return null
  }
}

export async function getUserFromToken(token: string): Promise<User | null> {
  try {
    const decoded = verifyToken(token)
    const users = await userQueries.findById(decoded.id)

    if (users.length === 0) {
      return null
    }

    const { password: _, ...user } = users[0] as AuthUser
    return user
  } catch (error) {
    return null
  }
}
