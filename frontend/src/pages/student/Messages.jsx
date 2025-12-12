import { useState, useEffect, useMemo } from 'react'
import Card from '../../components/UI/Card'
import Button from '../../components/UI/Button'
import { Send, Search, CircleDot, PhoneCall, Video, MoreHorizontal, MessageSquare } from 'lucide-react'
import { useAuth } from '../../hooks/useLocalAuth'
import { getConversationsByUser, getMessagesByConversation, saveMessage } from '../../utils/localStorage'

export default function Messages() {
  const { user } = useAuth()
  const [conversations, setConversations] = useState([])
  const [allMessages, setAllMessages] = useState({})
  const [selectedConversationId, setSelectedConversationId] = useState(null)
  const [search, setSearch] = useState('')
  const [message, setMessage] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  // Load conversations from localStorage
  useEffect(() => {
    const loadData = () => {
      if (user?.id) {
        const userConversations = getConversationsByUser(user.id)
        setConversations(userConversations)

        // Load messages for each conversation
        const messagesMap = {}
        userConversations.forEach(conv => {
          messagesMap[conv.id] = getMessagesByConversation(conv.id)
        })
        setAllMessages(messagesMap)

        // Select first conversation if none selected
        if (!selectedConversationId && userConversations.length > 0) {
          setSelectedConversationId(userConversations[0].id)
        }
      }
    }

    loadData()

    window.addEventListener('storage', loadData)
    const interval = setInterval(loadData, 2000)

    return () => {
      window.removeEventListener('storage', loadData)
      clearInterval(interval)
    }
  }, [user?.id, selectedConversationId])

  const filtered = useMemo(() => {
    return conversations.filter(c => {
      const partnerName = getPartnerName(c)
      return partnerName.toLowerCase().includes(search.toLowerCase())
    })
  }, [search, conversations])

  // Get the partner's name (the other participant)
  const getPartnerName = (conv) => {
    if (!conv.participantNames) return 'Unknown'
    const partnerId = conv.participants.find(p => p !== user?.id)
    return conv.participantNames[partnerId] || 'Unknown'
  }

  const activeConversation = filtered.find(c => c.id === selectedConversationId) || filtered[0]
  const chat = activeConversation ? allMessages[activeConversation.id] || [] : []

  const handleSend = () => {
    if (!message.trim() || !activeConversation) return

    const newMessage = {
      conversationId: activeConversation.id,
      senderId: user?.id,
      senderName: user?.name || 'You',
      content: message
    }

    const result = saveMessage(newMessage)
    if (result.success) {
      setMessage('')
      setMenuOpen(false)
    }
  }

  const markUnread = () => {
    setMenuOpen(false)
  }

  const archiveConversation = () => {
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
            {filtered.length > 0 ? (
              filtered.map((conv) => {
                const active = activeConversation?.id === conv.id
                const partnerName = getPartnerName(conv)
                return (
                  <button
                    key={conv.id}
                    onClick={() => {
                      setSelectedConversationId(conv.id)
                      setMenuOpen(false)
                    }}
                    className={`w-full text-left px-4 py-3 flex items-start gap-3 transition-colors ${active ? 'bg-primary-50 dark:bg-primary-900/20' : 'hover:bg-slate-50 dark:hover:bg-slate-800/60'
                      }`}
                  >
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 text-white font-semibold flex items-center justify-center">
                      {partnerName.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-semibold text-gray-900 dark:text-white truncate">{partnerName}</p>
                        <span className="text-xs text-slate-500">{new Date(conv.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="text-xs text-primary-600 truncate">{conv.gigTitle}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{conv.lastMessage}</p>
                    </div>
                  </button>
                )
              })
            ) : (
              <div className="p-8 text-center">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                <p className="text-gray-500 dark:text-gray-400 font-medium">No conversations yet</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                  When you get hired for a gig, you'll be able to chat with the client here.
                </p>
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
                    {getPartnerName(activeConversation).slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{getPartnerName(activeConversation)}</p>
                    <p className="text-xs text-primary-600">{activeConversation.gigTitle}</p>
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
                {chat.length > 0 ? (
                  chat.map((msg) => {
                    const isMe = msg.senderId === user?.id
                    return (
                      <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div
                          className={`max-w-xl px-4 py-3 rounded-2xl shadow-sm border ${isMe
                              ? 'bg-primary-600 text-white border-primary-500'
                              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100'
                            }`}
                        >
                          <p className="text-sm leading-relaxed">{msg.content}</p>
                          <div className={`flex items-center gap-1 text-[11px] mt-1 ${isMe ? 'text-primary-100' : 'text-slate-500'}`}>
                            <CircleDot className="w-3 h-3" />
                            <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400 py-12">
                    <div className="text-center">
                      <MessageSquare className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                      <p>No messages yet. Start the conversation!</p>
                    </div>
                  </div>
                )}
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
              <div className="text-center">
                <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-200 dark:text-gray-700" />
                <p className="text-lg font-medium">No conversations yet</p>
                <p className="text-sm mt-1">Get hired for a gig to start messaging!</p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
