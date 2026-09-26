import clsx from 'clsx'
import React from 'react'
import { View } from 'react-native'
import { Iconify } from 'react-native-iconify/native'

export const AppIcons = {
  cart: 'solar:cart-large-bold-duotone',
  donut: 'solar:donut-bold-duotone',
  scooter: 'solar:scooter-bold-duotone',
  videoFramePlay: 'solar:video-frame-play-vertical-bold-duotone',
  cosmetic: 'solar:cosmetic-bold-duotone',
  health: 'solar:health-bold-duotone',
  billList: 'solar:bill-list-bold-duotone',
  home: 'solar:home-bold-duotone',
  peopleNearby: 'solar:people-nearby-bold-duotone',
  moneyBag: 'solar:money-bag-bold-duotone',
  academicCap: 'solar:square-academic-cap-bold-duotone',
  banknote: 'solar:banknote-2-bold-duotone',
  billCheck: 'solar:bill-check-bold-duotone',
  cashOut: 'solar:cash-out-bold-duotone',
  wallet: 'solar:wallet-2-bold-duotone',
  dollar: 'solar:dollar-bold-duotone',
  medalStar: 'solar:medal-ribbons-star-bold-duotone',
  archiveDown: 'solar:archive-down-minimlistic-bold-duotone',
  graphUp: 'solar:graph-new-up-bold-duotone',
  wadMoney: 'solar:wad-of-money-bold-duotone',
  suitcase: 'solar:suitcase-lines-bold-duotone',
  presentation: 'solar:presentation-graph-bold-duotone',
  roundGraph: 'solar:round-graph-bold-duotone',
  diagramUp: 'solar:diagram-up-bold-duotone',
  inbox: 'solar:inbox-in-bold-duotone',
  penSquare: 'solar:pen-new-square-bold-duotone',
  confetti: 'solar:confetti-bold-duotone',
  gift: 'solar:gift-bold-duotone',
  book: 'solar:book-bookmark-bold-duotone',
  buildings: 'solar:buildings-2-bold-duotone',
  hanger: 'solar:hanger-2-bold-duotone',
  body: 'solar:body-bold-duotone',
  videoFrame: 'solar:video-frame-bold-duotone',
  golf: 'solar:golf-bold-duotone',
  pills: 'solar:pills-bold-duotone',
} as const

export type AppIconName = (typeof AppIcons)[keyof typeof AppIcons]

type AppIconifyProps = {
  icon: AppIconName
  size?: number
  color?: string
  className?: string
}

const AppIconify = ({ icon, size = 24, color = '#000', className }: AppIconifyProps) => {
  return (
    <View className={clsx(className)}>
      <Iconify icon={icon} size={size} color={color} />
    </View>
  )
}

export default AppIconify
