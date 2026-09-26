import { View, Text, SafeAreaView, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useRouter, useLocalSearchParams } from 'expo-router'
import AppButton from '@/components/common/AppButton'
import OtpInput from '@/components/form/OtpInput'
import { AuthService } from '@/services/auth.service'
import { ERouteTable } from '@/constants/route-table'

const VerifyOTPResetScreen = () => {
  const router = useRouter()
  const params = useLocalSearchParams()
  const email = params.email as string || ''
  
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)

  // Mask email for display: u************@e******.com
  const maskEmail = (email: string): string => {
    if (!email) return ''
    
    const [localPart, domain] = email.split('@')
    if (!localPart || !domain) return email
    
    const maskedLocal = localPart.charAt(0) + '*'.repeat(Math.max(localPart.length - 1, 12))
    const [domainName, tld] = domain.split('.')
    const maskedDomain = domainName.charAt(0) + '*'.repeat(Math.max(domainName.length - 1, 6))
    
    return `${maskedLocal}@${maskedDomain}.${tld}`
  }

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ mã xác thực 6 số')
      return
    }

    setLoading(true)

    try {
      await AuthService.verifyOTPForReset(email, otp)
      
      // Navigate to reset password screen after successful OTP verification
      router.push({
        pathname: ERouteTable.RESET_PASSWORD,
        params: { email },
      })
    } catch (error: any) {
      console.error('Error verifying OTP:', error)
      
      let errorMessage = 'Mã xác thực không đúng. Vui lòng thử lại.'
      
      if (error.message.includes('Token has expired')) {
        errorMessage = 'Mã xác thực đã hết hạn. Vui lòng gửi lại mã mới.'
      } else if (error.message.includes('Invalid token')) {
        errorMessage = 'Mã xác thực không hợp lệ. Vui lòng kiểm tra lại.'
      }
      
      Alert.alert('Lỗi', errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleResendCode = async () => {
    if (!email) {
      Alert.alert('Lỗi', 'Không tìm thấy email. Vui lòng thử lại.')
      return
    }

    setResending(true)

    try {
      await AuthService.sendPasswordResetOTP(email)
      Alert.alert('Thành công', 'Mã xác thực mới đã được gửi đến email của bạn.')
    } catch (error: any) {
      console.error('Error resending OTP:', error)
      Alert.alert('Lỗi', 'Không thể gửi lại mã. Vui lòng thử lại sau.')
    } finally {
      setResending(false)
    }
  }

  const handleBackToSignIn = () => {
    router.push(ERouteTable.SIGIN_IN)
  }

  const handleBack = () => {
    router.back()
  }

  return (
    <SafeAreaView className="flex-1 bg-secondary-50">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView 
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View className="px-4 pt-4">
            <TouchableOpacity
              onPress={handleBack}
              className="w-12 h-12 rounded-full bg-white items-center justify-center"
              disabled={loading || resending}
            >
              <Ionicons name="chevron-back" size={24} color="#1C1C1E" />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View className="flex-1 px-8 pt-16">
            {/* Title */}
            <Text className="text-3xl font-semibold text-primary text-center mb-4">
              Kiểm tra email
            </Text>

            {/* Description */}
            <Text className="text-sm text-disabled text-center mb-8 leading-5">
              Chúng tôi đã gửi cho bạn một mã xác nhận.{'\n'}
              Vui lòng kiểm tra hộp thư đến của bạn tại{'\n'}
              {maskEmail(email)}.
            </Text>

            {/* OTP Input */}
            <View className="mb-6">
              <OtpInput length={6} onChange={setOtp} />
            </View>

            {/* Verify Button */}
            <AppButton
              title={loading ? 'Đang xác thực...' : 'Xác thực'}
              onPress={handleVerifyOTP}
              disabled={loading || resending || otp.length !== 6}
            />

            {/* Resend Code Section */}
            <View className="items-center mt-6 gap-2">
              <Text className="text-sm text-primary text-center">
                Gửi lại mã. Vui lòng kiểm tra email của bạn.
              </Text>
              
              <TouchableOpacity
                onPress={handleResendCode}
                disabled={resending || loading}
                className="py-2"
              >
                {resending ? (
                  <ActivityIndicator size="small" color="#637381" />
                ) : (
                  <Text className="text-secondary underline">Gửi lại mã</Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Back to Sign In */}
            <TouchableOpacity
              onPress={handleBackToSignIn}
              className="flex-row items-center justify-center mt-12"
              disabled={loading || resending}
            >
              <Ionicons name="chevron-back" size={20} color="#637381" />
              <Text className="text-sm text-secondary ml-1">Quay lại đăng nhập</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default VerifyOTPResetScreen
