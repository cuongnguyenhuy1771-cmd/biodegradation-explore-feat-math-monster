import { Alert, KeyboardAvoidingView, Platform, Text, TouchableOpacity, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import React, { useState } from 'react'
import { useRouter } from 'expo-router'
import { ERouteTable } from '@/constants/route-table'
import { AuthService } from '@/services/auth.service'
import { toast } from '@/components/common/ToastManager'
import AuthScreenLayout from '@/modules/auth/components/AuthScreenLayout'
import AuthCard from '@/modules/auth/components/AuthCard'
import AuthInput from '@/modules/auth/components/AuthInput'
import AuthButton from '@/modules/auth/components/AuthButton'

const SignUpForm = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSignUp = async () => {
    if (!name.trim()) {
      toast.error('Lỗi', 'Vui lòng nhập tên')
      return
    }

    if (!email.trim() || !password.trim()) {
      toast.error('Lỗi', 'Vui lòng nhập email và mật khẩu')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      toast.error('Lỗi', 'Email không hợp lệ')
      return
    }

    if (password.length < 6) {
      toast.error('Lỗi', 'Mật khẩu phải có ít nhất 6 ký tự')
      return
    }

    setLoading(true)

    try {
      const data = await AuthService.signUp(email.trim(), password, name.trim())

      if (data.session) {
        toast.success('Đăng ký thành công', 'Hãy chọn nhân vật của bạn')
        router.replace(ERouteTable.CHOOSE_HERO as never)
      } else {
        toast.success('Đăng ký thành công', 'Vui lòng nhập mã OTP đã gửi qua email.')
        router.replace({
          pathname: ERouteTable.VERIFY_EMAIL as never,
          params: {
            email: email.trim(),
            username: name.trim(),
          },
        })
      }
    } catch (error: unknown) {
      let errorMessage = 'Đã xảy ra lỗi. Vui lòng thử lại.'

      if (error instanceof Error && error.message) {
        const msg = error.message.toLowerCase()

        if (msg.includes('already registered') || msg.includes('already been registered')) {
          errorMessage = 'Email này đã được đăng ký'
        } else if (msg.includes('password should be') || msg.includes('password is too weak')) {
          errorMessage = 'Mật khẩu không đủ mạnh. Vui lòng dùng mật khẩu mạnh hơn.'
        } else if (msg.includes('invalid email')) {
          errorMessage = 'Email không hợp lệ. Vui lòng sử dụng email thật (Gmail, Outlook, v.v.)'
        } else if (msg.includes('network') || msg.includes('fetch')) {
          errorMessage = 'Không thể kết nối. Vui lòng kiểm tra internet.'
        } else {
          errorMessage = `Lỗi: ${error.message}`
        }
      }

      Alert.alert('Lỗi đăng ký', errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthScreenLayout background="splash" blur showBack>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingVertical: 24 }}
          keyboardShouldPersistTaps="always"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
        >
          <AuthCard badge="Tạo tài khoản">
            <AuthInput
              placeholder="Tên của bạn?"
              value={name}
              onChangeText={setName}
              editable={!loading}
            />
            <AuthInput
              placeholder="Tài khoản"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loading}
            />
            <AuthInput
              placeholder="Nhập mật khẩu"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!loading}
            />

            <View className="mt-2">
              <AuthButton
                title={loading ? 'Đang xử lý...' : 'Tạo tài khoản'}
                onPress={handleSignUp}
                disabled={loading}
              />
            </View>

            <TouchableOpacity
              className="mt-5 items-center"
              onPress={() => router.replace(ERouteTable.SIGIN_IN)}
              disabled={loading}
            >
              <Text className="text-[#D1D5DB] text-sm">
                Bạn đã có tài khoản?{' '}
                <Text className="text-white underline font-semibold">Đăng nhập</Text>
              </Text>
            </TouchableOpacity>
          </AuthCard>
        </ScrollView>
      </KeyboardAvoidingView>
    </AuthScreenLayout>
  )
}

export default SignUpForm
