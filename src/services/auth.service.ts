import { supabase } from '../lib/supabase';
import { Session, User } from '@supabase/supabase-js';

export interface AuthError {
    message: string;
}

export const AuthService = {
    async signUp(email: string, password: string, username?: string, avatarUrl?: string) {
        try {
            console.log('=== ATTEMPTING SIGN UP ===')
            console.log('Email:', email)
            console.log('Username:', username || 'Not provided')
            console.log('========================')
            
            const signUpOptions: {
                data?: { full_name?: string; username?: string; avatar_url?: string }
            } = {};
            if (username || avatarUrl) {
                signUpOptions.data = {};
                if (username) {
                    signUpOptions.data.full_name = username;
                    signUpOptions.data.username = username;
                }
                if (avatarUrl) {
                    signUpOptions.data.avatar_url = avatarUrl;
                }
            }
            
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: signUpOptions,
            });

            if (error) {
                console.error('=== SUPABASE SIGN UP ERROR ===')
                console.error('Error:', error)
                console.error('Error message:', error.message)
                console.error('Error status:', error.status)
                console.error('============================')
                throw error;
            }
            
            console.log('=== SIGN UP SUCCESS ===')
            console.log('User:', data.user?.id)
            console.log('Session:', data.session ? 'Created' : 'Not created')
            console.log('======================')
            
            return data;
        } catch (error) {
            console.error('=== SIGN UP EXCEPTION ===')
            console.error('Exception:', error)
            console.error('========================')
            throw error;
        }
    },

    async resendSignUpOTP(email: string) {
        const { data, error } = await supabase.auth.resend({
            type: 'signup',
            email,
        });

        if (error) throw error;
        return data;
    },

    async verifySignUpOTP(email: string, token: string) {
        const { data, error } = await supabase.auth.verifyOtp({
            email,
            token,
            type: 'signup',
        });

        if (error) throw error;
        return data;
    },

    async signIn(email: string, password: string) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) throw error;
        return data;
    },

    async signOut() {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    },

    async getSession(): Promise<Session | null> {
        const { data } = await supabase.auth.getSession();
        return data.session;
    },

    async getUser(): Promise<User | null> {
        const { data } = await supabase.auth.getUser();
        return data.user;
    },

    onAuthStateChange(callback: (session: Session | null) => void) {
        return supabase.auth.onAuthStateChange((_event, session) => {
            callback(session);
        });
    },

    /**
     * Send password reset OTP to user's email
     * @param email - User's email address
     */
    async sendPasswordResetOTP(email: string) {
        try {
            console.log('=== SENDING PASSWORD RESET OTP ===')
            console.log('Email:', email)
            
            // Supabase will send an OTP code via email
            const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: 'myapp://reset-password', // Deep link (optional for OTP flow)
            });

            if (error) {
                console.error('=== PASSWORD RESET OTP ERROR ===')
                console.error('Error:', error)
                console.error('================================')
                throw error;
            }

            console.log('=== PASSWORD RESET OTP SENT ===')
            console.log('=================================')
            
            return data;
        } catch (error) {
            console.error('=== PASSWORD RESET OTP EXCEPTION ===')
            console.error('Exception:', error)
            console.error('====================================')
            throw error;
        }
    },

    /**
     * Verify OTP code for password reset
     * @param email - User's email
     * @param token - 6-digit OTP code from email
     */
    async verifyOTPForReset(email: string, token: string) {
        try {
            console.log('=== VERIFYING PASSWORD RESET OTP ===')
            console.log('Email:', email)
            console.log('Token length:', token.length)
            
            const { data, error } = await supabase.auth.verifyOtp({
                email,
                token,
                type: 'recovery', // Important: 'recovery' type for password reset
            });

            if (error) {
                console.error('=== VERIFY OTP ERROR ===')
                console.error('Error:', error)
                console.error('========================')
                throw error;
            }

            console.log('=== OTP VERIFIED ===')
            console.log('Session created:', !!data.session)
            console.log('====================')
            
            return data;
        } catch (error) {
            console.error('=== VERIFY OTP EXCEPTION ===')
            console.error('Exception:', error)
            console.error('============================')
            throw error;
        }
    },

    /**
     * Update user's password (must be called after clicking reset link)
     * @param newPassword - New password
     */
    async updatePassword(newPassword: string) {
        try {
            console.log('=== UPDATING PASSWORD ===')
            
            const { data, error } = await supabase.auth.updateUser({
                password: newPassword,
            });

            if (error) {
                console.error('=== UPDATE PASSWORD ERROR ===')
                console.error('Error:', error)
                console.error('============================')
                throw error;
            }

            console.log('=== PASSWORD UPDATED ===')
            console.log('User:', data.user?.id)
            console.log('========================')
            
            return data;
        } catch (error) {
            console.error('=== UPDATE PASSWORD EXCEPTION ===')
            console.error('Exception:', error)
            console.error('================================')
            throw error;
        }
    },
};
