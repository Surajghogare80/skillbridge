import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { NAV_LINKS } from '../utils/constants';

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const userInitial = user?.name ? user.name[0].toUpperCase() : 'U';
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Add blur/shadow on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <nav
      className="glass"
      style={{
        position: 'sticky', top: 0, zIndex: 100,
        transition: 'box-shadow 0.3s ease',
        boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.4)' : 'none',
      }}
    >
      <div style={{
        maxWidth: '1280px', margin: '0 auto',
        padding: '0 1.5rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: '64px',
      }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            width: '34px', height: '34px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1rem', fontWeight: '800', color: 'white',
          }}>S</div>
          <span style={{ fontWeight: '800', fontSize: '1.2rem', color: 'white', letterSpacing: '-0.02em' }}>
            Skill<span className="gradient-text">Bridge</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }} className="hidden-mobile">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              style={({ isActive }) => ({
                color: isActive ? '#6366f1' : 'var(--color-muted)',
                textDecoration: 'none',
                fontWeight: 500,
                fontSize: '0.9rem',
                padding: '0.4rem 0.9rem',
                borderRadius: '0.5rem',
                transition: 'all 0.2s ease',
                background: isActive ? 'rgba(99,102,241,0.1)' : 'transparent',
              })}
              onMouseEnter={(e) => { if (!e.currentTarget.className.includes('active')) e.currentTarget.style.color = '#e2e8f0'; }}
              onMouseLeave={(e) => { if (!e.currentTarget.className.includes('active')) e.currentTarget.style.color = 'var(--color-muted)'; }}
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* Auth buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }} className="hidden-mobile">
          {isAuthenticated ? (
            <>
              <div
                title={user?.name || 'User'}
                style={{
                  width: '36px', height: '36px',
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.85rem', color: 'white', fontWeight: 700,
                  cursor: 'default',
                }}
              >{userInitial}</div>
              <button
                id="logout-btn"
                onClick={handleLogout}
                className="btn-outline"
                style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-outline" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', textDecoration:'none' }}>
                Login
              </Link>
              <Link to="/register" className="btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', textDecoration:'none' }}>
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Hamburger for mobile */}
        <button
          id="mobile-menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            display: 'none', flexDirection: 'column', gap: '5px', padding: '4px',
          }}
          className="show-mobile"
          aria-label="Toggle menu"
        >
          {[0,1,2].map((i) => (
            <span key={i} style={{
              display: 'block', width: '22px', height: '2px',
              background: 'var(--color-text)',
              borderRadius: '2px',
              transition: 'all 0.3s ease',
              transform: menuOpen && i === 0 ? 'rotate(45deg) translate(5px, 5px)' :
                         menuOpen && i === 1 ? 'scaleX(0)' :
                         menuOpen && i === 2 ? 'rotate(-45deg) translate(5px, -5px)' : 'none',
            }} />
          ))}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{
          background: 'var(--color-surface)',
          borderTop: '1px solid var(--color-border)',
          padding: '1rem 1.5rem',
          display: 'flex', flexDirection: 'column', gap: '0.5rem',
        }}>
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setMenuOpen(false)}
              style={({ isActive }) => ({
                color: isActive ? '#6366f1' : 'var(--color-text)',
                textDecoration: 'none',
                fontWeight: 500,
                padding: '0.6rem 0.75rem',
                borderRadius: '0.5rem',
                background: isActive ? 'rgba(99,102,241,0.1)' : 'transparent',
              })}
            >
              {link.label}
            </NavLink>
          ))}
          <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '0.75rem', display: 'flex', gap: '0.75rem' }}>
            {isAuthenticated ? (
              <button onClick={handleLogout} className="btn-outline" style={{ flex: 1, textAlign: 'center' }}>Logout</button>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)} className="btn-outline" style={{ flex: 1, textAlign: 'center', textDecoration: 'none' }}>Login</Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="btn-primary" style={{ flex: 1, textAlign: 'center', textDecoration: 'none' }}>Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}

      {/* Responsive helpers inline */}
      <style>{`
        @media (min-width: 768px) { .show-mobile { display: none !important; } }
        @media (max-width: 767px) { .hidden-mobile { display: none !important; } .show-mobile { display: flex !important; } }
      `}</style>
    </nav>
  );
};

export default Navbar;
