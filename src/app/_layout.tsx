// @@iconify-code-gen
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from '@expo-google-fonts/inter'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect, useRef } from 'react'
import { Text } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import '~/global.css' // Tailwind / NativeWind globals
import { QueryProvider } from '@/context/QueryProvider'
import { AuthProvider } from '@/context/auth-provider'
import { DateProvider } from '@/context/date-context'
import { NotificationProvider } from '@/context/notification-provider'
import { ToastManager } from '@/components/common/ToastManager'

SplashScreen.preventAutoHideAsync()

/** Gán SN Pro Regular làm font mặc định cho Text */
function registerDefaultTextFamily() {
  const baseStyle = { fontFamily: 'SNPro-Regular' }

  // @ts-ignore
  if (Text.defaultProps) {
    // @ts-ignore
    Text.defaultProps.style = baseStyle
  } else {
    // @ts-ignore
    Text.defaultProps = { style: baseStyle }
  }

  // Không set TextInput.defaultProps — gây xung đột style/focus trên RN 0.79
}

export default function RootLayout() {
  const didRegisterDefaults = useRef(false)
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    'SNPro-Regular': require('../../assets/fonts/SNPro-Regular.ttf'),
    'SNPro-Medium': require('../../assets/fonts/SNPro-Medium.ttf'),
    'SNPro-SemiBold': require('../../assets/fonts/SNPro-SemiBold.ttf'),
    'SNPro-Bold': require('../../assets/fonts/SNPro-Bold.ttf'),
    'SNPro-ExtraBold': require('../../assets/fonts/SNPro-ExtraBold.ttf'),
    'SNPro-Black': require('../../assets/fonts/SNPro-Black.ttf'),
  })

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync()
    }
  }, [fontsLoaded, fontError])

  if (fontsLoaded && !didRegisterDefaults.current) {
    registerDefaultTextFamily()
    didRegisterDefaults.current = true
  }

  if (!fontsLoaded && !fontError) {
    return null
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <QueryProvider>
            <DateProvider>
              <NotificationProvider>
                <>
                  <Stack screenOptions={{ headerShown: false }} />
                  <ToastManager />
                </>
              </NotificationProvider>
            </DateProvider>
          </QueryProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}
