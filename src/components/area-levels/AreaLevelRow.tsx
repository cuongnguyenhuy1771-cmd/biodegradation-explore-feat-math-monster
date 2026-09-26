import React from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { ImageBackground } from 'expo-image'
import { Lock1, Unlock } from 'iconsax-react-native'
import type { AreaWithProgress } from '@/services/mathMonsters.service'
import AreaLevelStars from '@/components/area-levels/AreaLevelStars'
import areaItemImg from '~/assets/images/area-item.png'
import areaItemDeactiveImg from '~/assets/images/area-item-deactive.png'

type AreaLevelRowProps = {
  area: AreaWithProgress
  onPress: (area: AreaWithProgress) => void
}

export default function AreaLevelRow({ area, onPress }: AreaLevelRowProps) {
  const unlocked = area.is_unlocked
  const label = `Khu vực ${area.order_index}`

  return (
    <Pressable
      onPress={() => onPress(area)}
      disabled={!unlocked}
      style={({ pressed }) => [styles.row, pressed && unlocked && styles.rowPressed]}
    >
      {unlocked ? (
        <ImageBackground source={areaItemImg} style={styles.rowSurface}>
          <RowContent label={label} unlocked stars={area.stars_earned} />
        </ImageBackground>
      ) : (
        <ImageBackground source={areaItemDeactiveImg} style={styles.rowSurface}>
          <RowContent label={label} unlocked={false} stars={area.stars_earned} />
        </ImageBackground>
      )}
    </Pressable>
  )
}

function RowContent({
  label,
  unlocked,
  stars,
}: {
  label: string
  unlocked: boolean
  stars: number
}) {
  return (
    <View style={styles.rowContent}>
      <View style={[styles.lockBox, unlocked ? styles.lockBoxUnlocked : styles.lockBoxLocked]}>
        {unlocked ? (
          <Unlock size={20} variant="Bold" color={unlocked ? '#E8ECF8' : '#5A5878'} />
        ) : (
          <Lock1 size={20} color={unlocked ? '#E8ECF8' : '#5A5878'} variant="Bold" />
        )}
      </View>

      <Text
        style={[styles.label, unlocked ? styles.labelUnlocked : styles.labelLocked]}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {label}
      </Text>

      <View style={styles.starsWrap}>
        <AreaLevelStars earned={stars} active={unlocked} width={72} dimmed={!unlocked} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    width: '100%',
    marginBottom: 8,
  },
  rowPressed: {
    opacity: 0.94,
  },
  rowSurface: {
    borderRadius: 20,
    minHeight: 58,
    overflow: 'hidden',
  },
  rowInset: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
  },
  rowContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 9,
    gap: 14,
    minHeight: 58,
  },
  lockBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    borderWidth: 1,
  },
  lockBoxUnlocked: {
    backgroundColor: '#353465',
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    borderBottomColor: 'rgba(0, 0, 0, 0.35)',
    borderLeftColor: 'rgba(0, 0, 0, 0.15)',
    borderRightColor: 'rgba(0, 0, 0, 0.15)',
  },
  lockBoxLocked: {
    backgroundColor: '#12101F',
    borderTopColor: 'rgba(255, 255, 255, 0.04)',
    borderBottomColor: 'rgba(0, 0, 0, 0.42)',
    borderLeftColor: 'rgba(0, 0, 0, 0.2)',
    borderRightColor: 'rgba(0, 0, 0, 0.2)',
  },
  label: {
    flex: 1,
    minWidth: 0,
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 24,
    includeFontPadding: false,
  },
  labelUnlocked: {
    color: '#FFFFFF',
  },
  labelLocked: {
    color: '#5A5A7A',
  },
  starsWrap: {
    width: 72,
    alignItems: 'flex-end',
    justifyContent: 'center',
    flexShrink: 0,
  },
})
