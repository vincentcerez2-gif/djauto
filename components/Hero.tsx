
import React from 'react';
import { MapPin, ArrowUpRight } from 'lucide-react';

interface HeroProps {
  onApply: () => void;
}

const Hero: React.FC<HeroProps> = ({ onApply }) => {
  return (
    <div className="relative h-[85vh] flex items-center justify-center overflow-hidden bg-black">
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center opacity-70 scale-105 transition-transform duration-[10000ms] ease-linear" 
        style={{ backgroundImage: 'url("https://i.ytimg.com/vi/lpAdxawrHqA/maxresdefault.jpg")' }}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#0f172a] via-black/40 to-black/60" />

      <div className="relative z-10 text-center max-w-5xl px-6">
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 bg-red-600/90 backdrop-blur-sm px-4 py-2 rounded-full border border-red-500/50 shadow-lg shadow-red-600/20">
            <MapPin size={14} className="text-white" />
            <span className="text-white text-[10px] font-extrabold tracking-[0.2em] uppercase">San Antonio, Texas</span>
          </div>
        </div>

        <h1 className="text-5xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter uppercase mb-8 drop-shadow-2xl">
          Rent to <span className="text-red-600 italic">Own.</span><br />
          Drive to <span className="text-blue-500 italic">Earn.</span>
        </h1>

        <div className="max-w-2xl mx-auto mb-12">
          <p className="text-white/80 text-lg md:text-xl font-medium mb-2">
            San Antonio's #1 <span className="font-bold text-white">Rent-to-Own</span> Program & <span className="font-bold text-white">Rideshare Rental</span> Fleet.
          </p>
          <p className="text-white/60 text-sm md:text-base font-bold tracking-widest uppercase">No Credit Checks. Instant Approval.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={onApply}
            className="w-full sm:w-auto flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 text-white px-10 py-5 rounded-2xl font-black text-sm tracking-[0.1em] uppercase transition-all transform hover:translate-y-[-2px] hover:shadow-2xl hover:shadow-red-600/30 active:scale-95"
          >
            Start Application
            <ArrowUpRight size={20} />
          </button>
          <a href="tel:2103906135" className="w-full sm:w-auto bg-white hover:bg-gray-100 text-[#0f172a] px-10 py-5 rounded-2xl font-black text-sm tracking-[0.1em] uppercase transition-all transform hover:translate-y-[-2px] active:scale-95 border-b-4 border-gray-200 text-center flex items-center justify-center">
            Speak To Sales
          </a>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#0f172a] to-transparent z-10" />
    </div>
  );
};

export default Hero;
