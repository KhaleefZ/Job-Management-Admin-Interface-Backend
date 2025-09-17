// Application constants
export const USER_ROLES = {
  CANDIDATE: "candidate",
  EMPLOYER: "employer",
  ADMIN: "admin",
} as const

export const JOB_TYPES = {
  FULL_TIME: "full-time",
  PART_TIME: "part-time",
  CONTRACT: "contract",
  REMOTE: "remote",
} as const

export const JOB_STATUS = {
  OPEN: "open",
  CLOSED: "closed",
  DRAFT: "draft",
} as const

export const APPLICATION_STATUS = {
  APPLIED: "applied",
  SHORTLISTED: "shortlisted",
  HIRED: "hired",
  REJECTED: "rejected",
} as const

export const API_ROUTES = {
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
    PROFILE: "/api/auth/profile",
  },
  USERS: {
    BASE: "/api/users",
    BY_ID: (id: string) => `/api/users/${id}`,
  },
  JOBS: {
    BASE: "/api/jobs",
    BY_ID: (id: string) => `/api/jobs/${id}`,
    MY_JOBS: "/api/jobs/my-jobs",
    APPLY: (id: string) => `/api/jobs/${id}/apply`,
    APPLICATIONS: (id: string) => `/api/jobs/${id}/applications`,
  },
  APPLICATIONS: {
    BASE: "/api/applications",
    STATUS: (id: string) => `/api/applications/${id}/status`,
  },
  ADMIN: {
    DASHBOARD: "/api/admin/dashboard",
    STATS: "/api/admin/stats",
    REPORTS: "/api/admin/reports",
  },
} as const

export const ERROR_MESSAGES = {
  UNAUTHORIZED: "You are not authorized to perform this action",
  INVALID_CREDENTIALS: "Invalid email or password",
  USER_EXISTS: "User with this email already exists",
  USER_NOT_FOUND: "User not found",
  JOB_NOT_FOUND: "Job not found",
  APPLICATION_NOT_FOUND: "Application not found",
  ALREADY_APPLIED: "You have already applied to this job",
  INVALID_TOKEN: "Invalid or expired token",
  MISSING_FIELDS: "Required fields are missing",
  SERVER_ERROR: "Internal server error",
} as const

export const SUCCESS_MESSAGES = {
  USER_CREATED: "User registered successfully",
  LOGIN_SUCCESS: "Login successful",
  JOB_CREATED: "Job created successfully",
  JOB_UPDATED: "Job updated successfully",
  JOB_DELETED: "Job deleted successfully",
  APPLICATION_SUBMITTED: "Application submitted successfully",
  APPLICATION_UPDATED: "Application status updated successfully",
  USER_DELETED: "User deleted successfully",
} as const
