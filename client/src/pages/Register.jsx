import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  auth, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  googleProvider,
  sendEmailVerification,
  updateProfile
} from '../firebase/firebase';
import toast from 'react-hot-toast';

const Register = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { isAuthenticating, setIsAuthenticating, syncUserWithBackend } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!fullName || !email || !password || !confirmPassword) return toast.error("All fields are required");
    if (password !== confirmPassword) return toast.error("Passwords do not match");
    if (password.length < 6) return toast.error("Password must be at least 6 characters");

    setIsAuthenticating(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update Firebase Profile
      await updateProfile(user, { displayName: fullName });
      
      // Send Verification Email
      await sendEmailVerification(user);
      toast.success("Verification email sent! Please check your inbox.");

      // Sync with MongoDB
      await syncUserWithBackend(user, 'email');
      
      toast.success("Account created successfully!");
      navigate('/login');
    } catch (error) {
      console.error(error);
      let message = "Registration failed";
      if (error.code === 'auth/email-already-in-use') message = "Email already registered";
      if (error.code === 'auth/invalid-email') message = "Invalid email format";
      if (error.code === 'auth/weak-password') message = "Password is too weak";
      toast.error(message);
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsAuthenticating(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await syncUserWithBackend(result.user, 'google');
      toast.success("Signed up with Google successfully!");
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      if (error.code !== 'auth/popup-closed-by-user') {
        toast.error("Google sign up failed");
      }
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full"></div>

      {isAuthenticating && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex flex-col items-center justify-center">
          <div className="spinner mb-4"></div>
          <p className="text-white font-medium animate-pulse">Creating Account...</p>
        </div>
      )}

      <div className={`w-full max-auto max-w-[500px] glass p-8 rounded-2xl shadow-2xl animate-fade-in-up ${isAuthenticating ? 'opacity-50 pointer-events-none' : ''}`}>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold mb-2">Create Account</h1>
          <p className="text-gray-400">Join SkillBridge and start learning today</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5 ml-1">Full Name</label>
            <input 
              type="text" 
              placeholder="John Doe"
              className="input-field"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5 ml-1">Password</label>
              <input 
                type="password" 
                placeholder="••••••••"
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5 ml-1">Confirm Password</label>
              <input 
                type="password" 
                placeholder="••••••••"
                className="input-field"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn-primary w-full justify-center mt-4 py-3.5"
            disabled={isAuthenticating}
          >
            Create Account
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700/50"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[#13131f] px-4 text-gray-500">Or sign up with</span>
          </div>
        </div>

        <button 
          onClick={handleGoogleLogin}
          type="button"
          className="btn-outline w-full flex items-center justify-center gap-3 py-3.5 border-gray-700/50 hover:bg-white/5"
          disabled={isAuthenticating}
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <span className="text-gray-200">Google</span>
        </button>

        <p className="text-center mt-8 text-gray-400 text-sm">
          Already have an account? {' '}
          <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
