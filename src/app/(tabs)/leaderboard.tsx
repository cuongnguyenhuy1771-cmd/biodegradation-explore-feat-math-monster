import React, { useMemo } from 'react'
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { Image } from 'expo-image'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/context/auth-provider'
import { useProfile } from '@/hooks/useProfile'
import TopPodium from '@/components/cyber/TopPodium'
import { LeaderboardRow as LeaderboardRowItem } from '@/components/cyber/LeaderboardRow'
import { MathMonstersService } from '@/services/mathMonsters.service'
import images from '@/constants/images'

const TAB_BAR_SPACE = 120

export default function LeaderboardScreen() {
  const { user } = useAuth()
  const { profile } = useProfile()

  const { data: rows = [], isPending } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: () => MathMonstersService.getLeaderboard(50),
  })

  const top3 = useMemo(
    () =>
      rows.slice(0, 3).map((r) => ({
        id: r.id,
        username: r.username,
        full_name: r.full_name,
        avatar_url: r.avatar_url,
        total_points: r.total_points,
        hero_slug: r.hero_slug,
      })),
    [rows],
  )

  const displayPoints = (profile?.total_points ?? 0).toLocaleString('vi-VN')

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.titleBlock}>
          <Text style={styles.title}>Bảng xếp hạng</Text>
          <Text style={styles.subtitle}>Cùng nhau tranh hạng</Text>
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

      {isPending ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color="#A78BFA" />
        </View>
      ) : (
        <>
          <TopPodium profiles={top3} />

          <View style={styles.listBoard}>
            <FlatList
              data={rows}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <LeaderboardRowItem item={item} isMe={item.id === user?.id} />
              )}
              ListEmptyComponent={
                <Text style={styles.emptyText}>
                  Chưa có người chơi trên bảng xếp hạng.
                </Text>
              }
            />
          </View>
        </>
      )}

      <View style={{ height: TAB_BAR_SPACE }} />
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
    paddingBottom: 8,
  },
  titleBlock: {
    flex: 1,
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
    flexShrink: 0,
    marginTop: 2,
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
  loadingWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listBoard: {
    flex: 1,
    marginHorizontal: 16,
    marginTop: 4,
    backgroundColor: 'rgba(27, 21, 53, 0.92)',
    borderRadius: 28,
    borderWidth: 2,
    borderColor: 'rgba(174, 163, 255, 0.2)',
    overflow: 'hidden',
  },
  listContent: {
    padding: 12,
    paddingBottom: 16,
  },
  emptyText: {
    color: 'rgba(255, 255, 255, 0.55)',
    textAlign: 'center',
    paddingVertical: 24,
    fontSize: 14,
  },
})
