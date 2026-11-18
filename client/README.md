# Alumni Connect

A platform where college students connect with alumni for referrals and
mentorship video calls.

## Features
- Student and alumni registration with JWT login
- Alumni verification before login
- Alumni directory with search by company and skill
- Referral requests with status tracking (requested, accepted, referred, rejected)
- Alumni slot creation and student slot booking (double booking prevented)
- Video calls using Jitsi Meet

## Tech Stack
- Frontend: React (Vite), React Router, Axios
- Backend: Node.js, Express
- Database: MySQL
- Auth: JWT, bcrypt

## Setup
1. Create the database: run `database.sql` in MySQL Workbench
2. Backend:
   cd server
   npm install
   copy .env.example to .env and fill in your MySQL password
   npm run dev
3. Frontend:
   cd client
   npm install
   npm run dev
4. Open http://localhost:5173

## Security
- Passwords hashed with bcrypt
- Role-based access control (student / alumni)
- Parameterized SQL queries
- Ownership checks on referral updates
- Atomic slot booking to avoid double booking

## Future Improvements
- Admin dashboard for alumni approval
- Real-time chat (Socket.io)
- Email notifications
- Interview experience library
- Mock interview feedback