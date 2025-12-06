import { useState } from 'react'
import Card from '../../components/UI/Card'
import Button from '../../components/UI/Button'
import { Send, Search } from 'lucide-react'

// Mock messages
const mockMessages = [
  {
    id: 'msg_1',
    fromId: 'user_2',
    fromName: 'John Client',
    lastMessage: 'Thank you for your application!',
    timestamp: '2024-01-20T10:00:00Z',
    unread: true,
  },
  {
    id: 'msg_2',
    fromId: 'user_2',
    fromName: 'John Client',
    lastMessage: 'Great work on the cleaning job!',
    timestamp: '2024-01-17T14:00:00Z',
    unread: false,
  },
]

const mockChatMessages = [
  {
    id: 'chat_1',
    senderId: 'user_2',
    senderName: 'John Client',
    message: 'Thank you for your application!',
    timestamp: '2024-01-20T10:00:00Z',
  },
  {
    id: 'chat_2',
    senderId: 'user_3',
    senderName: 'You',
    message: 'Thank you! I look forward to working with you.',
    timestamp: '2024-01-20T10:05:00Z',
  },
]

export default function Messages() {
  const [selectedChat, setSelectedChat] = useState(null)
  const [message, setMessage] = useState('')

  const handleSend = () => {
    if (message.trim()) {
      // In real app, send message to backend
      setMessage('')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Messages</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Communicate with clients
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
        {/* Conversations List */}
        <div className="lg:col-span-1 card overflow-hidden flex flex-col">
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                className="input pl-10"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto space-y-2">
            {mockMessages.map((msg) => (
              <div
                key={msg.id}
                onClick={() => setSelectedChat(msg.fromId)}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedChat === msg.fromId
                    ? 'bg-primary-100 dark:bg-primary-900'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {msg.fromName}
                  </p>
                  {msg.unread && (
                    <span className="w-2 h-2 bg-primary-600 rounded-full"></span>
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                  {msg.lastMessage}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  {new Date(msg.timestamp).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Window */}
        <div className="lg:col-span-2 card flex flex-col">
          {selectedChat ? (
            <>
              <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {mockMessages.find(m => m.fromId === selectedChat)?.fromName}
                </h3>
              </div>

              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                {mockChatMessages.map((msg) => {
                  const isMe = msg.senderId !== selectedChat
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          isMe
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                        }`}
                      >
                        <p>{msg.message}</p>
                        <p
                          className={`text-xs mt-1 ${
                            isMe ? 'text-primary-100' : 'text-gray-500'
                          }`}
                        >
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Type a message..."
                  className="input flex-1"
                />
                <Button onClick={handleSend}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-gray-500 dark:text-gray-400">
                Select a conversation to start messaging
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

