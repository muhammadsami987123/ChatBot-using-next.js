'use client'

import { motion } from 'framer-motion'

interface DateSeparatorProps {
  date: Date
}

export default function DateSeparator({ date }: DateSeparatorProps) {
  // Format the date
  const formatDate = (date: Date) => {
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today'
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday'
    } else {
      return date.toLocaleDateString(undefined, { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    }
  }
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center justify-center my-4"
    >
      <div className="flex-grow h-px bg-gray-200 dark:bg-gray-700 mx-4"></div>
      <div className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-xs text-gray-500 dark:text-gray-400 font-medium">
        {formatDate(date)}
      </div>
      <div className="flex-grow h-px bg-gray-200 dark:bg-gray-700 mx-4"></div>
    </motion.div>
  )
} 