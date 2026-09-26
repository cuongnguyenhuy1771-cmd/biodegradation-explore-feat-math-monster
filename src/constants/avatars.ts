import avatarOptions from './avatar-options.json'

export type AvatarPreset = {
  id: string
  label: string
  avatar_url: string
}

// Avatar options are declared in JSON with fake paths.
// You can replace these with real CDN/storage paths later.
export const AVATAR_PRESETS: AvatarPreset[] = avatarOptions as AvatarPreset[]

