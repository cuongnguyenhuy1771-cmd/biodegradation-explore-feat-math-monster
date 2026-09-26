import React from 'react'
import { StyleSheet, TextInputProps, View } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'

type Props = TextInputProps

export default function AuthInput({ style, ...rest }: Props) {
  return (
    <View style={styles.wrap}>
      <TextInput
        {...rest}
        placeholderTextColor="#9CA3AF"
        autoCorrect={false}
        spellCheck={false}
        style={[styles.input, style]}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 12,
  },
  input: {
    height: 52,
    borderRadius: 16,
    backgroundColor: '#7B7AAB14',
    paddingHorizontal: 20,
    paddingVertical: 14,
    fontSize: 16,
    fontFamily: 'SNPro-Regular',
    color: '#FFFFFF',
  },
})
