
import React, { useState } from 'react';
import { CheckCircle2, Search, Star } from 'lucide-react';
import { Vehicle } from '../types';

interface FeaturedVehiclesProps {
  vehicles: Vehicle[];
  onApply: (vehicleId: string) => void;
}

const FeaturedVehicles: React.FC<FeaturedVehiclesProps> = ({ vehicles, onApply }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'RIDESHARE' | 'RENT_TO_OWN'>('ALL');

  const filteredVehicles = vehicles.filter(v => {
    const matchesSearch = `${v.make} ${v.model}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'ALL' || v.type === filterType || v.type === 'BOTH';
    return matchesSearch && matchesFilter;
  });

  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="text-left">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase mb-4">
              Our <span className="text-red-600">Inventory</span>
            </h2>
            <p className="text-slate-500 font-bold tracking-widest uppercase text-xs">Available units in San Antonio. Real-time availability.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search model..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all font-medium text-sm"
              />
            </div>
            <div className="flex bg-slate-100 p-1.5 rounded-2xl">
              {(['ALL', 'RIDESHARE', 'RENT_TO_OWN'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-4 py-2.5 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all ${filterType === type ? 'bg-white text-red-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
                >
                  {type.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>

        {filteredVehicles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {filteredVehicles.map((vehicle) => (
              <div 
                key={vehicle.id} 
                className="group bg-white rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200/50 border border-slate-100 transition-all hover:translate-y-[-4px]"
              >
                <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
                  <img 
                    src={vehicle.image} 
                    alt={`${vehicle.make} ${vehicle.model}`} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {vehicle.isFeatured && (
                    <div className="absolute top-6 left-6 bg-amber-400 text-slate-900 px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-lg">
                      <Star size={14} fill="currentColor" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Featured Choice</span>
                    </div>
                  )}
                  <div className="absolute top-6 right-6 bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-black tracking-widest">
                    ${vehicle.pricePerWeek}/WK
                  </div>
                  <div className="absolute bottom-6 left-6 flex gap-2">
                    <span className="bg-white/90 backdrop-blur-md text-slate-900 px-3 py-1 rounded-lg text-[10px] font-black tracking-widest uppercase">
                      {vehicle.type.replace('_', ' ')}
                    </span>
                  </div>
                </div>
                <div className="p-10">
                  <div className="mb-6">
                    <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">
                      {vehicle.year} {vehicle.make} {vehicle.model}
                    </h3>
                    <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em] mt-1">
                      {vehicle.color} • Delivery Available
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                    {vehicle.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                        <span className="text-slate-600 font-semibold text-xs">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <button 
                    onClick={() => onApply(vehicle.id)}
                    className="w-full bg-[#020617] text-white py-4 rounded-2xl font-black text-xs tracking-[0.2em] uppercase transition-all hover:bg-black active:scale-[0.98] shadow-lg shadow-black/5"
                  >
                    Reserve Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
            <Search className="mx-auto text-slate-300 mb-4" size={48} />
            <h3 className="text-xl font-bold text-slate-900 uppercase">No vehicles found</h3>
            <p className="text-slate-400 font-medium">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedVehicles;
