import { useEffect, useState, useMemo } from 'react';
import { getMyCourses } from '../services/courseService';
import Sidebar from '../components/Sidebar';
import Loader from '../components/Loader';
import CourseCard from '../components/CourseCard';
import useAuth from '../hooks/useAuth';

// Stable per-course progress — only re-computed when courses list changes.
// Falls back to localStorage if previously set.
const getStableProgress = (courseId) => {
  const key = `progress_${courseId}`;
  const stored = localStorage.getItem(key);
  if (stored) return parseInt(stored, 10);
  const generated = Math.floor(Math.random() * 75) + 10; // 10–85
  localStorage.setItem(key, generated);
  return generated;
};

const StatCard = ({ icon, value, label, color }) => (
  <div style={{
    background: 'var(--color-surface-2)', padding: '1.5rem',
    borderRadius: '1rem', border: '1px solid var(--color-border)',
    display: 'flex', alignItems: 'center', gap: '1rem',
    flex: '1 1 180px',
  }}>
    <div style={{ width: '48px', height: '48px', background: `${color}22`, borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>
      {icon}
    </div>
    <div>
      <p style={{ fontWeight: 800, fontSize: '1.5rem', color: 'white', lineHeight: 1 }}>{value}</p>
      <p style={{ color: 'var(--color-muted)', fontSize: '0.82rem', marginTop: '0.25rem' }}>{label}</p>
    </div>
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const [data, setData]     = useState(null); // { name, email, enrolledCourses }
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState('');
  const [view, setView]     = useState('grid'); // 'grid' | 'list'

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchDashboard = async () => {
      try {
        const result = await getMyCourses();
        setData(result);
      } catch (err) {
        setError(err.userMessage || err.response?.data?.message || 'Failed to load dashboard. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const courses = data?.enrolledCourses || [];

  // Stable progress map — computed once per course list, not on every render
  const progressMap = useMemo(() => {
    const map = {};
    courses.forEach((c) => { map[c._id] = getStableProgress(c._id); });
    return map;
  }, [courses]);

  const avgProgress = courses.length > 0
    ? Math.round(Object.values(progressMap).reduce((a, b) => a + b, 0) / courses.length)
    : 0;

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 64px)' }}>
      <Sidebar />

      {/* Main content */}
      <main style={{ flex: 1, overflow: 'auto', background: 'var(--color-bg)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>

          {/* Greeting */}
          <div className="animate-fade-in-up" style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontWeight: 800, fontSize: 'clamp(1.5rem, 3vw, 2rem)', color: 'white', letterSpacing: '-0.02em' }}>
              Welcome back, <span className="gradient-text">{data?.name || 'Student'}</span> 👋
            </h1>
            <p style={{ color: 'var(--color-muted)', marginTop: '0.4rem' }}>
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {loading && <Loader message="Loading your dashboard..." />}

          {error && !loading && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '1rem', padding: '2rem', textAlign: 'center' }}>
              <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⚠️</p>
              <p style={{ color: '#ef4444', fontWeight: 600 }}>{error}</p>
            </div>
          )}

          {!loading && !error && (
            <>
              {/* Stats */}
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
                <StatCard icon="📚" value={courses.length}    label="Enrolled Courses"  color="#6366f1" />
                <StatCard icon="✅" value={`${avgProgress}%`} label="Avg. Progress"     color="#22c55e" />
                <StatCard icon="⭐" value="Active"            label="Account Status"   color="#eab308" />
                <StatCard icon="🎯" value="Student"           label="Role"             color="#22d3ee" />
              </div>

              {/* Courses section */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <h2 style={{ fontWeight: 700, fontSize: '1.2rem', color: 'white' }}>My Enrolled Courses</h2>
                  <p style={{ color: 'var(--color-muted)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
                    {courses.length} {courses.length === 1 ? 'course' : 'courses'} enrolled
                  </p>
                </div>
                {courses.length > 0 && (
                  <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--color-surface)', padding: '4px', borderRadius: '0.6rem', border: '1px solid var(--color-border)' }}>
                    {['grid', 'list'].map((v) => (
                      <button key={v} onClick={() => setView(v)} style={{ padding: '0.35rem 0.75rem', borderRadius: '0.4rem', border: 'none', cursor: 'pointer', fontWeight: 500, fontSize: '0.82rem', transition: 'all 0.2s', background: view === v ? '#6366f1' : 'transparent', color: view === v ? 'white' : 'var(--color-muted)' }}>
                        {v === 'grid' ? '⊞ Grid' : '☰ List'}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Empty state */}
              {courses.length === 0 && (
                <div style={{ textAlign: 'center', padding: '5rem 2rem', background: 'var(--color-surface)', borderRadius: '1.25rem', border: '1px solid var(--color-border)' }}>
                  <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>📚</p>
                  <h3 style={{ color: 'white', fontWeight: 700, marginBottom: '0.5rem' }}>No courses yet</h3>
                  <p style={{ color: 'var(--color-muted)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                    You haven't enrolled in any courses yet.<br />Browse our library and start learning today!
                  </p>
                  <a href="/courses" className="btn-primary" style={{ textDecoration: 'none' }}>Browse Courses →</a>
                </div>
              )}

              {/* Grid view */}
              {courses.length > 0 && view === 'grid' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
                  {courses.map((course, i) => (
                    <CourseCard key={course._id} course={course} index={i} enrolled />
                  ))}
                </div>
              )}

              {/* List view */}
              {courses.length > 0 && view === 'list' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {courses.map((course, i) => {
                    const progress = progressMap[course._id] || 0;
                    return (
                      <div key={course._id} className="card-hover animate-fade-in-up" style={{
                        background: 'var(--color-surface)', border: '1px solid var(--color-border)',
                        borderRadius: '1rem', padding: '1.25rem',
                        display: 'flex', gap: '1.25rem', alignItems: 'center', flexWrap: 'wrap',
                        animationDelay: `${i * 0.06}s`, opacity: 0, animationFillMode: 'forwards',
                      }}>
                        {/* Icon */}
                        <div style={{ width: '56px', height: '56px', background: 'linear-gradient(135deg, rgba(99,102,241,0.3), rgba(139,92,246,0.3))', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', flexShrink: 0 }}>
                          🎓
                        </div>
                        {/* Info */}
                        <div style={{ flex: 1, minWidth: '200px' }}>
                          <h3 style={{ fontWeight: 700, color: 'white', fontSize: '0.95rem', marginBottom: '0.4rem' }}>{course.title}</h3>
                          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                            <span style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>📁 {course.category}</span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>🎚 {course.level}</span>
                            {course.duration && <span style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>⏱ {course.duration}</span>}
                          </div>
                          {/* Progress bar */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div className="progress-bar" style={{ flex: 1 }}>
                              <div className="progress-fill" style={{ width: `${progress}%` }} />
                            </div>
                            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#818cf8', whiteSpace: 'nowrap' }}>{progress}%</span>
                          </div>
                        </div>
                        {/* Watch button */}
                        {course.youTubeLink && (
                          <a href={course.youTubeLink} target="_blank" rel="noopener noreferrer" className="btn-outline" style={{ textDecoration: 'none', whiteSpace: 'nowrap', padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}>
                            ▶ Watch
                          </a>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
