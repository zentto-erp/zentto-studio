// @zentto/studio-core — Theme presets for landing pages
// 8 color scheme presets that users can apply to any landing template

import type { AppConfig } from '../app-types.js';

export interface ThemePreset {
  id: string;
  name: string;
  primary: string;
  primaryHover: string;
  primaryLight: string;
  accent: string;
  bg: string;
  bgAlt: string;
  text: string;
  textSecondary: string;
  headingFontFamily?: string;
  bodyFontFamily?: string;
}

export const THEME_PRESETS: ThemePreset[] = [
  { id: 'indigo', name: 'Indigo', primary: '#6366f1', primaryHover: '#4f46e5', primaryLight: '#e0e7ff', accent: '#06b6d4', bg: '#ffffff', bgAlt: '#f8fafc', text: '#1e293b', textSecondary: '#64748b' },
  { id: 'emerald', name: 'Emerald', primary: '#10b981', primaryHover: '#059669', primaryLight: '#d1fae5', accent: '#f59e0b', bg: '#ffffff', bgAlt: '#f0fdf4', text: '#1e293b', textSecondary: '#64748b' },
  { id: 'rose', name: 'Rose', primary: '#f43f5e', primaryHover: '#e11d48', primaryLight: '#ffe4e6', accent: '#8b5cf6', bg: '#ffffff', bgAlt: '#fff1f2', text: '#1e293b', textSecondary: '#64748b' },
  { id: 'amber', name: 'Amber', primary: '#f59e0b', primaryHover: '#d97706', primaryLight: '#fef3c7', accent: '#3b82f6', bg: '#ffffff', bgAlt: '#fffbeb', text: '#1e293b', textSecondary: '#64748b' },
  { id: 'ocean', name: 'Ocean', primary: '#0ea5e9', primaryHover: '#0284c7', primaryLight: '#e0f2fe', accent: '#ec4899', bg: '#ffffff', bgAlt: '#f0f9ff', text: '#0f172a', textSecondary: '#475569' },
  { id: 'slate', name: 'Slate', primary: '#475569', primaryHover: '#334155', primaryLight: '#f1f5f9', accent: '#f97316', bg: '#ffffff', bgAlt: '#f8fafc', text: '#0f172a', textSecondary: '#64748b' },
  { id: 'midnight', name: 'Midnight', primary: '#818cf8', primaryHover: '#6366f1', primaryLight: '#312e81', accent: '#34d399', bg: '#0f172a', bgAlt: '#1e293b', text: '#f1f5f9', textSecondary: '#94a3b8', headingFontFamily: "'Inter', sans-serif" },
  { id: 'sunset', name: 'Sunset', primary: '#fb923c', primaryHover: '#f97316', primaryLight: '#fff7ed', accent: '#a855f7', bg: '#ffffff', bgAlt: '#fffbeb', text: '#1c1917', textSecondary: '#78716c' },
];

export function getThemePreset(id: string): ThemePreset | undefined {
  return THEME_PRESETS.find(p => p.id === id);
}

export function applyThemePresetToConfig(config: AppConfig, preset: ThemePreset): AppConfig {
  const clone = structuredClone(config);
  clone.theme = {
    ...clone.theme,
    primaryColor: preset.primary,
    tokens: {
      '--zl-primary': preset.primary,
      '--zl-primary-hover': preset.primaryHover,
      '--zl-primary-light': preset.primaryLight,
      '--zl-accent': preset.accent,
      '--zl-bg': preset.bg,
      '--zl-bg-alt': preset.bgAlt,
      '--zl-text': preset.text,
      '--zl-text-secondary': preset.textSecondary,
      ...(preset.headingFontFamily ? { '--zl-heading-font-family': preset.headingFontFamily } : {}),
      ...(preset.bodyFontFamily ? { '--zl-font-family': preset.bodyFontFamily } : {}),
    },
  };
  return clone;
}
