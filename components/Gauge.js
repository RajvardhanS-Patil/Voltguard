import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Svg, { Circle, Line } from 'react-native-svg';
import { COLORS, SPACING, theftColor } from '../utils/theme';

const RADIUS = 80;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const CENTER = 100;
const TICK_ANGLES = [0, 36, 72, 108, 144, 180, 216, 252, 288, 324];

export default function Gauge({ theftProb, mode }) {
  const [offset, setOffset] = useState(CIRCUMFERENCE);
  const animVal = useRef(new Animated.Value(0)).current;
  const cardScale = useRef(new Animated.Value(0.9)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const strokeColor = theftProb < 30 ? COLORS.cyan : theftProb < 65 ? COLORS.amber : COLORS.danger;
  const status = theftProb < 30 ? 'Normal' : theftProb < 65 ? 'Monitor' : 'Critical';
  const statusBg = theftProb < 30 ? COLORS.greenDim : theftProb < 65 ? COLORS.amberDim : COLORS.dangerDim;
  const statusBorder = theftProb < 30 ? 'rgba(0,255,156,0.4)' : theftProb < 65 ? 'rgba(255,193,7,0.4)' : 'rgba(255,61,113,0.4)';

  useEffect(() => {
    Animated.parallel([
      Animated.spring(cardScale, { toValue: 1, tension: 60, friction: 10, useNativeDriver: true }),
      Animated.timing(cardOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  useEffect(() => {
    const listener = animVal.addListener(({ value }) => {
      setOffset(CIRCUMFERENCE - CIRCUMFERENCE * value);
    });
    Animated.timing(animVal, {
      toValue: theftProb / 100,
      duration: 900,
      useNativeDriver: false,
    }).start();
    return () => animVal.removeListener(listener);
  }, [theftProb]);

  useEffect(() => {
    let loop;
    if (mode === 'advanced') {
      loop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.04, duration: 1600, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 1600, useNativeDriver: true }),
        ])
      );
      loop.start();
    } else {
      Animated.timing(pulseAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
    }
    return () => loop && loop.stop();
  }, [mode]);

  const trackStroke = mode === 'advanced' ? 'rgba(0,229,255,0.09)' : 'rgba(255,255,255,0.06)';

  return (
    <Animated.View style={[
      styles.card,
      {
        backgroundColor: mode === 'advanced' ? COLORS.cardAdvanced : COLORS.cardBasic,
        borderColor: mode === 'advanced' ? 'rgba(0,229,255,0.22)' : COLORS.borderBasic,
        opacity: cardOpacity,
        transform: [{ scale: cardScale }],
      }
    ]}>
      <Text style={styles.topLabel}>THEFT PROBABILITY GAUGE</Text>

      <Animated.View style={{ transform: [{ scale: pulseAnim }], alignItems: 'center' }}>
        <View style={styles.gaugeWrap}>
          <Svg width={200} height={200} viewBox="0 0 200 200">
            <Circle
              cx={CENTER} cy={CENTER} r={RADIUS}
              fill="none"
              stroke={trackStroke}
              strokeWidth={14}
            />
            {TICK_ANGLES.map((deg, i) => (
              <Line
                key={i}
                x1={CENTER} y1={13}
                x2={CENTER} y2={22}
                stroke="rgba(255,255,255,0.1)"
                strokeWidth={1.5}
                transform={"rotate(" + deg + ", " + CENTER + ", " + CENTER + ")"}
              />
            ))}
            <Circle
              cx={CENTER} cy={CENTER} r={RADIUS}
              fill="none"
              stroke={strokeColor}
              strokeWidth={14}
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE + " " + CIRCUMFERENCE}
              strokeDashoffset={offset}
              transform={"rotate(-90, " + CENTER + ", " + CENTER + ")"}
            />
          </Svg>
          <View style={styles.centerOverlay}>
            <Text style={[styles.gaugeValue, { color: strokeColor }]}>{theftProb}%</Text>
            <Text style={styles.gaugeUnit}>Risk Level</Text>
          </View>
        </View>
      </Animated.View>

      <Text style={styles.gaugeLabel}>Theft Risk Index</Text>
      <View style={[styles.statusBadge, { backgroundColor: statusBg, borderColor: statusBorder }]}>
        <Text style={[styles.statusText, { color: strokeColor }]}>{status}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1,
    paddingVertical: 20,
    paddingHorizontal: 14,
    alignItems: 'center',
    marginBottom: 10,
    overflow: 'hidden',
  },
  topLabel: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 2.5,
    color: COLORS.textDim,
    textTransform: 'uppercase',
    marginBottom: 14,
  },
  gaugeWrap: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  centerOverlay: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gaugeValue: { fontSize: 46, fontWeight: '800', letterSpacing: -1.5, lineHeight: 52 },
  gaugeUnit: { fontSize: 11, color: COLORS.textSecondary, letterSpacing: 0.5, marginTop: 2 },
  gaugeLabel: {
    fontSize: 10, fontWeight: '600', letterSpacing: 3, color: COLORS.textDim,
    textTransform: 'uppercase', marginTop: 10, marginBottom: 12,
  },
  statusBadge: { paddingHorizontal: 24, paddingVertical: 9, borderRadius: 30, borderWidth: 1 },
  statusText: { fontSize: 11, fontWeight: '700', letterSpacing: 2.5, textTransform: 'uppercase' },
});
