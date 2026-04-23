import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Home      from './pages/Home';
import Courses   from './pages/Courses';
import Login     from './pages/Login';
import Register  from './pages/Register';
import Dashboard from './pages/Dashboard';

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
          <Navbar />
          <Routes>
            <Route path="/"          element={<Home />} />
            <Route path="/courses"   element={<Courses />} />
            <Route path="/login"     element={<Login />} />
            <Route path="/register"  element={<Register />} />

            {/* Protected */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/*"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* 404 */}
            <Route path="*" element={
              <div style={{ textAlign: 'center', padding: '8rem 2rem' }}>
                <p style={{ fontSize: '5rem' }}>🔍</p>
                <h2 style={{ fontWeight: 800, color: 'white', fontSize: '2rem', marginBottom: '1rem' }}>Page Not Found</h2>
                <p style={{ color: 'var(--color-muted)', marginBottom: '2rem' }}>The page you're looking for doesn't exist.</p>
                <a href="/" className="btn-primary" style={{ textDecoration: 'none' }}>← Back to Home</a>
              </div>
            } />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
