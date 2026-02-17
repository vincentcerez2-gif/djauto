
import React, { useState } from 'react';
import { ChevronRight, Upload, Check, Info, CheckCircle2 } from 'lucide-react';
import { Vehicle, Application } from '../types';

interface ApplicationFormProps {
  vehicles: Vehicle[];
  onSubmit: (app: Omit<Application, 'id' | 'status' | 'date'>) => void;
  onReturnHome: () => void;
}

type Step = 1 | 2 | 3 | 4 | 'SUCCESS';

const ApplicationForm: React.FC<ApplicationFormProps> = ({ vehicles, onSubmit, onReturnHome }) => {
  const [step, setStep] = useState<Step>(1);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    licenseNumber: '',
    targetPlatform: 'Uber',
    vehicleId: '',
    rentalProgram: 'Standard Rental'
  });

  const nextStep = () => {
    if (step === 4) {
      onSubmit({
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        licenseNumber: formData.licenseNumber,
        targetPlatform: formData.targetPlatform,
        vehicleId: formData.vehicleId,
        program: formData.rentalProgram
      });
      setStep('SUCCESS');
      return;
    }
    if (typeof step === 'number') {
      setStep(prev => (prev < 4 ? (prev as number + 1) as Step : prev));
    }
  };
  
  const prevStep = () => {
    if (typeof step === 'number') {
      setStep(prev => (prev as number > 1 ? (prev as number - 1) as Step : prev));
    }
  };

  const steps = [
    { id: 1, label: 'PERSONAL' },
    { id: 2, label: 'LICENSE' },
    { id: 3, label: 'VEHICLE' },
    { id: 4, label: 'AGREEMENTS' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (step === 'SUCCESS') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl p-16 text-center shadow-2xl border border-white/5 animate-fadeIn">
          <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
            <Check size={48} />
          </div>
          <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter mb-4">Application Received!</h2>
          <p className="text-slate-500 text-lg font-medium mb-10">
            Thank you, <span className="text-slate-900 font-bold">{formData.fullName}</span>. Your application for the <span className="text-red-600 font-bold">{formData.rentalProgram}</span> program is being reviewed.
          </p>
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-left mb-10">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">What's Next?</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                <CheckCircle2 size={16} className="text-emerald-500" />
                Confirmation text and email sent.
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                <CheckCircle2 size={16} className="text-emerald-500" />
                Document verification (24-48 hours).
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                <CheckCircle2 size={16} className="text-emerald-500" />
                Vehicle pickup schedule.
              </li>
            </ul>
          </div>
          <button 
            onClick={onReturnHome}
            className="bg-[#020617] text-white px-12 py-5 rounded-2xl font-black text-xs tracking-widest uppercase transition-all hover:scale-105"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-2xl border border-white/5">
        <div className="relative flex justify-between items-center mb-16 px-4">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 -translate-y-1/2 z-0" />
          <div 
            className="absolute top-1/2 left-0 h-0.5 bg-blue-600 -translate-y-1/2 z-0 transition-all duration-500" 
            style={{ width: `${((step as number - 1) / 3) * 100}%` }} 
          />
          
          {steps.map((s) => (
            <div key={s.id} className="relative z-10 flex flex-col items-center">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 text-sm font-bold
                  ${(step as number) > s.id ? 'bg-blue-600 border-blue-600 text-white' : 
                    step === s.id ? 'bg-white border-blue-600 text-blue-600 scale-110 shadow-lg' : 
                    'bg-white border-gray-200 text-gray-400'}`}
              >
                {(step as number) > s.id ? <Check size={18} /> : s.id}
              </div>
              <span className={`mt-2 text-[10px] font-bold tracking-widest uppercase transition-colors
                ${step === s.id ? 'text-blue-600' : 'text-gray-400'}`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>

        <div className="min-h-[400px]">
          {step === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Legal Name</label>
                <input 
                  type="text" 
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="As it appears on license"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                  <input 
                    type="tel" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="(210) 000-0000"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="driver@email.com"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Home Address</label>
                <input 
                  type="text" 
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Search San Antonio address..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">License Number</label>
                <input 
                  type="text" 
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">License (Front)</label>
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer">
                    <Upload size={20} className="text-gray-400 mb-2" />
                    <p className="text-xs font-bold text-gray-500 uppercase">Upload Front</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">License (Back)</label>
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer">
                    <Upload size={20} className="text-gray-400 mb-2" />
                    <p className="text-xs font-bold text-gray-500 uppercase">Upload Back</p>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Target Platform</label>
                <select 
                  name="targetPlatform"
                  value={formData.targetPlatform}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none appearance-none bg-white"
                >
                  <option>Uber</option>
                  <option>Lyft</option>
                  <option>DoorDash</option>
                  <option>Other / Personal Use</option>
                </select>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-fadeIn">
              <h3 className="text-xl font-bold text-gray-900 uppercase tracking-tight">Select Your Vehicle</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[300px] overflow-y-auto pr-2">
                <div 
                  onClick={() => setFormData(prev => ({ ...prev, vehicleId: '' }))}
                  className={`border-2 border-dashed rounded-2xl p-6 flex items-center justify-center text-center cursor-pointer transition-all group
                    ${formData.vehicleId === '' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'}`}
                >
                   <p className={`text-xs font-bold uppercase tracking-widest ${formData.vehicleId === '' ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-600'}`}>I'll decide later / Any Available</p>
                </div>
                {vehicles.map(v => (
                  <div 
                    key={v.id} 
                    onClick={() => setFormData(prev => ({ ...prev, vehicleId: v.id }))}
                    className={`border rounded-2xl p-4 flex gap-4 cursor-pointer transition-all bg-white shadow-sm
                      ${formData.vehicleId === v.id ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-gray-200 hover:border-blue-500'}`}
                  >
                    <img src={v.image} alt={v.model} className="w-24 h-16 object-cover rounded-lg" />
                    <div>
                      <h4 className="font-bold text-sm">{v.year} {v.make} {v.model}</h4>
                      <p className="text-blue-600 font-bold text-xs mt-1">${v.pricePerWeek}/WK</p>
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Rental Program Type</label>
                <select 
                  name="rentalProgram"
                  value={formData.rentalProgram}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white"
                >
                  <option>Standard Rental</option>
                  <option>Rent-To-Own</option>
                </select>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6 animate-fadeIn">
              <h3 className="text-xl font-bold text-gray-900 uppercase tracking-tight">Final Agreements</h3>
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 space-y-4">
                <div className="flex items-start gap-3">
                  <input type="checkbox" required className="mt-1 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <p className="text-sm text-gray-600">I confirm that all information provided is accurate and I am over 25 years old.</p>
                </div>
                <div className="flex items-start gap-3">
                  <input type="checkbox" required className="mt-1 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <p className="text-sm text-gray-600">I consent to a background check and driving record review.</p>
                </div>
                <div className="flex items-start gap-3">
                  <input type="checkbox" required className="mt-1 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <p className="text-sm text-gray-600">I agree to the Terms of Service and Privacy Policy.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-100">
          <button 
            onClick={prevStep}
            className={`text-xs font-bold uppercase tracking-widest transition-colors ${step === 1 ? 'opacity-0 cursor-default' : 'text-gray-400 hover:text-gray-900'}`}
          >
            Back
          </button>
          <button 
            onClick={nextStep}
            className="flex items-center gap-3 bg-[#020617] hover:bg-black text-white px-8 py-4 rounded-2xl font-bold text-sm tracking-widest uppercase transition-all transform active:scale-95 shadow-xl shadow-black/10"
          >
            {step === 4 ? 'Submit Application' : 'Next Phase'}
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationForm;
