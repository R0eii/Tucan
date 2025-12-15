import type { Company, Device, HealthSnap } from "../../types";

const prefixes = [
  "Phone",
  "Device",
  "Mobile",
  "Unit",
  "Terminal",
  "Station",
  "Node",
];
const locations = [
  "NYC",
  "LA",
  "CHI",
  "HOU",
  "PHX",
  "PHI",
  "SA",
  "SD",
  "DAL",
  "SJ",
  "AUS",
  "JAX",
  "SF",
  "COL",
  "IND",
];
const departments = [
  "Sales",
  "Support",
  "Ops",
  "HR",
  "IT",
  "Finance",
  "Legal",
  "Marketing",
  "Exec",
  "Warehouse",
];

const errorMessages = [
  "Connection timeout - device unreachable",
  "Authentication failed - invalid credentials",
  "Network interface down",
  "Battery critically low (< 5%)",
  "SIM card not detected",
  "Firmware update required",
  "Memory overflow - restart needed",
  "GPS module failure",
  "Screen unresponsive",
  "Cellular signal lost",
  "VPN connection failed",
  "Certificate expired",
  "Storage full (99%)",
  "Overheating detected",
  "Security policy violation",
];

const warningMessages = [
  "Battery low (15%)",
  "Weak signal strength",
  "Pending software update",
  "High CPU usage",
  "Storage nearly full (85%)",
  "Certificate expiring soon",
  "Unusual activity detected",
];

const generateIP = () =>
  `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(
    Math.random() * 255
  )}`;

const generateMAC = () =>
  "XX:XX:XX:XX:XX:XX".replace(/X/g, () =>
    "0123456789ABCDEF".charAt(Math.floor(Math.random() * 16))
  );

const randomRecentDate = (maxMinutesAgo: number) => {
  const now = new Date();
  const minutesAgo = Math.floor(Math.random() * maxMinutesAgo);
  return new Date(now.getTime() - minutesAgo * 60 * 1000);
};

const generateSnapshots = (count: number, isDaily: boolean): HealthSnap[] => {
  const snaps: HealthSnap[] = [];
  const now = new Date();

  for (let i = count; i >= 0; i--) {
    const time = new Date(
      now.getTime() - i * (isDaily ? 24 : 1) * 60 * 60 * 1000
    );

    // Logic: Most devices are healthy (uptime 1), some have "dips" (uptime 0.4 - 0.9)
    const random = Math.random();
    let uptime = 1;
    if (random > 0.98) uptime = 0; // Total failure
    else if (random > 0.92) uptime = 0.7; // Warning/Instability

    snaps.push({
      timestamp: isDaily ? time.toLocaleDateString() : time.getHours() + ":00",
      uptime,
      battery: Math.floor(Math.random() * 40) + 60,
      signal: Math.floor(Math.random() * 30) + 70,
    });
  }
  return snaps;
};

export const generateMockDevices = (count: number): Device[] => {
  const devices: Device[] = [];
  for (let i = 0; i < count; i++) {
    const statusRand = Math.random();
    let status: Device["status"], errorMessage;

    if (statusRand < 0.88) {
      status = "ok";
      errorMessage = null;
    } else if (statusRand < 0.96) {
      status = "error";
      errorMessage =
        errorMessages[Math.floor(Math.random() * errorMessages.length)];
    } else {
      status = "warning";
      errorMessage =
        warningMessages[Math.floor(Math.random() * warningMessages.length)];
    }

    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const location = locations[Math.floor(Math.random() * locations.length)];
    const dept = departments[Math.floor(Math.random() * departments.length)];

    devices.push({
      id: `DEV-${String(i + 1).padStart(5, "0")}`,
      name: `${prefix}-${location}-${String(i + 1).padStart(3, "0")}`,
      ip: generateIP(),
      mac: generateMAC(),
      status,
      errorMessage,
      lastUpdate: randomRecentDate(status === "ok" ? 5 : 60),
      department: dept,
      location,
      model: [
        "iPhone 14 Pro",
        "iPhone 15",
        "Samsung S23",
        "Pixel 8",
        "iPhone 13",
      ][Math.floor(Math.random() * 5)],
      os: ["iOS 17.2", "iOS 17.1", "Android 14", "Android 13"][
        Math.floor(Math.random() * 4)
      ],
      battery:
        status === "error" && errorMessage?.includes("Battery")
          ? Math.floor(Math.random() * 5)
          : Math.floor(Math.random() * 60) + 40,
      signalStrength:
        status === "ok"
          ? Math.floor(Math.random() * 30) + 70
          : Math.floor(Math.random() * 50) + 20,
      uptime: Math.floor(Math.random() * 720) + 1,
      lastIncident: status === "ok" ? null : randomRecentDate(120),
      recentHistory: generateSnapshots(24, false),
      longTermHistory: generateSnapshots(90, true),
    });
  }
  return devices;
};

export const simulateStatusChange = (devices: Device[]) => {
  const changedIds = new Set<string>();
  const updatedDevices = devices.map((device) => {
    if (Math.random() < 0.02) {
      changedIds.add(device.id);
      const newStatusRand = Math.random();
      let newStatus: Device["status"], newErrorMessage;

      if (device.status === "ok") {
        if (newStatusRand < 0.7) {
          newStatus = "error";
          newErrorMessage =
            errorMessages[Math.floor(Math.random() * errorMessages.length)];
        } else {
          newStatus = "warning";
          newErrorMessage =
            warningMessages[Math.floor(Math.random() * warningMessages.length)];
        }
      } else {
        newStatus = "ok";
        newErrorMessage = null;
      }
      return {
        ...device,
        status: newStatus,
        errorMessage: newErrorMessage,
        lastUpdate: new Date(),
        lastIncident: newStatus !== "ok" ? new Date() : device.lastIncident,
      };
    }
    if (device.status === "ok" && Math.random() < 0.3) {
      return { ...device, lastUpdate: new Date() };
    }
    return device;
  });
  return { updatedDevices, changedIds };
};

export const companies: Company[] = [
  { id: 1, name: "Acme Corporation", deviceCount: 324 },
  { id: 2, name: "Globex Industries", deviceCount: 187 },
  { id: 3, name: "Umbrella Corp", deviceCount: 412 },
  { id: 4, name: "Stark Industries", deviceCount: 256 },
  { id: 5, name: "Wayne Enterprises", deviceCount: 189 },
];
