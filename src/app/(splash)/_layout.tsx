import React from 'react'
import { Stack } from 'expo-router'

export default function SplashLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'fade',
        animationDuration: 280,
        contentStyle: { backgroundColor: '#120824' },
      }}
    />
  )
}
