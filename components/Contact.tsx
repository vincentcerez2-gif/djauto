
import React from 'react';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

const Contact: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 pt-12 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase mb-4">Contact <span className="text-red-600">HQ</span></h1>
          <p className="text-slate-500 font-bold tracking-widest uppercase text-xs">San Antonio's Premier Rideshare Fleet Management</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Info Card */}
          <div className="bg-white p-12 rounded-[2.5rem] shadow-2xl border border-slate-100 flex flex-col justify-between">
            <div className="space-y-10">
              <div className="flex items-start gap-6">
                <div className="bg-red-600 text-white p-4 rounded-2xl shadow-lg shadow-red-600/20">
                  <Phone size={24} />
                </div>
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Direct Sales Line</h3>
                  <a href="tel:2103906135" className="text-2xl font-black text-slate-900 hover:text-red-600 transition-colors">(210) 390-6135</a>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="bg-slate-900 text-white p-4 rounded-2xl">
                  <Mail size={24} />
                </div>
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Administrative Email</h3>
                  <a href="mailto:admin@djautofleet.com" className="text-2xl font-black text-slate-900 hover:text-red-600 transition-colors">admin@djautofleet.com</a>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="bg-slate-900 text-white p-4 rounded-2xl">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Fleet Location</h3>
                  <p className="text-2xl font-black text-slate-900">5072 Timberhill Drive,<br />San Antonio, TX 78238</p>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-12 border-t border-slate-100 grid grid-cols-2 gap-8">
               <div>
                 <h4 className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-900 mb-2">
                   <Clock size={12} className="text-red-600" /> Mon - Fri
                 </h4>
                 <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">9:00 AM - 6:00 PM</p>
               </div>
               <div>
                 <h4 className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-900 mb-2">
                   <Clock size={12} className="text-red-600" /> Sat - Sun
                 </h4>
                 <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Appointment Only</p>
               </div>
            </div>
          </div>

          {/* Map Card */}
          <div className="rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white h-[600px]">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3473.1092635060522!2d-98.63275982391691!3d29.484010044905332!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x865c5d1323afe20d%3A0x5caf865c681018d3!2s5072%20Timberhill%20Dr%2C%20San%20Antonio%2C%20TX%2078238%2C%20USA!5e0!3m2!1sen!2sph!4v1771482518165!5m2!1sen!2sph" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
