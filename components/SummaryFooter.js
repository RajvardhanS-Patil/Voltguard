import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { COLORS, SPACING } from '../utils/theme';

export default function SummaryFooter({ mode, theftProb, supply, load }) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, { toValue: 1, duration: 600, delay: 400, useNativeDriver: true }).start();
  }, []);

  const risk = theftProb < 30 ? 'LOW' : theftProb < 65 ? 'MEDIUM' : 'HIGH';
  const riskColor = theftProb < 30 ? COLORS.green : theftProb < 65 ? COLORS.amber : COLORS.danger;
  const netFlow = (supply - load).toFixed(2);
  const lossRate = ((Math.abs(supply - load) / supply) * 100).toFixed(1);

  return (
    <Animated.View style={[
      styles.footer,
      {
        backgroundColor: mode === 'advanced' ? 'rgba(4,14,40,0.85)' : 'rgba(26,37,53,0.95)',
        borderColor: mode === 'advanced' ? 'rgba(0,229,255,0.12)' : 'rgba(255,255,255,0.07)',
        opacity,
      }
    ]}>
      <Text style={styles.footerTitle}>SYSTEM SUMMARY</Text>

      <View style={styles.row}>
        <View style={styles.col}>
          <Text style={styles.colLabel}>Risk Level</Text>
          <Text style={[styles.colVal, { color: riskColor }]}>{risk}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.col}>
          <Text style={styles.colLabel}>Net Flow</Text>
          <Text style={[styles.colVal, { color: parseFloat(netFlow) > 0 ? COLORS.cyan : COLORS.danger }]}>
            {netFlow} A
          </Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.col}>
          <Text style={styles.colLabel}>Loss Rate</Text>
          <Text style={[styles.colVal, { color: parseFloat(lossRate) > 10 ? COLORS.danger : COLORS.amber }]}>
            {lossRate}%
          </Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.col}>
          <Text style={styles.colLabel}>Mode</Text>
          <Text style={[styles.colVal, { color: mode === 'advanced' ? COLORS.purple : COLORS.textSecondary }]}>
            {mode === 'advanced' ? 'ADV' : 'BASIC'}
          </Text>
        </View>
      </View>

      <Text style={styles.footerSub}>VOLTEX v1.0  ·  Real-time Theft Detection  ·  Fuzzy Logic AI</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  footer: {
    borderRadius: 16,
    borderWidth: 1,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    alignItems: 'center',
  },
  footerTitle: {
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 3,
    color: COLORS.textDim,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  col: { alignItems: 'center', flex: 1 },
  colLabel: {
    fontSize: 8,
    fontWeight: '600',
    letterSpacing: 1.5,
    color: COLORS.textDim,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  colVal: { fontSize: 14, fontWeight: '800', letterSpacing: -0.3 },
  divider: { width: 1, height: 30, backgroundColor: 'rgba(255,255,255,0.07)' },
  footerSub: {
    fontSize: 8,
    color: COLORS.textDim,
    letterSpacing: 0.8,
    textAlign: 'center',
  },
});
