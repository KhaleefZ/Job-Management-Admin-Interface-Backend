import { type NextRequest, NextResponse } from "next/server"
import { withAuth, corsHeaders } from "@/lib/middleware"

// In a real application, you would store likes in a database
// For now, we'll use a simple in-memory store
const jobLikes = new Map<string, Set<string>>() // jobId -> Set of userIds
const jobLikeCounts = new Map<string, number>() // jobId -> like count

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { user, error } = await withAuth(request, ["candidate"])

    if (error) {
      return error
    }

    const jobId = params.id

    // Get or initialize likes for this job
    if (!jobLikes.has(jobId)) {
      jobLikes.set(jobId, new Set())
      jobLikeCounts.set(jobId, 0)
    }

    const userLikes = jobLikes.get(jobId)!
    const currentCount = jobLikeCounts.get(jobId)!

    // Check if user already liked this job
    if (userLikes.has(user.id)) {
      return NextResponse.json(
        { error: "You have already liked this job" },
        { status: 409, headers: corsHeaders() }
      )
    }

    // Add like
    userLikes.add(user.id)
    jobLikeCounts.set(jobId, currentCount + 1)

    return NextResponse.json(
      { 
        message: "Job liked successfully",
        isLiked: true,
        likesCount: jobLikeCounts.get(jobId)
      },
      { status: 200, headers: corsHeaders() }
    )
  } catch (error) {
    console.error("Like job error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: corsHeaders() }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { user, error } = await withAuth(request, ["candidate"])

    if (error) {
      return error
    }

    const jobId = params.id

    // Get likes for this job
    if (!jobLikes.has(jobId)) {
      return NextResponse.json(
        { error: "Job not found or no likes yet" },
        { status: 404, headers: corsHeaders() }
      )
    }

    const userLikes = jobLikes.get(jobId)!
    const currentCount = jobLikeCounts.get(jobId)!

    // Check if user has liked this job
    if (!userLikes.has(user.id)) {
      return NextResponse.json(
        { error: "You haven't liked this job" },
        { status: 409, headers: corsHeaders() }
      )
    }

    // Remove like
    userLikes.delete(user.id)
    jobLikeCounts.set(jobId, Math.max(0, currentCount - 1))

    return NextResponse.json(
      { 
        message: "Job unliked successfully",
        isLiked: false,
        likesCount: jobLikeCounts.get(jobId)
      },
      { status: 200, headers: corsHeaders() }
    )
  } catch (error) {
    console.error("Unlike job error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: corsHeaders() }
    )
  }
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { user, error } = await withAuth(request, ["candidate"])

    if (error) {
      return error
    }

    const jobId = params.id

    // Get like status for this job and user
    const userLikes = jobLikes.get(jobId) || new Set()
    const likesCount = jobLikeCounts.get(jobId) || 0
    const isLiked = userLikes.has(user.id)

    return NextResponse.json(
      { 
        isLiked,
        likesCount
      },
      { status: 200, headers: corsHeaders() }
    )
  } catch (error) {
    console.error("Get like status error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: corsHeaders() }
    )
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders() })
}