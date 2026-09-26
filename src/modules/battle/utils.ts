import type { BattleQuestion } from '@/services/mathMonsters.service'
import type {
  InputContent,
  MatchingContent,
  MultipleChoiceContent,
  ParsedQuestion,
  QuestionContent,
  TrueFalseContent,
} from './types'

export function parseQuestion(raw: BattleQuestion): ParsedQuestion {
  return {
    id: raw.id,
    type: raw.type,
    hint: raw.hint,
    content: raw.content as QuestionContent,
    difficulty: raw.difficulty,
  }
}

export function isMultipleChoice(
  content: QuestionContent,
): content is MultipleChoiceContent {
  return 'options' in content && 'correct_index' in content
}

export function isTrueFalse(content: QuestionContent): content is TrueFalseContent {
  return 'correct' in content && !('options' in content)
}

export function isInput(content: QuestionContent): content is InputContent {
  return 'correct_answer' in content
}

export function isMatching(content: QuestionContent): content is MatchingContent {
  return 'pairs' in content
}

export function normalizeAnswer(value: string): string {
  return value.trim().replace(/\s+/g, '')
}

export function checkMultipleChoice(
  content: MultipleChoiceContent,
  selectedIndex: number,
): boolean {
  return selectedIndex === content.correct_index
}

export function checkTrueFalse(
  content: TrueFalseContent,
  selectedIsTrue: boolean,
): boolean {
  return selectedIsTrue === content.correct
}

export function checkInput(content: InputContent, answer: string): boolean {
  return normalizeAnswer(answer) === normalizeAnswer(content.correct_answer)
}

export function formatCorrectAnswer(
  type: ParsedQuestion['type'],
  content: QuestionContent,
): string {
  if (isMultipleChoice(content)) {
    return content.options[content.correct_index] ?? ''
  }
  if (isTrueFalse(content)) {
    return content.correct ? 'Đúng' : 'Sai'
  }
  if (isInput(content)) {
    return content.correct_answer
  }
  return ''
}

export function shuffleArray<T>(items: T[]): T[] {
  const next = [...items]
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[next[i], next[j]] = [next[j], next[i]]
  }
  return next
}
