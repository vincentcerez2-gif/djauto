
export enum View {
  HOME = 'HOME',
  APPLY = 'APPLY',
  ABOUT = 'ABOUT',
  ADMIN = 'ADMIN',
  LOGIN = 'LOGIN', // Admin Login
  USER_LOGIN = 'USER_LOGIN', // Driver Login
  CONTACT = 'CONTACT',
  DRIVER_DASHBOARD = 'DRIVER_DASHBOARD'
}

export type AIProvider = 'OPENAI' | 'GEMINI' | 'CLAUDE';

export type UserRole = 'ADMIN' | 'MANAGER' | 'EDITOR';

export interface SystemUser {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface AISettings {
  provider: AIProvider;
  apiKey: string;
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
  type: 'RIDESHARE' | 'RENT_TO_OWN' | 'BOTH';
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
  documentsComplete?: boolean;
  verificationStatus?: 'PASS' | 'FAIL' | 'UNVERIFIED';
  verificationReasoning?: string;
  licenseFront?: string;
  licenseBack?: string;
}

export interface AdminProfile {
  name: string;
  username: string;
  email: string;
  phone: string;
  address: string;
  password?: string;
  image?: string;
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
