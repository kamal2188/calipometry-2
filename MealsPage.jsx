import React, { useState } from 'react';
import { Card, Button, MacroPill, NoClient, Spinner, colors, styles } from '../components/ui';
import { TESCO_FOODS } from '../data/foods';
import { generateMealPlan } from '../utils/api';

export default function MealsPage({ activeClient, showToast }) {
  const [aiPlan, setAiPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [picked, setPicked] = useState([]);
  const [portions, setPortions] = useState({});
  const [search, setSearch] = useState('');

  const macros = activeClient?.macros;

  if (!activeClient) return <NoClient onGoToClients={() => {}} />;

  const handleGeneratePlan = async () => {
    if (!macros) { showToast('Set macros first'); return; }
    setLoading(true);
    setAiPlan(null);
    try {
      const plan = await generateMealPlan(macros, activeClient.goal);
      setAiPlan(plan);
    } catch (e) {
      showToast('Error generating plan — try again');
    }
    setLoading(false);
  };

  const toggleFood = (id) => {
    if (picked.includes(id)) {
      setPicked(p => p.filter(x => x !== id));
      setPortions(p => { const n = { ...p }; delete n[id]; return n; });
    } else {
      setPicked(p => [...p, id]);
      setPortions(p => ({ ...p, [id]: '100' }));
    }
  };

  const totals = picked.reduce((acc, id) => {
    const food = TESCO_FOODS.find(f => f.id === id);
    const g = parseFloat(portions[id] || 100);
    const r = g / 100;
    return { kcal: acc.kcal + food.kcal * r, protein: acc.protein + food.protein * r, carbs: acc.carbs + food.carbs * r, fat: acc.fat + food.fat * r };
  }, { kcal: 0, protein: 0, carbs: 0, fat: 0 });

  const filtered = TESCO_FOODS.filter(f => f.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 800, color: colors.text, marginBottom: 3, letterSpacing: '-0.5px' }}>Meal Builder</h1>
      <p style={{ fontSize: 13, color: colors.muted, marginBottom: 16 }}>
        {macros
          ? `${macros.calories} kcal · ${macros.protein}g P · ${macros.carbs}g C · ${macros.fat}g F`
          : 'Set macros first for best results'}
      </p>

      {/* AI Plan */}
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ fontWeight: 700, fontSize: 15, color: colors.text }}>🤖 AI Meal Plan</span>
          <span style={{ fontSize: 11, color: colors.muted }}>Powered by Claude</span>
        </div>
        <p style={{ fontSize: 13, color: colors.muted, marginBottom: 12 }}>
          Generate a full day of Tesco-sourced meals matched to your macro targets.
        </p>
        <Button onClick={handleGeneratePlan} disabled={!macros || loading}>
          {loading ? 'Generating...' : 'Generate Meal Plan'}
        </Button>

        {loading && <Spinner />}

        {aiPlan && (
          <div style={{ marginTop: 16 }}>
            {aiPlan.meals.map((meal, i) => (
              <div key={i} style={{ marginBottom: 14 }}>
                <div style={{ fontWeight: 700, fontSize: 14, display: 'flex', justifyContent: 'space-between', marginBottom: 6, color: colors.text }}>
                  <span>{meal.name}</span>
                  <span style={{ fontFamily: "'DM Mono', monospace", color: colors.teal }}>{meal.totalKcal} kcal</span>
                </div>
                {meal.foods.map((food, j) => (
                  <div key={j} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', background: '#F8FAFC', borderRadius: 8, marginBottom: 4, fontSize: 13 }}>
                    <span style={{ color: colors.text }}>{food.item} <span style={{ color: colors.faint }}>· {food.amount}</span></span>
                    <span style={{ color: colors.muted, fontFamily: "'DM Mono', monospace", fontSize: 11 }}>{food.protein}P {food.carbs}C {food.fat}F</span>
                  </div>
                ))}
              </div>
            ))}
            {aiPlan.dailyTotals && (
              <div style={{ borderTop: `1px solid ${colors.border}`, paddingTop: 12, marginTop: 4 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: colors.muted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Daily totals</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 6 }}>
                  <MacroPill label="kcal"    value={Math.round(aiPlan.dailyTotals.kcal)}    color={colors.teal}    />
                  <MacroPill label="Protein" value={`${Math.round(aiPlan.dailyTotals.protein)}g`} color={colors.protein} />
                  <MacroPill label="Carbs"   value={`${Math.round(aiPlan.dailyTotals.carbs)}g`}   color={colors.carbs}   />
                  <MacroPill label="Fat"     value={`${Math.round(aiPlan.dailyTotals.fat)}g`}     color={colors.fat}     />
                </div>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Manual Picker */}
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span style={{ fontWeight: 700, fontSize: 15, color: colors.text }}>🛒 Tesco Food Picker</span>
          <Button variant="outline" onClick={() => setPickerOpen(!pickerOpen)} style={{ width: 'auto', padding: '6px 12px', fontSize: 12 }}>
            {pickerOpen ? 'Close' : '+ Add Food'}
          </Button>
        </div>

        {pickerOpen && (
          <div style={{ marginBottom: 12 }}>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search Tesco foods..."
              style={{ ...styles.input, marginBottom: 8 }}
            />
            <div style={{ maxHeight: 220, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 5 }}>
              {filtered.map(food => (
                <div
                  key={food.id}
                  onClick={() => toggleFood(food.id)}
                  style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '8px 10px', borderRadius: 8, cursor: 'pointer',
                    border: `1px solid ${picked.includes(food.id) ? colors.tealBorder : colors.border}`,
                    background: picked.includes(food.id) ? colors.tealLight : '#F8FAFC',
                  }}
                >
                  <div>
                    <span style={{ fontSize: 14 }}>{food.emoji} {food.name}</span>
                    <span style={{ fontSize: 11, color: colors.muted, marginLeft: 6 }}>{food.category}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 12, color: colors.muted, fontFamily: "'DM Mono', monospace" }}>£{food.price.toFixed(2)}</div>
                    <div style={{ fontSize: 11, color: colors.faint }}>{food.kcal} kcal/100g</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {picked.length === 0 && !pickerOpen && (
          <div style={{ textAlign: 'center', padding: '16px', color: colors.muted, fontSize: 13 }}>
            Tap "+ Add Food" to manually build a meal
          </div>
        )}

        {picked.length > 0 && (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
              {picked.map(id => {
                const food = TESCO_FOODS.find(f => f.id === id);
                const g = parseFloat(portions[id] || 100);
                const r = g / 100;
                return (
                  <div key={id} style={{ background: '#F8FAFC', borderRadius: 10, padding: '10px 12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: colors.text }}>{food.emoji} {food.name}</span>
                      <button onClick={() => toggleFood(id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: colors.faint, fontSize: 18, lineHeight: 1 }}>×</button>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <input
                        type="number"
                        value={portions[id]}
                        onChange={e => setPortions(p => ({ ...p, [id]: e.target.value }))}
                        style={{ ...styles.input, width: 70, padding: '6px 8px', fontSize: 13, fontFamily: "'DM Mono', monospace" }}
                      />
                      <span style={{ fontSize: 12, color: colors.muted }}>
                        g · {Math.round(food.kcal * r)} kcal · {(food.protein * r).toFixed(1)}P {(food.carbs * r).toFixed(1)}C {(food.fat * r).toFixed(1)}F
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ borderTop: `1px solid ${colors.border}`, paddingTop: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: colors.muted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Running totals</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 6 }}>
                <MacroPill label="kcal"    value={Math.round(totals.kcal)}    color={colors.teal}    />
                <MacroPill label="Protein" value={`${totals.protein.toFixed(0)}g`} color={colors.protein} />
                <MacroPill label="Carbs"   value={`${totals.carbs.toFixed(0)}g`}   color={colors.carbs}   />
                <MacroPill label="Fat"     value={`${totals.fat.toFixed(0)}g`}     color={colors.fat}     />
              </div>

              {macros && (
                <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                  {[['Protein', totals.protein, macros.protein, colors.protein], ['Carbs', totals.carbs, macros.carbs, colors.carbs], ['Fat', totals.fat, macros.fat, colors.fat]].map(([name, val, target, col]) => (
                    <div key={name} style={{ flex: 1 }}>
                      <div style={{ fontSize: 11, color: colors.muted, marginBottom: 3 }}>{name} {Math.round(Math.min((val / target) * 100, 100))}%</div>
                      <div style={{ height: 4, background: colors.border, borderRadius: 2 }}>
                        <div style={{ height: '100%', width: `${Math.min((val / target) * 100, 100).toFixed(0)}%`, background: col, borderRadius: 2, transition: 'width 0.3s' }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
