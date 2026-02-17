
import React from 'react';
import { Car, MapPin, Phone } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#020617] text-white py-24 px-6 border-t border-white/5">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-red-600 p-2 rounded-lg">
              <Car className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-white font-extrabold text-lg tracking-tighter uppercase leading-none">DJ Auto Rental</h1>
              <p className="text-red-500 text-[10px] font-bold tracking-widest uppercase">San Antonio Fleet</p>
            </div>
          </div>
          <p className="text-white/50 text-sm leading-relaxed max-w-sm mb-8 font-medium">
            DJ Auto Rental San Antonio. Professional vehicle solutions for the gig economy. We help drivers get on the road with reliable, rideshare-ready cars.
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-white/40 text-xs font-bold uppercase tracking-widest">
              <MapPin size={16} className="text-red-500" />
              5072 Timberhill Drive, San Antonio, TX
            </div>
            <div className="flex items-center gap-3 text-white/40 text-xs font-bold uppercase tracking-widest">
              <Phone size={16} className="text-red-500" />
              (210) 390-6135
            </div>
          </div>
        </div>

        <div>
           <h4 className="text-white/30 text-[10px] font-black tracking-[0.3em] uppercase mb-8">Quick Links</h4>
           <ul className="space-y-4">
             <li><a href="#" className="text-sm font-bold text-white/60 hover:text-white transition-colors">Apply Now</a></li>
             <li><a href="#" className="text-sm font-bold text-white/60 hover:text-white transition-colors">Our Fleet</a></li>
             <li><a href="#" className="text-sm font-bold text-white/60 hover:text-white transition-colors">Rent-To-Own FAQ</a></li>
             <li><a href="#" className="text-sm font-bold text-white/60 hover:text-white transition-colors">Insurance Details</a></li>
           </ul>
        </div>

        <div>
           <h4 className="text-white/30 text-[10px] font-black tracking-[0.3em] uppercase mb-8">Authorized</h4>
           <ul className="space-y-4">
             <li><a href="#" className="text-sm font-bold text-white/60 hover:text-white transition-colors">Admin Login</a></li>
             <li><a href="#" className="text-sm font-bold text-white/60 hover:text-white transition-colors">Driver Login</a></li>
           </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-24 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-white/30 text-[10px] font-black tracking-widest uppercase">© 2024 DJ Auto Rental. All rights reserved.</p>
        <div className="flex gap-8">
           <a href="#" className="text-white/30 text-[10px] font-black tracking-widest uppercase hover:text-white">Privacy</a>
           <a href="#" className="text-white/30 text-[10px] font-black tracking-widest uppercase hover:text-white">Terms</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
