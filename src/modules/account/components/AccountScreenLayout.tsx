import React from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { ArrowLeft2 } from 'iconsax-react-native'

type AccountScreenLayoutProps = {
  title: string
  children: React.ReactNode
  footer?: React.ReactNode
}

export default function AccountScreenLayout({
  title,
  children,
  footer,
}: AccountScreenLayoutProps) {
  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.backBtn, pressed && styles.backBtnPressed]}
          accessibilityRole="button"
          accessibilityLabel="Quay lại"
        >
          <ArrowLeft2 size={20} color="#FFFFFF" variant="Outline" />
        </Pressable>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.body}>{children}</View>
      {footer}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#121221',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnPressed: {
    opacity: 0.75,
  },
  title: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginHorizontal: 8,
  },
  headerSpacer: {
    width: 44,
  },
  body: {
    flex: 1,
  },
})
