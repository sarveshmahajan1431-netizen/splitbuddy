import React, { useState } from 'react';
import { XMarkIcon } from './icons/Icons';

interface SignupModalProps {
  onClose: () => void;
  onSignup: (name: string, email: string, password: string) => Promise<any>;
  onSwitchToLogin: () => void;
}

const SignupModal: React.FC<SignupModalProps> = ({ onClose, onSignup, onSwitchToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
        setError("Password must be at least 8 characters long.");
        return;
    }
    setError('');
    setLoading(true);
    try {
      await onSignup(name, email, password);
      // The parent component will handle closing the modal on success
    } catch (err: any) {
      setError(err.message || 'Failed to sign up. This email might already be taken.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-[60] p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm relative p-8">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <XMarkIcon />
        </button>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Create an Account</h2>
        <p className="text-gray-500 mb-6 text-center">Join Splitbuddy today!</p>

        {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm">{error}</p>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white text-indigo-800"
              placeholder="Rohan Sharma"
            />
          </div>
          <div>
            <label htmlFor="email-signup" className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              id="email-signup"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white text-indigo-800"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="password-signup"className="block text-sm font-medium text-gray-700">Password</label>
            <input
              id="password-signup"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white text-indigo-800"
              placeholder="Minimum 8 characters"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white font-bold py-2.5 rounded-lg hover:bg-indigo-700 transition duration-300 disabled:bg-indigo-400 disabled:cursor-not-allowed flex justify-center items-center"
          >
            {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'Sign Up'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <button onClick={onSwitchToLogin} className="font-medium text-indigo-600 hover:text-indigo-500">
            Log in
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignupModal;