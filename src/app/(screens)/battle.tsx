import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import { useQuery } from '@tanstack/react-query'
import { useProfile } from '@/hooks/useProfile'
import { MathMonstersService } from '@/services/mathMonsters.service'
import { screensHref, ERouteTable } from '@/constants/route-table'
import {
  getGameBackground,
  getGameHeroPose,
  getMonsterImage,
  type GameLevel,
  type HeroPose,
} from '@/constants/images'
import { getHeroClassBySlug } from '@/constants/hero-assets'
import BattleLayout from '@/modules/battle/components/BattleLayout'
import BattlePanel from '@/modules/battle/components/BattlePanel'
import BattleActionButton from '@/modules/battle/components/BattleActionButton'
import BattleFeedback from '@/modules/battle/components/BattleFeedback'
import BattleExitModal from '@/modules/battle/components/BattleExitModal'
import BattleQuestionTransition from '@/modules/battle/components/BattleQuestionTransition'
import MultipleChoiceQuestion from '@/modules/battle/components/MultipleChoiceQuestion'
import TrueFalseQuestion from '@/modules/battle/components/TrueFalseQuestion'
import InputQuestion from '@/modules/battle/components/InputQuestion'
import MatchingQuestion from '@/modules/battle/components/MatchingQuestion'
import type {
  AnswerReveal,
  InputContent,
  MatchingContent,
  MultipleChoiceContent,
  TrueFalseContent,
} from '@/modules/battle/types'
import {
  checkInput,
  checkMultipleChoice,
  checkTrueFalse,
  formatCorrectAnswer,
  isInput,
  isMatching,
  isMultipleChoice,
  isTrueFalse,
  parseQuestion,
} from '@/modules/battle/utils'

export default function BattleScreen() {
  const { areaId } = useLocalSearchParams<{ areaId: string }>()
  const { profile } = useProfile()
  const startedAt = useRef(Date.now())

  const [currentIndex, setCurrentIndex] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [selectedIsTrue, setSelectedIsTrue] = useState<boolean | null>(null)
  const [inputValue, setInputValue] = useState('')
  const [matchingDone, setMatchingDone] = useState(false)
  const [reveal, setReveal] = useState<AnswerReveal>('idle')
  const [lastWasCorrect, setLastWasCorrect] = useState(false)
  const [showExit, setShowExit] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const { data: areaMeta, isPending: areaPending } = useQuery({
    queryKey: ['battle-area', areaId],
    enabled: !!areaId,
    queryFn: async () => {
      const area = await MathMonstersService.getAreaById(areaId!)
      const world = area ? await MathMonstersService.getWorldById(area.world_id) : null
      return { area, world }
    },
  })

  const { data: hero } = useQuery({
    queryKey: ['selected-hero', profile?.selected_hero_id],
    enabled: !!profile?.selected_hero_id,
    queryFn: () => MathMonstersService.getHeroById(profile!.selected_hero_id!),
  })

  const { data: questions = [], isPending: questionsPending } = useQuery({
    queryKey: ['battle-questions', areaId],
    enabled: !!areaId,
    queryFn: () => MathMonstersService.getBattleQuestions(areaId!),
  })

  const parsedQuestions = useMemo(
    () => questions.map(parseQuestion),
    [questions],
  )

  const total = parsedQuestions.length
  const current = parsedQuestions[currentIndex]
  const worldSortOrder = areaMeta?.world?.sort_order ?? 1
  const gameLevel = Math.min(Math.max(worldSortOrder, 1), 6) as GameLevel
  const heroClass = getHeroClassBySlug(hero?.slug)

  const heroPose: HeroPose = useMemo(() => {
    if (reveal === 'correct') return 'true'
    if (reveal === 'incorrect') return 'false'
    return 'default'
  }, [reveal])

  const [timeLeft, setTimeLeft] = useState(60)

  const maxTime = useMemo(() => {
    if (!current) return 60
    // difficulty: 1 = dễ (60s), 2 = trung bình (45s), 3 = khó (30s)
    if (current.difficulty === 2) return 45
    if (current.difficulty === 3) return 30
    return 60
  }, [current])

  const progress = useMemo(() => {
    return Math.max(0, Math.min(100, (timeLeft / maxTime) * 100))
  }, [timeLeft, maxTime])

  const resetQuestionState = useCallback(() => {
    setSelectedIndex(null)
    setSelectedIsTrue(null)
    setInputValue('')
    setMatchingDone(false)
    setReveal('idle')
    setLastWasCorrect(false)
  }, [])

  // useEffect quản lý đếm ngược thời gian
  useEffect(() => {
    if (reveal !== 'idle' || !current) return

    // Thiết lập thời gian ban đầu khi chuyển câu hỏi
    setTimeLeft(maxTime)

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          // Hết giờ: tự động nộp bài
          handleCheck(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [currentIndex, reveal, maxTime])

  const finishBattle = useCallback(
    async (finalCorrect: number) => {
      if (!areaId || total === 0) return
      setSubmitting(true)
      try {
        const durationSeconds = Math.round((Date.now() - startedAt.current) / 1000)
        const score = finalCorrect * 1200
        const result = await MathMonstersService.completeBattle(
          areaId,
          finalCorrect,
          total,
          durationSeconds,
          score,
        )

        router.replace(
          screensHref(ERouteTable.BATTLE_RESULT, {
            stars: String(result.stars_earned),
            score: String(result.points_earned),
            areaIndex: String(areaMeta?.area?.order_index ?? 1),
            areaId,
            worldId: areaMeta?.area?.world_id ?? '',
          }) as never,
        )
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : 'Không thể lưu kết quả'
        Alert.alert('Lỗi', message)
      } finally {
        setSubmitting(false)
      }
    },
    [areaId, areaMeta?.area?.order_index, total],
  )

  const goNextQuestion = useCallback(
    (wasCorrect: boolean, nextCorrect: number) => {
      if (currentIndex + 1 >= total) {
        void finishBattle(nextCorrect)
        return
      }

      setCorrectCount(nextCorrect)
      setCurrentIndex((index) => index + 1)
      resetQuestionState()
    },
    [currentIndex, finishBattle, resetQuestionState, total],
  )

  const canCheck = useMemo(() => {
    if (!current || reveal !== 'idle') return false
    if (current.type === 'multiple_choice') return selectedIndex !== null
    if (current.type === 'true_false') return selectedIsTrue !== null
    if (current.type === 'input') return inputValue.trim().length > 0
    if (current.type === 'matching') return matchingDone
    return false
  }, [current, inputValue, matchingDone, reveal, selectedIndex, selectedIsTrue])

  const handleCheck = (isTimeOut = false) => {
    if (!current || reveal !== 'idle') return
    Keyboard.dismiss()

    let isCorrect = false
    const content = current.content

    if (!isTimeOut) {
      if (isMultipleChoice(content) && selectedIndex !== null) {
        isCorrect = checkMultipleChoice(content, selectedIndex)
      } else if (isTrueFalse(content) && selectedIsTrue !== null) {
        isCorrect = checkTrueFalse(content, selectedIsTrue)
      } else if (isInput(content)) {
        isCorrect = checkInput(content, inputValue)
      } else if (isMatching(content)) {
        isCorrect = matchingDone
      }
    } else {
      // Hết giờ và chưa kịp bấm kiểm tra => mặc định sai
      isCorrect = false
    }

    setLastWasCorrect(isCorrect)
    setReveal(isCorrect ? 'correct' : 'incorrect')
  }

  const handleContinue = () => {
    if (reveal === 'idle') {
      handleCheck(false)
      return
    }

    const nextCorrect = correctCount + (lastWasCorrect ? 1 : 0)
    goNextQuestion(lastWasCorrect, nextCorrect)
  }

  const handleMatchingComplete = () => {
    setMatchingDone(true)
    setLastWasCorrect(true)
    setReveal('correct')
  }

  const actionTitle = useMemo(() => {
    if (submitting) return 'Đang lưu...'
    if (reveal === 'correct') return 'Tiếp tục'
    if (reveal === 'incorrect') return 'Đã hiểu'
    return 'Kiểm tra'
  }, [reveal, submitting])

  const actionVariant = useMemo(() => {
    if (submitting) return 'disabled' as const
    if (reveal === 'incorrect') return 'orange' as const
    if (reveal === 'correct' || canCheck) return 'primary' as const
    return 'disabled' as const
  }, [canCheck, reveal, submitting])

  const badgeTitle =
    current?.type === 'matching' && reveal === 'idle'
      ? 'Chọn cặp tương ứng'
      : 'Trả lời câu hỏi'

  const correctAnswerLabel = current
    ? formatCorrectAnswer(current.type, current.content)
    : ''

  const renderQuestionBody = () => {
    if (!current) return null

    const revealed = reveal !== 'idle'
    const { type, content, id } = current

    switch (type) {
      case 'multiple_choice':
        return (
          <MultipleChoiceQuestion
            content={content as MultipleChoiceContent}
            selectedIndex={selectedIndex}
            revealed={revealed}
            onSelect={setSelectedIndex}
          />
        )

      case 'true_false':
        return (
          <TrueFalseQuestion
            content={content as TrueFalseContent}
            selectedIsTrue={selectedIsTrue}
            revealed={revealed}
            onSelect={setSelectedIsTrue}
          />
        )

      case 'input':
        return (
          <InputQuestion
            content={content as InputContent}
            value={inputValue}
            revealed={revealed}
            onChange={setInputValue}
          />
        )

      case 'matching':
        return (
          <MatchingQuestion
            key={id}
            content={content as MatchingContent}
            completed={revealed}
            onComplete={handleMatchingComplete}
          />
        )

      default:
        return (
          <Text style={styles.fallbackText}>Loại câu hỏi chưa được hỗ trợ.</Text>
        )
    }
  }

  const isLoading = areaPending || questionsPending

  if (isLoading) {
    return (
      <View style={styles.loadingRoot}>
        <ActivityIndicator size="large" color="#A78BFA" />
      </View>
    )
  }

  if (total === 0) {
    return (
      <View style={styles.loadingRoot}>
        <Text style={styles.emptyText}>
          Khu vực chưa có câu hỏi. Thêm câu hỏi qua seed.sql hoặc Dashboard.
        </Text>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.backLink}>Quay lại</Text>
        </Pressable>
      </View>
    )
  }

  const panelFooter = (
    <>
      {reveal !== 'idle' ? (
        <BattleFeedback
          variant={reveal}
          message={
            reveal === 'correct' && current?.type === 'matching'
              ? 'Giỏi quá'
              : undefined
          }
          answerLabel={reveal === 'incorrect' ? correctAnswerLabel : undefined}
        />
      ) : null}

      <BattleActionButton
        title={actionTitle}
        variant={actionVariant}
        loading={submitting}
        disabled={reveal === 'idle' && !canCheck}
        onPress={handleContinue}
      />
    </>
  )

  return (
    <>
      <BattleLayout
        backgroundSource={getGameBackground(worldSortOrder)}
        heroSource={getGameHeroPose(gameLevel, heroClass, heroPose)}
        heroPose={heroPose}
        progress={progress}
        timeLeft={timeLeft}
        onClose={() => setShowExit(true)}
      >
        <BattlePanel
          badgeTitle={badgeTitle}
          tall={current?.type === 'matching'}
          matching={current?.type === 'matching'}
          footer={panelFooter}
        >
          <BattleQuestionTransition questionKey={current.id}>
            {renderQuestionBody()}
          </BattleQuestionTransition>
        </BattlePanel>
      </BattleLayout>

      <BattleExitModal
        visible={showExit}
        onCancel={() => setShowExit(false)}
        onConfirm={() => router.back()}
      />
    </>
  )
}

const styles = StyleSheet.create({
  loadingRoot: {
    flex: 1,
    backgroundColor: '#1A0B2E',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  emptyText: {
    color: 'rgba(255, 255, 255, 0.55)',
    textAlign: 'center',
    marginBottom: 16,
  },
  backLink: {
    color: '#AEA3FF',
    fontWeight: '800',
    fontSize: 16,
  },
  fallbackText: {
    color: '#FFFFFF',
    textAlign: 'center',
  },
})
