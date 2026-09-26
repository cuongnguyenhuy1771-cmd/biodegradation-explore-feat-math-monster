import React, { PropsWithChildren } from 'react'
import { ImageSourcePropType, StatusBar, TouchableOpacity, View } from 'react-native'
import { Image, ImageBackground } from 'expo-image'
import { BlurView } from 'expo-blur'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '@/constants'

type AuthBackground = 'splash' | 'loading' | 'chooseHero'

type Props = PropsWithChildren<{
  background?: AuthBackground
  blur?: boolean
  showBack?: boolean
  footer?: React.ReactNode
  /** `top` cho màn chọn nhân vật, `center` mặc định */
  contentAlign?: 'center' | 'top'
}>

const BACKGROUNDS: Record<AuthBackground, ImageSourcePropType> = {
  splash: images.background.splash,
  loading: images.background.loading,
  chooseHero: images.background.chooseHero,
}

export default function AuthScreenLayout({
  children,
  background = 'splash',
  blur = false,
  showBack = false,
  footer,
  contentAlign = 'center',
}: Props) {
  return (
    <View className="flex-1 bg-[#1A0B2E]">
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <ImageBackground
        source={BACKGROUNDS[background]}
        style={{ flex: 1 }}
        contentFit="cover"
      >
        {blur ? (
          <>
            <BlurView
              intensity={28}
              tint="dark"
              pointerEvents="none"
              style={{ position: 'absolute', inset: 0 }}
            />
            <View pointerEvents="none" className="absolute inset-0 bg-[#1A0B2E]/55" />
          </>
        ) : null}

        <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
          {showBack ? (
            <TouchableOpacity
              onPress={() => router.back()}
              className="ml-4 mt-2 h-10 w-10 items-center justify-center rounded-full bg-black/25"
              accessibilityRole="button"
              accessibilityLabel="Quay lại"
            >
              <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
            </TouchableOpacity>
          ) : (
            <View className="h-2" />
          )}

          <View
            className={
              contentAlign === 'top' ? 'flex-1 justify-start' : 'flex-1 justify-center'
            }
          >
            {children}
          </View>

          {footer ? <View className="px-6 pb-1">{footer}</View> : null}
        </SafeAreaView>
      </ImageBackground>
    </View>
  )
}

export function AuthLogoTitle({ className }: { className?: string }) {
  return (
    <Image
      source={images.logo.title}
      contentFit="contain"
      style={{ width: '88%', height: 120, alignSelf: 'center' }}
      className={className}
      accessibilityLabel="Math Monsters"
    />
  )
}
