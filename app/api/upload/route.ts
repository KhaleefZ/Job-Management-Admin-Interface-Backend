import { type NextRequest, NextResponse } from "next/server"
import { withAuth, corsHeaders } from "@/lib/middleware"

export async function POST(request: NextRequest) {
  try {
    const { user, error } = await withAuth(request)

    if (error) {
      return error
    }

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400, headers: corsHeaders() }
      )
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only PDF and Word documents are allowed." },
        { status: 400, headers: corsHeaders() }
      )
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File size too large. Maximum size is 5MB." },
        { status: 400, headers: corsHeaders() }
      )
    }

    // In a real application, you would upload to a cloud storage service
    // For now, we'll return a mock URL
    const fileName = `${user.id}_${Date.now()}_${file.name}`
    const mockUrl = `https://your-storage-bucket.com/resumes/${fileName}`

    // TODO: Implement actual file upload to cloud storage
    // Example with AWS S3, Google Cloud Storage, or similar
    
    return NextResponse.json({
      message: "File uploaded successfully",
      url: mockUrl,
      filename: file.name,
      size: file.size,
      type: file.type
    }, { status: 200, headers: corsHeaders() })

  } catch (error) {
    console.error("File upload error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: corsHeaders() }
    )
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders() })
}