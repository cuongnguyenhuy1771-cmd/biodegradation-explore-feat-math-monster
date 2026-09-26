import React from 'react'
import { Pressable, StyleSheet, Text } from 'react-native'
import { ImageBackground } from 'expo-image'
import buttonCheck from '@/assets/images/battle/button-check.png'
import buttonContinue from '@/assets/images/battle/button-continue.png'
import buttonDisabled from '@/assets/images/battle/button-disabled.png'
import buttonOrange from '@/assets/images/battle/button-orange.png'

type BattleActionButtonProps = {
  title: string
  disabled?: boolean
  loading?: boolean
  variant?: 'primary' | 'orange' | 'disabled'
  onPress: () => void
}

export default function BattleActionButton({
  title,
  disabled = false,
  loading = false,
  variant = 'primary',
  onPress,
}: BattleActionButtonProps) {
  const isDisabled = disabled || loading || variant === 'disabled'

  let buttonSource = buttonCheck
  if (isDisabled) {
    buttonSource = buttonDisabled
  } else if (variant === 'orange' || title === 'Đã hiểu') {
    buttonSource = buttonOrange
  } else if (title === 'Tiếp tục') {
    buttonSource = buttonContinue
  } else {
    buttonSource = buttonCheck
  }

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [styles.shell, pressed && !isDisabled && styles.pressed]}
    >
      <ImageBackground
        source={buttonSource}
        style={styles.face}
        contentFit="stretch"
      ></ImageBackground>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  shell: {
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
  },
  face: {
    minHeight: 56,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    overflow: 'hidden',
  },
  label: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
  },
  labelDisabled: {
    color: 'rgba(255, 255, 255, 0.4)',
  },
  pressed: {
    opacity: 0.9,
  },
})
