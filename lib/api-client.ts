export class ApiClient {
  private token: string | null = null
  private baseUrl = "http://localhost:3001"

  setToken(token: string) {
    this.token = token
  }

  async applyToJob(jobId: string, data: any) {
    const response = await fetch(`${this.baseUrl}/api/jobs/${jobId}/apply`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(this.token ? { "Authorization": `Bearer ${this.token}` } : {})
      },
      body: JSON.stringify(data)
    })
    return response.json()
  }

  async getTestimonials() {
    const response = await fetch(`${this.baseUrl}/api/testimonials`, {
      headers: {
        "Content-Type": "application/json",
      }
    })
    return response.json()
  }

  async submitTestimonial(data: any) {
    const response = await fetch(`${this.baseUrl}/api/testimonials`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data)
    })
    return response.json()
  }

  async getBookings() {
    const response = await fetch(`${this.baseUrl}/api/bookings`, {
      headers: {
        "Content-Type": "application/json",
        ...(this.token ? { "Authorization": `Bearer ${this.token}` } : {})
      }
    })
    return response.json()
  }

  async createBooking(data: any) {
    const response = await fetch(`${this.baseUrl}/api/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(this.token ? { "Authorization": `Bearer ${this.token}` } : {})
      },
      body: JSON.stringify(data)
    })
    return response.json()
  }
}

export const apiClient = new ApiClient()
