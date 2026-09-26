import React, { useRef, useState } from 'react'
import { View, TextInput, NativeSyntheticEvent, TextInputKeyPressEventData } from 'react-native'

type Props = {
  length?: number
  onChange?: (code: string) => void
}

const OtpInput: React.FC<Props> = ({ length = 6, onChange }) => {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(''))
  const inputs = useRef<(TextInput | null)[]>([])

  const handleChange = (text: string, index: number) => {
    const newOtp = [...otp]
    newOtp[index] = text
    setOtp(newOtp)

    if (text && index < length - 1) {
      inputs.current[index + 1]?.focus()
    }

    onChange?.(newOtp.join(''))
  }

  const handleKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && otp[index] === '') {
      if (index > 0) {
        inputs.current[index - 1]?.focus()
      }
    }
  }

  return (
    <View className="flex-row justify-center gap-2 mt-4">
      {otp.map((digit, index) => (
        <TextInput
          key={index}
          ref={(el) => {
            inputs.current[index] = el
          }}
          placeholder="-"
          value={digit}
          onChangeText={(text) => handleChange(text.slice(-1), index)}
          onKeyPress={(e) => handleKeyPress(e, index)}
          keyboardType="number-pad"
          maxLength={1}
          className="w-12 h-14 text-center text-xl font-semibold rounded-2xl border border-zinc-300 text-black bg-white"
          style={{ fontFamily: 'SNPro-Regular' }}
        />
      ))}
    </View>
  )
}

export default OtpInput
