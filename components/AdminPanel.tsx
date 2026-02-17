
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Users, Car, MessageSquare, Mail, Menu, Search, Plus, 
  Edit, Trash2, Check, X, Star, Save, Phone, AtSign, MapPin, 
  User as UserIcon, Lock, CheckCircle2, ChevronRight, Info 
} from 'lucide-react';
import { Vehicle, Application, SMSSettings, EmailSettings, AdminProfile } from '../types';

interface AdminPanelProps {
  vehicles: Vehicle[];
  applications: Application[];
  onUpdateApp: (id: string, status: 'APPROVED' | 'REJECTED') => void;
  onDeleteApp: (id: string) => void;
  onEditApp: (id: string, updatedData: Partial<Application>) => void;
  onAddVehicle: (v: Vehicle) => void;
  onEditVehicle: (id: string, v: Partial<Vehicle>) => void;
  onDeleteVehicle: (id: string) => void;
  smsSettings: SMSSettings;
  onUpdateSms: (s: SMSSettings) => void;
  emailSettings: EmailSettings;
  onUpdateEmail: (e: EmailSettings) => void;
  adminProfile: AdminProfile;
  onUpdateProfile: (p: AdminProfile) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  vehicles, 
  applications, 
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
  onUpdateProfile
}) => {
  const [activeTab, setActiveTab] = useState('applications');
  const [isAddingVehicle, setIsAddingVehicle] = useState(false);
  const [editingVehicleId, setEditingVehicleId] = useState<string | null>(null);
  const [editingAppId, setEditingAppId] = useState<string | null>(null);
  
  // Form States
  const [editFormData, setEditFormData] = useState<Partial<Application>>({});
  const [editVehicleData, setEditVehicleData] = useState<Partial<Vehicle>>({});
  const [localSmsSettings, setLocalSmsSettings] = useState<SMSSettings>(smsSettings);
  const [localEmailSettings, setLocalEmailSettings] = useState<EmailSettings>(emailSettings);
  const [profileForm, setProfileForm] = useState<AdminProfile>(adminProfile);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  useEffect(() => {
    setLocalSmsSettings(smsSettings);
  }, [smsSettings]);

  useEffect(() => {
    setLocalEmailSettings(emailSettings);
  }, [emailSettings]);

  const [newVehicle, setNewVehicle] = useState<Omit<Vehicle, 'id'>>({
    year: 2024,
    make: '',
    model: '',
    color: '',
    pricePerWeek: 0,
    image: '',
    features: ['Insurance Included', 'Rideshare Ready'],
    type: 'RIDESHARE',
    isFeatured: false
  });

  const menuItems = [
    { id: 'applications', label: 'Applications', icon: <LayoutDashboard size={20} /> },
    { id: 'fleet', label: 'Fleet Management', icon: <Car size={20} /> },
    { id: 'sms', label: 'SMS Alerts', icon: <MessageSquare size={20} /> },
    { id: 'email', label: 'Email Settings', icon: <Mail size={20} /> },
    { id: 'profile', label: 'Profile Settings', icon: <UserIcon size={20} /> }
  ];

  const handleAddVehicleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddVehicle({ ...newVehicle, id: `VEH-${Date.now()}` });
    setIsAddingVehicle(false);
    setSaveSuccess('Vehicle registered successfully!');
    setTimeout(() => setSaveSuccess(null), 3000);
  };

  const startEditVehicle = (v: Vehicle) => {
    setEditingVehicleId(v.id);
    setEditVehicleData(v);
  };

  const handleSaveEditVehicle = () => {
    if (editingVehicleId) {
      onEditVehicle(editingVehicleId, editVehicleData);
      setEditingVehicleId(null);
      setSaveSuccess('Vehicle asset updated.');
      setTimeout(() => setSaveSuccess(null), 3000);
    }
  };

  const startEditApp = (app: Application) => {
    setEditingAppId(app.id);
    setEditFormData(app);
  };

  const handleSaveEditApp = () => {
    if (editingAppId) {
      onEditApp(editingAppId, editFormData);
      setEditingAppId(null);
      setSaveSuccess('Application modified.');
      setTimeout(() => setSaveSuccess(null), 3000);
    }
  };

  const handleSmsSave = () => {
    onUpdateSms(localSmsSettings);
    setSaveSuccess('SMS protocols saved.');
    setTimeout(() => setSaveSuccess(null), 3000);
  };

  const handleEmailSave = () => {
    onUpdateEmail(localEmailSettings);
    setSaveSuccess('Email alerts updated.');
    setTimeout(() => setSaveSuccess(null), 3000);
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(profileForm);
    setSaveSuccess('Profile synchronized.');
    setTimeout(() => setSaveSuccess(null), 3000);
  };

  return (
    <div className="flex h-[calc(100vh-80px)] overflow-hidden bg-slate-50 text-slate-900">
      {/* Sidebar */}
      <aside className="w-64 bg-[#020617] text-white flex flex-col shrink-0">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <h2 className="font-black text-sm tracking-[0.2em] uppercase">Fleet Manager</h2>
          <Menu size={20} className="text-white/40" />
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-xs uppercase tracking-widest
                ${activeTab === item.id ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-10">
        <div className="flex justify-between items-start mb-10">
          <div>
             <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-2">
               {activeTab.charAt(0).toUpperCase() + activeTab.slice(1).replace(/([A-Z])/g, ' $1')} Hub
             </h1>
             <div className="flex items-center gap-2">
               <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">Live Database Connection: Supabase</p>
               {saveSuccess && <span className="text-emerald-500 text-[10px] font-black uppercase animate-fadeIn">• {saveSuccess}</span>}
             </div>
          </div>
        </div>

        {/* APPLICATIONS TAB */}
        {activeTab === 'applications' && (
          <div className="space-y-6">
            {editingAppId && (
              <div className="bg-white p-8 rounded-3xl border border-blue-200 shadow-2xl mb-8 animate-fadeIn">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-black text-slate-900 uppercase tracking-tight">Edit Applicant Profile</h3>
                  <button onClick={() => setEditingAppId(null)} className="text-slate-400 hover:text-red-500"><X /></button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <input type="text" placeholder="Full Name" value={editFormData.fullName} onChange={e => setEditFormData({...editFormData, fullName: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200" />
                  <input type="text" placeholder="Phone" value={editFormData.phone} onChange={e => setEditFormData({...editFormData, phone: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200" />
                  <input type="text" placeholder="Email" value={editFormData.email} onChange={e => setEditFormData({...editFormData, email: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200" />
                </div>
                <div className="flex justify-end gap-4 mt-8">
                  <button onClick={handleSaveEditApp} className="flex items-center gap-2 bg-slate-900 text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg">
                    <Save size={16} /> Update Client
                  </button>
                </div>
              </div>
            )}

            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden">
              <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-black text-slate-900 uppercase tracking-tight">System Ledger</h3>
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="text" placeholder="Search Applications..." className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none" />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50/50">
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Client Info</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Type & Goal</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Decision Status</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Utility</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {applications.map(app => (
                      <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-8 py-6">
                          <div className="text-sm font-bold text-slate-900">{app.fullName}</div>
                          <div className="flex flex-col gap-1 mt-1 text-[10px] font-bold text-slate-400 uppercase">
                            <span><Phone size={10} className="inline mr-1" /> {app.phone}</span>
                            <span><AtSign size={10} className="inline mr-1" /> {app.email}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="text-xs font-black text-slate-700 uppercase tracking-tight">{app.program}</div>
                          <div className="text-[10px] font-bold text-red-600 uppercase mt-1">Platform: {app.targetPlatform}</div>
                        </td>
                        <td className="px-8 py-6">
                           <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase 
                            ${app.status === 'PENDING' ? 'bg-amber-100 text-amber-700' : 
                              app.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' : 
                              'bg-red-100 text-red-700'}`}>
                            {app.status}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <div className="flex justify-end gap-2">
                            {app.status === 'PENDING' && (
                              <>
                                <button onClick={() => onUpdateApp(app.id, 'APPROVED')} className="p-2 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200 transition-all"><Check size={16}/></button>
                                <button onClick={() => onUpdateApp(app.id, 'REJECTED')} className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all"><X size={16}/></button>
                              </>
                            )}
                            <button onClick={() => startEditApp(app)} className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-all"><Edit size={16}/></button>
                            <button onClick={() => onDeleteApp(app.id)} className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-all"><Trash2 size={16}/></button>
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

        {/* FLEET TAB */}
        {activeTab === 'fleet' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <button 
                onClick={() => setIsAddingVehicle(!isAddingVehicle)}
                className="flex items-center gap-2 bg-slate-900 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl"
              >
                {isAddingVehicle ? <X size={16} /> : <Plus size={16} />}
                {isAddingVehicle ? 'Cancel' : 'Register Vehicle'}
              </button>
            </div>

            {/* Editing Form */}
            {editingVehicleId && (
              <div className="bg-white p-10 rounded-[2.5rem] border border-red-200 shadow-2xl animate-fadeIn space-y-8">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-black uppercase text-red-600">Modify Vehicle Details</h3>
                  <button onClick={() => setEditingVehicleId(null)}><X size={20} className="text-slate-400" /></button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <input type="number" placeholder="Year" value={editVehicleData.year} onChange={e => setEditVehicleData({...editVehicleData, year: parseInt(e.target.value)})} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200" />
                  <input type="text" placeholder="Make" value={editVehicleData.make} onChange={e => setEditVehicleData({...editVehicleData, make: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200" />
                  <input type="text" placeholder="Model" value={editVehicleData.model} onChange={e => setEditVehicleData({...editVehicleData, model: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200" />
                  <input type="number" placeholder="Price / Week" value={editVehicleData.pricePerWeek} onChange={e => setEditVehicleData({...editVehicleData, pricePerWeek: parseInt(e.target.value)})} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200" />
                  <input type="text" placeholder="Image URL" value={editVehicleData.image} onChange={e => setEditVehicleData({...editVehicleData, image: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200" />
                  <select value={editVehicleData.type} onChange={e => setEditVehicleData({...editVehicleData, type: e.target.value as any})} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200">
                    <option value="RIDESHARE">Rideshare</option>
                    <option value="RENT_TO_OWN">Rent to Own</option>
                  </select>
                </div>
                <button onClick={handleSaveEditVehicle} className="bg-red-600 text-white px-10 py-4 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg">Save Asset Updates</button>
              </div>
            )}

            {isAddingVehicle && (
              <form onSubmit={handleAddVehicleSubmit} className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-2xl animate-fadeIn space-y-8">
                <h3 className="text-xl font-black uppercase">Asset Registration</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <input type="number" placeholder="Year" value={newVehicle.year} onChange={e => setNewVehicle({...newVehicle, year: parseInt(e.target.value)})} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200" />
                  <input type="text" placeholder="Make" value={newVehicle.make} onChange={e => setNewVehicle({...newVehicle, make: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200" />
                  <input type="text" placeholder="Model" value={newVehicle.model} onChange={e => setNewVehicle({...newVehicle, model: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200" />
                  <input type="number" placeholder="Price / Week" value={newVehicle.pricePerWeek} onChange={e => setNewVehicle({...newVehicle, pricePerWeek: parseInt(e.target.value)})} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200" />
                  <input type="text" placeholder="Image URL" value={newVehicle.image} onChange={e => setNewVehicle({...newVehicle, image: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200" />
                  <select value={newVehicle.type} onChange={e => setNewVehicle({...newVehicle, type: e.target.value as any})} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200">
                    <option value="RIDESHARE">Rideshare</option>
                    <option value="RENT_TO_OWN">Rent to Own</option>
                  </select>
                </div>
                <button type="submit" className="bg-red-600 text-white px-10 py-4 rounded-xl font-black text-xs uppercase tracking-widest">Commit to Inventory</button>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {vehicles.map(v => (
                <div key={v.id} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-xl group hover:border-red-500 transition-all">
                  <div className="relative mb-6 rounded-2xl overflow-hidden aspect-video">
                    <img src={v.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <h4 className="font-black uppercase text-slate-900 tracking-tight">{v.year} {v.make} {v.model}</h4>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">${v.pricePerWeek}/WK • {v.type}</p>
                  <div className="flex gap-2">
                    <button onClick={() => startEditVehicle(v)} className="flex-1 bg-slate-900 text-white py-3 rounded-xl text-[10px] font-black uppercase hover:bg-black">Edit</button>
                    <button onClick={() => onDeleteVehicle(v.id)} className="flex-1 bg-red-50 text-red-600 py-3 rounded-xl text-[10px] font-black uppercase hover:bg-red-100">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SMS TAB */}
        {activeTab === 'sms' && (
          <div className="max-w-3xl bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-2xl space-y-8 animate-fadeIn">
            <h3 className="text-xl font-black uppercase flex items-center gap-3"><MessageSquare className="text-red-600" /> Twilio SMS Hub</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <div>
                  <h4 className="font-bold text-slate-900 uppercase text-sm tracking-tight">Auto-Response Protocol</h4>
                  <p className="text-xs text-slate-400 uppercase font-bold tracking-widest mt-1">Automatic SMS on User Submission</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={localSmsSettings.enabled} 
                    onChange={e => setLocalSmsSettings({...localSmsSettings, enabled: e.target.checked})} 
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                </label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" placeholder="Account SID" value={localSmsSettings.twilioAccountSid} onChange={e => setLocalSmsSettings({...localSmsSettings, twilioAccountSid: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs" />
                <input type="text" placeholder="From Phone" value={localSmsSettings.twilioFromNumber} onChange={e => setLocalSmsSettings({...localSmsSettings, twilioFromNumber: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs" />
              </div>
              <input type="password" placeholder="Auth Token" value={localSmsSettings.twilioAuthToken} onChange={e => setLocalSmsSettings({...localSmsSettings, twilioAuthToken: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs" />
              
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Confirmation Template</label>
                <textarea 
                  rows={4}
                  value={localSmsSettings.confirmationTemplate}
                  onChange={e => setLocalSmsSettings({...localSmsSettings, confirmationTemplate: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 font-medium text-sm"
                  placeholder="Variables: {name}, {program}"
                />
                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
                  <p className="text-[10px] font-black text-emerald-700 uppercase mb-1">Preview Logic:</p>
                  <p className="text-xs text-slate-600 italic">"Hi {adminProfile.name || 'John'}, your application for the {vehicles[0]?.type || 'Rent-to-Own'} program has been received!"</p>
                </div>
              </div>

              <button 
                onClick={handleSmsSave}
                className="bg-slate-900 text-white px-10 py-4 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-black/10 hover:bg-black transition-all"
              >
                Save Protocol Config
              </button>
            </div>
          </div>
        )}

        {/* EMAIL TAB */}
        {activeTab === 'email' && (
          <div className="max-w-3xl bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-2xl space-y-8">
            <h3 className="text-xl font-black uppercase flex items-center gap-3"><Mail className="text-red-600" /> Admin Alerts (SMTP)</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <div>
                  <h4 className="font-bold text-slate-900 uppercase text-sm tracking-tight">Status Change Alerts</h4>
                  <p className="text-xs text-slate-400 uppercase font-bold tracking-widest mt-1">Notify Admin on Approval/Rejection</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={localEmailSettings.enabled} onChange={e => setLocalEmailSettings({...localEmailSettings, enabled: e.target.checked})} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                </label>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="SMTP Host" value={localEmailSettings.smtpHost} onChange={e => setLocalEmailSettings({...localEmailSettings, smtpHost: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs" />
                <input type="text" placeholder="Port" value={localEmailSettings.smtpPort} onChange={e => setLocalEmailSettings({...localEmailSettings, smtpPort: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs" />
              </div>
              <input type="text" placeholder="Recipient Admin Email" value={adminProfile.email} disabled className="w-full px-4 py-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-400 font-bold text-xs uppercase" />
              <button onClick={handleEmailSave} className="bg-slate-900 text-white px-10 py-4 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-black/10 hover:bg-black transition-all">Lock SMTP Details</button>
            </div>
          </div>
        )}

        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <div className="max-w-3xl bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-2xl space-y-8 animate-fadeIn">
            <h3 className="text-xl font-black uppercase flex items-center gap-3"><UserIcon className="text-red-600" /> Executive Profile</h3>
            <form onSubmit={handleProfileSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 block">Manager Name</label>
                  <input type="text" value={profileForm.name} onChange={e => setProfileForm({...profileForm, name: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 font-bold" />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 block">Email Address</label>
                  <input type="email" value={profileForm.email} onChange={e => setProfileForm({...profileForm, email: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 font-bold" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 block">Phone</label>
                  <input type="text" value={profileForm.phone} onChange={e => setProfileForm({...profileForm, phone: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 font-bold" />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 block">Manager Password</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="password" value={profileForm.password} onChange={e => setProfileForm({...profileForm, password: e.target.value})} className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 font-bold" />
                  </div>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 block">Regional HQ Address</label>
                <input type="text" value={profileForm.address} onChange={e => setProfileForm({...profileForm, address: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 font-bold" />
              </div>
              <div className="pt-4 flex items-center gap-6">
                <button type="submit" className="bg-slate-900 text-white px-10 py-4 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-black/10 hover:bg-black transition-all">Save Profile Changes</button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPanel;
