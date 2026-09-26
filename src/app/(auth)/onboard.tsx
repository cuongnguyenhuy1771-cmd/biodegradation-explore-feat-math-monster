import { useEffect } from 'react'
import { router } from 'expo-router'
import { ERouteTable } from '@/constants/route-table'

/** Luồng mới: splash nằm ở `/` — redirect nếu ai đó mở route cũ */
export default function OnboardScreen() {
  useEffect(() => {
    router.replace(ERouteTable.ROOT)
  }, [])

  return null
}
