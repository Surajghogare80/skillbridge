import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { auth, sendPasswordResetEmail } from '../firebase/firebase';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const { isAuthenticating, setIsAuthenticating } = useContext(AuthContext);
  const [isSent, setIsSent] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter your email");

    setIsAuthenticating(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setIsSent(true);
      toast.success("Password reset email sent!");
    } catch (error) {
      console.error(error);
      let message = "Failed to send reset email";
      if (error.code === 'auth/user-not-found') message = "No user found with this email";
      toast.error(message);
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full"></div>

      <div className={`w-full max-auto max-w-[450px] glass p-8 rounded-2xl shadow-2xl animate-fade-in-up ${isAuthenticating ? 'opacity-50 pointer-events-none' : ''}`}>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold mb-2">Reset Password</h1>
          <p className="text-gray-400">Enter your email to receive a reset link</p>
        </div>

        {!isSent ? (
          <form onSubmit={handleReset} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5 ml-1">Email Address</label>
              <input 
                type="email" 
                placeholder="name@example.com"
                className="input-field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button 
              type="submit" 
              className="btn-primary w-full justify-center mt-2 py-3.5"
              disabled={isAuthenticating}
            >
              {isAuthenticating ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        ) : (
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Check your inbox</h3>
            <p className="text-gray-400 mb-6">We've sent a password reset link to <strong>{email}</strong></p>
            <button 
              onClick={() => setIsSent(false)}
              className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
            >
              Try another email
            </button>
          </div>
        )}

        <div className="mt-8 text-center">
          <Link to="/login" className="text-gray-400 hover:text-white text-sm flex items-center justify-center gap-2 transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
