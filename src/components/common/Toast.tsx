import React, { useEffect, useRef } from 'react'
import { View, Text, TouchableOpacity, Animated, Dimensions } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

export interface ToastConfig {
  id: string
  type: 'success' | 'error' | 'info' | 'warning' | 'notification'
  title: string
  message: string
  duration?: number
  icon?: string
  iconBg?: string
}

interface ToastProps {
  toast: ToastConfig
  onDismiss: (id: string) => void
}

const { width } = Dimensions.get('window')

export const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  const translateY = useRef(new Animated.Value(-100)).current
  const opacity = useRef(new Animated.Value(0)).current

  useEffect(() => {
    console.log('🎨 Toast component mounted:', toast.title, 'ID:', toast.id)

    // Slide in animation
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      console.log('✨ Toast animation completed:', toast.title)
    })

    // Auto dismiss after duration
    const timer = setTimeout(() => {
      console.log('⏰ Toast auto-dismiss timer fired:', toast.title)
      handleDismiss()
    }, toast.duration || 3000)

    return () => {
      console.log('🧹 Toast component unmounting:', toast.title)
      clearTimeout(timer)
    }
  }, [])

  const handleDismiss = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onDismiss(toast.id)
    })
  }

  const getTypeConfig = () => {
    switch (toast.type) {
      case 'success':
        return {
          icon: 'checkmark-circle',
          iconColor: '#10B981',
          bgColor: '#D1FAE5',
          borderColor: '#10B981',
        }
      case 'error':
        return {
          icon: 'close-circle',
          iconColor: '#EF4444',
          bgColor: '#FEE2E2',
          borderColor: '#EF4444',
        }
      case 'warning':
        return {
          icon: 'warning',
          iconColor: '#F59E0B',
          bgColor: '#FEF3C7',
          borderColor: '#F59E0B',
        }
      case 'info':
        return {
          icon: 'information-circle',
          iconColor: '#3B82F6',
          bgColor: '#DBEAFE',
          borderColor: '#3B82F6',
        }
      case 'notification':
      default:
        return {
          icon: 'notifications',
          iconColor: '#8B5CF6',
          bgColor: '#EDE9FE',
          borderColor: '#8B5CF6',
        }
    }
  }

  const config = getTypeConfig()

  return (
    <Animated.View
      style={{
        transform: [{ translateY }],
        opacity,
        position: 'absolute',
        top: 60,
        left: 16,
        right: 16,
        zIndex: 9999,
      }}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={handleDismiss}
        className="rounded-2xl"
        style={{
          backgroundColor: 'white',
          borderLeftWidth: 4,
          borderLeftColor: config.borderColor,
        }}
      >
        <View className="flex-row items-center p-4">
          {/* Icon */}
          {toast.icon ? (
            <View
              className="w-12 h-12 rounded-full items-center justify-center mr-3"
              style={{ backgroundColor: toast.iconBg || config.bgColor }}
            >
              <Text className="text-2xl">{toast.icon}</Text>
            </View>
          ) : (
            <View
              className="w-12 h-12 rounded-full items-center justify-center mr-3"
              style={{ backgroundColor: config.bgColor }}
            >
              <Ionicons name={config.icon as any} size={28} color={config.iconColor} />
            </View>
          )}

          {/* Content */}
          <View className="flex-1 mr-2">
            <Text className="text-base font-semibold text-gray-900 mb-1">
              {toast.title}
            </Text>
            <Text className="text-sm text-gray-600 leading-5" numberOfLines={2}>
              {toast.message}
            </Text>
          </View>

          {/* Close button */}
          <TouchableOpacity
            onPress={handleDismiss}
            className="w-8 h-8 items-center justify-center"
          >
            <Ionicons name="close" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  )
}
