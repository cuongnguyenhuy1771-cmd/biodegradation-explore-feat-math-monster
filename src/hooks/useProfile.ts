import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ProfileService, Profile } from '@/services/profile.service';
import { useAuth } from '@/context/auth-provider';

export function useProfile() {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    // Fetch profile
    const { data: profile, isLoading, error, refetch } = useQuery<Profile | null>({
        queryKey: ['profile', user?.id],
        queryFn: () => user?.id ? ProfileService.getProfile(user.id) : null,
        enabled: !!user?.id,
        staleTime: 0, // Always fetch fresh data
        gcTime: 1000 * 60 * 5, // Keep in cache for 5 minutes
    });

    // Update profile mutation
    const updateProfileMutation = useMutation({
        mutationFn: ({ userId, updates }: { userId: string; updates: Partial<Profile> }) =>
            ProfileService.updateProfile(userId, updates),
        onSuccess: async (data) => {
            // Update cache immediately with new data
            queryClient.setQueryData(['profile', user?.id], data);
            // Also invalidate to trigger background refetch
            await queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
        },
    });

    // Update avatar mutation
    const updateAvatarMutation = useMutation({
        mutationFn: (userId: string) => ProfileService.updateAvatar(userId),
        onSuccess: async (newAvatarUrl) => {
            // Update cache immediately with new avatar URL
            if (profile && newAvatarUrl) {
                queryClient.setQueryData(['profile', user?.id], {
                    ...profile,
                    avatar_url: newAvatarUrl,
                });
            }
            // Also invalidate to trigger background refetch
            await queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
        },
    });

    return {
        profile,
        isLoading,
        error,
        refetch,
        updateProfile: updateProfileMutation.mutateAsync,
        updateAvatar: updateAvatarMutation.mutateAsync,
        isUpdating: updateProfileMutation.isPending,
        isUploadingAvatar: updateAvatarMutation.isPending,
    };
}
