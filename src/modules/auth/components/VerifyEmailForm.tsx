import { Text, TouchableOpacity, View } from 'react-native'
import React, { useMemo, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { ERouteTable } from '@/constants/route-table'
import OtpInput from '@/components/form/OtpInput'
import { AuthService } from '@/services/auth.service'
import { toast } from '@/components/common/ToastManager'
import AuthScreenLayout from '@/modules/auth/components/AuthScreenLayout'
import AuthCard from '@/modules/auth/components/AuthCard'
import AuthButton from '@/modules/auth/components/AuthButton'

const VerifyEmailForm = () => {
  const router = useRouter()
  const params = useLocalSearchParams<{ email?: string; username?: string }>()
  const email = (params.email ?? '').trim()
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)

  const maskedEmail = useMemo(() => {
    if (!email) return 'u************@e******.com'
    const [namePart = '', domainPart = ''] = email.split('@')
    const maskedName = `${namePart.slice(0, 1)}${'*'.repeat(Math.max(3, namePart.length - 1))}`
    const maskedDomain = `${domainPart.slice(0, 1)}${'*'.repeat(Math.max(3, domainPart.length - 1))}`
    return `${maskedName}@${maskedDomain}`
  }, [email])

  const handleVerify = async () => {
    if (!email) {
      toast.error('Lỗi', 'Thiếu email xác thực')
      return
    }
    if (otp.length !== 6) {
      toast.error('Lỗi', 'Vui lòng nhập đủ 6 số OTP')
      return
    }

    setLoading(true)
    try {
      await AuthService.verifySignUpOTP(email, otp)
      toast.success('Thành công', 'Email đã được xác thực')
      router.replace(ERouteTable.CHOOSE_HERO as never)
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'OTP không hợp lệ'
      toast.error('Lỗi xác thực', message)
    } finally {
      setLoading(false)
    }
  }

  const handleResendCode = async () => {
    if (!email) {
      toast.error('Lỗi', 'Thiếu email để gửi lại mã')
      return
    }
    try {
      await AuthService.resendSignUpOTP(email)
      toast.success('Đã gửi lại mã', 'Vui lòng kiểm tra email')
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Không gửi lại được mã'
      toast.error('Lỗi', message)
    }
  }

  return (
    <AuthScreenLayout background="splash" blur showBack>
      <View className="px-2">
        <AuthCard badge="Xác thực email">
          <Text className="text-[#D1D5DB] text-sm text-center leading-6 mb-6">
            Chúng tôi đã gửi mã xác nhận đến{'\n'}
            <Text className="text-white font-semibold">{maskedEmail}</Text>
          </Text>

          <OtpInput length={6} onChange={setOtp} />

          <View className="mt-6">
            <AuthButton
              title={loading ? 'Đang xác thực...' : 'Xác thực'}
              onPress={handleVerify}
              disabled={loading}
            />
          </View>

          <View className="mt-5 items-center gap-3">
            <TouchableOpacity onPress={handleResendCode} disabled={loading}>
              <Text className="text-white underline text-sm">Gửi lại mã</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.replace(ERouteTable.SIGIN_IN)}
              disabled={loading}
            >
              <Text className="text-[#D1D5DB] text-sm">Quay lại đăng nhập</Text>
            </TouchableOpacity>
          </View>
        </AuthCard>
      </View>
    </AuthScreenLayout>
  )
}

export default VerifyEmailForm
