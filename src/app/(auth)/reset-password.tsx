import { View, Text, SafeAreaView, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useRouter, useLocalSearchParams } from 'expo-router'
import AppInput from '@/components/form/AppInput'
import AppButton from '@/components/common/AppButton'
import { AuthService } from '@/services/auth.service'
import { ERouteTable } from '@/constants/route-table'
import { toast } from '@/components/common/ToastManager'

const ResetPasswordScreen = () => {
  const router = useRouter()
  const params = useLocalSearchParams()
  const email = params.email as string || ''
  
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleResetPassword = async () => {
    // Validate inputs
    if (!newPassword.trim() || !confirmPassword.trim()) {
      toast.error('Lỗi', 'Vui lòng điền đầy đủ thông tin')
      return
    }

    if (newPassword.length < 6) {
      toast.error('Lỗi', 'Mật khẩu phải có ít nhất 6 ký tự')
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error('Lỗi', 'Mật khẩu xác nhận không khớp')
      return
    }

    setLoading(true)

    try {
      await AuthService.updatePassword(newPassword)
      
      Alert.alert(
        'Thành công',
        'Đặt lại mật khẩu thành công. Vui lòng đăng nhập với mật khẩu mới.',
        [
          {
            text: 'OK',
            onPress: () => router.replace(ERouteTable.SIGIN_IN),
          },
        ]
      )
    } catch (error: any) {
      console.error('Error resetting password:', error)
      
      let errorMessage = 'Không thể đặt lại mật khẩu. Vui lòng thử lại.'
      
      if (error.message.includes('New password should be different')) {
        errorMessage = 'Mật khẩu mới phải khác mật khẩu cũ'
      } else if (error.message.includes('Password is too weak')) {
        errorMessage = 'Mật khẩu quá yếu. Vui lòng chọn mật khẩu mạnh hơn.'
      }
      toast.error('Lỗi', errorMessage)
    } finally {
      setLoading(false)
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
              disabled={loading}
            >
              <Ionicons name="chevron-back" size={24} color="#1C1C1E" />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View className="flex-1 px-8 pt-16">
            {/* Title */}
            <Text className="text-3xl font-semibold text-primary text-center mb-4">
              Đặt lại mật khẩu
            </Text>

            {/* Description */}
            <Text className="text-sm text-disabled text-center mb-8 leading-5">
              Nhập lại mật khẩu mới
            </Text>

            {/* New Password Input */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-primary mb-2">Mật khẩu mới</Text>
              <AppInput
                className="h-14 border border-[#919EAB52] px-4 rounded-xl bg-white"
                placeholder="Nhập mật khẩu mới"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
                editable={!loading}
              />
            </View>

            {/* Confirm Password Input */}
            <View className="mb-6">
              <Text className="text-sm font-medium text-primary mb-2">Nhập lại mật khẩu mới</Text>
              <AppInput
                className="h-14 border border-[#919EAB52] px-4 rounded-xl bg-white"
                placeholder="Nhập lại mật khẩu mới"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                editable={!loading}
              />
            </View>

            {/* Submit Button */}
            <AppButton
              title={loading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
              onPress={handleResetPassword}
              disabled={loading}
            />

            {/* Back to Sign In */}
            <TouchableOpacity
              onPress={handleBackToSignIn}
              className="flex-row items-center justify-center mt-6"
              disabled={loading}
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

export default ResetPasswordScreen
