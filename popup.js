const api = window.browser || window.chrome;

document.getElementById("changeColor").addEventListener("click", async () => {
  const [tab] = await api.tabs.query({
    active: true,
    currentWindow: true
  });

  if (!tab || !tab.id) {
    return;
  }

  await api.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      document.body.style.backgroundColor = "#ffeb3b";
    }
  });
});
