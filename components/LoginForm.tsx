
import React, { useState } from 'react';
import { Lock, AtSign, ChevronRight, User } from 'lucide-react';

interface LoginFormProps {
  onLogin: (username: string, pass: string) => void;
  onCancel: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, onCancel }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin') {
      onLogin(username, password);
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-slate-50 px-6 py-12">
      <div className="max-w-md w-full bg-white p-12 rounded-[3rem] shadow-2xl border border-slate-100 animate-fadeIn">
        <div className="flex flex-col items-center mb-10">
          <div className="bg-red-600 text-white p-4 rounded-3xl shadow-xl shadow-red-600/20 mb-6">
             <Lock size={32} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase text-center">Executive <span className="text-red-600">Access</span></h2>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] mt-2">Authorized Fleet Personnel Only</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={`w-full pl-12 pr-4 py-4 rounded-2xl bg-white border font-bold text-sm transition-all focus:outline-none focus:ring-4
                ${error ? 'border-red-500 focus:ring-red-100' : 'border-slate-200 focus:border-red-600 focus:ring-red-50'}`}
            />
          </div>

          <div className="relative">
            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full pl-12 pr-4 py-4 rounded-2xl bg-white border font-bold text-sm transition-all focus:outline-none focus:ring-4
                ${error ? 'border-red-500 focus:ring-red-100' : 'border-slate-200 focus:border-red-600 focus:ring-red-50'}`}
            />
          </div>

          {error && <p className="text-center text-[10px] font-black text-red-600 uppercase animate-bounce">Invalid Credentials Access Denied</p>}

          <button 
            type="submit" 
            className="w-full flex items-center justify-center gap-3 bg-slate-900 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-black/10 hover:bg-black transition-all"
          >
            Authenticate Session <ChevronRight size={18} />
          </button>
          
          <button 
            type="button"
            onClick={onCancel}
            className="w-full text-center text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-red-600 transition-colors"
          >
            Return to Public Site
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
