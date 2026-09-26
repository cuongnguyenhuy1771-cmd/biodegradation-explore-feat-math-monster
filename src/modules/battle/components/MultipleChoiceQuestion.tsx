import React from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { ImageBackground } from 'expo-image'
import type { MultipleChoiceContent } from '../types'
import cardOrange from '@/assets/images/battle/gam-choice/card-orange.png'
import cardYellow from '@/assets/images/battle/gam-choice/card-yellow.png'
import cardBlue from '@/assets/images/battle/gam-choice/card-blue.png'
import cardGreen from '@/assets/images/battle/gam-choice/card-green.png'

const CARDS = [cardOrange, cardYellow, cardBlue, cardGreen] as const
const LETTERS = ['A', 'B', 'C', 'D'] as const
const GRID_ROWS = [
  [0, 1],
  [2, 3],
] as const

const ROW_GAP = 10
const COL_GAP = 10

type MultipleChoiceQuestionProps = {
  content: MultipleChoiceContent
  selectedIndex: number | null
  revealed: boolean
  onSelect: (index: number) => void
}

export default function MultipleChoiceQuestion({
  content,
  selectedIndex,
  revealed,
  onSelect,
}: MultipleChoiceQuestionProps) {
  const renderOption = (index: number) => {
    const option = content.options[index]
    if (option == null) {
      return <View key={`empty-${index}`} style={styles.optionSlot} />
    }

    const isSelected = selectedIndex === index
    const dimmed = revealed && !isSelected

    return (
      <View key={`${option}-${index}`} style={styles.optionSlot}>
        <View style={[styles.optionOuter, isSelected && styles.optionOuterSelected]}>
          <Pressable
            disabled={revealed}
            onPress={() => onSelect(index)}
            style={({ pressed }) => [
              styles.optionPressable,
              dimmed && styles.optionDimmed,
              pressed && !revealed && !isSelected && styles.optionPressed,
            ]}
          >
            <ImageBackground
              source={CARDS[index % CARDS.length]}
              style={styles.optionFace}
              contentFit="stretch"
            >
              <Text style={styles.optionText} numberOfLines={1} adjustsFontSizeToFit>
                {LETTERS[index]}. {option}
              </Text>
            </ImageBackground>
          </Pressable>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.root}>
      <View style={styles.promptBox}>
        <Text style={styles.prompt}>{content.prompt}</Text>
      </View>

      <View style={styles.grid}>
        {GRID_ROWS.map((pair, rowIndex) => (
          <View
            key={rowIndex}
            style={[styles.row, rowIndex < GRID_ROWS.length - 1 && { marginBottom: ROW_GAP }]}
          >
            {pair.map((index) => renderOption(index))}
          </View>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    width: '100%',
    alignSelf: 'stretch',
    gap: 14,
  },
  promptBox: {
    backgroundColor: '#1A1730',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#12101F',
    paddingVertical: 14,
    paddingHorizontal: 12,
  },
  prompt: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 34,
  },
  grid: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    width: '100%',
  },
  optionSlot: {
    flex: 1,
    flexBasis: 0,
    minWidth: 0,
    paddingHorizontal: COL_GAP / 2,
  },
  optionOuter: {
    width: '100%',
    borderRadius: 18,
    borderWidth: 0,
    borderColor: 'transparent',
  },
  optionOuterSelected: {
    borderColor: '#8BE8FF',
    backgroundColor: 'rgba(91, 214, 255, 0.28)',
    shadowColor: '#4FD8FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 10,
  },
  optionPressable: {
    width: '100%',
    borderRadius: 15,
  },
  optionDimmed: {
    opacity: 0.55,
  },
  optionPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.98 }],
  },
  optionFace: {
    minHeight: 56,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  optionText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
    textAlign: 'center',
  },
})
