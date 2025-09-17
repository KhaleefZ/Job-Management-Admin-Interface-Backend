# Job Management System - Backend API# Job Management Admin Interface



This is the backend API server for the Job Management System. It provides REST API endpoints for managing jobs, users, applications, and authentication.A comprehensive job management system built with Next.js, TypeScript, and PostgreSQL.



## Features## Features



- User authentication (JWT-based)### For Candidates

- Job management (CRUD operations)- Browse and search job listings

- Application tracking- Apply to jobs with resume upload

- Admin dashboard functionality- Track application status

- PostgreSQL database integration- User profile management

- CORS enabled for frontend communication

### For Employers

## Prerequisites- Post and manage job listings

- Review job applications

Before running this project, make sure you have:- Update application status

- Dashboard with job statistics

- Node.js (v18 or higher)

- PostgreSQL database (local or cloud)### For Admins

- pnpm package manager- Complete system overview dashboard

- User management (view, delete users)

## Installation- Job management (view, edit, delete all jobs)

- Application management and reporting

1. Clone the repository and navigate to the backend folder:- System analytics and reports

```bash

cd job-management-backend1## Tech Stack

```

- **Frontend**: Next.js 14, React 19, TypeScript

2. Install dependencies:- **Backend**: Next.js API Routes

```bash- **Database**: PostgreSQL with Neon

pnpm install- **Authentication**: JWT with bcrypt

```- **UI**: Tailwind CSS, Radix UI, shadcn/ui

- **State Management**: Zustand

3. Set up environment variables:- **Forms**: React Hook Form with Zod validation

```bash

cp .env.example .env## Getting Started

```

Edit the `.env` file with your actual values:### Prerequisites

- `DATABASE_URL`: Your PostgreSQL connection string- Node.js 18+ 

- `JWT_SECRET`: A secure secret key for JWT tokens- PostgreSQL database (or Neon account)

- `API_BASE_URL`: Backend URL (default: http://localhost:3001)

- `FRONTEND_URL`: Frontend URL (default: http://localhost:3000)### Installation



4. Set up the database:1. Clone the repository

```bash\`\`\`bash

pnpm run db:setupgit clone <repository-url>

```cd job-management-interface

\`\`\`

## Running the Backend

2. Install dependencies

### Development Mode\`\`\`bash

```bashnpm install

pnpm run dev\`\`\`

```

The backend will run on `http://localhost:3001` by default.3. Set up environment variables

\`\`\`bash

### Production Modecp .env.example .env.local

```bash\`\`\`

pnpm run build

pnpm run startEdit `.env.local` with your database credentials and JWT secret.

```

4. Set up the database

## API Endpoints\`\`\`bash

# Run the database setup scripts

### Authenticationnpm run db:setup

- `POST /api/auth/register` - Register new user\`\`\`

- `POST /api/auth/login` - User login

- `GET /api/auth/profile` - Get user profile (authenticated)5. Start the development server

\`\`\`bash

### Jobsnpm run dev

- `GET /api/jobs` - Get all jobs (with pagination)\`\`\`

- `GET /api/jobs/:id` - Get specific job

- `POST /api/jobs` - Create new job (authenticated, employer/admin)Visit `http://localhost:3000` to see the application.

- `PUT /api/jobs/:id` - Update job (authenticated, owner/admin)

- `DELETE /api/jobs/:id` - Delete job (authenticated, owner/admin)## Database Setup

- `GET /api/jobs/my-jobs` - Get user's created jobs (authenticated)

The application includes SQL scripts to set up the database schema and seed data:

### Applications

- `POST /api/jobs/:id/apply` - Apply to a job (authenticated, candidate)- `scripts/01-create-tables.sql` - Creates all necessary tables and indexes

- `GET /api/jobs/:id/applications` - Get job applications (authenticated, owner/admin)- `scripts/02-seed-data.sql` - Adds sample users, jobs, and applications

- `GET /api/applications` - Get user's applications (authenticated)

- `PUT /api/applications/:id/status` - Update application status (authenticated, employer/admin)### Default Users



### UsersThe seed data includes these test accounts:

- `GET /api/users` - Get all users (authenticated, admin)

- `GET /api/users/:id` - Get specific user (authenticated, admin)**Admin User:**

- Email: admin@jobportal.com

### Admin- Password: admin123

- `GET /api/admin/stats` - Get dashboard statistics (authenticated, admin)- Role: admin

- `GET /api/admin/reports` - Get reports data (authenticated, admin)

- `GET /api/admin/dashboard` - Get dashboard data (authenticated, admin)**Employer Users:**

- Email: hr@techcorp.com

## Database Schema- Password: employer123

- Role: employer

The database includes the following tables:

- `users` - User accounts with roles (candidate, employer, admin)**Candidate Users:**

- `jobs` - Job postings- Email: john@example.com

- `applications` - Job applications linking users to jobs- Password: candidate123

- Role: candidate

## Environment Variables

## API Endpoints

| Variable | Description | Default |

|----------|-------------|---------|### Authentication

| `DATABASE_URL` | PostgreSQL connection string | Required |- `POST /api/auth/register` - User registration

| `JWT_SECRET` | Secret key for JWT tokens | Required |- `POST /api/auth/login` - User login

| `API_BASE_URL` | Backend server URL | http://localhost:3001 |- `GET /api/auth/profile` - Get user profile (protected)

| `FRONTEND_URL` | Frontend application URL | http://localhost:3000 |

### Users

## Development- `GET /api/users` - Get all users (admin only)

- `GET /api/users/:id` - Get user by ID

The backend is built with:- `DELETE /api/users/:id` - Delete user (admin only)

- **Next.js 14** (API routes only)

- **TypeScript** for type safety### Jobs

- **Neon Database** for PostgreSQL- `GET /api/jobs` - Get jobs with filters

- **JWT** for authentication- `POST /api/jobs` - Create job (employer/admin)

- **Zod** for data validation- `GET /api/jobs/:id` - Get job by ID

- **bcryptjs** for password hashing- `PUT /api/jobs/:id` - Update job (owner/admin)

- `DELETE /api/jobs/:id` - Delete job (owner/admin)

## Troubleshooting- `GET /api/jobs/my-jobs` - Get employer's jobs



1. **Database Connection Issues**: Ensure your `DATABASE_URL` is correct and the database is accessible.### Applications

- `POST /api/jobs/:id/apply` - Apply to job (candidate)

2. **CORS Issues**: The backend is configured to accept requests from any origin. In production, update the CORS configuration in `middleware.ts`.- `GET /api/applications` - Get user's applications

- `GET /api/jobs/:id/applications` - Get job applications (employer/admin)

3. **Port Already in Use**: Change the port by setting `PORT` environment variable or modify the dev script.- `PUT /api/applications/:id/status` - Update application status



## Production Deployment### Admin

- `GET /api/admin/dashboard` - Dashboard statistics

1. Set up environment variables on your hosting platform- `GET /api/admin/stats` - Detailed statistics

2. Ensure database is accessible from your deployment environment- `GET /api/admin/reports` - Generate reports

3. Run database setup: `pnpm run db:setup`

4. Build and start: `pnpm run build && pnpm run start`## Security Features



## Support- JWT-based authentication

- Role-based access control (RBAC)

For issues and questions, please check the API responses for detailed error messages. All endpoints return JSON responses with appropriate HTTP status codes.- Password hashing with bcrypt
- SQL injection protection
- CORS configuration
- Input validation and sanitization

## Deployment

The application is ready for deployment on Vercel with Neon PostgreSQL:

1. Push to GitHub
2. Connect to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
