import React from 'react'
import { StyleSheet, View } from 'react-native'
import GroupStarRating from '~/assets/icons/group-star/GroupStarRating'

type AreaLevelStarsProps = {
  earned: number
  width?: number
  active?: boolean
  dimmed?: boolean
}

export default function AreaLevelStars({
  earned,
  width = 62,
  active = true,
  dimmed = false,
}: AreaLevelStarsProps) {
  const displayEarned = active ? earned : 0

  return (
    <View style={dimmed ? styles.dimmed : undefined}>
      <GroupStarRating earned={displayEarned} width={width} />
    </View>
  )
}

const styles = StyleSheet.create({
  dimmed: {
    opacity: 0.5,
  },
})
