import React from 'react'
import type { SvgProps } from 'react-native-svg'
import GroupStarNoPoint from './GroupStarNoPoint'
import GroupStar1Point from './GroupStar1Point'
import GroupStar2Point from './GroupStar2Point'
import GroupStar3Point from './GroupStar3Point'

const STAR_ICONS = [
  GroupStarNoPoint,
  GroupStar1Point,
  GroupStar2Point,
  GroupStar3Point,
] as const

export const GROUP_STAR_WIDTH = 64
export const GROUP_STAR_HEIGHT = 33
export const GROUP_STAR_ASPECT = GROUP_STAR_HEIGHT / GROUP_STAR_WIDTH

export type GroupStarRatingProps = SvgProps & {
  earned?: number
}

export default function GroupStarRating({
  earned = 0,
  width = GROUP_STAR_WIDTH,
  height,
  ...props
}: GroupStarRatingProps) {
  const points = Math.min(3, Math.max(0, Math.round(earned)))
  const Icon = STAR_ICONS[points]
  const resolvedHeight = height ?? width * GROUP_STAR_ASPECT

  return <Icon width={width} height={resolvedHeight} {...props} />
}
