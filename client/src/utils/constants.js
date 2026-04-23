// Central place for all app constants
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const LEVEL_COLORS = {
  Beginner:     { bg: 'rgba(34, 197, 94, 0.15)',  text: '#22c55e' },
  Intermediate: { bg: 'rgba(234, 179, 8, 0.15)',  text: '#eab308' },
  Advanced:     { bg: 'rgba(239, 68, 68, 0.15)',  text: '#ef4444' },
};

export const CATEGORY_COLORS = [
  { bg: 'rgba(99, 102, 241, 0.15)',  text: '#818cf8' },
  { bg: 'rgba(139, 92, 246, 0.15)', text: '#a78bfa' },
  { bg: 'rgba(34, 211, 238, 0.15)', text: '#22d3ee' },
  { bg: 'rgba(249, 115, 22, 0.15)', text: '#fb923c' },
  { bg: 'rgba(236, 72, 153, 0.15)', text: '#f472b6' },
];

export const NAV_LINKS = [
  { label: 'Home',     path: '/' },
  { label: 'Courses',  path: '/courses' },
  { label: 'Dashboard', path: '/dashboard' },
];
