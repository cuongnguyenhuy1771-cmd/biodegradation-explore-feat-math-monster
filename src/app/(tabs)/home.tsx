import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native'
import { Image, ImageBackground } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { useQuery } from '@tanstack/react-query'
import { Ionicons } from '@expo/vector-icons'
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { useProfile } from '@/hooks/useProfile'
import { MathMonstersService } from '@/services/mathMonsters.service'
import { screensHref, ERouteTable } from '@/constants/route-table'
import images, { getIslandImage } from '@/constants/images'
import { getHeroProfileSource } from '@/constants/hero-assets'
import AuthButton from '@/modules/auth/components/AuthButton'
import { Lock1 } from 'iconsax-react-native'
import IconArrowRightHome from '~/assets/icons/IconArrowRightHome'
import IconArrowLeftHome from '~/assets/icons/IconArrowLeftHome'
import IconStar20 from '~/assets/icons/home/star20'
import IconTaskList from '~/assets/icons/IconTaskList'
import DailyTasksModal from '@/components/daily-tasks/DailyTasksModal'
import { getProfileDisplayName } from '@/utils/profile-display'
import IconStarPoint from '~/assets/icons/IconStarPoint'

const TAB_BAR_SPACE = 108
const CARD_NAV = 40
const WORLD_TRANSITION = {
  duration: 320,
  easing: Easing.out(Easing.cubic),
}

function getSlideDirection(from: number, to: number, total: number): 1 | -1 {
  if (total <= 1 || from === to) return 1
  const forward = (to - from + total) % total
  const backward = (from - to + total) % total
  return forward <= backward ? 1 : -1
}

export default function HomeScreen() {
  const { profile } = useProfile()
  const [worldIndex, setWorldIndex] = useState(0)
  const [dailyTasksVisible, setDailyTasksVisible] = useState(false)
  const [isWorldTransitioning, setIsWorldTransitioning] = useState(false)

  const slideX = useSharedValue(0)
  const cardOpacity = useSharedValue(1)
  const cardScale = useSharedValue(1)
  const bgOpacity = useSharedValue(1)
  const prevWorldIndexRef = useRef(0)
  const isFirstWorldRender = useRef(true)

  const { data: worlds = [], isPending: worldsLoading } = useQuery({
    queryKey: ['worlds'],
    queryFn: () => MathMonstersService.getWorlds(),
  })

  const currentWorld = worlds[worldIndex]

  const { data: worldMeta, isPending: metaLoading } = useQuery({
    queryKey: ['home-world-meta', currentWorld?.id, profile?.id, worlds.length],
    enabled: !!currentWorld?.id && !!profile?.id && worlds.length > 0,
    queryFn: async () => {
      const areasByWorld = await Promise.all(
        worlds.map((world) => MathMonstersService.getAreasWithProgress(world.id, profile!.id)),
      )

      const minSortOrder = Math.min(...worlds.map((w) => w.sort_order))

      const unlockedFlags = worlds.map((world, index) => {
        if (world.sort_order === minSortOrder) return true
        const areas = areasByWorld[index] ?? []
        const firstArea = areas.find((area) => area.order_index === 1)
        return firstArea?.is_unlocked === true
      })

      const currentAreas = areasByWorld[worldIndex] ?? []
      const unlockedAreas = currentAreas.filter((area) => area.is_unlocked)
      const currentArea =
        unlockedAreas.length > 0 ? unlockedAreas[unlockedAreas.length - 1] : currentAreas[0]

      const totalStars = currentAreas.reduce((sum, area) => sum + area.stars_earned, 0)
      const maxStars = currentAreas.length * 3

      return {
        unlockedFlags,
        currentAreaIndex: currentArea?.order_index ?? 1,
        totalAreas: currentAreas.length,
        totalStars,
        maxStars,
      }
    },
  })

  const isUnlocked =
    worldMeta?.unlockedFlags[worldIndex] ??
    currentWorld?.sort_order === Math.min(...worlds.map((w) => w.sort_order), Infinity)
  const islandSource = currentWorld ? getIslandImage(currentWorld.sort_order) : images.islands[1]

  useEffect(() => {
    if (worlds.length === 0) return

    if (isFirstWorldRender.current) {
      isFirstWorldRender.current = false
      prevWorldIndexRef.current = worldIndex
      return
    }

    if (prevWorldIndexRef.current === worldIndex) return

    const direction = getSlideDirection(prevWorldIndexRef.current, worldIndex, worlds.length)
    prevWorldIndexRef.current = worldIndex

    setIsWorldTransitioning(true)
    const offset = direction * 80

    slideX.value = offset
    cardOpacity.value = 0
    cardScale.value = 0.9
    bgOpacity.value = 0.25

    slideX.value = withTiming(0, WORLD_TRANSITION)
    cardOpacity.value = withTiming(1, WORLD_TRANSITION)
    cardScale.value = withTiming(1, WORLD_TRANSITION)
    bgOpacity.value = withTiming(1, WORLD_TRANSITION)

    const timer = setTimeout(() => setIsWorldTransitioning(false), WORLD_TRANSITION.duration)
    return () => clearTimeout(timer)
  }, [worldIndex, worlds.length, slideX, cardOpacity, cardScale, bgOpacity])

  const bgAnimatedStyle = useAnimatedStyle(() => ({
    opacity: bgOpacity.value,
    transform: [{ scale: 1.04 - bgOpacity.value * 0.04 }],
  }))

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [{ translateX: slideX.value }, { scale: cardScale.value }],
  }))

  const lockAnimatedStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value * 0.95,
    transform: [{ scale: 0.94 + cardOpacity.value * 0.06 }],
  }))

  const goPrevWorld = useCallback(() => {
    if (worlds.length === 0 || isWorldTransitioning) return
    setWorldIndex((i) => (i - 1 + worlds.length) % worlds.length)
  }, [worlds.length, isWorldTransitioning])

  const goNextWorld = useCallback(() => {
    if (worlds.length === 0 || isWorldTransitioning) return
    setWorldIndex((i) => (i + 1) % worlds.length)
  }, [worlds.length, isWorldTransitioning])

  const openAreaLevels = () => {
    if (!currentWorld || !isUnlocked) return
    router.push(screensHref(ERouteTable.AREA_LEVELS, { worldId: currentWorld.id }) as never)
  }

  const openDailyTasks = () => {
    setDailyTasksVisible(true)
  }

  const { data: selectedHero } = useQuery({
    queryKey: ['selected-hero', profile?.selected_hero_id],
    enabled: !!profile?.selected_hero_id,
    queryFn: () => MathMonstersService.getHeroById(profile!.selected_hero_id!),
  })

  const heroProfileSource = useMemo(
    () => getHeroProfileSource(selectedHero?.slug),
    [selectedHero?.slug],
  )

  const displayName = getProfileDisplayName(profile)

  const isLoading = worldsLoading || metaLoading
  const displayPoints = useMemo(
    () => (profile?.total_points ?? 0).toLocaleString('vi-VN'),
    [profile?.total_points],
  )

  return (
    <View style={styles.root}>
      <Animated.View style={[StyleSheet.absoluteFill, bgAnimatedStyle]}>
        <ImageBackground source={islandSource} style={StyleSheet.absoluteFill} contentFit="cover">
          {!isUnlocked ? <View style={styles.lockedDim} /> : null}
        </ImageBackground>
      </Animated.View>

      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}>
          <View style={styles.profileBlock}>
            <View style={styles.avatarRing}>
              <Image source={heroProfileSource} style={styles.heroAvatar} contentFit="cover" />
            </View>
            <View style={styles.profilePill}>
              <Text style={styles.profileName} numberOfLines={1}>
                {displayName}
              </Text>
              <View style={styles.levelRow}>
                <IconStarPoint />
                <Text style={styles.levelText}>{profile?.level ?? 1}</Text>
              </View>
            </View>
          </View>

          <View style={styles.headerRight}>
            <View style={styles.pointsBlock}>
              <View style={styles.medalWrap}>
                <Image source={images.medal} style={styles.medalIcon} contentFit="contain" />
              </View>
              <View style={styles.pointsPill}>
                <Text style={styles.pointsText}>{displayPoints}</Text>
              </View>
            </View>
          </View>
        </View>
        <View className="items-end left-4">
          <Pressable
            onPress={openDailyTasks}
            accessibilityRole="button"
            accessibilityLabel="Nhiệm vụ hàng ngày"
          >
            <Image
              source={images.buttons.taskList}
              style={{ height: 110, width: 110 }}
              contentFit="contain"
            />
          </Pressable>
        </View>

        {isLoading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="large" color="#A78BFA" />
          </View>
        ) : (
          <View style={styles.bottomArea}>
            {!isUnlocked ? (
              <Animated.View style={[styles.lockOverlay, lockAnimatedStyle]} pointerEvents="none">
                <View style={styles.lockCircle}>
                  <Lock1 size="80" variant="Bold" color="#FFFFFF29" />
                </View>
              </Animated.View>
            ) : null}

            <View style={styles.cardRow}>
              <Pressable
                onPress={goPrevWorld}
                disabled={isWorldTransitioning}
                style={({ pressed }) => [
                  styles.navBtn,
                  (pressed || isWorldTransitioning) && styles.navBtnPressed,
                ]}
                accessibilityRole="button"
                accessibilityLabel="Thế giới trước"
              >
                <IconArrowLeftHome />
              </Pressable>

              <Animated.View
                style={[
                  styles.worldCardShell,
                  !isUnlocked && styles.worldCardLocked,
                  cardAnimatedStyle,
                ]}
              >
                <LinearGradient
                  colors={['#4B4A83', '#232242']}
                  start={{ x: 0.5, y: 0 }}
                  end={{ x: 0.5, y: 1 }}
                  style={styles.worldCard}
                >
                  <View style={styles.worldCardBevel} pointerEvents="none" />
                  <LinearGradient
                    pointerEvents="none"
                    colors={['rgba(0, 0, 0, 0.24)', 'transparent', 'rgba(0, 0, 0, 0.2)']}
                    locations={[0, 0.42, 1]}
                    style={styles.worldCardInnerShadow}
                  />

                  <View style={styles.worldTitleBarShell}>
                    <ImageBackground source={images.badgeHome} style={styles.worldTitleBar}>
                      <Text style={styles.worldTitle} numberOfLines={1}>
                        {currentWorld?.name ?? 'Thế giới'}
                      </Text>
                      <View style={styles.statsRow}>
                        <Text style={styles.statText}>
                          Khu vực {worldMeta?.currentAreaIndex ?? 1}/{worldMeta?.totalAreas ?? 0}
                        </Text>
                        <Text style={styles.statDivider}>|</Text>
                        <View style={styles.starStat}>
                          <IconStarPoint />
                          <Text style={styles.statText}>
                            {worldMeta?.totalStars ?? 0}/{worldMeta?.maxStars ?? 0}
                          </Text>
                        </View>
                      </View>
                    </ImageBackground>
                  </View>

                  <AuthButton
                    title="Bắt đầu"
                    variant="fixed"
                    disabled={!isUnlocked}
                    onPress={openAreaLevels}
                    width={120}
                    fontSize={18}
                  />
                </LinearGradient>
              </Animated.View>

              <Pressable
                onPress={goNextWorld}
                disabled={isWorldTransitioning}
                style={({ pressed }) => [
                  styles.navBtn,
                  (pressed || isWorldTransitioning) && styles.navBtnPressed,
                ]}
                accessibilityRole="button"
                accessibilityLabel="Thế giới sau"
              >
                <IconArrowRightHome />
              </Pressable>
            </View>
          </View>
        )}

        <View style={{ height: TAB_BAR_SPACE }} />
      </SafeAreaView>

      <DailyTasksModal
        visible={dailyTasksVisible}
        onClose={() => setDailyTasksVisible(false)}
        onGo={openAreaLevels}
      />
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
  lockedDim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#1B1B36CC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingTop: 4,
  },
  profileBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
    maxWidth: '58%',
  },
  avatarRing: {
    width: 54,
    height: 54,
    borderRadius: 14,
    borderWidth: 3,
    borderColor: '#7B61FF',
    overflow: 'hidden',
    backgroundColor: '#3D3568',
    zIndex: 2,
  },
  heroAvatar: {
    width: '100%',
    height: '100%',
  },
  profilePill: {
    justifyContent: 'center',
    backgroundColor: '#1B1B36',
    borderRadius: 22,
    paddingVertical: 8,
    paddingRight: 14,
    paddingLeft: 28,
    marginLeft: -20,
    height: 48,
    flexShrink: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
    width: 100,
  },
  profileName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 22,
  },
  levelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 1,
  },
  levelText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 18,
  },
  headerRight: {
    alignItems: 'flex-end',
    gap: 10,
    paddingTop: 2,
  },
  pointsBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 100,
  },
  medalWrap: {
    width: 40,
    height: 40,
    zIndex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  medalIcon: {
    width: 40,
    height: 40,
  },
  pointsPill: {
    justifyContent: 'center',
    backgroundColor: '#1B1B36',
    borderRadius: 22,
    paddingRight: 14,
    paddingLeft: 24,
    marginLeft: -20,
    height: 28,
    minWidth: 88,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  pointsText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
  },
  taskBtn: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: '#FFB020',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FFB020',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.55,
    shadowRadius: 10,
    elevation: 8,
  },
  taskBtnPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.97 }],
  },
  loadingWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomArea: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 8,
  },
  lockOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 180,
  },
  lockCircle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    gap: 6,
    marginBottom: 40,
  },
  navBtn: {
    width: CARD_NAV,
    height: CARD_NAV,
    borderRadius: CARD_NAV / 2,
    backgroundColor: 'rgba(27, 21, 53, 0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(123, 97, 255, 0.3)',
  },
  navBtnPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.96 }],
  },
  worldCardShell: {
    flex: 1,
    minWidth: 0,
    borderRadius: 32,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  worldCard: {
    borderRadius: 32,
    padding: 16,
    overflow: 'hidden',
  },
  worldCardBevel: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 32,
    borderTopWidth: 1.5,
    borderTopColor: 'rgba(255, 255, 255, 0.15)',
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(0, 0, 0, 0.25)',
  },
  worldCardInnerShadow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 32,
  },
  worldCardLocked: {
    opacity: 0.82,
  },
  worldTitleBarShell: {
    marginBottom: 16,
    borderRadius: 24,
  },
  worldTitleBar: {
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 16,
    overflow: 'hidden',
  },
  worldTitleBarBevel: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 24,
    borderTopWidth: 1.5,
    borderTopColor: 'rgba(255, 255, 255, 0.25)',
    borderBottomWidth: 3,
    borderBottomColor: 'rgba(0, 0, 0, 0.18)',
  },
  worldTitleBarInnerShadow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 24,
  },
  worldTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1.5 },
    textShadowRadius: 2,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    marginTop: 6,
    gap: 12,
  },
  statText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    opacity: 0.95,
  },
  statDivider: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '400',
    opacity: 0.3,
  },
  starStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
})
