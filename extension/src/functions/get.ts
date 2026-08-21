import { OPPOSITE_CARD_NAME_MAP, type CardName } from "../lib/cards";

export async function getActiveTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}

export function generateUUID(){
  return crypto.randomUUID();
}

export function getOppositeTitle(name:CardName): string | undefined {
  return OPPOSITE_CARD_NAME_MAP[name];
}
