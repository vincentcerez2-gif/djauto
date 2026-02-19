
import React, { useState, useRef } from 'react';
import { ChevronRight, Upload, Check, Info, CheckCircle2, LogIn, ShieldAlert, ShieldCheck, Loader2 } from 'lucide-react';
import { Vehicle, Application, AISettings } from '../types';
import { GoogleGenAI } from "@google/genai";

interface ApplicationFormProps {
  vehicles: Vehicle[];
  initialVehicleId?: string;
  aiSettings: AISettings;
  onSubmit: (app: Omit<Application, 'id' | 'status' | 'date'>) => void;
  onReturnHome: () => void;
  onNavigateToLogin: () => void;
}

type Step = 1 | 2 | 3 | 4 | 'SUCCESS';

const ApplicationForm: React.FC<ApplicationFormProps> = ({ vehicles, initialVehicleId, aiSettings, onSubmit, onReturnHome, onNavigateToLogin }) => {
  const [step, setStep] = useState<Step>(1);
  const [isVerifying, setIsVerifying] = useState(false);
  const [forensicResult, setForensicResult] = useState<{status: 'PASS' | 'FAIL' | 'UNVERIFIED', reasoning: string} | null>(null);
  
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    licenseNumber: '',
    targetPlatform: 'Uber',
    vehicleId: initialVehicleId || '',
    rentalProgram: 'Standard Rental',
    licenseFront: '',
    licenseBack: ''
  });

  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);

  const verifyID = async (imageBase64: string) => {
    if (!aiSettings.apiKey || aiSettings.provider !== 'GEMINI') {
      setForensicResult({ status: 'UNVERIFIED', reasoning: 'Forensic engine not configured in AI settings.' });
      return;
    }

    setIsVerifying(true);
    try {
      const ai = new GoogleGenAI({ apiKey: aiSettings.apiKey });
      const prompt = `Analyze this ID document for authenticity. 
      Check for:
      - Holographic security markers
      - Digital artifacts or manipulation
      - Font consistency
      - Address validation logic
      Return a JSON object with: 
      { "status": "PASS" | "FAIL", "reasoning": "Forensic details about the analysis" }`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          { parts: [
            { text: prompt },
            { inlineData: { data: imageBase64.split(',')[1], mimeType: 'image/jpeg' } }
          ]}
        ],
        config: { responseMimeType: "application/json" }
      });

      const result = JSON.parse(response.text || '{}');
      setForensicResult({
        status: result.status === 'PASS' ? 'PASS' : 'FAIL',
        reasoning: result.reasoning || 'Automated analysis complete.'
      });
    } catch (error) {
      console.error("Forensic error:", error);
      setForensicResult({ status: 'FAIL', reasoning: 'ID verification engine failed to process the request.' });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, side: 'licenseFront' | 'licenseBack') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setFormData(prev => ({ ...prev, [side]: base64 }));
        if (side === 'licenseFront') {
          verifyID(base64);
        }
      };
      reader.readAsDataURL(file);
    }
  };

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
        program: formData.rentalProgram,
        verificationStatus: forensicResult?.status || 'UNVERIFIED',
        verificationReasoning: forensicResult?.reasoning || 'Manual verification required.',
        licenseFront: formData.licenseFront,
        licenseBack: formData.licenseBack
      });
      setStep('SUCCESS');
      return;
    }
    if (typeof step === 'number') {
      setStep(prev => ((prev as number) < 4 ? (prev as number + 1) as Step : prev));
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

  const getLastFour = (phone: string) => {
    const digits = phone.replace(/\D/g, '');
    return digits.length >= 4 ? digits.slice(-4) : '0000';
  };

  if (step === 'SUCCESS') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-[3rem] p-12 lg:p-16 text-center shadow-2xl border border-slate-100 animate-fadeIn">
          <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <Check size={48} strokeWidth={3} />
          </div>
          <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter mb-4">THANK YOU FOR YOUR INTEREST!</h2>
          <p className="text-slate-500 text-lg font-bold uppercase tracking-tight mb-8">
            YOUR APPLICATION IS NOW IN PROGRESS.
          </p>

          <div className="bg-slate-900 text-white p-10 rounded-[2.5rem] text-left mb-10 shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-10">
                <LogIn size={120} />
             </div>
             <h3 className="text-xs font-black uppercase tracking-[0.3em] text-red-500 mb-6">PORTAL ACCESS CREDENTIALS</h3>
             <p className="text-sm font-medium text-slate-400 mb-8 leading-relaxed">
               Use the following credentials to track your approval status and access your rental agreement.
             </p>
             <div className="space-y-4">
                <div className="flex flex-col">
                   <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-1">Username (Email)</span>
                   <span className="text-xl font-bold text-white">{formData.email}</span>
                </div>
                <div className="flex flex-col">
                   <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-1">Password (Last 4 digits of phone)</span>
                   <span className="text-xl font-bold text-red-500 tracking-[0.2em]">{getLastFour(formData.phone)}</span>
                </div>
             </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={onNavigateToLogin}
              className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-5 rounded-2xl font-black text-xs tracking-widest uppercase transition-all shadow-xl shadow-blue-600/20"
            >
              LOG IN NOW TO TRACK STATUS
            </button>
            <button 
              onClick={onReturnHome}
              className="bg-slate-100 hover:bg-slate-200 text-slate-900 px-10 py-5 rounded-2xl font-black text-xs tracking-widest uppercase transition-all"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-[2.5rem] p-8 lg:p-12 shadow-2xl border border-slate-100">
        <div className="relative flex justify-between items-center mb-16 px-4">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 z-0" />
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
                    'bg-white border-slate-200 text-slate-400'}`}
              >
                {(step as number) > s.id ? <Check size={18} /> : s.id}
              </div>
              <span className={`mt-2 text-[10px] font-bold tracking-widest uppercase transition-colors
                ${step === s.id ? 'text-blue-600' : 'text-slate-400'}`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>

        <div className="min-h-[400px]">
          {step === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 tracking-widest mb-2">Full Legal Name</label>
                <input 
                  type="text" 
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="As it appears on license"
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all outline-none"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 tracking-widest mb-2">Phone Number</label>
                  <input 
                    type="tel" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="(210) 000-0000"
                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 tracking-widest mb-2">Email Address</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="driver@email.com"
                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 tracking-widest mb-2">Home Address</label>
                <input 
                  type="text" 
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Street, City, Zip..."
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all outline-none"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 tracking-widest mb-2">License Number</label>
                <input 
                  type="text" 
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleInputChange}
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all outline-none"
                />
              </div>

              {isVerifying && (
                <div className="bg-slate-900 text-white p-6 rounded-2xl flex items-center gap-4 animate-pulse">
                   <Loader2 size={24} className="animate-spin text-blue-500" />
                   <div>
                     <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Neural Engine Active</p>
                     <p className="text-xs font-bold uppercase italic">Forensic ID verification in progress...</p>
                   </div>
                </div>
              )}

              {forensicResult && !isVerifying && (
                 <div className={`p-6 rounded-2xl border-2 flex items-start gap-4 transition-all ${forensicResult.status === 'PASS' ? 'border-emerald-500/30 bg-emerald-50' : 'border-red-500/30 bg-red-50'}`}>
                    <div className={`p-3 rounded-xl ${forensicResult.status === 'PASS' ? 'bg-emerald-500' : 'bg-red-500'} text-white`}>
                      {forensicResult.status === 'PASS' ? <ShieldCheck size={20}/> : <ShieldAlert size={20}/>}
                    </div>
                    <div>
                      <h4 className={`text-xs font-black uppercase tracking-widest ${forensicResult.status === 'PASS' ? 'text-emerald-700' : 'text-red-700'}`}>Forensic Status: {forensicResult.status}</h4>
                      <p className="text-[11px] font-bold text-slate-600 mt-1 uppercase leading-tight">{forensicResult.reasoning}</p>
                    </div>
                 </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 tracking-widest mb-2">License (Front)</label>
                  <div 
                    onClick={() => frontInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-[2rem] h-48 flex flex-col items-center justify-center hover:bg-slate-50 transition-all cursor-pointer relative overflow-hidden group
                    ${formData.licenseFront ? 'border-blue-600' : 'border-slate-200'}`}
                  >
                    {formData.licenseFront ? (
                      <img src={formData.licenseFront} className="w-full h-full object-cover" />
                    ) : (
                      <>
                        <Upload size={24} className="text-slate-300 mb-2 group-hover:text-red-600" />
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Image</p>
                      </>
                    )}
                    <input type="file" ref={frontInputRef} hidden accept="image/*" onChange={(e) => handleFileChange(e, 'licenseFront')} />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 tracking-widest mb-2">License (Back)</label>
                  <div 
                    onClick={() => backInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-[2rem] h-48 flex flex-col items-center justify-center hover:bg-slate-50 transition-all cursor-pointer relative overflow-hidden group
                    ${formData.licenseBack ? 'border-blue-600' : 'border-slate-200'}`}
                  >
                    {formData.licenseBack ? (
                      <img src={formData.licenseBack} className="w-full h-full object-cover" />
                    ) : (
                      <>
                        <Upload size={24} className="text-slate-300 mb-2 group-hover:text-red-600" />
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Image</p>
                      </>
                    )}
                    <input type="file" ref={backInputRef} hidden accept="image/*" onChange={(e) => handleFileChange(e, 'licenseBack')} />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 tracking-widest mb-2">Target Platform</label>
                <select 
                  name="targetPlatform"
                  value={formData.targetPlatform}
                  onChange={handleInputChange}
                  className="w-full px-5 py-4 rounded-2xl bg-white border border-slate-200 font-bold text-sm focus:border-blue-500 transition-all outline-none appearance-none"
                >
                  <option>Uber</option>
                  <option>Lyft</option>
                  <option>DoorDash</option>
                  <option>Personal Use / Other</option>
                </select>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-fadeIn">
              <h3 className="text-xl font-black uppercase text-slate-900 tracking-tight">Fleet Selection</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                <div 
                  onClick={() => setFormData(prev => ({ ...prev, vehicleId: '' }))}
                  className={`border-2 border-dashed rounded-[2rem] p-8 flex items-center justify-center text-center cursor-pointer transition-all group
                    ${formData.vehicleId === '' ? 'border-blue-600 bg-blue-50' : 'border-slate-100 hover:border-blue-400 hover:bg-blue-50'}`}
                >
                   <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${formData.vehicleId === '' ? 'text-blue-600' : 'text-slate-400 group-hover:text-blue-600'}`}>I'll decide later / Any</p>
                </div>
                {vehicles.map(v => (
                  <div 
                    key={v.id} 
                    onClick={() => setFormData(prev => ({ ...prev, vehicleId: v.id }))}
                    className={`border rounded-[2rem] p-5 flex gap-5 cursor-pointer transition-all bg-white shadow-sm
                      ${formData.vehicleId === v.id ? 'border-blue-600 ring-4 ring-blue-50' : 'border-slate-100 hover:border-blue-600'}`}
                  >
                    <img src={v.image} alt={v.model} className="w-24 h-20 object-cover rounded-2xl" />
                    <div>
                      <h4 className="font-black text-xs uppercase tracking-tight">{v.year} {v.make} {v.model}</h4>
                      <p className="text-blue-600 font-black text-xs mt-2">${v.pricePerWeek}/WK</p>
                      <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">{v.type}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 tracking-widest mb-2">Program Selection</label>
                <div className="grid grid-cols-2 gap-4">
                   <button 
                      type="button"
                      onClick={() => setFormData(p => ({...p, rentalProgram: 'Standard Rental'}))}
                      className={`p-5 rounded-2xl border-2 font-black text-[10px] uppercase tracking-widest transition-all
                        ${formData.rentalProgram === 'Standard Rental' ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-100 bg-white text-slate-400'}`}
                   >
                     Standard Rental
                   </button>
                   <button 
                      type="button"
                      onClick={() => setFormData(p => ({...p, rentalProgram: 'Rent-To-Own'}))}
                      className={`p-5 rounded-2xl border-2 font-black text-[10px] uppercase tracking-widest transition-all
                        ${formData.rentalProgram === 'Rent-To-Own' ? 'border-red-600 bg-red-50 text-red-600' : 'border-slate-100 bg-white text-slate-400'}`}
                   >
                     Rent-To-Own
                   </button>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6 animate-fadeIn">
              <h3 className="text-xl font-black uppercase text-slate-900 tracking-tight">Final Certification</h3>
              <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100 space-y-6">
                <label className="flex items-start gap-4 cursor-pointer group">
                  <input type="checkbox" required className="mt-1 w-5 h-5 rounded-lg border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
                  <p className="text-sm text-slate-600 font-medium group-hover:text-slate-900 transition-colors">I confirm that all information provided is accurate and I am over 25 years old.</p>
                </label>
                <label className="flex items-start gap-4 cursor-pointer group">
                  <input type="checkbox" required className="mt-1 w-5 h-5 rounded-lg border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
                  <p className="text-sm text-slate-600 font-medium group-hover:text-slate-900 transition-colors">I consent to a background check and driving record review (MVR).</p>
                </label>
                <label className="flex items-start gap-4 cursor-pointer group">
                  <input type="checkbox" required className="mt-1 w-5 h-5 rounded-lg border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
                  <p className="text-sm text-slate-600 font-medium group-hover:text-slate-900 transition-colors">I agree to the DJ Auto Fleet Terms of Service and Privacy Policy.</p>
                </label>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center mt-12 pt-10 border-t border-slate-50">
          <button 
            onClick={prevStep}
            className={`text-[10px] font-black uppercase tracking-widest transition-colors ${step === 1 ? 'opacity-0 pointer-events-none' : 'text-slate-400 hover:text-slate-900'}`}
          >
            Previous Step
          </button>
          <button 
            disabled={isVerifying}
            onClick={nextStep}
            className="flex items-center gap-3 bg-slate-900 hover:bg-black text-white px-10 py-5 rounded-2xl font-black text-xs tracking-widest uppercase transition-all transform active:scale-95 shadow-xl shadow-black/10 disabled:opacity-50"
          >
            {step === 4 ? 'Commit Application' : 'Next Phase'}
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationForm;
