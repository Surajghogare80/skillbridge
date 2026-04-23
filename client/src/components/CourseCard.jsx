import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { enrollInCourse } from '../services/authService';
import useAuth from '../hooks/useAuth';
import { LEVEL_COLORS, CATEGORY_COLORS } from '../utils/constants';

// Extract YouTube video ID from various URL formats
const getYouTubeThumbnail = (url) => {
  if (!url) return null;
  const regexes = [
    /youtu\.be\/([^?&]+)/,
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtube\.com\/embed\/([^?&]+)/,
  ];
  for (const re of regexes) {
    const match = url.match(re);
    if (match) return `https://img.youtube.com/vi/${match[1]}/mqdefault.jpg`;
  }
  return null;
};

// Deterministic color from category string
const getCategoryColor = (category) => {
  let hash = 0;
  for (let i = 0; i < (category || '').length; i++) hash = category.charCodeAt(i) + hash * 31;
  return CATEGORY_COLORS[Math.abs(hash) % CATEGORY_COLORS.length];
};

const CourseCard = ({ course, onEnrolled, index = 0, enrolled = false }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [enrolling, setEnrolling] = useState(false);
  const [enrollError, setEnrollError] = useState('');
  const [enrollSuccess, setEnrollSuccess] = useState(enrolled);

  const thumbnail = getYouTubeThumbnail(course.youTubeLink);
  const levelColor = LEVEL_COLORS[course.level] || LEVEL_COLORS.Beginner;
  const catColor = getCategoryColor(course.category);

  const handleEnroll = async (e) => {
    e.stopPropagation();
    if (!isAuthenticated) { navigate('/login'); return; }
    if (enrollSuccess) return;
    setEnrolling(true);
    setEnrollError('');
    try {
      await enrollInCourse(course._id);
      setEnrollSuccess(true);
      if (onEnrolled) onEnrolled(course._id);
    } catch (err) {
      const msg = err.userMessage || err.response?.data?.message || 'Enrollment failed';
      if (msg === 'Already enrolled') {
        setEnrollSuccess(true);
      } else {
        setEnrollError(msg);
      }
    } finally {
      setEnrolling(false);
    }
  };

  return (
    <div
      className="card-hover animate-fade-in-up"
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: '1rem',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        animationDelay: `${index * 0.08}s`,
        opacity: 0,
        animationFillMode: 'forwards',
      }}
    >
      {/* Thumbnail */}
      <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%', overflow: 'hidden', background: 'var(--color-surface-2)' }}>
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={course.title}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          />
        ) : (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(135deg, rgba(99,102,241,0.3), rgba(139,92,246,0.3))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '3rem',
          }}>🎓</div>
        )}
        {/* Level badge overlay */}
        <span style={{
          position: 'absolute', top: '0.6rem', right: '0.6rem',
          background: levelColor.bg, color: levelColor.text,
          padding: '0.2rem 0.65rem', borderRadius: '9999px',
          fontSize: '0.7rem', fontWeight: 700,
          backdropFilter: 'blur(8px)',
          border: `1px solid ${levelColor.text}30`,
        }}>
          {course.level}
        </span>
      </div>

      {/* Content */}
      <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {/* Category */}
        <span style={{
          display: 'inline-block', alignSelf: 'flex-start',
          background: catColor.bg, color: catColor.text,
          padding: '0.2rem 0.65rem', borderRadius: '9999px',
          fontSize: '0.72rem', fontWeight: 600,
        }}>
          {course.category}
        </span>

        {/* Title */}
        <h3 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--color-text)', lineHeight: 1.4, flex: 1 }}>
          {course.title}
        </h3>

        {/* Description */}
        {course.description && (
          <p style={{
            color: 'var(--color-muted)', fontSize: '0.82rem',
            lineHeight: 1.6,
            display: '-webkit-box', WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {course.description}
          </p>
        )}

        {/* Duration */}
        {course.duration && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-muted)', fontSize: '0.82rem' }}>
            <span>⏱</span> {course.duration}
          </div>
        )}

        {/* Error */}
        {enrollError && (
          <p style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '-0.25rem' }}>{enrollError}</p>
        )}

        {/* Enroll button */}
        <button
          id={`enroll-btn-${course._id}`}
          onClick={handleEnroll}
          disabled={enrolling || enrollSuccess}
          className="btn-primary"
          style={{
            marginTop: 'auto', width: '100%', justifyContent: 'center',
            background: enrollSuccess
              ? 'linear-gradient(135deg, #22c55e, #16a34a)'
              : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            opacity: enrolling ? 0.7 : 1,
            cursor: enrolling ? 'not-allowed' : 'pointer',
          }}
        >
          {enrolling ? '⏳ Enrolling...' : enrollSuccess ? '✓ Enrolled' : isAuthenticated ? '🚀 Enroll Now' : '🔐 Login to Enroll'}
        </button>
      </div>
    </div>
  );
};

export default CourseCard;
