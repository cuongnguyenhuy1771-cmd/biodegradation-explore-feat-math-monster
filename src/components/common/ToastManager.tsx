import React, { useState, useCallback } from 'react'
import { View } from 'react-native'
import { Toast, ToastConfig } from './Toast'

interface ToastManagerProps {
  /** Optional — để có thể đặt `<Stack />` làm sibling thay vì bọc trong ToastManager (tránh lỗi navigation context). */
  children?: React.ReactNode
}

let showToastGlobal: ((config: Omit<ToastConfig, 'id'>) => void) | null = null

export const ToastManager: React.FC<ToastManagerProps> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastConfig[]>([])

  const showToast = useCallback((config: Omit<ToastConfig, 'id'>) => {
    console.log('📬 ToastManager.showToast called:', config.title)
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9)
    const newToast: ToastConfig = {
      ...config,
      id,
      duration: config.duration || 3000,
    }

    setToasts(prev => {
      console.log('📋 Adding toast to queue. Current count:', prev.length, '→', prev.length + 1)
      return [...prev, newToast]
    })

    // Auto remove after duration + animation time
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
      console.log('🗑️ Toast removed after timeout:', id)
    }, (config.duration || 3000) + 500)
  }, [])

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
    console.log('👋 Toast dismissed manually:', id)
  }, [])

  // Expose showToast globally
  React.useEffect(() => {
    console.log('🎬 ToastManager mounted, exposing showToastGlobal')
    showToastGlobal = showToast
    return () => {
      console.log('🛑 ToastManager unmounting, clearing showToastGlobal')
      showToastGlobal = null
    }
  }, [showToast])
  
  // Debug: Log when toasts change
  React.useEffect(() => {
    console.log('📊 Toasts state updated. Count:', toasts.length, 'IDs:', toasts.map(t => t.id))
  }, [toasts])

  return (
    <>
      {children}
      <View 
        pointerEvents="box-none"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9999,
        }}
      >
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onDismiss={dismissToast} />
        ))}
      </View>
    </>
  )
}

// Global toast function
export const toast = {
  show: (config: Omit<ToastConfig, 'id'>) => {
    console.log('🍞 toast.show called:', config.title)
    if (showToastGlobal) {
      console.log('✅ showToastGlobal is available, calling it...')
      showToastGlobal(config)
    } else {
      console.error('❌ showToastGlobal is NULL! ToastManager not mounted?')
    }
  },

  success: (title: string, message: string, duration?: number) => {
    toast.show({ type: 'success', title, message, duration })
  },

  error: (title: string, message: string, duration?: number) => {
    toast.show({ type: 'error', title, message, duration })
  },

  info: (title: string, message: string, duration?: number) => {
    toast.show({ type: 'info', title, message, duration })
  },

  warning: (title: string, message: string, duration?: number) => {
    toast.show({ type: 'warning', title, message, duration })
  },

  notification: (title: string, message: string, icon?: string, iconBg?: string, duration?: number) => {
    console.log('🍞 toast.notification called:', { title, message, icon, iconBg, duration })
    toast.show({ type: 'notification', title, message, icon, iconBg, duration })
  },
}
