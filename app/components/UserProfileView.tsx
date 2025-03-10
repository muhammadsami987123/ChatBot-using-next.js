'use client'
import Image from 'next/image'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiUser, FiMessageSquare } from 'react-icons/fi'

interface UserProfileViewProps {
  isOpen: boolean
  onClose: () => void
  userId: string
  username: string
  avatarUrl: string | null
}

export default function UserProfileView({
  isOpen,
  onClose,
  userId,
  username,
  avatarUrl
}: UserProfileViewProps) {
  const [isLoading, setIsLoading] = useState(false)
  
  if (!isOpen) return null
  
  const handleStartChat = () => {
    setIsLoading(true)
    
    // In a real app, you would start a chat with this user
    // For this demo, we'll just simulate a delay
    setTimeout(() => {
      setIsLoading(false)
      onClose()
      // Navigate to chat or open chat window
    }, 1000)
  }
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">User Profile</h2>
              <button 
                onClick={onClose} 
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex flex-col items-center mb-6">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-md mb-4">
                {avatarUrl ? (
                  <Image src={avatarUrl} alt={username} className="w-full h-full object-cover" />
                ) : (
                  <FiUser className="w-10 h-10 text-white" />
                )}
              </div>
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">{username}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">User ID: {userId}</p>
            </div>
            
            <div className="space-y-4">
              <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <p className="text-sm text-gray-800 dark:text-gray-200">
                  This is a demo user profile view. In a real application, you would see more details about the user here.
                </p>
              </div>
              
              <button 
                className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center justify-center"
                onClick={handleStartChat}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading...
                  </span>
                ) : (
                  <>
                    <FiMessageSquare className="mr-2" />
                    Start Chat
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 