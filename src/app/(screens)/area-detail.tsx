import React from 'react'
import { ActivityIndicator, StyleSheet, View } from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/context/auth-provider'
import { MathMonstersService } from '@/services/mathMonsters.service'
import AreaDetailModal from '@/components/area-levels/AreaDetailModal'

export default function AreaDetailScreen() {
  const { areaId } = useLocalSearchParams<{ areaId: string }>()
  const { user } = useAuth()

  const { data: area, isPending } = useQuery({
    queryKey: ['area-detail', areaId, user?.id],
    enabled: !!areaId && !!user?.id,
    queryFn: async () => {
      const areaRow = await MathMonstersService.getAreaById(areaId!)
      if (!areaRow) return null

      const areas = await MathMonstersService.getAreasWithProgress(
        areaRow.world_id,
        user!.id,
      )
      return areas.find((item) => item.id === areaId) ?? null
    },
  })

  if (isPending) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#A78BFA" />
      </View>
    )
  }

  if (!area) {
    router.back()
    return null
  }

  return (
    <AreaDetailModal
      visible
      area={area}
      onClose={() => router.back()}
    />
  )
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: 'rgba(6, 4, 18, 0.78)',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
