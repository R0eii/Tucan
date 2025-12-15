import { Request, Response } from 'express';
import Device from '../models/Device';

// @desc    Get all devices (with optional filtering)
// @route   GET /api/devices
// @access  Public
export const getDevices = async (req: Request, res: Response) => {
  try {
    const { company, search } = req.query;
    
    let query: any = {};

    // Logic: Filter by Company
    if (company && company !== 'all') {
      query.company = company;
    }

    // Logic: Search by Name or ID or IP
    if (search) {
      const regex = new RegExp(search as string, 'i');
      query.$or = [
        { name: regex },
        { id: regex },
        { ip: regex }
      ];
    }

    const devices = await Device.find(query).sort({ lastUpdate: -1 });
    res.json(devices);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Simulate Restart
// @route   POST /api/devices/:id/restart
export const restartDevice = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // Expecting custom ID like "DEV-00123"
    
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const updatedDevice = await Device.findOneAndUpdate(
      { id: id },
      { 
        status: 'ok', 
        errorMessage: null, 
        uptime: 0, 
        lastUpdate: new Date() 
      },
      { new: true }
    );

    if (!updatedDevice) {
      return res.status(404).json({ message: 'Device not found' });
    }

    res.json(updatedDevice);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Simulate Retry/Connection Check
// @route   POST /api/devices/:id/retry
export const retryDevice = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 80% chance of success on retry
    const isSuccess = Math.random() > 0.2;
    
    const update = isSuccess 
      ? { status: 'ok', errorMessage: null, lastUpdate: new Date() }
      : { lastUpdate: new Date() }; // Just update time if failed

    const updatedDevice = await Device.findOneAndUpdate(
      { id: id },
      update,
      { new: true }
    );

    if (!updatedDevice) {
      return res.status(404).json({ message: 'Device not found' });
    }

    res.json(updatedDevice);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Simulate Random Status Changes (used for Auto-Refresh)
// @route   POST /api/devices/refresh-simulation
export const refreshSimulation = async (req: Request, res: Response) => {
  try {
    // Fetch all devices (or a subset for performance)
    const devices = await Device.find();
    const updates = [];

    // Randomly affect 5% of devices
    for (const device of devices) {
      if (Math.random() < 0.05) {
        const rand = Math.random();
        let newStatus = device.status;
        let errMsg = device.errorMessage;

        if (device.status === 'ok') {
           // Break it
           if (rand < 0.5) { newStatus = 'warning'; errMsg = 'High Latency'; }
           else { newStatus = 'error'; errMsg = 'Connection Timeout'; }
        } else {
           // Fix it
           newStatus = 'ok';
           errMsg = null;
        }

        updates.push(Device.updateOne(
          { _id: device._id },
          { 
            status: newStatus, 
            errorMessage: errMsg,
            lastUpdate: new Date(),
            battery: Math.max(0, Math.min(100, device.battery + (Math.random() * 10 - 5)))
          }
        ));
      }
    }

    await Promise.all(updates);
    res.json({ message: `Simulated updates for ${updates.length} devices` });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};