import { useAuth } from '../hooks/useLocalAuth'
import { mockNotifications } from '../data/mockNotifications'
import Card from '../components/UI/Card'
import NotificationItem from '../components/Shared/NotificationItem'
import Button from '../components/UI/Button'

export default function Notifications() {
  const { user } = useAuth()
  const notifications = mockNotifications
    .filter(n => n.userId === user?.id)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  const unreadCount = notifications.filter(n => !n.isRead).length

  const handleMarkAllAsRead = () => {
    // In real app, mark all as read
    console.log('Mark all as read')
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Notifications</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" onClick={handleMarkAllAsRead}>
            Mark All as Read
          </Button>
        )}
      </div>

      <Card className="p-0 overflow-hidden">
        {notifications.length > 0 ? (
          notifications.map((notif) => (
            <NotificationItem key={notif.id} notification={notif} />
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No notifications</p>
          </div>
        )}
      </Card>
    </div>
  )
}

