export default async function getActiveTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    return tab;

} 


