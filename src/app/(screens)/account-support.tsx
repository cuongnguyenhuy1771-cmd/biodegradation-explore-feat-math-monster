import React from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import AccountScreenLayout from '@/modules/account/components/AccountScreenLayout'

const CONTACT_ITEMS = [
  'Email hỗ trợ: support@mathmonsters.vn',
  'Điện thoại (giờ hành chính): +84 9xx xxx xxx',
]

export default function AccountSupportScreen() {
  return (
    <AccountScreenLayout title="Liên hệ & Hỗ trợ">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.paragraph}>
          Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn để hành trình học toán
          trở nên vui vẻ và hiệu quả hơn.
        </Text>

        {CONTACT_ITEMS.map((item) => (
          <View key={item} style={styles.bulletRow}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>{item}</Text>
          </View>
        ))}
      </ScrollView>
    </AccountScreenLayout>
  )
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 32,
  },
  paragraph: {
    color: '#FFFFFF',
    fontSize: 15,
    lineHeight: 24,
    fontWeight: '500',
    marginBottom: 20,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  bullet: {
    color: '#FFFFFF',
    fontSize: 15,
    lineHeight: 22,
    marginRight: 8,
  },
  bulletText: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '500',
  },
})
