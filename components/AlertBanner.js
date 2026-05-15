import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { COLORS, SPACING } from '../utils/theme';

const TYPE_CONFIG = {
  info:  { color: COLORS.cyan,   icon: '💡', bg: 'rgba(0,229,255,0.08)' },
  warn:  { color: COLORS.amber,  icon: '⚠️', bg: 'rgba(255,193,7,0.08)' },
  crit:  { color: COLORS.danger, icon: '🚨', bg: 'rgba(255,61,113,0.08)' },
  ok:    { color: COLORS.green,  icon: '✅', bg: 'rgba(0,255,156,0.08)' },
};

export default function AlertBanner({ type, title, body, onDismiss }) {
  const slideAnim = useRef(new Animated.Value(-80)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const cfg = TYPE_CONFIG[type] || TYPE_CONFIG.info;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(slideAnim, { toValue: 0, tension: 80, friction: 10, useNativeDriver: true }),
      Animated.timing(opacityAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
    ]).start();
  }, []);

  function dismiss() {
    Animated.parallel([
      Animated.timing(slideAnim, { toValue: 60, duration: 250, useNativeDriver: true }),
      Animated.timing(opacityAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start(onDismiss);
  }

  return (
    <Animated.View style={[
      styles.container,
      { borderColor: `${cfg.color}40`, backgroundColor: cfg.bg,
        opacity: opacityAnim, transform: [{ translateX: slideAnim }] }
    ]}>
      <View style={[styles.accent, { backgroundColor: cfg.color }]} />
      <Text style={styles.icon}>{cfg.icon}</Text>
      <View style={styles.content}>
        <Text style={[styles.title, { color: cfg.color }]}>{title}</Text>
        <Text style={styles.body} numberOfLines={2}>{body}</Text>
      </View>
      <TouchableOpacity onPress={dismiss} style={styles.closeBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
        <Text style={styles.close}>✕</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 6,
    overflow: 'hidden',
    paddingRight: 10,
    minHeight: 52,
  },
  accent: { width: 3, alignSelf: 'stretch', borderRadius: 2 },
  icon: { fontSize: 18, marginHorizontal: 10 },
  content: { flex: 1, paddingVertical: 9 },
  title: { fontSize: 12, fontWeight: '700', marginBottom: 1 },
  body: { fontSize: 11, color: COLORS.textSecondary, lineHeight: 15 },
  closeBtn: { padding: 6 },
  close: { fontSize: 14, color: COLORS.textDim },
});
