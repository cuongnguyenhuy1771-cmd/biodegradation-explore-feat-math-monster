import { useState, useEffect, useCallback } from 'react'
import { notificationService } from '@/services/notifications.service'

/**
 * Custom hook to track unread notification count
 * Uses shared subscription from NotificationProvider
 */
export const useNotificationCount = () => {
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)

  // Fetch count from database
  const fetchCount = useCallback(async () => {
    try {
      const count = await notificationService.getUnreadCount()
      setUnreadCount(count)
    } catch (error) {
      console.error('Error fetching notification count:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // Initial count
    fetchCount()
    
    // Note: Realtime subscription is handled in NotificationProvider
    // This hook only manages the count state
  }, [fetchCount])

  const incrementCount = useCallback(() => {
    setUnreadCount(prev => {
      const newCount = prev + 1
      console.log('➕ Badge count incremented:', prev, '→', newCount)
      return newCount
    })
  }, [])

  const decrementCount = useCallback(() => {
    setUnreadCount(prev => {
      const newCount = Math.max(0, prev - 1)
      console.log('➖ Badge count decremented:', prev, '→', newCount)
      return newCount
    })
  }, [])

  const resetCount = useCallback(() => {
    console.log('🔄 Badge count reset to 0')
    setUnreadCount(0)
  }, [])

  return {
    unreadCount,
    loading,
    incrementCount,
    decrementCount,
    resetCount,
    refetchCount: fetchCount,
  }
}
