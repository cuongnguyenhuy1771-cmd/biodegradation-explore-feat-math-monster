import { useEffect, useRef } from 'react'
import { router } from 'expo-router'
import { ERouteTable } from '@/constants/route-table'
import { useAuth } from '@/context/auth-provider'
import { MathMonstersService } from '@/services/mathMonsters.service'

/** Chuyển user đã đăng nhập thẳng vào app, bỏ qua luồng splash */
export function useAuthEntryRedirect() {
  const { isAuthenticated, loading, user } = useAuth()
  const navigatedRef = useRef(false)

  useEffect(() => {
    if (loading || navigatedRef.current) return
    if (!isAuthenticated || !user?.id) return

    navigatedRef.current = true
    const go = async () => {
      const needsSetup = await MathMonstersService.needsOnboarding(user.id)
      router.replace(
        needsSetup ? (ERouteTable.CHOOSE_HERO as never) : ERouteTable.HOME
      )
    }
    void go()
  }, [isAuthenticated, loading, user?.id])

  return { isAuthenticated, loading }
}
