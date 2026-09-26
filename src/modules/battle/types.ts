import type { QuestionType } from '@/types/database.types'

export type MultipleChoiceContent = {
  prompt: string
  options: string[]
  correct_index: number
}

export type TrueFalseContent = {
  prompt: string
  correct: boolean
}

export type InputContent = {
  prompt: string
  correct_answer: string
}

export type MatchingPair = {
  left: string
  right: string
}

export type MatchingContent = {
  prompt: string
  pairs: MatchingPair[]
}

export type QuestionContent =
  | MultipleChoiceContent
  | TrueFalseContent
  | InputContent
  | MatchingContent

export type AnswerReveal = 'idle' | 'correct' | 'incorrect'

export type ParsedQuestion = {
  id: string
  type: QuestionType
  hint: string | null
  content: QuestionContent
  difficulty: number
}
