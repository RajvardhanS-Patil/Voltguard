import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, Animated,
  TouchableOpacity,
} from 'react-native';
import { COLORS, SPACING } from '../utils/theme';

function heatColor(v) {
  // v: 0..1
  const r = Math.round(50  + v * 205);
  const g = Math.round((1 - v) * 180);
  const b = Math.round((1 - v) * 80);
  return `rgb(${r},${g},${b})`;
}

function HeatCell({ value, row, col, onPress, delay }) {
  const scale   = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale,   { toValue: 1, tension: 90, friction: 10, delay, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 250, delay, useNativeDriver: true }),
    ]).start();
  }, []);

  function handlePress() {
    setPressed(true);
    Animated.sequence([
      Animated.timing(scale, { toValue: 1.3, duration: 100, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1,   duration: 180, useNativeDriver: true }),
    ]).start(() => setPressed(false));
    onPress(row, col, value);
  }

  const pct = Math.round(value * 100);
  const bg  = heatColor(value);

  return (
    <Animated.View style={{ transform: [{ scale }], opacity }}>
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.75}
        style={[
          styles.cell,
          { backgroundColor: bg, opacity: 0.32 + value * 0.68 },
          pressed && styles.cellPressed,
        ]}
      >
        {value > 0.6 && <Text style={styles.cellText}>{pct}</Text>}
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function HeatmapGrid({ mode }) {
  const [grid, setGrid] = useState(() => generateGrid());
  const [tooltip, setTooltip] = useState(null);
  const cardOpacity = useRef(new Animated.Value(0)).current;

  function generateGrid() {
    return Array.from({ length: 32 }, () => parseFloat((Math.random()).toFixed(3)));
  }

  useEffect(() => {
    Animated.timing(cardOpacity, { toValue: 1, duration: 500, delay: 150, useNativeDriver: true }).start();
  }, []);

  // Refresh grid every 8 seconds
  useEffect(() => {
    const id = setInterval(() => {
      setGrid(generateGrid());
      setTooltip(null);
    }, 8000);
    return () => clearInterval(id);
  }, []);

  function handleCellPress(row, col, value) {
    setTooltip({ row, col, pct: Math.round(value * 100), label: `Zone ${row * 8 + col + 1}` });
    setTimeout(() => setTooltip(null), 2500);
  }

  const COLS = 8;

  return (
    <Animated.View style={[
      styles.card,
      {
        backgroundColor: mode === 'advanced' ? 'rgba(4,14,40,0.7)' : COLORS.cardBasic,
        borderColor: mode === 'advanced' ? 'rgba(0,229,255,0.15)' : COLORS.borderBasic,
        opacity: cardOpacity,
      }
    ]}>
      <View style={styles.header}>
        <View style={styles.titleWrap}>
          <View style={[styles.accent, { backgroundColor: COLORS.amber }]} />
          <Text style={styles.title}>Power Loss Heatmap</Text>
        </View>
        <TouchableOpacity
          style={styles.refreshBtn}
          onPress={() => { setGrid(generateGrid()); setTooltip(null); }}
          activeOpacity={0.8}
        >
          <Text style={styles.refreshText}>↻ Refresh</Text>
        </TouchableOpacity>
      </View>

      {/* Tooltip */}
      {tooltip && (
        <View style={styles.tooltip}>
          <Text style={styles.tooltipText}>
            {tooltip.label}  ·  {tooltip.pct}% loss
          </Text>
        </View>
      )}

      {/* Grid */}
      <View style={styles.grid}>
        {Array.from({ length: Math.ceil(grid.length / COLS) }, (_, row) => (
          <View key={row} style={styles.gridRow}>
            {grid.slice(row * COLS, row * COLS + COLS).map((v, col) => (
              <HeatCell
                key={col}
                value={v}
                row={row}
                col={col}
                onPress={handleCellPress}
                delay={(row * COLS + col) * 18}
              />
            ))}
          </View>
        ))}
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        <Text style={styles.legendLabel}>Low</Text>
        <View style={styles.legendBar}>
          {Array.from({ length: 20 }, (_, i) => (
            <View key={i} style={[styles.legendSeg, { backgroundColor: heatColor(i / 19) }]} />
          ))}
        </View>
        <Text style={styles.legendLabel}>High</Text>
      </View>

      <Text style={styles.hint}>Tap a cell to inspect zone loss</Text>
    </Animated.View>
  );
}

const CELL_SIZE = 34;

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: SPACING.sm,
    overflow: 'hidden',
    padding: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  titleWrap: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  accent: { width: 3, height: 16, borderRadius: 2 },
  title: { fontSize: 13, fontWeight: '700', color: COLORS.textPrimary },
  refreshBtn: {
    paddingHorizontal: 11, paddingVertical: 6,
    borderRadius: 20, borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(255,255,255,0.04)',
    minHeight: 32,
    alignItems: 'center', justifyContent: 'center',
  },
  refreshText: { fontSize: 11, color: COLORS.textSecondary, fontWeight: '600' },
  tooltip: {
    alignSelf: 'center',
    paddingHorizontal: 14, paddingVertical: 7,
    backgroundColor: 'rgba(0,0,0,0.75)',
    borderRadius: 10, borderWidth: 1,
    borderColor: 'rgba(255,193,7,0.3)',
    marginBottom: 10,
  },
  tooltipText: { fontSize: 11, color: COLORS.amber, fontWeight: '700', letterSpacing: 0.5 },
  grid: { gap: 4 },
  gridRow: { flexDirection: 'row', gap: 4 },
  cell: {
    width: CELL_SIZE, height: CELL_SIZE,
    borderRadius: 7,
    alignItems: 'center', justifyContent: 'center',
  },
  cellPressed: { opacity: 1 },
  cellText: { fontSize: 8, fontWeight: '800', color: 'rgba(255,255,255,0.9)' },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    justifyContent: 'flex-end',
  },
  legendLabel: { fontSize: 9, color: COLORS.textDim },
  legendBar: { flexDirection: 'row', width: 80, height: 6, borderRadius: 3, overflow: 'hidden' },
  legendSeg: { flex: 1, height: 6 },
  hint: {
    fontSize: 9, color: COLORS.textDim,
    textAlign: 'center', marginTop: 8, letterSpacing: 0.5,
  },
});
