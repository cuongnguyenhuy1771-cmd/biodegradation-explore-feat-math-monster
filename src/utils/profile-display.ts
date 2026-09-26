type ProfileNameFields = {
  full_name?: string | null
  username?: string | null
}

export function getProfileDisplayName(
  profile?: ProfileNameFields | null,
  fallback = 'Player',
): string {
  if (!profile) return fallback
  const name = profile.full_name?.trim() || profile.username?.trim()
  return name || fallback
}
