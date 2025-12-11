import { useMemo, useState } from 'react'
import Card from '../../components/UI/Card'
import Button from '../../components/UI/Button'
import { Send, Search, CircleDot, PhoneCall, Video, MoreHorizontal } from 'lucide-react'

const seedConversations = [
  {
    id: 'conv_1',
    partnerId: 'user_2',
    name: 'John Client',
    lastMessage: 'Thank you for your application!',
    timestamp: '2024-01-20T10:00:00Z',
    unread: true,
    typing: true
  },
  {
    id: 'conv_2',
    partnerId: 'user_4',
    name: 'Ada Agency',
    lastMessage: 'Can you start this weekend?',
    timestamp: '2024-01-18T09:12:00Z',
    unread: false,
    typing: false
  }
]

const seedChats = {
  user_2: [
    { id: 'm1', senderId: 'user_2', senderName: 'John Client', message: 'Thank you for your application!', timestamp: '2024-01-20T10:00:00Z' },
    { id: 'm2', senderId: 'me', senderName: 'You', message: 'Happy to help! Do you have a start date in mind?', timestamp: '2024-01-20T10:05:00Z' }
  ],
  user_4: [
    { id: 'm3', senderId: 'user_4', senderName: 'Ada Agency', message: 'Can you start this weekend?', timestamp: '2024-01-18T09:12:00Z' },
    { id: 'm4', senderId: 'me', senderName: 'You', message: 'Yes, Saturday works for me.', timestamp: '2024-01-18T09:20:00Z' }
  ]
}

export default function Messages() {
  const [conversations, setConversations] = useState(seedConversations)
  const [chats, setChats] = useState(seedChats)
  const [selectedPartnerId, setSelectedPartnerId] = useState(seedConversations[0]?.partnerId ?? null)
  const [search, setSearch] = useState('')
  const [message, setMessage] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  const filtered = useMemo(() => {
    return conversations.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
  }, [search, conversations])

  const activeConversation = filtered.find(c => c.partnerId === selectedPartnerId) || filtered[0]
  const chat = activeConversation ? chats[activeConversation.partnerId] ?? [] : []

  const handleSend = () => {
    if (!message.trim() || !activeConversation) return

    const newMessage = {
      id: `local_${Date.now()}`,
      senderId: 'me',
      senderName: 'You',
      message,
      timestamp: new Date().toISOString()
    }

    setChats((prev) => ({
      ...prev,
      [activeConversation.partnerId]: [...(prev[activeConversation.partnerId] || []), newMessage]
    }))

    setConversations((prev) =>
      prev.map((c) =>
        c.partnerId === activeConversation.partnerId
          ? { ...c, lastMessage: message, timestamp: newMessage.timestamp, unread: false, typing: false }
          : c
      )
    )

    setMessage('')
    setMenuOpen(false)
  }

  const markUnread = () => {
    if (!activeConversation) return
    setConversations((prev) =>
      prev.map((c) =>
        c.partnerId === activeConversation.partnerId ? { ...c, unread: true, typing: false } : c
      )
    )
    setMenuOpen(false)
  }

  const archiveConversation = () => {
    if (!activeConversation) return
    setConversations((prev) => {
      const filteredList = prev.filter((c) => c.partnerId !== activeConversation.partnerId)
      if (filteredList.length === 0) {
        setSelectedPartnerId(null)
      } else if (activeConversation.partnerId === selectedPartnerId) {
        setSelectedPartnerId(filteredList[0].partnerId)
      }
      return filteredList
    })
    setChats((prev) => {
      const next = { ...prev }
      delete next[activeConversation.partnerId]
      return next
    })
    setMenuOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Inbox</p>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Messages</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Chat with clients in real-time.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
        {/* Conversations List */}
        <Card className="lg:col-span-1 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                type="text"
                placeholder="Search conversations..."
                className="input pl-10"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversations.map((conv) => {
              const active = activeConversation?.partnerId === conv.partnerId
              return (
                <button
                  key={conv.id}
                  onClick={() => {
                    setSelectedPartnerId(conv.partnerId)
                    setMenuOpen(false)
                  }}
                  className={`w-full text-left px-4 py-3 flex items-start gap-3 transition-colors ${
                    active ? 'bg-primary-50 dark:bg-primary-900/20' : 'hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 text-white font-semibold flex items-center justify-center">
                    {conv.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold text-gray-900 dark:text-white truncate">{conv.name}</p>
                      <span className="text-xs text-slate-500">{new Date(conv.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{conv.lastMessage}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {conv.typing && <span className="text-xs text-emerald-600">Typing…</span>}
                      {conv.unread && <span className="h-2 w-2 rounded-full bg-primary-600" />}
                    </div>
                  </div>
                </button>
              )
            })}
            {conversations.length === 0 && (
              <div className="p-6 text-center text-sm text-gray-500 dark:text-gray-400">
                No conversations found
              </div>
            )}
          </div>
        </Card>

        {/* Chat Window */}
        <Card className="lg:col-span-2 flex flex-col">
          {activeConversation ? (
            <>
              <div className="flex items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 text-white font-semibold flex items-center justify-center">
                    {activeConversation.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{activeConversation.name}</p>
                    <p className="text-xs text-emerald-600">Online</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 relative">
                  <Button variant="outline" className="px-3 py-2">
                    <PhoneCall className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" className="px-3 py-2">
                    <Video className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    className="px-3 py-2"
                    onClick={() => setMenuOpen((v) => !v)}
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                  {menuOpen && (
                    <div className="absolute right-0 top-12 w-48 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg py-1 z-10">
                      <button
                        onClick={markUnread}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800"
                      >
                        Mark as unread
                      </button>
                      <button
                        onClick={archiveConversation}
                        className="w-full text-left px-3 py-2 text-sm text-rose-600 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                      >
                        Archive conversation
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto space-y-4 px-4 py-4">
                {chat.map((msg) => {
                  const isMe = msg.senderId === 'me'
                  return (
                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-xl px-4 py-3 rounded-2xl shadow-sm border ${
                          isMe
                            ? 'bg-primary-600 text-white border-primary-500'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100'
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{msg.message}</p>
                        <div className={`flex items-center gap-1 text-[11px] mt-1 ${isMe ? 'text-primary-100' : 'text-slate-500'}`}>
                          <CircleDot className="w-3 h-3" />
                          <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800 px-4 py-3 flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Type a message..."
                  className="input flex-1"
                />
                <Button onClick={handleSend} className="inline-flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  Send
                </Button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
              Select a conversation to start messaging
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

