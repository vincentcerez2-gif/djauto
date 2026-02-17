
import React, { useState } from 'react';
import { LayoutDashboard, Users, Car, MessageSquare, Mail, Settings, Menu, RefreshCw, Search, Plus, Edit, Trash2, Check, X, ShieldCheck, Star, Save, Phone, AtSign, MapPin, CreditCard, ExternalLink } from 'lucide-react';
import { Vehicle, Application, SMSSettings, EmailSettings } from '../types';

interface AdminPanelProps {
  vehicles: Vehicle[];
  applications: Application[];
  onUpdateApp: (id: string, status: 'APPROVED' | 'REJECTED') => void;
  onDeleteApp: (id: string) => void;
  onEditApp: (id: string, updatedData: Partial<Application>) => void;
  onAddVehicle: (v: Vehicle) => void;
  onDeleteVehicle: (id: string) => void;
  smsSettings: SMSSettings;
  onUpdateSms: (s: SMSSettings) => void;
  emailSettings: EmailSettings;
  onUpdateEmail: (e: EmailSettings) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  vehicles, 
  applications, 
  onUpdateApp,
  onDeleteApp,
  onEditApp,
  onAddVehicle, 
  onDeleteVehicle,
  smsSettings,
  onUpdateSms,
  emailSettings,
  onUpdateEmail
}) => {
  const [activeTab, setActiveTab] = useState('applications');
  const [isAddingVehicle, setIsAddingVehicle] = useState(false);
  const [editingAppId, setEditingAppId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<Application>>({});

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
    { id: 'renters', label: 'Renters', icon: <Users size={20} /> },
    { id: 'sms', label: 'SMS Alerts', icon: <MessageSquare size={20} /> },
    { id: 'email', label: 'Email Settings', icon: <Mail size={20} /> }
  ];

  const handleAddVehicleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddVehicle({
      ...newVehicle,
      id: `VEH-${Date.now()}`
    });
    setIsAddingVehicle(false);
  };

  const startEditApp = (app: Application) => {
    setEditingAppId(app.id);
    setEditFormData(app);
  };

  const handleSaveEditApp = () => {
    if (editingAppId) {
      onEditApp(editingAppId, editFormData);
      setEditingAppId(null);
    }
  };

  return (
    <div className="flex h-[calc(100vh-80px)] overflow-hidden bg-slate-50">
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
               {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Hub
             </h1>
             <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">San Antonio Regional Hub</p>
          </div>
        </div>

        {/* APPLICATIONS TAB */}
        {activeTab === 'applications' && (
          <div className="space-y-6">
            {editingAppId && (
              <div className="bg-white p-8 rounded-3xl border border-blue-200 shadow-2xl mb-8 animate-fadeIn">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-black text-slate-900 uppercase">Edit Application: {editingAppId}</h3>
                  <button onClick={() => setEditingAppId(null)} className="text-slate-400 hover:text-red-500"><X /></button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <input type="text" placeholder="Full Name" value={editFormData.fullName} onChange={e => setEditFormData({...editFormData, fullName: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200" />
                  <input type="text" placeholder="Phone" value={editFormData.phone} onChange={e => setEditFormData({...editFormData, phone: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200" />
                  <input type="text" placeholder="Email" value={editFormData.email} onChange={e => setEditFormData({...editFormData, email: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200" />
                  <input type="text" placeholder="Address" value={editFormData.address} onChange={e => setEditFormData({...editFormData, address: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200" />
                  <input type="text" placeholder="License #" value={editFormData.licenseNumber} onChange={e => setEditFormData({...editFormData, licenseNumber: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200" />
                  <select value={editFormData.program} onChange={e => setEditFormData({...editFormData, program: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200">
                    <option>Standard Rental</option>
                    <option>Rent-To-Own</option>
                  </select>
                </div>
                <div className="flex justify-end gap-4 mt-8">
                  <button onClick={handleSaveEditApp} className="flex items-center gap-2 bg-slate-900 text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest">
                    <Save size={16} /> Save Changes
                  </button>
                </div>
              </div>
            )}

            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden">
              <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-black text-slate-900 uppercase tracking-tight">Recent Submissions</h3>
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="text" placeholder="Filter..." className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none" />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50/50">
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Client Details</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Program & Platform</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {applications.map(app => (
                      <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-8 py-6">
                          <div className="text-sm font-bold text-slate-900">{app.fullName}</div>
                          <div className="flex flex-col gap-1 mt-1">
                            <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase"><Phone size={10} /> {app.phone}</span>
                            <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase"><AtSign size={10} /> {app.email}</span>
                            <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase"><MapPin size={10} /> {app.address}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="text-xs font-black text-slate-700 uppercase tracking-tight">{app.program}</div>
                          <div className="text-[10px] font-bold text-red-600 uppercase mt-1 tracking-widest">Platform: {app.targetPlatform}</div>
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
            <button 
              onClick={() => setIsAddingVehicle(!isAddingVehicle)}
              className="flex items-center gap-2 bg-slate-900 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl"
            >
              {isAddingVehicle ? <X size={16} /> : <Plus size={16} />}
              {isAddingVehicle ? 'Cancel Form' : 'Add New Vehicle'}
            </button>

            {isAddingVehicle && (
              <form onSubmit={handleAddVehicleSubmit} className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-2xl animate-fadeIn space-y-8">
                <h3 className="text-xl font-black uppercase">Fleet Registration</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <input type="number" placeholder="Year" value={newVehicle.year} onChange={e => setNewVehicle({...newVehicle, year: parseInt(e.target.value)})} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200" />
                  <input type="text" placeholder="Make" value={newVehicle.make} onChange={e => setNewVehicle({...newVehicle, make: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200" />
                  <input type="text" placeholder="Model" value={newVehicle.model} onChange={e => setNewVehicle({...newVehicle, model: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200" />
                  <input type="text" placeholder="Color" value={newVehicle.color} onChange={e => setNewVehicle({...newVehicle, color: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200" />
                  <input type="number" placeholder="Price Per Week" value={newVehicle.pricePerWeek} onChange={e => setNewVehicle({...newVehicle, pricePerWeek: parseInt(e.target.value)})} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200" />
                  <input type="text" placeholder="Image URL" value={newVehicle.image} onChange={e => setNewVehicle({...newVehicle, image: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200" />
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={newVehicle.isFeatured} onChange={e => setNewVehicle({...newVehicle, isFeatured: e.target.checked})} className="w-5 h-5 rounded border-slate-300 text-red-600" />
                    <span className="text-xs font-black uppercase tracking-widest text-slate-700">Display as Featured</span>
                  </label>
                </div>
                <button type="submit" className="bg-red-600 text-white px-10 py-4 rounded-xl font-black text-xs uppercase tracking-widest">Confirm Addition</button>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {vehicles.map(v => (
                <div key={v.id} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-xl group hover:border-red-500 transition-all">
                  <div className="relative mb-6 rounded-2xl overflow-hidden aspect-video">
                    <img src={v.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    {v.isFeatured && <div className="absolute top-4 left-4 bg-amber-400 text-slate-900 p-2 rounded-lg"><Star size={14} fill="currentColor" /></div>}
                  </div>
                  <h4 className="font-black uppercase text-slate-900">{v.year} {v.make} {v.model}</h4>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">${v.pricePerWeek}/WEEK</p>
                  <div className="flex gap-2">
                    <button className="flex-1 bg-slate-100 py-3 rounded-xl text-[10px] font-black uppercase hover:bg-slate-200">Edit</button>
                    <button onClick={() => onDeleteVehicle(v.id)} className="flex-1 bg-red-50 text-red-600 py-3 rounded-xl text-[10px] font-black uppercase hover:bg-red-100">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RENTERS TAB */}
        {activeTab === 'renters' && (
          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden">
             <div className="p-8 border-b border-slate-100">
               <h3 className="font-black text-slate-900 uppercase">Active Drivers</h3>
             </div>
             <table className="w-full text-left">
               <thead>
                 <tr className="bg-slate-50/50">
                   <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400">Renter</th>
                   <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400">Platform</th>
                   <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400">License</th>
                   <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400">Active Since</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {applications.filter(a => a.status === 'APPROVED').map(renter => (
                    <tr key={renter.id}>
                      <td className="px-8 py-6">
                        <div className="text-sm font-bold text-slate-900">{renter.fullName}</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase">{renter.phone}</div>
                      </td>
                      <td className="px-8 py-6 text-xs font-black uppercase text-blue-600 tracking-widest">{renter.targetPlatform}</td>
                      <td className="px-8 py-6 text-xs font-bold font-mono text-slate-600">{renter.licenseNumber}</td>
                      <td className="px-8 py-6 text-xs text-slate-500 font-bold uppercase">{renter.date}</td>
                    </tr>
                  ))}
               </tbody>
             </table>
          </div>
        )}

        {/* SMS TAB */}
        {activeTab === 'sms' && (
          <div className="max-w-3xl bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-2xl space-y-8">
            <h3 className="text-xl font-black uppercase flex items-center gap-3"><MessageSquare className="text-red-600" /> Twilio Automation</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <div>
                  <h4 className="font-bold text-slate-900 uppercase text-sm tracking-tight">Enable Confirmation Texts</h4>
                  <p className="text-xs text-slate-400 uppercase font-bold tracking-widest mt-1">Send SMS on application submission</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={smsSettings.enabled} onChange={e => onUpdateSms({...smsSettings, enabled: e.target.checked})} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                </label>
              </div>
              <input type="text" placeholder="Twilio Account SID" value={smsSettings.twilioAccountSid} onChange={e => onUpdateSms({...smsSettings, twilioAccountSid: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 font-mono text-sm" />
              <input type="password" placeholder="Twilio Auth Token" value={smsSettings.twilioAuthToken} onChange={e => onUpdateSms({...smsSettings, twilioAuthToken: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 font-mono text-sm" />
              <input type="text" placeholder="Twilio From Number" value={smsSettings.twilioFromNumber} onChange={e => onUpdateSms({...smsSettings, twilioFromNumber: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 font-mono text-sm" />
              
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Confirmation Template</label>
                <textarea 
                  rows={4}
                  value={smsSettings.confirmationTemplate}
                  onChange={e => onUpdateSms({...smsSettings, confirmationTemplate: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 font-medium text-sm outline-none focus:ring-2 focus:ring-red-500/20"
                  placeholder="Variables: {name}, {program}"
                />
                <p className="text-[10px] text-slate-400 italic">Available variables: {'{name}, {program}'}</p>
              </div>

              <button className="bg-slate-900 text-white px-10 py-4 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-black/10">Update Config</button>
            </div>
          </div>
        )}

        {/* EMAIL TAB */}
        {activeTab === 'email' && (
          <div className="max-w-3xl bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-2xl space-y-8">
            <h3 className="text-xl font-black uppercase flex items-center gap-3"><Mail className="text-red-600" /> SMTP Email Settings</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <div>
                  <h4 className="font-bold text-slate-900 uppercase text-sm tracking-tight">Enable Confirmation Emails</h4>
                  <p className="text-xs text-slate-400 uppercase font-bold tracking-widest mt-1">Send Email on application submission</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={emailSettings.enabled} onChange={e => onUpdateEmail({...emailSettings, enabled: e.target.checked})} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                </label>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="SMTP Host" value={emailSettings.smtpHost} onChange={e => onUpdateEmail({...emailSettings, smtpHost: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 font-mono text-sm" />
                <input type="text" placeholder="SMTP Port" value={emailSettings.smtpPort} onChange={e => onUpdateEmail({...emailSettings, smtpPort: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 font-mono text-sm" />
              </div>
              <input type="text" placeholder="SMTP User" value={emailSettings.smtpUser} onChange={e => onUpdateEmail({...emailSettings, smtpUser: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 font-mono text-sm" />
              <input type="password" placeholder="SMTP Password" value={emailSettings.smtpPass} onChange={e => onUpdateEmail({...emailSettings, smtpPass: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 font-mono text-sm" />
              <input type="text" placeholder="From Email" value={emailSettings.fromEmail} onChange={e => onUpdateEmail({...emailSettings, fromEmail: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 font-mono text-sm" />
              
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Email Body Template</label>
                <textarea 
                  rows={6}
                  value={emailSettings.confirmationTemplate}
                  onChange={e => onUpdateEmail({...emailSettings, confirmationTemplate: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 font-medium text-sm outline-none focus:ring-2 focus:ring-red-500/20"
                  placeholder="Variables: {name}, {program}"
                />
              </div>

              <button className="bg-slate-900 text-white px-10 py-4 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-black/10">Save SMTP Config</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPanel;
