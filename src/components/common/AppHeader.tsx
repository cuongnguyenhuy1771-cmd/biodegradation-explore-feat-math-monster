import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { Notification } from 'iconsax-react-native'
import { router } from 'expo-router'

interface AppHeaderProps {
  title: string
  unreadCount?: number
  onPressNotification?: () => void
  containerClassName?: string
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  unreadCount = 0,
  onPressNotification,
  containerClassName = '',
}) => {
  const handlePress = () => {
    if (onPressNotification) {
      onPressNotification()
    } else {
      router.push('/(screens)/notifications' as any)
    }
  }

  return (
    <View className={`flex-row items-center justify-between px-6 py-4 ${containerClassName}`}>
      <Text className="text-2xl font-semibold text-[#1F2937]">{title}</Text>
      <TouchableOpacity
        onPress={handlePress}
        className="w-12 h-12 items-center justify-center"
      >
        <View>
          <Notification size={24} color="#1F2937" variant="Outline" />
          {unreadCount > 0 && (
            <View className="absolute right-0.5 top-0.5 w-2.5 h-2.5 bg-[#4CC9F0] rounded-full border-2 border-white" />
          )}
        </View>
      </TouchableOpacity>
    </View>
  )
}
