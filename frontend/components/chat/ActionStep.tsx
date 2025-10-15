"use client"

import type React from "react"
import { useState } from "react"
import type { Screenshot } from "../../lib/types"
import { 
  ChevronDown, 
  ChevronRight, 
  Loader2, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  Eye,
  EyeOff,
  Download,
  Maximize2
} from "lucide-react"

interface ActionStepProps {
  title: string
  description?: string
  screenshot: Screenshot // Single screenshot
  status: string
  isLoading?: boolean
}

const ActionStep: React.FC<ActionStepProps> = ({ title, description, screenshot, status, isLoading = false }) => {
  const [isExpanded, setIsExpanded] = useState(true)
  const [isImageExpanded, setIsImageExpanded] = useState(false)

  const getStatusIcon = () => {
    if (isLoading) {
      return <Loader2 size={16} className="animate-spin text-blue-500" />
    }
    switch (status.toLowerCase()) {
      case 'completed':
        return <CheckCircle size={16} className="text-green-500" />
      case 'error':
        return <AlertCircle size={16} className="text-red-500" />
      case 'executing...':
        return <Loader2 size={16} className="animate-spin text-blue-500" />
      default:
        return <Clock size={16} className="text-gray-400" />
    }
  }

  const getStatusColor = () => {
    if (isLoading) return 'text-blue-500'
    switch (status.toLowerCase()) {
      case 'completed':
        return 'text-green-500'
      case 'error':
        return 'text-red-500'
      case 'executing...':
        return 'text-blue-500'
      default:
        return 'text-gray-500'
    }
  }

  return (
    <div className="bg-white/90 backdrop-blur-sm border border-white/20 rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
      {/* Header */}
      <div
        className="flex items-center gap-3 p-4 cursor-pointer hover:bg-white/50 transition-all duration-200"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="text-gray-400 transition-transform duration-200">
          {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
        </div>

        <div className="flex items-center gap-2">
          {getStatusIcon()}
          <div className="font-semibold text-gray-900">{title || `Step ${screenshot.step}`}</div>
        </div>

        <div className={`text-sm font-medium ml-auto ${getStatusColor()}`}>
          {status}
        </div>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="border-t border-white/20 p-4 space-y-4 animate-fade-in">
          {description && (
            <div className="text-sm text-gray-700 bg-gray-50/50 rounded-xl p-3">
              {description}
            </div>
          )}

          <div className="relative group">
            <div className="border border-white/30 rounded-xl overflow-hidden shadow-md">
              {screenshot.base64 ? (
                <img
                  src={`data:image/png;base64,${screenshot.base64}`}
                  alt={`Screenshot step ${screenshot.step}`}
                  className="w-full object-contain max-h-96 transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <img
                  src={screenshot.url || "/placeholder.svg"}
                  alt={`Screenshot step ${screenshot.step}`}
                  className="w-full object-contain max-h-96 transition-transform duration-300 group-hover:scale-105"
                />
              )}
              
              {/* Overlay with actions */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsImageExpanded(!isImageExpanded)}
                    className="p-2 bg-white/90 rounded-lg hover:bg-white transition-all duration-200 shadow-lg"
                  >
                    {isImageExpanded ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  <button className="p-2 bg-white/90 rounded-lg hover:bg-white transition-all duration-200 shadow-lg">
                    <Download size={16} />
                  </button>
                  <button className="p-2 bg-white/90 rounded-lg hover:bg-white transition-all duration-200 shadow-lg">
                    <Maximize2 size={16} />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Step {screenshot.step}</span>
                {screenshot.description && <span>• {screenshot.description}</span>}
              </div>
              <div className="flex items-center gap-1">
                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ActionStep
