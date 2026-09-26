import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import IcGoogle from '../icons/IcGoogle'

type Props = {
  title: string
}

const GoogleButton = ({ title }: Props) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      className={'bg-transparent-grey w-full rounded-2xl min-h-12 justify-center items-center'}
    >
      <View className="flex-row gap-2">
        <IcGoogle />
        <Text className="text-disabled font-semibold text-base">{title}</Text>
      </View>
    </TouchableOpacity>
  )
}

export default GoogleButton

const styles = StyleSheet.create({})
