import { useState, useEffect, useRef } from 'react';

const INITIAL_NODES = [
  { id: 'A', name: 'Node A', sub: 'Substation', status: 'ok', val: 48.3, tag: 'Normal' },
  { id: 'B', name: 'Node B', sub: 'Sector 3', status: 'warn', val: 44.1, tag: 'Monitor' },
  { id: 'C', name: 'Node C', sub: 'Junction 7', status: 'ok', val: 47.8, tag: 'Normal' },
  { id: 'D', name: 'Node D', sub: 'End Point', status: 'ok', val: 46.2, tag: 'Normal' },
];

const MAX_HISTORY = 30;

export function useSimulation(addAlert) {
  const [supply, setSupply] = useState(48.3);
  const [load, setLoad] = useState(44.1);
  const [voltage, setVoltage] = useState(231.2);
  const [loss, setLoss] = useState(4.2);
  const [efficiency, setEfficiency] = useState('91.3');
  const [theftProb, setTheftProb] = useState(22);
  const [nodes, setNodes] = useState(INITIAL_NODES);
  const [currentHistory, setCurrentHistory] = useState([]);
  const [voltageHistory, setVoltageHistory] = useState([]);
  const [probHistory, setProbHistory] = useState([]);

  const supplyRef = useRef(48.3);
  const loadRef = useRef(44.1);
  const voltageRef = useRef(231.2);
  const alertCountRef = useRef(0);

  // Seed histories
  useEffect(() => {
    const ch = [], vh = [], ph = [];
    for (let i = 0; i < MAX_HISTORY; i++) {
      ch.push(48 + Math.sin(i / 4) * 2 + (Math.random() - 0.5));
      vh.push(231 + Math.sin(i / 6) * 1.5 + (Math.random() - 0.5));
      ph.push(22 + Math.sin(i / 5) * 8 + Math.random() * 3);
    }
    setCurrentHistory(ch);
    setVoltageHistory(vh);
    setProbHistory(ph);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      supplyRef.current += (Math.random() - 0.5) * 0.85;
      loadRef.current += (Math.random() - 0.5) * 0.65;
      voltageRef.current += (Math.random() - 0.5) * 1.5;

      supplyRef.current = Math.max(40, Math.min(60, supplyRef.current));
      loadRef.current = Math.max(35, Math.min(58, loadRef.current));
      voltageRef.current = Math.max(220, Math.min(242, voltageRef.current));

      const s = supplyRef.current;
      const l = loadRef.current;
      const v = voltageRef.current;
      const ls = Math.abs(s - l);
      const eff = ((l / s) * 100).toFixed(1);
      const ip = (ls / s) * 100;
      const tp = Math.min(95, Math.max(5, Math.round(ip * 8 + Math.random() * 5)));

      setSupply(s);
      setLoad(l);
      setVoltage(v);
      setLoss(ls);
      setEfficiency(eff);
      setTheftProb(tp);

      setNodes(prev => prev.map((n, i) => {
        if (i === 1) {
          return {
            ...n,
            val: parseFloat(l.toFixed(1)),
            status: tp > 50 ? 'crit' : tp > 25 ? 'warn' : 'ok',
            tag: tp > 50 ? 'Critical' : tp > 25 ? 'Monitor' : 'Normal',
          };
        }
        return n;
      }));

      setCurrentHistory(prev => {
        const next = [...prev, parseFloat(s.toFixed(2))];
        return next.length > MAX_HISTORY ? next.slice(-MAX_HISTORY) : next;
      });
      setVoltageHistory(prev => {
        const next = [...prev, parseFloat(v.toFixed(2))];
        return next.length > MAX_HISTORY ? next.slice(-MAX_HISTORY) : next;
      });
      setProbHistory(prev => {
        const next = [...prev, tp];
        return next.length > MAX_HISTORY ? next.slice(-MAX_HISTORY) : next;
      });

      alertCountRef.current++;
      if (alertCountRef.current % 12 === 0 && Math.random() < 0.5) {
        addAlert('warn', 'Imbalance Spike', `Node B differential: ${ls.toFixed(2)}A`);
      }
    }, 2000);

    // Initial alerts
    const t1 = setTimeout(() => addAlert('info', 'VOLTEX Online', 'All 4 nodes connected. Monitoring active.'), 1000);
    const t2 = setTimeout(() => addAlert('warn', 'Sector 3 Monitor', 'Current imbalance detected. Fuzzy analysis running.'), 3500);

    return () => {
      clearInterval(interval);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return {
    supply, load, voltage, loss, efficiency, theftProb, nodes,
    currentHistory, voltageHistory, probHistory,
  };
}
