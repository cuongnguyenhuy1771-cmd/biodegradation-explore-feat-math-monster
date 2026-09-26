import React from 'react'
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { router } from 'expo-router'
import GroupStarRating, {
  GROUP_STAR_ASPECT,
} from '~/assets/icons/group-star/GroupStarRating'
import type { AreaWithProgress } from '@/services/mathMonsters.service'
import { screensHref, ERouteTable } from '@/constants/route-table'
import IconClose from '~/assets/icons/IconClose'
import BadgeTitle from '~/assets/icons/BadgeTitle'

type AreaDetailModalProps = {
  visible: boolean
  area: AreaWithProgress | null
  onClose: () => void
}

function ModalStars({ earned }: { earned: number }) {
  const width = 196

  return (
    <View style={styles.starsRow}>
      <GroupStarRating earned={earned} width={width} height={width * GROUP_STAR_ASPECT} />
    </View>
  )
}

export default function AreaDetailModal({
  visible,
  area,
  onClose,
}: AreaDetailModalProps) {
  if (!area) return null

  const startBattle = () => {
    onClose()
    router.push(screensHref(ERouteTable.BATTLE, { areaId: area.id }) as never)
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.shell}>
          <View style={styles.closeBar} pointerEvents="box-none">
            <Pressable
              onPress={onClose}
              style={({ pressed }) => [pressed && styles.btnPressed]}
              accessibilityRole="button"
              accessibilityLabel="Đóng"
              hitSlop={8}
            >
              <IconClose />
            </Pressable>
          </View>

          <View style={styles.cardOuter}>
            <View style={styles.titleBadge}>
              <BadgeTitle width={200} height={51} />
              <Text style={styles.titleText} numberOfLines={1}>
                Khu vực {area.order_index}
              </Text>
            </View>

            <View style={styles.cardInner}>
              <ModalStars earned={area.stars_earned} />

              <View style={styles.infoBox}>
                <Text style={styles.infoLabel}>CÂU HỎI</Text>
                <Text style={styles.infoValue}>
                  {area.total_questions}/{area.total_questions}
                </Text>
              </View>

              <Pressable
                onPress={startBattle}
                style={({ pressed }) => [pressed && styles.btnPressed]}
              >
                <LinearGradient
                  colors={['#74E85A', '#58CC02']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={styles.startBtn}
                >
                  <View style={styles.startBevel} pointerEvents="none" />
                  <Text style={styles.startText}>Bắt đầu</Text>
                </LinearGradient>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(6, 4, 18, 0.78)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  shell: {
    width: '100%',
    maxWidth: 340,
    position: 'relative',
  },
  closeBar: {
    position: 'absolute',
    top: -4,
    right: -4,
    zIndex: 10,
  },
  cardOuter: {
    borderRadius: 28,
    borderWidth: 3,
    borderColor: '#9D96F5',
    backgroundColor: '#3E3D61',
    paddingTop: 28,
    paddingHorizontal: 16,
    paddingBottom: 16,
    alignItems: 'center',
  },
  titleBadge: {
    position: 'absolute',
    top: -20,
    alignSelf: 'center',
    width: 200,
    height: 51,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  titleText: {
    position: 'absolute',
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
    maxWidth: 170,
    textShadowColor: 'rgba(100, 60, 0, 0.35)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  cardInner: {
    width: '100%',
    alignItems: 'center',
    paddingTop: 8,
  },
  starsRow: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    minHeight: 108,
  },
  infoBox: {
    width: '100%',
    backgroundColor: '#2A2648',
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#1A1730',
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 18,
  },
  infoLabel: {
    color: 'rgba(174, 163, 255, 0.75)',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 4,
  },
  infoValue: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 34,
  },
  startBtn: {
    width: 120,
    height: 56,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderBottomWidth: 4,
    borderBottomColor: '#3FAF00',
  },
  startBevel: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.28)',
  },
  startText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    textShadowColor: 'rgba(0, 0, 0, 0.35)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 0,
  },
  btnPressed: {
    opacity: 0.9,
  },
})
