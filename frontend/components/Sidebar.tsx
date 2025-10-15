"use client"

import type React from "react"
import { useChat } from "../context/ChatContext"
import { 
  Plus, 
  MessageSquare, 
  History, 
  Star, 
  Settings, 
  ChevronRight, 
  Sparkles,
  Brain,
  Zap,
  MoreHorizontal,
  Trash2,
  Edit3
} from "lucide-react"

interface SidebarProps {
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const { chats, currentChat, createNewChat, selectChat } = useChat()

  // Group chats by date (today, yesterday, older)
  const starredChats = chats.filter((chat) => chat.isStarred)
  const recentChats = chats.filter((chat) => !chat.isStarred)

  return (
    <div className="w-80 h-full bg-white/80 backdrop-blur-xl border-r border-white/20 flex flex-col shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-white/20">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Cortex
            </h1>
            <p className="text-xs text-gray-500">Intelligent Analysis</p>
          </div>
        </div>
        <button className="p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-white/50 transition-all duration-200">
          <Settings size={18} />
        </button>
      </div>

      {/* New chat button */}
      <div className="p-6">
        <button
          onClick={() => {
            createNewChat()
            onClose?.()
          }}
          className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5 group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl group-hover:bg-white/30 transition-colors">
              <Plus size={18} />
            </div>
            <span className="font-semibold">New Analysis</span>
          </div>
          <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Chat lists */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {/* Starred chats */}
        {starredChats.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 px-2 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
              <Star size={14} className="text-yellow-500" />
              <span>Starred</span>
            </div>
            <div className="space-y-2">
              {starredChats.map((chat) => (
                <div key={chat.id} className="group relative">
                  <button
                    onClick={() => {
                      selectChat(chat.id)
                      onClose?.()
                    }}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-200 hover:shadow-md ${
                      currentChat?.id === chat.id 
                        ? "bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border border-blue-200 shadow-md" 
                        : "text-gray-700 hover:bg-white/60 hover:shadow-sm"
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${
                      currentChat?.id === chat.id 
                        ? "bg-blue-100 text-blue-600" 
                        : "bg-gray-100 text-gray-500 group-hover:bg-blue-100 group-hover:text-blue-600"
                    } transition-colors`}>
                      <MessageSquare size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{chat.title || "New Analysis"}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(chat.updatedAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal size={16} className="text-gray-400" />
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent chats */}
        <div>
          <div className="flex items-center gap-2 px-2 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
            <History size={14} className="text-gray-500" />
            <span>Recent</span>
          </div>
          <div className="space-y-2">
            {recentChats.length > 0 ? (
              recentChats.map((chat) => (
                <div key={chat.id} className="group relative">
                  <button
                    onClick={() => {
                      selectChat(chat.id)
                      onClose?.()
                    }}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-200 hover:shadow-md ${
                      currentChat?.id === chat.id 
                        ? "bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border border-blue-200 shadow-md" 
                        : "text-gray-700 hover:bg-white/60 hover:shadow-sm"
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${
                      currentChat?.id === chat.id 
                        ? "bg-blue-100 text-blue-600" 
                        : "bg-gray-100 text-gray-500 group-hover:bg-blue-100 group-hover:text-blue-600"
                    } transition-colors`}>
                      <MessageSquare size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{chat.title || "New Analysis"}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(chat.updatedAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                      <button className="p-1 hover:bg-gray-200 rounded-lg transition-colors">
                        <Edit3 size={14} className="text-gray-400" />
                      </button>
                      <button className="p-1 hover:bg-red-100 rounded-lg transition-colors">
                        <Trash2 size={14} className="text-gray-400 hover:text-red-500" />
                      </button>
                    </div>
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
                  <MessageSquare size={24} className="text-gray-400" />
                </div>
                <p className="text-sm text-gray-500 mb-2">No recent analyses</p>
                <p className="text-xs text-gray-400">Start a new conversation to see it here</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-white/20">
        <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
            <Zap size={16} className="text-white" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold text-green-800">AI Active</div>
            <div className="text-xs text-green-600">Ready for analysis</div>
          </div>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
