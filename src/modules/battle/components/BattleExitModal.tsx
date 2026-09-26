import React from 'react'
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'

type BattleExitModalProps = {
  visible: boolean
  onCancel: () => void
  onConfirm: () => void
}

export default function BattleExitModal({
  visible,
  onCancel,
  onConfirm,
}: BattleExitModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.cardOuter}>
          <View style={styles.cardInner}>
            <Text style={styles.title}>Thoát trò chơi?</Text>
            <Text style={styles.message}>
              Bạn chưa hoàn thành trò chơi. Bạn có chắc chắn muốn thoát trò chơi không?
            </Text>

            <View style={styles.actions}>
              <View style={styles.actionSlot}>
                <Pressable onPress={onCancel} style={styles.cancelButton}>
                  <Text style={styles.cancelText}>Hủy bỏ</Text>
                </Pressable>
              </View>

              <View style={styles.actionSlot}>
                <Pressable
                  onPress={onConfirm}
                  style={({ pressed }) => [pressed && styles.btnPressed]}
                >
                  <View style={styles.confirmShell}>
                    <LinearGradient
                      colors={['#FF9A5C', '#E86A30']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 0, y: 1 }}
                      style={styles.confirmFace}
                    >
                      <Text style={styles.confirmText}>Thoát</Text>
                    </LinearGradient>
                    <View style={styles.confirmLip} />
                  </View>
                </Pressable>
              </View>
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
    backgroundColor: 'rgba(0, 0, 0, 0.62)',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  cardOuter: {
    backgroundColor: '#1B1B36',
    borderRadius: 28,
    padding: 8,
  },
  cardInner: {
    backgroundColor: '#232242',
    borderRadius: 22,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 10,
  },
  message: {
    color: 'rgba(255, 255, 255, 0.55)',
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 22,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 12,
    width: '100%',
  },
  actionSlot: {
    flex: 1,
    flexBasis: 0,
    minWidth: 0,
  },
  cancelButton: {
    width: '100%',
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  confirmShell: {
    width: '100%',
    height: 56,
    borderRadius: 16,
    overflow: 'hidden',
  },
  confirmFace: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmLip: {
    height: 4,
    backgroundColor: '#C45A20',
  },
  confirmText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  btnPressed: {
    opacity: 0.85,
  },
})
