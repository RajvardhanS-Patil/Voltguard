import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { COLORS, SPACING, statusColor } from '../utils/theme';

export default function NodeCard({ node, mode, delay = 0 }) {
  const slideAnim = useRef(new Animated.Value(-20)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const dotPulse = useRef(new Animated.Value(1)).current;

  const color = statusColor(node.status);

  useEffect(() => {
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacityAnim, { toValue: 1, duration: 350, useNativeDriver: true }),
        Animated.spring(slideAnim, { toValue: 0, tension: 70, friction: 12, useNativeDriver: true }),
      ]).start();
    }, delay);
  }, []);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(dotPulse, { toValue: 1.5, duration: node.status === 'crit' ? 400 : 1400, useNativeDriver: true }),
        Animated.timing(dotPulse, { toValue: 1, duration: node.status === 'crit' ? 400 : 1400, useNativeDriver: true }),
      ])
    ).start();
  }, [node.status]);

  const tagBg = node.status === 'ok' ? COLORS.greenDim : node.status === 'warn' ? COLORS.amberDim : COLORS.dangerDim;

  return (
    <Animated.View style={[
      styles.card,
      {
        backgroundColor: mode === 'advanced' ? `${color}06` : COLORS.cardBasic,
        borderColor: mode === 'advanced' ? `${color}25` : COLORS.borderBasic,
        opacity: opacityAnim,
        transform: [{ translateX: slideAnim }],
      }
    ]}>
      {/* Left dot */}
      <Animated.View style={[
        styles.dot,
        { backgroundColor: color, transform: [{ scale: dotPulse }] }
      ]} />

      {/* Name + sub */}
      <View style={styles.nameWrap}>
        <Text style={styles.name} numberOfLines={1}>{node.name}</Text>
        <Text style={styles.sub}>{node.sub}</Text>
      </View>

      {/* Value */}
      <Text style={[styles.val, { color }]} numberOfLines={1}>{node.val} A</Text>

      {/* Tag */}
      <View style={[styles.tag, { backgroundColor: tagBg, borderColor: `${color}60` }]}>
        <Text style={[styles.tagText, { color }]}>{node.tag}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 13,
    borderWidth: 1,
    padding: 12,
    marginBottom: 7,
    gap: 11,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    flexShrink: 0,
  },
  nameWrap: { flex: 1, minWidth: 0 },
  name: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  sub: {
    fontSize: 10,
    color: COLORS.textDim,
    marginTop: 2,
  },
  val: {
    fontFamily: 'monospace',
    fontSize: 12,
    fontWeight: '600',
    flexShrink: 0,
  },
  tag: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    flexShrink: 0,
  },
  tagText: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
});
