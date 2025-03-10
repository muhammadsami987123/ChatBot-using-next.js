'use client'

import { useState, useRef, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import ChatMessage from './ChatMessage'
import ChatInput from './ChatInput'
import TypingIndicator from './TypingIndicator'
import DateSeparator from './DateSeparator'

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

interface ChatProps {
  currentChatId: string
  onUpdateChatList: () => void
}

export default function Chat({ currentChatId, onUpdateChatList }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  // Load messages for the current chat
  useEffect(() => {
    const loadCurrentChat = () => {
      try {
        // If this is a new chat, initialize with welcome message
        if (currentChatId === 'new') {
          setMessages([{
            role: 'assistant',
            content: 'Hello! I\'m your AI assistant powered by Google Gemini. How can I help you today?',
            timestamp: new Date()
          }])
          return
        }
        
        // Otherwise, load the chat from localStorage
        const savedChats = localStorage.getItem('chatHistory')
        if (savedChats) {
          const parsedChats: ChatSession[] = JSON.parse(savedChats, (key, value) => {
            if (key === 'timestamp' || key === 'lastUpdated') {
              return new Date(value)
            }
            return value
          })
          
          const currentChat = parsedChats.find(chat => chat.id === currentChatId)
          if (currentChat) {
            setMessages(currentChat.messages)
          } else {
            // Fallback to welcome message if chat not found
            setMessages([{
              role: 'assistant',
              content: 'Hello! I\'m your AI assistant powered by Google Gemini. How can I help you today?',
              timestamp: new Date()
            }])
          }
        }
      } catch (error) {
        console.error('Error loading chat:', error)
        setError('Failed to load chat history')
      }
    }
    
    loadCurrentChat()
  }, [currentChatId])
  
  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom()
  }, [messages])
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }
  
  // Save the current chat to localStorage
  const saveChat = (updatedMessages: Message[]) => {
    try {
      // Get existing chats
      const savedChats = localStorage.getItem('chatHistory')
      let chats: ChatSession[] = []
      
      if (savedChats) {
        chats = JSON.parse(savedChats, (key, value) => {
          if (key === 'timestamp' || key === 'lastUpdated') {
            return new Date(value)
          }
          return value
        })
      }
      
      // Generate a title from the first user message
      const firstUserMessage = updatedMessages.find(msg => msg.role === 'user')
      const title = firstUserMessage 
        ? firstUserMessage.content.substring(0, 30) + (firstUserMessage.content.length > 30 ? '...' : '')
        : 'New Conversation'
      
      // Get the last message for preview
      const lastMessage = updatedMessages[updatedMessages.length - 1]
      const preview = lastMessage.content.substring(0, 60) + (lastMessage.content.length > 60 ? '...' : '')
      
      // If this is a new chat, create a new chat session
      if (currentChatId === 'new') {
        const newChatId = uuidv4()
        const newChat: ChatSession = {
          id: newChatId,
          title,
          messages: updatedMessages,
          lastUpdated: new Date(),
          preview
        }
        
        chats.push(newChat)
        localStorage.setItem('chatHistory', JSON.stringify(chats))
        
        // Update the URL to the new chat ID
        window.history.pushState({}, '', `/?chat=${newChatId}`)
        onUpdateChatList()
        return newChatId
      } else {
        // Update existing chat
        const existingChatIndex = chats.findIndex(chat => chat.id === currentChatId)
        
        if (existingChatIndex !== -1) {
          chats[existingChatIndex] = {
            ...chats[existingChatIndex],
            messages: updatedMessages,
            lastUpdated: new Date(),
            preview
          }
        } else {
          // If chat doesn't exist (shouldn't happen), create it
          chats.push({
            id: currentChatId,
            title,
            messages: updatedMessages,
            lastUpdated: new Date(),
            preview
          })
        }
        
        localStorage.setItem('chatHistory', JSON.stringify(chats))
        onUpdateChatList()
        return currentChatId
      }
    } catch (error) {
      console.error('Error saving chat:', error)
      return currentChatId
    }
  }
  
  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;
    
    // Reset error state
    setError(null)
    
    // Create current timestamp
    const currentTime = new Date()
    
    // Add user message to chat
    const userMessage: Message = { 
      role: 'user', 
      content,
      timestamp: currentTime
    }
    
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    
    // Save chat after adding user message
    // const chatId = saveChat(updatedMessages)
    
    // Set loading state
    setIsLoading(true)
    
    try {
      // Send message to API
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: updatedMessages,
        }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response')
      }
      
      // Add assistant response to chat
      const responseTime = new Date()
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.content || 'Sorry, I couldn\'t generate a response.',
        timestamp: responseTime
      }
      
      const finalMessages = [...updatedMessages, assistantMessage]
      setMessages(finalMessages)
      
      // Save chat after adding assistant response
      saveChat(finalMessages)
    } catch (error) {
      console.error('Error sending message:', error)
      
      // Set error state
      setError(error instanceof Error ? error.message : 'An unknown error occurred')
      
      // Add error message
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again later.',
        timestamp: new Date()
      }
      
      const finalMessages = [...updatedMessages, errorMessage]
      setMessages(finalMessages)
      
      // Save chat with error message
      saveChat(finalMessages)
    } finally {
      setIsLoading(false)
    }
  }
  
  // Group messages by date
  const groupMessagesByDate = () => {
    const groups: { date: Date; messages: Message[] }[] = []
    
    messages.forEach(message => {
      const messageDate = new Date(message.timestamp)
      messageDate.setHours(0, 0, 0, 0)
      
      const existingGroup = groups.find(group => 
        group.date.getTime() === messageDate.getTime()
      )
      
      if (existingGroup) {
        existingGroup.messages.push(message)
      } else {
        groups.push({
          date: messageDate,
          messages: [message]
        })
      }
    })
    
    return groups
  }
  
  const messageGroups = groupMessagesByDate()
  
  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Chat header - only visible on mobile */}
      <header className="p-4 border-b border-gray-200 dark:border-gray-800 md:hidden">
        <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200 ml-10">Gemini AI Chatbot</h1>
      </header>
      
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="max-w-3xl mx-auto w-full">
          {messageGroups.map((group, groupIndex) => (
            <div key={group.date.getTime()}>
              <DateSeparator date={group.date} />
              {group.messages.map((message, messageIndex) => (
                <ChatMessage key={`${groupIndex}-${messageIndex}`} message={message} />
              ))}
            </div>
          ))}
          
          {isLoading && <TypingIndicator />}
          
          {error && (
            <div className="text-center p-2 my-4 text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <p>Error: {error}</p>
              <p className="text-sm mt-1">Please check your API key configuration.</p>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Chat Input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-3xl mx-auto">
          <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
          <div className="text-xs text-center mt-2 text-gray-500 dark:text-gray-400 md:hidden">
            Powered by Google Gemini AI
          </div>
        </div>
      </div>
    </div>
  )
} 