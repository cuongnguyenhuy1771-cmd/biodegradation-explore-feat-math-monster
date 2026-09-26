import React, { useMemo, useState } from 'react'
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native'
import { Image } from 'expo-image'
import { router } from 'expo-router'
import { useQuery } from '@tanstack/react-query'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { ERouteTable } from '@/constants/route-table'
import { FALLBACK_HEROES, isLocalHeroId } from '@/constants/fallback-heroes'
import { useAuth } from '@/context/auth-provider'
import { useProfile } from '@/hooks/useProfile'
import { MathMonstersService } from '@/services/mathMonsters.service'
import { toast } from '@/components/common/ToastManager'
import AuthScreenLayout from '@/modules/auth/components/AuthScreenLayout'
import AuthButton from '@/modules/auth/components/AuthButton'
import {
  getHeroAssets,
  getHeroClassByIndex,
  getHeroClassBySlug,
  HERO_RIBBON_LABELS,
} from '@/constants/hero-assets'
import IconArrowRight from '~/assets/icons/IconArrowRight'
import IconArrowLeft from '~/assets/icons/IconArrowLeft'

const AVATAR_SIZE = 52
const NAV_SIZE = 48
const FOOTER_BLOCK = 56 + 8

export default function ChooseHeroScreen() {
  const { width, height } = useWindowDimensions()
  const insets = useSafeAreaInsets()
  const { user } = useAuth()
  const { updateProfile } = useProfile()
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [saving, setSaving] = useState(false)

  const layout = useMemo(() => {
    const stageHeight =
      height - insets.top - insets.bottom - 8 - FOOTER_BLOCK
    const heroHeight = Math.min(stageHeight * 0.52, 380)
    const heroWidth = Math.min(width * 0.62, 280)

    return {
      heroWidth,
      heroHeight,
      headerTop: Math.max(insets.top, 6),
    }
  }, [height, insets.bottom, insets.top, width])

  const { data: heroes = [], isPending, isError, error } = useQuery({
    queryKey: ['heroes'],
    queryFn: () => MathMonstersService.getHeroes(),
  })

  const usingFallback = heroes.length === 0 && !isPending
  const displayHeroes = heroes.length > 0 ? heroes : FALLBACK_HEROES

  const current = displayHeroes[selectedIndex]
  const heroClass = current
    ? getHeroClassBySlug(current.slug)
    : getHeroClassByIndex(selectedIndex)
  const heroAssets = getHeroAssets(heroClass)
  const ribbonLabel = HERO_RIBBON_LABELS[heroClass]

  const setupHint = useMemo(() => {
    if (!__DEV__ || !usingFallback) return null
    if (isError) {
      const message = error instanceof Error ? error.message : ''
      if (message.includes('permission denied')) {
        return 'Dev: chạy grants.sql + seed.sql'
      }
      return `Dev: ${message || 'lỗi tải heroes'}`
    }
    return 'Dev: chạy seed.sql'
  }, [error, isError, usingFallback])

  const goPrev = () => {
    if (displayHeroes.length === 0) return
    setSelectedIndex((i) => (i - 1 + displayHeroes.length) % displayHeroes.length)
  }

  const goNext = () => {
    if (displayHeroes.length === 0) return
    setSelectedIndex((i) => (i + 1) % displayHeroes.length)
  }

  const handleConfirm = async () => {
    if (!user?.id || !current) return

    if (usingFallback || isLocalHeroId(current.id)) {
      toast.error(
        'Chưa thiết lập Supabase',
        'Chạy grants.sql và seed.sql trong SQL Editor, sau đó reload app.',
      )
      return
    }

    setSaving(true)
    try {
      await updateProfile({
        userId: user.id,
        updates: {
          selected_hero_id: current.id,
          onboarding_completed_at: new Date().toISOString(),
          hero_selected_at: new Date().toISOString(),
        },
      })
      toast.success('Thành công', `Bạn đã chọn ${current.name}!`)
      router.replace(ERouteTable.HOME)
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Không thể lưu nhân vật'
      toast.error('Lỗi', message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <AuthScreenLayout
      background="chooseHero"
      contentAlign="top"
      footer={
        !isPending ? (
          <AuthButton
            title={saving ? 'Đang lưu...' : 'Xác nhận'}
            variant="block"
            disabled={saving}
            onPress={handleConfirm}
          />
        ) : undefined
      }
    >
      <View style={styles.screen}>
        <View style={[styles.header, { top: layout.headerTop }]}>
          <Text style={styles.title}>Chọn nhân vật</Text>
          {setupHint ? <Text style={styles.devHint}>{setupHint}</Text> : null}
          {!isPending ? (
            <Image
              source={heroAssets.ribbon}
              contentFit="contain"
              style={styles.ribbon}
              accessibilityLabel={ribbonLabel}
            />
          ) : null}
        </View>

        {isPending ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="large" color="#A78BFA" />
          </View>
        ) : (
          <View style={styles.body}>
            <View style={styles.heroZone}>
              <View style={styles.heroRow}>
                <Pressable
                  onPress={goPrev}
                  style={({ pressed }) => [
                    styles.navBtn,
                    pressed && styles.navBtnPressed,
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel="Nhân vật trước"
                >
                  <IconArrowLeft />
                </Pressable>

                <Image
                  source={heroAssets.full}
                  contentFit="contain"
                  contentPosition="bottom"
                  style={{
                    width: 372,
                    height: 372,
                    marginBottom: 60
                  }}
                />

                <Pressable
                  onPress={goNext}
                  style={({ pressed }) => [
                    styles.navBtn,
                    pressed && styles.navBtnPressed,
                  ]}
                  accessibilityRole="button"
                  className="right-10"
                  accessibilityLabel="Nhân vật sau"
                >
                  <IconArrowRight />
                </Pressable>
              </View>
            </View>

            <View className="flex-row justify-center">
              <View style={styles.pickerBar}>
                {displayHeroes.map((hero, index) => {
                  const thumbClass = getHeroClassBySlug(hero.slug)
                  const thumbAsset = getHeroAssets(thumbClass)
                  const selected = index === selectedIndex

                  return (
                    <Pressable
                      key={hero.id}
                      onPress={() => setSelectedIndex(index)}
                      style={[styles.avatarOuter, selected && styles.avatarOuterSelected]}
                    >
                      <Image
                        source={thumbAsset.avatar}
                        contentFit="cover"
                        style={styles.avatarImage}
                      />
                    </Pressable>
                  )
                })}
              </View>
            </View>
          </View>
        )}
      </View>
    </AuthScreenLayout>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 3,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '700',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.45)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  devHint: {
    color: 'rgba(252, 211, 77, 0.85)',
    fontSize: 10,
    textAlign: 'center',
    marginTop: 2,
  },
  ribbon: {
    width: 300,
    height: 86,
    marginTop: 4,
  },
  loadingWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
  },
  heroZone: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 6,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  navBtn: {
    width: NAV_SIZE,
    height: NAV_SIZE,
    borderRadius: NAV_SIZE / 2,
    backgroundColor: '#F5D547',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#8A6D00',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 6,
    borderWidth: 2,
    borderColor: '#FFE566',
  },
  navBtnPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.96 }],
  },
  pickerBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 14,
    marginHorizontal: 24,
    marginBottom: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 22,
    backgroundColor: 'rgba(27, 27, 54, 0.88)',
    borderWidth: 1,
    width: 300,
    borderColor: 'rgba(123, 97, 255, 0.35)',
  },
  avatarOuter: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgba(96, 165, 250, 0.4)',
    overflow: 'hidden',
  },
  avatarOuterSelected: {
    borderWidth: 1.5,
    borderColor: '#AEA3FF',
    shadowColor: '#AEA3FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 10,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
})
