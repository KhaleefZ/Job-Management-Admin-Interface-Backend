// Database entity types
export interface User {
  id: string
  name: string
  email: string
  role: "candidate" | "employer" | "admin"
  created_at: string
  updated_at: string
}

export interface Job {
  id: string
  title: string
  description: string
  location: string
  job_type: "full-time" | "part-time" | "contract" | "remote"
  salary_min?: number
  salary_max?: number
  status: "open" | "closed" | "draft"
  posted_by: string
  posted_by_name?: string
  created_at: string
  updated_at: string
}

export interface Application {
  id: string
  job_id: string
  user_id: string
  status: "applied" | "shortlisted" | "hired" | "rejected"
  resume_url?: string
  applied_at: string
  job_title?: string
  applicant_name?: string
  applicant_email?: string
  employer_name?: string
  location?: string
  company_name?: string
}

// API request/response types
export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
  role?: "candidate" | "employer"
}

export interface AuthResponse {
  message: string
  user: User
  token: string
}

export interface JobCreateRequest {
  title: string
  description: string
  location: string
  job_type: "full-time" | "part-time" | "contract" | "remote"
  salary_min?: number
  salary_max?: number
  status?: "open" | "closed" | "draft"
}

export interface JobUpdateRequest extends JobCreateRequest {
  status: "open" | "closed" | "draft"
}

export interface ApplicationRequest {
  resume_url?: string
}

export interface ApplicationStatusUpdate {
  status: "applied" | "shortlisted" | "hired" | "rejected"
}

// Dashboard types
export interface DashboardStats {
  totalUsers: number
  totalJobs: number
  totalApplications: number
  activeJobs: number
  recentApplications: number
}

export interface ChartData {
  usersByRole: Array<{ role: string; count: number }>
  jobsByStatus: Array<{ status: string; count: number }>
  applicationsByStatus: Array<{ status: string; count: number }>
}

export interface DashboardData {
  stats: DashboardStats
  charts: ChartData
  recentActivities: Array<{
    type: string
    id: string
    user_name: string
    job_title: string
    status: string
    created_at: string
  }>
}

// Filter types
export interface JobFilters {
  title?: string
  location?: string
  job_type?: "full-time" | "part-time" | "contract" | "remote"
  salary_min?: number
  salary_max?: number
}

// API response wrapper
export interface ApiResponse<T = any> {
  message?: string
  error?: string
  data?: T
  [key: string]: any
}

// JWT payload
export interface JWTPayload {
  id: string
  email: string
  role: "candidate" | "employer" | "admin"
  iat: number
  exp: number
}
