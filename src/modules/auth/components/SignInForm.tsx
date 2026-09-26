import { KeyboardAvoidingView, Platform, Text, TouchableOpacity, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import React, { useState } from 'react'
import { useRouter } from 'expo-router'
import { ERouteTable } from '@/constants/route-table'
import { AuthService } from '@/services/auth.service'
import { toast } from '@/components/common/ToastManager'
import { MathMonstersService } from '@/services/mathMonsters.service'
import AuthScreenLayout from '@/modules/auth/components/AuthScreenLayout'
import AuthCard from '@/modules/auth/components/AuthCard'
import AuthInput from '@/modules/auth/components/AuthInput'
import AuthButton from '@/modules/auth/components/AuthButton'

const SignInForm = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      toast.error('Lỗi', 'Vui lòng điền đầy đủ thông tin')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      toast.error('Lỗi', 'Email không hợp lệ')
      return
    }

    setLoading(true)

    try {
      const { session, user } = await AuthService.signIn(email.trim(), password)

      if (session && user) {
        const needsSetup = await MathMonstersService.needsOnboarding(user.id)
        router.replace(
          needsSetup ? (ERouteTable.CHOOSE_HERO as never) : ERouteTable.HOME
        )
      }
    } catch (error: unknown) {
      let errorMessage = 'Đã xảy ra lỗi. Vui lòng thử lại.'
      const message = error instanceof Error ? error.message : ''

      if (message.includes('Invalid login credentials')) {
        errorMessage = 'Email hoặc mật khẩu không đúng'
      } else if (message.includes('Email not confirmed')) {
        errorMessage = 'Vui lòng xác nhận email trước khi đăng nhập'
      }

      toast.error('Lỗi đăng nhập', errorMessage)
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
          <AuthCard badge="Đăng nhập">
            <AuthInput
              placeholder="Tài khoản"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loading}
            />
            <AuthInput
              placeholder="Mật khẩu"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              editable={!loading}
            />

            <View className="mt-2">
              <AuthButton
                title={loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                onPress={handleLogin}
                disabled={loading}
              />
            </View>

            <View className="mt-5 items-center gap-3">
              <TouchableOpacity
                onPress={() => router.push(ERouteTable.SIGIN_UP)}
                disabled={loading}
              >
                <Text className="text-[#D1D5DB] text-sm">
                  Bạn chưa có tài khoản?{' '}
                  <Text className="text-white underline font-semibold">Đăng ký</Text>
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => router.push(ERouteTable.FORGOT_PASSWORD)}
                disabled={loading}
              >
                <Text className="text-[#D1D5DB] text-sm underline">Quên mật khẩu?</Text>
              </TouchableOpacity>
            </View>
          </AuthCard>
        </ScrollView>
      </KeyboardAvoidingView>
    </AuthScreenLayout>
  )
}

export default SignInForm
