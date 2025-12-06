import { useState } from 'react'
import { mockUsers } from '../../data/mockUsers'
import Card from '../../components/UI/Card'
import Button from '../../components/UI/Button'
import { CheckCircle, XCircle, Ban } from 'lucide-react'

export default function ManageUsers() {
  const [users, setUsers] = useState(mockUsers)
  const [filter, setFilter] = useState('')

  const filteredUsers = users.filter(
    u =>
      u.name.toLowerCase().includes(filter.toLowerCase()) ||
      u.email.toLowerCase().includes(filter.toLowerCase()) ||
      (u.role && u.role.toLowerCase().includes(filter.toLowerCase()))
  )

  const handleVerify = (userId) => {
    setUsers(users.map(u => (u.id === userId ? { ...u, verified: true } : u)))
  }

  const handleSuspend = (userId) => {
    setUsers(users.map(u => (u.id === userId ? { ...u, suspended: true } : u)))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Manage Users</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          View, verify, and manage user accounts
        </p>
      </div>

      <Card>
        <input
          type="text"
          placeholder="Search users..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="input mb-4"
        />
      </Card>

      <div className="space-y-4">
        {filteredUsers.map((user) => (
          <Card key={user.id} hover>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{user.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                  <div className="flex gap-2 mt-1">
                    <span className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 rounded">
                      {user.role}
                    </span>
                    {user.verified ? (
                      <span className="px-2 py-0.5 text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded">
                        Verified
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 rounded">
                        Unverified
                      </span>
                    )}
                    {user.suspended && (
                      <span className="px-2 py-0.5 text-xs bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded">
                        Suspended
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                {!user.verified && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleVerify(user.id)}
                    className="flex items-center gap-1"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Verify
                  </Button>
                )}
                {!user.suspended && (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleSuspend(user.id)}
                    className="flex items-center gap-1"
                  >
                    <Ban className="w-4 h-4" />
                    Suspend
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

