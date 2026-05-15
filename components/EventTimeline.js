import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, Animated,
  TouchableOpacity, ScrollView,
} from 'react-native';
import { COLORS, SPACING } from '../utils/theme';

const TYPE_COLOR = {
  info:  COLORS.cyan,
  warn:  COLORS.amber,
  crit:  COLORS.danger,
  ok:    COLORS.green,
};

const TYPE_ICON = {
  info: '💡',
  warn: '⚠️',
  crit: '🚨',
  ok:   '✅',
};

const INITIAL_EVENTS = [
  { id: 1, time: '14:32:11', title: 'System Initialized',    desc: 'All monitoring nodes connected.',          type: 'info' },
  { id: 2, time: '14:33:05', title: 'Node B Anomaly',        desc: 'Current imbalance in Sector 3.',           type: 'warn' },
  { id: 3, time: '14:35:22', title: 'Fuzzy Analysis Done',   desc: 'Theft probability: 22%. Monitor.',         type: 'info' },
  { id: 4, time: '14:38:47', title: 'Voltage Stabilized',    desc: 'Voltage returned to normal range.',        type: 'ok'   },
  { id: 5, time: '14:41:00', title: 'AI Model Updated',      desc: 'Retrained with latest 2-hour data.',       type: 'info' },
];

const EVENT_POOL = [
  { title: 'Voltage Spike',      desc: 'Transient at Junction 1: 235.4V.',         type: 'warn' },
  { title: 'Node C Reconnected', desc: 'Node C returned to operational.',           type: 'ok'   },
  { title: 'Auto-Calibration',   desc: 'Fuzzy model recalibrated successfully.',    type: 'info' },
  { title: 'Imbalance Normal',   desc: 'Differential reduced to 0.4A.',             type: 'ok'   },
  { title: 'Suspicious Pattern', desc: 'Irregular draw detected in Sector 3.',      type: 'warn' },
  { title: 'Threshold Breach',   desc: 'Theft index exceeded 65% — alerting.',      type: 'crit' },
  { title: 'Field Team Notified',desc: 'Dispatch sent to Sector 3 for inspection.', type: 'info' },
];

function EventRow({ event, index }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(-16)).current;
  const color = TYPE_COLOR[event.type] || COLORS.cyan;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity,     { toValue: 1, duration: 320, delay: index * 55, useNativeDriver: true }),
      Animated.spring(translateX,  { toValue: 0, tension: 70, friction: 12, delay: index * 55, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[styles.row, { opacity, transform: [{ translateX }] }]}>
      {/* time */}
      <Text style={styles.time}>{event.time}</Text>

      {/* dot + line */}
      <View style={styles.dotCol}>
        <View style={[styles.dot, { backgroundColor: color, shadowColor: color }]} />
        <View style={styles.line} />
      </View>

      {/* content */}
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.icon}>{TYPE_ICON[event.type]}</Text>
          <Text style={[styles.title, { color }]} numberOfLines={1}>{event.title}</Text>
        </View>
        <Text style={styles.desc} numberOfLines={2}>{event.desc}</Text>
      </View>
    </Animated.View>
  );
}

export default function EventTimeline({ mode }) {
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const btnScale   = useRef(new Animated.Value(1)).current;
  let nextId = useRef(INITIAL_EVENTS.length + 1);

  useEffect(() => {
    Animated.timing(cardOpacity, { toValue: 1, duration: 500, delay: 250, useNativeDriver: true }).start();
  }, []);

  function addEvent() {
    // Button press feedback
    Animated.sequence([
      Animated.timing(btnScale, { toValue: 0.92, duration: 80, useNativeDriver: true }),
      Animated.timing(btnScale, { toValue: 1,    duration: 150, useNativeDriver: true }),
    ]).start();

    const pool = EVENT_POOL[Math.floor(Math.random() * EVENT_POOL.length)];
    const now  = new Date();
    const hh   = String(now.getHours()).padStart(2, '0');
    const mm   = String(now.getMinutes()).padStart(2, '0');
    const ss   = String(now.getSeconds()).padStart(2, '0');
    const ev   = { ...pool, id: nextId.current++, time: `${hh}:${mm}:${ss}` };
    setEvents(prev => [ev, ...prev].slice(0, 12));
  }

  const borderCol = mode === 'advanced' ? 'rgba(0,229,255,0.18)' : COLORS.borderBasic;
  const bg        = mode === 'advanced' ? 'rgba(4,14,40,0.7)' : COLORS.cardBasic;

  return (
    <Animated.View style={[styles.card, { backgroundColor: bg, borderColor: borderCol, opacity: cardOpacity }]}>

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleWrap}>
          <View style={[styles.accent, { backgroundColor: COLORS.cyan }]} />
          <Text style={styles.cardTitle}>Event Timeline</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{events.length}</Text>
          </View>
        </View>
        <Animated.View style={{ transform: [{ scale: btnScale }] }}>
          <TouchableOpacity style={styles.addBtn} onPress={addEvent} activeOpacity={0.8}>
            <Text style={styles.addBtnText}>+ Add Event</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Event list (last 7 shown, scrollable) */}
      <ScrollView
        style={styles.list}
        nestedScrollEnabled
        showsVerticalScrollIndicator={false}
      >
        {events.map((ev, i) => (
          <EventRow key={ev.id} event={ev} index={i} />
        ))}
      </ScrollView>
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
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  titleWrap: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  accent: { width: 3, height: 16, borderRadius: 2 },
  cardTitle: { fontSize: 13, fontWeight: '700', color: COLORS.textPrimary, letterSpacing: 0.4 },
  countBadge: {
    paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: 12,
    backgroundColor: 'rgba(0,229,255,0.1)',
    borderWidth: 1, borderColor: 'rgba(0,229,255,0.2)',
  },
  countText: { fontSize: 10, fontWeight: '700', color: COLORS.cyan },
  addBtn: {
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 20, minHeight: 36,
    backgroundColor: COLORS.purple,
    alignItems: 'center', justifyContent: 'center',
  },
  addBtnText: { fontSize: 11, fontWeight: '700', color: '#fff', letterSpacing: 0.5 },
  list: { maxHeight: 300, paddingHorizontal: SPACING.md, paddingTop: 6 },
  row: {
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 8,
    alignItems: 'flex-start',
  },
  time: {
    fontFamily: 'monospace',
    fontSize: 9,
    color: COLORS.textDim,
    width: 50,
    paddingTop: 2,
    flexShrink: 0,
  },
  dotCol: { alignItems: 'center', width: 14 },
  dot: {
    width: 10, height: 10, borderRadius: 5,
    shadowOpacity: 0.7, shadowRadius: 4, shadowOffset: { width: 0, height: 0 },
    elevation: 3,
  },
  line: { width: 1, flex: 1, backgroundColor: 'rgba(255,255,255,0.06)', marginTop: 3 },
  content: { flex: 1, paddingBottom: 6, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.04)' },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 3 },
  icon: { fontSize: 12 },
  title: { fontSize: 12, fontWeight: '700', flex: 1 },
  desc: { fontSize: 11, color: COLORS.textSecondary, lineHeight: 16 },
});
