import React, { useEffect } from 'react'
import { View } from 'react-native'
import { Image } from 'expo-image'
import { router } from 'expo-router'
import { StatusBar } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '@/constants'
import { ERouteTable } from '@/constants/route-table'
import { useAuthEntryRedirect } from '@/hooks/useAuthEntryRedirect'

const INTRO_DURATION_MS = 2000

export default function IntroScreen() {
  const { isAuthenticated, loading } = useAuthEntryRedirect()

  useEffect(() => {
    if (loading || isAuthenticated) return

    const timer = setTimeout(() => {
      router.replace(ERouteTable.WELCOME as never)
    }, INTRO_DURATION_MS)

    return () => clearTimeout(timer)
  }, [isAuthenticated, loading])

  return (
    <View className="flex-1 bg-[#120824]">
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <SafeAreaView className="flex-1 justify-center items-center px-10">
        <Image
          source={images.logo.vertical}
          contentFit="contain"
          style={{ width: 150, height: 150 }}
          accessibilityLabel="Math Monsters"
        />
      </SafeAreaView>
    </View>
  )
}
