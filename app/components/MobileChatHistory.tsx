'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiPlus, FiSearch, FiTrash2, FiMessageSquare, FiClock, FiX } from 'react-icons/fi'

type Message = {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

type ChatSession = {
  id: string
  title: string
  messages: Message[]
  lastUpdated: Date
  preview: string
}

interface MobileChatHistoryProps {
  isOpen: boolean
  onClose: () => void
  currentChatId: string
  onSelectChat: (chatId: string) => void
  onNewChat: () => void
  onDeleteChat: (chatId: string) => void
}

export default function MobileChatHistory({ 
  isOpen,
  onClose,
  currentChatId, 
  onSelectChat, 
  onNewChat,
  onDeleteChat
}: MobileChatHistoryProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([])
  
  // Load chat history from localStorage on component mount
  useEffect(() => {
    const loadChatHistory = () => {
      try {
        const savedChats = localStorage.getItem('chatHistory')
        if (savedChats) {
          // Parse the JSON and convert date strings back to Date objects
          const parsedChats: ChatSession[] = JSON.parse(savedChats, (key, value) => {
            // Convert date strings back to Date objects
            if (key === 'timestamp' || key === 'lastUpdated') {
              return new Date(value)
            }
            return value
          })
          
          // Sort by last updated (most recent first)
          const sortedChats = parsedChats.sort((a, b) => 
            new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
          )
          
          setChatSessions(sortedChats)
        }
      } catch (error) {
        console.error('Error loading chat history:', error)
      }
    }
    
    if (isOpen) {
      loadChatHistory()
    }
  }, [isOpen])
  
  // Filter chats based on search query
  const filteredChats = chatSessions.filter(chat => 
    chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.preview.toLowerCase().includes(searchQuery.toLowerCase())
  )
  
  // Format the date for display
  const formatDate = (date: Date) => {
    const now = new Date()
    const yesterday = new Date(now)
    yesterday.setDate(yesterday.getDate() - 1)
    
    if (date.toDateString() === now.toDateString()) {
      return 'Today'
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday'
    } else {
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    }
  }
  
  const handleSelectAndClose = (chatId: string) => {
    onSelectChat(chatId)
    onClose()
  }
  
  const handleNewChatAndClose = () => {
    onNewChat()
    onClose()
  }
  
  if (!isOpen) return null
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-800 rounded-t-xl max-h-[80vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Chat History</h2>
            <button 
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={onClose}
            >
              <FiX className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
          
          {/* Search and new chat */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="relative mb-3">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations"
                className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-gray-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <button 
              className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
              onClick={handleNewChatAndClose}
            >
              <FiPlus className="w-5 h-5" />
              <span>New Chat</span>
            </button>
          </div>
          
          {/* Chat list */}
          <div className="overflow-y-auto" style={{ maxHeight: 'calc(80vh - 180px)' }}>
            {filteredChats.length === 0 ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                {searchQuery ? 'No matching conversations found' : 'No conversations yet'}
              </div>
            ) : (
              filteredChats.map(chat => (
                <motion.div
                  key={chat.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors ${
                    currentChatId === chat.id ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500' : ''
                  }`}
                  onClick={() => handleSelectAndClose(chat.id)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <FiMessageSquare className="w-4 h-4 text-blue-500 mr-2" />
                      <h3 className="font-medium text-gray-800 dark:text-gray-200 text-sm truncate max-w-[150px]">
                        {chat.title}
                      </h3>
                    </div>
                    
                    <div className="flex items-center">
                      <span className="text-xs text-gray-500 dark:text-gray-400 mr-2">
                        {formatDate(new Date(chat.lastUpdated))}
                      </span>
                      
                      <button 
                        className="p-1 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteChat(chat.id);
                        }}
                      >
                        <FiTrash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                    {chat.preview}
                  </p>
                  
                  <div className="flex items-center mt-1 text-xs text-gray-400 dark:text-gray-500">
                    <FiClock className="w-3 h-3 mr-1" />
                    <span>{chat.messages.length} messages</span>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
} 