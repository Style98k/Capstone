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

  // 2. STUDENT (Maria)
  {
    id: 'user_student',
    name: 'Maria Student',
    email: 'student@mail.com',
    password: 'password',
    role: 'student',
    status: 'active',
    verified: 'unverified',
    phoneVerified: 'false'
  },

  // 3. CLIENT (Pepito)
  {
    id: 'user_client',
    name: 'Pepito',
    email: 'client@mail.com',
    password: 'password',
    role: 'client',
    status: 'active',
    verified: true
  }
]
