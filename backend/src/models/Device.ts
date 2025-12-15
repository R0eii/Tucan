import mongoose, { Document, Schema } from 'mongoose';

const HealthSnapSchema = new Schema({
  timestamp: { type: String, required: true },
  uptime: { type: Number, required: true },
  battery: { type: Number, required: true },
  signal: { type: Number, required: true },
}, { _id: false });

export interface IDevice extends Document {
  id: string;
  name: string;
  ip: string;
  mac: string;
  company: string;
  status: 'ok' | 'error' | 'warning';
  errorMessage: string | null;
  lastUpdate: Date;
  department: string;
  location: string;
  deviceModel: string; // ✅ שונה מ-model כדי למנוע התנגשות
  os: string;
  battery: number;
  signalStrength: number;
  uptime: number;
  lastIncident: Date | null;
  recentHistory: any[];
  longTermHistory: any[];
}

const DeviceSchema = new Schema<IDevice>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  ip: { type: String, required: true },
  mac: { type: String, required: true },
  company: { type: String, required: true, index: true },
  status: { type: String, enum: ['ok', 'error', 'warning'], default: 'ok' },
  errorMessage: { type: String, default: null },
  lastUpdate: { type: Date, default: Date.now },
  department: { type: String, required: true },
  location: { type: String, required: true },
  deviceModel: { type: String, required: true }, // ✅ עודכן בסכמה
  os: { type: String, required: true },
  battery: { type: Number, required: true },
  signalStrength: { type: Number, required: true },
  uptime: { type: Number, required: true },
  lastIncident: { type: Date, default: null },
  recentHistory: [HealthSnapSchema],
  longTermHistory: [HealthSnapSchema],
});

DeviceSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete (ret as any)._id;
  }
});

export default mongoose.model<IDevice>('Device', DeviceSchema);