
import React, { useState } from 'react';
import { Phone, LogIn, UserCircle, ChevronDown, Lock } from 'lucide-react';
import { View } from '../types';

interface NavbarProps {
  currentView: View;
  onNavigate: (view: View) => void;
  isAdmin?: boolean;
  hasApplication?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate, isAdmin, hasApplication }) => {
  const [showLoginMenu, setShowLoginMenu] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-[#020617]/95 backdrop-blur-md border-b border-white/10 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => onNavigate(View.HOME)}
        >
          <img 
            src="https://djautofleet.com/wp-content/uploads/2026/02/Untitled-design.png" 
            alt="DJ Auto Fleet Logo" 
            className="h-10 w-auto object-contain"
          />
        </div>

        <div className="hidden lg:flex items-center gap-8">
          <button onClick={() => onNavigate(View.HOME)} className={`text-xs font-black uppercase tracking-widest transition-colors ${currentView === View.HOME ? 'text-red-500' : 'text-white/70 hover:text-white'}`}>Home</button>
          <button onClick={() => onNavigate(View.APPLY)} className={`text-xs font-black uppercase tracking-widest transition-colors ${currentView === View.APPLY ? 'text-red-500' : 'text-white/70 hover:text-white'}`}>Apply Now</button>
          <button onClick={() => onNavigate(View.CONTACT)} className={`text-xs font-black uppercase tracking-widest transition-colors ${currentView === View.CONTACT ? 'text-red-500' : 'text-white/70 hover:text-white'}`}>Contact</button>
        </div>

        <div className="flex items-center gap-4">
          <a href="tel:2103906135" className="hidden sm:flex items-center bg-white/5 border border-white/10 rounded-full px-4 py-2 text-white/80 text-[10px] font-black uppercase tracking-widest">
            <Phone size={12} className="mr-2 text-red-500" />
            (210) 390-6135
          </a>
          
          {hasApplication && (
             <button 
                onClick={() => onNavigate(View.DRIVER_DASHBOARD)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600/20 text-blue-400 text-[10px] font-black uppercase tracking-widest hover:bg-blue-600/30 transition-all`}
             >
                <UserCircle size={14} /> My Status
             </button>
          )}

          {isAdmin && (
             <button 
                onClick={() => onNavigate(View.ADMIN)}
                className={`px-4 py-2 rounded-xl bg-red-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-all`}
             >
                ADMIN
             </button>
          )}

          <div className="relative">
            <button 
              onClick={() => (isAdmin || hasApplication) ? onNavigate(View.HOME) : setShowLoginMenu(!showLoginMenu)}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
            >
              <LogIn size={14} />
              {(isAdmin || hasApplication) ? 'Logout' : 'Portal'}
              <ChevronDown size={10} className={`ml-1 transition-transform ${showLoginMenu ? 'rotate-180' : ''}`} />
            </button>

            {showLoginMenu && !isAdmin && !hasApplication && (
              <div className="absolute right-0 mt-3 w-48 bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-fadeIn">
                <button 
                  onClick={() => { onNavigate(View.USER_LOGIN); setShowLoginMenu(false); }}
                  className="w-full flex items-center gap-3 px-6 py-4 text-white hover:bg-blue-600/20 transition-colors text-[10px] font-black uppercase tracking-widest"
                >
                  <UserCircle size={16} className="text-blue-500" />
                  Driver Login
                </button>
                <div className="h-[1px] bg-white/5" />
                <button 
                  onClick={() => { onNavigate(View.LOGIN); setShowLoginMenu(false); }}
                  className="w-full flex items-center gap-3 px-6 py-4 text-white hover:bg-red-600/20 transition-colors text-[10px] font-black uppercase tracking-widest"
                >
                  <Lock size={16} className="text-red-500" />
                  Admin Access
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
