import React, { useState, useCallback } from 'react';
import { loadClients, saveClients } from './utils/storage';
import { Toast } from './components/ui';
import ClientsPage from './pages/ClientsPage';
import CaliperPage from './pages/CaliperPage';
import MacrosPage from './pages/MacrosPage';
import MealsPage from './pages/MealsPage';
import BudgetPage from './pages/BudgetPage';

const NAV = [
  { id: 'clients', label: 'Clients', icon: '👥' },
  { id: 'caliper', label: 'Caliper', icon: '📏' },
  { id: 'macros',  label: 'Macros',  icon: '⚡' },
  { id: 'meals',   label: 'Meals',   icon: '🍽️' },
  { id: 'budget',  label: 'Budget',  icon: '💷' },
];

export default function App() {
  const [tab, setTab] = useState('clients');
  const [clients, setClients] = useState(() => loadClients());
  const [activeClient, setActiveClient] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((msg) => setToast(msg), []);

  const upsertClient = useCallback((client) => {
    setClients(prev => {
      const idx = prev.findIndex(c => c.id === client.id);
      const updated = idx >= 0 ? prev.map(c => c.id === client.id ? client : c) : [...prev, client];
      saveClients(updated);
      return updated;
    });
    setActiveClient(client);
  }, []);

  const deleteClient = useCallback((id) => {
    setClients(prev => {
      const updated = prev.filter(c => c.id !== id);
      saveClients(updated);
      return updated;
    });
    setActiveClient(ac => ac?.id === id ? null : ac);
    showToast('Client removed');
  }, [showToast]);

  const pageProps = { activeClient, upsertClient, setTab, showToast };

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', minHeight: '100vh', position: 'relative', background: '#F0F4F8' }}>

      {/* Header */}
      <div style={{
        background: '#fff', borderBottom: '1px solid #E5E7EB',
        padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 10,
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{ width: 30, height: 30, background: '#0D9488', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
          📐
        </div>
        <span style={{ fontWeight: 800, fontSize: 17, color: '#111827', letterSpacing: '-0.3px' }}>Caliperometry</span>
        {activeClient && (
          <span style={{ marginLeft: 'auto', fontSize: 12, background: '#F0FDFA', color: '#0D9488', padding: '4px 10px', borderRadius: 20, fontWeight: 700 }}>
            {activeClient.name}
          </span>
        )}
      </div>

      {/* Page content */}
      <div style={{ padding: '20px 16px 90px' }}>
        {tab === 'clients' && (
          <ClientsPage
            clients={clients}
            activeClient={activeClient}
            setActiveClient={setActiveClient}
            upsertClient={upsertClient}
            deleteClient={deleteClient}
            setTab={setTab}
          />
        )}
        {tab === 'caliper' && <CaliperPage {...pageProps} />}
        {tab === 'macros'  && <MacrosPage  {...pageProps} />}
        {tab === 'meals'   && <MealsPage   activeClient={activeClient} showToast={showToast} />}
        {tab === 'budget'  && <BudgetPage  activeClient={activeClient} showToast={showToast} />}
      </div>

      {/* Bottom nav */}
      <div style={{
        position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: 480,
        background: '#fff', borderTop: '1px solid #E5E7EB', display: 'flex',
        zIndex: 100,
      }}>
        {NAV.map(n => (
          <button
            key={n.id}
            onClick={() => setTab(n.id)}
            style={{
              flex: 1, border: 'none', background: 'none',
              padding: '10px 4px 12px', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
              fontFamily: "'DM Sans', system-ui, sans-serif",
            }}
          >
            <span style={{ fontSize: 20 }}>{n.icon}</span>
            <span style={{ fontSize: 10, fontWeight: tab === n.id ? 700 : 400, color: tab === n.id ? '#0D9488' : '#9CA3AF' }}>
              {n.label}
            </span>
            {tab === n.id && <div style={{ width: 4, height: 4, background: '#0D9488', borderRadius: '50%' }} />}
          </button>
        ))}
      </div>

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
