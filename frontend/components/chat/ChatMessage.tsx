"use client"

import type React from "react"
import { type Message, MessageRole, AgentStatus } from "../../lib/types"
import ActionStep from "./ActionStep"
import { User, Bot, Clock, CheckCircle, AlertCircle, Loader2 } from "lucide-react"

interface ChatMessageProps {
  message: Message
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === MessageRole.User

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date)
  }

  const getStatusIcon = (status: AgentStatus) => {
    switch (status) {
      case AgentStatus.Thinking:
        return <Loader2 size={16} className="animate-spin text-yellow-500" />
      case AgentStatus.Executing:
        return <Loader2 size={16} className="animate-spin text-blue-500" />
      case AgentStatus.Done:
        return <CheckCircle size={16} className="text-green-500" />
      case AgentStatus.Error:
        return <AlertCircle size={16} className="text-red-500" />
      default:
        return <Clock size={16} className="text-gray-400" />
    }
  }

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-6`}>
      <div className={`flex gap-3 max-w-[80%] ${isUser ? "flex-row-reverse" : "flex-row"}`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg ${
          isUser 
            ? "bg-gradient-to-br from-blue-500 to-purple-600" 
            : "bg-gradient-to-br from-gray-100 to-gray-200"
        }`}>
          {isUser ? (
            <User size={20} className="text-white" />
          ) : (
            <Bot size={20} className="text-gray-600" />
          )}
        </div>

        {/* Message content */}
        <div className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}>
          {/* Message bubble */}
          <div className={`
            relative rounded-2xl px-6 py-4 shadow-lg transition-all duration-200 hover:shadow-xl
            ${isUser 
              ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-br-md" 
              : "bg-white/90 backdrop-blur-sm text-gray-900 rounded-bl-md border border-white/20"
            }
          `}>
            {/* Message text */}
            <div className="whitespace-pre-wrap text-base leading-relaxed">
              {message.content}
            </div>

            {/* Agent actions with steps */}
            {!isUser && message.agentActions && message.agentActions.length > 0 && (
              <div className="mt-4 space-y-3">
                {message.agentActions.map((action, index) => (
                  <div key={index} className="bg-white/20 rounded-xl p-4 border border-white/30">
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusIcon(action.status)}
                      <div className="font-semibold text-white">{action.title}</div>
                    </div>
                    {action.description && (
                      <div className="text-sm text-white/80">{action.description}</div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Screenshots as individual steps */}
            {!isUser && message.screenshots && message.screenshots.length > 0 && (
              <div className="mt-4 space-y-3">
                {message.screenshots.map((screenshot, index) => (
                  <div key={index} className="bg-white/20 rounded-xl p-4 border border-white/30">
                    <ActionStep
                      title={`Step ${screenshot.step}`}
                      screenshot={screenshot}
                      status={
                        index === message.screenshots!.length - 1 &&
                        message.agentActions &&
                        message.agentActions[0]?.status === AgentStatus.Executing
                          ? "Executing..."
                          : "Completed"
                      }
                      isLoading={
                        index === message.screenshots!.length - 1 &&
                        message.agentActions &&
                        (message.agentActions[0]?.status === AgentStatus.Thinking ||
                          message.agentActions[0]?.status === AgentStatus.Executing)
                      }
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Message tail */}
            <div className={`
              absolute w-4 h-4 transform rotate-45
              ${isUser 
                ? "bottom-0 right-0 bg-gradient-to-br from-blue-500 to-purple-600 -mr-2 -mb-2" 
                : "bottom-0 left-0 bg-white/90 -ml-2 -mb-2 border-l border-b border-white/20"
              }
            `}></div>
          </div>

          {/* Timestamp and status */}
          <div className={`flex items-center gap-2 mt-2 text-xs text-gray-500 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
            <span>{formatTime(message.timestamp)}</span>
            {!isUser && message.agentActions && message.agentActions.length > 0 && (
              <>
                <span>•</span>
                <div className="flex items-center gap-1">
                  {getStatusIcon(message.agentActions[0]?.status || AgentStatus.Idle)}
                  <span>
                    {message.agentActions[0]?.status === AgentStatus.Thinking ? 'Thinking...' :
                     message.agentActions[0]?.status === AgentStatus.Executing ? 'Executing...' :
                     message.agentActions[0]?.status === AgentStatus.Done ? 'Completed' :
                     message.agentActions[0]?.status === AgentStatus.Error ? 'Error' : 'Ready'}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatMessage
