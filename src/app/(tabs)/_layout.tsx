import React from 'react'
import { Tabs } from 'expo-router'
import FloatingTabBar, {
  type FloatingTabBarProps,
} from '@/components/navigation/FloatingTabBar'

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props: FloatingTabBarProps) => <FloatingTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen name="home" options={{ title: 'Trang chủ' }} />
      <Tabs.Screen name="collection" options={{ title: 'Bộ sưu tập' }} />
      <Tabs.Screen name="leaderboard" options={{ title: 'Xếp hạng' }} />
      <Tabs.Screen name="profile" options={{ title: 'Cá nhân' }} />
    </Tabs>
  )
}
