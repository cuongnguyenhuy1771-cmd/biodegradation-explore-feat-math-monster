import React from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { ImageBackground } from 'expo-image'
import { SafeAreaView } from 'react-native-safe-area-context'
import type { ImageSource } from 'expo-image'
import Animated, { FadeInUp } from 'react-native-reanimated'
import type { HeroPose } from '@/constants/images'
import LoadingProgressBar from '@/modules/auth/components/LoadingProgressBar'
import BattleHeroScene from './BattleHeroScene'
import IconClose2 from '~/assets/icons/IconClose2'

type BattleLayoutProps = {
  backgroundSource: ImageSource
  heroSource: ImageSource
  heroPose: HeroPose
  progress: number
  timeLeft: number
  onClose: () => void
  children: React.ReactNode
}

export default function BattleLayout({
  backgroundSource,
  heroSource,
  heroPose,
  progress,
  timeLeft,
  onClose,
  children,
}: BattleLayoutProps) {
  const formatTime = (seconds: number) => {
    const s = seconds % 60
    return `00:${s < 10 ? '0' : ''}${s}`
  }

  return (
    <View style={styles.root}>
      <ImageBackground
        source={backgroundSource}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
      />

      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.header}>
          <Pressable
            onPress={onClose}
            style={({ pressed }) => [pressed && styles.btnPressed]}
            accessibilityRole="button"
            accessibilityLabel="Đóng"
            hitSlop={8}
          >
            <IconClose2 />
          </Pressable>

          <View style={styles.progressWrap}>
            <LoadingProgressBar progress={progress} />
          </View>

          <View style={styles.timerPill}>
            <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
          </View>
        </View>

        <BattleHeroScene heroSource={heroSource} heroPose={heroPose} />

        <Animated.View
          entering={FadeInUp.duration(400).delay(80).springify().damping(18)}
          style={styles.bottom}
        >
          {children}
        </Animated.View>
      </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#1A0B2E',
  },
  safe: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingTop: 4,
    gap: 12,
    zIndex: 2,
  },
  progressWrap: {
    flex: 1,
  },
  timerPill: {
    backgroundColor: '#232242',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 70,
  },
  timerText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    fontFamily: 'SNPro-Bold',
  },
  bottom: {
    paddingBottom: 8,
  },
  btnPressed: {
    opacity: 0.9,
  },
})
