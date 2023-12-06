chrome.runtime.onInstalled.addListener(async () => {
    let url = chrome.runtime.getURL("index.html");
    let tab = await chrome.tabs.create({ url });
    console.log(`Created tab ${tab.id}`);
});

chrome.action.onClicked.addListener(async () => {
    let url = chrome.runtime.getURL("index.html");
    let [existingTab] = await chrome.tabs.query({ url });
  
    if (existingTab) {
      chrome.tabs.update(existingTab.id, { active: true });
      console.log(`Switched to existing tab ${existingTab.id}`);
    } else {
      let newTab = await chrome.tabs.create({ url });
      console.log(`Created tab ${newTab.id}`);
    }
  });
  