import React, { useState } from 'react'
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Ionicons } from '@expo/vector-icons'
import { useAuth } from '@/context/auth-provider'
import { MathMonstersService } from '@/services/mathMonsters.service'
import { toast } from '@/components/common/ToastManager'

export default function DailyTasksScreen() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [claimingId, setClaimingId] = useState<string | null>(null)

  const today = new Date().toISOString().slice(0, 10)

  const { data: tasks = [], isPending, refetch } = useQuery({
    queryKey: ['daily-tasks', user?.id, today],
    enabled: !!user?.id,
    queryFn: () => MathMonstersService.getDailyTasks(user!.id, today),
  })

  const totalProgress = tasks.reduce((sum, t) => {
    return sum + Math.min(1, t.current_value / t.goal_value)
  }, 0)
  const progressPct = tasks.length > 0 ? (totalProgress / tasks.length) * 100 : 0

  const claimTask = async (taskId: string) => {
    setClaimingId(taskId)
    try {
      const result = await MathMonstersService.claimDailyTask(taskId)
      toast.success('Nhận thưởng', `+${result.coins ?? 0} xu`)
      await refetch()
      await queryClient.invalidateQueries({ queryKey: ['profile'] })
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Không thể nhận thưởng'
      toast.error('Lỗi', message)
    } finally {
      setClaimingId(null)
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-[#1A0B2E]">
      <View className="flex-row items-center px-4 py-3">
        <TouchableOpacity onPress={() => router.back()} className="p-2 mr-2">
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text className="text-white text-lg font-bold">Nhiệm vụ hàng ngày</Text>
      </View>

      <View className="mx-4 mb-4">
        <View className="h-3 bg-[#2D1B4E] rounded-full overflow-hidden">
          <View
            className="h-full bg-[#7C3AED] rounded-full"
            style={{ width: `${progressPct}%` }}
          />
        </View>
        <Text className="text-[#A0AEC0] text-xs mt-1 text-right">🎁 Rương thưởng</Text>
      </View>

      {isPending ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#A78BFA" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
          {tasks.map((task) => {
            const canClaim = task.status === 'completed'
            const isClaimed = task.status === 'claimed'

            return (
              <View
                key={task.id}
                className="bg-[#2D1B4E] rounded-2xl px-4 py-4 mb-3 flex-row items-center"
              >
                <View className="flex-1">
                  <Text className="text-white font-semibold">{task.title}</Text>
                  <Text className="text-[#A0AEC0] text-sm mt-1">
                    {task.current_value}/{task.goal_value}
                    {task.reward_coins ? ` · +${task.reward_coins} xu` : ''}
                  </Text>
                </View>
                {isClaimed ? (
                  <Text className="text-[#718096] text-sm">Đã nhận</Text>
                ) : canClaim ? (
                  <TouchableOpacity
                    onPress={() => claimTask(task.id)}
                    disabled={claimingId === task.id}
                    className="bg-[#7C3AED] px-4 py-2 rounded-xl"
                  >
                    <Text className="text-white font-bold">
                      {claimingId === task.id ? '...' : 'Nhận'}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <Text className="text-[#718096] text-sm">
                    {Math.round((task.current_value / task.goal_value) * 100)}%
                  </Text>
                )}
              </View>
            )
          })}

          {tasks.length === 0 && (
            <Text className="text-[#A0AEC0] text-center mt-8">
              Chưa có nhiệm vụ. Chạy seed.sql trên Supabase.
            </Text>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  )
}
