import { z } from "zod"

// User validation schemas
export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["candidate", "employer"]).optional().default("candidate"),
})

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

// Job validation schemas
export const jobCreateSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  location: z.string().min(2, "Location must be at least 2 characters"),
  job_type: z.enum(["full-time", "part-time", "contract", "remote"]),
  salary_min: z.number().positive().optional(),
  salary_max: z.number().positive().optional(),
  status: z.enum(["open", "closed", "draft"]).optional().default("draft"),
})

export const jobUpdateSchema = jobCreateSchema.extend({
  status: z.enum(["open", "closed", "draft"]),
})

// Application validation schemas
export const applicationSchema = z.object({
  resume_url: z.string().url().optional(),
})

export const applicationStatusSchema = z.object({
  status: z.enum(["applied", "shortlisted", "hired", "rejected"]),
})

// Query parameter validation
export const jobFiltersSchema = z.object({
  title: z.string().optional(),
  location: z.string().optional(),
  job_type: z.enum(["full-time", "part-time", "contract", "remote"]).optional(),
  salary_min: z.coerce.number().positive().optional(),
  salary_max: z.coerce.number().positive().optional(),
})

export const paginationSchema = z.object({
  page: z.coerce.number().positive().default(1),
  limit: z.coerce.number().positive().max(100).default(10),
})
