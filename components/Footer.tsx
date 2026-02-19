
import React from 'react';
import { Car, MapPin, Phone } from 'lucide-react';
import { View } from '../types';

interface FooterProps {
  onNavigate: (view: View) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#020617] text-white py-24 px-6 border-t border-white/5">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-4 mb-10">
            <img 
              src="https://djautofleet.com/wp-content/uploads/2026/02/Untitled-design.png" 
              alt="DJ Auto Fleet Logo" 
              className="h-12 w-auto object-contain"
            />
            <div className="h-10 w-[1px] bg-white/10" />
            <div>
              <h1 className="text-white font-black text-xl tracking-tighter uppercase leading-none">DJ Auto Rental</h1>
              <p className="text-red-600 text-[10px] font-black tracking-[0.3em] uppercase mt-1">Fleet Management</p>
            </div>
          </div>
          <p className="text-slate-500 text-sm leading-relaxed max-w-sm mb-10 font-medium">
            Professional vehicle solutions for the gig economy. We help San Antonio drivers get on the road with reliable, rideshare-ready cars and rent-to-own opportunities.
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-4 text-slate-400 text-[10px] font-black uppercase tracking-widest">
              <MapPin size={18} className="text-red-600" />
              5072 Timberhill Drive, San Antonio, TX
            </div>
            <a href="tel:2103906135" className="flex items-center gap-4 text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors">
              <Phone size={18} className="text-red-600" />
              (210) 390-6135
            </a>
          </div>
        </div>

        <div>
           <h4 className="text-slate-500 text-[10px] font-black tracking-[0.4em] uppercase mb-10">Company</h4>
           <ul className="space-y-6">
             <li><button onClick={() => onNavigate(View.APPLY)} className="text-xs font-black text-slate-400 uppercase tracking-widest hover:text-white transition-colors">Start Application</button></li>
             <li><button onClick={() => onNavigate(View.HOME)} className="text-xs font-black text-slate-400 uppercase tracking-widest hover:text-white transition-colors">Our Inventory</button></li>
             <li><button onClick={() => onNavigate(View.CONTACT)} className="text-xs font-black text-slate-400 uppercase tracking-widest hover:text-white transition-colors">Contact Support</button></li>
           </ul>
        </div>

        <div>
           <h4 className="text-slate-500 text-[10px] font-black tracking-[0.4em] uppercase mb-10">Access Portals</h4>
           <ul className="space-y-6">
             <li><button onClick={() => onNavigate(View.LOGIN)} className="text-xs font-black text-slate-400 uppercase tracking-widest hover:text-white transition-colors">Admin Log In</button></li>
             <li><button onClick={() => onNavigate(View.USER_LOGIN)} className="text-xs font-black text-slate-400 uppercase tracking-widest hover:text-white transition-colors">Driver Log In</button></li>
           </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-24 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
        <p className="text-slate-600 text-[10px] font-black tracking-widest uppercase">© 2024 DJ Auto Fleet. San Antonio's #1 Fleet Service.</p>
        <div className="flex gap-10">
           <a href="#" className="text-slate-600 text-[10px] font-black tracking-widest uppercase hover:text-white transition-colors">Privacy Policy</a>
           <a href="#" className="text-slate-600 text-[10px] font-black tracking-widest uppercase hover:text-white transition-colors">Usage Terms</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
