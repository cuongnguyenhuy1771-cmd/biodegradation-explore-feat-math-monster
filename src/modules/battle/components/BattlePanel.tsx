import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { ImageBackground } from 'expo-image'
import BadgeTitle from '~/assets/icons/BadgeTitle'
import boardImg from '@/assets/images/Board.png'

type BattlePanelProps = {
  badgeTitle: string
  tall?: boolean
  matching?: boolean
  footer?: React.ReactNode
  children: React.ReactNode
}

export default function BattlePanel({
  badgeTitle,
  tall = false,
  matching = false,
  footer,
  children,
}: BattlePanelProps) {
  return (
    <ImageBackground source={boardImg} style={styles.outer} contentFit="fill">
      <View style={styles.badge}>
        <BadgeTitle width={200} height={51} />
        <Text style={styles.badgeText} numberOfLines={1}>
          {badgeTitle}
        </Text>
      </View>

      <View style={[styles.inner, tall && styles.innerTall, matching && styles.innerMatching]}>
        {children}
      </View>

      {footer ? <View style={styles.footer}>{footer}</View> : null}
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  outer: {
    padding: 16,
    paddingTop: 36,
    paddingBottom: 20,
    marginHorizontal: 16,
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
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
    maxWidth: 170,
    textShadowColor: 'rgba(100, 60, 0, 0.35)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  inner: {
    paddingHorizontal: 12,
    paddingTop: 14,
    paddingBottom: 12,
    minHeight: 160,
    alignItems: 'stretch',
  },
  innerTall: {
    minHeight: 0,
    paddingBottom: 14,
  },
  innerMatching: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    paddingHorizontal: 4,
    paddingTop: 6,
    paddingBottom: 6,
    minHeight: 0,
  },
  footer: {
    paddingTop: 12,
    paddingHorizontal: 4,
  },
})
