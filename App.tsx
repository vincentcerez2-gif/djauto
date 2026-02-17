
import React, { useState, useEffect } from 'react';
import { View, Vehicle, Application, SMSSettings, EmailSettings } from './types';
import { FEATURED_VEHICLES } from './constants';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import FeaturedVehicles from './components/FeaturedVehicles';
import ApplicationForm from './components/ApplicationForm';
import AdminPanel from './components/AdminPanel';
import Footer from './components/Footer';

const App: React.FC = () => {
  // Load initial state from localStorage if available
  const [currentView, setCurrentView] = useState<View>(View.HOME);
  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem('dj_admin_session') === 'true';
  });

  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    const saved = localStorage.getItem('dj_vehicles');
    return saved ? JSON.parse(saved) : FEATURED_VEHICLES;
  });

  const [applications, setApplications] = useState<Application[]>(() => {
    const saved = localStorage.getItem('dj_applications');
    return saved ? JSON.parse(saved) : [];
  });

  const [smsSettings, setSmsSettings] = useState<SMSSettings>(() => {
    const saved = localStorage.getItem('dj_sms_settings');
    return saved ? JSON.parse(saved) : {
      twilioAccountSid: '',
      twilioAuthToken: '',
      twilioFromNumber: '',
      enabled: false,
      confirmationTemplate: 'Hi {name}, your application for the {program} program has been received! We will review it shortly.'
    };
  });

  const [emailSettings, setEmailSettings] = useState<EmailSettings>(() => {
    const saved = localStorage.getItem('dj_email_settings');
    return saved ? JSON.parse(saved) : {
      smtpHost: '',
      smtpPort: '587',
      smtpUser: '',
      smtpPass: '',
      fromEmail: 'noreply@djautofleet.com',
      enabled: false,
      confirmationTemplate: 'Dear {name},\n\nThank you for applying to DJ Auto Fleet. Your {program} application is being processed.'
    };
  });

  // Persist state changes to localStorage
  useEffect(() => {
    localStorage.setItem('dj_vehicles', JSON.stringify(vehicles));
  }, [vehicles]);

  useEffect(() => {
    localStorage.setItem('dj_applications', JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem('dj_sms_settings', JSON.stringify(smsSettings));
  }, [smsSettings]);

  useEffect(() => {
    localStorage.setItem('dj_email_settings', JSON.stringify(emailSettings));
  }, [emailSettings]);

  useEffect(() => {
    localStorage.setItem('dj_admin_session', isAdmin.toString());
  }, [isAdmin]);

  const handleNavigate = (view: View) => {
    if (view === View.LOGIN) {
      setIsAdmin(!isAdmin); // Simple toggle for demo
      setCurrentView(View.HOME);
    } else {
      setCurrentView(view);
    }
    window.scrollTo(0, 0);
  };

  const handleApplicationSubmit = (appData: Omit<Application, 'id' | 'status' | 'date'>) => {
    const newApp: Application = {
      ...appData,
      id: `APP-${Date.now()}`,
      status: 'PENDING',
      date: new Date().toLocaleDateString(),
    };
    setApplications(prev => [newApp, ...prev]);
    console.log('Application saved to state and localStorage:', newApp);
  };

  const handleUpdateAppStatus = (id: string, status: 'APPROVED' | 'REJECTED') => {
    setApplications(prev => prev.map(app => app.id === id ? { ...app, status } : app));
  };

  const handleEditApp = (id: string, updatedData: Partial<Application>) => {
    setApplications(prev => prev.map(app => app.id === id ? { ...app, ...updatedData } : app));
  };

  const handleDeleteApp = (id: string) => {
    setApplications(prev => prev.filter(app => app.id !== id));
  };

  const handleAddVehicle = (vehicle: Vehicle) => {
    setVehicles(prev => [...prev, vehicle]);
  };

  const handleDeleteVehicle = (id: string) => {
    setVehicles(prev => prev.filter(v => v.id !== id));
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar currentView={currentView} onNavigate={handleNavigate} isAdmin={isAdmin} />
      <main>
        {currentView === View.HOME && (
          <>
            <Hero onApply={() => setCurrentView(View.APPLY)} />
            <Services />
            <FeaturedVehicles vehicles={vehicles} />
          </>
        )}
        {currentView === View.APPLY && (
          <ApplicationForm 
            vehicles={vehicles} 
            onSubmit={handleApplicationSubmit} 
            onReturnHome={() => setCurrentView(View.HOME)}
          />
        )}
        {currentView === View.ADMIN && isAdmin && (
          <AdminPanel 
            vehicles={vehicles}
            applications={applications}
            onUpdateApp={handleUpdateAppStatus}
            onDeleteApp={handleDeleteApp}
            onEditApp={handleEditApp}
            onAddVehicle={handleAddVehicle}
            onDeleteVehicle={handleDeleteVehicle}
            smsSettings={smsSettings}
            onUpdateSms={setSmsSettings}
            emailSettings={emailSettings}
            onUpdateEmail={setEmailSettings}
          />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default App;
