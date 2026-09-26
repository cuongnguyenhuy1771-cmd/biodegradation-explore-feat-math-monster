import React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { AVATAR_PRESETS } from '@/constants/avatars'
import { getAvatarAsset } from '@/utils/avatar'

type AvatarPickerProps = {
  value: string | null
  onChange: (avatarId: string) => void
  size?: number
  columns?: number
  /** Ẩn text label dưới mỗi avatar (dùng trong modal chọn nhanh) */
  hideLabels?: boolean
}

export default function AvatarPicker({
  value,
  onChange,
  size = 56,
  columns = 4,
  hideLabels = false,
}: AvatarPickerProps) {
  const gridItem = `${100 / columns}%`

  return (
    <View className="gap-3">
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {AVATAR_PRESETS.map((a) => {
          const selected = a.avatar_url === value
          const avatarAsset = getAvatarAsset(a.avatar_url)

          return (
            <TouchableOpacity
              key={a.id}
              onPress={() => onChange(a.avatar_url)}
              activeOpacity={0.85}
              style={{
                width: `${100 / columns}%` as any,
                alignItems: 'center',
                marginVertical: 6,
              }}
            >
              <View
                style={{
                  width: size + 12,
                  height: size + 12,
                  borderRadius: (size + 12) / 2,
                  borderWidth: selected ? 3 : 1,
                  borderColor: selected ? '#2BB08F' : '#E5E7EB',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#fff',
                }}
              >
                <Image
                  source={avatarAsset}
                  style={{ width: size, height: size, borderRadius: size / 2 }}
                  resizeMode="cover"
                />
              </View>
              {!hideLabels && (
                <Text
                  className="text-[10px] text-gray-500 mt-1"
                  numberOfLines={1}
                >
                  {a.label}
                </Text>
              )}
            </TouchableOpacity>
          )
        })}
      </View>
    </View>
  )
}

