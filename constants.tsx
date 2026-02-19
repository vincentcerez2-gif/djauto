
import React from 'react';
import { Car, Zap, Shield, Clock } from 'lucide-react';
import { Vehicle } from './types';

export const FEATURED_VEHICLES: Vehicle[] = [
  {
    id: 'v-fusion-2017',
    year: 2017,
    make: 'Ford',
    model: 'Fusion',
    color: 'Black',
    pricePerWeek: 375,
    image: 'https://www.fusionsportforums.com/attachments/1690600211968-png.31408/',
    features: ['Rideshare Ready', 'RPO Path', 'Backup Camera', 'Bluetooth Audio'],
    type: 'RENT_TO_OWN',
    isFeatured: true
  },
  {
    id: 'v-optima-2015',
    year: 2015,
    make: 'Kia',
    model: 'Optima Hybrid EX',
    color: 'Bright Silver',
    pricePerWeek: 350,
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/2014_Kia_Optima_Hybrid_EX_in_Bright_Silver%2C_Front_Right%2C_08-22-2023.jpg/1280px-2014_Kia_Optima_Hybrid_EX_in_Bright_Silver%2C_Front_Right%2C_08-22-2023.jpg',
    features: ['Hybrid Efficiency', 'Premium Interior', 'Commercial Insurance', 'Uber Ready'],
    type: 'RIDESHARE',
    isFeatured: true
  }
];

export const SERVICES = [
  {
    title: 'RIDESHARE UNITS',
    description: 'Uber, Lyft, and DoorDash ready vehicles. Get approved instantly.',
    icon: <Car size={32} />
  },
  {
    title: 'RENT-TO-OWN',
    description: 'Stop renting forever. Our program puts you on the path to ownership.',
    icon: <Zap size={32} />
  },
  {
    title: 'FULL INSURANCE',
    description: 'Comprehensive commercial coverage included in your weekly rate.',
    icon: <Shield size={32} />
  },
  {
    title: '24/7 SUPPORT',
    description: 'Local San Antonio team ready to assist with maintenance.',
    icon: <Clock size={32} />
  }
];
