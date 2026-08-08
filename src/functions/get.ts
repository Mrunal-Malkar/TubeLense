export async function getActiveTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    return tab;

} 

export function generateUUID(){
  return crypto.randomUUID();
}