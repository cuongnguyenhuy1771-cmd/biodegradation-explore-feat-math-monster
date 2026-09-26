import React from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import AccountScreenLayout from '@/modules/account/components/AccountScreenLayout'

const HIGHLIGHTS = [
  'Học toán thông qua trò chơi tương tác',
  'Thu thập và nâng cấp quái vật độc đáo',
  'Nhiều thế giới với độ khó tăng dần',
  'Nhiệm vụ hàng ngày với phần thưởng hấp dẫn',
  'Bảng xếp hạng cùng bạn bè',
  '4 loại câu hỏi: trắc nghiệm, đúng/sai, nhập đáp án, ghép cặp',
]

export default function AccountAboutScreen() {
  return (
    <AccountScreenLayout title="Giới thiệu">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.appName}>Math Monsters</Text>
        <Text style={styles.tagline}>
          Biến việc học toán thành một cuộc phiêu lưu đầy thú vị cùng những quái
          vật đáng yêu.
        </Text>

        <Text style={styles.paragraph}>
          Math Monsters là trò chơi giáo dục giúp trẻ em rèn luyện tư duy logic
          qua các trận đấu thú vị. Người chơi sẽ cùng anh hùng giải các câu đố
          toán học, chinh phục từng khu vực và thu thập quái vật trên hành trình
          khám phá thế giới số.
        </Text>

        <Text style={styles.paragraph}>
          Mỗi trận đấu là một thử thách mới — vừa học vừa chơi, vừa giải trí vừa
          rèn luyện kỹ năng tính toán. Hãy cùng xây dựng bộ sưu tập quái vật và
          chinh phục bảng xếp hạng!
        </Text>

        <Text style={styles.sectionTitle}>Điểm nổi bật</Text>
        {HIGHLIGHTS.map((item) => (
          <View key={item} style={styles.bulletRow}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>{item}</Text>
          </View>
        ))}

        <Text style={styles.sectionTitle}>Thông điệp</Text>
        <Text style={styles.paragraph}>
          Học toán mỗi ngày — chiến đấu thông minh, khám phá không giới hạn cùng
          Math Monsters!
        </Text>
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
  appName: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 8,
  },
  tagline: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 20,
  },
  paragraph: {
    color: '#FFFFFF',
    fontSize: 15,
    lineHeight: 24,
    fontWeight: '500',
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#A29BFE',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 12,
    marginTop: 4,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    paddingRight: 8,
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
