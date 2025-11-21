SAT project


Should worrk both on fire fox and chrome.

Installing the Extension in Google Chrome

To install the extension in Chrome, first open the browser and go to the top-right menu. Select “Extensions,” then choose “Manage Extensions.” Enable Developer Mode using the switch in the upper right corner of the page. Once Developer Mode is active, select “Load unpacked.” A file chooser will appear. Navigate to the folder that contains your extension’s manifest.json file and select that folder. Chrome will load the extension immediately.

Installing the Extension in Firefox

To install the extension temporarily in Firefox, open the browser and enter about:debugging into the address bar. Select “This Firefox.” Choose the option to load a temporary add-on. A file chooser will appear. Select the manifest.json file inside your extension folder. Firefox will load the extension for the current session. As a heads up Firefox removes temporary add-ons when the browser closes.

The SQL table is made by:

CREATE TABLE collected_data (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    timestamp DATETIME(6) NOT NULL,
    domain VARCHAR(255) NOT NULL,
    cookie_name VARCHAR(255),
    cookie_value TEXT,

    user_agent TEXT,
    platform VARCHAR(255),
    language VARCHAR(32),

    screen_width INT,
    screen_height INT,
    color_depth INT,

    device_memory FLOAT,
    hardware_concurrency INT,

    timezone VARCHAR(255),
    browser_version TEXT,
    vendor VARCHAR(255),

    gpu_vendor TEXT,
    gpu_renderer TEXT,

    battery_charging BOOLEAN,
    battery_level FLOAT,
    battery_charging_time DOUBLE,
    battery_discharging_time DOUBLE,

    online BOOLEAN,
    connection_type VARCHAR(64),
    downlink FLOAT,
    rtt FLOAT,

    storage_quota BIGINT,
    storage_usage BIGINT
);
