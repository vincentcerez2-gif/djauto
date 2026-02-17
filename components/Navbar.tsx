
import React from 'react';
import { Phone, LogIn } from 'lucide-react';
import { View } from '../types';

interface NavbarProps {
  currentView: View;
  onNavigate: (view: View) => void;
  isAdmin?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate, isAdmin }) => {
  return (
    <nav className="sticky top-0 z-50 bg-[#020617]/95 backdrop-blur-md border-b border-white/10 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => onNavigate(View.HOME)}
        >
          <img 
            src="https://djautofleet.com/wp-content/uploads/2026/02/Untitled-design.png" 
            alt="DJ Auto Fleet Logo" 
            className="h-12 w-auto object-contain"
          />
        </div>

        {/* Contact Info (Hidden on small screens) */}
        <div className="hidden lg:flex items-center bg-white/5 border border-white/10 rounded-full px-4 py-2 text-white/80 text-sm font-medium">
          <Phone size={14} className="mr-2 text-red-500" />
          (210) 390-6135
        </div>

        {/* Navigation Links */}
        <div className="flex items-center gap-6">
          <button 
            onClick={() => onNavigate(View.HOME)}
            className={`text-sm font-semibold transition-colors ${currentView === View.HOME ? 'text-red-500' : 'text-white/70 hover:text-white'}`}
          >
            Home
          </button>
          <button 
            onClick={() => onNavigate(View.APPLY)}
            className={`text-sm font-semibold transition-colors ${currentView === View.APPLY ? 'text-red-500' : 'text-white/70 hover:text-white'}`}
          >
            Apply
          </button>
          
          {isAdmin && (
             <button 
                onClick={() => onNavigate(View.ADMIN)}
                className={`px-4 py-1.5 rounded-full border border-red-500 text-red-500 text-xs font-bold hover:bg-red-500 hover:text-white transition-all`}
             >
                ADMIN PANEL
             </button>
          )}

          <button 
            onClick={() => onNavigate(View.LOGIN)}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-all transform active:scale-95 shadow-lg shadow-red-600/20"
          >
            <LogIn size={16} />
            {isAdmin ? 'LOGOUT' : 'LOGIN'}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
