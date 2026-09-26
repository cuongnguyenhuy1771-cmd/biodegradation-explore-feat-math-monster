import React from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { ImageBackground } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import { SafeAreaView } from 'react-native-safe-area-context'
import { BlurView } from 'expo-blur'
import { router, useLocalSearchParams } from 'expo-router'
import GroupStarRating, {
  GROUP_STAR_ASPECT,
} from '~/assets/icons/group-star/GroupStarRating'
import BadgeTitle from '~/assets/icons/BadgeTitle'
import { ERouteTable, screensHref } from '@/constants/route-table'

export default function BattleResultScreen() {
  const { stars, score, areaIndex, areaId, worldId } = useLocalSearchParams<{
    stars?: string
    score?: string
    areaIndex?: string
    areaId?: string
    worldId?: string
  }>()

  const starCount = Math.min(3, Math.max(0, parseInt(stars ?? '1', 10) || 0))
  const totalScore = parseInt(score ?? '0', 10) || 0
  const areaLabel = areaIndex ? `Khu vực ${areaIndex}` : 'Khu vực'

  const retryBattle = () => {
    if (areaId) {
      router.replace(screensHref(ERouteTable.BATTLE, { areaId }) as never)
      return
    }
    router.back()
  }

  return (
    <View style={styles.root}>
      <ImageBackground
        source={require('@/assets/images/game/game-1/bg-game-1.webp')}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        blurRadius={18}
      />
      <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />

      <SafeAreaView style={styles.safe}>
        <View style={styles.modalOuter}>
          <View style={styles.badge}>
            <BadgeTitle width={200} height={51} />
            <Text style={styles.badgeText}>HOÀN THÀNH</Text>
          </View>

          <View style={styles.modalInner}>
            <View style={styles.starsWrap}>
              <GroupStarRating
                earned={starCount}
                width={220}
                height={220 * GROUP_STAR_ASPECT}
              />
            </View>

            <Text style={styles.areaLabel}>{areaLabel}</Text>

            <View style={styles.scoreBox}>
              <Text style={styles.scoreLabel}>TỔNG ĐIỂM</Text>
              <Text style={styles.scoreValue}>
                {totalScore.toLocaleString('vi-VN')}
              </Text>
            </View>

            <View style={styles.actions}>
              <View style={styles.actionSlot}>
                <Pressable
                  onPress={retryBattle}
                  style={({ pressed }) => [pressed && styles.btnPressed]}
                >
                  <View style={styles.retryShell}>
                    <LinearGradient
                      colors={['#FF9A5C', '#E86A30']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 0, y: 1 }}
                      style={styles.retryFace}
                    >
                      <Text style={styles.actionText}>Thử lại</Text>
                    </LinearGradient>
                    <View style={styles.retryLip} />
                  </View>
                </Pressable>
              </View>

              <View style={styles.actionSlot}>
                <Pressable
                  onPress={() => {
                    if (worldId) {
                      router.replace(
                        screensHref(ERouteTable.AREA_LEVELS, { worldId }) as never,
                      )
                      return
                    }
                    router.replace(ERouteTable.HOME)
                  }}
                  style={({ pressed }) => [pressed && styles.btnPressed]}
                >
                  <View style={styles.nextShell}>
                    <LinearGradient
                      colors={['#74E85A', '#58CC02']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 0, y: 1 }}
                      style={styles.nextFace}
                    >
                      <Text style={styles.actionText}>Tiếp theo</Text>
                    </LinearGradient>
                    <View style={styles.nextLip} />
                  </View>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  modalOuter: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#3E3D61',
    borderRadius: 28,
    borderWidth: 3,
    borderColor: '#9D96F5',
    paddingTop: 28,
    paddingHorizontal: 16,
    paddingBottom: 16,
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: -20,
    alignSelf: 'center',
    width: 200,
    height: 51,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  badgeText: {
    position: 'absolute',
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
    maxWidth: 170,
    textShadowColor: 'rgba(100, 60, 0, 0.35)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  modalInner: {
    width: '100%',
    alignItems: 'center',
    paddingTop: 8,
  },
  starsWrap: {
    marginBottom: 12,
    minHeight: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  areaLabel: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 14,
  },
  scoreBox: {
    width: '100%',
    backgroundColor: '#2A2648',
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#1A1730',
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 18,
  },
  scoreLabel: {
    color: 'rgba(174, 163, 255, 0.75)',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 4,
  },
  scoreValue: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '800',
    lineHeight: 38,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  actionSlot: {
    flex: 1,
    flexBasis: 0,
    minWidth: 0,
  },
  retryShell: {
    borderRadius: 18,
    overflow: 'hidden',
  },
  retryFace: {
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  retryLip: {
    height: 4,
    backgroundColor: '#C45A20',
  },
  nextShell: {
    borderRadius: 18,
    overflow: 'hidden',
  },
  nextFace: {
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextLip: {
    height: 4,
    backgroundColor: '#3FAF00',
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  btnPressed: {
    opacity: 0.9,
  },
})
