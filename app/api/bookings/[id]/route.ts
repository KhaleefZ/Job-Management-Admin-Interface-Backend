import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { withAuth, corsHeaders } from "@/lib/middleware"

const sql = neon(process.env.DATABASE_URL!)

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { user, error } = await withAuth(request)

    if (error) {
      return error
    }

    const { status, meeting_link, notes } = await request.json()

    if (!status) {
      return NextResponse.json(
        { error: "Status is required" },
        { status: 400, headers: corsHeaders() }
      )
    }

    // Validate status
    const validStatuses = ['scheduled', 'completed', 'cancelled', 'no-show']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400, headers: corsHeaders() }
      )
    }

    // Check if booking exists and user has permission
    const existingBooking = await sql`
      SELECT * FROM call_bookings WHERE id = ${params.id}
    `

    if (existingBooking.length === 0) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404, headers: corsHeaders() }
      )
    }

    const booking = existingBooking[0]

    // Check permissions
    if (user.role !== 'admin' && 
        user.id !== booking.candidate_id && 
        user.id !== booking.employer_id) {
      return NextResponse.json(
        { error: "You don't have permission to update this booking" },
        { status: 403, headers: corsHeaders() }
      )
    }

    // Update booking
    const updatedBooking = await sql`
      UPDATE call_bookings SET
        status = ${status},
        meeting_link = ${meeting_link || booking.meeting_link},
        notes = ${notes || booking.notes},
        updated_at = NOW()
      WHERE id = ${params.id}
      RETURNING *
    `

    return NextResponse.json({
      message: "Booking updated successfully",
      booking: updatedBooking[0]
    }, { status: 200, headers: corsHeaders() })
  } catch (error) {
    console.error("Update booking error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500, headers: corsHeaders() })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { user, error } = await withAuth(request)

    if (error) {
      return error
    }

    // Check if booking exists and user has permission
    const existingBooking = await sql`
      SELECT * FROM call_bookings WHERE id = ${params.id}
    `

    if (existingBooking.length === 0) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404, headers: corsHeaders() }
      )
    }

    const booking = existingBooking[0]

    // Check permissions
    if (user.role !== 'admin' && 
        user.id !== booking.candidate_id && 
        user.id !== booking.employer_id) {
      return NextResponse.json(
        { error: "You don't have permission to delete this booking" },
        { status: 403, headers: corsHeaders() }
      )
    }

    // Delete booking
    await sql`DELETE FROM call_bookings WHERE id = ${params.id}`

    return NextResponse.json({
      message: "Booking deleted successfully"
    }, { status: 200, headers: corsHeaders() })
  } catch (error) {
    console.error("Delete booking error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500, headers: corsHeaders() })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders() })
}