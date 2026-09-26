import React, { useEffect } from 'react'
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { NotificationListItem } from '@/components/notifications/NotificationListItem'
import { useNotificationsList } from '@/hooks/useNotificationsList'
import { useNotifications } from '@/context/notification-provider'

export default function NotificationsScreen() {
  const { notifications, isLoading, isError, markAsRead, refetch } = useNotificationsList()
  const { onNewNotification, offNewNotification } = useNotifications()

  useEffect(() => {
    const handler = () => {
      refetch()
    }
    onNewNotification(handler)
    return () => offNewNotification(handler)
  }, [onNewNotification, offNewNotification, refetch])

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <View className="flex-row items-center justify-center px-4 pb-2 pt-2">
        <TouchableOpacity
          onPress={() => router.back()}
          className="absolute left-4 h-10 w-10 items-center justify-center"
          accessibilityRole="button"
          accessibilityLabel="Quay lại"
        >
          <Ionicons name="chevron-back" size={24} color="#212B36" />
        </TouchableOpacity>
        <Text className="font-bold text-lg text-primary">Thông báo</Text>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#B3F00B" />
        </View>
      ) : isError ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-center font-medium text-secondary">
            Không tải được thông báo.
          </Text>
          <TouchableOpacity onPress={() => refetch()} className="mt-4">
            <Text className="font-semibold text-primary-main">Thử lại</Text>
          </TouchableOpacity>
        </View>
      ) : notifications.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-center text-secondary">Chưa có thông báo nào.</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <NotificationListItem item={item} onPress={markAsRead} />
          )}
          ItemSeparatorComponent={() => <View className="h-px bg-component-divider mx-4" />}
          contentContainerClassName="pb-8"
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  )
}
