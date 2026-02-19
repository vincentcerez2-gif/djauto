
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Users, Car, MessageSquare, Mail, Menu, Search, Plus, 
  Edit, Trash2, Check, X, Star, Save, Phone, AtSign, MapPin, 
  User as UserIcon, Lock, CheckCircle2, ChevronRight, Info, Eye, Settings, ShieldAlert, ShieldCheck
} from 'lucide-react';
import { Vehicle, Application, SMSSettings, EmailSettings, AdminProfile, AISettings, AIProvider } from '../types';

interface AdminPanelProps {
  vehicles: Vehicle[];
  applications: Application[];
  aiSettings: AISettings;
  onUpdateApp: (id: string, status: 'APPROVED' | 'REJECTED') => void;
  onDeleteApp: (id: string) => void;
  onEditApp: (id: string, updatedData: Partial<Application>) => void;
  onAddVehicle: (v: Omit<Vehicle, 'id'>) => void;
  onEditVehicle: (id: string, v: Partial<Vehicle>) => void;
  onDeleteVehicle: (id: string) => void;
  smsSettings: SMSSettings;
  onUpdateSms: (s: SMSSettings) => void;
  emailSettings: EmailSettings;
  onUpdateEmail: (e: EmailSettings) => void;
  adminProfile: AdminProfile;
  onUpdateProfile: (p: AdminProfile) => void;
  onUpdateAI: (s: AISettings) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  vehicles, 
  applications, 
  aiSettings,
  onUpdateApp,
  onDeleteApp,
  onEditApp,
  onAddVehicle, 
  onEditVehicle,
  onDeleteVehicle,
  smsSettings,
  onUpdateSms,
  emailSettings,
  onUpdateEmail,
  adminProfile,
  onUpdateProfile,
  onUpdateAI
}) => {
  const [activeTab, setActiveTab] = useState('applications');
  const [isAddingVehicle, setIsAddingVehicle] = useState(false);
  const [editingVehicleId, setEditingVehicleId] = useState<string | null>(null);
  const [viewingAppId, setViewingAppId] = useState<string | null>(null);
  
  // Form States
  const [editFormData, setEditFormData] = useState<Partial<Application>>({});
  const [editVehicleData, setEditVehicleData] = useState<Partial<Vehicle>>({});
  const [localSmsSettings, setLocalSmsSettings] = useState<SMSSettings>(smsSettings);
  const [localEmailSettings, setLocalEmailSettings] = useState<EmailSettings>(emailSettings);
  const [localAiSettings, setLocalAiSettings] = useState<AISettings>(aiSettings);
  const [profileForm, setProfileForm] = useState<AdminProfile>(adminProfile);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => { setLocalSmsSettings(smsSettings); }, [smsSettings]);
  useEffect(() => { setLocalEmailSettings(emailSettings); }, [emailSettings]);
  useEffect(() => { setLocalAiSettings(aiSettings); }, [aiSettings]);

  const [newVehicle, setNewVehicle] = useState<Omit<Vehicle, 'id'>>({
    year: 2024,
    make: '',
    model: '',
    color: '',
    pricePerWeek: 0,
    image: '',
    features: [],
    type: 'RIDESHARE',
    isFeatured: false
  });

  const [newFeaturesStr, setNewFeaturesStr] = useState('');

  const menuItems = [
    { id: 'applications', label: 'Applications', icon: <LayoutDashboard size={20} /> },
    { id: 'fleet', label: 'Fleet Management', icon: <Car size={20} /> },
    { id: 'sms', label: 'SMS Alerts', icon: <MessageSquare size={20} /> },
    { id: 'email', label: 'Email Settings', icon: <Mail size={20} /> },
    { id: 'ai-settings', label: 'AI Configuration', icon: <Settings size={20} /> },
    { id: 'profile', label: 'Profile Settings', icon: <UserIcon size={20} /> }
  ];

  const handleAddVehicleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalVehicle = { 
      ...newVehicle, 
      features: newFeaturesStr.split(',').map(f => f.trim()).filter(f => f !== '')
    };
    onAddVehicle(finalVehicle);
    setIsAddingVehicle(false);
    setNewVehicle({ year: 2024, make: '', model: '', color: '', pricePerWeek: 0, image: '', features: [], type: 'RIDESHARE', isFeatured: false });
    setNewFeaturesStr('');
    setSaveSuccess('Vehicle registered successfully!');
    setTimeout(() => setSaveSuccess(null), 3000);
  };

  const startEditVehicle = (v: Vehicle) => {
    setEditingVehicleId(v.id);
    setEditVehicleData(v);
    setNewFeaturesStr(v.features.join(', '));
  };

  const handleSaveEditVehicle = () => {
    if (editingVehicleId) {
      const updated = { 
        ...editVehicleData, 
        features: newFeaturesStr.split(',').map(f => f.trim()).filter(f => f !== '')
      };
      onEditVehicle(editingVehicleId, updated);
      setEditingVehicleId(null);
      setSaveSuccess('Vehicle asset updated.');
      setTimeout(() => setSaveSuccess(null), 3000);
    }
  };

  const handleSaveEditApp = () => {
    if (viewingAppId) {
      onEditApp(viewingAppId, editFormData);
      setViewingAppId(null);
      setSaveSuccess('Application updated.');
      setTimeout(() => setSaveSuccess(null), 3000);
    }
  };

  const handleAiSave = () => {
    onUpdateAI(localAiSettings);
    setSaveSuccess('AI configuration saved.');
    setTimeout(() => setSaveSuccess(null), 3000);
  };

  const filteredApps = applications.filter(app => 
    app.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    app.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-[calc(100vh-80px)] overflow-hidden bg-slate-50 text-slate-900 relative">
      <aside className="w-64 bg-[#020617] text-white flex flex-col shrink-0">
        <div className="p-8 border-b border-white/5">
          <h2 className="font-black text-[10px] tracking-[0.3em] uppercase text-slate-500 mb-1">Administrative</h2>
          <h1 className="text-sm font-black text-white uppercase tracking-widest">Fleet Hub</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2 mt-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest
                ${activeTab === item.id ? 'bg-red-600 text-white shadow-xl shadow-red-600/20' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 overflow-y-auto p-12">
        <div className="flex justify-between items-start mb-12">
          <div>
             <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase mb-2">
               {activeTab.replace(/-/g, ' ').replace(/([A-Z])/g, ' $1')}
             </h1>
             <div className="flex items-center gap-2">
               <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
               <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">Live Database Connection</p>
               {saveSuccess && <span className="text-emerald-500 text-[10px] font-black uppercase ml-4 animate-fadeIn">✔ {saveSuccess}</span>}
             </div>
          </div>
        </div>

        {activeTab === 'applications' && (
          <div className="space-y-6">
            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl overflow-hidden">
              <div className="p-10 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Active Applications</h3>
                </div>
                <div className="relative">
                  <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search drivers..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 pr-6 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold uppercase outline-none focus:ring-4 focus:ring-blue-50 transition-all w-full md:w-80" 
                  />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50/50">
                      <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Driver Profile</th>
                      <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Forensic ID</th>
                      <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                      <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredApps.map(app => (
                      <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-10 py-8">
                          <div className="text-sm font-black text-slate-900 uppercase">{app.fullName}</div>
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{app.email}</div>
                        </td>
                        <td className="px-10 py-8">
                           <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest
                              ${app.verificationStatus === 'PASS' ? 'text-emerald-600' : 
                                app.verificationStatus === 'FAIL' ? 'text-red-600' : 'text-slate-400'}`}>
                              {app.verificationStatus === 'PASS' ? <ShieldCheck size={14} /> : 
                               app.verificationStatus === 'FAIL' ? <ShieldAlert size={14} /> : <Eye size={14} />}
                              {app.verificationStatus || 'UNVERIFIED'}
                           </div>
                        </td>
                        <td className="px-10 py-8">
                           <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest 
                            ${app.status === 'PENDING' ? 'bg-amber-100 text-amber-700' : 
                              app.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' : 
                              'bg-red-100 text-red-700'}`}>
                            {app.status}
                          </span>
                        </td>
                        <td className="px-10 py-8 text-right">
                          <div className="flex justify-end gap-3">
                            <button onClick={() => { setViewingAppId(app.id); setEditFormData(app); }} className="w-10 h-10 flex items-center justify-center bg-slate-900 text-white rounded-xl hover:bg-black transition-all shadow-sm"><Edit size={16}/></button>
                            <button onClick={() => onDeleteApp(app.id)} className="w-10 h-10 flex items-center justify-center bg-slate-100 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"><Trash2 size={16}/></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* AI SETTINGS TAB */}
        {activeTab === 'ai-settings' && (
           <div className="max-w-3xl bg-white p-12 rounded-[3rem] border border-slate-200 shadow-2xl space-y-10 animate-fadeIn">
             <div className="flex items-center gap-4 text-red-600">
                <Settings size={32} />
                <h3 className="text-2xl font-black uppercase tracking-tighter">AI Verification Logic</h3>
             </div>
             
             <div className="space-y-8">
                <div>
                   <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-4 block">Selected AI Provider</label>
                   <div className="grid grid-cols-3 gap-4">
                      {(['GEMINI', 'OPENAI', 'CLAUDE'] as AIProvider[]).map(p => (
                        <button 
                          key={p} 
                          onClick={() => setLocalAiSettings({...localAiSettings, provider: p})}
                          className={`p-6 rounded-2xl border-2 font-black text-xs uppercase transition-all
                            ${localAiSettings.provider === p ? 'border-red-600 bg-red-50 text-red-600 shadow-lg' : 'border-slate-100 text-slate-400'}`}
                        >
                          {p}
                        </button>
                      ))}
                   </div>
                </div>

                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-2 block">Provider API Key</label>
                   <div className="relative">
                      <Lock size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input 
                        type="password" 
                        placeholder="sk-..." 
                        value={localAiSettings.apiKey}
                        onChange={(e) => setLocalAiSettings({...localAiSettings, apiKey: e.target.value})}
                        className="w-full pl-14 pr-6 py-5 rounded-2xl bg-slate-50 border border-slate-100 font-mono text-sm focus:ring-4 focus:ring-red-50 outline-none" 
                      />
                   </div>
                   <p className="text-[10px] font-bold text-slate-400 mt-2 leading-relaxed uppercase">Neural core keys are used for real-time forensic ID verification during driver registration.</p>
                </div>

                <button 
                  onClick={handleAiSave}
                  className="w-full bg-slate-900 text-white py-6 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl hover:bg-black transition-all"
                >
                  Save Neural Configuration
                </button>
             </div>
           </div>
        )}

        {/* FLEET TAB */}
        {activeTab === 'fleet' && (
          <div className="space-y-12">
            <div className="flex justify-between items-center bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl">
               <div>
                  <h3 className="text-xl font-black text-slate-900 uppercase">Fleet Inventory</h3>
               </div>
               <button onClick={() => setIsAddingVehicle(!isAddingVehicle)} className="flex items-center gap-3 bg-red-600 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-700 transition-all shadow-xl shadow-red-600/20">
                {isAddingVehicle ? <X size={16} /> : <Plus size={16} />}
                {isAddingVehicle ? 'Cancel' : 'Add Vehicle'}
              </button>
            </div>

            {isAddingVehicle && (
              <form onSubmit={handleAddVehicleSubmit} className="bg-slate-900 text-white p-12 rounded-[3rem] shadow-2xl animate-fadeIn space-y-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-5"><Car size={200} /></div>
                <h3 className="text-3xl font-black uppercase tracking-tighter">New Asset Registration</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                  <input type="number" placeholder="Year" value={newVehicle.year} onChange={e => setNewVehicle({...newVehicle, year: parseInt(e.target.value)})} className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white outline-none" required />
                  <input type="text" placeholder="Make" value={newVehicle.make} onChange={e => setNewVehicle({...newVehicle, make: e.target.value})} className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white outline-none" required />
                  <input type="text" placeholder="Model" value={newVehicle.model} onChange={e => setNewVehicle({...newVehicle, model: e.target.value})} className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white outline-none" required />
                  <input type="number" placeholder="Weekly Rate" value={newVehicle.pricePerWeek} onChange={e => setNewVehicle({...newVehicle, pricePerWeek: parseInt(e.target.value)})} className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white outline-none" required />
                  <input type="text" placeholder="Image URL" value={newVehicle.image} onChange={e => setNewVehicle({...newVehicle, image: e.target.value})} className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white outline-none" required />
                  <select value={newVehicle.type} onChange={e => setNewVehicle({...newVehicle, type: e.target.value as any})} className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 font-black text-[10px] uppercase text-white outline-none">
                    <option value="RIDESHARE">Rental Only</option>
                    <option value="RENT_TO_OWN">Rent to Own</option>
                    <option value="BOTH">Both</option>
                  </select>
                </div>
                <div className="relative z-10">
                   <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] mb-2 block">Vehicle Features (Comma separated)</label>
                   <textarea 
                    placeholder="Bluetooth, Backup Camera, Insurance included..." 
                    value={newFeaturesStr}
                    onChange={(e) => setNewFeaturesStr(e.target.value)}
                    className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white outline-none font-bold"
                    rows={3}
                   />
                </div>
                <button type="submit" className="w-full bg-red-600 text-white py-6 rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-2xl hover:bg-red-700 transition-all">Save to Fleet</button>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {vehicles.map(v => (
                <div key={v.id} className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-2xl flex flex-col group">
                  <div className="relative mb-8 rounded-[2rem] overflow-hidden aspect-video bg-slate-50">
                    <img src={v.image} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-black uppercase text-slate-900">{v.year} {v.make} {v.model}</h4>
                    <div className="flex flex-wrap gap-2 mt-4">
                       {v.features.slice(0, 3).map((f, i) => (
                         <span key={i} className="px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-[9px] font-black uppercase tracking-widest">{f}</span>
                       ))}
                    </div>
                  </div>
                  <div className="flex gap-3 mt-8">
                    <button onClick={() => startEditVehicle(v)} className="flex-1 flex items-center justify-center gap-2 bg-slate-900 text-white py-4 rounded-2xl text-[10px] font-black uppercase"><Edit size={14} /> Edit</button>
                    <button onClick={() => onDeleteVehicle(v.id)} className="w-14 flex items-center justify-center bg-red-50 text-red-600 py-4 rounded-2xl hover:bg-red-600 hover:text-white transition-all"><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Edit Application Modal */}
        {viewingAppId && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-scaleIn">
              <div className="p-10 border-b border-slate-50 flex justify-between items-center">
                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Review <span className="text-red-600">Application</span></h3>
                <button onClick={() => setViewingAppId(null)} className="p-2 hover:bg-slate-100 rounded-xl transition-all"><X /></button>
              </div>
              <div className="p-10 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                
                {editFormData.verificationStatus && (
                   <div className={`p-8 rounded-[2rem] border-2 flex flex-col gap-4 HUD-style
                    ${editFormData.verificationStatus === 'PASS' ? 'border-emerald-500/30 bg-emerald-50 text-emerald-800' : 'border-red-500/30 bg-red-50 text-red-800'}`}>
                      <div className="flex items-center justify-between">
                         <span className="text-[10px] font-black uppercase tracking-[0.3em]">AI Forensic Verification</span>
                         <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest
                          ${editFormData.verificationStatus === 'PASS' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'}`}>
                          {editFormData.verificationStatus}
                         </span>
                      </div>
                      <p className="text-sm font-bold uppercase italic">{editFormData.verificationReasoning}</p>
                   </div>
                )}

                <div className="grid grid-cols-2 gap-8">
                   <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Name</label>
                      <input type="text" value={editFormData.fullName} onChange={e => setEditFormData({...editFormData, fullName: e.target.value})} className="w-full px-5 py-3 rounded-2xl bg-slate-50 border border-slate-100 font-bold" />
                   </div>
                   <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Status</label>
                      <select value={editFormData.status} onChange={e => setEditFormData({...editFormData, status: e.target.value as any})} className="w-full px-5 py-3 rounded-2xl bg-slate-50 border border-slate-100 font-bold uppercase text-xs">
                         <option value="PENDING">PENDING</option>
                         <option value="APPROVED">APPROVED</option>
                         <option value="REJECTED">REJECTED</option>
                      </select>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">ID Front</span>
                      <div className="h-40 bg-slate-100 rounded-2xl overflow-hidden border border-slate-200">
                         {editFormData.licenseFront ? <img src={editFormData.licenseFront} className="w-full h-full object-cover" /> : <div className="h-full flex items-center justify-center text-slate-300 font-bold">MISSING</div>}
                      </div>
                   </div>
                   <div className="space-y-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">ID Back</span>
                      <div className="h-40 bg-slate-100 rounded-2xl overflow-hidden border border-slate-200">
                         {editFormData.licenseBack ? <img src={editFormData.licenseBack} className="w-full h-full object-cover" /> : <div className="h-full flex items-center justify-center text-slate-300 font-bold">MISSING</div>}
                      </div>
                   </div>
                </div>
              </div>
              <div className="p-10 border-t border-slate-50 bg-slate-50 flex justify-end gap-4">
                 <button onClick={() => setViewingAppId(null)} className="px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400">Cancel</button>
                 <button onClick={handleSaveEditApp} className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl">Save Changes</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPanel;
