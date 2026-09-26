import React from 'react'
import { View } from 'react-native'
import { ImageBackground } from 'expo-image'
import { router } from 'expo-router'
import { StatusBar } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '@/constants'
import { ERouteTable } from '@/constants/route-table'
import { useAuthEntryRedirect } from '@/hooks/useAuthEntryRedirect'
import AuthButton from '@/modules/auth/components/AuthButton'
import { AuthLogoTitle } from '@/modules/auth/components/AuthScreenLayout'

export default function WelcomeScreen() {
  useAuthEntryRedirect()

  return (
    <View className="flex-1 bg-[#1A0B2E]">
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <ImageBackground
        source={images.background.splash}
        style={{ flex: 1 }}
        contentFit="cover"
      >
        <SafeAreaView className="flex-1 justify-between pb-10">
          <View className="flex-1 justify-center pt-6">
            <AuthLogoTitle />
          </View>

          <View className="px-8">
            <AuthButton
              title="Bắt đầu ngay"
              variant="fixed"
              onPress={() => router.push(ERouteTable.LOADING as never)}
            />
          </View>
        </SafeAreaView>
      </ImageBackground>
    </View>
  )
}
