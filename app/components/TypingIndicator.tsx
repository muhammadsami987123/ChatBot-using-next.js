'use client'

import { motion } from 'framer-motion'
import { FiClock } from 'react-icons/fi'

export default function TypingIndicator() {
  // Format the current time
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
  
  return (
    <div className="flex justify-start mb-4">
      <div className="flex-shrink-0 mr-3">
        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center overflow-hidden">
          <span className="text-white text-xs font-bold">AI</span>
        </div>
      </div>
      
      <div className="flex flex-col max-w-[80%] md:max-w-[70%]">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-100 dark:bg-gray-700 px-4 py-3 rounded-2xl text-gray-800 dark:text-gray-200 shadow-sm"
        >
          <div className="typing-indicator flex space-x-1">
            <span className="w-2 h-2 rounded-full bg-gray-500 dark:bg-gray-400"></span>
            <span className="w-2 h-2 rounded-full bg-gray-500 dark:bg-gray-400"></span>
            <span className="w-2 h-2 rounded-full bg-gray-500 dark:bg-gray-400"></span>
          </div>
        </motion.div>
        
        {/* Timestamp */}
        <div className="flex items-center text-xs mt-1 text-gray-500 justify-start ml-1">
          <FiClock className="w-3 h-3 mr-1 opacity-70" />
          <span>{formatTime(new Date())}</span>
        </div>
      </div>
    </div>
  )
} 