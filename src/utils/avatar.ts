// Map avatar IDs to local image assets
const AVATAR_ASSETS: Record<string, any> = {
  avatar_1: require('~/assets/images/avatar/img_1.png'),
  avatar_2: require('~/assets/images/avatar/img_2.png'),
  avatar_3: require('~/assets/images/avatar/img_3.png'),
  avatar_4: require('~/assets/images/avatar/img_4.png'),
  avatar_5: require('~/assets/images/avatar/img_5.png'),
  avatar_6: require('~/assets/images/avatar/img_6.png'),
  avatar_7: require('~/assets/images/avatar/img_7.png'),
  avatar_8: require('~/assets/images/avatar/img_8.png'),
  avatar_default: require('~/assets/images/avatar/img.png'),
}

/**
 * Get local avatar asset by ID
 */
export const getAvatarAsset = (avatarId: string | null | undefined): any => {
  if (!avatarId) return AVATAR_ASSETS.avatar_default
  return AVATAR_ASSETS[avatarId] || AVATAR_ASSETS.avatar_default
}

/**
 * Check if avatar ID is valid local asset
 */
export const isLocalAvatarId = (avatarId: string | null | undefined): boolean => {
  if (!avatarId) return false
  return avatarId in AVATAR_ASSETS
}

/**
 * Get fallback avatar URL with user's name (for UI Avatars API)
 */
export const getFallbackAvatarUrl = (name: string = 'User'): string => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=A78BFA&color=fff`
}

/**
 * Get avatar source for Image component
 * Returns either local asset or URL object
 */
export const getAvatarSource = (
  avatarId: string | null | undefined,
  fallbackName: string = 'User'
): any => {
  // If it's a local avatar ID, return the asset
  if (isLocalAvatarId(avatarId)) {
    return getAvatarAsset(avatarId)
  }

  // If it's an HTTP URL, return as URI
  if (avatarId && avatarId.startsWith('http')) {
    return { uri: avatarId }
  }

  // Fallback to UI Avatars
  return { uri: getFallbackAvatarUrl(fallbackName) }
}

/**
 * Get avatar URL (deprecated - use getAvatarSource instead)
 * Kept for backward compatibility
 */
export const getAvatarUrl = (
  avatarId: string | null | undefined,
  fallbackName: string = 'User',
  updatedAt?: string
): string => {
  // For backward compatibility, return URL string
  // If it's a local avatar ID, return a placeholder URL
  if (isLocalAvatarId(avatarId)) {
    return `local://${avatarId}`
  }

  // If it's an HTTP URL, return as is
  if (avatarId && avatarId.startsWith('http')) {
    return avatarId
  }

  // Fallback to UI Avatars
  return getFallbackAvatarUrl(fallbackName)
}
