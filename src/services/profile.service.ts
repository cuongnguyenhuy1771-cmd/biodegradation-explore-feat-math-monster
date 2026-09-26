import { Platform } from 'react-native';
import { supabase } from '../lib/supabase';
import type { Database } from '@/types/database.types';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

export interface Profile {
    id: string;
    username: string | null;
    full_name?: string | null;
    email?: string | null;
    phone?: string | null;
    avatar_url: string | null;
    avatar_preset_id?: string | null;
    selected_hero_id?: string | null;
    level?: number;
    total_points?: number | null;
    total_coins?: number;
    total_stars?: number;
    notifications_enabled?: boolean;
    dark_mode_enabled?: boolean;
    onboarding_completed_at?: string | null;
    hero_selected_at?: string | null;
    created_at?: string;
    updated_at?: string;
}

export const ProfileService = {
    /**
     * Get user profile by user ID
     */
    async getProfile(userId: string): Promise<Profile | null> {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .maybeSingle();

            if (error) {
                console.error('Error fetching profile:', error);
                return null;
            }

            // If profile doesn't exist, create one
            if (!data) {
                console.log('Profile not found, creating new profile for user:', userId);
                return await this.createProfile(userId);
            }

            return data;
        } catch (error) {
            console.error('Exception fetching profile:', error);
            return null;
        }
    },

    /**
     * Create a new profile for a user
     */
    async createProfile(userId: string): Promise<Profile | null> {
        try {
            // Get user info from auth
            const { data: { user } } = await supabase.auth.getUser();
            
            const usernameFromMeta =
                (user?.user_metadata as any)?.username ??
                (user?.user_metadata as any)?.full_name ??
                (user?.email ? user.email.split('@')[0] : undefined) ??
                'Player'

            const { data, error } = await supabase
                .from('profiles')
                .insert({
                    id: userId,
                    username: usernameFromMeta,
                    avatar_url: null,
                    total_points: 0,
                })
                .select()
                .single();

            if (error) {
                console.error('Error creating profile:', error);
                return null;
            }

            console.log('✅ Profile created successfully:', data);
            return data;
        } catch (error) {
            console.error('Exception creating profile:', error);
            return null;
        }
    },

    /**
     * Update user profile
     */
    async updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile | null> {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .update(updates as Database['public']['Tables']['profiles']['Update'])
                .eq('id', userId)
                .select()
                .maybeSingle();

            if (error) {
                console.error('Error updating profile:', error);
                throw error;
            }

            return data;
        } catch (error) {
            console.error('Exception updating profile:', error);
            throw error;
        }
    },

    /**
     * Pick an image from the device gallery
     */
    async pickImage(): Promise<ImagePicker.ImagePickerAsset | null> {
        try {
            console.log('🖼️ Starting pickImage...');
            
            // Check and request permission
            const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
            console.log('📸 Permission result:', permissionResult);
            
            if (permissionResult.status !== 'granted') {
                console.log('❌ Permission denied');
                throw new Error('Bạn cần cấp quyền truy cập thư viện ảnh để thay đổi ảnh đại diện.\n\nVào Cài đặt > Quyền để bật quyền truy cập ảnh.');
            }

            console.log('✅ Permission granted, launching picker...');
            
            // Launch image picker
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: 'images',
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            console.log('📷 Picker result:', result);

            if (result.canceled) {
                console.log('User canceled picker');
                return null;
            }

            if (!result.assets || result.assets.length === 0) {
                console.log('No assets selected');
                return null;
            }

            console.log('✅ Image selected:', result.assets[0].uri);
            return result.assets[0];
        } catch (error: any) {
            console.error('❌ Error in pickImage:', error);
            console.error('Error stack:', error?.stack);
            throw error;
        }
    },

    /**
     * Upload avatar to Supabase Storage
     */
    async uploadAvatar(userId: string, imageUri: string): Promise<string> {
        try {
            // Read file as base64
            const base64 = await FileSystem.readAsStringAsync(imageUri, {
                encoding: FileSystem.EncodingType.Base64,
            });

            // Generate unique filename
            const fileExt = imageUri.split('.').pop()?.toLowerCase() || 'jpg';
            const fileName = `${userId}_${Date.now()}.${fileExt}`;
            const filePath = `${userId}/${fileName}`;

            // Convert base64 to ArrayBuffer
            const arrayBuffer = Uint8Array.from(atob(base64), c => c.charCodeAt(0)).buffer;

            // Upload to Supabase Storage
            const { error } = await supabase.storage
                .from('avatars')
                .upload(filePath, arrayBuffer, {
                    contentType: `image/${fileExt}`,
                    upsert: true,
                });

            if (error) {
                console.error('Error uploading avatar:', error);
                throw error;
            }

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            return publicUrl;
        } catch (error) {
            console.error('Exception uploading avatar:', error);
            throw error;
        }
    },

    /**
     * Update user avatar (pick and upload)
     */
    async updateAvatar(userId: string): Promise<string | null> {
        try {
            // Pick image
            const image = await this.pickImage();
            if (!image) {
                return null;
            }

            // Upload to storage
            const avatarUrl = await this.uploadAvatar(userId, image.uri);

            // Update profile with new avatar URL
            await this.updateProfile(userId, { avatar_url: avatarUrl });

            return avatarUrl;
        } catch (error) {
            console.error('Error updating avatar:', error);
            throw error;
        }
    },

    /**
     * Delete old avatar from storage
     */
    async deleteAvatar(avatarUrl: string): Promise<void> {
        try {
            // Extract file path from URL
            const urlParts = avatarUrl.split('/avatars/');
            if (urlParts.length < 2) return;

            const filePath = urlParts[1];

            const { error } = await supabase.storage
                .from('avatars')
                .remove([filePath]);

            if (error) {
                console.error('Error deleting avatar:', error);
                throw error;
            }
        } catch (error) {
            console.error('Exception deleting avatar:', error);
            // Don't throw - deletion failure shouldn't block the upload
        }
    },
};
