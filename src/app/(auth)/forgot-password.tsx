import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import React, { useState } from 'react'
import { useRouter } from 'expo-router'
import { ERouteTable } from '@/constants/route-table'
import { AuthService } from '@/services/auth.service'
import { toast } from '@/components/common/ToastManager'
import AuthScreenLayout from '@/modules/auth/components/AuthScreenLayout'
import AuthCard from '@/modules/auth/components/AuthCard'
import AuthInput from '@/modules/auth/components/AuthInput'
import AuthButton from '@/modules/auth/components/AuthButton'

const ForgotPasswordScreen = () => {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [loading, setLoading] = useState(false)

  const validateEmail = (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(value)
  }

  const handleSendResetEmail = async () => {
    setEmailError('')

    if (!email.trim()) {
      setEmailError('Email không được để trống')
      return
    }

    if (!validateEmail(email.trim())) {
      setEmailError('Email chưa chính xác. Vui lòng kiểm tra lại!')
      return
    }

    setLoading(true)

    try {
      await AuthService.sendPasswordResetOTP(email.trim())
      router.push({
        pathname: ERouteTable.VERIFY_OTP_RESET,
        params: { email: email.trim() },
      })
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Không thể gửi mã xác thực.'
      let errorMessage = 'Không thể gửi mã xác thực. Vui lòng thử lại sau.'
      if (message.includes('User not found')) {
        errorMessage = 'Email không tồn tại trong hệ thống'
      } else if (message.includes('Rate limit')) {
        errorMessage = 'Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau.'
      }
      toast.error('Lỗi', errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthScreenLayout background="splash" blur showBack>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1 justify-center"
      >
        <ScrollView
          contentContainerClassName="flex-grow justify-center py-6"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <AuthCard badge="Quên mật khẩu">
            <Text className="text-[#D1D5DB] text-sm text-center leading-6 mb-5">
              Nhập email liên kết với tài khoản. Chúng tôi sẽ gửi mã OTP để đặt lại mật khẩu.
            </Text>

            <AuthInput
              placeholder="Tài khoản"
              value={email}
              onChangeText={(text) => {
                setEmail(text)
                if (emailError) setEmailError('')
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loading}
            />
            {emailError ? (
              <Text className="text-[#FCA5A5] text-sm mb-2 -mt-1">{emailError}</Text>
            ) : null}

            <AuthButton
              title={loading ? 'Đang gửi...' : 'Gửi mã xác thực'}
              onPress={handleSendResetEmail}
              disabled={loading}
            />

            <TouchableOpacity
              className="mt-5 items-center"
              onPress={() => router.replace(ERouteTable.SIGIN_IN)}
              disabled={loading}
            >
              <Text className="text-[#D1D5DB] text-sm underline">Quay lại đăng nhập</Text>
            </TouchableOpacity>
          </AuthCard>
        </ScrollView>
      </KeyboardAvoidingView>
    </AuthScreenLayout>
  )
}

export default ForgotPasswordScreen
