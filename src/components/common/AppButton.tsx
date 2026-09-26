import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from 'react-native'
import React from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { clsx } from 'clsx'

export const APP_BUTTON_GRADIENT = ['#D5E94B', '#FFC2F7'] as const

export type AppButtonVariant = 'solid' | 'gradient' | 'outline'

type Props = {
  title: string
  variant?: AppButtonVariant
  textStyle?: string
} & TouchableOpacityProps

const AppButton = ({
  title,
  variant = 'solid',
  textStyle,
  disabled,
  className,
  ...props
}: Props) => {
  const labelClass = clsx(
    'font-semibold text-base',
    textStyle ??
      (variant === 'outline' ? 'text-[#1A202C]' : 'text-[#1A202C]'),
    disabled && 'opacity-60',
  )

  const content =
    disabled && variant !== 'gradient' ? (
      <ActivityIndicator size="small" color="#212B36" />
    ) : (
      <Text className={labelClass}>{title}</Text>
    )

  const baseTouchable = clsx(
    'w-full rounded-3xl min-h-[52px] justify-center items-center overflow-hidden',
    className,
  )

  if (variant === 'gradient') {
    if (disabled) {
      return (
        <View
          className={clsx(baseTouchable, 'bg-[#F4F6F8] justify-center items-center')}
        >
          <Text className="text-[#919EAB] font-semibold text-base">{title}</Text>
        </View>
      )
    }

    return (
      <TouchableOpacity
        activeOpacity={0.85}
        disabled={disabled}
        className={baseTouchable}
        {...props}
      >
        <LinearGradient
          colors={[...APP_BUTTON_GRADIENT]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={{
            width: '100%',
            minHeight: 52,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 24,
            paddingVertical: 14,
          }}
        >
          {content}
        </LinearGradient>
      </TouchableOpacity>
    )
  }

  if (variant === 'outline') {
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        disabled={disabled}
        className={clsx(
          baseTouchable,
          'bg-white border border-[#E2E8F0] px-6 py-3.5',
        )}
        {...props}
      >
        {content}
      </TouchableOpacity>
    )
  }

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      disabled={disabled}
      className={clsx(
        baseTouchable,
        'bg-primary-main px-6 py-3.5',
        disabled && 'opacity-60',
      )}
      {...props}
    >
      {content}
    </TouchableOpacity>
  )
}

export default AppButton
