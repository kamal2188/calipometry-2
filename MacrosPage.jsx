import React, { useState, useEffect } from 'react';
import { Card, Button, Label, MacroPill, NoClient, colors, styles } from '../components/ui';
import { calcMacros, toKg } from '../utils/calculations';

const ACTIVITY_OPTIONS = [
  { value: 'sedentary',  label: 'Sedentary — little or no exercise' },
  { value: 'light',      label: 'Lightly active — 1–3 days/week' },
  { value: 'moderate',   label: 'Moderately active — 3–5 days/week' },
  { value: 'active',     label: 'Very active — 6–7 days/week' },
  { value: 'veryActive', label: 'Extremely active — physical job + training' },
];

const GOALS = [
  { value: 'cut',      label: 'Cut',      icon: '↓', desc: 'Lose fat' },
  { value: 'maintain', label: 'Maintain', icon: '⇔', desc: 'Body recomp' },
  { value: 'bulk',     label: 'Bulk',     icon: '↑', desc: 'Build muscle' },
];

export default function MacrosPage({ activeClient, upsertClient, setTab, showToast }) {
  const [activity, setActivity] = useState('moderate');
  const [goal, setGoal] = useState('maintain');
  const [macros, setMacros] = useState(null);

  useEffect(() => {
    if (activeClient) {
      setActivity(activeClient.activity || 'moderate');
      setGoal(activeClient.goal || 'maintain');
      setMacros(activeClient.macros || null);
    }
  }, [activeClient?.id]);

  if (!activeClient) return <NoClient onGoToClients={() => setTab('clients')} />;

  const hasBf = activeClient.bodyFat != null;

  const handleCalc = () => {
    const wKg = toKg(activeClient.weight, activeClient.unit);
    const bf = hasBf ? activeClient.bodyFat : 20;
    const m = calcMacros(wKg, bf, goal, activity);
    setMacros(m);
    upsertClient({ ...activeClient, macros: m, activity, goal });
    showToast('Macros saved ✓');
  };

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 800, color: colors.text, marginBottom: 3, letterSpacing: '-0.5px' }}>Macros</h1>
      <p style={{ fontSize: 13, color: colors.muted, marginBottom: 14 }}>
        {activeClient.name} {hasBf ? `· ${parseFloat(activeClient.bodyFat).toFixed(1)}% BF` : '· No caliper data'}
      </p>

      {!hasBf && (
        <div style={{ background: '#FFFBEB', border: '1px solid #FCD34D', borderRadius: 10, padding: '10px 14px', marginBottom: 14, fontSize: 13, color: '#92400E' }}>
          ⚠️ No caliper data — using 20% body fat estimate.{' '}
          <span style={{ fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }} onClick={() => setTab('caliper')}>
            Run caliper test →
          </span>
        </div>
      )}

      <Card>
        <Label>Activity level</Label>
        <select value={activity} onChange={e => setActivity(e.target.value)} style={styles.input}>
          {ACTIVITY_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>

        <div style={{ marginTop: 16 }}>
          <Label>Goal</Label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            {GOALS.map(g => (
              <button
                key={g.value}
                onClick={() => setGoal(g.value)}
                style={{
                  padding: '13px 8px', cursor: 'pointer', textAlign: 'center', fontFamily: "'DM Sans', sans-serif",
                  border: goal === g.value ? `2px solid ${colors.teal}` : `1px solid ${colors.border}`,
                  borderRadius: 10,
                  background: goal === g.value ? colors.tealLight : colors.card,
                }}
              >
                <div style={{ fontSize: 20 }}>{g.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: goal === g.value ? colors.teal : colors.text, marginTop: 2 }}>{g.label}</div>
                <div style={{ fontSize: 11, color: colors.muted }}>{g.desc}</div>
              </button>
            ))}
          </div>
        </div>
        <Button onClick={handleCalc} style={{ marginTop: 16 }}>Calculate macros</Button>
      </Card>

      {macros && (
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <span style={{ fontWeight: 700, fontSize: 16, color: colors.text }}>Daily targets</span>
            <span style={{ fontSize: 13, color: colors.muted }}>
              TDEE: <b style={{ fontFamily: "'DM Mono', monospace", color: colors.text }}>{macros.tdee}</b> kcal
            </span>
          </div>

          <div style={{ background: colors.tealLight, borderRadius: 10, padding: '14px 16px', marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 14, color: colors.text }}>Target calories</span>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 26, fontWeight: 800, color: colors.teal }}>
              {macros.calories} <span style={{ fontSize: 15, fontWeight: 500 }}>kcal</span>
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
            <MacroPill label="Protein (g)" value={macros.protein} color={colors.protein} />
            <MacroPill label="Carbs (g)"   value={macros.carbs}   color={colors.carbs}   />
            <MacroPill label="Fat (g)"     value={macros.fat}     color={colors.fat}     />
          </div>

          <Button onClick={() => setTab('meals')} style={{ marginTop: 14, fontSize: 13 }}>
            Build meal plan →
          </Button>
        </Card>
      )}
    </div>
  );
}
