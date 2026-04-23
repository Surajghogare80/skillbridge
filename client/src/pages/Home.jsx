import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllCourses } from '../services/courseService';
import CourseCard from '../components/CourseCard';
import Loader from '../components/Loader';

const stats = [
  { icon: '🎓', value: '10,000+', label: 'Active Students' },
  { icon: '📚', value: '50+',     label: 'Expert Courses' },
  { icon: '🏆', value: '95%',     label: 'Placement Rate' },
  { icon: '⭐', value: '4.9/5',   label: 'Average Rating' },
];

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getAllCourses();
        setCourses(data.slice(0, 6)); // Show first 6 as featured
      } catch {
        setError('Could not load courses. Is the server running?');
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div>
      {/* ── Hero Section ── */}
      <section style={{
        position: 'relative', overflow: 'hidden',
        minHeight: '88vh', display: 'flex', alignItems: 'center',
        padding: '5rem 1.5rem',
      }}>
        {/* Background orbs */}
        <div style={{
          position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 0, pointerEvents: 'none',
        }}>
          <div style={{
            position: 'absolute', top: '-20%', left: '-10%',
            width: '600px', height: '600px',
            background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
            borderRadius: '50%',
          }} />
          <div style={{
            position: 'absolute', bottom: '-15%', right: '-5%',
            width: '500px', height: '500px',
            background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)',
            borderRadius: '50%',
          }} />
          <div style={{
            position: 'absolute', top: '40%', right: '20%',
            width: '300px', height: '300px',
            background: 'radial-gradient(circle, rgba(34,211,238,0.08) 0%, transparent 70%)',
            borderRadius: '50%',
          }} />
        </div>

        <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 1, width: '100%' }}>
          <div style={{ maxWidth: '720px' }}>
            {/* Badge */}
            <div className="animate-fade-in-up" style={{ marginBottom: '1.5rem' }}>
              <span style={{
                background: 'rgba(99,102,241,0.15)', color: '#818cf8',
                padding: '0.4rem 1rem', borderRadius: '9999px',
                fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.05em',
                border: '1px solid rgba(99,102,241,0.3)',
              }}>
                🚀 The #1 Fresher Training Platform
              </span>
            </div>

            {/* Headline */}
            <h1 className="animate-fade-in-up stagger-1" style={{
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
              fontWeight: 900, lineHeight: 1.1,
              color: 'white', marginBottom: '1.5rem',
              letterSpacing: '-0.03em',
            }}>
              Bridge the Gap.<br />
              <span className="gradient-text">Launch Your Career.</span>
            </h1>

            {/* Tagline */}
            <p className="animate-fade-in-up stagger-2" style={{
              fontSize: '1.15rem', color: 'var(--color-muted)',
              lineHeight: 1.7, marginBottom: '2.5rem', maxWidth: '560px',
            }}>
              SkillBridge offers industry-ready YouTube-based courses designed specifically for freshers — learn at your own pace, get hired faster.
            </p>

            {/* CTAs */}
            <div className="animate-fade-in-up stagger-3" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/courses" className="btn-primary" id="hero-browse-btn" style={{ fontSize: '1rem', padding: '0.9rem 2rem', textDecoration: 'none' }}>
                Browse Courses →
              </Link>
              <Link to="/register" className="btn-outline" id="hero-signup-btn" style={{ fontSize: '1rem', padding: '0.9rem 2rem', textDecoration: 'none' }}>
                Create Free Account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section style={{ background: 'var(--color-surface)', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '2rem', textAlign: 'center' }}>
            {stats.map((stat, i) => (
              <div key={i} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s`, opacity: 0, animationFillMode: 'forwards' }}>
                <p style={{ fontSize: '1.8rem', marginBottom: '0.25rem' }}>{stat.icon}</p>
                <p style={{ fontWeight: 800, fontSize: '1.5rem', color: 'white', letterSpacing: '-0.02em' }}>{stat.value}</p>
                <p style={{ color: 'var(--color-muted)', fontSize: '0.82rem', marginTop: '0.2rem' }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Courses ── */}
      <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '5rem 1.5rem' }}>
        <div style={{ marginBottom: '3rem' }}>
          <span style={{
            background: 'rgba(99,102,241,0.15)', color: '#818cf8',
            padding: '0.3rem 0.85rem', borderRadius: '9999px',
            fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em',
            border: '1px solid rgba(99,102,241,0.25)',
          }}>FEATURED</span>
          <h2 style={{ fontWeight: 800, fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', color: 'white', marginTop: '0.75rem', letterSpacing: '-0.02em' }}>
            Top Courses for Freshers
          </h2>
          <p style={{ color: 'var(--color-muted)', marginTop: '0.5rem', fontSize: '1rem' }}>
            Curated learning paths to get you job-ready
          </p>
        </div>

        {loading && <Loader message="Loading courses..." />}

        {error && (
          <div style={{
            textAlign: 'center', padding: '4rem 2rem',
            background: 'var(--color-surface)', borderRadius: '1rem',
            border: '1px solid rgba(239,68,68,0.2)',
          }}>
            <p style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>⚠️</p>
            <p style={{ color: '#ef4444', fontWeight: 600, marginBottom: '0.5rem' }}>{error}</p>
            <p style={{ color: 'var(--color-muted)', fontSize: '0.85rem' }}>Make sure the backend is running on port 5000</p>
          </div>
        )}

        {!loading && !error && courses.length === 0 && (
          <div style={{ textAlign: 'center', padding: '5rem 2rem' }}>
            <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</p>
            <h3 style={{ color: 'white', fontWeight: 700, marginBottom: '0.5rem' }}>No courses yet</h3>
            <p style={{ color: 'var(--color-muted)' }}>Courses will appear here once added to the database.</p>
          </div>
        )}

        {!loading && !error && courses.length > 0 && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {courses.map((course, i) => (
                <CourseCard key={course._id} course={course} index={i} />
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: '3rem' }}>
              <Link to="/courses" className="btn-outline" id="view-all-courses-btn" style={{ textDecoration: 'none', fontSize: '0.95rem' }}>
                View All Courses →
              </Link>
            </div>
          </>
        )}
      </section>

      {/* ── Why SkillBridge ── */}
      <section style={{ background: 'var(--color-surface)', borderTop: '1px solid var(--color-border)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '5rem 1.5rem' }}>
          <h2 style={{ fontWeight: 800, fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', color: 'white', textAlign: 'center', marginBottom: '3rem', letterSpacing: '-0.02em' }}>
            Why Choose <span className="gradient-text">SkillBridge?</span>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
            {[
              { icon: '🎯', title: 'Fresher-Focused', desc: 'Every course is designed specifically for beginners entering the job market.' },
              { icon: '📹', title: 'YouTube-Powered', desc: 'Learn from the best free YouTube content, curated and organized for you.' },
              { icon: '🆓', title: 'Completely Free', desc: 'No paywalls. No subscriptions. Quality education for everyone.' },
              { icon: '📈', title: 'Track Progress', desc: 'Monitor your learning journey and stay on track with your goals.' },
            ].map((item, i) => (
              <div
                key={i}
                className="card-hover"
                style={{
                  background: 'var(--color-surface-2)', padding: '1.75rem',
                  borderRadius: '1rem', border: '1px solid var(--color-border)',
                  textAlign: 'center',
                }}
              >
                <p style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{item.icon}</p>
                <h3 style={{ fontWeight: 700, color: 'white', marginBottom: '0.5rem' }}>{item.title}</h3>
                <p style={{ color: 'var(--color-muted)', fontSize: '0.88rem', lineHeight: 1.65 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '4rem 1.5rem 6rem' }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2))',
          border: '1px solid rgba(99,102,241,0.3)',
          borderRadius: '1.5rem', padding: '3.5rem 2rem',
          textAlign: 'center',
        }}>
          <h2 style={{ fontWeight: 800, fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', color: 'white', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
            Ready to Start Learning?
          </h2>
          <p style={{ color: 'var(--color-muted)', marginBottom: '2rem', maxWidth: '480px', margin: '0 auto 2rem', lineHeight: 1.7 }}>
            Join thousands of freshers who are already building their skills on SkillBridge.
          </p>
          <Link to="/register" className="btn-primary" id="cta-register-btn" style={{ fontSize: '1rem', padding: '0.9rem 2.5rem', textDecoration: 'none' }}>
            Get Started for Free 🚀
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
