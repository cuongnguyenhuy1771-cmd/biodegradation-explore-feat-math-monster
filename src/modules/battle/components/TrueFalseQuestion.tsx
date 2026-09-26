import React from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { ImageBackground } from 'expo-image'
import type { TrueFalseContent } from '../types'
import cardCorrectActive from '@/assets/images/battle/game-correct/card-correct-active.png'
import cardCorrect from '@/assets/images/battle/game-correct/card-correct.png'
import cardUncorrectActive from '@/assets/images/battle/game-correct/card-uncorrect-active.png'
import cardUncorrect from '@/assets/images/battle/game-correct/card-uncorrect.png'

const COL_GAP = 12

type TrueFalseQuestionProps = {
  content: TrueFalseContent
  selectedIsTrue: boolean | null
  revealed: boolean
  onSelect: (isTrue: boolean) => void
}

export default function TrueFalseQuestion({
  content,
  selectedIsTrue,
  revealed,
  onSelect,
}: TrueFalseQuestionProps) {
  const choices = [
    { value: false, activeImg: cardUncorrect, inactiveImg: cardUncorrect },
    { value: true, activeImg: cardCorrect, inactiveImg: cardCorrect },
  ] as const

  return (
    <View style={styles.root}>
      <View style={styles.promptBox}>
        <Text style={styles.prompt}>{content.prompt}</Text>
      </View>

      <View style={styles.row}>
        {choices.map((choice) => {
          const isSelected = selectedIsTrue === choice.value
          const dimmed = revealed && !isSelected
          const imageSource = isSelected ? choice.activeImg : choice.inactiveImg

          return (
            <View key={choice.value ? 'true' : 'false'} style={styles.choiceSlot}>
              <View style={[styles.choiceOuter, isSelected && styles.choiceOuterSelected]}>
                <Pressable
                  disabled={revealed}
                  onPress={() => onSelect(choice.value)}
                  style={({ pressed }) => [
                    styles.choicePressable,
                    dimmed && styles.choiceDimmed,
                    pressed && !revealed && !isSelected && styles.choicePressed,
                  ]}
                >
                  <ImageBackground
                    source={imageSource}
                    style={styles.choiceFace}
                    contentFit="stretch"
                  />
                </Pressable>
              </View>
            </View>
          )
        })}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    width: '100%',
    alignSelf: 'stretch',
    gap: 16,
  },
  promptBox: {
    backgroundColor: '#1A1730',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#12101F',
    paddingVertical: 14,
    paddingHorizontal: 12,
    height: 126,
    justifyContent: 'center',
  },
  prompt: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 34,
  },
  row: {
    flexDirection: 'row',
    width: '100%',
  },
  choiceSlot: {
    flex: 1,
    flexBasis: 0,
    minWidth: 0,
    paddingHorizontal: COL_GAP / 2,
  },
  choiceOuter: {
    width: '100%',
    borderRadius: 18,
    borderWidth: 0,
    borderColor: 'transparent',
  },
  choiceOuterSelected: {
    borderColor: '#8BE8FF',
    backgroundColor: 'rgba(91, 214, 255, 0.28)',
    shadowColor: '#4FD8FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 10,
  },
  choicePressable: {
    width: '100%',
    borderRadius: 15,
  },
  choiceDimmed: {
    opacity: 0.55,
  },
  choicePressed: {
    opacity: 0.92,
    transform: [{ scale: 0.98 }],
  },
  choiceFace: {
    borderRadius: 14,
    minHeight: 56,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  selectedSheen: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    borderRadius: 14,
  },
  choiceLip: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 4,
  },
  choiceText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
  },
})
