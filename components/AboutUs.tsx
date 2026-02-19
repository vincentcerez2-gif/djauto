
import React from 'react';
import { Target, ShieldCheck, Heart } from 'lucide-react';

const AboutUs: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-[#020617] py-24 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter mb-6">
            About <span className="text-red-600">Us</span>
          </h1>
          <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-xs md:text-sm">
            Reliability • Ownership • Long-Term Value
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row gap-16 items-start">
            <div className="flex-1 space-y-8">
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight leading-tight">
                Driving You Toward <span className="text-red-600 italic">Ownership</span>
              </h2>
              <div className="space-y-6 text-slate-600 text-lg leading-relaxed font-medium">
                <p>
                  Founded on the principle that everyone deserves a reliable ride, <span className="font-black text-slate-900">CJ Car Rental</span> is changing the way people think about car rentals. We noticed a gap in the market: hardworking individuals were spending thousands on rentals with nothing to show for it at the end.
                </p>
                <p>
                  We decided to fix that. Our Rent-to-Own model is the perfect solution for those who need a vehicle for daily life or professional gig work but want their investment to count. From fuel-efficient sedans for rideshare apps to spacious vehicles for deliveries, we curate our inventory to ensure you have the best tools for the job.
                </p>
                <p className="font-bold text-slate-900">
                  At CJ Car Rental, we don't just rent cars—we build owners.
                </p>
              </div>
            </div>

            {/* Sidebar Stats/Focus */}
            <div className="w-full md:w-80 space-y-8">
              <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                <div className="flex items-center gap-4 mb-4 text-red-600">
                  <Target size={24} />
                  <h4 className="text-[10px] font-black uppercase tracking-widest">Our Focus</h4>
                </div>
                <p className="text-xs font-bold text-slate-500 uppercase leading-loose">
                  Reliability, overcoming credit hurdles, and creating long-term value for every driver in San Antonio.
                </p>
              </div>

              <div className="p-8 bg-slate-900 text-white rounded-[2.5rem] shadow-2xl">
                <div className="flex items-center gap-4 mb-4 text-red-500">
                  <ShieldCheck size={24} />
                  <h4 className="text-[10px] font-black uppercase tracking-widest">Our Promise</h4>
                </div>
                <p className="text-xs font-bold text-slate-400 uppercase leading-loose">
                  No hidden fees. Transparent contracts. A clear path to title ownership from day one.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Footer */}
      <section className="bg-slate-50 py-20 px-6 border-t border-slate-100">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center mb-6 text-red-600">
              <Target size={32} />
            </div>
            <h5 className="font-black uppercase tracking-tighter text-slate-900 mb-2">Empowerment</h5>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Putting the keys in your name</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center mb-6 text-red-600">
              <ShieldCheck size={32} />
            </div>
            <h5 className="font-black uppercase tracking-tighter text-slate-900 mb-2">Integrity</h5>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Honest terms for honest drivers</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center mb-6 text-red-600">
              <Heart size={32} />
            </div>
            <h5 className="font-black uppercase tracking-tighter text-slate-900 mb-2">Community</h5>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Supporting San Antonio local economy</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
