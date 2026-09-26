import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { ArrowLeft } from 'iconsax-react-native'
import { useRouter } from 'expo-router'

type Props = {
  title: string
}

const AppBar = ({ title }: Props) => {
  const router = useRouter()

  const _onBack = () => {
    router.back()
  }
  return (
    <View className="flex-row items-center justify-between">
      <TouchableOpacity onPress={_onBack}>
        <View className="p-3 bg-transparent-grey rounded-full">
          <ArrowLeft size={24} color="#212B36" />
        </View>
      </TouchableOpacity>
      <Text className="text-lg font-semibold text-primary">{title}</Text>
      <View className="w-12 h-12" />
    </View>
  )
}

export default AppBar

const styles = StyleSheet.create({})
