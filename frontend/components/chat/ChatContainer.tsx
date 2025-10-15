"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { useChat } from "../../context/ChatContext"
import ChatMessage from "./ChatMessage"
import ChatInput from "./ChatInput"
import AgentActionStatus from "./AgentActionStatus"
import { 
  Sparkles, 
  Brain, 
  Zap, 
  Wifi, 
  WifiOff, 
  Bot, 
  User,
  Send,
  MoreVertical,
  Minimize2,
  Maximize2
} from "lucide-react"

const ChatContainer: React.FC = () => {
  const { currentChat, agentStatus, currentAction, currentScreenshots, isConnected, sendMessage, createNewChat } =
    useChat()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [isMinimized, setIsMinimized] = useState(false)

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [currentChat?.messages])

  const getStatusColor = () => {
    switch (agentStatus) {
      case 'thinking': return 'text-yellow-500'
      case 'executing': return 'text-blue-500'
      case 'done': return 'text-green-500'
      case 'error': return 'text-red-500'
      default: return 'text-gray-500'
    }
  }

  const getStatusText = () => {
    switch (agentStatus) {
      case 'thinking': return 'Thinking...'
      case 'executing': return 'Executing...'
      case 'done': return 'Completed'
      case 'error': return 'Error'
      default: return 'Ready'
    }
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23e0e7ff' fill-opacity='0.3'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      
      {/* Header */}
      <div className="relative z-10 bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
              {isConnected && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
              )}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {currentChat?.title || "AI Analysis"}
              </h2>
              <div className="flex items-center gap-2">
                <div className={`flex items-center gap-1 ${getStatusColor()}`}>
                  {isConnected ? <Wifi size={14} /> : <WifiOff size={14} />}
                  <span className="text-xs font-medium">
                    {isConnected ? getStatusText() : 'Disconnected'}
                  </span>
                </div>
                {agentStatus === 'thinking' && (
                  <div className="flex items-center gap-1 text-yellow-600">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                    <span className="text-xs">Processing...</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-white/50 transition-all duration-200"
            >
              {isMinimized ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-white/50 transition-all duration-200">
              <MoreVertical size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Messages area */}
      {!isMinimized && (
        <div className="flex-1 overflow-y-auto relative z-10">
          <div className="p-6 space-y-6">
            {currentChat?.messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
                <div className="w-24 h-24 mb-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl flex items-center justify-center shadow-lg">
                  <Sparkles className="w-12 h-12 text-blue-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Welcome to AI Cortex</h3>
                <p className="text-gray-600 mb-8 max-w-md">
                  Start a conversation with our intelligent AI agent. Ask questions, request analysis, or explore complex topics.
                </p>
                <div className="flex flex-wrap gap-3 justify-center">
                  <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5">
                    <Zap className="w-4 h-4 mr-2 inline" />
                    Quick Analysis
                  </button>
                  <button className="px-4 py-2 bg-white/80 text-gray-700 rounded-xl hover:bg-white transition-all duration-200 border border-white/20">
                    <Brain className="w-4 h-4 mr-2 inline" />
                    Explore Topics
                  </button>
                </div>
              </div>
            ) : (
              <>
                {currentChat?.messages.map((message, index) => (
                  <div key={message.id} className="animate-fade-in">
                    <ChatMessage message={message} />
                  </div>
                ))}

                {/* Current agent status if active */}
                {currentAction && (
                  <div className="animate-fade-in">
                    <AgentActionStatus action={currentAction} status={agentStatus} screenshots={currentScreenshots} />
                  </div>
                )}
              </>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>
      )}

      {/* Input area */}
      <div className="relative z-10 bg-white/80 backdrop-blur-xl border-t border-white/20 shadow-lg">
        <div className="p-6">
          <ChatInput onSendMessage={sendMessage} />
        </div>
      </div>
    </div>
  )
}

export default ChatContainer
