import { useEffect, useState, useMemo } from 'react';
import { getAllCourses } from '../services/courseService';
import CourseCard from '../components/CourseCard';
import Loader from '../components/Loader';

const LEVELS = ['All', 'Beginner', 'Intermediate', 'Advanced'];

const Courses = () => {
  const [courses, setCourses]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [search, setSearch]       = useState('');
  const [selectedLevel, setLevel] = useState('All');
  const [selectedCat, setCat]     = useState('All');

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchCourses = async () => {
      try {
        const data = await getAllCourses();
        setCourses(data);
      } catch {
        setError('Failed to load courses. Please make sure the backend server is running.');
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Derive unique categories from fetched courses
  const categories = useMemo(() => {
    const cats = [...new Set(courses.map((c) => c.category).filter(Boolean))];
    return ['All', ...cats];
  }, [courses]);

  // Apply search + level + category filters
  const filtered = useMemo(() => {
    return courses.filter((c) => {
      const matchSearch =
        !search ||
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.description?.toLowerCase().includes(search.toLowerCase()) ||
        c.category?.toLowerCase().includes(search.toLowerCase());
      const matchLevel = selectedLevel === 'All' || c.level === selectedLevel;
      const matchCat   = selectedCat   === 'All' || c.category === selectedCat;
      return matchSearch && matchLevel && matchCat;
    });
  }, [courses, search, selectedLevel, selectedCat]);

  const clearFilters = () => {
    setSearch('');
    setLevel('All');
    setCat('All');
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '3rem 1.5rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontWeight: 800, fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', color: 'white', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
          Explore <span className="gradient-text">All Courses</span>
        </h1>
        <p style={{ color: 'var(--color-muted)' }}>
          {loading ? 'Loading courses...' : `${courses.length} courses available`}
        </p>
      </div>

      {/* Search + Filters */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: '1 1 280px', minWidth: '180px' }}>
          <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted)', pointerEvents: 'none' }}>🔍</span>
          <input
            id="course-search"
            className="input-field"
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>

        {/* Level Filter */}
        <select
          id="level-filter"
          value={selectedLevel}
          onChange={(e) => setLevel(e.target.value)}
          className="input-field"
          style={{ flex: '0 1 160px', cursor: 'pointer' }}
        >
          {LEVELS.map((l) => <option key={l} value={l}>{l === 'All' ? 'All Levels' : l}</option>)}
        </select>

        {/* Category Filter */}
        <select
          id="category-filter"
          value={selectedCat}
          onChange={(e) => setCat(e.target.value)}
          className="input-field"
          style={{ flex: '0 1 180px', cursor: 'pointer' }}
        >
          {categories.map((c) => <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>)}
        </select>

        {/* Clear */}
        {(search || selectedLevel !== 'All' || selectedCat !== 'All') && (
          <button
            id="clear-filters-btn"
            onClick={clearFilters}
            style={{
              background: 'rgba(239,68,68,0.1)', color: '#ef4444',
              border: '1px solid rgba(239,68,68,0.3)', borderRadius: '0.75rem',
              padding: '0 1.25rem', cursor: 'pointer', fontWeight: 500,
              fontSize: '0.88rem', whiteSpace: 'nowrap',
              transition: 'all 0.2s ease',
            }}
          >
            ✕ Clear
          </button>
        )}
      </div>

      {/* Active filter pills */}
      {(selectedLevel !== 'All' || selectedCat !== 'All') && (
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          {selectedLevel !== 'All' && (
            <span style={{ background: 'rgba(99,102,241,0.15)', color: '#818cf8', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.78rem', fontWeight: 600 }}>
              Level: {selectedLevel}
            </span>
          )}
          {selectedCat !== 'All' && (
            <span style={{ background: 'rgba(139,92,246,0.15)', color: '#a78bfa', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.78rem', fontWeight: 600 }}>
              Category: {selectedCat}
            </span>
          )}
        </div>
      )}

      {/* States */}
      {loading && <Loader message="Fetching courses from server..." />}

      {error && !loading && (
        <div style={{
          textAlign: 'center', padding: '5rem 2rem',
          background: 'var(--color-surface)', borderRadius: '1.25rem',
          border: '1px solid rgba(239,68,68,0.2)',
        }}>
          <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</p>
          <h3 style={{ color: '#ef4444', fontWeight: 700, marginBottom: '0.5rem' }}>Connection Error</h3>
          <p style={{ color: 'var(--color-muted)', lineHeight: 1.7 }}>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary"
            style={{ marginTop: '1.5rem' }}
          >
            Try Again
          </button>
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div style={{
          textAlign: 'center', padding: '5rem 2rem',
          background: 'var(--color-surface)', borderRadius: '1.25rem',
          border: '1px solid var(--color-border)',
        }}>
          <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</p>
          <h3 style={{ color: 'white', fontWeight: 700, marginBottom: '0.5rem' }}>No courses found</h3>
          <p style={{ color: 'var(--color-muted)', marginBottom: '1.5rem' }}>
            {courses.length === 0 ? 'No courses have been added yet.' : 'Try adjusting your search or filters.'}
          </p>
          {(search || selectedLevel !== 'All' || selectedCat !== 'All') && (
            <button onClick={clearFilters} className="btn-outline">Clear Filters</button>
          )}
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <>
          <p style={{ color: 'var(--color-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
            Showing <strong style={{ color: 'white' }}>{filtered.length}</strong> of {courses.length} courses
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {filtered.map((course, i) => (
              <CourseCard key={course._id} course={course} index={i} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Courses;
