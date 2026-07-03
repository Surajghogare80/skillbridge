import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import { Toaster } from 'react-hot-toast';

import Home      from './pages/Home';
import Courses   from './pages/Courses';
import Login     from './pages/Login';
import Register  from './pages/Register';
import Dashboard from './pages/Dashboard';
import ForgotPassword from './pages/ForgotPassword';

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
          <Navbar />
          <Toaster 
            position="top-center"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1c1c2e',
                color: '#fff',
                border: '1px solid rgba(99, 102, 241, 0.2)',
              },
            }}
          />
          <Routes>
            <Route path="/"          element={<Home />} />
            <Route path="/courses"   element={<Courses />} />
            <Route path="/login"     element={<Login />} />
            <Route path="/register"  element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

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
