
import React from 'react';
import { Application, Vehicle } from '../types';
import { Clock, CheckCircle2, FileText, AlertCircle, Phone } from 'lucide-react';

interface DriverDashboardProps {
  application: Application | null;
  vehicle: Vehicle | null;
}

const DriverDashboard: React.FC<DriverDashboardProps> = ({ application, vehicle }) => {
  if (!application) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle size={48} className="text-slate-300 mb-4" />
        <h2 className="text-2xl font-black uppercase text-slate-900">No Active Application</h2>
        <p className="text-slate-500 max-w-sm mt-2">We couldn't find an application associated with this session. Please apply to start your journey.</p>
      </div>
    );
  }

  const steps = [
    { label: 'Application Submitted', status: 'COMPLETE', icon: <FileText size={16} /> },
    { label: 'Document Verification', status: application.documentsComplete ? 'COMPLETE' : 'IN_PROGRESS', icon: <CheckCircle2 size={16} /> },
    { label: 'Fleet Approval', status: application.status === 'APPROVED' ? 'COMPLETE' : application.status === 'REJECTED' ? 'FAILED' : 'PENDING', icon: <Clock size={16} /> },
    { label: 'Vehicle Handover', status: application.status === 'APPROVED' ? 'PENDING' : 'LOCKED', icon: <AlertCircle size={16} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-12">
          <div>
            <span className="bg-red-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 inline-block">Driver Hub</span>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-2">Welcome, {application.fullName}</h1>
            <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Application ID: {application.id.slice(0, 8)} • Submitted: {application.date}</p>
          </div>
          
          <div className={`px-8 py-4 rounded-2xl border-2 flex flex-col items-end
            ${application.status === 'APPROVED' ? 'border-emerald-500 bg-emerald-50' : 
              application.status === 'REJECTED' ? 'border-red-500 bg-red-50' : 
              'border-blue-500 bg-blue-50'}`}>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Current Status</span>
            <span className={`text-xl font-black uppercase tracking-tight
              ${application.status === 'APPROVED' ? 'text-emerald-700' : 
                application.status === 'REJECTED' ? 'text-red-700' : 
                'text-blue-700'}`}>
              {application.status}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Progress Card */}
          <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-10 shadow-2xl border border-slate-100">
            <h3 className="text-xl font-black uppercase text-slate-900 mb-8 flex items-center gap-3">
               <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center"><Clock size={16} /></div>
               Onboarding Track
            </h3>
            
            <div className="space-y-6">
              {steps.map((step, i) => (
                <div key={i} className="flex items-center gap-6 group">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all
                    ${step.status === 'COMPLETE' ? 'bg-emerald-100 text-emerald-600' : 
                      step.status === 'IN_PROGRESS' || step.status === 'PENDING' ? 'bg-blue-100 text-blue-600' : 
                      step.status === 'FAILED' ? 'bg-red-100 text-red-600' : 'bg-slate-50 text-slate-300'}`}>
                    {step.icon}
                  </div>
                  <div className="flex-1 border-b border-slate-50 pb-4 group-last:border-0">
                    <h4 className="font-black text-sm uppercase tracking-tight text-slate-900">{step.label}</h4>
                    <span className={`text-[10px] font-black uppercase tracking-widest
                      ${step.status === 'COMPLETE' ? 'text-emerald-500' : 
                        step.status === 'IN_PROGRESS' || step.status === 'PENDING' ? 'text-blue-500' : 
                        step.status === 'FAILED' ? 'text-red-500' : 'text-slate-300'}`}>
                      {step.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-8">
            <div className="bg-[#020617] text-white rounded-[2.5rem] p-8 shadow-2xl">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-6">Selected Asset</h4>
              {vehicle ? (
                <div>
                  <img src={vehicle.image} alt={vehicle.model} className="w-full h-32 object-cover rounded-2xl mb-4" />
                  <h5 className="font-black text-lg uppercase tracking-tight">{vehicle.year} {vehicle.make} {vehicle.model}</h5>
                  <p className="text-red-500 font-bold text-sm tracking-tight">${vehicle.pricePerWeek}/WK Rate</p>
                </div>
              ) : (
                <p className="text-xs text-slate-400 uppercase font-bold tracking-widest">Pending Assignment</p>
              )}
            </div>

            <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-100">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Support Hub</h4>
              <p className="text-sm font-medium text-slate-600 mb-6 leading-relaxed">Questions regarding your application? Speak with your fleet manager.</p>
              <a href="tel:2103906135" className="flex items-center justify-center gap-3 w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all">
                <Phone size={14} /> Call Manager
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;
