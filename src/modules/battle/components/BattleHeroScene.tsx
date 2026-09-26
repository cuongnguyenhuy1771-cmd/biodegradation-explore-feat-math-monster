import React, { useEffect } from 'react'
import { StyleSheet } from 'react-native'
import { Image } from 'expo-image'
import type { ImageSource } from 'expo-image'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated'
import type { HeroPose } from '@/constants/images'

type BattleHeroSceneProps = {
  heroSource: ImageSource
  heroPose: HeroPose
}

export default function BattleHeroScene({ heroSource, heroPose }: BattleHeroSceneProps) {
  const scale = useSharedValue(1)
  const translateX = useSharedValue(0)
  const translateY = useSharedValue(0)

  useEffect(() => {
    if (heroPose === 'true') {
      scale.value = withSequence(
        withSpring(1.08, { damping: 8, stiffness: 280 }),
        withSpring(1, { damping: 12, stiffness: 220 }),
      )
      translateY.value = withSequence(
        withTiming(-10, { duration: 120 }),
        withSpring(0, { damping: 10, stiffness: 200 }),
      )
      translateX.value = withTiming(0, { duration: 100 })
      return
    }

    if (heroPose === 'false') {
      translateX.value = withSequence(
        withTiming(-10, { duration: 50 }),
        withTiming(10, { duration: 50 }),
        withTiming(-8, { duration: 50 }),
        withTiming(8, { duration: 50 }),
        withTiming(0, { duration: 50 }),
      )
      scale.value = withSequence(
        withTiming(0.97, { duration: 80 }),
        withSpring(1, { damping: 12, stiffness: 200 }),
      )
      return
    }

    scale.value = withSpring(1, { damping: 14, stiffness: 180 })
    translateX.value = withTiming(0, { duration: 120 })
    translateY.value = withTiming(0, { duration: 120 })
  }, [heroPose, scale, translateX, translateY])

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }))

  return (
    <Animated.View style={[styles.scene, animatedStyle]}>
      <Image source={heroSource} style={styles.hero} contentFit="contain" />
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  scene: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    minHeight: 200,
  },
  hero: {
    width: '100%',
    height: '92%',
    maxHeight: 280,
  },
})
