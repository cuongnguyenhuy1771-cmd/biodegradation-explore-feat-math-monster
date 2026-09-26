import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native'
import { ImageBackground } from 'expo-image'
import type { MatchingContent } from '../types'
import { shuffleArray } from '../utils'
import cardItem from '@/assets/images/battle/game-matching/card-item.png'
import cardItemSelect from '@/assets/images/battle/game-matching/card-item-select.png'
import cardItemMatch from '@/assets/images/battle/game-matching/card-item-match.png'

const CELL_HEIGHT = 56
const ROW_GAP = 10
const COL_GAP = 10

type CellSide = 'left' | 'right'

type MatchCell = {
  id: string
  pairIndex: number
  side: CellSide
  label: string
}

type CellState = 'default' | 'selected' | 'matched' | 'error'

type MatchingQuestionProps = {
  content: MatchingContent
  completed: boolean
  onComplete: () => void
}

function buildColumns(pairs: MatchingContent['pairs']) {
  const left: MatchCell[] = pairs.map((pair, pairIndex) => ({
    id: `l-${pairIndex}`,
    pairIndex,
    side: 'left' as const,
    label: pair.left,
  }))
  const right: MatchCell[] = pairs.map((pair, pairIndex) => ({
    id: `r-${pairIndex}`,
    pairIndex,
    side: 'right' as const,
    label: pair.right,
  }))

  return {
    left: shuffleArray(left),
    right: shuffleArray(right),
  }
}

export default function MatchingQuestion({
  content,
  completed,
  onComplete,
}: MatchingQuestionProps) {
  const pairsKey = useMemo(
    () => content.pairs.map((p) => `${p.left}|${p.right}`).join(','),
    [content.pairs],
  )

  const columns = useMemo(() => buildColumns(content.pairs), [pairsKey])
  const cells = useMemo(() => [...columns.left, ...columns.right], [columns.left, columns.right])

  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [matchedIds, setMatchedIds] = useState<Set<string>>(new Set())
  const [errorIds, setErrorIds] = useState<Set<string>>(new Set())
  const shakeAnim = useRef(new Animated.Value(0)).current
  const completedRef = useRef(false)

  const rowCount = columns.left.length

  const getCellState = (cell: MatchCell): CellState => {
    if (matchedIds.has(cell.id)) return 'matched'
    if (errorIds.has(cell.id)) return 'error'
    if (selectedId === cell.id) return 'selected'
    return 'default'
  }

  const runShake = () => {
    shakeAnim.setValue(0)
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 1, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -1, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 1, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start()
  }

  const tryMatch = (first: MatchCell, second: MatchCell) => {
    const isValidPair = first.pairIndex === second.pairIndex && first.side !== second.side

    if (isValidPair) {
      const nextMatched = new Set(matchedIds)
      nextMatched.add(first.id)
      nextMatched.add(second.id)
      setMatchedIds(nextMatched)
      setSelectedId(null)

      if (nextMatched.size === cells.length && !completedRef.current) {
        completedRef.current = true
        onComplete()
      }
      return
    }

    setErrorIds(new Set([first.id, second.id]))
    runShake()
    setTimeout(() => {
      setErrorIds(new Set())
      setSelectedId(null)
    }, 500)
  }

  const onPressCell = (cell: MatchCell) => {
    if (completed || matchedIds.has(cell.id)) return

    if (!selectedId) {
      setSelectedId(cell.id)
      return
    }

    if (selectedId === cell.id) {
      setSelectedId(null)
      return
    }

    const first = cells.find((item) => item.id === selectedId)
    if (!first) {
      setSelectedId(cell.id)
      return
    }

    tryMatch(first, cell)
  }

  useEffect(() => {
    completedRef.current = completed
  }, [completed])

  const translateX = shakeAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: [-8, 8],
  })

  const renderCell = (cell: MatchCell) => {
    const state = getCellState(cell)
    let cardImg = cardItem
    if (state === 'selected') {
      cardImg = cardItemSelect
    } else if (state === 'matched') {
      cardImg = cardItemMatch
    }

    return (
      <View style={styles.cellSlot}>
        <Pressable
          disabled={completed || state === 'matched'}
          onPress={() => onPressCell(cell)}
          style={({ pressed }) => [
            styles.cellPressable,
            pressed && state === 'default' && styles.cellPressed,
          ]}
        >
          <ImageBackground
            source={cardImg}
            style={[
              styles.cellFace,
              state === 'selected' && styles.cellSelected,
              state === 'matched' && styles.cellMatched,
              state === 'error' && styles.cellError,
            ]}
            contentFit="stretch"
          >
            <Text
              style={[styles.cellText, state === 'matched' && styles.cellTextMatched]}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.75}
            >
              {cell.label}
            </Text>
          </ImageBackground>
        </Pressable>
      </View>
    )
  }

  return (
    <Animated.View style={[styles.root, { transform: [{ translateX }] }]}>
      {Array.from({ length: rowCount }).map((_, rowIndex) => (
        <View
          key={rowIndex}
          style={[styles.row, rowIndex < rowCount - 1 && { marginBottom: ROW_GAP }]}
        >
          {columns.left[rowIndex] ? (
            renderCell(columns.left[rowIndex])
          ) : (
            <View style={styles.cellSlot} />
          )}
          {columns.right[rowIndex] ? (
            renderCell(columns.right[rowIndex])
          ) : (
            <View style={styles.cellSlot} />
          )}
        </View>
      ))}
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  root: {
    width: '100%',
    alignSelf: 'stretch',
  },
  row: {
    flexDirection: 'row',
    width: '100%',
  },
  cellSlot: {
    flex: 1,
    flexBasis: 0,
    minWidth: 0,
    paddingHorizontal: 16,
  },
  cellPressable: {
    width: '100%',
  },
  cellFace: {
    width: '100%',
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  cellSelected: {
    shadowColor: '#FF9A5C',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.55,
    shadowRadius: 5,
    elevation: 4,
  },
  cellMatched: {
    opacity: 0.48,
    height: 56,
  },
  cellError: {
    borderWidth: 0,
    borderColor: '#E53935',
    borderRadius: 16,
    shadowColor: '#E53935',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.45,
    shadowRadius: 5,
    elevation: 4,
  },
  cellPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.98 }],
  },
  cellText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 22,
    paddingBottom: 2,
  },
  cellTextMatched: {
    color: 'rgba(255, 255, 255, 0.4)',
  },
})
