
import React, { useState, useEffect } from 'react';
import { View, Vehicle, Application, SMSSettings, EmailSettings, AdminProfile } from './types';
import { FEATURED_VEHICLES } from './constants';
import { supabase } from './lib/supabase';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import FeaturedVehicles from './components/FeaturedVehicles';
import ApplicationForm from './components/ApplicationForm';
import AdminPanel from './components/AdminPanel';
import Footer from './components/Footer';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.HOME);
  const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem('dj_admin_session') === 'true');
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  const [adminProfile, setAdminProfile] = useState<AdminProfile>({
    name: 'Fleet Manager',
    email: 'admin@djautofleet.com',
    phone: '(210) 390-6135',
    address: '5072 Timberhill Drive, San Antonio, TX',
    password: 'admin'
  });

  const [smsSettings, setSmsSettings] = useState<SMSSettings>({
    twilioAccountSid: '', twilioAuthToken: '', twilioFromNumber: '',
    enabled: false, confirmationTemplate: 'Hi {name}, your application for {program} has been received!'
  });

  const [emailSettings, setEmailSettings] = useState<EmailSettings>({
    smtpHost: '', smtpPort: '587', smtpUser: '', smtpPass: '', fromEmail: '',
    enabled: false, confirmationTemplate: 'Dear {name}, thank you for applying to DJ Auto Fleet.'
  });

  // Helper: Format Phone for Twilio
  const formatTwilioNumber = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.startsWith('1') ? `+${cleaned}` : `+1${cleaned}`;
  };

  // Trigger: SMS via Twilio
  const triggerUserSMS = async (app: Application) => {
    if (!smsSettings.enabled) return;
    const formattedPhone = formatTwilioNumber(app.phone);
    const message = smsSettings.confirmationTemplate
      .replace('{name}', app.fullName)
      .replace('{program}', app.program);

    console.log(`[Twilio SMS Trigger] Sending to ${formattedPhone}: "${message}"`);
    // Mocking real Twilio API call
    /* 
    await fetch(`https://api.twilio.com/2010-04-01/Accounts/${smsSettings.twilioAccountSid}/Messages.json`, {
      method: 'POST',
      body: new URLSearchParams({ From: smsSettings.twilioFromNumber, To: formattedPhone, Body: message })
    });
    */
  };

  // Trigger: Admin Email Alert
  const triggerAdminEmail = async (app: Application, status: string) => {
    if (!emailSettings.enabled) return;
    console.log(`[SMTP Alert] Notifying ${adminProfile.email}: Application ${app.id} (${app.fullName}) changed to ${status}`);
    // Simulated SMTP Logic
  };

  // Fetch initial data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data: vData } = await supabase.from('vehicles').select('*');
        if (vData) setVehicles(vData.map(v => ({
          ...v, pricePerWeek: v.price_per_week, isFeatured: v.is_featured
        })));

        const { data: aData } = await supabase.from('applications').select('*').order('created_at', { ascending: false });
        if (aData) setApplications(aData.map(a => ({
          id: a.id, fullName: a.full_name, phone: a.phone, email: a.email,
          address: a.address, licenseNumber: a.license_number, targetPlatform: a.target_platform,
          vehicleId: a.vehicle_id, status: a.status, program: a.program,
          date: new Date(a.created_at).toLocaleDateString()
        })));

        const { data: sData } = await supabase.from('site_settings').select('*');
        sData?.forEach(s => {
          if (s.key === 'admin_profile') setAdminProfile(s.value);
          if (s.key === 'sms_settings') setSmsSettings(s.value);
          if (s.key === 'email_settings') setEmailSettings(s.value);
        });

      } catch (err) {
        console.error("Supabase load error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleNavigate = (view: View) => {
    if (view === View.LOGIN) {
      const newAdminState = !isAdmin;
      setIsAdmin(newAdminState);
      localStorage.setItem('dj_admin_session', newAdminState.toString());
      setCurrentView(View.HOME);
    } else {
      setCurrentView(view);
    }
    window.scrollTo(0, 0);
  };

  const handleApplicationSubmit = async (appData: Omit<Application, 'id' | 'status' | 'date'>) => {
    const { data, error } = await supabase.from('applications').insert([{
      full_name: appData.fullName, phone: appData.phone, email: appData.email,
      address: appData.address, license_number: appData.licenseNumber,
      target_platform: appData.targetPlatform, vehicle_id: appData.vehicleId,
      program: appData.program, status: 'PENDING'
    }]).select();

    if (!error && data) {
      const newApp: Application = {
        ...appData, id: data[0].id, status: 'PENDING',
        date: new Date().toLocaleDateString()
      };
      setApplications(prev => [newApp, ...prev]);
      // Auto-trigger Twilio Confirmation
      triggerUserSMS(newApp);
    }
  };

  const handleUpdateAppStatus = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    const { error } = await supabase.from('applications').update({ status }).eq('id', id);
    if (!error) {
      const updatedApp = applications.find(a => a.id === id);
      setApplications(prev => prev.map(app => app.id === id ? { ...app, status } : app));
      if (updatedApp) triggerAdminEmail(updatedApp, status);
    }
  };

  const handleEditApp = async (id: string, updatedData: Partial<Application>) => {
    const dbUpdate: any = {};
    if (updatedData.fullName) dbUpdate.full_name = updatedData.fullName;
    if (updatedData.phone) dbUpdate.phone = updatedData.phone;
    if (updatedData.email) dbUpdate.email = updatedData.email;
    const { error } = await supabase.from('applications').update(dbUpdate).eq('id', id);
    if (!error) setApplications(prev => prev.map(app => app.id === id ? { ...app, ...updatedData } : app));
  };

  const handleAddVehicle = async (vehicle: Vehicle) => {
    const { data, error } = await supabase.from('vehicles').insert([{
      year: vehicle.year, make: vehicle.make, model: vehicle.model, color: vehicle.color,
      price_per_week: vehicle.pricePerWeek, image: vehicle.image, features: vehicle.features,
      type: vehicle.type, is_featured: vehicle.isFeatured
    }]).select();
    if (!error && data) setVehicles(prev => [...prev, { ...vehicle, id: data[0].id }]);
  };

  const handleEditVehicle = async (id: string, updatedData: Partial<Vehicle>) => {
    const dbUpdate: any = {};
    if (updatedData.year) dbUpdate.year = updatedData.year;
    if (updatedData.make) dbUpdate.make = updatedData.make;
    if (updatedData.model) dbUpdate.model = updatedData.model;
    if (updatedData.pricePerWeek) dbUpdate.price_per_week = updatedData.pricePerWeek;
    if (updatedData.image) dbUpdate.image = updatedData.image;
    if (updatedData.type) dbUpdate.type = updatedData.type;

    const { error } = await supabase.from('vehicles').update(dbUpdate).eq('id', id);
    if (!error) setVehicles(prev => prev.map(v => v.id === id ? { ...v, ...updatedData } : v));
  };

  const handleDeleteVehicle = async (id: string) => {
    const { error } = await supabase.from('vehicles').delete().eq('id', id);
    if (!error) setVehicles(prev => prev.filter(v => v.id !== id));
  };

  const saveSettings = async (key: string, value: any) => {
    await supabase.from('site_settings').upsert({ key, value, updated_at: new Date().toISOString() });
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar currentView={currentView} onNavigate={handleNavigate} isAdmin={isAdmin} />
      {loading ? (
        <div className="h-[60vh] flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <main>
          {currentView === View.HOME && (
            <><Hero onApply={() => setCurrentView(View.APPLY)} /><Services /><FeaturedVehicles vehicles={vehicles} /></>
          )}
          {currentView === View.APPLY && (
            <ApplicationForm vehicles={vehicles} onSubmit={handleApplicationSubmit} onReturnHome={() => setCurrentView(View.HOME)} />
          )}
          {currentView === View.ADMIN && isAdmin && (
            <AdminPanel 
              vehicles={vehicles} applications={applications}
              onUpdateApp={handleUpdateAppStatus} onDeleteApp={(id) => {}} onEditApp={handleEditApp}
              onAddVehicle={handleAddVehicle} onEditVehicle={handleEditVehicle} onDeleteVehicle={handleDeleteVehicle}
              smsSettings={smsSettings} onUpdateSms={(s) => { setSmsSettings(s); saveSettings('sms_settings', s); }}
              emailSettings={emailSettings} onUpdateEmail={(e) => { setEmailSettings(e); saveSettings('email_settings', e); }}
              adminProfile={adminProfile} onUpdateProfile={(p) => { setAdminProfile(p); saveSettings('admin_profile', p); }}
            />
          )}
        </main>
      )}
      <Footer />
    </div>
  );
};

export default App;
