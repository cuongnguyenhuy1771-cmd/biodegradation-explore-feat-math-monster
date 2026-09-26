import React, { createContext, useContext, ReactNode, useEffect, useCallback, useRef } from 'react'
import { useNotificationScheduler } from '@/hooks/useNotificationScheduler'
import { useNotificationCount } from '@/hooks/useNotificationCount'
import { notificationService, NotificationDisplay } from '@/services/notifications.service'
import { toast } from '@/components/common/ToastManager'

interface NotificationContextValue {
  unreadCount: number
  loading: boolean
  decrementCount: () => void
  resetCount: () => void
  onNewNotification: (callback: (notification: NotificationDisplay) => void) => void
  offNewNotification: (callback: (notification: NotificationDisplay) => void) => void
}

const NotificationContext = createContext<NotificationContextValue>({
  unreadCount: 0,
  loading: true,
  decrementCount: () => {},
  resetCount: () => {},
  onNewNotification: () => {},
  offNewNotification: () => {},
})

export const useNotifications = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider')
  }
  return context
}

interface NotificationProviderProps {
  children: ReactNode
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  // Start the notification scheduler
  useNotificationScheduler()
  
  // Track unread count
  const { unreadCount, loading, incrementCount, decrementCount, resetCount } = useNotificationCount()

  // Store callbacks for new notifications
  const callbacksRef = useRef<Set<(notification: NotificationDisplay) => void>>(new Set())
  
  // Store incrementCount in ref to avoid recreating subscription
  const incrementCountRef = useRef(incrementCount)
  useEffect(() => {
    incrementCountRef.current = incrementCount
  }, [incrementCount])

  // Subscribe/unsubscribe to new notification events
  const onNewNotification = useCallback((callback: (notification: NotificationDisplay) => void) => {
    callbacksRef.current.add(callback)
  }, [])

  const offNewNotification = useCallback((callback: (notification: NotificationDisplay) => void) => {
    callbacksRef.current.delete(callback)
  }, [])

  // Subscribe to new notifications and show toast
  // This effect should only run ONCE on mount
  useEffect(() => {
    console.log('🔔 NotificationProvider: Setting up realtime subscription')
    
    const channel = notificationService.subscribeToNotifications((notification) => {
      console.log('🔔 NotificationProvider: New notification received!', notification.title)
      
      // Increment badge count for unread notifications
      if (!notification.isRead) {
        console.log('➕ Calling incrementCount for badge')
        incrementCountRef.current() // Use ref to avoid dependency
      }
      
      // Show toast for new notification
      try {
        console.log('🍞 Attempting to show toast...')
        toast.notification(
          notification.title,
          notification.message,
          notification.icon,
          notification.iconBg,
          4000 // 4 seconds
        )
        console.log('✅ Toast function called successfully')
      } catch (error) {
        console.error('❌ Error showing toast:', error)
      }

      // Notify all registered callbacks
      callbacksRef.current.forEach(callback => {
        try {
          callback(notification)
        } catch (error) {
          console.error('Error in notification callback:', error)
        }
      })
    })

    return () => {
      console.log('🔔 NotificationProvider: Cleaning up subscription')
      notificationService.unsubscribeFromNotifications()
    }
  }, []) // Empty deps - only run once!

  return (
    <NotificationContext.Provider
      value={{
        unreadCount,
        loading,
        decrementCount,
        resetCount,
        onNewNotification,
        offNewNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}
