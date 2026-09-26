import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useNotifications } from '@/context/notification-provider'

interface NotificationBadgeProps {
  size?: number
  color?: string
  showBadge?: boolean
}

/**
 * Notification Bell Icon with Unread Count Badge
 * 
 * Usage:
 * ```tsx
 * <NotificationBadge size={24} color="#000" />
 * ```
 */
export const NotificationBadge: React.FC<NotificationBadgeProps> = ({ 
  size = 24, 
  color = '#000',
  showBadge = true 
}) => {
  const { unreadCount } = useNotifications()

  const handlePress = () => {
    router.push('/(screens)/notifications')
  }

  return (
    <TouchableOpacity 
      onPress={handlePress}
      className="relative"
      activeOpacity={0.7}
    >
      <Ionicons 
        name={unreadCount > 0 ? "notifications" : "notifications-outline"} 
        size={size} 
        color={color} 
      />
      
      {showBadge && unreadCount > 0 && (
        <View 
          className="absolute -top-1 -right-1 bg-red-500 rounded-full min-w-[18px] h-[18px] items-center justify-center px-1"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3,
            elevation: 5,
          }}
        >
          <Text className="text-white text-[10px] font-bold">
            {unreadCount > 99 ? '99+' : unreadCount}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  )
}
