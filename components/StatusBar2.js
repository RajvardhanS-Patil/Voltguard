import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { COLORS, SPACING, theftColor } from '../utils/theme';

export default function StatusBar2({ theftProb, mode }) {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const status = theftProb < 30 ? 'normal' : theftProb < 65 ? 'warning' : 'critical';
  const color = theftColor(theftProb);
  const label = theftProb < 30 ? 'System Normal' : theftProb < 65 ? 'Warning Active' : 'Critical Alert';

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.5, duration: status === 'critical' ? 400 : 1200, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: status === 'critical' ? 400 : 1200, useNativeDriver: true }),
      ])
    ).start();
  }, [status]);

  return (
    <View style={[
      styles.container,
      { borderColor: `${color}30`, backgroundColor: `${color}08` }
    ]}>
      <View style={styles.left}>
        <Animated.View style={[
          styles.dot,
          { backgroundColor: color, transform: [{ scale: pulseAnim }] }
        ]} />
        <Text style={[styles.label, { color }]}>{label}</Text>
      </View>
      <View style={styles.right}>
        <Text style={styles.probLabel}>THEFT RISK</Text>
        <Text style={[styles.probVal, { color }]}>{theftProb}%</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: 9,
    borderRadius: 12,
    borderWidth: 1,
  },
  left: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  label: { fontSize: 12, fontWeight: '700', letterSpacing: 1 },
  right: { alignItems: 'flex-end' },
  probLabel: {
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 2,
    color: COLORS.textDim,
    textTransform: 'uppercase',
  },
  probVal: { fontSize: 16, fontWeight: '800', letterSpacing: -0.5 },
});
