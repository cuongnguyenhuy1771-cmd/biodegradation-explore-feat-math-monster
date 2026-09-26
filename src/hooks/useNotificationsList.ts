import { useCallback } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { notificationService } from '@/services/notifications.service'
import { useAuth } from '@/context/auth-provider'
import { useNotifications } from '@/context/notification-provider'

export function useNotificationsList() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const { decrementCount, resetCount } = useNotifications()

  const query = useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: () => notificationService.getNotifications(50),
    enabled: !!user?.id,
  })

  const markReadMutation = useMutation({
    mutationFn: (id: string) => notificationService.markAsRead(id),
    onSuccess: () => {
      decrementCount()
      queryClient.invalidateQueries({ queryKey: ['notifications', user?.id] })
    },
  })

  const markAllReadMutation = useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: () => {
      resetCount()
      queryClient.invalidateQueries({ queryKey: ['notifications', user?.id] })
    },
  })

  const markAsRead = useCallback(
    (id: string) => {
      markReadMutation.mutate(id)
    },
    [markReadMutation],
  )

  return {
    notifications: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
    markAsRead,
    markAllAsRead: markAllReadMutation.mutate,
  }
}
