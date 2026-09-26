import React, { useEffect, useMemo, useState } from 'react'
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native'
import { useAuth } from '@/context/auth-provider'
import { useProfile } from '@/hooks/useProfile'
import { toast } from '@/components/common/ToastManager'
import AccountScreenLayout from '@/modules/account/components/AccountScreenLayout'
import AccountField from '@/modules/account/components/AccountField'
import AccountPrimaryButton from '@/modules/account/components/AccountPrimaryButton'
import ConfirmModal from '@/modules/account/components/ConfirmModal'

export default function AccountProfileScreen() {
  const { user } = useAuth()
  const { profile, updateProfile } = useProfile()
  const [fullName, setFullName] = useState('')
  const [showConfirm, setShowConfirm] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    setFullName(profile?.full_name ?? profile?.username ?? '')
  }, [profile?.full_name, profile?.username])

  const username = profile?.username ?? user?.email?.split('@')[0] ?? ''
  const isDirty = useMemo(() => {
    const original = profile?.full_name ?? profile?.username ?? ''
    return fullName.trim() !== original.trim()
  }, [fullName, profile?.full_name, profile?.username])

  const handleSavePress = () => {
    if (!isDirty || !user?.id) return
    const trimmed = fullName.trim()
    if (!trimmed) {
      toast.error('Lỗi', 'Họ tên không được để trống.')
      return
    }
    setShowConfirm(true)
  }

  const handleConfirmSave = async () => {
    if (!user?.id) return
    setIsSaving(true)
    try {
      await updateProfile({
        userId: user.id,
        updates: { full_name: fullName.trim() },
      })
      setShowConfirm(false)
      toast.success('Thành công', 'Đã cập nhật thông tin.')
    } catch {
      toast.error('Lỗi', 'Không thể cập nhật thông tin.')
    } finally {
      setIsSaving(false)
    }
  }

  if (!user) {
    return (
      <AccountScreenLayout title="Thông tin">
        <View style={styles.centered}>
          <ActivityIndicator color="#A78BFA" />
        </View>
      </AccountScreenLayout>
    )
  }

  if (!profile) {
    return (
      <AccountScreenLayout title="Thông tin">
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#A78BFA" />
        </View>
      </AccountScreenLayout>
    )
  }

  return (
    <AccountScreenLayout
      title="Thông tin"
      footer={
        <View style={styles.footer}>
          <AccountPrimaryButton
            title="Lưu thay đổi"
            onPress={handleSavePress}
            disabled={!isDirty}
            loading={isSaving}
          />
        </View>
      }
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <AccountField
          label="Họ tên"
          value={fullName}
          onChangeText={setFullName}
          placeholder="Nhập họ tên"
          autoCapitalize="words"
        />
        <AccountField
          label="Người dùng"
          value={username}
          editable={false}
        />
      </ScrollView>

      <ConfirmModal
        visible={showConfirm}
        title="Đổi tên?"
        message="Bạn có chắc chắn muốn đổi tên không?"
        loading={isSaving}
        onCancel={() => !isSaving && setShowConfirm(false)}
        onConfirm={handleConfirmSave}
      />
    </AccountScreenLayout>
  )
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 24,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
