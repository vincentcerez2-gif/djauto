
import React, { useState } from 'react';
import { UserCircle, Mail, Key, ChevronRight, ArrowLeft, Eye, EyeOff } from 'lucide-react';

interface UserLoginFormProps {
  onLogin: (email: string, pass: string) => void;
  onCancel: () => void;
}

const UserLoginForm: React.FC<UserLoginFormProps> = ({ onLogin, onCancel }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      onLogin(email, password);
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-slate-50 px-6 py-12">
      <div className="max-w-md w-full bg-white p-12 rounded-[3rem] shadow-2xl border border-slate-100 animate-fadeIn">
        <div className="flex flex-col items-center mb-10">
          <div className="bg-blue-600 text-white p-4 rounded-3xl shadow-xl shadow-blue-600/20 mb-6">
             <UserCircle size={32} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase text-center">Driver <span className="text-blue-600">Portal</span></h2>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] mt-2">Check Application & Rental Status</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="email" 
              placeholder="Email Address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full pl-12 pr-4 py-4 rounded-2xl bg-white border font-bold text-sm transition-all focus:outline-none focus:ring-4
                ${error ? 'border-red-500 focus:ring-red-100' : 'border-slate-200 focus:border-blue-600 focus:ring-blue-50'}`}
              required
            />
          </div>

          <div className="relative">
            <Key size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type={showPassword ? "text" : "password"}
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full pl-12 pr-12 py-4 rounded-2xl bg-white border font-bold text-sm transition-all focus:outline-none focus:ring-4
                ${error ? 'border-red-500 focus:ring-red-100' : 'border-slate-200 focus:border-blue-600 focus:ring-blue-50'}`}
              required
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {error && <p className="text-center text-[10px] font-black text-red-600 uppercase animate-bounce">Authentication Failed - Try Again</p>}

          <button 
            type="submit" 
            className="w-full flex items-center justify-center gap-3 bg-slate-900 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-black/10 hover:bg-black transition-all"
          >
            Access Dashboard <ChevronRight size={18} />
          </button>
          
          <button 
            type="button"
            onClick={onCancel}
            className="w-full flex items-center justify-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-colors"
          >
            <ArrowLeft size={12} /> Return Home
          </button>
        </form>
        
        <div className="mt-10 pt-8 border-t border-slate-100 text-center">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Don't have an application?</p>
          <button onClick={onCancel} className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">Apply for a vehicle now</button>
        </div>
      </div>
    </div>
  );
};

export default UserLoginForm;
