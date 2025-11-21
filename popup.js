const api = window.browser || window.chrome;

async function getGPUInfo() {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) return {};
    const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
    return {
      vendor: debugInfo ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : null,
      renderer: debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : null
    };
  } catch {
    return {};
  }
}

async function getBatteryInfo() {
  try {
    const batt = await navigator.getBattery();
    return {
      charging: batt.charging,
      level: batt.level,
      chargingTime: batt.chargingTime,
      dischargingTime: batt.dischargingTime
    };
  } catch {
    return {};
  }
}

async function getStorageInfo() {
  try {
    if (navigator.storage && navigator.storage.estimate) {
      const est = await navigator.storage.estimate();
      return {
        quota: est.quota,
        usage: est.usage
      };
    }
    return {};
  } catch {
    return {};
  }
}

document.getElementById("collect").addEventListener("click", async () => {
  const [tab] = await api.tabs.query({ active: true, currentWindow: true });
  if (!tab || !tab.url) return;

  const domain = new URL(tab.url).hostname;
  const cookies = await api.cookies.getAll({ domain });

  const gpu = await getGPUInfo();
  const battery = await getBatteryInfo();
  const storageInfo = await getStorageInfo();

  const info = {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language,
    screenWidth: screen.width,
    screenHeight: screen.height,
    colorDepth: screen.colorDepth,
    deviceMemory: navigator.deviceMemory,
    hardwareConcurrency: navigator.hardwareConcurrency,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    browserVersion: navigator.appVersion,
    vendor: navigator.vendor,
    gpuVendor: gpu.vendor,
    gpuRenderer: gpu.renderer,
    batteryCharging: battery.charging,
    batteryLevel: battery.level,
    batteryChargingTime: battery.chargingTime,
    batteryDischargingTime: battery.dischargingTime,
    online: navigator.onLine,
    connectionType: navigator.connection ? navigator.connection.effectiveType : null,
    downlink: navigator.connection ? navigator.connection.downlink : null,
    rtt: navigator.connection ? navigator.connection.rtt : null,
    storageQuota: storageInfo.quota,
    storageUsage: storageInfo.usage
  };

const payload = {
  domain,
  timestamp: new Date().toISOString(),

  cookies,

  user_agent: info.userAgent,
  platform: info.platform,
  language: info.language,
  screen_width: info.screenWidth,
  screen_height: info.screenHeight,
  color_depth: info.colorDepth,
  device_memory: info.deviceMemory,
  hardware_concurrency: info.hardwareConcurrency,

  timezone: info.timezone,
  browser_version: info.browserVersion,
  vendor: info.vendor,
  gpu_vendor: info.gpuVendor,
  gpu_renderer: info.gpuRenderer,

  battery_charging: info.batteryCharging,
  battery_level: info.batteryLevel,
  battery_charging_time: info.batteryChargingTime,
  battery_discharging_time: info.batteryDischargingTime,

  online: info.online,
  connection_type: info.connectionType,
  downlink: info.downlink,
  rtt: info.rtt,

  storage_quota: info.storageQuota,
  storage_usage: info.storageUsage
};

  document.getElementById("output").textContent =
    JSON.stringify(payload, null, 2);

  try {
    const response = await fetch("http://localhost:3000/collect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      console.error("Server error");
    }
  } catch (e) {
    console.error("Failed to send", e);
  }
});
