import React, { useState } from 'react';
import { Card, Button, Label, colors, styles } from '../components/ui';

export default function ClientsPage({ clients, activeClient, setActiveClient, upsertClient, deleteClient, setTab }) {
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ name: '', age: '', sex: 'male', weight: '', unit: 'kg' });

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const valid = form.name && form.age && form.weight;

  const handleSave = () => {
    if (!valid) return;
    upsertClient({ ...form, id: Date.now(), createdAt: new Date().toISOString() });
    setForm({ name: '', age: '', sex: 'male', weight: '', unit: 'kg' });
    setAdding(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: colors.text, letterSpacing: '-0.5px' }}>Clients</h1>
          <p style={{ fontSize: 13, color: colors.muted, marginTop: 2 }}>{clients.length} client{clients.length !== 1 ? 's' : ''} saved</p>
        </div>
        <Button variant="outline" onClick={() => setAdding(!adding)} style={{ width: 'auto', padding: '9px 16px', fontSize: 13 }}>
          {adding ? 'Cancel' : '+ New Client'}
        </Button>
      </div>

      {adding && (
        <Card style={{ borderColor: colors.tealBorder, background: colors.tealLight, marginBottom: 14 }}>
          <div style={{ fontWeight: 700, color: colors.teal, marginBottom: 14, fontSize: 14 }}>New client</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <Label>Full name</Label>
              <input value={form.name} onChange={e => update('name', e.target.value)} placeholder="e.g. Alex Johnson" style={styles.input} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <Label>Age</Label>
                <input type="number" value={form.age} onChange={e => update('age', e.target.value)} placeholder="30" style={styles.input} />
              </div>
              <div>
                <Label>Sex</Label>
                <select value={form.sex} onChange={e => update('sex', e.target.value)} style={styles.input}>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>
            <div>
              <Label>Body weight</Label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input type="number" value={form.weight} onChange={e => update('weight', e.target.value)} placeholder="75" style={{ ...styles.input, flex: 1 }} />
                <select value={form.unit} onChange={e => update('unit', e.target.value)} style={{ ...styles.input, width: 72 }}>
                  <option value="kg">kg</option>
                  <option value="lbs">lbs</option>
                </select>
              </div>
            </div>
            <Button onClick={handleSave} disabled={!valid}>Save client</Button>
          </div>
        </Card>
      )}

      {clients.length === 0 && !adding && (
        <div style={{ textAlign: 'center', padding: '56px 20px', color: colors.muted }}>
          <div style={{ fontSize: 44, marginBottom: 12 }}>👥</div>
          <div style={{ fontSize: 16, fontWeight: 600, color: colors.text, marginBottom: 4 }}>No clients yet</div>
          <p style={{ fontSize: 13 }}>Tap "+ New Client" above to get started</p>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {clients.map(c => {
          const isActive = activeClient?.id === c.id;
          return (
            <Card
              key={c.id}
              style={{ cursor: 'pointer', borderColor: isActive ? colors.teal : colors.border, background: isActive ? colors.tealLight : colors.card }}
              onClick={() => setActiveClient(isActive ? null : c)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16, color: colors.text }}>{c.name}</div>
                  <div style={{ fontSize: 13, color: colors.muted, marginTop: 2 }}>
                    Age {c.age} · {c.sex === 'male' ? 'Male' : 'Female'} · {c.weight}{c.unit}
                  </div>
                  <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
                    {c.bodyFat != null && (
                      <span style={{ fontSize: 12, background: '#F0FDF4', color: '#166534', padding: '3px 9px', borderRadius: 20, fontWeight: 600 }}>
                        BF: {parseFloat(c.bodyFat).toFixed(1)}%
                      </span>
                    )}
                    {c.macros && (
                      <span style={{ fontSize: 12, background: '#FFF7ED', color: '#9A3412', padding: '3px 9px', borderRadius: 20, fontWeight: 600 }}>
                        {c.macros.calories} kcal
                      </span>
                    )}
                    {c.goal && (
                      <span style={{ fontSize: 12, background: '#EFF6FF', color: '#1D4ED8', padding: '3px 9px', borderRadius: 20, fontWeight: 600, textTransform: 'capitalize' }}>
                        {c.goal}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={e => { e.stopPropagation(); deleteClient(c.id); }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: colors.faint, padding: 4 }}
                >
                  🗑️
                </button>
              </div>

              {isActive && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 14 }}>
                  {[['📏 Caliper Test', 'caliper'], ['⚡ Macros', 'macros'], ['🍽️ Meals', 'meals'], ['💷 Budget', 'budget']].map(([label, id]) => (
                    <button
                      key={id}
                      onClick={e => { e.stopPropagation(); setTab(id); }}
                      style={{ padding: '9px 10px', border: `1px solid ${colors.border}`, borderRadius: 10, background: colors.card, cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: "'DM Sans', sans-serif", color: colors.text }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
