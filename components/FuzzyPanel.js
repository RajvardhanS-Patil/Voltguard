import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { COLORS, SPACING } from '../utils/theme';

function fuzzyValues(prob) {
  return [
    { label: 'Low Imbalance', val: Math.round(Math.max(0, 100 - prob * 1.8)), color: COLORS.green, grad: [COLORS.green, COLORS.cyan] },
    { label: 'Med. Imbalance', val: Math.round(prob < 50 ? prob * 1.5 : Math.max(0, 100 - (prob - 50) * 2)), color: COLORS.amber, grad: [COLORS.amber, COLORS.purple] },
    { label: 'High Imbalance', val: Math.round(Math.min(100, prob * 1.2)), color: COLORS.danger, grad: [COLORS.danger, COLORS.amber] },
    { label: 'Low Volt. Drop', val: Math.round(Math.max(0, 95 - prob * 0.9)), color: COLORS.green, grad: [COLORS.green, COLORS.cyan] },
    { label: 'High Volt. Drop', val: Math.round(Math.min(100, prob * 0.85)), color: COLORS.danger, grad: [COLORS.danger, COLORS.purple] },
  ];
}

function FuzzyBar({ label, val, color, delay }) {
  const barWidth = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(barWidth, { toValue: val / 100, duration: 800, useNativeDriver: false }),
      ]).start();
    }, delay);
  }, []);

  useEffect(() => {
    Animated.timing(barWidth, { toValue: val / 100, duration: 600, useNativeDriver: false }).start();
  }, [val]);

  return (
    <Animated.View style={[styles.row, { opacity }]}>
      <Text style={styles.barLabel} numberOfLines={1}>{label}</Text>
      <View style={styles.barBg}>
        <Animated.View style={[
          styles.barFill,
          {
            backgroundColor: color,
            width: barWidth.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
          }
        ]} />
      </View>
      <Text style={[styles.barVal, { color }]}>{val}%</Text>
    </Animated.View>
  );
}

const SEGMENTS = [
  { label: 'S1 30%', color: COLORS.cyan },
  { label: 'S2 25%', color: COLORS.purple },
  { label: 'S3 28%', color: COLORS.danger },
  { label: 'S4 17%', color: '#FF6B35' },
];

export default function FuzzyPanel({ theftProb, mode }) {
  const cardOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(cardOpacity, { toValue: 1, duration: 500, delay: 100, useNativeDriver: true }).start();
  }, []);

  const fzv = fuzzyValues(theftProb);

  return (
    <Animated.View style={[
      styles.card,
      {
        backgroundColor: mode === 'advanced' ? 'rgba(0,229,255,0.04)' : COLORS.cardBasic,
        borderColor: mode === 'advanced' ? 'rgba(0,229,255,0.2)' : COLORS.borderBasic,
        opacity: cardOpacity,
      }
    ]}>
      {/* Header */}
      <View style={styles.cardHeader}>
        <View style={[styles.dot, { backgroundColor: COLORS.cyan }]} />
        <View>
          <Text style={styles.title}>Fuzzy Logic Breakdown</Text>
          <Text style={styles.subtitle}>Membership function analysis</Text>
        </View>
      </View>

      {/* Bars */}
      {fzv.map((item, i) => (
        <FuzzyBar key={item.label} {...item} delay={i * 80} />
      ))}

      {/* Segment bar */}
      <View style={styles.segHeader}>
        <Text style={styles.segLabel}>Segment Loss Distribution</Text>
      </View>
      <View style={styles.segBar}>
        {SEGMENTS.map((s, i) => (
          <View
            key={s.label}
            style={[
              styles.seg,
              { backgroundColor: s.color, flex: i === 0 ? 30 : i === 1 ? 25 : i === 2 ? 28 : 17 },
              i === 0 && styles.segFirst,
              i === SEGMENTS.length - 1 && styles.segLast,
            ]}
          >
            <Text style={styles.segText}>{s.label}</Text>
          </View>
        ))}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: SPACING.sm,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  dot: { width: 8, height: 8, borderRadius: 4, flexShrink: 0 },
  title: { fontSize: 13, fontWeight: '700', color: COLORS.textPrimary, letterSpacing: 0.5 },
  subtitle: { fontSize: 10, color: COLORS.textDim, marginTop: 2 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: SPACING.md,
    paddingVertical: 7,
  },
  barLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.textSecondary,
    width: 100,
    flexShrink: 0,
  },
  barBg: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 6,
    overflow: 'hidden',
  },
  barFill: { height: 6, borderRadius: 6 },
  barVal: {
    fontFamily: 'monospace',
    fontSize: 11,
    width: 32,
    textAlign: 'right',
    flexShrink: 0,
  },
  segHeader: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm,
    paddingBottom: 6,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  segLabel: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 2,
    color: COLORS.textDim,
    textTransform: 'uppercase',
  },
  segBar: {
    flexDirection: 'row',
    height: 30,
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.md,
    borderRadius: 10,
    overflow: 'hidden',
  },
  seg: { alignItems: 'center', justifyContent: 'center' },
  segFirst: { borderTopLeftRadius: 10, borderBottomLeftRadius: 10 },
  segLast: { borderTopRightRadius: 10, borderBottomRightRadius: 10 },
  segText: { fontSize: 9, fontWeight: '700', color: 'rgba(255,255,255,0.85)' },
});
