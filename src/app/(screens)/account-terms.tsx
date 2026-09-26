import React from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import AccountScreenLayout from '@/modules/account/components/AccountScreenLayout'

const SECTIONS = [
  {
    title: '1. Sử dụng ứng dụng',
    body: 'Bằng việc sử dụng ứng dụng, bạn đồng ý tuân thủ các điều khoản và điều kiện dưới đây.',
  },
  {
    title: '2. Tài khoản người dùng',
    bullets: [
      'Người dùng cần đăng ký tài khoản để lưu tiến độ và thành tích.',
      'Cung cấp thông tin chính xác và bảo mật thông tin đăng nhập.',
      'Không chia sẻ tài khoản với người khác.',
    ],
  },
  {
    title: '3. Nội dung và bản quyền',
    body: 'Mọi nội dung bài học, hình ảnh nhân vật, quái vật, mã nguồn và thiết kế giao diện thuộc quyền sở hữu của Math Monsters.',
  },
  {
    title: '4. Hành vi bị cấm',
    bullets: [
      'Can thiệp, gian lận hoặc làm sai lệch hệ thống chấm điểm.',
      'Sao chép, phát tán nội dung khi chưa được phép.',
      'Sử dụng ứng dụng cho mục đích vi phạm pháp luật.',
    ],
  },
  {
    title: '5. Giới hạn trách nhiệm',
    body: 'Chúng tôi nỗ lực duy trì hệ thống ổn định nhưng không chịu trách nhiệm cho gián đoạn kỹ thuật hoặc thiệt hại phát sinh từ việc sử dụng ứng dụng.',
  },
  {
    title: '6. Thay đổi điều khoản',
    body: 'Điều khoản có thể được cập nhật theo thời gian. Mọi thay đổi sẽ có hiệu lực khi được thông báo trên ứng dụng.',
  },
]

export default function AccountTermsScreen() {
  return (
    <AccountScreenLayout title="Điều khoản & Điều kiện">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.intro}>
          Chào mừng bạn đến với Math Monsters — ứng dụng giáo dục toán học giúp
          trẻ em học qua trò chơi tương tác, thu thập quái vật và leo bảng xếp
          hạng.
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
