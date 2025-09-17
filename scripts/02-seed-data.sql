-- Seed data for Job Management System

-- Insert admin user (password: admin123)
INSERT INTO users (id, name, email, password, role) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'Admin User', 'admin@jobportal.com', '$2b$10$rOzJqQqQqQqQqQqQqQqQqOzJqQqQqQqQqQqQqQqQqOzJqQqQqQqQqQ', 'admin');

-- Insert employer users (password: employer123)
INSERT INTO users (id, name, email, password, role) VALUES 
('550e8400-e29b-41d4-a716-446655440001', 'Tech Corp HR', 'hr@techcorp.com', '$2b$10$rOzJqQqQqQqQqQqQqQqQqOzJqQqQqQqQqQqQqQqQqOzJqQqQqQqQqQ', 'employer'),
('550e8400-e29b-41d4-a716-446655440002', 'StartupXYZ Recruiter', 'recruiter@startupxyz.com', '$2b$10$rOzJqQqQqQqQqQqQqQqQqOzJqQqQqQqQqQqQqQqQqOzJqQqQqQqQqQ', 'employer');

-- Insert candidate users (password: candidate123)
INSERT INTO users (id, name, email, password, role) VALUES 
('550e8400-e29b-41d4-a716-446655440003', 'John Doe', 'john@example.com', '$2b$10$rOzJqQqQqQqQqQqQqQqQqOzJqQqQqQqQqQqQqQqQqOzJqQqQqQqQqQ', 'candidate'),
('550e8400-e29b-41d4-a716-446655440004', 'Jane Smith', 'jane@example.com', '$2b$10$rOzJqQqQqQqQqQqQqQqQqOzJqQqQqQqQqQqQqQqQqOzJqQqQqQqQqQ', 'candidate');

-- Insert sample jobs
INSERT INTO jobs (id, title, description, location, job_type, salary_min, salary_max, status, posted_by) VALUES 
('660e8400-e29b-41d4-a716-446655440000', 'Senior Software Engineer', 'We are looking for a senior software engineer with 5+ years of experience in React and Node.js', 'San Francisco, CA', 'full-time', 120000, 180000, 'open', '550e8400-e29b-41d4-a716-446655440001'),
('660e8400-e29b-41d4-a716-446655440001', 'Frontend Developer', 'Join our team as a frontend developer working with modern React applications', 'New York, NY', 'full-time', 80000, 120000, 'open', '550e8400-e29b-41d4-a716-446655440001'),
('660e8400-e29b-41d4-a716-446655440002', 'Product Manager', 'Lead product development for our innovative SaaS platform', 'Remote', 'remote', 100000, 150000, 'open', '550e8400-e29b-41d4-a716-446655440002'),
('660e8400-e29b-41d4-a716-446655440003', 'UX Designer', 'Create beautiful and intuitive user experiences', 'Austin, TX', 'full-time', 70000, 100000, 'open', '550e8400-e29b-41d4-a716-446655440002'),
('660e8400-e29b-41d4-a716-446655440004', 'DevOps Engineer', 'Manage our cloud infrastructure and deployment pipelines', 'Seattle, WA', 'contract', 90000, 130000, 'open', '550e8400-e29b-41d4-a716-446655440001');

-- Insert sample applications
INSERT INTO applications (job_id, user_id, status, full_name, email, phone, cover_letter, resume_url, resume_filename) VALUES 
('660e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440003', 'applied', 'John Doe', 'john@example.com', '+1-555-0123', 'I am excited to apply for this position...', 'https://example.com/resume1.pdf', 'john_doe_resume.pdf'),
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', 'shortlisted', 'John Doe', 'john@example.com', '+1-555-0123', 'I would love to join your frontend team...', 'https://example.com/resume1.pdf', 'john_doe_resume.pdf'),
('660e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440004', 'applied', 'Jane Smith', 'jane@example.com', '+1-555-0456', 'With my 5 years of experience...', 'https://example.com/resume2.pdf', 'jane_smith_resume.pdf'),
('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440004', 'hired', 'Jane Smith', 'jane@example.com', '+1-555-0456', 'I am passionate about product management...', 'https://example.com/resume2.pdf', 'jane_smith_resume.pdf');

-- Insert sample user profiles
INSERT INTO user_profiles (user_id, bio, skills, experience_years, location, hourly_rate, availability, profile_image_url, resume_url, portfolio_url, linkedin_url, github_url) VALUES 
('550e8400-e29b-41d4-a716-446655440003', 'Experienced software engineer with a passion for creating scalable web applications', '{"JavaScript", "React", "Node.js", "Python", "AWS"}', 5, 'San Francisco, CA', 75.00, 'Available', 'https://example.com/john_profile.jpg', 'https://example.com/john_resume.pdf', 'https://johndoe.dev', 'https://linkedin.com/in/johndoe', 'https://github.com/johndoe'),
('550e8400-e29b-41d4-a716-446655440004', 'Full-stack developer and product enthusiast with expertise in modern web technologies', '{"React", "TypeScript", "GraphQL", "PostgreSQL", "Docker"}', 7, 'New York, NY', 85.00, 'Available', 'https://example.com/jane_profile.jpg', 'https://example.com/jane_resume.pdf', 'https://janesmith.dev', 'https://linkedin.com/in/janesmith', 'https://github.com/janesmith');

-- Insert sample testimonials
INSERT INTO testimonials (user_id, name, role, company, location, rating, testimonial_text, outcome, category, is_approved) VALUES 
('550e8400-e29b-41d4-a716-446655440003', 'John Doe', 'Senior Software Engineer', 'Tesla', 'San Francisco, CA', 5, 'JobBoard completely transformed my job search experience. Within 2 weeks, I had multiple offers from top tech companies. The platform''s matching algorithm is incredibly accurate!', 'Got dream job in 2 weeks', 'job-seeker', true),
('550e8400-e29b-41d4-a716-446655440004', 'Jane Smith', 'Product Manager', 'Google', 'New York, NY', 5, 'I was skeptical about online job platforms, but JobBoard proved me wrong. The personalized job recommendations were spot-on, and I found my current role within a month.', 'Found perfect role in 1 month', 'job-seeker', true),
('550e8400-e29b-41d4-a716-446655440001', 'Tech Corp HR', 'HR Director', 'Tech Corp', 'San Francisco, CA', 5, 'As a recruiter, I''ve used many platforms, but JobBoard stands out. The quality of candidates is exceptional, and the interface makes screening so much easier. We''ve hired 15+ people through this platform.', 'Hired 15+ quality candidates', 'employer', true);

-- Insert sample call bookings
INSERT INTO call_bookings (candidate_id, employer_id, job_id, scheduled_at, duration_minutes, notes, status) VALUES 
('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440000', '2024-12-20 15:00:00+00', 45, 'Technical interview for Senior Software Engineer position', 'scheduled'),
('550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440002', '2024-12-22 10:30:00+00', 30, 'Product management role discussion', 'scheduled');
