import React, { useEffect, useRef, useState } from 'react'
import { Text, View } from 'react-native'
import { ImageBackground } from 'expo-image'
import { router } from 'expo-router'
import { StatusBar } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '@/constants'
import { ERouteTable } from '@/constants/route-table'
import { useAuth } from '@/context/auth-provider'
import { useAuthEntryRedirect } from '@/hooks/useAuthEntryRedirect'
import { MathMonstersService } from '@/services/mathMonsters.service'
import LoadingProgressBar from '@/modules/auth/components/LoadingProgressBar'

const LOADING_DURATION_MS = 3200
const HOLD_AT_FULL_MS = 500

export default function LoadingScreen() {
  const { isAuthenticated, user } = useAuth()
  useAuthEntryRedirect()

  const [progress, setProgress] = useState(0)
  const finishedRef = useRef(false)

  useEffect(() => {
    setProgress(0)
    const startedAt = Date.now()
    const interval = setInterval(() => {
      const elapsed = Date.now() - startedAt
      const ratio = Math.min(elapsed / LOADING_DURATION_MS, 1)
      setProgress(Math.round(ratio * 100))
      if (ratio >= 1) clearInterval(interval)
    }, 40)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (progress < 100 || finishedRef.current) return

    const finish = async () => {
      await new Promise((resolve) => setTimeout(resolve, HOLD_AT_FULL_MS))
      if (finishedRef.current) return
      finishedRef.current = true

      if (isAuthenticated && user?.id) {
        const needsSetup = await MathMonstersService.needsOnboarding(user.id)
        router.replace(
          needsSetup ? (ERouteTable.CHOOSE_HERO as never) : ERouteTable.HOME
        )
        return
      }

      router.replace(ERouteTable.SIGIN_IN)
    }

    void finish()
  }, [isAuthenticated, progress, user?.id])

  return (
    <View className="flex-1 bg-[#1A0B2E]">
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <ImageBackground
        source={images.background.loading}
        style={{ flex: 1 }}
        contentFit="cover"
      >
        <SafeAreaView className="flex-1 justify-end pb-16 px-4">
          <Text className="text-white text-center text-base font-bold tracking-[2px] mb-3">
            LOADING...{progress}%
          </Text>
          <LoadingProgressBar progress={progress} />
        </SafeAreaView>
      </ImageBackground>
    </View>
  )
}
