
import React from 'react';
import { SERVICES } from '../constants';

const Services: React.FC = () => {
  return (
    <section className="py-24 px-6 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase mb-4">
            Our <span className="text-red-600">Services</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {SERVICES.map((service, i) => (
            <div 
              key={i} 
              className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 transition-all hover:translate-y-[-4px] group"
            >
              <div className="bg-slate-900 text-white w-14 h-14 rounded-2xl flex items-center justify-center mb-8 transition-transform group-hover:rotate-12">
                {service.icon}
              </div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase mb-4">{service.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
