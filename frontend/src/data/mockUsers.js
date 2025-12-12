export const mockUsers = [
  // 1. ADMIN
  {
    id: 'user_admin',
    name: 'Admin User',
    email: 'admin@mail.com',
    password: 'password',
    role: 'admin',
    status: 'active',
    verified: true
  },
  // 2. MARIA (The Verified Student) - Original credentials restored
  {
    id: 'user_3',
    name: 'Maria Student',
    email: 'student@quickgig.test',
    password: 'student123',
    role: 'student',
    schoolId: 'S-2024-001',
    verified: true,
    phone: '+63 912 345 6791',
    skills: ['Cleaning', 'Household', 'Tutoring'],
    experience: '2 years of general work experience',
    availability: 'Part-time',
    totalEarnings: 0,
    rating: 0,
    totalRatings: 0,
    createdAt: '2024-01-03T00:00:00Z',
  },
  // 3. PEPITOO (The Client)
  {
    id: 'user_pepitoo',
    name: 'Pepitoo',
    email: 'pepitoo@mail.com',
    password: 'password',
    role: 'client',
    status: 'active',
    verified: true
  }
]
