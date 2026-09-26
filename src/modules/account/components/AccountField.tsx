import React from 'react'
import { StyleSheet, Text, TextInput, type TextInputProps, View } from 'react-native'

type AccountFieldProps = TextInputProps & {
  label: string
}

export default function AccountField({ label, style, ...rest }: AccountFieldProps) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        {...rest}
        placeholderTextColor="rgba(255, 255, 255, 0.28)"
        style={[styles.input, rest.editable === false && styles.inputDisabled, style]}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 20,
  },
  label: {
    color: 'rgba(174, 163, 255, 0.65)',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    height: 56,
    borderRadius: 16,
    backgroundColor: '#25253D',
    paddingHorizontal: 18,
    fontSize: 16,
    fontFamily: 'SNPro-Regular',
    fontWeight: '600',
    color: '#FFFFFF',
  },
  inputDisabled: {
    color: 'rgba(255, 255, 255, 0.38)',
    fontFamily: 'SNPro-Regular',
    fontWeight: '500',
  },
})
