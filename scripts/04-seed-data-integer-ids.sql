-- Seed data for Job Management System with INTEGER IDs

-- Clear existing data
TRUNCATE TABLE applications RESTART IDENTITY CASCADE;
TRUNCATE TABLE jobs RESTART IDENTITY CASCADE;
TRUNCATE TABLE users RESTART IDENTITY CASCADE;

-- Insert admin user (password: admin123)
INSERT INTO users (name, email, password, role) VALUES 
('Admin User', 'admin@jobportal.com', '$2b$10$rOzJqQqQqQqQqQqQqQqQqOzJqQqQqQqQqQqQqQqQqOzJqQqQqQqQqQ', 'admin');

-- Insert employer users (password: employer123)
INSERT INTO users (name, email, password, role) VALUES 
('Tech Corp HR', 'hr@techcorp.com', '$2b$10$rOzJqQqQqQqQqQqQqQqQqOzJqQqQqQqQqQqQqQqQqOzJqQqQqQqQqQ', 'employer'),
('StartupXYZ Recruiter', 'recruiter@startupxyz.com', '$2b$10$rOzJqQqQqQqQqQqQqQqQqOzJqQqQqQqQqQqQqQqQqOzJqQqQqQqQqQ', 'employer');

-- Insert candidate users (password: candidate123)
INSERT INTO users (name, email, password, role) VALUES 
('John Doe', 'john@example.com', '$2b$10$rOzJqQqQqQqQqQqQqQqQqOzJqQqQqQqQqQqQqQqQqOzJqQqQqQqQqQ', 'candidate'),
('Jane Smith', 'jane@example.com', '$2b$10$rOzJqQqQqQqQqQqQqQqQqOzJqQqQqQqQqQqQqQqQqOzJqQqQqQqQqQ', 'candidate');

-- Insert sample jobs (using integer IDs from users table)
INSERT INTO jobs (title, description, location, job_type, salary_min, salary_max, status, posted_by) VALUES 
('Senior Full Stack Developer', 'We are looking for a senior full stack developer with 5+ years of experience in React and Node.js. Join our innovative team building cutting-edge web applications.', 'San Francisco, CA', 'full-time', 120000, 180000, 'open', 2),
('Frontend Developer', 'Join our team as a frontend developer working with modern React applications and building user interfaces that millions use daily.', 'New York, NY', 'full-time', 80000, 120000, 'open', 2),
('Product Manager', 'Lead product development for our innovative SaaS platform. Work with engineering teams to define product roadmap and strategy.', 'Remote', 'remote', 100000, 150000, 'open', 3),
('UX Designer', 'Create beautiful and intuitive user experiences for our mobile and web applications. Collaborate with product and engineering teams.', 'Austin, TX', 'full-time', 70000, 100000, 'open', 3),
('DevOps Engineer', 'Manage our cloud infrastructure and deployment pipelines. Experience with AWS, Docker, and Kubernetes required.', 'Seattle, WA', 'contract', 90000, 130000, 'open', 2);

-- Insert sample applications
INSERT INTO applications (job_id, user_id, status, full_name, email, phone, cover_letter, resume_url, resume_filename) VALUES 
(1, 4, 'applied', 'John Doe', 'john@example.com', '+1-555-0123', 'I am excited to apply for this position and bring my 5+ years of experience in full stack development...', '/uploads/resumes/john_doe_resume.pdf', 'john_doe_resume.pdf'),
(2, 4, 'shortlisted', 'John Doe', 'john@example.com', '+1-555-0123', 'I would love to join your frontend team and contribute to building amazing user interfaces...', '/uploads/resumes/john_doe_resume.pdf', 'john_doe_resume.pdf'),
(1, 5, 'applied', 'Jane Smith', 'jane@example.com', '+1-555-0456', 'With my 7 years of experience in software development, I believe I would be a great fit for this senior role...', '/uploads/resumes/jane_smith_resume.pdf', 'jane_smith_resume.pdf'),
(3, 5, 'hired', 'Jane Smith', 'jane@example.com', '+1-555-0456', 'I am passionate about product management and have successfully launched 5+ products in my career...', '/uploads/resumes/jane_smith_resume.pdf', 'jane_smith_resume.pdf');

COMMENT ON TABLE users IS 'User accounts for candidates, employers, and admins';
COMMENT ON TABLE jobs IS 'Job postings created by employers';  
COMMENT ON TABLE applications IS 'Job applications submitted by candidates or guests';