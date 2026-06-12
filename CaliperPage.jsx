import React, { useState, useEffect } from 'react';
import { Card, Button, StatBox, colors, styles } from '../components/ui';
import { calcBodyFat, bfCategory, toKg } from '../utils/calculations';
import { NoClient } from '../components/ui';

const SITES = ['chest', 'abdominal', 'thigh', 'tricep', 'suprailiac', 'subscapular', 'midaxillary'];
const SITE_LABELS = {
  chest: 'Chest', abdominal: 'Abdominal', thigh: 'Thigh',
  tricep: 'Tricep', suprailiac: 'Suprailiac', subscapular: 'Subscapular', midaxillary: 'Midaxillary',
};
const SITE_DESC = {
  chest: 'Diagonal fold, midway between axillary line and nipple',
  abdominal: 'Vertical fold, 2cm to the right of the navel',
  thigh: 'Vertical fold, midpoint of the anterior thigh',
  tricep: 'Vertical fold, midpoint of the posterior upper arm',
  suprailiac: 'Diagonal fold, just above the iliac crest',
  subscapular: 'Diagonal fold, just below the inferior angle of the scapula',
  midaxillary: 'Horizontal fold at the midaxillary line at the xiphoid level',
};

const emptySites = () => SITES.reduce((a, s) => ({ ...a, [s]: '' }), {});

export default function CaliperPage({ activeClient, upsertClient, setTab, showToast }) {
  const [sites, setSites] = useState(emptySites());
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (activeClient) {
      setSites(activeClient.sites || emptySites());
      if (activeClient.bodyFat != null) {
        setResult({ bf: activeClient.bodyFat, sum: activeClient.siteSum });
      } else {
        setResult(null);
      }
    }
  }, [activeClient?.id]);

  if (!activeClient) return <NoClient onGoToClients={() => setTab('clients')} />;

  const vals = SITES.map(s => parseFloat(sites[s] || ''));
  const allFilled = vals.every(v => !isNaN(v) && v > 0);
  const sum = vals.reduce((a, b) => a + (isNaN(b) ? 0 : b), 0);

  const handleCalc = () => {
    const bf = calcBodyFat(sites, parseInt(activeClient.age), activeClient.sex);
    setResult({ bf, sum });
    const updated = { ...activeClient, bodyFat: bf, siteSum: sum, sites };
    upsertClient(updated);
    showToast('Body fat saved ✓');
  };

  const wKg = toKg(activeClient.weight, activeClient.unit);
  const cat = result ? bfCategory(activeClient.sex, result.bf) : null;
  const leanMass = result ? wKg * (1 - result.bf / 100) : 0;
  const fatMass = result ? wKg * (result.bf / 100) : 0;

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 800, color: colors.text, marginBottom: 3, letterSpacing: '-0.5px' }}>Caliper Test</h1>
      <p style={{ fontSize: 13, color: colors.muted, marginBottom: 18 }}>Jackson-Pollock 7-site · {activeClient.name}</p>

      {result && (
        <Card style={{ borderColor: cat.color, marginBottom: 16, textAlign: 'center', background: '#FAFFFE' }}>
          <div style={{ fontSize: 52, fontWeight: 800, color: cat.color, fontFamily: "'DM Mono', monospace", letterSpacing: '-2px', lineHeight: 1 }}>
            {result.bf.toFixed(1)}%
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, color: cat.color, marginBottom: 14, marginTop: 4 }}>{cat.label}</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            <StatBox label="Lean mass" value={`${leanMass.toFixed(1)}kg`} />
            <StatBox label="Fat mass" value={`${fatMass.toFixed(1)}kg`} />
            <StatBox label="Sum 7-site" value={`${result.sum.toFixed(1)}mm`} />
          </div>
          <Button onClick={() => setTab('macros')} style={{ marginTop: 14, fontSize: 13 }}>
            Calculate macros →
          </Button>
        </Card>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {SITES.map(site => (
          <div key={site} style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: 12, padding: '11px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: colors.text }}>{SITE_LABELS[site]}</div>
              <div style={{ fontSize: 12, color: colors.faint, marginTop: 1 }}>{SITE_DESC[site]}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <input
                type="number"
                value={sites[site]}
                onChange={e => setSites(s => ({ ...s, [site]: e.target.value }))}
                placeholder="0"
                style={{ ...styles.input, width: 68, textAlign: 'right', fontFamily: "'DM Mono', monospace", fontSize: 15, padding: '8px 10px' }}
              />
              <span style={{ fontSize: 12, color: colors.muted, width: 22 }}>mm</span>
            </div>
          </div>
        ))}
      </div>

      {allFilled && (
        <div style={{ background: colors.tealLight, border: `1px solid ${colors.tealBorder}`, borderRadius: 10, padding: '10px 14px', marginTop: 10, display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 13, color: colors.teal }}>Sum of 7 sites</span>
          <span style={{ fontFamily: "'DM Mono', monospace", fontWeight: 700, color: colors.teal, fontSize: 14 }}>{sum.toFixed(1)} mm</span>
        </div>
      )}

      <Button onClick={handleCalc} disabled={!allFilled} style={{ marginTop: 14 }}>
        Calculate body fat %
      </Button>
    </div>
  );
}
