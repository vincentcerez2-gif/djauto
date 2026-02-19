
import React, { useState, useEffect } from 'react';
import { View, Vehicle, Application, SMSSettings, EmailSettings, AdminProfile, AISettings, SystemUser } from './types';
import { FEATURED_VEHICLES } from './constants';
import { supabase } from './lib/supabase';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import FeaturedVehicles from './components/FeaturedVehicles';
import ApplicationForm from './components/ApplicationForm';
import AdminPanel from './components/AdminPanel';
import DriverDashboard from './components/DriverDashboard';
import Contact from './components/Contact';
import AboutUs from './components/AboutUs';
import LoginForm from './components/LoginForm';
import UserLoginForm from './components/UserLoginForm';
import Footer from './components/Footer';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.HOME);
  const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem('dj_admin_session') === 'true');
  const [vehicles, setVehicles] = useState<Vehicle[]>(FEATURED_VEHICLES);
  const [applications, setApplications] = useState<Application[]>([]);
  const [systemUsers, setSystemUsers] = useState<SystemUser[]>([]);
  const [currentAppId, setCurrentAppId] = useState<string | null>(() => localStorage.getItem('dj_current_app_id'));
  const [loading, setLoading] = useState(true);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | undefined>();

  const [aiSettings, setAiSettings] = useState<AISettings>(() => {
    const saved = localStorage.getItem('dj_ai_settings');
    return saved ? JSON.parse(saved) : { provider: 'GEMINI', apiKey: '' };
  });

  const [adminProfile, setAdminProfile] = useState<AdminProfile>(() => {
    const saved = localStorage.getItem('dj_admin_profile');
    return saved ? JSON.parse(saved) : {
      name: 'Fleet Manager',
      username: 'admin',
      email: 'admin@djautofleet.com',
      phone: '(210) 390-6135',
      address: '5072 Timberhill Drive, San Antonio, TX',
      password: 'admin',
      image: ''
    };
  });

  const [smsSettings, setSmsSettings] = useState<SMSSettings>({
    twilioAccountSid: '', twilioAuthToken: '', twilioFromNumber: '',
    enabled: false, confirmationTemplate: 'Hi {name}, your application for {program} has been received! Our team will contact you shortly.'
  });

  const [emailSettings, setEmailSettings] = useState<EmailSettings>({
    smtpHost: '', smtpPort: '587', smtpUser: '', smtpPass: '', fromEmail: '',
    enabled: false, confirmationTemplate: 'Dear {name}, thank you for applying to DJ Auto Fleet. Your application for {program} is under review.'
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data: vData } = await supabase.from('vehicles').select('*').order('created_at', { ascending: false });
      if (vData) {
         setVehicles(vData.map(v => ({
          id: v.id, year: v.year, make: v.make, model: v.model,
          color: v.color || 'Unknown', pricePerWeek: v.price_per_week, image: v.image,
          features: Array.isArray(v.features) ? v.features : [], type: v.type || 'RIDESHARE',
          isFeatured: v.is_featured
        })));
      }

      const { data: aData } = await supabase.from('applications').select('*').order('created_at', { ascending: false });
      if (aData) setApplications(aData.map(a => ({
        id: a.id, fullName: a.full_name, phone: a.phone, email: a.email,
        address: a.address, license_number: a.license_number, targetPlatform: a.target_platform,
        vehicleId: a.vehicle_id, status: a.status, program: a.program,
        documentsComplete: true, verificationStatus: a.verification_status,
        verification_reasoning: a.verification_reasoning, licenseFront: a.license_front,
        licenseBack: a.license_back, date: new Date(a.created_at).toLocaleDateString()
      })));

      const { data: uData } = await supabase.from('system_users').select('*');
      if (uData) setSystemUsers(uData.map(u => ({
        id: u.id, fullName: u.full_name, email: u.email, role: u.role, createdAt: new Date(u.created_at).toLocaleDateString()
      })));

      const { data: sData } = await supabase.from('site_settings').select('*');
      sData?.forEach(s => {
        if (s.key === 'sms_settings') setSmsSettings(s.value);
        if (s.key === 'email_settings') setEmailSettings(s.value);
      });

    } catch (err) {
      console.error("Data load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleNavigate = (view: View) => {
    if ((view === View.LOGIN || view === View.USER_LOGIN) && (isAdmin || currentAppId)) {
      setIsAdmin(false);
      setCurrentAppId(null);
      localStorage.removeItem('dj_admin_session');
      localStorage.removeItem('dj_current_app_id');
      setCurrentView(View.HOME);
    } else {
      setCurrentView(view);
    }
    window.scrollTo(0, 0);
  };

  const handleUpdateApp = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    const { error } = await supabase.from('applications').update({ status }).eq('id', id);
    if (!error) fetchData();
  };

  const handleDeleteApp = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    const { error } = await supabase.from('applications').delete().eq('id', id);
    if (!error) fetchData();
  };

  const handleEditApp = async (id: string, data: Partial<Application>) => {
    const { error } = await supabase.from('applications').update({
      full_name: data.fullName, email: data.email, phone: data.phone,
      license_number: data.licenseNumber, status: data.status, program: data.program
    }).eq('id', id);
    if (!error) fetchData();
  };

  const handleAddVehicle = async (v: Omit<Vehicle, 'id'>) => {
    const { error } = await supabase.from('vehicles').insert([{
      year: v.year, make: v.make, model: v.model, color: v.color,
      price_per_week: v.pricePerWeek, image: v.image, features: v.features,
      type: v.type, is_featured: v.isFeatured
    }]);
    if (!error) fetchData();
  };

  const handleEditVehicle = async (id: string, v: Partial<Vehicle>) => {
    const { error } = await supabase.from('vehicles').update({
      year: v.year, make: v.make, model: v.model, color: v.color,
      price_per_week: v.pricePerWeek, image: v.image, type: v.type, features: v.features
    }).eq('id', id);
    if (!error) fetchData();
  };

  const handleDeleteVehicle = async (id: string) => {
    if (!confirm("Delete vehicle?")) return;
    const { error } = await supabase.from('vehicles').delete().eq('id', id);
    if (!error) fetchData();
  };

  const handleAddSystemUser = async (user: Omit<SystemUser, 'id' | 'createdAt'>) => {
    const { error } = await supabase.from('system_users').insert([{
      full_name: user.fullName, email: user.email, role: user.role
    }]);
    if (!error) fetchData();
  };

  const handleDeleteSystemUser = async (id: string) => {
    const { error } = await supabase.from('system_users').delete().eq('id', id);
    if (!error) fetchData();
  };

  const handleUpdateProfile = (p: AdminProfile) => {
    setAdminProfile(p);
    localStorage.setItem('dj_admin_profile', JSON.stringify(p));
  };

  const sendConfirmationAlerts = (app: Omit<Application, 'id' | 'status' | 'date'>) => {
    // Logic for sending alerts based on settings
    if (smsSettings.enabled) {
      const msg = smsSettings.confirmationTemplate
        .replace('{name}', app.fullName)
        .replace('{program}', app.program);
      console.log(`[AUTOMATIC SMS] To: ${app.phone} -> "${msg}" (Simulated via Twilio API)`);
    }
    if (emailSettings.enabled) {
      const msg = emailSettings.confirmationTemplate
        .replace('{name}', app.fullName)
        .replace('{program}', app.program);
      console.log(`[AUTOMATIC EMAIL] To: ${app.email} -> "${msg}" (Simulated via SMTP Relay)`);
    }
  };

  const handleApplicationSubmit = async (appData: Omit<Application, 'id' | 'status' | 'date'>) => {
    // Fixed Error: Changed appData.target_platform to appData.targetPlatform
    const { data, error } = await supabase.from('applications').insert([{
      full_name: appData.fullName, phone: appData.phone, email: appData.email,
      address: appData.address, license_number: appData.licenseNumber,
      target_platform: appData.targetPlatform, vehicle_id: appData.vehicleId,
      program: appData.program, status: 'PENDING',
      verification_status: appData.verificationStatus,
      verification_reasoning: appData.verificationReasoning,
      license_front: appData.licenseFront,
      license_back: appData.licenseBack
    }]).select();

    if (!error && data) {
      const newAppId = data[0].id;
      setCurrentAppId(newAppId);
      localStorage.setItem('dj_current_app_id', newAppId);
      sendConfirmationAlerts(appData);
      fetchData();
    }
  };

  const currentApplication = applications.find(a => a.id === currentAppId) || null;
  const currentVehicle = vehicles.find(v => v.id === currentApplication?.vehicleId) || null;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar 
        currentView={currentView} 
        onNavigate={handleNavigate} 
        isAdmin={isAdmin} 
        hasApplication={!!currentAppId}
      />
      
      {loading ? (
        <div className="h-[60vh] flex flex-col items-center justify-center">
          <div className="w-16 h-16 border-4 border-slate-900 border-t-red-600 rounded-full animate-spin mb-4"></div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Syncing Fleet Core...</p>
        </div>
      ) : (
        <main>
          {currentView === View.HOME && (
            <>
              <Hero onApply={() => { setSelectedVehicleId(undefined); setCurrentView(View.APPLY); }} />
              <Services />
              <FeaturedVehicles 
                vehicles={vehicles} 
                onApply={(vid) => { setSelectedVehicleId(vid); setCurrentView(View.APPLY); }} 
              />
            </>
          )}
          
          {currentView === View.APPLY && (
            <ApplicationForm 
              vehicles={vehicles} 
              initialVehicleId={selectedVehicleId}
              aiSettings={aiSettings}
              onSubmit={handleApplicationSubmit} 
              onReturnHome={() => setCurrentView(View.HOME)} 
              onNavigateToLogin={() => setCurrentView(View.USER_LOGIN)}
            />
          )}

          {currentView === View.ABOUT && <AboutUs />}
          {currentView === View.CONTACT && <Contact />}

          {currentView === View.LOGIN && !isAdmin && (
            <LoginForm onLogin={(u, p) => {
              if (u === adminProfile.username && p === adminProfile.password) {
                setIsAdmin(true);
                localStorage.setItem('dj_admin_session', 'true');
                setCurrentView(View.ADMIN);
              }
            }} onCancel={() => setCurrentView(View.HOME)} />
          )}

          {currentView === View.USER_LOGIN && !currentAppId && (
            <UserLoginForm onLogin={(email, pass) => {
              const app = applications.find(a => {
                const lastFour = a.phone.replace(/\D/g, '').slice(-4);
                return a.email.toLowerCase() === email.toLowerCase() && lastFour === pass;
              });
              if (app) {
                setCurrentAppId(app.id);
                localStorage.setItem('dj_current_app_id', app.id);
                setCurrentView(View.DRIVER_DASHBOARD);
              } else { alert("Login Error."); }
            }} onCancel={() => setCurrentView(View.HOME)} />
          )}

          {currentView === View.DRIVER_DASHBOARD && (
            <DriverDashboard application={currentApplication} vehicle={currentVehicle} />
          )}
          
          {currentView === View.ADMIN && isAdmin && (
            <AdminPanel 
              vehicles={vehicles} 
              applications={applications}
              aiSettings={aiSettings}
              onUpdateAI={(s) => { setAiSettings(s); localStorage.setItem('dj_ai_settings', JSON.stringify(s)); }}
              onUpdateApp={handleUpdateApp} 
              onDeleteApp={handleDeleteApp} 
              onEditApp={handleEditApp}
              onAddVehicle={handleAddVehicle} 
              onEditVehicle={handleEditVehicle} 
              onDeleteVehicle={handleDeleteVehicle}
              smsSettings={smsSettings} 
              onUpdateSms={(s) => {
                setSmsSettings(s);
                supabase.from('site_settings').upsert({ key: 'sms_settings', value: s });
              }}
              emailSettings={emailSettings} 
              onUpdateEmail={(e) => {
                setEmailSettings(e);
                supabase.from('site_settings').upsert({ key: 'email_settings', value: e });
              }}
              adminProfile={adminProfile} 
              onUpdateProfile={handleUpdateProfile}
              systemUsers={systemUsers}
              onAddSystemUser={handleAddSystemUser}
              onDeleteSystemUser={handleDeleteSystemUser}
            />
          )}
        </main>
      )}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
};

export default App;
