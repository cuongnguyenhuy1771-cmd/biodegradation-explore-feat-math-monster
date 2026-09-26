import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { AuthService } from '../services/auth.service';
import { notificationService } from '../services/notifications.service';

interface AuthContextType {
    session: Session | null;
    user: User | null;
    loading: boolean;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
    session: null,
    user: null,
    loading: true,
    isAuthenticated: false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log('=== AUTH PROVIDER INITIALIZING ===');
        
        // Check active session on mount
        AuthService.getSession().then(async (session) => {
            console.log('Initial session check:', session);
            console.log('User from session:', session?.user);
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
            if (session?.user?.id) {
                await notificationService.ensureDefaultSettings(session.user.id);
                await notificationService.seedWelcomeIfNeeded(session.user.id);
            }
            console.log('Auth loading set to false, isAuthenticated:', !!session);
        }).catch((error) => {
            console.error('Error getting initial session:', error);
            setLoading(false);
        });

        // Listen for auth changes
        const setupNotificationsForUser = async (userId: string) => {
            await notificationService.ensureDefaultSettings(userId);
            await notificationService.seedWelcomeIfNeeded(userId);
        };

        const { data: { subscription } } = AuthService.onAuthStateChange((session) => {
            console.log('Auth state changed:', session);
            console.log('User:', session?.user);
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
            if (session?.user?.id) {
                void setupNotificationsForUser(session.user.id);
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    return (
        <AuthContext.Provider value={{
            session,
            user,
            loading,
            isAuthenticated: !!session
        }}>
            {children}
        </AuthContext.Provider>
    );
};
