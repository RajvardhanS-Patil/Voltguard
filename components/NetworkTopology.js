import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Svg, { Circle, Line, Text as SvgText } from 'react-native-svg';
import { COLORS, SPACING, statusColor } from '../utils/theme';

const NETWORK_NODES = [
  { id: 'SS', label: 'Sub', x: 0.08, y: 0.5, status: 'ok', r: 20 },
  { id: 'J1', label: 'J1', x: 0.25, y: 0.25, status: 'ok', r: 14 },
  { id: 'J2', label: 'J2', x: 0.25, y: 0.75, status: 'ok', r: 14 },
  { id: 'S3', label: 'S3', x: 0.48, y: 0.15, status: 'warn', r: 16 },
  { id: 'S4', label: 'S4', x: 0.48, y: 0.5, status: 'ok', r: 14 },
  { id: 'S5', label: 'S5', x: 0.48, y: 0.82, status: 'ok', r: 14 },
  { id: 'E1', label: 'E1', x: 0.7, y: 0.15, status: 'ok', r: 11 },
  { id: 'E2', label: 'E2', x: 0.7, y: 0.5, status: 'ok', r: 11 },
  { id: 'E3', label: 'E3', x: 0.7, y: 0.82, status: 'ok', r: 11 },
  { id: 'HUB', label: 'HUB', x: 0.9, y: 0.35, status: 'ok', r: 13 },
];

const EDGES = [
  ['SS','J1'],['SS','J2'],['J1','S3'],['J1','S4'],['J2','S4'],
  ['J2','S5'],['S3','E1'],['S4','E2'],['S5','E3'],['E1','HUB'],['E2','HUB'],
];

export default function NetworkTopology({ nodes, mode }) {
  const W = 320, H = 200;
  const scanAnim = useRef(new Animated.Value(0)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(cardOpacity, { toValue: 1, duration: 500, delay: 300, useNativeDriver: true }).start();
    if (mode === 'advanced') {
      Animated.loop(
        Animated.timing(scanAnim, { toValue: 1, duration: 3500, useNativeDriver: false })
      ).start();
    }
  }, [mode]);

  // Update S3 status based on node B
  const nodeB = nodes.find(n => n.id === 'B');
  const s3Status = nodeB?.status || 'ok';

  function getNodePos(n) {
    return { x: n.x * W, y: n.y * H };
  }

  function getColor(status) {
    return statusColor(status);
  }

  const scanY = scanAnim.interpolate({ inputRange: [0, 1], outputRange: [10, H - 10] });

  return (
    <Animated.View style={[styles.card, {
      backgroundColor: mode === 'advanced' ? COLORS.cardAdvanced : COLORS.cardBasic,
      borderColor: mode === 'advanced' ? 'rgba(0,229,255,0.15)' : COLORS.borderBasic,
      opacity: cardOpacity,
    }]}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View style={styles.titleLine} />
          <Text style={styles.title}>Network Topology</Text>
        </View>
        <View style={styles.liveBadge}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>LIVE</Text>
        </View>
      </View>

      <View style={styles.svgWrap}>
        <Svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
          {/* Edges */}
          {EDGES.map(([a, b], i) => {
            const nA = NETWORK_NODES.find(n => n.id === a);
            const nB = NETWORK_NODES.find(n => n.id === b);
            const pA = getNodePos(nA), pB = getNodePos(nB);
            return (
              <Line
                key={i}
                x1={pA.x} y1={pA.y} x2={pB.x} y2={pB.y}
                stroke={mode === 'advanced' ? 'rgba(0,229,255,0.18)' : 'rgba(100,150,200,0.15)'}
                strokeWidth={1.5}
              />
            );
          })}

          {/* Nodes */}
          {NETWORK_NODES.map(n => {
            const { x, y } = getNodePos(n);
            const status = n.id === 'S3' ? s3Status : n.status;
            const color = getColor(status);
            return (
              <React.Fragment key={n.id}>
                {/* Glow ring */}
                {mode === 'advanced' && (
                  <Circle cx={x} cy={y} r={n.r + 8} fill={`${color}12`} />
                )}
                {/* Node body */}
                <Circle
                  cx={x} cy={y} r={n.r}
                  fill={mode === 'advanced' ? 'rgba(4,14,40,0.92)' : 'rgba(20,35,55,0.9)'}
                  stroke={color}
                  strokeWidth={mode === 'advanced' ? 2 : 1.5}
                />
                {/* Label */}
                <SvgText
                  x={x} y={y + 4}
                  textAnchor="middle"
                  fontSize={8}
                  fontWeight="700"
                  fill={mode === 'advanced' ? 'rgba(200,225,255,0.85)' : 'rgba(150,185,220,0.8)'}
                >
                  {n.id}
                </SvgText>
              </React.Fragment>
            );
          })}
        </Svg>
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        {[['ok', 'Normal'], ['warn', 'Monitor'], ['crit', 'Critical']].map(([s, l]) => (
          <View key={s} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: statusColor(s) }]} />
            <Text style={styles.legendText}>{l}</Text>
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
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  titleLine: { width: 16, height: 2, backgroundColor: COLORS.cyan, borderRadius: 2 },
  title: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,255,156,0.3)',
    backgroundColor: 'rgba(0,255,156,0.08)',
  },
  liveDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: COLORS.green },
  liveText: { fontSize: 8, fontWeight: '700', letterSpacing: 1.5, color: COLORS.green },
  svgWrap: { alignItems: 'center', width: '100%' },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: 10,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendDot: { width: 7, height: 7, borderRadius: 4 },
  legendText: { fontSize: 9, color: COLORS.textDim, fontWeight: '600' },
});
