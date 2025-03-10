'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiMenu, FiX, FiMessageSquare, FiSettings, FiHelpCircle, FiUser, FiMoon, FiSun } from 'react-icons/fi'
import { useTheme } from '../context/ThemeContext'

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const { theme, toggleTheme } = useTheme()
  
  // Check if we're on mobile on initial render and when window resizes
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    // Check initially
    checkIfMobile()
    
    // Add event listener for resize
    window.addEventListener('resize', checkIfMobile)
    
    // Clean up
    return () => window.removeEventListener('resize', checkIfMobile)
  }, [])
  
  const toggleSidebar = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsOpen(!isOpen)
  }
  
  return (
    <>
      {/* Mobile menu button */}
      <button 
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-2 rounded-full bg-white dark:bg-gray-800 shadow-md md:hidden"
        aria-label="Toggle menu"
      >
        {isOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
      </button>
      
      {/* Overlay for mobile */}
      {isOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <motion.div
        initial={{ x: isMobile ? -300 : 0 }}
        animate={{ x: (isMobile && !isOpen) ? -300 : 0 }}
        transition={{ duration: 0.3 }}
        className="sidebar-container fixed md:relative top-0 left-0 h-full w-16 bg-white dark:bg-gray-800 shadow-lg z-40 flex flex-col items-center py-4 border-r border-gray-200 dark:border-gray-700"
      >
        {/* Logo */}
        <div className="mb-8 p-2 bg-blue-500 rounded-full">
          <FiMessageSquare className="w-6 h-6 text-white" />
        </div>
        
        {/* Navigation Icons */}
        <nav className="flex-1 flex flex-col items-center space-y-6">
          <a 
            href="/" 
            className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
            title="Chat"
          >
            <FiMessageSquare className="w-6 h-6" />
          </a>
          <button 
            className="p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
            title="Settings"
          >
            <FiSettings className="w-6 h-6" />
          </button>
          <button 
            className="p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
            title="Help"
          >
            <FiHelpCircle className="w-6 h-6" />
          </button>
        </nav>
        
        {/* User and Theme */}
        <div className="mt-auto flex flex-col items-center space-y-4">
          <button 
            className="p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
            title="Profile"
          >
            <FiUser className="w-6 h-6" />
          </button>
          
          <button 
            onClick={toggleTheme}
            className="p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          >
            {theme === 'light' ? (
              <FiMoon className="w-6 h-6" />
            ) : (
              <FiSun className="w-6 h-6" />
            )}
          </button>
        </div>
      </motion.div>
    </>
  )
} 