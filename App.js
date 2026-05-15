import React, { useState, useRef } from 'react';
import {
  View,
  ScrollView,
  StatusBar,
  Animated,
  SafeAreaView,
  StyleSheet,
  Text,
} from 'react-native';

import { COLORS, SPACING } from './utils/theme';
import { useSimulation } from './hooks/useSimulation';

import Header          from './components/Header';
import ModeToggle      from './components/ModeToggle';
import StatusBar2      from './components/StatusBar2';
import AlertBanner     from './components/AlertBanner';
import Gauge           from './components/Gauge';
import StatCard        from './components/StatCard';
import NodeCard        from './components/NodeCard';
import NetworkTopology from './components/NetworkTopology';
import ChartCard       from './components/ChartCard';
import FuzzyPanel      from './components/FuzzyPanel';
import InsightPanel    from './components/InsightPanel';
import EventTimeline   from './components/EventTimeline';
import HeatmapGrid     from './components/HeatmapGrid';
import SummaryFooter   from './components/SummaryFooter';

/* ─────────────────────────────────────────────────────────
   ROOT APP
───────────────────────────────────────────────────────── */
export default function App() {
  const [mode, setMode]     = useState('basic');
  const [alerts, setAlerts] = useState([]);

  const fadeAnim    = useRef(new Animated.Value(1)).current;
  const advAnim     = useRef(new Animated.Value(0)).current;
  const scrollRef   = useRef(null);

  const simData = useSimulation(addAlert);

  /* ── alert system ── */
  function addAlert(type, title, body) {
    const id = Date.now() + Math.random();
    setAlerts(prev => [{ id, type, title, body }, ...prev].slice(0, 3));
    setTimeout(() => removeAlert(id), 5500);
  }
  function removeAlert(id) {
    setAlerts(prev => prev.filter(a => a.id !== id));
  }

  /* ── mode switch ── */
  function handleModeSwitch(newMode) {
    if (newMode === mode) return;
    // Fade out
    Animated.timing(fadeAnim, { toValue: 0, duration: 180, useNativeDriver: true }).start(() => {
      setMode(newMode);
      // Scroll to top so user sees gauge first
      scrollRef.current?.scrollTo({ y: 0, animated: false });
      // Fade in + slide advanced section
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 280, useNativeDriver: true }),
        Animated.timing(advAnim, {
          toValue: newMode === 'advanced' ? 1 : 0,
          duration: 480,
          useNativeDriver: true,
        }),
      ]).start();
    });
  }

  /* ── derived anim values ── */
  const advOpacity   = advAnim;
  const advTranslate = advAnim.interpolate({ inputRange: [0, 1], outputRange: [40, 0] });

  const bg = mode === 'advanced' ? COLORS.bgAdvanced : COLORS.bgBasic;

  return (
    <View style={[styles.root, { backgroundColor: bg }]}>
      <StatusBar barStyle="light-content" backgroundColor={bg} translucent={false} />
      <SafeAreaView style={styles.safe}>

        {/* ── fixed header ── */}
        <Header mode={mode} />
        <ModeToggle mode={mode} onSwitch={handleModeSwitch} />
        <StatusBar2 theftProb={simData.theftProb} mode={mode} />

        {/* ── alerts (above scroll) ── */}
        <View style={styles.alertsWrap}>
          {alerts.map(a => (
            <AlertBanner
              key={a.id}
              type={a.type}
              title={a.title}
              body={a.body}
              onDismiss={() => removeAlert(a.id)}
            />
          ))}
        </View>

        {/* ── scrollable body ── */}
        <Animated.View style={[styles.scrollWrap, { opacity: fadeAnim }]}>
          <ScrollView
            ref={scrollRef}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >

            {/* ══ GAUGE ══ */}
            <Gauge theftProb={simData.theftProb} mode={mode} />

            {/* ══ STAT CARDS ══ */}
            <View style={styles.row}>
              <StatCard label="Supply" value={simData.supply.toFixed(1)} unit="A"
                color={COLORS.cyan}   icon="⚡" progress={simData.supply / 60}
                trend={`${((simData.supply / 60) * 100).toFixed(0)}% cap`}
                mode={mode} delay={0} />
              <StatCard label="Load" value={simData.load.toFixed(1)} unit="A"
                color={COLORS.green}  icon="🔌" progress={simData.load / 60}
                trend={`${((simData.load / 60) * 100).toFixed(0)}% supply`}
                mode={mode} delay={80} />
            </View>
            <View style={styles.row}>
              <StatCard label="Voltage" value={simData.voltage.toFixed(1)} unit="V"
                color={COLORS.purple} icon="〰️"
                progress={(simData.voltage - 200) / 60}
                trend={simData.voltage > 233 ? '↑ High' : simData.voltage < 225 ? '↓ Low' : '→ Normal'}
                mode={mode} delay={160} />
              <StatCard label="Loss" value={simData.loss.toFixed(2)} unit="A"
                color={COLORS.amber}  icon="📍"
                progress={Math.min(1, simData.loss / 10)}
                trend={simData.loss > 5 ? '↑ High Loss' : '→ Moderate'}
                mode={mode} delay={240} />
            </View>

            {/* ══ IMBALANCE CARD ══ */}
            <ImbalanceCard simData={simData} />

            {/* ══ SECTION: NODES ══ */}
            <SectionHeader label="Node Status" live />
            {simData.nodes.map((node, i) => (
              <NodeCard key={node.id} node={node} mode={mode} delay={i * 55} />
            ))}

            {/* ══ NETWORK TOPOLOGY ══ */}
            <NetworkTopology nodes={simData.nodes} mode={mode} />

            {/* ══ SUMMARY FOOTER (basic) ══ */}
            {mode === 'basic' && (
              <SummaryFooter
                mode={mode}
                theftProb={simData.theftProb}
                supply={simData.supply}
                load={simData.load}
              />
            )}

            {/* ══════════════════════════════════
                ADVANCED MODE SECTION
            ══════════════════════════════════ */}
            {mode === 'advanced' && (
              <Animated.View style={{
                opacity: advOpacity,
                transform: [{ translateY: advTranslate }],
              }}>
                {/* divider pill */}
                <View style={styles.advDividerWrap}>
                  <View style={styles.advDividerLine} />
                  <View style={styles.advPill}>
                    <Text style={styles.advPillText}>🔬 ADVANCED MODE</Text>
                  </View>
                  <View style={styles.advDividerLine} />
                </View>

                {/* Charts */}
                <SectionHeader label="Real-Time Analytics" />
                <ChartCard label="Current Flow (A)"       color={COLORS.cyan}   data={simData.currentHistory} mode={mode} delay={0}   />
                <ChartCard label="Voltage Variation (V)"  color={COLORS.purple} data={simData.voltageHistory} mode={mode} delay={100} />
                <ChartCard label="Theft Probability (%)"  color={COLORS.danger} data={simData.probHistory}    mode={mode} delay={200} />

                {/* Fuzzy + AI */}
                <SectionHeader label="Fuzzy Logic & AI" />
                <FuzzyPanel   theftProb={simData.theftProb} mode={mode} />
                <InsightPanel theftProb={simData.theftProb} mode={mode} />

                {/* Heatmap */}
                <SectionHeader label="Zone Loss Map" />
                <HeatmapGrid mode={mode} />

                {/* Timeline */}
                <SectionHeader label="Event Log" />
                <EventTimeline mode={mode} />

                {/* Summary */}
                <SummaryFooter
                  mode={mode}
                  theftProb={simData.theftProb}
                  supply={simData.supply}
                  load={simData.load}
                />
              </Animated.View>
            )}

            <View style={styles.bottomPad} />
          </ScrollView>
        </Animated.View>

      </SafeAreaView>
    </View>
  );
}

/* ─────────────────────────────────────────────────────────
   SMALL LOCAL COMPONENTS
───────────────────────────────────────────────────────── */
function SectionHeader({ label, live }) {
  return (
    <View style={shStyles.wrap}>
      <View style={shStyles.line} />
      <Text style={shStyles.label}>{label.toUpperCase()}</Text>
      {live && (
        <View style={shStyles.liveBadge}>
          <View style={shStyles.liveDot} />
          <Text style={shStyles.liveText}>LIVE</Text>
        </View>
      )}
    </View>
  );
}

const shStyles = StyleSheet.create({
  wrap: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    marginBottom: SPACING.sm, marginTop: SPACING.xs,
  },
  line:  { width: 18, height: 2, backgroundColor: COLORS.cyan, borderRadius: 2 },
  label: { fontSize: 10, fontWeight: '700', letterSpacing: 2.5, color: 'rgba(160,200,240,0.55)', flex: 1 },
  liveBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 9, paddingVertical: 4, borderRadius: 20,
    borderWidth: 1, borderColor: 'rgba(0,255,156,0.3)',
    backgroundColor: 'rgba(0,255,156,0.07)',
  },
  liveDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: COLORS.green },
  liveText: { fontSize: 8, fontWeight: '700', letterSpacing: 1.5, color: COLORS.green },
});

function ImbalanceCard({ simData }) {
  const effGood = parseFloat(simData.efficiency) > 90;
  const effColor = effGood ? COLORS.green : COLORS.amber;
  const lossPct = Math.min(100, (simData.loss / simData.supply) * 100 * 5);

  return (
    <View style={icStyles.card}>
      <View style={icStyles.top}>
        <View>
          <Text style={icStyles.label}>TOTAL IMBALANCE</Text>
          <Text style={[icStyles.val, { color: COLORS.amber }]}>
            {simData.loss.toFixed(2)} A
          </Text>
          <Text style={icStyles.sub}>
            {((simData.loss / simData.supply) * 100).toFixed(1)}% of supply  ·  Eff {simData.efficiency}%
          </Text>
        </View>
        <View style={[icStyles.effBadge, { borderColor: effColor }]}>
          <Text style={[icStyles.effVal, { color: effColor }]}>{simData.efficiency}%</Text>
          <Text style={[icStyles.effLbl, { color: effColor }]}>EFF</Text>
        </View>
      </View>
      <View style={icStyles.barBg}>
        <View style={[icStyles.barFill, { width: `${lossPct}%` }]} />
      </View>
    </View>
  );
}

const icStyles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255,193,7,0.06)',
    borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,193,7,0.2)',
    padding: SPACING.md, marginBottom: SPACING.sm,
  },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  label: { fontSize: 9, fontWeight: '700', letterSpacing: 2, color: 'rgba(255,193,7,0.55)', marginBottom: 4 },
  val:  { fontSize: 32, fontWeight: '800', letterSpacing: -0.5 },
  sub:  { fontSize: 11, color: 'rgba(200,200,200,0.5)', marginTop: 3 },
  effBadge: { alignItems: 'center', borderWidth: 1, borderRadius: 12, padding: 10, minWidth: 64 },
  effVal: { fontSize: 20, fontWeight: '800' },
  effLbl: { fontSize: 9, fontWeight: '700', letterSpacing: 2, marginTop: 2 },
  barBg:   { height: 4, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden' },
  barFill: { height: 4, borderRadius: 4, backgroundColor: COLORS.amber },
});

/* ─────────────────────────────────────────────────────────
   ROOT STYLES
───────────────────────────────────────────────────────── */
const styles = StyleSheet.create({
  root:       { flex: 1 },
  safe:       { flex: 1 },
  scrollWrap: { flex: 1 },
  content:    { paddingHorizontal: SPACING.md, paddingTop: SPACING.sm },
  alertsWrap: { paddingHorizontal: SPACING.md },
  row:        { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.sm },
  advDividerWrap: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    marginVertical: SPACING.md,
  },
  advDividerLine: { flex: 1, height: 1, backgroundColor: 'rgba(124,77,255,0.2)' },
  advPill: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
    backgroundColor: 'rgba(124,77,255,0.12)',
    borderWidth: 1, borderColor: 'rgba(124,77,255,0.3)',
  },
  advPillText: { fontSize: 10, fontWeight: '700', letterSpacing: 2, color: COLORS.purple },
  bottomPad: { height: 48 },
});
