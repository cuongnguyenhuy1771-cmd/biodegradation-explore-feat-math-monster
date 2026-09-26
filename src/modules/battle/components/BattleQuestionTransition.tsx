import React from 'react'
import { StyleSheet } from 'react-native'
import Animated, { FadeInUp } from 'react-native-reanimated'

type BattleQuestionTransitionProps = {
  questionKey: string
  children: React.ReactNode
}

export default function BattleQuestionTransition({
  questionKey,
  children,
}: BattleQuestionTransitionProps) {
  return (
    <Animated.View
      key={questionKey}
      entering={FadeInUp.duration(320).springify().damping(16)}
      style={styles.root}
    >
      {children}
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  root: {
    width: '100%',
    alignSelf: 'stretch',
  },
})
