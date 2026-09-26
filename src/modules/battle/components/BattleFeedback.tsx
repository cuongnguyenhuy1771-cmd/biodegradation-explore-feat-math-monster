import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated'

type BattleFeedbackProps = {
  variant: 'correct' | 'incorrect'
  message?: string
  answerLabel?: string
}

export default function BattleFeedback({
  variant,
  message,
  answerLabel,
}: BattleFeedbackProps) {
  const isCorrect = variant === 'correct'

  return (
    <Animated.View
      entering={FadeInDown.duration(280).springify().damping(14)}
      style={[styles.wrap, isCorrect ? styles.wrapCorrect : styles.wrapIncorrect]}
    >
      <View style={styles.row}>
        <Animated.View
          entering={ZoomIn.duration(220).springify()}
          style={[styles.iconCircle, isCorrect ? styles.iconCorrect : styles.iconIncorrect]}
        >
          <Ionicons
            name={isCorrect ? 'checkmark' : 'close'}
            size={16}
            color="#FFFFFF"
          />
        </Animated.View>
        <Text style={[styles.message, isCorrect ? styles.textCorrect : styles.textIncorrect]}>
          {message ?? (isCorrect ? 'Tuyệt vời!' : 'Chưa chính xác!')}
        </Text>
      </View>
      {!isCorrect && answerLabel ? (
        <Text style={styles.answerText}>Đáp án: {answerLabel}</Text>
      ) : null}
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 12,
  },
  wrapCorrect: {
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  wrapIncorrect: {
    backgroundColor: 'rgba(90, 20, 28, 0.92)',
    borderWidth: 1,
    borderColor: 'rgba(255, 100, 100, 0.25)',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  iconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCorrect: {
    backgroundColor: '#58CC02',
  },
  iconIncorrect: {
    backgroundColor: '#E53935',
  },
  message: {
    fontSize: 16,
    fontWeight: '800',
  },
  textCorrect: {
    color: '#58CC02',
  },
  textIncorrect: {
    color: '#FF8A80',
  },
  answerText: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 4,
  },
})
