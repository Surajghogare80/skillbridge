// Full-page loading spinner shown during auth init or data fetching
const Loader = ({ fullPage = false, message = 'Loading...' }) => {
  if (fullPage) {
    return (
      <div
        style={{
          position: 'fixed', inset: 0,
          background: 'var(--color-bg)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          gap: '1rem', zIndex: 9999,
        }}
      >
        <div className="spinner" />
        <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem' }}>{message}</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem', gap: '1rem' }}>
      <div className="spinner" />
      <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem' }}>{message}</p>
    </div>
  );
};

export default Loader;
