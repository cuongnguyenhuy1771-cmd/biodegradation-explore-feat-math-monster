import { supabase } from '@/lib/supabase'
import { Database, Json } from '@/types/database.types'
import { RealtimeChannel } from '@supabase/supabase-js'

const EMPTY_METADATA: Json = {}

export type NotificationType = Database['public']['Tables']['notifications']['Row']
export type NotificationInsert = Database['public']['Tables']['notifications']['Insert']
type NotificationRowType = NotificationType['type']

export type NotificationSettings = Database['public']['Tables']['notification_settings']['Row']
export type NotificationSettingsUpdate = Database['public']['Tables']['notification_settings']['Update']

export interface NotificationDisplay {
  id: string
  icon: string
  iconBg: string
  title: string
  message: string
  time: string
  isRead: boolean
  category: 'today' | 'new'
  type: string
  relatedId?: string
  metadata?: any
  createdAt: string
}

class NotificationService {
  private realtimeChannel: RealtimeChannel | null = null

  /**
   * Get notifications for current user
   */
  async getNotifications(limit: number = 50): Promise<NotificationDisplay[]> {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return []

    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching notifications:', error)
      throw error
    }

    return this.formatNotifications((data ?? []) as NotificationType[])
  }

  /**
   * Get unread notification count
   */
  async getUnreadCount(): Promise<number> {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return 0

    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('is_read', false)

    if (error) {
      console.error('Error fetching unread count:', error)
      return 0
    }

    return count || 0
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string): Promise<void> {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase
      .from('notifications')
      .update({
        is_read: true,
        read_at: new Date().toISOString(),
      })
      .eq('id', notificationId)
      .eq('user_id', user.id)

    if (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<void> {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase
      .from('notifications')
      .update({
        is_read: true,
        read_at: new Date().toISOString(),
      })
      .eq('user_id', user.id)
      .eq('is_read', false)

    if (error) {
      console.error('Error marking all notifications as read:', error)
    }
  }

  /**
   * Create a notification
   */
  async createNotification(
    type: NotificationRowType,
    title: string,
    message: string,
    icon: string,
    iconBg: string,
    relatedId?: string,
    metadata?: Record<string, unknown>,
  ): Promise<string | null> {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return null
    return this.createNotificationForUser(user.id, type, title, message, icon, iconBg, relatedId, metadata)
  }

  /** Dùng cho scheduler / seed khi đã có userId. */
  async createNotificationForUser(
    userId: string,
    type: NotificationRowType,
    title: string,
    message: string,
    icon: string,
    iconBg: string,
    relatedId?: string,
    metadata?: Record<string, unknown>,
  ): Promise<string | null> {
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        type,
        title,
        message,
        icon,
        icon_bg: iconBg,
        related_id: relatedId ?? null,
        metadata: (metadata ?? EMPTY_METADATA) as Json,
      })
      .select('id')
      .single()

    if (error) {
      console.error('Error creating notification:', error)
      return null
    }

    return data?.id ?? null
  }

  /** Tạo cài đặt mặc định cho user mới (gọi sau đăng nhập / đăng ký). */
  async ensureDefaultSettings(userId: string): Promise<void> {
    const { data: existing } = await supabase
      .from('notification_settings')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle()

    if (existing) return

    const { error } = await supabase.from('notification_settings').insert({
      user_id: userId,
      practice_reminder_enabled: true,
      practice_reminder_time: '08:00',
      daily_task_reminder_enabled: true,
    })

    if (error) {
      console.error('Error ensuring notification settings:', error)
    }
  }

  /** Thông báo chào mừng lần đầu (idempotent theo type welcome). */
  async seedWelcomeIfNeeded(userId: string): Promise<void> {
    const { data: existing } = await supabase
      .from('notifications')
      .select('id')
      .eq('user_id', userId)
      .eq('type', 'welcome')
      .limit(1)
      .maybeSingle()

    if (existing) return

    await this.createNotificationForUser(
      userId,
      'welcome',
      'Chào mừng đến Math Monsters',
      'Bật thông báo để nhắc luyện tập và nhiệm vụ hàng ngày.',
      '⚔️',
      '#E0E7FF',
    )
  }

  /**
   * Subscribe to realtime notifications
   */
  subscribeToNotifications(
    onNotification: (notification: NotificationDisplay) => void
  ): RealtimeChannel {
    if (this.realtimeChannel) {
      console.log('⚠️ Cleaning up existing subscription')
      this.unsubscribeFromNotifications()
    }

    console.log('📡 Setting up Supabase realtime subscription for notifications')

    // Get current user ID synchronously from auth state
    let currentUserId: string | undefined

    this.realtimeChannel = supabase
      .channel('notifications-channel', {
        config: {
          broadcast: { self: true }
        }
      })
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications'
        },
        async (payload) => {
          console.log('📨 Realtime event received:', payload)
          
          // Get user ID on first event if not set
          if (!currentUserId) {
            const { data: { user } } = await supabase.auth.getUser()
            currentUserId = user?.id
            console.log('👤 Current user ID:', currentUserId)
          }
          
          const notification = payload.new as NotificationType
          
          // Filter on client side for free plan compatibility
          if (currentUserId && notification.user_id !== currentUserId) {
            console.log('⏭️ Skipping notification for different user')
            return
          }
          
          const formatted = this.formatNotifications([notification])[0]
          if (formatted) {
            console.log('✅ Formatted notification:', formatted.title)
            onNotification(formatted)
          } else {
            console.log('⚠️ Could not format notification')
          }
        }
      )
      .subscribe((status) => {
        // console.log('📡 Subscription status:', status)
        if (status === 'SUBSCRIBED') {
          // console.log('✅ Successfully subscribed to notifications!')
        } else if (status === 'CHANNEL_ERROR') {
          // console.error('❌ Error subscribing to notifications')
        } else if (status === 'TIMED_OUT') {
          // console.error('⏱️ Subscription timed out')
        }
      })

    return this.realtimeChannel
  }

  /**
   * Unsubscribe from notifications
   */
  unsubscribeFromNotifications(): void {
    if (this.realtimeChannel) {
      supabase.removeChannel(this.realtimeChannel)
      this.realtimeChannel = null
    }
  }

  /**
   * Get notification settings
   */
  async getSettings(): Promise<NotificationSettings | null> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data, error } = await supabase
      .from('notification_settings')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()

    // If no settings exist, return null (caller should handle this)
    return data || null
  }

  /**
   * Update notification settings
   */
  async updateSettings(settings: NotificationSettingsUpdate): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase
      .from('notification_settings')
      .upsert({
        user_id: user.id,
        ...settings,
        updated_at: new Date().toISOString()
      })
  }

  /**
   * Format notifications for display
   */
  private formatNotifications(notifications: NotificationType[]): NotificationDisplay[] {
    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    return notifications.map(notif => {
      const createdAt = new Date(notif.created_at)
      const diffMs = now.getTime() - createdAt.getTime()
      const diffMins = Math.floor(diffMs / 60000)
      const diffHours = Math.floor(diffMs / 3600000)
      const diffDays = Math.floor(diffMs / 86400000)

      let timeDisplay = ''
      if (diffMins < 1) {
        timeDisplay = 'Vừa xong'
      } else if (diffMins < 60) {
        timeDisplay = `${diffMins} phút`
      } else if (diffHours < 24) {
        timeDisplay = `${diffHours} giờ`
      } else {
        timeDisplay = `${diffDays} ngày`
      }

      const isToday = createdAt >= todayStart
      const category = isToday && notif.is_read ? 'today' : 'new'

      return {
        id: notif.id,
        icon: notif.icon,
        iconBg: notif.icon_bg,
        title: notif.title,
        message: notif.message,
        time: timeDisplay,
        isRead: notif.is_read,
        category,
        type: notif.type,
        relatedId: notif.related_id || undefined,
        metadata: notif.metadata,
        createdAt: notif.created_at
      }
    })
  }

  /** Nhắc luyện tập hàng ngày */
  async createPracticeReminder(): Promise<void> {
    await this.createNotification(
      'practice_reminder',
      'Giờ luyện toán',
      'Dành vài phút chiến đấu cùng Math Monsters nhé!',
      '⚔️',
      '#E0E7FF',
    )
  }

  /** Nhắc nhiệm vụ hàng ngày */
  async createDailyTaskReminder(): Promise<void> {
    await this.createNotification(
      'daily_task',
      'Nhiệm vụ hàng ngày',
      'Kiểm tra nhiệm vụ và nhận thưởng trước khi hết ngày nhé!',
      '📋',
      '#FFF4CC',
    )
  }
}

export const notificationService = new NotificationService()
