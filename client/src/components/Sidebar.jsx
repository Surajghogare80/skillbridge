import { NavLink, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const navItems = [
  { icon: '📊', label: 'Overview',    path: '/dashboard',          id: 'sidebar-overview' },
  { icon: '📚', label: 'My Courses',  path: '/dashboard/courses',  id: 'sidebar-courses' },
  { icon: '⚙️', label: 'Settings',    path: '/dashboard/settings', id: 'sidebar-settings' },
];

const Sidebar = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside style={{
      width: '240px', minHeight: '100%',
      background: 'var(--color-surface)',
      borderRight: '1px solid var(--color-border)',
      display: 'flex', flexDirection: 'column',
      flexShrink: 0,
    }}>
      {/* User info */}
      <div style={{
        padding: '1.5rem 1.25rem',
        borderBottom: '1px solid var(--color-border)',
        display: 'flex', alignItems: 'center', gap: '0.75rem',
      }}>
        <div style={{
          width: '44px', height: '44px',
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          borderRadius: '50%', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          fontSize: '1.25rem', color: 'white', fontWeight: 700,
          flexShrink: 0,
        }}>
          {user?.name ? user.name[0].toUpperCase() : 'U'}
        </div>
        <div style={{ minWidth: 0 }}>
          <p style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {user?.name || 'Student'}
          </p>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>Student</p>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--color-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0 0.5rem', marginBottom: '0.25rem' }}>
          MENU
        </p>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            id={item.id}
            end={item.path === '/dashboard'}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: '0.65rem 0.75rem', borderRadius: '0.6rem',
              textDecoration: 'none',
              fontWeight: isActive ? 600 : 400,
              fontSize: '0.88rem',
              color: isActive ? '#818cf8' : 'var(--color-muted)',
              background: isActive ? 'rgba(99,102,241,0.12)' : 'transparent',
              transition: 'all 0.2s ease',
              cursor: 'pointer',
            })}
            onMouseEnter={(e) => {
              if (!e.currentTarget.getAttribute('aria-current')) {
                e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                e.currentTarget.style.color = 'var(--color-text)';
              }
            }}
            onMouseLeave={(e) => {
              if (!e.currentTarget.getAttribute('aria-current')) {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'var(--color-muted)';
              }
            }}
          >
            <span style={{ fontSize: '1rem' }}>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div style={{ padding: '1rem 0.75rem', borderTop: '1px solid var(--color-border)' }}>
        <button
          id="sidebar-logout-btn"
          onClick={handleLogout}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem',
            padding: '0.65rem 0.75rem', borderRadius: '0.6rem',
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: '#ef4444', fontSize: '0.88rem', fontWeight: 500,
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
        >
          <span>🚪</span> Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
