'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { FiList } from 'react-icons/fi'
import Chat from './components/Chat'
import Sidebar from './components/Sidebar'
import ChatHistory from './components/ChatHistory'
import MobileChatHistory from './components/MobileChatHistory'

// Define the Message type correctly
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

// Create a wrapper component for the search params functionality
function ChatWrapper() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [currentChatId, setCurrentChatId] = useState<string>('new')
  const [isMobileHistoryOpen, setIsMobileHistoryOpen] = useState(false)
  const [updateTrigger, setUpdateTrigger] = useState<number>(0)
  
  // Get chat ID from URL on initial load
  useEffect(() => {
    const chatId = searchParams.get('chat')
    if (chatId) {
      setCurrentChatId(chatId)
    }
  }, [searchParams])
  
  // Handle selecting a chat from history
  const handleSelectChat = (chatId: string) => {
    router.push(`/?chat=${chatId}`)
    setCurrentChatId(chatId)
  }
  
  // Handle creating a new chat
  const handleNewChat = () => {
    router.push('/')
    setCurrentChatId('new')
  }
  
  // Handle deleting a chat
  const handleDeleteChat = (chatId: string) => {
    try {
      const savedChats = localStorage.getItem('chatHistory')
      if (savedChats) {
        const chats: ChatSession[] = JSON.parse(savedChats)
        const updatedChats = chats.filter((chat) => chat.id !== chatId)
        
        localStorage.setItem('chatHistory', JSON.stringify(updatedChats))
        
        // If we're deleting the current chat, switch to a new chat
        if (currentChatId === chatId) {
          router.push('/')
          setCurrentChatId('new')
        }
        
        // Trigger re-render of chat history
        handleUpdateChatList()
      }
    } catch (error) {
      console.error('Error deleting chat:', error)
    }
  }
  
  // Trigger update of chat list
  const handleUpdateChatList = () => {
    setUpdateTrigger(prev => prev + 1)
  }
  
  return (
    <main className="flex h-screen overflow-hidden">
      <div className="w-16 md:w-16 flex-shrink-0">
        <Sidebar />
      </div>
      
      <div className="hidden md:block w-64 flex-shrink-0 border-r border-gray-200 dark:border-gray-700">
        <ChatHistory 
          currentChatId={currentChatId}
          onSelectChat={handleSelectChat}
          onNewChat={handleNewChat}
          onDeleteChat={handleDeleteChat}
          key={updateTrigger} // Force re-render when chat list changes
        />
      </div>
      
      <div className="flex-1 relative">
        {/* Mobile history button */}
        <button
          className="md:hidden fixed top-4 right-4 z-10 p-2 bg-white dark:bg-gray-800 rounded-full shadow-md"
          onClick={() => setIsMobileHistoryOpen(true)}
        >
          <FiList className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>
        
        <Chat 
          currentChatId={currentChatId}
          onUpdateChatList={handleUpdateChatList}
          key={currentChatId} // Force re-render when chat changes
        />
        
        {/* Mobile chat history */}
        <MobileChatHistory
          isOpen={isMobileHistoryOpen}
          onClose={() => setIsMobileHistoryOpen(false)}
          currentChatId={currentChatId}
          onSelectChat={handleSelectChat}
          onNewChat={handleNewChat}
          onDeleteChat={handleDeleteChat}
        />
      </div>
    </main>
  )
}

// Main page component with Suspense boundary
export default function Home() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    }>
      <ChatWrapper />
    </Suspense>
  )
} 