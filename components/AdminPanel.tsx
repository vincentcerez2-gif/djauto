
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Users as UsersIcon, Car, MessageSquare, Mail, Menu, Search, Plus, 
  Edit, Trash2, Check, X, Star, Save, Phone, AtSign, MapPin, 
  User as UserIcon, Lock, CheckCircle2, ChevronRight, Info, Eye, Settings, ShieldAlert, ShieldCheck, Camera
} from 'lucide-react';
import { Vehicle, Application, SMSSettings, EmailSettings, AdminProfile, AISettings, AIProvider, SystemUser, UserRole } from '../types';

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
  systemUsers: SystemUser[];
  onAddSystemUser: (user: Omit<SystemUser, 'id' | 'createdAt'>) => void;
  onDeleteSystemUser: (id: string) => void;
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
  onUpdateAI,
  systemUsers,
  onAddSystemUser,
  onDeleteSystemUser
}) => {
  const [activeTab, setActiveTab] = useState('applications');
  const [isAddingVehicle, setIsAddingVehicle] = useState(false);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [editingVehicleId, setEditingVehicleId] = useState<string | null>(null);
  const [viewingAppId, setViewingAppId] = useState<string | null>(null);
  
  // Form States
  const [editFormData, setEditFormData] = useState<Partial<Application>>({});
  const [editVehicleData, setEditVehicleData] = useState<Partial<Vehicle>>({});
  const [localSmsSettings, setLocalSmsSettings] = useState<SMSSettings>(smsSettings);
  const [localEmailSettings, setLocalEmailSettings] = useState<EmailSettings>(emailSettings);
  const [localAiSettings, setLocalAiSettings] = useState<AISettings>(aiSettings);
  const [profileForm, setProfileForm] = useState<AdminProfile>(adminProfile);
  const [userForm, setUserForm] = useState<Omit<SystemUser, 'id' | 'createdAt'>>({ fullName: '', email: '', role: 'EDITOR' });
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => { setLocalSmsSettings(smsSettings); }, [smsSettings]);
  useEffect(() => { setLocalEmailSettings(emailSettings); }, [emailSettings]);
  useEffect(() => { setLocalAiSettings(aiSettings); }, [aiSettings]);
  useEffect(() => { setProfileForm(adminProfile); }, [adminProfile]);

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
    { id: 'users', label: 'System Users', icon: <UsersIcon size={20} /> },
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

  const handleAddUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddSystemUser(userForm);
    setIsAddingUser(false);
    setUserForm({ fullName: '', email: '', role: 'EDITOR' });
    setSaveSuccess('User added successfully!');
    setTimeout(() => setSaveSuccess(null), 3000);
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(profileForm);
    setSaveSuccess('Profile updated successfully!');
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

  const filteredApps = applications.filter(app => 
    app.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    app.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-[calc(100vh-80px)] overflow-hidden bg-slate-50 text-slate-900 relative">
      <aside className="w-64 bg-[#020617] text-white flex flex-col shrink-0">
        <div className="p-8 border-b border-white/5">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center overflow-hidden border-2 border-white/20">
              {profileForm.image ? (
                <img src={profileForm.image} alt="Admin" className="w-full h-full object-cover" />
              ) : (
                <UserIcon size={20} />
              )}
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Connected</p>
              <p className="text-xs font-bold text-white truncate max-w-[120px]">{profileForm.name}</p>
            </div>
          </div>
          <h2 className="font-black text-[10px] tracking-[0.3em] uppercase text-slate-500 mb-1">Administrative</h2>
          <h1 className="text-sm font-black text-white uppercase tracking-widest">Fleet Hub</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2 mt-4 overflow-y-auto custom-scrollbar">
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

      <main className="flex-1 overflow-y-auto p-12 custom-scrollbar">
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

        {/* APPLICATIONS TAB */}
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

        {/* FLEET MANAGEMENT TAB */}
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

            {editingVehicleId && (
              <div className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-200 animate-fadeIn mb-12 shadow-xl">
                 <div className="flex justify-between items-center mb-8">
                    <h3 className="text-2xl font-black uppercase tracking-tight text-slate-900">Modify Vehicle Specs</h3>
                    <button onClick={() => setEditingVehicleId(null)} className="p-2 hover:bg-white rounded-xl transition-all"><X /></button>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <input type="number" placeholder="Year" value={editVehicleData.year} onChange={e => setEditVehicleData({...editVehicleData, year: parseInt(e.target.value)})} className="w-full px-5 py-4 rounded-2xl bg-white border border-slate-200 font-bold" />
                    <input type="text" placeholder="Make" value={editVehicleData.make} onChange={e => setEditVehicleData({...editVehicleData, make: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-white border border-slate-200 font-bold" />
                    <input type="text" placeholder="Model" value={editVehicleData.model} onChange={e => setEditVehicleData({...editVehicleData, model: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-white border border-slate-200 font-bold" />
                    <input type="number" placeholder="Weekly Rate" value={editVehicleData.pricePerWeek} onChange={e => setEditVehicleData({...editVehicleData, pricePerWeek: parseInt(e.target.value)})} className="w-full px-5 py-4 rounded-2xl bg-white border border-slate-200 font-bold" />
                    <input type="text" placeholder="Image URL" value={editVehicleData.image} onChange={e => setEditVehicleData({...editVehicleData, image: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-white border border-slate-200 font-bold" />
                    <select value={editVehicleData.type} onChange={e => setEditVehicleData({...editVehicleData, type: e.target.value as any})} className="w-full px-5 py-4 rounded-2xl bg-white border border-slate-200 font-black text-xs uppercase">
                      <option value="RIDESHARE">Rental Only</option>
                      <option value="RENT_TO_OWN">Rent to Own</option>
                      <option value="BOTH">Both</option>
                    </select>
                 </div>
                 <div className="mt-6">
                    <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">Vehicle Features (Comma separated)</label>
                    <textarea 
                      placeholder="Bluetooth, Backup Camera..." 
                      value={newFeaturesStr}
                      onChange={(e) => setNewFeaturesStr(e.target.value)}
                      className="w-full px-5 py-4 rounded-2xl bg-white border border-slate-200 font-bold"
                      rows={3}
                    />
                 </div>
                 <div className="mt-8 flex gap-4">
                    <button onClick={handleSaveEditVehicle} className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-black/10">Synchronize Registry</button>
                    <button onClick={() => setEditingVehicleId(null)} className="px-10 py-4 border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-white">Discard</button>
                 </div>
              </div>
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
                       {v.features.map((f, i) => (
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

        {/* SYSTEM USERS TAB */}
        {activeTab === 'users' && (
          <div className="space-y-12">
            <div className="flex justify-between items-center bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl">
               <div>
                  <h3 className="text-xl font-black text-slate-900 uppercase">System Operators</h3>
               </div>
               <button onClick={() => setIsAddingUser(!isAddingUser)} className="flex items-center gap-3 bg-red-600 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-700 transition-all shadow-xl shadow-red-600/20">
                {isAddingUser ? <X size={16} /> : <Plus size={16} />}
                {isAddingUser ? 'Cancel' : 'Add Operator'}
              </button>
            </div>

            {isAddingUser && (
              <form onSubmit={handleAddUserSubmit} className="bg-slate-900 text-white p-12 rounded-[3rem] shadow-2xl animate-fadeIn space-y-8 max-w-2xl mx-auto">
                <h3 className="text-2xl font-black uppercase tracking-tighter">New Operator Details</h3>
                <div className="space-y-4">
                  <input type="text" placeholder="Full Name" value={userForm.fullName} onChange={e => setUserForm({...userForm, fullName: e.target.value})} className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white outline-none" required />
                  <input type="email" placeholder="Email Address" value={userForm.email} onChange={e => setUserForm({...userForm, email: e.target.value})} className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white outline-none" required />
                  <select value={userForm.role} onChange={e => setUserForm({...userForm, role: e.target.value as UserRole})} className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white outline-none font-black text-xs uppercase">
                    <option value="MANAGER">Manager</option>
                    <option value="EDITOR">Editor</option>
                  </select>
                </div>
                <button type="submit" className="w-full bg-red-600 text-white py-6 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-700 transition-all">Provision Access</button>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {systemUsers.map(user => (
                <div key={user.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-2xl flex flex-col justify-between">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black uppercase text-sm">
                      {user.fullName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 uppercase tracking-tight">{user.fullName}</h4>
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{user.role}</p>
                    </div>
                  </div>
                  <div className="space-y-2 mb-8">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Email: <span className="text-slate-900 font-bold">{user.email}</span></p>
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Added: <span className="text-slate-900 font-bold">{user.createdAt}</span></p>
                  </div>
                  <button onClick={() => onDeleteSystemUser(user.id)} className="w-full py-3 rounded-2xl bg-red-50 text-red-600 font-black text-[10px] uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all">Revoke Access</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SMS SETTINGS TAB */}
        {activeTab === 'sms' && (
          <div className="max-w-3xl bg-white p-12 rounded-[3rem] border border-slate-200 shadow-2xl space-y-10 animate-fadeIn">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-black uppercase tracking-tighter">SMS Alert Configuration</h3>
              <label className="flex items-center cursor-pointer">
                <div className="relative">
                  <input type="checkbox" className="sr-only" checked={localSmsSettings.enabled} onChange={() => setLocalSmsSettings({ ...localSmsSettings, enabled: !localSmsSettings.enabled })} />
                  <div className={`block w-14 h-8 rounded-full transition-colors ${localSmsSettings.enabled ? 'bg-red-600' : 'bg-slate-200'}`}></div>
                  <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${localSmsSettings.enabled ? 'translate-x-6' : ''}`}></div>
                </div>
              </label>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-2 block">Twilio Account SID</label>
                  <input type="text" value={localSmsSettings.twilioAccountSid} onChange={e => setLocalSmsSettings({...localSmsSettings, twilioAccountSid: e.target.value})} className="w-full px-5 py-3 rounded-2xl bg-slate-50 border border-slate-100 font-mono text-xs" placeholder="AC..." />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-2 block">Twilio Auth Token</label>
                  <input type="password" value={localSmsSettings.twilioAuthToken} onChange={e => setLocalSmsSettings({...localSmsSettings, twilioAuthToken: e.target.value})} className="w-full px-5 py-3 rounded-2xl bg-slate-50 border border-slate-100 font-mono text-xs" placeholder="••••••••" />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-2 block">Twilio Phone Number</label>
                <input type="text" value={localSmsSettings.twilioFromNumber} onChange={e => setLocalSmsSettings({...localSmsSettings, twilioFromNumber: e.target.value})} className="w-full px-5 py-3 rounded-2xl bg-slate-50 border border-slate-100 font-bold" placeholder="+1234567890" />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-2 block">Confirmation Template</label>
                <textarea value={localSmsSettings.confirmationTemplate} onChange={e => setLocalSmsSettings({...localSmsSettings, confirmationTemplate: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold text-sm" rows={4} />
                <p className="text-[10px] text-slate-400 mt-2 font-black uppercase">Tags: {'{name}, {program}, {vehicle}'}</p>
              </div>
              <button onClick={() => { onUpdateSms(localSmsSettings); setSaveSuccess('SMS configurations saved.'); setTimeout(() => setSaveSuccess(null), 3000); }} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-black transition-all">Synchronize SMS Protocol</button>
            </div>
          </div>
        )}

        {/* EMAIL SETTINGS TAB */}
        {activeTab === 'email' && (
          <div className="max-w-3xl bg-white p-12 rounded-[3rem] border border-slate-200 shadow-2xl space-y-10 animate-fadeIn">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-black uppercase tracking-tighter">SMTP Relay Configuration</h3>
              <label className="flex items-center cursor-pointer">
                <div className="relative">
                  <input type="checkbox" className="sr-only" checked={localEmailSettings.enabled} onChange={() => setLocalEmailSettings({ ...localEmailSettings, enabled: !localEmailSettings.enabled })} />
                  <div className={`block w-14 h-8 rounded-full transition-colors ${localEmailSettings.enabled ? 'bg-red-600' : 'bg-slate-200'}`}></div>
                  <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${localEmailSettings.enabled ? 'translate-x-6' : ''}`}></div>
                </div>
              </label>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-2 block">SMTP Host</label>
                  <input type="text" value={localEmailSettings.smtpHost} onChange={e => setLocalEmailSettings({...localEmailSettings, smtpHost: e.target.value})} className="w-full px-5 py-3 rounded-2xl bg-slate-50 border border-slate-100 font-bold" placeholder="smtp.gmail.com" />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-2 block">SMTP Port</label>
                  <input type="text" value={localEmailSettings.smtpPort} onChange={e => setLocalEmailSettings({...localEmailSettings, smtpPort: e.target.value})} className="w-full px-5 py-3 rounded-2xl bg-slate-50 border border-slate-100 font-bold" placeholder="587" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-2 block">SMTP Username</label>
                  <input type="text" value={localEmailSettings.smtpUser} onChange={e => setLocalEmailSettings({...localEmailSettings, smtpUser: e.target.value})} className="w-full px-5 py-3 rounded-2xl bg-slate-50 border border-slate-100 font-bold" />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-2 block">SMTP Password</label>
                  <input type="password" value={localEmailSettings.smtpPass} onChange={e => setLocalEmailSettings({...localEmailSettings, smtpPass: e.target.value})} className="w-full px-5 py-3 rounded-2xl bg-slate-50 border border-slate-100 font-bold" placeholder="••••••••" />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-2 block">Outgoing Template</label>
                <textarea value={localEmailSettings.confirmationTemplate} onChange={e => setLocalEmailSettings({...localEmailSettings, confirmationTemplate: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold text-sm" rows={4} />
              </div>
              <button onClick={() => { onUpdateEmail(localEmailSettings); setSaveSuccess('Email configurations saved.'); setTimeout(() => setSaveSuccess(null), 3000); }} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-black transition-all">Synchronize SMTP Protocol</button>
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
                  onClick={() => { onUpdateAI(localAiSettings); setSaveSuccess('AI logic synchronized.'); setTimeout(() => setSaveSuccess(null), 3000); }}
                  className="w-full bg-slate-900 text-white py-6 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl hover:bg-black transition-all"
                >
                  Save Neural Configuration
                </button>
             </div>
           </div>
        )}

        {/* PROFILE SETTINGS TAB */}
        {activeTab === 'profile' && (
          <div className="max-w-3xl bg-white p-12 rounded-[3rem] border border-slate-200 shadow-2xl space-y-10 animate-fadeIn">
            <h3 className="text-2xl font-black uppercase tracking-tighter">Profile Configuration</h3>
            <form onSubmit={handleProfileSave} className="space-y-8">
              <div className="flex items-center gap-8 mb-8">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-[2.5rem] bg-slate-100 border-2 border-slate-200 overflow-hidden flex items-center justify-center">
                    {profileForm.image ? (
                      <img src={profileForm.image} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <UserIcon size={48} className="text-slate-300" />
                    )}
                  </div>
                  <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-[2.5rem] cursor-pointer">
                    <Camera size={24} className="text-white" />
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => setProfileForm({ ...profileForm, image: reader.result as string });
                        reader.readAsDataURL(file);
                      }
                    }} />
                  </label>
                </div>
                <div>
                  <h4 className="font-black text-lg uppercase tracking-tight">{profileForm.name || 'Admin User'}</h4>
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Master Authority Account</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-2 block">Display Name</label>
                  <input type="text" value={profileForm.name} onChange={e => setProfileForm({...profileForm, name: e.target.value})} className="w-full px-5 py-3 rounded-2xl bg-slate-50 border border-slate-100 font-bold" />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-2 block">Username</label>
                  <input type="text" value={profileForm.username} onChange={e => setProfileForm({...profileForm, username: e.target.value})} className="w-full px-5 py-3 rounded-2xl bg-slate-50 border border-slate-100 font-bold" />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-2 block">Primary Email</label>
                  <input type="email" value={profileForm.email} onChange={e => setProfileForm({...profileForm, email: e.target.value})} className="w-full px-5 py-3 rounded-2xl bg-slate-50 border border-slate-100 font-bold" />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-2 block">New Password</label>
                  <input type="password" value={profileForm.password} onChange={e => setProfileForm({...profileForm, password: e.target.value})} className="w-full px-5 py-3 rounded-2xl bg-slate-50 border border-slate-100 font-bold" placeholder="••••••••" />
                </div>
              </div>

              <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-black transition-all">Update Executive Credentials</button>
            </form>
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
                   <div className={`p-8 rounded-[2rem] border-2 flex flex-col gap-4
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
