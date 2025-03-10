'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiUser, FiClock } from 'react-icons/fi'
import UserProfileView from './UserProfileView'

interface ChatMessageProps {
  message: {
    role: 'user' | 'assistant'
    content: string
    timestamp?: Date
  }
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user'
  const [showProfile, setShowProfile] = useState(false)
  const timestamp = message.timestamp || new Date()
  
  // Format the timestamp
  const formatTime = (date: Date) => {
    const now = new Date()
    const isToday = date.toDateString() === now.toDateString()
    
    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } else {
      return `${date.toLocaleDateString([], { month: 'short', day: 'numeric' })} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    }
  }
  
  const handleAvatarClick = () => {
    if (!isUser) {
      setShowProfile(true)
    }
  }
  
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
      >
        {!isUser && (
          <div className="flex-shrink-0 mr-3">
            <div 
              className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
              onClick={handleAvatarClick}
            >
              <span className="text-white text-xs font-bold">AI</span>
            </div>
          </div>
        )}
        
        <div className="flex flex-col max-w-[80%] md:max-w-[70%]">
          <div 
            className={`chat-bubble px-4 py-3 rounded-2xl shadow-sm ${
              isUser 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
            }`}
          >
            <p className="whitespace-pre-wrap break-words">{message.content}</p>
          </div>
          
          {/* Timestamp */}
          <div 
            className={`flex items-center text-xs mt-1 text-gray-500 ${
              isUser ? 'justify-end mr-1' : 'justify-start ml-1'
            }`}
          >
            <FiClock className="w-3 h-3 mr-1 opacity-70" />
            <span>{formatTime(timestamp)}</span>
          </div>
        </div>
        
        {isUser && <div className="flex-shrink-0 ml-3 w-8"></div>}
      </motion.div>
      
      {/* Profile view modal for AI assistant */}
      <UserProfileView 
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
        userId="gemini-ai"
        username="Gemini AI Assistant"
        avatarUrl={null}
      />
    </>
  )
} 