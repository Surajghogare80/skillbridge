import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [showPass, setShowPass] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim())     e.name = 'Full name is required';
    else if (form.name.trim().length < 2) e.name = 'Name must be at least 2 characters';

    if (!form.email)           e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email address';

    if (!form.password)        e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Password must be at least 6 characters';

    if (!form.confirmPassword) e.confirmPassword = 'Please confirm your password';
    else if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';

    return e;
  };

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    if (errors[field]) setErrors((err) => ({ ...err, [field]: '' }));
    setApiError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return; }
    setLoading(true);
    try {
      await register(form.name.trim(), form.email, form.password);
      navigate('/login', { state: { message: 'Account created! Please log in.' } });
    } catch (err) {
      setApiError(err.userMessage || err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Password strength indicator
  const getStrength = (p) => {
    if (!p) return { width: '0%', color: 'transparent', label: '' };
    if (p.length < 6)  return { width: '25%', color: '#ef4444', label: 'Weak' };
    if (p.length < 10) return { width: '55%', color: '#eab308', label: 'Fair' };
    if (/[A-Z]/.test(p) && /[0-9]/.test(p)) return { width: '100%', color: '#22c55e', label: 'Strong' };
    return { width: '75%', color: '#22d3ee', label: 'Good' };
  };
  const strength = getStrength(form.password);

  const fields = [
    { id: 'register-name',  label: 'Full Name',       field: 'name',  type: 'text',  placeholder: 'John Doe',         autoComplete: 'name' },
    { id: 'register-email', label: 'Email Address',   field: 'email', type: 'email', placeholder: 'you@example.com',  autoComplete: 'email' },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1.5rem', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '-15%', left: '-10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(34,211,238,0.08) 0%, transparent 70%)', borderRadius: '50%' }} />
      </div>

      <div className="animate-fade-in-up" style={{ width: '100%', maxWidth: '460px', position: 'relative' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: 'white', fontSize: '1.2rem' }}>S</div>
            <span style={{ fontWeight: 800, fontSize: '1.4rem', color: 'white' }}>Skill<span className="gradient-text">Bridge</span></span>
          </Link>
        </div>

        {/* Card */}
        <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '1.25rem', padding: '2.5rem' }}>
          <h2 style={{ fontWeight: 800, fontSize: '1.6rem', color: 'white', marginBottom: '0.4rem', letterSpacing: '-0.02em' }}>Create your account ✨</h2>
          <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>Start your free learning journey today</p>

          {apiError && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '0.75rem', padding: '0.875rem 1rem', color: '#ef4444', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
              ⚠️ {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Name + Email */}
            {fields.map(({ id, label, field, type, placeholder, autoComplete }) => (
              <div key={field} style={{ marginBottom: '1.25rem' }}>
                <label htmlFor={id} style={{ display: 'block', color: 'var(--color-text)', fontSize: '0.88rem', fontWeight: 500, marginBottom: '0.5rem' }}>{label}</label>
                <input
                  id={id}
                  type={type}
                  className="input-field"
                  placeholder={placeholder}
                  value={form[field]}
                  onChange={handleChange(field)}
                  style={{ borderColor: errors[field] ? '#ef4444' : undefined }}
                  autoComplete={autoComplete}
                />
                {errors[field] && <p style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '0.35rem' }}>{errors[field]}</p>}
              </div>
            ))}

            {/* Password */}
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="register-password" style={{ display: 'block', color: 'var(--color-text)', fontSize: '0.88rem', fontWeight: 500, marginBottom: '0.5rem' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="register-password"
                  type={showPass ? 'text' : 'password'}
                  className="input-field"
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={handleChange('password')}
                  style={{ borderColor: errors.password ? '#ef4444' : undefined, paddingRight: '3rem' }}
                  autoComplete="new-password"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-muted)', fontSize: '1.1rem' }}>
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
              {/* Strength bar */}
              {form.password && (
                <div style={{ marginTop: '0.5rem' }}>
                  <div className="progress-bar">
                    <div style={{ width: strength.width, height: '100%', background: strength.color, borderRadius: '9999px', transition: 'width 0.4s ease, background 0.3s' }} />
                  </div>
                  <p style={{ color: strength.color, fontSize: '0.75rem', marginTop: '0.25rem', fontWeight: 500 }}>{strength.label}</p>
                </div>
              )}
              {errors.password && <p style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '0.35rem' }}>{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div style={{ marginBottom: '1.75rem' }}>
              <label htmlFor="register-confirm" style={{ display: 'block', color: 'var(--color-text)', fontSize: '0.88rem', fontWeight: 500, marginBottom: '0.5rem' }}>Confirm Password</label>
              <input
                id="register-confirm"
                type="password"
                className="input-field"
                placeholder="Repeat your password"
                value={form.confirmPassword}
                onChange={handleChange('confirmPassword')}
                style={{ borderColor: errors.confirmPassword ? '#ef4444' : undefined }}
                autoComplete="new-password"
              />
              {errors.confirmPassword && <p style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '0.35rem' }}>{errors.confirmPassword}</p>}
            </div>

            <button
              id="register-submit-btn"
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{ width: '100%', justifyContent: 'center', fontSize: '1rem', opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
            >
              {loading ? '⏳ Creating account...' : '🚀 Create Account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--color-muted)', fontSize: '0.88rem' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#818cf8', fontWeight: 600, textDecoration: 'none' }}>Login →</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
