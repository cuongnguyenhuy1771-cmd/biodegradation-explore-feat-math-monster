import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import type { NotificationDisplay } from '@/services/notifications.service'

type Props = {
  item: NotificationDisplay
  onPress: (id: string) => void
}

export function NotificationListItem({ item, onPress }: Props) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => onPress(item.id)}
      className="px-4 py-4"
    >
      <View className="flex-row items-start">
        <View className="flex-1 pr-2">
          <View className="flex-row flex-wrap items-center">
            <Text className="font-bold text-base text-primary">{item.title}</Text>
            {!item.isRead ? (
              <View className="ml-2 h-2 w-2 rounded-full bg-primary-main" />
            ) : null}
          </View>
          <Text className="mt-1 text-sm leading-5 text-secondary">
            {item.message}
            <Text className="text-secondary"> {item.time}</Text>
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}
