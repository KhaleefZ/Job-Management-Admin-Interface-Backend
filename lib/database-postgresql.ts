import { Pool } from 'pg'

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set")
}

// Create PostgreSQL connection pool
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
})

// Database utility function that mimics Neon's sql template literal behavior
export const sql = (strings: TemplateStringsArray, ...values: any[]) => {
  const query = strings.reduce((acc, str, i) => {
    const value = values[i]
    if (value === undefined) return acc + str
    
    // Use parameterized queries for safety
    return acc + str + `$${i + 1}`
  }, '')
  
  return pool.query(query, values)
}

// Alternative query function for better compatibility
export async function executeQuery(query: string, params: any[] = []) {
  try {
    const result = await pool.query(query, params)
    return result.rows
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

// Test database connection
export async function testConnection() {
  try {
    const result = await pool.query('SELECT NOW()')
    console.log('Database connected successfully:', result.rows[0])
    return true
  } catch (error) {
    console.error('Database connection failed:', error)
    return false
  }
}

// User queries
export const userQueries = {
  findByEmail: async (email: string) => {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email])
    return result.rows
  },

  findById: async (id: string) => {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id])
    return result.rows
  },

  create: async (user: { name: string; email: string; password: string; role: string }) => {
    const result = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *',
      [user.name, user.email, user.password, user.role]
    )
    return result.rows
  },

  getAll: async () => {
    const result = await pool.query('SELECT id, name, email, role, created_at, updated_at FROM users ORDER BY created_at DESC')
    return result.rows
  },

  delete: async (id: string) => {
    const result = await pool.query('DELETE FROM users WHERE id = $1', [id])
    return result.rows
  },
}

// Job queries
export const jobQueries = {
  getAll: async (filters?: {
    title?: string
    location?: string
    job_type?: string
    salary_min?: number
    salary_max?: number
  }) => {
    const result = await pool.query(`
      SELECT j.*, u.name as posted_by_name 
      FROM jobs j 
      JOIN users u ON j.posted_by = u.id 
      WHERE j.status = 'open'
      ORDER BY j.created_at DESC
    `)
    return result.rows
  },

  findById: async (id: string) => {
    const result = await pool.query('SELECT * FROM jobs WHERE id = $1', [id])
    return result.rows
  },

  create: async (job: any) => {
    const result = await pool.query(`
      INSERT INTO jobs (title, description, location, job_type, salary_min, salary_max, status, posted_by)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
      RETURNING *
    `, [job.title, job.description, job.location, job.job_type, job.salary_min, job.salary_max, job.status, job.posted_by])
    return result.rows
  },

  update: async (id: string, updates: any) => {
    const fields = Object.keys(updates)
    const values = Object.values(updates)
    const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(', ')
    
    const result = await pool.query(
      `UPDATE jobs SET ${setClause} WHERE id = $${fields.length + 1} RETURNING *`,
      [...values, id]
    )
    return result.rows
  },

  delete: async (id: string) => {
    const result = await pool.query('DELETE FROM jobs WHERE id = $1', [id])
    return result.rows
  },

  getByUser: async (userId: string) => {
    const result = await pool.query('SELECT * FROM jobs WHERE posted_by = $1 ORDER BY created_at DESC', [userId])
    return result.rows
  },
}

// Application queries
export const applicationQueries = {
  getAll: async () => {
    const result = await pool.query(`
      SELECT a.*, j.title as job_title, u.name as user_name 
      FROM applications a 
      JOIN jobs j ON a.job_id = j.id 
      JOIN users u ON a.user_id = u.id 
      ORDER BY a.applied_at DESC
    `)
    return result.rows
  },

  getByUser: async (userId: string) => {
    const result = await pool.query(`
      SELECT a.*, j.title as job_title 
      FROM applications a 
      JOIN jobs j ON a.job_id = j.id 
      WHERE a.user_id = $1 
      ORDER BY a.applied_at DESC
    `, [userId])
    return result.rows
  },

  getByJob: async (jobId: string) => {
    const result = await pool.query(`
      SELECT a.*, u.name as user_name, u.email as user_email 
      FROM applications a 
      JOIN users u ON a.user_id = u.id 
      WHERE a.job_id = $1 
      ORDER BY a.applied_at DESC
    `, [jobId])
    return result.rows
  },

  create: async (application: any) => {
    const result = await pool.query(`
      INSERT INTO applications (job_id, user_id, full_name, email, phone, cover_letter, resume_url, resume_filename)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
      RETURNING *
    `, [
      application.job_id,
      application.user_id,
      application.full_name,
      application.email,
      application.phone,
      application.cover_letter,
      application.resume_url,
      application.resume_filename
    ])
    return result.rows
  },

  checkExisting: async (jobId: string, userId: string) => {
    const result = await pool.query(
      'SELECT * FROM applications WHERE job_id = $1 AND user_id = $2',
      [jobId, userId]
    )
    return result.rows
  },

  updateStatus: async (id: string, status: string) => {
    const result = await pool.query(
      'UPDATE applications SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    )
    return result.rows
  },
}