'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { FiList } from 'react-icons/fi'
import Chat from './components/Chat'
import Sidebar from './components/Sidebar'
import ChatHistory from './components/ChatHistory'
import MobileChatHistory from './components/MobileChatHistory'

export default function Home() {
  const searchParams = useSearchParams()
  const [currentChatId, setCurrentChatId] = useState<string>('new')
  const [updateTrigger, setUpdateTrigger] = useState<number>(0)
  const [isMobileHistoryOpen, setIsMobileHistoryOpen] = useState(false)
  
  // Get chat ID from URL on initial load
  useEffect(() => {
    const chatId = searchParams.get('chat')
    if (chatId) {
      setCurrentChatId(chatId)
    }
  }, [searchParams])
  
  // Handle selecting a chat from history
  const handleSelectChat = (chatId: string) => {
    setCurrentChatId(chatId)
    window.history.pushState({}, '', `/?chat=${chatId}`)
  }
  
  // Handle creating a new chat
  const handleNewChat = () => {
    setCurrentChatId('new')
    window.history.pushState({}, '', '/')
  }
  
  // Handle deleting a chat
  const handleDeleteChat = (chatId: string) => {
    try {
      const savedChats = localStorage.getItem('chatHistory')
      if (savedChats) {
        const chats = JSON.parse(savedChats)
        const updatedChats = chats.filter((chat: any) => chat.id !== chatId)
        localStorage.setItem('chatHistory', JSON.stringify(updatedChats))
        
        // If we're deleting the current chat, switch to a new chat
        if (chatId === currentChatId) {
          handleNewChat()
        }
        
        // Trigger update of chat list
        setUpdateTrigger(prev => prev + 1)
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
      <Sidebar />
      <div className="hidden md:block w-64">
        <ChatHistory 
          currentChatId={currentChatId}
          onSelectChat={handleSelectChat}
          onNewChat={handleNewChat}
          onDeleteChat={handleDeleteChat}
          key={updateTrigger} // Force re-render when chat list changes
        />
      </div>
      <div className="flex-1 md:ml-64 w-full relative">
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