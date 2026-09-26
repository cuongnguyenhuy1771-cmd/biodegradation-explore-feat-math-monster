import { heroes, type HeroClassKey } from '@/constants/images'

/** Thứ tự khớp carousel chọn nhân vật (sort_order trong DB) */
export const HERO_CLASS_ORDER: HeroClassKey[] = [
  'chienBinh',
  'phapSu',
  'phatMinh',
  'xayDung',
]

export const HERO_RIBBON_LABELS: Record<HeroClassKey, string> = {
  chienBinh: 'CHIẾN BINH',
  phapSu: 'PHÁP SƯ',
  phatMinh: 'NHÀ PHÁT MINH',
  xayDung: 'NGƯỜI XÂY DỰNG',
}

/** Slug hero trong Supabase → class asset */
export const HERO_SLUG_TO_CLASS: Record<string, HeroClassKey> = {
  'thien-dinh': 'chienBinh',
  'linh-chi': 'phapSu',
  'bao-an': 'phatMinh',
  'minh-quang': 'xayDung',
}

export function getHeroClassByIndex(index: number): HeroClassKey {
  return HERO_CLASS_ORDER[index % HERO_CLASS_ORDER.length]
}

export function getHeroClassBySlug(slug: string | null | undefined): HeroClassKey {
  if (slug && HERO_SLUG_TO_CLASS[slug]) return HERO_SLUG_TO_CLASS[slug]
  return 'chienBinh'
}

export function getHeroAssets(classKey: HeroClassKey) {
  return heroes[classKey]
}

/** Avatar header Home — từ hero đã chọn lúc đăng ký */
export function getHeroAvatarSource(slug: string | null | undefined) {
  return getHeroAssets(getHeroClassBySlug(slug)).avatar
}

export function getHeroProfileSource(slug: string | null | undefined) {
  return getHeroAssets(getHeroClassBySlug(slug)).profile
}

/** Avatar bảng xếp hạng — ưu tiên hero đã chọn lúc đăng ký */
export function getLeaderboardAvatarSource(heroSlug: string | null | undefined) {
  if (heroSlug) return getHeroProfileSource(heroSlug)
  return getHeroAssets('chienBinh').profile
}
