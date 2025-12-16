export type DeviceStatus = "ok" | "error" | "warning";

export interface HealthSnap {
  timestamp: string;
  uptime: number; // 0 or 1 for timeline, 0-100 for daily
  battery: number;
  signal: number;
}

export interface Device {
  id: string;
  name: string;
  ip: string;
  mac: string;
  status: DeviceStatus;
  errorMessage: string | null;
  lastUpdate: Date;
  department: string;
  location: string;
  company: string;
  deviceModel: string;
  os: string;
  battery: number;
  signalStrength: number;
  uptime: number;
  lastIncident: Date | null;
  recentHistory: HealthSnap[];
  longTermHistory: HealthSnap[];
}

export interface Company {
  id: number;
  name: string;
  deviceCount: number;
}

export interface DashboardStats {
  total: number;
  online: number;
  offline: number;
  warning: number;
}
