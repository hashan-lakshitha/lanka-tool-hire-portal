import { theme } from './theme';

export const inputStyle = {
  padding: '8px 10px',
  borderRadius: 4,
  border: `1px solid ${theme.color.border}`,
  fontFamily: theme.font.body,
  fontSize: 13,
};

export const panelStyle = {
  background: theme.color.surface,
  border: `1px solid ${theme.color.border}`,
  borderRadius: theme.radius,
  padding: '16px 18px',
  marginBottom: 16,
};

export const primaryButton = {
  padding: '8px 16px',
  fontSize: 13,
  fontWeight: 600,
  color: '#fff',
  background: theme.color.ink,
  border: 'none',
  borderRadius: 4,
  cursor: 'pointer',
  fontFamily: theme.font.body,
};

export const secondaryButton = {
  padding: '6px 12px',
  fontSize: 12,
  fontWeight: 600,
  color: theme.color.ink,
  background: theme.color.background,
  border: `1px solid ${theme.color.border}`,
  borderRadius: 4,
  cursor: 'pointer',
  fontFamily: theme.font.body,
};
