import React from 'react'
import { Stack } from 'expo-router'

/**
 * Không khai báo từng Stack.Screen — Expo Router tự map file trong (auth).
 * Tránh lệch tên route / context navigation với bản SDK mới.
 */
const AuthLayout = () => {
  return <Stack screenOptions={{ headerShown: false }} />
}

export default AuthLayout
