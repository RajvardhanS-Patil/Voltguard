import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { COLORS, SPACING } from '../utils/theme';

const BASE_INSIGHTS = [
  {
    icon: '⚡',
    text: 'System operating within normal parameters. No anomalies in the last 30 minutes.',
    meta: 'Updated 2 mins ago · Confidence: 94%',
  },
  {
    icon: '📈',
    text: 'Segment 3 shows slight imbalance. Recommend monitoring for next 15 minutes.',
    meta: 'Trend analysis · Confidence: 78%',
  },
  {
    icon: '🔮',
    text: 'Stable conditions forecast for next 2 hours based on historical pattern data.',
    meta: '24hr forecast · Confidence: 87%',
  },
];

const WARN_INSIGHTS = [
  {
    icon: '⚠️',
    text: 'Elevated theft probability detected in Sector 3. Initiating deeper analysis.',
    meta: 'Real-time alert · Confidence: 81%',
  },
  {
    icon: '📊',
    text: 'Current imbalance is outside normal range. Possible unauthorized tap detected.',
    meta: 'Anomaly detection · Confidence: 76%',
  },
  {
    icon: '🔮',
    text: 'Pattern matches known theft signature. Field inspection recommended.',
    meta: 'ML pattern match · Confidence: 83%',
  },
];

function InsightRow({ icon, text, meta, delay }) {
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(15)).current;

  useEffect(() => {
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacityAnim, { toValue: 1, duration: 350, useNativeDriver: true }),
        Animated.spring(slideAnim, { toValue: 0, tension: 65, friction: 12, useNativeDriver: true }),
      ]).start();
    }, delay);
  }, []);

  return (
    <Animated.View style={[styles.insightRow, { opacity: opacityAnim, transform: [{ translateX: slideAnim }] }]}>
      <Text style={styles.insightIcon}>{icon}</Text>
      <View style={styles.insightContent}>
        <Text style={styles.insightText}>{text}</Text>
        <Text style={styles.insightMeta}>{meta}</Text>
      </View>
    </Animated.View>
  );
}

export default function InsightPanel({ theftProb, mode }) {
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const insights = theftProb >= 40 ? WARN_INSIGHTS : BASE_INSIGHTS;

  useEffect(() => {
    Animated.timing(cardOpacity, { toValue: 1, duration: 500, delay: 200, useNativeDriver: true }).start();
  }, []);

  return (
    <Animated.View style={[
      styles.card,
      {
        backgroundColor: mode === 'advanced' ? 'rgba(124,77,255,0.07)' : 'rgba(60,40,120,0.1)',
        borderColor: mode === 'advanced' ? 'rgba(124,77,255,0.28)' : 'rgba(100,80,200,0.15)',
        opacity: cardOpacity,
      }
    ]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.iconWrap}>
          <Text style={styles.aiIcon}>🤖</Text>
        </View>
        <View style={styles.titleWrap}>
          <Text style={styles.title}>AI Insight Engine</Text>
          <Text style={styles.subtitle}>Predictive analytics · Updated live</Text>
        </View>
        <View style={styles.confidenceBadge}>
          <Text style={styles.confidenceText}>{theftProb < 30 ? '94' : theftProb < 65 ? '81' : '83'}%</Text>
          <Text style={styles.confidenceLabel}>CONF</Text>
        </View>
      </View>

      {/* Insights */}
      <View style={styles.insightsWrap}>
        {insights.map((ins, i) => (
          <InsightRow key={i} {...ins} delay={i * 100} />
        ))}
      </View>

      {/* Bottom bar */}
      <View style={styles.bottomBar}>
        <View style={styles.modelInfo}>
          <Text style={styles.modelLabel}>MODEL</Text>
          <Text style={styles.modelVal}>VOLTEX-AI v2.4</Text>
        </View>
        <View style={[styles.statusDot, { backgroundColor: theftProb > 65 ? COLORS.danger : COLORS.green }]} />
        <Text style={[styles.statusLabel, { color: theftProb > 65 ? COLORS.danger : COLORS.green }]}>
          {theftProb > 65 ? 'High Alert' : 'Monitoring'}
        </Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(124,77,255,0.1)',
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 11,
    backgroundColor: 'rgba(124,77,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  aiIcon: { fontSize: 18 },
  titleWrap: { flex: 1 },
  title: { fontSize: 13, fontWeight: '700', color: COLORS.textPrimary },
  subtitle: { fontSize: 9, color: COLORS.textDim, letterSpacing: 0.8, marginTop: 2 },
  confidenceBadge: {
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: 'rgba(124,77,255,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(124,77,255,0.3)',
  },
  confidenceText: { fontSize: 14, fontWeight: '800', color: COLORS.purple },
  confidenceLabel: { fontSize: 7, fontWeight: '700', letterSpacing: 1.5, color: COLORS.purple, marginTop: 1 },
  insightsWrap: { padding: SPACING.sm },
  insightRow: {
    flexDirection: 'row',
    gap: 10,
    padding: 11,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    backgroundColor: 'rgba(255,255,255,0.02)',
    marginBottom: 7,
    alignItems: 'flex-start',
  },
  insightIcon: { fontSize: 17, flexShrink: 0, marginTop: 1 },
  insightContent: { flex: 1 },
  insightText: { fontSize: 11, lineHeight: 17, color: COLORS.textPrimary },
  insightMeta: { fontSize: 9, color: COLORS.textDim, marginTop: 4 },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
    gap: 7,
  },
  modelInfo: { flex: 1 },
  modelLabel: { fontSize: 8, fontWeight: '700', letterSpacing: 2, color: COLORS.textDim, textTransform: 'uppercase' },
  modelVal: { fontSize: 10, fontWeight: '700', color: COLORS.textSecondary, marginTop: 1 },
  statusDot: { width: 7, height: 7, borderRadius: 4 },
  statusLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 1 },
});
