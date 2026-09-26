export enum ERouteTable {
  ROOT = '/',
  WELCOME = '/welcome',
  LOADING = '/loading',
  ONBOARD = '/onboard',
  SIGIN_IN = '/sign-in',
  SIGIN_UP = '/sign-up',
  VERIFY_EMAIL = '/verify',
  USER_INFO = '/user-information',
  CHOOSE_HERO = '/choose-hero',
  FORGOT_PASSWORD = '/forgot-password',
  VERIFY_OTP_RESET = '/verify-otp-reset',
  RESET_PASSWORD = '/reset-password',
  HOME = '/home',
  COLLECTION = '/collection',
  LEADERBOARD = '/leaderboard',
  PROFILE = '/profile',
  NOTIFICATIONS = '/notifications',
  AREA_LEVELS = '/area-levels',
  AREA_DETAIL = '/area-detail',
  BATTLE = '/battle',
  BATTLE_RESULT = '/battle-result',
  DAILY_TASKS = '/daily-tasks',
  ACCOUNT_PROFILE = '/account-profile',
  ACCOUNT_PASSWORD = '/account-password',
  ACCOUNT_ABOUT = '/account-about',
  ACCOUNT_SUPPORT = '/account-support',
  ACCOUNT_PRIVACY = '/account-privacy',
  ACCOUNT_TERMS = '/account-terms',
}

/** Đường dẫn màn trong nhóm `(screens)` */
export function screensHref(
  route: ERouteTable | string,
  params?: Record<string, string | undefined>
): string {
  const path = route.startsWith('/') ? route : `/${route}`
  if (!params) return path
  const query = Object.entries(params)
    .filter(([, value]) => value != null && value !== '')
    .map(([key, value]) => `${key}=${encodeURIComponent(value!)}`)
    .join('&')
  return query ? `${path}?${query}` : path
}
