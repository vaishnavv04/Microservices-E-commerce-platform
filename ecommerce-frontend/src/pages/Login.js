import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../services/api';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const res = await loginUser({ email, password });
      login(res.data.user, res.data.token);
      navigate('/'); // Redirect to Home or Products
    } catch (err) {
      console.error(err);
      setError('Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] p-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-800 p-10 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 animate-fade-in">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">Welcome Back</h2>
          <p className="text-slate-500 dark:text-slate-400">Please sign in to your account</p>
        </div>

        {error && (
          <div className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 p-3 rounded-lg mb-6 text-sm text-center border border-red-200 dark:border-red-800">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2 mb-4">
            <label htmlFor="email" className="font-semibold text-sm text-slate-500 dark:text-slate-400">
              Email Address
            </label>
            <input 
              id="email"
              type="email" 
              placeholder="user@example.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              className="px-4 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-lg text-base bg-slate-50 dark:bg-slate-700 transition-all duration-200 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-primary focus:bg-white dark:focus:bg-slate-600 focus:ring-4 focus:ring-primary/10"
            />
          </div>

          <div className="flex flex-col gap-2 mb-6">
            <label htmlFor="password" className="font-semibold text-sm text-slate-500 dark:text-slate-400">
              Password
            </label>
            <input 
              id="password"
              type="password" 
              placeholder="••••••••" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              className="px-4 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-lg text-base bg-slate-50 dark:bg-slate-700 transition-all duration-200 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-primary focus:bg-white dark:focus:bg-slate-600 focus:ring-4 focus:ring-primary/10"
            />
          </div>

          <button 
            type="submit" 
            className="w-full py-4 rounded-lg font-semibold text-white bg-gradient-to-br from-primary to-purple-500 hover:from-primary-hover hover:to-purple-600 shadow-lg transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          <p>
            Don't have an account?{' '}
            <Link to="/register" className="text-primary font-semibold hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;