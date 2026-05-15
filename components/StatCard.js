import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { COLORS, SPACING } from '../utils/theme';

export default function StatCard({ label, value, unit, color, icon, progress, trend, mode, delay = 0 }) {
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const cardTranslate = useRef(new Animated.Value(20)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const prevValue = useRef(value);

  useEffect(() => {
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(cardOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.spring(cardTranslate, { toValue: 0, tension: 60, friction: 12, useNativeDriver: true }),
      ]).start();
    }, delay);
  }, []);

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: Math.min(1, Math.max(0, progress)),
      duration: 700,
      useNativeDriver: false,
    }).start();

    if (value !== prevValue.current) {
      prevValue.current = value;
      Animated.sequence([
        Animated.timing(scaleAnim, { toValue: 1.06, duration: 100, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start();
    }
  }, [progress, value]);

  const borderColor = mode === 'advanced' ? `${color}30` : COLORS.borderBasic;
  const bgColor = mode === 'advanced' ? `${color}08` : COLORS.cardBasic;

  return (
    <Animated.View style={[
      styles.card,
      { backgroundColor: bgColor, borderColor, opacity: cardOpacity, transform: [{ translateY: cardTranslate }] }
    ]}>
      {/* Icon */}
      <View style={[styles.iconWrap, { backgroundColor: `${color}18` }]}>
        <Text style={styles.iconText}>{icon}</Text>
      </View>

      {/* Label */}
      <Text style={styles.label}>{label.toUpperCase()}</Text>

      {/* Value */}
      <Animated.Text style={[styles.value, { color, transform: [{ scale: scaleAnim }] }]}>
        {value}
        <Text style={styles.unit}> {unit}</Text>
      </Animated.Text>

      {/* Trend */}
      <Text style={[styles.trend, { color: `${color}90` }]} numberOfLines={1}>{trend}</Text>

      {/* Progress bar */}
      <View style={styles.progressBg}>
        <Animated.View style={[
          styles.progressFill,
          {
            width: progressAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
            backgroundColor: color,
          }
        ]} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    padding: SPACING.md,
    minHeight: 140,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  iconText: { fontSize: 18 },
  label: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 2,
    color: COLORS.textDim,
    marginBottom: 4,
  },
  value: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
    lineHeight: 30,
  },
  unit: {
    fontSize: 13,
    fontWeight: '600',
  },
  trend: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 3,
    marginBottom: 8,
  },
  progressBg: {
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: 3,
    borderRadius: 3,
  },
});
