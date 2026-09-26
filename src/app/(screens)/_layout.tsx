import React from 'react'
import { Stack } from 'expo-router'

/** Stack riêng cho các màn modal/push từ tab (chi tiết buổi tập, dời lịch, thêm buổi…). */
export default function ScreensLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    />
  )
}
