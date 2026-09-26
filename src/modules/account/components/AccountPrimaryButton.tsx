import React from 'react'
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'

type AccountPrimaryButtonProps = {
  title: string
  onPress: () => void
  disabled?: boolean
  loading?: boolean
}

export default function AccountPrimaryButton({
  title,
  onPress,
  disabled = false,
  loading = false,
}: AccountPrimaryButtonProps) {
  if (disabled && !loading) {
    return (
      <Pressable disabled style={styles.disabledBtn}>
        <Text style={styles.disabledText}>{title}</Text>
      </Pressable>
    )
  }

  return (
    <Pressable
      onPress={onPress}
      disabled={loading}
      style={({ pressed }) => [pressed && !loading && styles.pressed]}
    >
      <LinearGradient
        colors={['#B8AEFF', '#9D94FF']}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={styles.btn}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.text}>{title}</Text>
        )}
      </LinearGradient>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  btn: {
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
  },
  disabledBtn: {
    height: 56,
    borderRadius: 28,
    backgroundColor: '#25253D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledText: {
    color: 'rgba(255, 255, 255, 0.28)',
    fontSize: 17,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.9,
  },
})
