import { useEffect, useRef } from 'react'
import { AppState, AppStateStatus } from 'react-native'
import { notificationService } from '@/services/notifications.service'
import { supabase } from '@/lib/supabase'

/** Nhắc luyện tập & nhiệm vụ hàng ngày qua bảng notifications. */
export const useNotificationScheduler = () => {
  const appState = useRef(AppState.currentState)
  const intervalIds = useRef<ReturnType<typeof setInterval>[]>([])
  const notifiedToday = useRef<Set<string>>(new Set())

  const wasNotifiedToday = (key: string): boolean => {
    const fullKey = `${new Date().toDateString()}-${key}`
    return notifiedToday.current.has(fullKey)
  }

  const markAsNotified = (key: string) => {
    notifiedToday.current.add(`${new Date().toDateString()}-${key}`)
  }

  const clearDailyNotifications = () => {
    const now = new Date()
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)
    const msUntilMidnight = tomorrow.getTime() - now.getTime()
    setTimeout(() => {
      notifiedToday.current.clear()
      clearDailyNotifications()
    }, msUntilMidnight)
  }

  const currentTimeHm = () => {
    const now = new Date()
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
  }

  const normalizeTime = (t: string) => (t.length >= 5 ? t.slice(0, 5) : t)

  const checkReminders = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const settings = await notificationService.getSettings()
      if (!settings) return

      const hm = currentTimeHm()

      if (
        settings.practice_reminder_enabled &&
        normalizeTime(settings.practice_reminder_time) === hm &&
        !wasNotifiedToday('practice')
      ) {
        await notificationService.createPracticeReminder()
        markAsNotified('practice')
      }

      if (
        settings.daily_task_reminder_enabled &&
        hm === '20:00' &&
        !wasNotifiedToday('daily-task')
      ) {
        await notificationService.createDailyTaskReminder()
        markAsNotified('daily-task')
      }
    } catch (e) {
      console.warn('checkReminders:', e)
    }
  }

  useEffect(() => {
    clearDailyNotifications()
    void checkReminders()

    const id = setInterval(() => {
      void checkReminders()
    }, 60_000)
    intervalIds.current.push(id)

    const sub = AppState.addEventListener('change', (next: AppStateStatus) => {
      if (appState.current.match(/inactive|background/) && next === 'active') {
        void checkReminders()
      }
      appState.current = next
    })

    return () => {
      intervalIds.current.forEach(clearInterval)
      intervalIds.current = []
      sub.remove()
    }
  }, [])
}
