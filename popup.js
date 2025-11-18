const api = window.browser || window.chrome;

document.getElementById("collect").addEventListener("click", async () => {
  const [tab] = await api.tabs.query({ active: true, currentWindow: true });
  if (!tab || !tab.url) return;

  const domain = new URL(tab.url).hostname;

  const cookies = await api.cookies.getAll({ domain: domain });

  const info = {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language,
    screenWidth: screen.width,
    screenHeight: screen.height,
    colorDepth: screen.colorDepth,
    deviceMemory: navigator.deviceMemory,
    hardwareConcurrency: navigator.hardwareConcurrency
  };

  const result = {
    domainCookies: cookies,
    deviceInfo: info
  };

  document.getElementById("output").textContent =
    JSON.stringify(result, null, 2);
});
