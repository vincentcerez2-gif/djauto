
import React from 'react';
import { Car, Zap, Shield, Clock } from 'lucide-react';
import { Vehicle } from './types';

// Added required isFeatured property to the vehicle objects
export const FEATURED_VEHICLES: Vehicle[] = [
  {
    id: '1',
    year: 2015,
    make: 'Kia',
    model: 'Optima Hybrid EX',
    color: 'Bright Silver',
    pricePerWeek: 350,
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/2014_Kia_Optima_Hybrid_EX_in_Bright_Silver%2C_Front_Right%2C_08-22-2023.jpg/1280px-2014_Kia_Optima_Hybrid_EX_in_Bright_Silver%2C_Front_Right%2C_08-22-2023.jpg',
    features: ['Hybrid Fuel Economy', 'Leather Seats', 'Rideshare Ready', 'Insurance Included'],
    type: 'RENT_TO_OWN',
    isFeatured: true
  },
  {
    id: '2',
    year: 2015,
    make: 'Ford',
    model: 'Fusion',
    color: 'Black',
    pricePerWeek: 375,
    image: 'https://live.staticflickr.com/65535/48334337927_351e6fc58c_c.jpg',
    features: ['Premium Audio System', 'Backup Camera', 'Uber/Lyft Approved', 'Path to Ownership'],
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
