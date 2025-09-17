import { neon } from "@neondatabase/serverless"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set")
}

export const sql = neon(process.env.DATABASE_URL)

// Database utility functions
export async function executeQuery(query: string, params: any[] = []) {
  try {
    // For dynamic queries, we'll need to use a different approach
    // This is kept for backward compatibility but should be avoided
    throw new Error("Use template literals with sql`` instead of dynamic queries")
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

// User queries
export const userQueries = {
  findByEmail: (email: string) => sql`SELECT * FROM users WHERE email = ${email}`,

  findById: (id: string) => sql`SELECT * FROM users WHERE id = ${id}`,

  create: (user: { name: string; email: string; password: string; role: string }) =>
    sql`INSERT INTO users (name, email, password, role) 
        VALUES (${user.name}, ${user.email}, ${user.password}, ${user.role}) 
        RETURNING *`,

  getAll: () => sql`SELECT id, name, email, role, created_at, updated_at FROM users ORDER BY created_at DESC`,

  delete: (id: string) => sql`DELETE FROM users WHERE id = ${id}`,
}

// Job queries
export const jobQueries = {
  getAll: (filters?: {
    title?: string
    location?: string
    job_type?: string
    salary_min?: number
    salary_max?: number
  }) => {
    // For now, return all jobs without filters. Filters can be implemented with multiple queries
    return sql`SELECT j.*, u.name as posted_by_name FROM jobs j 
               JOIN users u ON j.posted_by = u.id 
               WHERE j.status = 'open'
               ORDER BY j.created_at DESC`
  },

  findById: (id: string) =>
    sql`SELECT j.*, u.name as posted_by_name FROM jobs j 
        JOIN users u ON j.posted_by = u.id 
        WHERE j.id = ${id}`,

  create: (job: any) =>
    sql`INSERT INTO jobs (title, description, location, job_type, salary_min, salary_max, status, posted_by) 
        VALUES (${job.title}, ${job.description}, ${job.location}, ${job.job_type}, ${job.salary_min}, ${job.salary_max}, ${job.status}, ${job.posted_by}) 
        RETURNING *`,

  update: (id: string, job: any) =>
    sql`UPDATE jobs SET 
        title = ${job.title}, 
        description = ${job.description}, 
        location = ${job.location}, 
        job_type = ${job.job_type}, 
        salary_min = ${job.salary_min}, 
        salary_max = ${job.salary_max}, 
        status = ${job.status}
        WHERE id = ${id} 
        RETURNING *`,

  delete: (id: string) => sql`DELETE FROM jobs WHERE id = ${id}`,

  getByEmployer: (employerId: string) =>
    sql`SELECT * FROM jobs WHERE posted_by = ${employerId} ORDER BY created_at DESC`,
}

// Application queries
export const applicationQueries = {
  create: (application: { 
    job_id: string; 
    user_id: string; 
    full_name?: string;
    email?: string;
    phone?: string;
    cover_letter?: string;
    resume_url?: string;
    resume_filename?: string;
  }) =>
    sql`INSERT INTO applications (
      job_id, user_id, full_name, email, phone, 
      cover_letter, resume_url, resume_filename
    ) 
    VALUES (
      ${application.job_id}, ${application.user_id}, ${application.full_name}, 
      ${application.email}, ${application.phone}, ${application.cover_letter},
      ${application.resume_url}, ${application.resume_filename}
    ) 
    RETURNING *`,

  getByUser: (userId: string) =>
    sql`SELECT a.*, j.title as job_title, j.location, u.name as company_name 
        FROM applications a 
        JOIN jobs j ON a.job_id = j.id 
        JOIN users u ON j.posted_by = u.id 
        WHERE a.user_id = ${userId} 
        ORDER BY a.applied_at DESC`,

  getByJob: (jobId: string) =>
    sql`SELECT a.*, u.name as applicant_name, u.email as applicant_email 
        FROM applications a 
        JOIN users u ON a.user_id = u.id 
        WHERE a.job_id = ${jobId} 
        ORDER BY a.applied_at DESC`,

  updateStatus: (id: string, status: string) =>
    sql`UPDATE applications SET status = ${status} WHERE id = ${id} RETURNING *`,

  getAll: () =>
    sql`SELECT a.*, j.title as job_title, u.name as applicant_name, emp.name as employer_name 
        FROM applications a 
        JOIN jobs j ON a.job_id = j.id 
        JOIN users u ON a.user_id = u.id 
        JOIN users emp ON j.posted_by = emp.id 
        ORDER BY a.applied_at DESC`,

  checkExisting: (jobId: string, userId: string) =>
    sql`SELECT id FROM applications WHERE job_id = ${jobId} AND user_id = ${userId}`,
}
