import React from 'react'
import {
  ActivityIndicator,
  DimensionValue,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'

const GRADIENT_TOP = '#AEA3FF'
const GRADIENT_BOTTOM = '#7B61FF'

type Props = TouchableOpacityProps & {
  title: string
  loading?: boolean

  /** fixed = 200px, block = 100% */
  variant?: 'fixed' | 'block'

  /** Width tùy chỉnh, ưu tiên hơn variant */
  width?: DimensionValue

  /** Font size của text */
  fontSize?: number
}

export default function AuthButton({
  title,
  disabled,
  loading,
  variant = 'block',
  width,
  fontSize = 20,
  className,
  style,
  ...props
}: Props) {
  const isDisabled = disabled || loading

  const sizeStyle =
    width !== undefined
      ? {
          width,
          alignSelf: 'center' as const,
        }
      : variant === 'fixed'
        ? styles.buttonFixed
        : styles.buttonBlock

  const textStyle = [
    styles.label,
    {
      fontSize,
      lineHeight: fontSize * 1.4,
    },
  ]

  if (isDisabled) {
    return (
      <TouchableOpacity
        disabled
        activeOpacity={1}
        className={className}
        style={[styles.button, sizeStyle, style]}
      >
        <View style={[styles.surface, styles.surfaceDisabled]}>
          {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={textStyle}>{title}</Text>}
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <TouchableOpacity
      activeOpacity={0.92}
      className={className}
      style={[styles.button, sizeStyle, style]}
      {...props}
    >
      <LinearGradient
        colors={[GRADIENT_TOP, GRADIENT_BOTTOM]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.surface}
      >
        <View style={styles.bevel} pointerEvents="none" />
        <Text style={textStyle}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    height: 56,
    borderRadius: 20,
    shadowColor: '#4C3D99',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },

  buttonFixed: {
    width: 200,
    alignSelf: 'center',
  },

  buttonBlock: {
    width: '100%',
  },

  surface: {
    flex: 1,
    minHeight: 56,
    borderRadius: 20,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },

  surfaceDisabled: {
    backgroundColor: '#6B5FA8',
    opacity: 0.65,
  },

  bevel: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
    borderTopColor: 'rgba(255,255,255,0.25)',
    borderBottomColor: 'rgba(0,0,0,0.5)',
  },

  label: {
    color: '#FFFFFF',
    fontWeight: '700',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 0,
  },
})
