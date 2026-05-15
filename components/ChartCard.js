import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Svg, { Polyline, Defs, LinearGradient, Stop, Polygon } from 'react-native-svg';
import { COLORS, SPACING } from '../utils/theme';

const W = 280, H = 80;

function buildPoints(data) {
  if (!data || data.length < 2) return { line: '', fill: '' };
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * W;
    const y = H - ((v - min) / range) * (H - 8) - 4;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const fillPts = [...pts, `${W},${H}`, `0,${H}`];
  return { line: pts.join(' '), fill: fillPts.join(' ') };
}

export default function ChartCard({ label, color, data, mode, delay = 0 }) {
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const cardTranslate = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(cardOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.spring(cardTranslate, { toValue: 0, tension: 55, friction: 11, useNativeDriver: true }),
      ]).start();
    }, delay);
  }, []);

  const { line, fill } = buildPoints(data);
  const latest = data && data.length > 0 ? data[data.length - 1].toFixed(1) : '--';
  const prev = data && data.length > 1 ? data[data.length - 2] : null;
  const current = data && data.length > 0 ? data[data.length - 1] : null;
  const trendUp = prev !== null && current !== null ? current > prev : null;

  const gradId = `grad_${label.replace(/\s/g,'').replace(/[^a-zA-Z0-9]/g,'')}`;

  return (
    <Animated.View style={[
      styles.card,
      {
        backgroundColor: mode === 'advanced' ? `${color}07` : COLORS.cardBasic,
        borderColor: mode === 'advanced' ? `${color}28` : COLORS.borderBasic,
        opacity: cardOpacity,
        transform: [{ translateY: cardTranslate }],
      }
    ]}>
      <View style={styles.header}>
        <View style={styles.labelRow}>
          <View style={[styles.dot, { backgroundColor: color }]} />
          <Text style={styles.label}>{label}</Text>
          <View style={styles.livePill}>
            <View style={[styles.liveDot, { backgroundColor: color }]} />
            <Text style={[styles.liveText, { color }]}>LIVE</Text>
          </View>
        </View>
        <View style={styles.valueRow}>
          <Text style={[styles.currentVal, { color }]}>{latest}</Text>
          {trendUp !== null && (
            <Text style={[styles.trend, { color: trendUp ? COLORS.danger : COLORS.green }]}>
              {trendUp ? '↑' : '↓'}
            </Text>
          )}
        </View>
      </View>

      <View style={styles.chartWrap}>
        <Svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
          <Defs>
            <LinearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor={color} stopOpacity="0.3" />
              <Stop offset="100%" stopColor={color} stopOpacity="0" />
            </LinearGradient>
          </Defs>
          {fill && (
            <Polygon points={fill} fill={`url(#${gradId})`} />
          )}
          {line && (
            <Polyline
              points={line}
              fill="none"
              stroke={color}
              strokeWidth={2}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          )}
        </Svg>
      </View>

      {/* Mini stats row */}
      {data && data.length > 0 && (
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>MIN</Text>
            <Text style={[styles.statVal, { color }]}>{Math.min(...data).toFixed(1)}</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>AVG</Text>
            <Text style={[styles.statVal, { color }]}>
              {(data.reduce((a, b) => a + b, 0) / data.length).toFixed(1)}
            </Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>MAX</Text>
            <Text style={[styles.statVal, { color }]}>{Math.max(...data).toFixed(1)}</Text>
          </View>
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: 7, flex: 1 },
  dot: { width: 7, height: 7, borderRadius: 4 },
  label: { fontSize: 11, fontWeight: '700', color: COLORS.textSecondary, flex: 1 },
  livePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 20,
    backgroundColor: 'rgba(0,229,255,0.06)',
  },
  liveDot: { width: 4, height: 4, borderRadius: 2 },
  liveText: { fontSize: 7, fontWeight: '700', letterSpacing: 1.5 },
  valueRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  currentVal: { fontSize: 18, fontWeight: '800', letterSpacing: -0.5 },
  trend: { fontSize: 16, fontWeight: '700' },
  chartWrap: { alignItems: 'center', marginBottom: 10 },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  stat: { alignItems: 'center' },
  statLabel: {
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: COLORS.textDim,
    textTransform: 'uppercase',
  },
  statVal: { fontSize: 12, fontWeight: '700', marginTop: 2 },
});
