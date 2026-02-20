
import React, { useState } from 'react';
import { Search, Loader2, CheckCircle2, Clock, AlertTriangle, ArrowRight, Car } from 'lucide-react';
import { Application, Vehicle } from '../types';

interface TrackingPageProps {
  applications: Application[];
  vehicles: Vehicle[];
}

const TrackingPage: React.FC<TrackingPageProps> = ({ applications, vehicles }) => {
  const [code, setCode] = useState('');
  const [foundApp, setFoundApp] = useState<Application | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setHasSearched(false);
    
    // Simulate lookup delay
    setTimeout(() => {
      const app = applications.find(a => a.trackingCode === code.toUpperCase().trim());
      setFoundApp(app || null);
      setIsSearching(false);
      setHasSearched(true);
    }, 800);
  };

  const getVehicleName = (id?: string) => {
    const v = vehicles.find(veh => veh.id === id);
    return v ? `${v.year} ${v.make} ${v.model}` : 'Any Available Vehicle';
  };

  const steps = [
    { label: 'Submitted', key: 'SUBMITTED', status: 'COMPLETE' },
    { label: 'Document Review', key: 'REVIEW', status: foundApp?.status === 'PENDING' ? 'CURRENT' : 'COMPLETE' },
    { label: 'ID Verification', key: 'VERIFY', status: foundApp?.verificationStatus === 'PASS' ? 'COMPLETE' : foundApp?.verificationStatus === 'FAIL' ? 'ERROR' : 'PENDING' },
    { label: 'Handover Ready', key: 'DECISION', status: foundApp?.status === 'APPROVED' ? 'COMPLETE' : foundApp?.status === 'REJECTED' ? 'ERROR' : 'PENDING' }
  ];

  return (
    <div className="min-h-[80vh] bg-slate-50 py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase mb-4">Track Your <span className="text-red-600">App</span></h1>
          <p className="text-slate-500 font-bold tracking-widest uppercase text-xs">Enter your 6-digit tracking code below</p>
        </div>

        <form onSubmit={handleSearch} className="mb-12">
          <div className="relative group">
            <input 
              type="text" 
              placeholder="e.g. DJ-X4Y2"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full pl-8 pr-48 py-8 bg-white border-2 border-slate-200 rounded-[2.5rem] text-2xl font-black uppercase tracking-[0.3em] shadow-2xl focus:border-red-600 focus:outline-none transition-all group-hover:shadow-red-600/5"
            />
            <button 
              disabled={isSearching}
              className="absolute right-4 top-4 bottom-4 px-10 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-600 transition-all disabled:opacity-50"
            >
              {isSearching ? <Loader2 className="animate-spin" /> : 'Find My App'}
            </button>
          </div>
        </form>

        {isSearching && (
          <div className="flex flex-col items-center py-20">
            <div className="w-16 h-16 border-4 border-slate-900 border-t-red-600 rounded-full animate-spin mb-6"></div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Querying Fleet Registry...</p>
          </div>
        )}

        {hasSearched && !foundApp && (
          <div className="bg-white p-12 rounded-[3rem] border-2 border-dashed border-slate-200 text-center animate-fadeIn">
            <AlertTriangle size={48} className="mx-auto text-amber-500 mb-6" />
            <h3 className="text-xl font-black uppercase text-slate-900">Code Not Found</h3>
            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-2">Double check your email confirmation for the correct tracking ID.</p>
          </div>
        )}

        {hasSearched && foundApp && (
          <div className="space-y-8 animate-fadeIn">
            <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-100 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-10 opacity-5">
                  <Car size={180} />
               </div>
               
               <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                  <div>
                     <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Application For</span>
                     <h2 className="text-3xl font-black uppercase text-slate-900 leading-none">{foundApp.fullName}</h2>
                     <p className="text-red-600 font-black text-xs mt-2 uppercase tracking-widest">{foundApp.program}</p>
                  </div>
                  <div className={`px-8 py-4 rounded-2xl border-2 flex flex-col items-center
                    ${foundApp.status === 'APPROVED' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 
                      foundApp.status === 'REJECTED' ? 'border-red-500 bg-red-50 text-red-700' : 
                      'border-blue-500 bg-blue-50 text-blue-700'}`}>
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Live Status</span>
                    <span className="text-xl font-black uppercase">{foundApp.status}</span>
                  </div>
               </div>

               <div className="space-y-8 mb-12">
                  <div className="flex flex-col md:flex-row gap-8">
                     <div className="flex-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Requested Vehicle</span>
                        <p className="font-bold text-slate-900 uppercase">{getVehicleName(foundApp.vehicleId)}</p>
                     </div>
                     <div className="flex-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Submission Date</span>
                        <p className="font-bold text-slate-900 uppercase">{foundApp.date}</p>
                     </div>
                  </div>
               </div>

               {/* Tracking Stepper */}
               <div className="relative pt-10">
                  <div className="absolute top-14 left-0 w-full h-1 bg-slate-100 rounded-full" />
                  <div className="relative flex justify-between">
                     {steps.map((step, idx) => (
                        <div key={idx} className="flex flex-col items-center z-10">
                           <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all
                              ${step.status === 'COMPLETE' ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 
                                step.status === 'CURRENT' ? 'bg-white border-blue-500 text-blue-500 shadow-lg' : 
                                step.status === 'ERROR' ? 'bg-red-500 border-red-500 text-white shadow-lg shadow-red-500/20' :
                                'bg-white border-slate-200 text-slate-300'}`}>
                              {step.status === 'COMPLETE' ? <CheckCircle2 size={18} /> : 
                               step.status === 'ERROR' ? <AlertTriangle size={18} /> : <Clock size={18} />}
                           </div>
                           <span className={`mt-4 text-[9px] font-black uppercase tracking-widest 
                              ${step.status === 'COMPLETE' ? 'text-emerald-600' : 
                                step.status === 'CURRENT' ? 'text-blue-600' : 
                                step.status === 'ERROR' ? 'text-red-600' : 'text-slate-400'}`}>
                              {step.label}
                           </span>
                        </div>
                     ))}
                  </div>
               </div>
            </div>

            <div className="bg-slate-900 text-white p-8 rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                     <Car size={24} className="text-red-500" />
                  </div>
                  <div>
                     <h4 className="text-sm font-black uppercase tracking-widest">Next Phase: Fleet Verification</h4>
                     <p className="text-[10px] font-bold text-slate-400 uppercase">A manager will contact you within 24 hours.</p>
                  </div>
               </div>
               <button className="px-8 py-4 bg-red-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-700 transition-all flex items-center gap-2">
                  Contact Support <ArrowRight size={12} />
               </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackingPage;
