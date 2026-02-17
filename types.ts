
export enum View {
  HOME = 'HOME',
  APPLY = 'APPLY',
  ADMIN = 'ADMIN',
  LOGIN = 'LOGIN'
}

export interface Vehicle {
  id: string;
  year: number;
  make: string;
  model: string;
  color: string;
  pricePerWeek: number;
  image: string;
  features: string[];
  type: 'RIDESHARE' | 'RENT_TO_OWN';
  isFeatured: boolean;
}

export interface Application {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  address: string;
  licenseNumber: string;
  targetPlatform: string;
  vehicleId?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  date: string;
  program: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'DRIVER';
}

export interface SMSSettings {
  twilioAccountSid: string;
  twilioAuthToken: string;
  twilioFromNumber: string;
  enabled: boolean;
  confirmationTemplate: string;
}

export interface EmailSettings {
  smtpHost: string;
  smtpPort: string;
  smtpUser: string;
  smtpPass: string;
  fromEmail: string;
  enabled: boolean;
  confirmationTemplate: string;
}
