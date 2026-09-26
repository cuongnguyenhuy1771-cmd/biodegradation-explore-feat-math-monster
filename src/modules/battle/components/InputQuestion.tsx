import React from 'react'
import { StyleSheet, Text, TextInput, View } from 'react-native'
import type { InputContent } from '../types'

type InputQuestionProps = {
  content: InputContent
  value: string
  revealed: boolean
  onChange: (value: string) => void
}

export default function InputQuestion({
  content,
  value,
  revealed,
  onChange,
}: InputQuestionProps) {
  return (
    <View style={styles.root}>
      <Text style={styles.prompt}>{content.prompt}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        editable={!revealed}
        placeholder="Nhập đáp án"
        placeholderTextColor="rgba(255, 255, 255, 0.35)"
        keyboardType="number-pad"
        returnKeyType="done"
        style={styles.input}
        selectionColor="#AEA3FF"
      />
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    gap: 16,
  },
  prompt: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 34,
  },
  input: {
    backgroundColor: '#1A1730',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#12101F',
    minHeight: 56,
    paddingHorizontal: 16,
    color: '#FFFFFF',
    fontSize: 22,
    fontFamily: 'SNPro-Regular',
    fontWeight: '700',
    textAlign: 'center',
  },
})
