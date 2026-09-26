import React, { useEffect, useMemo, useState } from 'react'
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/context/auth-provider'
import { MathMonstersService } from '@/services/mathMonsters.service'
import type { DailyTaskView } from '@/services/mathMonsters.service'
import { toast } from '@/components/common/ToastManager'
import images from '@/constants/images'
import IconClose from '~/assets/icons/IconClose'

/** TODO: thêm @/assets/images/daily-task/reward-badge.webp khi có asset Figma */
const DAILY_TASK_ASSETS = {
  rewardBadge: null as number | null,
}

type DailyTasksModalProps = {
  visible: boolean
  onClose: () => void
  onGo?: () => void
}

function useCountdownToMidnight() {
  const [timeLeft, setTimeLeft] = useState('00:00:00')

  useEffect(() => {
    const tick = () => {
      const now = new Date()
      const midnight = new Date(now)
      midnight.setHours(24, 0, 0, 0)
      const diff = Math.max(0, midnight.getTime() - now.getTime())
      const hours = Math.floor(diff / 3_600_000)
      const minutes = Math.floor((diff % 3_600_000) / 60_000)
      const seconds = Math.floor((diff % 60_000) / 1000)
      setTimeLeft(
        [hours, minutes, seconds]
          .map((value) => String(value).padStart(2, '0'))
          .join(':'),
      )
    }

    tick()
    const timer = setInterval(tick, 1000)
    return () => clearInterval(timer)
  }, [])

  return timeLeft
}

function RewardBadge({ amount }: { amount: number }) {
  if (DAILY_TASK_ASSETS.rewardBadge) {
    return (
      <Image
        source={DAILY_TASK_ASSETS.rewardBadge}
        style={styles.rewardImage}
        contentFit="contain"
      />
    )
  }

  return (
    <View style={styles.rewardWrap}>
      <Image source={images.medal} style={styles.rewardMedal} contentFit="contain" />
      <View style={styles.rewardRibbon}>
        <Text style={styles.rewardAmount}>{amount}</Text>
      </View>
    </View>
  )
}

function ActionButton({
  label,
  variant,
  onPress,
  disabled,
}: {
  label: string
  variant: 'go' | 'claim'
  onPress: () => void
  disabled?: boolean
}) {
  const isGo = variant === 'go'

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [pressed && styles.btnPressed]}
    >
      <LinearGradient
        colors={isGo ? ['#FFD766', '#F5B82E'] : ['#74E85A', '#58CC02']}
        style={[
          styles.actionBtn,
          isGo ? styles.actionBtnGo : styles.actionBtnClaim,
        ]}
      >
        <Text
          style={[
            styles.actionBtnText,
            isGo ? styles.actionBtnTextGo : styles.actionBtnTextClaim,
          ]}
        >
          {label}
        </Text>
      </LinearGradient>
    </Pressable>
  )
}

function MissionRow({
  task,
  claiming,
  onClaim,
  onGo,
}: {
  task: DailyTaskView
  claiming: boolean
  onClaim: (taskId: string) => void
  onGo: () => void
}) {
  const progress = Math.min(task.current_value / task.goal_value, 1)
  const progressLabel = `${Math.min(task.current_value, task.goal_value)}/${task.goal_value}`
  const isClaimed = task.status === 'claimed'
  const canClaim = task.status === 'completed'

  return (
    <View style={styles.missionRow}>
      <RewardBadge amount={task.reward_points} />

      <View style={styles.missionContent}>
        <Text style={styles.missionTitle} numberOfLines={2}>
          {task.title}
        </Text>
        <View style={styles.missionProgressTrack}>
          <View
            style={[styles.missionProgressFill, { width: `${progress * 100}%` }]}
          />
          <Text style={styles.missionProgressText}>{progressLabel}</Text>
        </View>
      </View>

      <View style={styles.missionAction}>
        {isClaimed ? (
          <Ionicons name="checkmark-circle" size={42} color="#58CC02" />
        ) : canClaim ? (
          <ActionButton
            label={claiming ? '...' : 'Nhận'}
            variant="claim"
            onPress={() => onClaim(task.id)}
            disabled={claiming}
          />
        ) : (
          <ActionButton label="Đi" variant="go" onPress={onGo} />
        )}
      </View>
    </View>
  )
}

export default function DailyTasksModal({
  visible,
  onClose,
  onGo,
}: DailyTasksModalProps) {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [claimingId, setClaimingId] = useState<string | null>(null)
  const countdown = useCountdownToMidnight()
  const today = new Date().toISOString().slice(0, 10)

  const { data: tasks = [], isPending, refetch } = useQuery({
    queryKey: ['daily-tasks', user?.id, today],
    enabled: visible && !!user?.id,
    queryFn: () => MathMonstersService.getDailyTasks(user!.id, today),
  })

  const completedCount = useMemo(
    () =>
      tasks.filter(
        (task) => task.status === 'completed' || task.status === 'claimed',
      ).length,
    [tasks],
  )

  const chestProgress =
    tasks.length > 0 ? completedCount / tasks.length : 0

  const claimTask = async (taskId: string) => {
    setClaimingId(taskId)
    try {
      const result = await MathMonstersService.claimDailyTask(taskId)
      toast.success('Nhận thưởng', `+${result.coins ?? 0} xu`)
      await refetch()
      await queryClient.invalidateQueries({ queryKey: ['profile'] })
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Không thể nhận thưởng'
      toast.error('Lỗi', message)
    } finally {
      setClaimingId(null)
    }
  }

  const handleGo = () => {
    onClose()
    onGo?.()
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalShell}>
          <View style={styles.closeBar} pointerEvents="box-none">
            <Pressable
              onPress={onClose}
              style={({ pressed }) => [
                styles.closeBtn,
                pressed && styles.btnPressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Đóng"
              hitSlop={8}
            >
              <IconClose />
            </Pressable>
          </View>

          <View style={styles.modalGlow}>
            <View style={styles.modalCard}>
              <LinearGradient
                colors={['#FDC42F', '#DB8900']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.titleBanner}
              >
                <Text style={styles.titleText}>Nhiệm vụ hôm nay</Text>
              </LinearGradient>

              <View style={styles.timerRow}>
                <Ionicons name="time-outline" size={16} color="#FFFFFF" />
                <Text style={styles.timerText}>{countdown}</Text>
              </View>

              <View style={styles.chestRow}>
                <View style={styles.chestProgressTrack}>
                  <View
                    style={[
                      styles.chestProgressFill,
                      { width: `${chestProgress * 100}%` },
                    ]}
                  />
                  <Text style={styles.chestProgressText}>
                    {completedCount}/{tasks.length || 3}
                  </Text>
                </View>
                <Image
                  source={images.iconChest}
                  style={styles.chestIcon}
                  contentFit="contain"
                />
              </View>

              <View style={styles.listContainer}>
                {isPending ? (
                  <View style={styles.loadingWrap}>
                    <ActivityIndicator size="large" color="#A78BFA" />
                  </View>
                ) : tasks.length === 0 ? (
                  <Text style={styles.emptyText}>
                    Chưa có nhiệm vụ. Chạy seed.sql trên Supabase.
                  </Text>
                ) : (
                  <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listContent}
                  >
                    {tasks.map((task) => (
                      <MissionRow
                        key={task.id}
                        task={task}
                        claiming={claimingId === task.id}
                        onClaim={claimTask}
                        onGo={handleGo}
                      />
                    ))}
                  </ScrollView>
                )}
              </View>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(6, 4, 18, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalShell: {
    width: '100%',
    maxWidth: 376,
    position: 'relative',
    paddingTop: 10,
    direction: 'ltr',
  },
  closeBar: {
    position: 'absolute',
    top: -4,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    zIndex: 30,
    elevation: 30,
  },
  closeBtn: {
    marginRight: -14,
  },
  modalGlow: {
    borderRadius: 36,
    padding: 3,
    backgroundColor: '#C4B8FF',
    shadowColor: '#7B61FF',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.45,
    shadowRadius: 28,
    elevation: 16,
  },
  modalCard: {
    backgroundColor: '#4A4477',
    borderRadius: 33,
    paddingTop: 40,
    paddingBottom: 16,
    paddingHorizontal: 14,
    position: 'relative',
  },
  titleBanner: {
    position: 'absolute',
    top: -22,
    left: '12%',
    right: '12%',
    zIndex: 5,
    borderRadius: 22,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFE89A',
    shadowColor: '#C88A10',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 8,
  },
  titleText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    textShadowColor: 'rgba(100, 60, 0, 0.35)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 12,
  },
  timerText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  chestRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    paddingRight: 22,
    position: 'relative',
  },
  chestProgressTrack: {
    flex: 1,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1A1730',
    overflow: 'hidden',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#0F0D1E',
  },
  chestProgressFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#F5B82E',
    borderRadius: 16,
  },
  chestProgressText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    textAlign: 'center',
    zIndex: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  chestIcon: {
    position: 'absolute',
    right: -8,
    top: -10,
    width: 64,
    height: 64,
  },
  listContainer: {
    backgroundColor: '#2A2648',
    borderRadius: 22,
    minHeight: 252,
    maxHeight: 320,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderWidth: 2,
    borderColor: '#1A1730',
  },
  listContent: {
    paddingVertical: 4,
  },
  loadingWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    color: 'rgba(255, 255, 255, 0.55)',
    textAlign: 'center',
    padding: 24,
    fontSize: 14,
  },
  missionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 4,
    backgroundColor: '#4B4A83',
    marginBottom: 8,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 1,

    elevation: 3,
  },
  rewardImage: {
    width: 54,
    height: 64,
    flexShrink: 0,
  },
  rewardWrap: {
    width: 68,
    height: 68,
    alignItems: 'center',
    flexShrink: 0,
    backgroundColor: '#373664',
    borderRadius: 24,
    justifyContent: 'center'
  },
  rewardMedal: {
    width: 46,
    height: 46,
  },
  rewardRibbon: {
    marginTop: -20,
    minWidth: 34,
    alignItems: 'center',
  },
  rewardAmount: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
    borderColor: 'rgba(0, 0, 0, 0.25)'
  },
  missionContent: {
    flex: 1,
    gap: 6,
    minWidth: 0,
  },
  missionTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 18,
  },
  missionProgressTrack: {
    height: 24,
    borderRadius: 12,
    backgroundColor: '#1A1730',
    overflow: 'hidden',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#0F0D1E',
  },
  missionProgressFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#58CC02',
    borderRadius: 11,
  },
  missionProgressText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    textAlign: 'center',
    zIndex: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.35)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  missionAction: {
    width: 58,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  actionBtn: {
    minWidth: 54,
    height: 36,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  actionBtnGo: {
    borderWidth: 2,
    borderColor: '#FFE89A',
    borderBottomWidth: 4,
    borderBottomColor: '#C88A10',
  },
  actionBtnClaim: {
    borderWidth: 2,
    borderColor: '#B8F07A',
    borderBottomWidth: 4,
    borderBottomColor: '#3A8A00',
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: '800',
  },
  actionBtnTextGo: {
    color: '#4A3200',
  },
  actionBtnTextClaim: {
    color: '#1A3D00',
  },
  btnPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.96 }],
  },
})
