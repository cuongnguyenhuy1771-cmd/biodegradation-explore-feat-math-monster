import React, { useMemo } from 'react'
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native'
import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useQuery } from '@tanstack/react-query'
import { Lock1 } from 'iconsax-react-native'
import { useAuth } from '@/context/auth-provider'
import { useProfile } from '@/hooks/useProfile'
import { MathMonstersService } from '@/services/mathMonsters.service'
import images, { getMonsterImage } from '@/constants/images'

const TAB_BAR_SPACE = 120
const BOARD_MARGIN = 16
const BOARD_PADDING = 16
const CARD_GAP = 12

const COLLECTION_ITEMS = [
  { sortOrder: 1, label: 'Rừng' },
  { sortOrder: 2, label: 'Sa Mạc' },
  { sortOrder: 3, label: 'Hang Băng' },
  { sortOrder: 4, label: 'Hẻm Núi' },
  { sortOrder: 5, label: 'Núi Lửa' },
  { sortOrder: 6, label: 'Trạm Sao' },
] as const

type CollectionCard = {
  sortOrder: number
  label: string
  isUnlocked: boolean
  image: ReturnType<typeof getMonsterImage>
}

export default function CollectionScreen() {
  const { width: windowWidth } = useWindowDimensions()
  const { user } = useAuth()
  const { profile } = useProfile()

  const boardContentWidth = windowWidth - BOARD_MARGIN * 2 - BOARD_PADDING * 2
  const cardWidth = (boardContentWidth - CARD_GAP) / 2

  const { data: monsters = [], isPending } = useQuery({
    queryKey: ['collection', user?.id],
    enabled: !!user?.id,
    queryFn: () => MathMonstersService.getMonstersWithCollection(user!.id),
  })

  const cards = useMemo<CollectionCard[]>(() => {
    return COLLECTION_ITEMS.map((item) => {
      const monster = monsters.find((m) => m.sort_order === item.sortOrder)
      return {
        sortOrder: item.sortOrder,
        label: item.label,
        isUnlocked: monster?.isUnlocked ?? false,
        image: getMonsterImage(item.sortOrder),
      }
    })
  }, [monsters])

  const conqueredCount = cards.filter((c) => c.isUnlocked).length
  const displayPoints = (profile?.total_points ?? 0).toLocaleString('vi-VN')

  const renderCard = ({ item }: { item: CollectionCard }) => (
    <View style={[styles.card, { width: cardWidth, height: cardWidth }]}>
      <Image
        source={item.image}
        style={styles.cardImage}
        contentFit="cover"
      />

      {!item.isUnlocked ? (
        <>
          <View style={styles.lockedDim} />
          <View style={styles.lockOverlay}>
            <Lock1 size={44} variant="Bold" color="#FFFFFF40" />
          </View>
        </>
      ) : null}

      <View style={styles.labelWrap}>
        {item.isUnlocked ? (
          <LinearGradient
            colors={['#F5D547', '#E8A820']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.labelPill}
          >
            <Text style={styles.labelTextUnlocked}>{item.label}</Text>
          </LinearGradient>
        ) : (
          <View style={styles.labelPillLocked}>
            <Text style={styles.labelTextLocked}>{item.label}</Text>
          </View>
        )}
      </View>
    </View>
  )

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.titleBlock}>
          <Text style={styles.title}>Bộ sưu tập</Text>
          <Text style={styles.subtitle}>
            Bạn đã chinh phục {conqueredCount}/{COLLECTION_ITEMS.length}
          </Text>
        </View>

        <View style={styles.pointsBlock}>
          <View style={styles.medalWrap}>
            <Image
              source={images.medal}
              style={styles.medalIcon}
              contentFit="contain"
            />
          </View>
          <View style={styles.pointsPill}>
            <Text style={styles.pointsText}>{displayPoints}</Text>
          </View>
        </View>
      </View>

      <View style={styles.board}>
        {isPending ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="large" color="#A78BFA" />
          </View>
        ) : (
          <FlatList
            data={cards}
            keyExtractor={(item) => String(item.sortOrder)}
            numColumns={2}
            renderItem={renderCard}
            showsVerticalScrollIndicator={false}
            columnWrapperStyle={styles.columnWrapper}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#4B3F8F',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 16,
  },
  titleBlock: {
    flex: 1,
    flexShrink: 1,
    paddingRight: 12,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 34,
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.55)',
    fontSize: 15,
    fontWeight: '600',
    marginTop: 4,
  },
  pointsBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    flexShrink: 0,
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
  board: {
    flex: 1,
    alignSelf: 'stretch',
    marginHorizontal: BOARD_MARGIN,
    backgroundColor: 'rgba(27, 21, 53, 0.92)',
    borderRadius: 40,
    padding: BOARD_PADDING,
    borderWidth: 1,
    borderColor: 'rgba(2, 1, 2, 0.2)',
    overflow: 'hidden',
    marginBottom: 8,
  },
  loadingWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    paddingBottom: TAB_BAR_SPACE,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: CARD_GAP,
  },
  card: {
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: '#2A2448',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  lockedDim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 12, 30, 0.62)',
  },
  lockOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 28,
  },
  labelWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 10,
    alignItems: 'center',
  },
  labelPill: {
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 18,
    minWidth: 88,
    alignItems: 'center',
    shadowColor: '#E8A820',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 4,
  },
  labelPillLocked: {
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 18,
    minWidth: 88,
    alignItems: 'center',
    backgroundColor: 'rgba(70, 58, 48, 0.72)',
  },
  labelTextUnlocked: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  labelTextLocked: {
    color: 'rgba(255, 255, 255, 0.45)',
    fontSize: 14,
    fontWeight: '700',
  },
})
