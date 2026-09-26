import React, { useMemo, useState } from 'react'
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
  type ViewStyle,
} from 'react-native'
import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import Constants from 'expo-constants'
import { router } from 'expo-router'
import {
  ArrowRight2,
  Call,
  Crown,
  DocumentText,
  InfoCircle,
  Lock,
  Logout,
  MedalStar,
  Notification,
  ShieldTick,
  Star1,
  User,
} from 'iconsax-react-native'
import { useAuth } from '@/context/auth-provider'
import { useProfile } from '@/hooks/useProfile'
import { AuthService } from '@/services/auth.service'
import { toast } from '@/components/common/ToastManager'
import { MathMonstersService } from '@/services/mathMonsters.service'
import { ERouteTable, screensHref } from '@/constants/route-table'
import { getLeaderboardAvatarSource } from '@/constants/hero-assets'
import images from '@/constants/images'
import ConfirmModal from '@/modules/account/components/ConfirmModal'
import { getProfileDisplayName } from '@/utils/profile-display'

const TAB_BAR_SPACE = 120
const APP_VERSION = Constants.expoConfig?.version ?? '1.0.0'

export default function ProfileScreen() {
  const { user } = useAuth()
  const { profile, updateProfile } = useProfile()
  const queryClient = useQueryClient()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  const { data: selectedHero } = useQuery({
    queryKey: ['selected-hero', profile?.selected_hero_id],
    enabled: !!profile?.selected_hero_id,
    queryFn: () => MathMonstersService.getHeroById(profile!.selected_hero_id!),
  })

  const { data: leaderboard = [] } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: () => MathMonstersService.getLeaderboard(50),
  })

  const heroAvatarSource = useMemo(
    () => getLeaderboardAvatarSource(selectedHero?.slug),
    [selectedHero?.slug],
  )

  const displayName = getProfileDisplayName(profile)
  const totalPoints = profile?.total_points ?? 0
  const totalStars = profile?.total_stars ?? 0
  const displayPoints = totalPoints.toLocaleString('vi-VN')
  const notificationsEnabled = profile?.notifications_enabled ?? true

  const rank = useMemo(() => {
    if (!user?.id) return '—'
    const index = leaderboard.findIndex((row) => row.id === user.id)
    return index >= 0 ? `#${index + 1}` : '—'
  }, [leaderboard, user?.id])

  const handleLogout = () => {
    setShowLogoutModal(true)
  }

  const confirmLogout = async () => {
    setIsLoggingOut(true)
    try {
      await AuthService.signOut()
      await queryClient.clear()
      setShowLogoutModal(false)
      router.replace(ERouteTable.SIGIN_IN)
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Không thể đăng xuất'
      toast.error('Lỗi', message)
    } finally {
      setIsLoggingOut(false)
    }
  }

  const handleToggleNotifications = async (value: boolean) => {
    if (!user?.id) return
    try {
      await updateProfile({
        userId: user.id,
        updates: { notifications_enabled: value },
      })
    } catch {
      toast.error('Lỗi', 'Không thể cập nhật cài đặt thông báo')
    }
  }

  if (!user) {
    return (
      <SafeAreaView style={styles.centered} edges={['top']}>
        <Text style={styles.loginRequired}>Cần đăng nhập</Text>
      </SafeAreaView>
    )
  }

  if (!profile) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#A78BFA" />
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.titleBlock}>
          <Text style={styles.title}>Cá nhân</Text>
          <Text style={styles.subtitle}>Hành trình của bạn</Text>
        </View>

        <View style={styles.pointsBlock}>
          <View style={styles.medalWrap}>
            <Image
              source={images.medal}
              style={styles.medalIcon}
              contentFit="contain"
            />
          </View>
          <View style={styles.pointsPill}>
            <Text style={styles.pointsText}>{displayPoints}</Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.heroSection}>
          <View style={styles.heroGlow} />
          <View style={styles.heroAvatarFrame}>
            <Image
              source={heroAvatarSource}
              style={styles.heroImage}
              contentFit="cover"
            />
          </View>
          <Text style={styles.heroName}>{displayName}</Text>
        </View>

        <InsetCard innerStyle={styles.statsInner}>
          <View style={styles.statsRow}>
            <StatColumn
              icon={<Star1 size={22} color="#FFFFFF" variant="Bold" />}
              iconBg="#FFB922"
              label="Tổng sao"
              value={String(totalStars)}
            />
            <View style={styles.statDivider} />
            <StatColumn
              icon={<MedalStar size={22} color="#FFFFFF" variant="Bold" />}
              iconBg="#3582FF"
              label="Tổng điểm"
              value={displayPoints}
            />
            <View style={styles.statDivider} />
            <StatColumn
              icon={<Crown size={22} color="#FFFFFF" variant="Bold" />}
              iconBg="#E36323"
              label="Hạng"
              value={rank}
            />
          </View>
        </InsetCard>

        <MenuCard title="CÀI ĐẶT">
          <MenuRow
            icon={<User size={18} color="#9AA8C4" variant="Outline" />}
            label="Thông tin"
            onPress={() =>
              router.push(screensHref(ERouteTable.ACCOUNT_PROFILE) as never)
            }
          />
          <DashedDivider />
          <MenuRow
            icon={<Lock size={18} color="#9AA8C4" variant="Outline" />}
            label="Thay đổi mật khẩu"
            onPress={() =>
              router.push(screensHref(ERouteTable.ACCOUNT_PASSWORD) as never)
            }
          />
          <DashedDivider />
          <MenuRow
            icon={<Notification size={18} color="#9AA8C4" variant="Outline" />}
            label="Thông báo"
            trailing={
              <Switch
                value={notificationsEnabled}
                onValueChange={handleToggleNotifications}
                trackColor={{ false: '#3D3568', true: '#7C5CFF' }}
                thumbColor="#FFFFFF"
                ios_backgroundColor="#3D3568"
              />
            }
          />
        </MenuCard>

        <MenuCard title="GIỚI THIỆU">
          <MenuRow
            icon={<InfoCircle size={18} color="#9AA8C4" variant="Outline" />}
            label="Giới thiệu"
            onPress={() =>
              router.push(screensHref(ERouteTable.ACCOUNT_ABOUT) as never)
            }
          />
          <DashedDivider />
          <MenuRow
            icon={<Call size={18} color="#9AA8C4" variant="Outline" />}
            label="Liên hệ & Hỗ trợ"
            onPress={() =>
              router.push(screensHref(ERouteTable.ACCOUNT_SUPPORT) as never)
            }
          />
          <DashedDivider />
          <MenuRow
            icon={<ShieldTick size={18} color="#9AA8C4" variant="Outline" />}
            label="Chính sách bảo mật"
            onPress={() =>
              router.push(screensHref(ERouteTable.ACCOUNT_PRIVACY) as never)
            }
          />
          <DashedDivider />
          <MenuRow
            icon={<DocumentText size={18} color="#9AA8C4" variant="Outline" />}
            label="Điều khoản & Điều kiện"
            onPress={() =>
              router.push(screensHref(ERouteTable.ACCOUNT_TERMS) as never)
            }
          />
        </MenuCard>

        <Pressable
          onPress={handleLogout}
          disabled={isLoggingOut}
          style={({ pressed }) => [pressed && styles.logoutPressed]}
        >
          <LinearGradient
            colors={['#FF9A6C', '#FF7043']}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.logoutBtn}
          >
            <Logout size={20} color="#FFFFFF" variant="Bold" />
            <Text style={styles.logoutText}>
              {isLoggingOut ? 'Đang xử lý...' : 'Đăng xuất'}
            </Text>
          </LinearGradient>
        </Pressable>

        <Text style={styles.versionText}>Phiên bản {APP_VERSION}</Text>

        <View style={{ height: TAB_BAR_SPACE }} />
      </ScrollView>

      <ConfirmModal
        visible={showLogoutModal}
        title="Đăng xuất?"
        message="Bạn có chắc chắn muốn đăng xuất không?"
        confirmLabel="Xác nhận"
        loading={isLoggingOut}
        onCancel={() => !isLoggingOut && setShowLogoutModal(false)}
        onConfirm={confirmLogout}
      />
    </SafeAreaView>
  )
}

function StatColumn({
  icon,
  iconBg,
  label,
  value,
}: {
  icon: React.ReactNode
  iconBg: string
  label: string
  value: string
}) {
  return (
    <View style={styles.statColumn}>
      <View style={[styles.statIconCircle, { backgroundColor: iconBg }]}>
        {icon}
      </View>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  )
}

function InsetCard({
  children,
  innerStyle,
}: {
  children: React.ReactNode
  innerStyle?: ViewStyle
}) {
  return (
    <View style={styles.insetCardOuter}>
      <View style={[styles.insetCardInner, innerStyle]}>
        <LinearGradient
          pointerEvents="none"
          colors={[
            'rgba(255, 255, 255, 0.22)',
            'rgba(255, 255, 255, 0.06)',
            'transparent',
          ]}
          locations={[0, 0.35, 1]}
          style={styles.insetCardHighlightTop}
        />
        <LinearGradient
          pointerEvents="none"
          colors={['transparent', 'rgba(0, 0, 0, 0.55)']}
          style={styles.insetCardShadowBottom}
        />
        {children}
      </View>
    </View>
  )
}

function MenuCard({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <InsetCard innerStyle={styles.menuInner}>
      <Text style={styles.menuCardTitle}>{title}</Text>
      <View style={styles.menuCardBody}>{children}</View>
    </InsetCard>
  )
}

function DashedDivider() {
  return <View style={styles.dashedDivider} />
}

function MenuRow({
  icon,
  label,
  onPress,
  trailing,
}: {
  icon: React.ReactNode
  label: string
  onPress?: () => void
  trailing?: React.ReactNode
}) {
  const row = (
    <View style={styles.menuRow}>
      <View style={styles.menuRowLeft}>
        <View style={styles.menuIconCircle}>{icon}</View>
        <Text style={styles.menuLabel} numberOfLines={1}>
          {label}
        </Text>
      </View>
      <View style={styles.menuRowRight}>
        {trailing ?? (
          <ArrowRight2 size={16} color="#6B7A99" variant="Outline" />
        )}
      </View>
    </View>
  )

  if (!onPress) return row

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [pressed && styles.menuRowPressed]}
    >
      {row}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#13122B',
  },
  centered: {
    flex: 1,
    backgroundColor: '#1A1A2E',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  loginRequired: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  scrollContent: {
    paddingBottom: 16,
  },
  scroll: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 12,
    backgroundColor: '#13122B',
    zIndex: 1,
  },
  titleBlock: {
    flex: 1,
    paddingRight: 12,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 34,
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 15,
    fontWeight: '600',
    marginTop: 4,
  },
  pointsBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 0,
    marginTop: 2,
  },
  pointsMedal: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(91, 168, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  pointsPill: {
    justifyContent: 'center',
    backgroundColor: '#252545',
    borderRadius: 20,
    paddingRight: 12,
    paddingLeft: 22,
    marginLeft: -14,
    height: 30,
    minWidth: 80,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  pointsText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  heroSection: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 22,
    minHeight: 160,
    justifyContent: 'flex-end',
  },
  heroGlow: {
    position: 'absolute',
    bottom: 56,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(124, 92, 255, 0.2)',
  },
  heroAvatarFrame: {
    width: '100%',
    height: 260,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroName: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  statsInner: {
    paddingVertical: 20,
    paddingHorizontal: 4,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statColumn: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  statDivider: {
    width: 1,
    height: 56,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  statIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statLabel: {
    color: 'rgba(255, 255, 255, 0.45)',
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
    textAlign: 'center',
  },
  insetCardOuter: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#1B1B36',
    borderRadius: 32,
    padding: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 8,
  },
  insetCardInner: {
    backgroundColor: '#232242',
    borderRadius: 32,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.35)',
    borderTopColor: 'rgba(255, 255, 255, 0.14)',
  },
  insetCardHighlightTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 8,
    zIndex: 1,
  },
  insetCardShadowBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 8,
    zIndex: 1,
  },
  menuInner: {
    paddingTop: 16,
    paddingBottom: 8,
  },
  menuCardTitle: {
    color: 'rgba(174, 163, 255, 0.55)',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.1,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  menuCardBody: {
    paddingHorizontal: 4,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 12,
    minHeight: 52,
  },
  menuRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  menuRowRight: {
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 24,
  },
  menuRowPressed: {
    opacity: 0.7,
  },
  menuIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    flexShrink: 0,
  },
  menuLabel: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  dashedDivider: {
    marginHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    borderStyle: 'dashed',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 20,
    marginTop: 8,
    paddingVertical: 16,
    borderRadius: 24,
  },
  logoutPressed: {
    opacity: 0.9,
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  versionText: {
    color: 'rgba(255, 255, 255, 0.35)',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 16,
  },
  medalWrap: {
    width: 40,
    height: 40,
    zIndex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  medalIcon: {
    width: 40,
    height: 40,
  },
})
