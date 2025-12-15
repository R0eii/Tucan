import dotenv from 'dotenv';
import { connectDB } from '../config/db';
import Device from '../models/Device';
import { generateDevices } from '../utils/mockGenerator';

dotenv.config();

const seedData = async () => {
  await connectDB();

  try {
    console.log('Clearing old data...');
    await Device.deleteMany({});

    console.log('Generating 300 new devices...');
    const devices = generateDevices(300);

    await Device.insertMany(devices);
    console.log('Database seeded successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();