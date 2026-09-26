import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Image, ImageBackground } from 'expo-image'
import badgeRankMe from '@/assets/images/badge-rank/badge-rank-me.png'
import badgeRankTop1 from '@/assets/images/badge-rank/badge-rank-top1.png'
import badgeRankTop2 from '@/assets/images/badge-rank/badge-rank-top2.png'
import badgeRankTop3 from '@/assets/images/badge-rank/badge-rank-top3.png'
import badgeRankBasic from '@/assets/images/badge-rank/badge-rank-basic.png'
import { getLeaderboardAvatarSource } from '@/constants/hero-assets'
import images from '@/constants/images'
import { getProfileDisplayName } from '@/utils/profile-display'
import type { LeaderboardRow as LeaderboardRowType } from '@/services/mathMonsters.service'

type Props = {
  item: LeaderboardRowType
  isMe: boolean
}

function getRowColors(rank: number, isMe: boolean) {
  if (isMe) {
    return {
      colors: ['#74E85A', '#58CC02'] as const,
      textColor: '#0F2A16',
    }
  }
  if (rank === 1) {
    return {
      colors: ['#FFD766', '#F5B82E'] as const,
      textColor: '#4A3200',
    }
  }
  if (rank === 2) {
    return {
      colors: ['#6EA4FF', '#3D74E8'] as const,
      textColor: '#FFFFFF',
    }
  }
  if (rank === 3) {
    return {
      colors: ['#FF9A5C', '#E86A30'] as const,
      textColor: '#FFFFFF',
    }
  }
  return {
    colors: ['#3A3568', '#2A2648'] as const,
    textColor: '#FFFFFF',
  }
}

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) {
    return (
      <Image
        source={images.rank.listBadgeGold}
        style={styles.rankBadgeImage}
        contentFit="contain"
      />
    )
  }
  if (rank === 2) {
    return (
      <Image
        source={images.rank.listBadgeSilver}
        style={styles.rankBadgeImage}
        contentFit="contain"
      />
    )
  }
  if (rank === 3) {
    return (
      <Image
        source={images.rank.listBadgeBronze}
        style={styles.rankBadgeImage}
        contentFit="contain"
      />
    )
  }

  return (
    <View style={styles.rankBadgePlain}>
      <Text style={styles.rankBadgeText}>{rank}</Text>
    </View>
  )
}

export function LeaderboardRow({ item, isMe }: Props) {
  const displayName = getProfileDisplayName(item)
  const score = (item.total_points ?? 0).toLocaleString('vi-VN')
  const rank = item.rank ?? 0
  const rowColors = getRowColors(rank, isMe)

  let rowBg = badgeRankBasic
  if (isMe) {
    rowBg = badgeRankMe
  } else if (rank === 1) {
    rowBg = badgeRankTop1
  } else if (rank === 2) {
    rowBg = badgeRankTop2
  } else if (rank === 3) {
    rowBg = badgeRankTop3
  }

  return (
    <View style={styles.rowShell}>

      <ImageBackground source={rowBg} style={styles.rowCard} contentFit="fill">
        <RankBadge rank={rank} />

        <Image
          source={getLeaderboardAvatarSource(item.hero_slug)}
          style={styles.avatar}
          contentFit="cover"
        />

        <Text style={[styles.name, { color: rowColors.textColor }]} numberOfLines={1}>
          {displayName}
        </Text>

        <View style={styles.scorePill}>
          <Image source={images.medal} style={styles.scoreMedal} contentFit="contain" />
          <Text style={styles.scoreText}>{score}</Text>
        </View>
      </ImageBackground>
    </View>
  )
}

const styles = StyleSheet.create({
  rowShell: {
    marginBottom: 8,
    position: 'relative',
  },
  mePointer: {
    position: 'absolute',
    left: -6,
    top: '50%',
    marginTop: -8,
    width: 0,
    height: 0,
    borderTopWidth: 8,
    borderBottomWidth: 8,
    borderRightWidth: 10,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRightColor: '#58CC02',
    zIndex: 2,
  },
  rowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 12,
    gap: 10,
    minHeight: 64,
  },
  rankBadgeImage: {
    width: 40,
    height: 44,
  },
  rankBadgePlain: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankBadgeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#7B61FF',
  },
  name: {
    flex: 1,
    fontSize: 15,
    fontWeight: '800',
  },
  scorePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderRadius: 16,
    paddingVertical: 4,
    paddingLeft: 4,
    paddingRight: 10,
    gap: 2,
    minWidth: 72,
  },
  scoreMedal: {
    width: 28,
    height: 28,
  },
  scoreText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#fff',
  },
})
