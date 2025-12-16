import { Request, Response } from "express";
import Device from "../models/Device";

// @desc    Get all devices (with optional filtering)
// @route   GET /api/devices
// @access  Public
export const getDevices = async (req: Request, res: Response) => {
  try {
    const { company, search } = req.query;

    let query: any = {};

    // Logic: Filter by Company
    if (company && company !== "all") {
      query.company = company;
    }

    // Logic: Search by Name or ID or IP
    if (search) {
      const regex = new RegExp(search as string, "i");
      query.$or = [{ name: regex }, { id: regex }, { ip: regex }];
    }

    const devices = await Device.find(query).sort({ lastUpdate: -1 });
    res.json(devices);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const createDevice = async (req: Request, res: Response) => {
  try {
    const { name, ip, company, location, type } = req.body;

    // Generate a simple ID
    const count = await Device.countDocuments();
    const id = `DEV-${String(count + 1000).padStart(5, "0")}`;

    const newDevice = new Device({
      id,
      name,
      ip,
      company,
      location,
      deviceModel: type || "Gen-X Standard",
      department: "IT", // Default
      mac: "00:00:00:00:00:00", // Placeholder
      os: "v1.0",
      status: "ok",
      lastUpdate: new Date(),
      battery: 100,
      signalStrength: 100,
      uptime: 0,
      recentHistory: [],
      longTermHistory: [],
    });

    await newDevice.save();
    res.status(201).json(newDevice);
  } catch (error) {
    res.status(500).json({ message: "Error creating device" });
  }
};

export const updateDevice = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updated = await Device.findOneAndUpdate({ id }, updates, {
      new: true,
    });
    if (!updated) return res.status(404).json({ message: "Device not found" });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Error updating device" });
  }
};

// ✅ Delete Device
export const deleteDevice = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Device.findOneAndDelete({ id });
    res.json({ message: "Device deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting device" });
  }
};

// ✅ Company Management: Rename Company
export const renameCompany = async (req: Request, res: Response) => {
  try {
    const { oldName } = req.params;
    const { newName } = req.body;

    await Device.updateMany(
      { company: oldName },
      { $set: { company: newName } }
    );

    res.json({ message: "Company renamed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error renaming company" });
  }
};

// ✅ Company Management: Delete Company (Delete all its devices)
export const deleteCompany = async (req: Request, res: Response) => {
  try {
    const { name } = req.params;
    await Device.deleteMany({ company: name });
    res.json({ message: "Company and all associated devices deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting company" });
  }
};

// @desc    Simulate Restart
// @route   POST /api/devices/:id/restart
export const restartDevice = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // Expecting custom ID like "DEV-00123"

    // Simulate delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const updatedDevice = await Device.findOneAndUpdate(
      { id: id },
      {
        status: "ok",
        errorMessage: null,
        uptime: 0,
        lastUpdate: new Date(),
      },
      { new: true }
    );

    if (!updatedDevice) {
      return res.status(404).json({ message: "Device not found" });
    }

    res.json(updatedDevice);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Simulate Retry/Connection Check
// @route   POST /api/devices/:id/retry
export const retryDevice = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Simulate delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // 80% chance of success on retry
    const isSuccess = Math.random() > 0.2;

    const update = isSuccess
      ? { status: "ok", errorMessage: null, lastUpdate: new Date() }
      : { lastUpdate: new Date() }; // Just update time if failed

    const updatedDevice = await Device.findOneAndUpdate({ id: id }, update, {
      new: true,
    });

    if (!updatedDevice) {
      return res.status(404).json({ message: "Device not found" });
    }

    res.json(updatedDevice);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
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

        if (device.status === "ok") {
          // Break it
          if (rand < 0.5) {
            newStatus = "warning";
            errMsg = "High Latency";
          } else {
            newStatus = "error";
            errMsg = "Connection Timeout";
          }
        } else {
          // Fix it
          newStatus = "ok";
          errMsg = null;
        }

        updates.push(
          Device.updateOne(
            { _id: device._id },
            {
              status: newStatus,
              errorMessage: errMsg,
              lastUpdate: new Date(),
              battery: Math.max(
                0,
                Math.min(100, device.battery + (Math.random() * 10 - 5))
              ),
            }
          )
        );
      }
    }

    await Promise.all(updates);
    res.json({ message: `Simulated updates for ${updates.length} devices` });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// הוסף את הפונקציה הזו ל-src/controllers/deviceController.ts

export const getCompaniesStats = async (req: Request, res: Response) => {
  try {
    // שימוש ב-Aggregation של Mongo כדי לקבץ לפי חברה ולספור
    const stats = await Device.aggregate([
      {
        $group: {
          _id: "$company",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } }, // מיון מהגדול לקטן
    ]);

    // המרה לפורמט שהפרונט מצפה לו
    const companies = stats.map((item, index) => ({
      id: index + 1,
      name: item._id,
      deviceCount: item.count,
    }));

    res.json(companies);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
