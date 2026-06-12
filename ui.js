import React from 'react';

export const colors = {
  teal: '#0D9488',
  tealLight: '#F0FDFA',
  tealBorder: '#99F6E4',
  protein: '#3B82F6',
  carbs: '#F59E0B',
  fat: '#F97316',
  border: '#E5E7EB',
  text: '#111827',
  muted: '#6B7280',
  faint: '#9CA3AF',
  bg: '#F0F4F8',
  card: '#FFFFFF',
};

export const styles = {
  input: {
    width: '100%',
    padding: '10px 12px',
    border: `1px solid ${colors.border}`,
    borderRadius: 10,
    fontSize: 14,
    color: colors.text,
    background: colors.card,
    fontFamily: "'DM Sans', system-ui, sans-serif",
    outline: 'none',
    boxSizing: 'border-box',
  },
  card: {
    background: colors.card,
    border: `1px solid ${colors.border}`,
    borderRadius: 14,
    padding: '16px',
    marginBottom: 12,
  },
};

export function Label({ children }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 700, color: colors.muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
      {children}
    </div>
  );
}

export function Card({ children, style = {}, onClick }) {
  return (
    <div style={{ ...styles.card, ...style }} onClick={onClick}>
      {children}
    </div>
  );
}

export function Button({ children, onClick, disabled, variant = 'primary', style = {} }) {
  const base = {
    borderRadius: 10,
    padding: '11px 18px',
    fontSize: 14,
    fontWeight: 600,
    cursor: disabled ? 'not-allowed' : 'pointer',
    width: '100%',
    fontFamily: "'DM Sans', system-ui, sans-serif",
    transition: 'opacity 0.15s',
    opacity: disabled ? 0.4 : 1,
    border: 'none',
  };
  const variants = {
    primary: { background: colors.teal, color: '#fff' },
    outline: { background: colors.card, color: colors.text, border: `1px solid ${colors.border}` },
    ghost: { background: 'transparent', color: colors.teal, border: 'none', padding: '6px 0', width: 'auto' },
  };
  return (
    <button style={{ ...base, ...variants[variant], ...style }} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

export function MacroPill({ label, value, color }) {
  return (
    <div style={{ textAlign: 'center', background: '#F8FAFC', borderRadius: 10, padding: '10px 6px', borderTop: `3px solid ${color}` }}>
      <div style={{ fontSize: 19, fontWeight: 800, color: colors.text, fontFamily: "'DM Mono', monospace" }}>{value}</div>
      <div style={{ fontSize: 11, color: colors.muted, marginTop: 2 }}>{label}</div>
    </div>
  );
}

export function StatBox({ label, value }) {
  return (
    <div style={{ background: '#F8FAFC', borderRadius: 10, padding: '8px 10px', textAlign: 'center' }}>
      <div style={{ fontSize: 15, fontWeight: 700, fontFamily: "'DM Mono', monospace", color: colors.text }}>{value}</div>
      <div style={{ fontSize: 11, color: colors.faint, marginTop: 2 }}>{label}</div>
    </div>
  );
}

export function Toast({ message, onClose }) {
  React.useEffect(() => {
    const t = setTimeout(onClose, 2500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div style={{
      position: 'fixed', bottom: 80, left: '50%', transform: 'translateX(-50%)',
      background: '#111827', color: '#fff', padding: '11px 20px',
      borderRadius: 10, fontSize: 13, fontWeight: 500, zIndex: 9999, whiteSpace: 'nowrap',
      boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
    }}>
      {message}
    </div>
  );
}

export function NoClient({ onGoToClients }) {
  return (
    <div style={{ textAlign: 'center', padding: '60px 20px' }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>👤</div>
      <div style={{ fontSize: 16, fontWeight: 600, color: colors.text, marginBottom: 6 }}>No client selected</div>
      <p style={{ fontSize: 14, color: colors.muted, marginBottom: 20 }}>Go to Clients, tap a name to activate them, then come back here.</p>
      <Button onClick={onGoToClients} style={{ width: 'auto', padding: '10px 24px' }}>Go to Clients</Button>
    </div>
  );
}

export function Spinner() {
  return (
    <div style={{ textAlign: 'center', padding: '24px', color: colors.muted, fontSize: 14 }}>
      <div style={{
        display: 'inline-block', width: 20, height: 20,
        border: `2px solid ${colors.border}`, borderTopColor: colors.teal,
        borderRadius: '50%', animation: 'spin 0.7s linear infinite',
        marginRight: 10, verticalAlign: 'middle',
      }} />
      Generating...
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
