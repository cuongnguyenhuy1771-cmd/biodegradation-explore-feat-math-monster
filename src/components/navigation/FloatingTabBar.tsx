import React, { useEffect, useMemo } from 'react'
import {
  PixelRatio,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native'
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { LinearGradient } from 'expo-linear-gradient'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Game, Ghost, Profile, Rank } from 'iconsax-react-native'

export type FloatingTabBarProps = {
  state: {
    index: number
    routes: { key: string; name: string; params?: object }[]
  }
  descriptors: Record<
    string,
    {
      options: {
        title?: string
        tabBarAccessibilityLabel?: string
      }
    }
  >
  navigation: {
    emit: (event: {
      type: string
      target: string
      canPreventDefault?: boolean
    }) => { defaultPrevented: boolean }
    navigate: (name: string, params?: object) => void
  }
}

const TAB_ICONS = {
  home: Game,
  collection: Ghost,
  leaderboard: Rank,
  profile: Profile,
} as const

const PILL_W = 256
const PILL_H = 64
const PAD = 4
const GAP = 8
const BUBBLE = 56
const FLOAT_GAP = 0

const TAB_BG = '#1B1B36'
const GRADIENT_TOP = '#AEA3FF'
const GRADIENT_BOTTOM = '#7B61FF'
const INACTIVE = '#7B75A8'

const TIMING = { duration: 220, easing: Easing.out(Easing.cubic) }

type TabRouteName = keyof typeof TAB_ICONS

function px(value: number) {
  return PixelRatio.roundToNearestPixel(value)
}

function useLayout(screenWidth: number) {
  return useMemo(() => {
    const scale =
      screenWidth < PILL_W + 56 ? (screenWidth - 56) / PILL_W : 1
    const w = px(PILL_W * scale)
    const h = px(PILL_H * scale)
    const pad = px(PAD * scale)
    const gap = px(GAP * scale)
    const bubble = px(BUBBLE * scale)
    const step = px(bubble + gap)
    const radius = px(h / 2)
    const bubbleTop = px((h - bubble) / 2)

    return { w, h, pad, gap, bubble, step, radius, bubbleTop }
  }, [screenWidth])
}

function bubbleLeft(pad: number, step: number, index: number) {
  return px(pad + index * step)
}

export default function FloatingTabBar({
  state,
  descriptors,
  navigation,
}: FloatingTabBarProps) {
  const insets = useSafeAreaInsets()
  const { width: screenWidth } = useWindowDimensions()
  const layout = useLayout(screenWidth)
  const translateX = useSharedValue(bubbleLeft(layout.pad, layout.step, 0))

  useEffect(() => {
    translateX.value = withTiming(
      bubbleLeft(layout.pad, layout.step, state.index),
      TIMING,
    )
  }, [layout.pad, layout.step, state.index, translateX])

  const bubbleStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }))

  return (
    <View
      pointerEvents="box-none"
      style={[styles.host, { bottom: insets.bottom + FLOAT_GAP }]}
    >
      <View
        style={[
          styles.pill,
          {
            width: layout.w,
            height: layout.h,
            borderRadius: layout.radius,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.bubble,
            {
              width: layout.bubble,
              height: layout.bubble,
              top: layout.bubbleTop,
              borderRadius: layout.bubble / 2,
            },
            bubbleStyle,
          ]}
        >
          <LinearGradient
            colors={[GRADIENT_TOP, GRADIENT_BOTTOM]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={[
              StyleSheet.absoluteFill,
              { borderRadius: layout.bubble / 2 },
            ]}
          />
        </Animated.View>

        <View style={[styles.tabs, { padding: layout.pad }]}>
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key]
            const focused = state.index === index
            const Icon = TAB_ICONS[route.name as TabRouteName] ?? Game

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              })
              if (!focused && !event.defaultPrevented) {
                navigation.navigate(route.name, route.params)
              }
            }

            return (
              <Pressable
                key={route.key}
                onPress={onPress}
                onLongPress={() =>
                  navigation.emit({
                    type: 'tabLongPress',
                    target: route.key,
                  })
                }
                style={[
                  styles.tab,
                  {
                    width: layout.bubble,
                    height: layout.bubble,
                    marginRight: index < state.routes.length - 1 ? layout.gap : 0,
                  },
                ]}
                accessibilityRole="button"
                accessibilityState={{ selected: focused }}
                accessibilityLabel={
                  options.tabBarAccessibilityLabel ?? options.title
                }
              >
                <Icon
                  size={24}
                  color={focused ? '#FFFFFF' : INACTIVE}
                  variant='Bold'
                />
              </Pressable>
            )
          })}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  host: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  pill: {
    backgroundColor: TAB_BG,
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  bubble: {
    position: 'absolute',
    left: 0,
    overflow: 'hidden',
    zIndex: 0,
  },
  tabs: {
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1,
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
  },
})
