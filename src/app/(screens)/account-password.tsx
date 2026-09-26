import React, { useState } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { router } from 'expo-router'
import { useAuth } from '@/context/auth-provider'
import { AuthService } from '@/services/auth.service'
import { toast } from '@/components/common/ToastManager'
import AccountScreenLayout from '@/modules/account/components/AccountScreenLayout'
import AccountField from '@/modules/account/components/AccountField'
import AccountPrimaryButton from '@/modules/account/components/AccountPrimaryButton'

export default function AccountPasswordScreen() {
  const { user } = useAuth()
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const canSubmit =
    oldPassword.trim().length > 0 &&
    newPassword.length >= 6 &&
    confirmPassword.length > 0

  const handleChangePassword = async () => {
    if (!user?.id || !user.email) return
    if (!oldPassword.trim()) {
      toast.error('Lỗi', 'Vui lòng nhập mật khẩu cũ')
      return
    }
    if (newPassword.length < 6) {
      toast.error('Lỗi', 'Mật khẩu mới phải có ít nhất 6 ký tự')
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error('Lỗi', 'Mật khẩu xác nhận không khớp')
      return
    }

    setIsSubmitting(true)
    try {
      await AuthService.signIn(user.email, oldPassword)
      await AuthService.updatePassword(newPassword)
      setOldPassword('')
      setNewPassword('')
      setConfirmPassword('')
      toast.success('Thành công', 'Đã cập nhật mật khẩu.')
      router.back()
    } catch {
      toast.error('Lỗi', 'Không thể cập nhật mật khẩu.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AccountScreenLayout title="Đổi mật khẩu">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <AccountField
          label="Mật khẩu cũ"
          value={oldPassword}
          onChangeText={setOldPassword}
          placeholder="Mật khẩu cũ"
          secureTextEntry
          autoCapitalize="none"
        />
        <AccountField
          label="Mật khẩu mới"
          value={newPassword}
          onChangeText={setNewPassword}
          placeholder="Mật khẩu mới"
          secureTextEntry
          autoCapitalize="none"
        />
        <AccountField
          label="Nhập lại mật khẩu"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Nhập lại mật khẩu"
          secureTextEntry
          autoCapitalize="none"
        />

        <View style={styles.submitWrap}>
          <AccountPrimaryButton
            title="Đổi mật khẩu"
            onPress={handleChangePassword}
            disabled={!canSubmit}
            loading={isSubmitting}
          />
        </View>
      </ScrollView>
    </AccountScreenLayout>
  )
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 32,
  },
  submitWrap: {
    marginTop: 24,
  },
})
