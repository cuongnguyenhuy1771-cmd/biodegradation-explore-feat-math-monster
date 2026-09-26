import React from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import AccountScreenLayout from '@/modules/account/components/AccountScreenLayout'

const SECTIONS = [
  {
    title: '1. Thông tin thu thập',
    body: 'Chúng tôi thu thập thông tin tài khoản (tên, email), tiến độ học tập, điểm số, sao và dữ liệu sử dụng ứng dụng để vận hành và cải thiện trải nghiệm.',
  },
  {
    title: '2. Mục đích sử dụng',
    bullets: [
      'Cung cấp và cá nhân hóa nội dung học toán',
      'Lưu tiến độ, bộ sưu tập và bảng xếp hạng',
      'Gửi thông báo về nhiệm vụ và cập nhật quan trọng',
    ],
  },
  {
    title: '3. Bảo mật dữ liệu',
    body: 'Dữ liệu được lưu trữ an toàn trên hệ thống đám mây với các biện pháp bảo mật phù hợp. Chúng tôi không bán thông tin cá nhân cho bên thứ ba.',
  },
  {
    title: '4. Chia sẻ thông tin',
    body: 'Thông tin chỉ được chia sẻ khi có yêu cầu pháp lý hoặc với nhà cung cấp dịch vụ cần thiết để vận hành ứng dụng, trong phạm vi tối thiểu.',
  },
  {
    title: '5. Quyền của người dùng',
    body: 'Bạn có quyền truy cập, chỉnh sửa hoặc yêu cầu xóa dữ liệu cá nhân bằng cách liên hệ đội ngũ hỗ trợ của chúng tôi.',
  },
  {
    title: '6. Liên hệ',
    body: 'Mọi thắc mắc về quyền riêng tư, vui lòng gửi email tới support@mathmonsters.vn.',
  },
]

export default function AccountPrivacyScreen() {
  return (
    <AccountScreenLayout title="Chính sách bảo mật">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.intro}>
          Math Monsters cam kết bảo vệ thông tin cá nhân và quyền riêng tư của
          người dùng.
        </Text>

        {SECTIONS.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.body ? (
              <Text style={styles.body}>{section.body}</Text>
            ) : null}
            {section.bullets?.map((item) => (
              <View key={item} style={styles.bulletRow}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.bulletText}>{item}</Text>
              </View>
            ))}
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
  intro: {
    color: '#FFFFFF',
    fontSize: 15,
    lineHeight: 24,
    fontWeight: '500',
    marginBottom: 20,
  },
  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    color: '#8A8AFF',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 8,
  },
  body: {
    color: '#FFFFFF',
    fontSize: 15,
    lineHeight: 24,
    fontWeight: '500',
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 4,
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
