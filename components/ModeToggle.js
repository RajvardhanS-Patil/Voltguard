import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { COLORS, SPACING } from '../utils/theme';

export default function ModeToggle({ mode, onSwitch }) {
  const basicScale = useRef(new Animated.Value(1)).current;
  const advScale = useRef(new Animated.Value(1)).current;

  function press(btn, target) {
    const anim = btn === 'basic' ? basicScale : advScale;
    Animated.sequence([
      Animated.timing(anim, { toValue: 0.93, duration: 80, useNativeDriver: true }),
      Animated.timing(anim, { toValue: 1, duration: 120, useNativeDriver: true }),
    ]).start(() => onSwitch(target));
  }

  return (
    <View style={[
      styles.container,
      { backgroundColor: mode === 'advanced' ? 'rgba(0,229,255,0.05)' : 'rgba(255,255,255,0.04)' }
    ]}>
      <Animated.View style={{ transform: [{ scale: basicScale }], flex: 1 }}>
        <TouchableOpacity
          style={[styles.btn, mode === 'basic' && styles.btnActive]}
          onPress={() => press('basic', 'basic')}
          activeOpacity={0.85}
        >
          <Text style={[styles.btnText, mode === 'basic' && styles.btnTextActive]}>
            ⚡ Basic
          </Text>
        </TouchableOpacity>
      </Animated.View>

      <Animated.View style={{ transform: [{ scale: advScale }], flex: 1 }}>
        <TouchableOpacity
          style={[styles.btn, mode === 'advanced' && styles.btnActive]}
          onPress={() => press('advanced', 'advanced')}
          activeOpacity={0.85}
        >
          <Text style={[styles.btnText, mode === 'advanced' && styles.btnTextActive]}>
            🔬 Advanced
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    margin: SPACING.md,
    marginBottom: SPACING.sm,
    borderRadius: 50,
    padding: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    gap: 4,
  },
  btn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  btnActive: {
    backgroundColor: COLORS.purple,
    shadowColor: COLORS.cyan,
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  btnText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
  },
  btnTextActive: {
    color: '#fff',
  },
});
