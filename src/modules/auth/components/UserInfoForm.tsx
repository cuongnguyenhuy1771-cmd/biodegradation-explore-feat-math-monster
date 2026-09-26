import { Alert, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import AppButton from '@/components/common/AppButton'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { ERouteTable } from '@/constants/route-table'
import { toast } from '@/components/common/ToastManager'
import { supabase } from '@/lib/supabase'
import AvatarPicker from '@/components/cyber/AvatarPicker'

type Props = {}

const UserInfoForm = ({}: Props) => {
  const router = useRouter()
  const params = useLocalSearchParams<{ username?: string; email?: string }>()
  const usernameFromFlow = (params.username ?? '').trim()
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const _onSkip = () => {
    router.push(ERouteTable.CHOOSE_HERO as never)
  }

  const _handleSave = async () => {
    try {
      if (!avatarUrl) {
        toast.error('Lỗi', 'Vui lòng chọn avatar')
        return
      }

      setLoading(true)
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        Alert.alert('Lỗi', 'Không tìm thấy user')
        setLoading(false)
        return
      }

      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          username: usernameFromFlow || 'Player',
          avatar_url: avatarUrl,
          avatar_preset_id: avatarUrl,
          total_points: 0,
          onboarding_completed_at: new Date().toISOString(),
        })

      if (error) throw error

      toast.success('Hoàn tất', 'Chào mừng đến Math Monsters!')
      router.replace(ERouteTable.CHOOSE_HERO as never)
    } catch (e: any) {
      Alert.alert('Lỗi', e?.message ?? 'Không thể lưu thông tin')
    } finally {
      setLoading(false)
    }
  }

  return (
    <View className="px-8">
      <Text className="text-3xl text-center text-primary mb-2">Hình đại diện</Text>
      <Text className="text-base text-center text-disabled mb-8">Lựa chọn hình đại diện</Text>

      <View className="mt-4">
        <AvatarPicker
          value={avatarUrl}
          onChange={setAvatarUrl}
          size={68}
          columns={3}
        />
      </View>

      <View className="mt-10">
        <AppButton variant="gradient" title={loading ? 'Đang lưu...' : 'Bắt đầu'} onPress={_handleSave} disabled={loading} />
        <TouchableOpacity
          onPress={_onSkip}
          className="items-center mt-4"
          activeOpacity={0.8}
        >
          <Text className="text-secondary font-bold">Bỏ qua</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default UserInfoForm
