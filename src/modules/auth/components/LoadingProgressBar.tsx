import React from 'react'
import { StyleSheet, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'

type Props = {
  progress: number
}

const FRAME_HEIGHT = 20
const TRACK_HEIGHT = 12
const FRAME_PADDING = 4
const PILL_RADIUS = TRACK_HEIGHT / 2

export default function LoadingProgressBar({ progress }: Props) {
  const clamped = Math.max(0, Math.min(100, progress))

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={['#4B4A83', '#232242']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.frame}
      >
        <View style={styles.track}>
          <LinearGradient
            pointerEvents="none"
            colors={['rgba(0,0,0,0.45)', 'rgba(0,0,0,0.12)', 'transparent']}
            locations={[0, 0.35, 1]}
            style={styles.trackInset}
          />

          {clamped > 0 ? (
            <View style={[styles.fillSlot, { width: `${clamped}%` }]}>
              <LinearGradient
                colors={['#FFD65C', '#FFB922']}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                style={styles.fill}
              />
            </View>
          ) : null}
        </View>
      </LinearGradient>

      <View style={styles.frameBevel} pointerEvents="none" />
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    width: '100%',
    height: FRAME_HEIGHT,
    position: 'relative',
  },
  frame: {
    width: '100%',
    height: FRAME_HEIGHT,
    borderRadius: 999,
    padding: FRAME_PADDING,
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  frameBevel: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 999,
    borderTopWidth: 1.2,
    borderTopColor: 'rgba(0, 0, 0, 0.2)',
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(255, 255, 255, 0.15)',
  },
  track: {
    width: '100%',
    height: TRACK_HEIGHT,
    borderRadius: PILL_RADIUS,
    backgroundColor: '#373664',
    overflow: 'hidden',
  },
  trackInset: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  fillSlot: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: TRACK_HEIGHT,
    minWidth: TRACK_HEIGHT,
    zIndex: 1,
    overflow: 'hidden',
    borderRadius: PILL_RADIUS,
  },
  fill: {
    flex: 1,
    height: TRACK_HEIGHT,
    minWidth: TRACK_HEIGHT,
    borderRadius: PILL_RADIUS,
  },
})
