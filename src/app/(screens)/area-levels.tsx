import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native'
import { Image, ImageBackground } from 'expo-image'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router, useLocalSearchParams } from 'expo-router'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/context/auth-provider'
import { useProfile } from '@/hooks/useProfile'
import { MathMonstersService, type AreaWithProgress } from '@/services/mathMonsters.service'
import images, { getGameDetailBackground } from '@/constants/images'
import AreaDetailModal from '@/components/area-levels/AreaDetailModal'
import AreaLevelRow from '@/components/area-levels/AreaLevelRow'
import IconArrowLeftHome from '~/assets/icons/IconArrowLeftHome'
import BadgeTitle from '~/assets/icons/BadgeTitle'
import boardImg from '@/assets/images/Board.png'

const AREAS_PER_PAGE = 4

export default function AreaLevelsScreen() {
  const { worldId } = useLocalSearchParams<{ worldId: string }>()
  const { user } = useAuth()
  const { profile } = useProfile()
  const [selectedArea, setSelectedArea] = useState<AreaWithProgress | null>(null)
  const [page, setPage] = useState(0)
  const [listWidth, setListWidth] = useState(0)
  const listRef = useRef<FlatList<AreaWithProgress[]>>(null)

  const { data, isPending } = useQuery({
    queryKey: ['area-levels', worldId, user?.id],
    enabled: !!worldId && !!user?.id,
    queryFn: async () => {
      const [world, areas] = await Promise.all([
        MathMonstersService.getWorldById(worldId!),
        MathMonstersService.getAreasWithProgress(worldId!, user!.id),
      ])
      return { world, areas }
    },
  })

  const worldSortOrder = data?.world?.sort_order ?? 1
  const backgroundSource = useMemo(() => getGameDetailBackground(worldSortOrder), [worldSortOrder])
  const displayPoints = useMemo(
    () => (profile?.total_points ?? 0).toLocaleString('vi-VN'),
    [profile?.total_points],
  )

  const areas = data?.areas ?? []
  const pageCount = Math.max(1, Math.ceil(areas.length / AREAS_PER_PAGE))
  const areaPages = useMemo(() => {
    if (areas.length === 0) return [[]]

    const pages: AreaWithProgress[][] = []
    for (let index = 0; index < areas.length; index += AREAS_PER_PAGE) {
      pages.push(areas.slice(index, index + AREAS_PER_PAGE))
    }
    return pages
  }, [areas])

  useEffect(() => {
    setPage(0)
    if (listWidth > 0) {
      listRef.current?.scrollToOffset({ offset: 0, animated: false })
    }
  }, [worldId, listWidth])

  useEffect(() => {
    if (page > pageCount - 1) {
      const nextPage = Math.max(0, pageCount - 1)
      setPage(nextPage)
      if (listWidth > 0) {
        listRef.current?.scrollToOffset({
          offset: nextPage * listWidth,
          animated: true,
        })
      }
    }
  }, [page, pageCount, listWidth])

  const goToPage = (index: number) => {
    setPage(index)
    if (listWidth > 0) {
      listRef.current?.scrollToOffset({
        offset: index * listWidth,
        animated: true,
      })
    }
  }

  const onPagerScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (listWidth <= 0) return
    const nextPage = Math.round(event.nativeEvent.contentOffset.x / listWidth)
    if (nextPage !== page) {
      setPage(nextPage)
    }
  }

  const openArea = (area: AreaWithProgress) => {
    if (!area.is_unlocked) return
    setSelectedArea(area)
  }

  return (
    <View style={styles.root}>
      <ImageBackground
        source={backgroundSource}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
      />

      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}>
          <Pressable
            onPress={() => router.push('/home')}
            style={({ pressed }) => [pressed && styles.headerBtnPressed]}
            accessibilityRole="button"
            accessibilityLabel="Quay lại"
          >
            <IconArrowLeftHome />
          </Pressable>

          <View style={styles.pointsBlock}>
            <View style={styles.medalWrap}>
              <Image source={images.medal} style={styles.medalIcon} contentFit="contain" />
            </View>
            <View style={styles.pointsPill}>
              <Text style={styles.pointsText}>{displayPoints}</Text>
            </View>
          </View>
        </View>

        {isPending ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="large" color="#A78BFA" />
          </View>
        ) : (
          <View style={styles.panelWrap}>
            <ImageBackground source={boardImg} style={styles.panelOuter} contentFit="fill">
              <View style={styles.worldBadge}>
                <BadgeTitle width={200} height={51} />
                <Text style={styles.worldBadgeText} numberOfLines={1}>
                  {data?.world?.name ?? 'Thế giới'}
                </Text>
              </View>

              <View style={styles.panelInner}>
                <View
                  style={styles.listPager}
                  onLayout={(event) => {
                    const width = event.nativeEvent.layout.width
                    if (width > 0 && width !== listWidth) {
                      setListWidth(width)
                    }
                  }}
                >
                  {listWidth > 0 ? (
                    <FlatList
                      ref={listRef}
                      data={areaPages}
                      horizontal
                      pagingEnabled
                      bounces={pageCount > 1}
                      decelerationRate="fast"
                      showsHorizontalScrollIndicator={false}
                      keyExtractor={(_, index) => `area-page-${index}`}
                      getItemLayout={(_, index) => ({
                        length: listWidth,
                        offset: listWidth * index,
                        index,
                      })}
                      onMomentumScrollEnd={onPagerScrollEnd}
                      renderItem={({ item: pageAreas }) => (
                        <View style={[styles.pageSlide, { width: listWidth }]}>
                          {pageAreas.map((area) => (
                            <AreaLevelRow key={area.id} area={area} onPress={openArea} />
                          ))}
                        </View>
                      )}
                    />
                  ) : null}
                </View>

                <View style={styles.dotsRow}>
                  {Array.from({ length: pageCount }).map((_, index) => (
                    <Pressable
                      key={index}
                      onPress={() => goToPage(index)}
                      style={[styles.dot, index === page && styles.dotActive]}
                      accessibilityRole="button"
                      accessibilityLabel={`Trang ${index + 1}`}
                    />
                  ))}
                </View>
              </View>
            </ImageBackground>
          </View>
        )}
      </SafeAreaView>

      <AreaDetailModal
        visible={!!selectedArea}
        area={selectedArea}
        onClose={() => setSelectedArea(null)}
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
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingTop: 4,
  },
  headerBtnPressed: {
    opacity: 0.85,
  },
  pointsBlock: {
    flexDirection: 'row',
    alignItems: 'center',
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
  heroWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    marginTop: -12,
  },
  monsterImage: {
    width: 220,
    height: 220,
  },
  loadingWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  panelWrap: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  panelOuter: {
    padding: 16,
    paddingTop: 36,
  },
  worldBadge: {
    position: 'absolute',
    top: -20,
    alignSelf: 'center',
    width: 200,
    height: 51,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  worldBadgeText: {
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
  panelInner: {
    paddingHorizontal: 12,
    paddingTop: 14,
    paddingBottom: 16,
    minHeight: 308,
    alignItems: 'stretch',
  },
  listPager: {
    width: '100%',
    alignSelf: 'stretch',
    overflow: 'hidden',
  },
  pageSlide: {
    alignSelf: 'stretch',
    gap: 8,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 12,
    paddingTop: 4,
  },
  dot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: 'rgba(123, 97, 255, 0.3)',
  },
  dotActive: {
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: '#B8AEFF',
  },
})
