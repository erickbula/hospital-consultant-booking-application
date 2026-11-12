import type { CSSProperties } from 'react';

// Values below are the approved design's, kept exact so the app matches it.

export const ACCENT = '#0F6C5C';

export const card: CSSProperties = {
  background: '#FFFFFF',
  border: '1px solid #E0E0E0',
  borderRadius: 6,
};

export const section: CSSProperties = {
  ...card,
  padding: 16,
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
};

export const h1: CSSProperties = { margin: 0, fontSize: 22, fontWeight: 600 };
export const h2: CSSProperties = { margin: 0, fontSize: 15, fontWeight: 600 };
export const muted13: CSSProperties = { fontSize: 13, color: '#5C5C5C' };
export const muted12: CSSProperties = { fontSize: 12, color: '#5C5C5C' };

export const row: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  flexWrap: 'wrap',
};

export const chipRow: CSSProperties = { ...row, gap: 8 };

export const split: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 16,
  alignItems: 'flex-start',
};

export const spacer: CSSProperties = { flex: '1 1 0' };

export const btn: CSSProperties = {
  height: 40,
  padding: '0 14px',
  border: '1px solid #D1D1D1',
  borderRadius: 4,
  background: '#FFFFFF',
  color: '#242424',
  fontSize: 14,
};

export const btnPrimary: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  height: 40,
  padding: '0 16px',
  border: 0,
  borderRadius: 4,
  background: ACCENT,
  color: '#FFFFFF',
  fontWeight: 600,
  fontSize: 14,
  textDecoration: 'none',
};

export const btnSm: CSSProperties = {
  height: 36,
  padding: '0 12px',
  border: '1px solid #D1D1D1',
  borderRadius: 4,
  background: '#FFFFFF',
  color: '#242424',
  fontSize: 13,
};

export const linkBtnSm: CSSProperties = {
  ...btnSm,
  display: 'inline-flex',
  alignItems: 'center',
  textDecoration: 'none',
};

export const iconBtn: CSSProperties = {
  width: 40,
  height: 40,
  border: '1px solid #D1D1D1',
  background: '#FFFFFF',
  borderRadius: 4,
  color: '#242424',
  fontSize: 16,
};

export const select: CSSProperties = {
  height: 40,
  padding: '0 8px',
  border: '1px solid #8A8A8A',
  borderRadius: 4,
  fontSize: 14,
  background: '#FFFFFF',
  color: '#242424',
};

export const input: CSSProperties = {
  height: 40,
  padding: '0 12px',
  border: '1px solid #8A8A8A',
  borderRadius: 4,
  fontSize: 14,
  background: '#FFFFFF',
  color: '#242424',
  minWidth: 0,
};

export const field: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  fontSize: 13,
};

export const inlineField: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  fontSize: 13,
};

export const check: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  minHeight: 36,
};

export const grid2: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: 12,
};

export const tableWrap: CSSProperties = { ...card, overflowX: 'auto' };

export const th: CSSProperties = {
  padding: '12px 12px',
  fontWeight: 600,
  borderBottom: '1px solid #E0E0E0',
};

export const td: CSSProperties = {
  padding: '10px 12px',
  borderBottom: '1px solid #EBEBEB',
};

export const emptyRow: CSSProperties = {
  padding: '32px 16px',
  textAlign: 'center',
  color: '#5C5C5C',
};

export const dl = (labelWidth: number): CSSProperties => ({
  margin: 0,
  display: 'grid',
  gridTemplateColumns: `${labelWidth}px minmax(0, 1fr)`,
  rowGap: 8,
  fontSize: 13,
});

export const dt: CSSProperties = { color: '#5C5C5C' };
export const dd: CSSProperties = { margin: 0 };

export const listRow: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  padding: '10px 0',
  borderTop: '1px solid #EBEBEB',
};

export const statTile: CSSProperties = {
  background: '#F5F5F5',
  borderRadius: 4,
  padding: '8px 4px',
};
