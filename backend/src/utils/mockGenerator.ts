export const companiesList = [
  "Acme Corporation",
  "Globex Industries",
  "Umbrella Corp",
  "Stark Industries",
  "Wayne Enterprises"
];

const prefixes = ["Phone", "Device", "Mobile", "Unit", "Terminal", "Station"];
const locations = ["NYC", "LA", "CHI", "HOU", "PHX", "TLV", "LON", "BER", "PAR"];
const departments = ["Sales", "Support", "Ops", "HR", "IT", "Engineering"];
const errorMessages = [
  "Connection timeout", "Battery critical", "Signal lost", "Hardware fault"
];

const generateSnapshots = (count: number, isDaily: boolean) => {
  const snaps = [];
  const now = new Date();
  for (let i = count; i >= 0; i--) {
    const time = new Date(now.getTime() - i * (isDaily ? 24 : 1) * 60 * 60 * 1000);
    snaps.push({
      timestamp: isDaily ? time.toLocaleDateString() : `${time.getHours()}:00`,
      uptime: Math.random() > 0.95 ? 0 : 1,
      battery: Math.floor(Math.random() * 60) + 40,
      signal: Math.floor(Math.random() * 50) + 50,
    });
  }
  return snaps;
};

export const generateDevices = (count: number) => {
  const devices = [];
  for (let i = 0; i < count; i++) {
    const statusRand = Math.random();
    let status: 'ok' | 'error' | 'warning' = 'ok';
    let errorMessage = null;

    if (statusRand > 0.92) {
      status = 'error';
      errorMessage = errorMessages[Math.floor(Math.random() * errorMessages.length)];
    } else if (statusRand > 0.85) {
      status = 'warning';
      errorMessage = "High Latency";
    }

    // Assign a random company from the list
    const company = companiesList[Math.floor(Math.random() * companiesList.length)];

    devices.push({
      id: `DEV-${String(i + 1).padStart(5, "0")}`,
      name: `${prefixes[Math.floor(Math.random() * prefixes.length)]}-${i}`,
      ip: `192.168.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 255)}`,
      mac: `00:1A:2B:3C:${Math.floor(Math.random() * 99)}:${Math.floor(Math.random() * 99)}`,
      company,
      status,
      errorMessage,
      lastUpdate: new Date(),
      department: departments[Math.floor(Math.random() * departments.length)],
      location: locations[Math.floor(Math.random() * locations.length)],
      deviceModel: "Gen-X Pro",
      os: "v3.0.1",
      battery: Math.floor(Math.random() * 100),
      signalStrength: Math.floor(Math.random() * 100),
      uptime: Math.floor(Math.random() * 1000),
      lastIncident: status !== 'ok' ? new Date() : null,
      recentHistory: generateSnapshots(24, false),
      longTermHistory: generateSnapshots(90, true),
    });
  }
  return devices;
};