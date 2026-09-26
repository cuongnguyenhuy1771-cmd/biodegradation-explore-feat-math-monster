import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Image } from 'expo-image'
import type { LeaderboardProfile } from '@/services/mathMonsters.service'
import { getLeaderboardAvatarSource } from '@/constants/hero-assets'
import images from '@/constants/images'
import { getProfileDisplayName } from '@/utils/profile-display'

type TopPodiumProps = {
  profiles: LeaderboardProfile[]
}

const PODIUM = {
  1: {
    crown: images.rank.crownGold,
    platform: images.rank.podiumGold,
    borderColor: '#5CA8FF',
    scoreColor: '#FFD666',
    stageWidth: 138,
    stageHeight: 194,
    avatarSize: 70,
    crownSize: 48,
    avatarTop: 4,
    labelTop: 126,
    columnOffset: 0,
    columnMaxWidth: 144,
  },
  2: {
    crown: images.rank.crownSilver,
    platform: images.rank.podiumSilver,
    borderColor: '#9B8CFF',
    scoreColor: '#FFD666',
    stageWidth: 114,
    stageHeight: 162,
    avatarSize: 58,
    crownSize: 38,
    avatarTop: 8,
    labelTop: 108,
    columnOffset: 0,
    columnMaxWidth: 120,
  },
  3: {
    crown: images.rank.crownBronze,
    platform: images.rank.podiumBronze,
    borderColor: '#FF9A5C',
    scoreColor: '#FFD666',
    stageWidth: 114,
    stageHeight: 162,
    avatarSize: 58,
    crownSize: 38,
    avatarTop: 8,
    labelTop: 108,
    columnOffset: 16,
    columnMaxWidth: 120,
  },
} as const

function PodiumColumn({
  rank,
  profile,
}: {
  rank: 1 | 2 | 3
  profile: LeaderboardProfile
}) {
  const config = PODIUM[rank]
  const displayName = getProfileDisplayName(profile)
  const score = (profile.total_points ?? 0).toLocaleString('vi-VN')
  const frameRadius = rank === 1 ? 18 : 15

  return (
    <View
      style={[
        styles.column,
        {
          maxWidth: config.columnMaxWidth,
          marginTop: config.columnOffset,
        },
      ]}
    >
      <View
        style={[
          styles.stage,
          { width: config.stageWidth, height: config.stageHeight },
        ]}
      >
        <Image
          source={config.platform}
          style={styles.platform}
          contentFit="contain"
          contentPosition="bottom"
        />

        <View style={[styles.avatarCluster, { top: config.avatarTop }]}>
          <Image
            source={config.crown}
            style={{
              width: config.crownSize,
              height: config.crownSize,
              marginBottom: rank === 1 ? -12 : -10,
            }}
            contentFit="contain"
          />
          <View
            style={[
              styles.avatarFrame,
              {
                width: config.avatarSize,
                height: config.avatarSize,
                borderRadius: frameRadius,
                borderColor: config.borderColor,
                borderWidth: rank === 1 ? 3.5 : 3,
              },
            ]}
          >
            <Image
              source={getLeaderboardAvatarSource(profile.hero_slug)}
              style={styles.avatarImage}
              contentFit="cover"
            />
          </View>
        </View>

        <View style={[styles.labelBlock, { top: config.labelTop }]}>
          <Text
            style={[styles.name, rank === 1 && styles.nameFirst]}
            numberOfLines={1}
          >
            {displayName}
          </Text>
          <Text style={[styles.score, { color: config.scoreColor }]}>{score}</Text>
        </View>
      </View>
    </View>
  )
}

export default function TopPodium({ profiles }: TopPodiumProps) {
  const [p1, p2, p3] = profiles.slice(0, 3)

  if (!p1 && !p2 && !p3) return null

  return (
    <View style={styles.wrap}>
      {p2 ? <PodiumColumn rank={2} profile={p2} /> : <View style={styles.spacer} />}
      {p1 ? <PodiumColumn rank={1} profile={p1} /> : <View style={styles.spacer} />}
      {p3 ? <PodiumColumn rank={3} profile={p3} /> : <View style={styles.spacer} />}
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingHorizontal: 6,
    paddingTop: 4,
    paddingBottom: 8,
    gap: 0,
  },
  column: {
    flex: 1,
    alignItems: 'center',
  },
  spacer: {
    flex: 1,
    maxWidth: 120,
  },
  stage: {
    alignItems: 'center',
    overflow: 'visible',
  },
  platform: {
    ...StyleSheet.absoluteFillObject,
  },
  avatarCluster: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 2,
  },
  avatarFrame: {
    overflow: 'hidden',
    backgroundColor: '#3D3568',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 6,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  labelBlock: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    gap: 5,
    zIndex: 3,
  },
  name: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 16,
    textAlign: 'center',
    maxWidth: '100%',
    paddingHorizontal: 2,
  },
  nameFirst: {
    fontSize: 13,
    lineHeight: 17,
  },
  score: {
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 18,
    textAlign: 'center',
  },
})
