import React, { PropsWithChildren, useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import BadgeTitle from '~/assets/icons/BadgeTitle'

const ENTER_ANIMATION = {
  duration: 420,
  easing: Easing.out(Easing.cubic),
}

type Props = PropsWithChildren<{
  badge: string
}>

export default function AuthCard({ badge, children }: Props) {
  const translateY = useSharedValue(-32)
  const opacity = useSharedValue(0)

  useEffect(() => {
    translateY.value = withTiming(0, ENTER_ANIMATION)
    opacity.value = withTiming(1, ENTER_ANIMATION)
  }, [opacity, translateY])

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }))

  return (
    <Animated.View style={[styles.wrapper, cardAnimatedStyle]}>
      <View style={styles.outer}>
        <View style={styles.outerBevel} pointerEvents="none" />

        <View style={styles.badgeSlot}>
          <View
            style={styles.badgeWrap}
            accessibilityRole="header"
            accessibilityLabel={badge}
          >
            <BadgeTitle width={200} height={51} />
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        </View>

        <View style={styles.board}>
          <View style={styles.boardBevel} pointerEvents="none" />
          <View style={styles.content}>{children}</View>
        </View>
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 20,
  },
  outer: {
    width: '100%',
    borderRadius: 40,
    padding: 8,
    backgroundColor: '#1B1B36',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 16,
    elevation: 8,
  },
  outerBevel: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 40,
    borderTopWidth: 1.2,
    borderTopColor: 'rgba(0, 0, 0, 0.15)',
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(255, 255, 255, 0.12)',
  },
  badgeSlot: {
    position: 'absolute',
    top: -20,
    left: 0,
    right: 0,
    zIndex: 10,
    alignItems: 'center',
    pointerEvents: 'box-none',
  },
  badgeWrap: {
    width: 200,
    height: 51,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    position: 'absolute',
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    textShadowColor: 'rgba(100, 60, 0, 0.35)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  board: {
    width: '100%',
    minHeight: 352,
    borderRadius: 32,
    backgroundColor: '#232242',
    borderWidth: 1,
    borderColor: 'rgba(123, 97, 255, 0.45)',
    overflow: 'hidden',
  },
  boardBevel: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 32,
    borderTopWidth: 1.2,
    borderTopColor: 'rgba(0, 0, 0, 0.2)',
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(255, 255, 255, 0.15)',
  },
  content: {
    position: 'relative',
    zIndex: 2,
    paddingTop: 52,
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
})
