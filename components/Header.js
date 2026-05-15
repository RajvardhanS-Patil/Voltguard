import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { COLORS, SPACING } from '../utils/theme';

export default function Header({ mode }) {
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (mode === 'advanced') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
          Animated.timing(glowAnim, { toValue: 0, duration: 2000, useNativeDriver: true }),
        ])
      ).start();
    } else {
      glowAnim.setValue(0);
    }
  }, [mode]);

  const logoOpacity = glowAnim.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1] });

  return (
    <View style={[
      styles.header,
      { backgroundColor: mode === 'advanced' ? COLORS.navAdvanced : COLORS.navBasic }
    ]}>
      {/* Logo */}
      <Animated.View style={[styles.logoWrap, { opacity: logoOpacity }]}>
        <View style={styles.logoIcon}>
          <Text style={styles.logoIconText}>⚡</Text>
        </View>
        <View>
          <Text style={styles.logoText}>VOLTEX</Text>
          <Text style={styles.logoSub}>Theft Detection System</Text>
        </View>
      </Animated.View>

      {/* Right side */}
      <View style={styles.right}>
        {mode === 'advanced' && (
          <View style={styles.advBadge}>
            <View style={styles.advDot} />
            <Text style={styles.advBadgeText}>ADV</Text>
          </View>
        )}
        <ClockWidget />
      </View>
    </View>
  );
}

function ClockWidget() {
  const [time, setTime] = React.useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const s = String(now.getSeconds()).padStart(2, '0');
      setTime(`${h}:${m}:${s}`);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return <Text style={styles.clock}>{time}</Text>;
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,229,255,0.1)',
  },
  logoWrap: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logoIcon: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: COLORS.purple,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoIconText: { fontSize: 18 },
  logoText: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 3,
    color: COLORS.cyan,
  },
  logoSub: {
    fontSize: 8,
    color: COLORS.textSecondary,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  right: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  advBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: 'rgba(0,229,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(0,229,255,0.3)',
  },
  advDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: COLORS.cyan,
  },
  advBadgeText: {
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: COLORS.cyan,
  },
  clock: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: COLORS.textSecondary,
    letterSpacing: 1,
  },
});
