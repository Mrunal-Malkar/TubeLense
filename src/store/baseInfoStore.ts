import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { CARD_DATA } from "../lib/cards";
import { generateUUID } from "../functions/get";

export interface PreferencesState {
  schemaVersion: number;
  activeMode: "custom" | "cards";
  activeTopicPack: string;
  focusScore: number;
  strictness:"relaxed"|"balanced"|"strict";
  sites: {
    yt: boolean;
    insta: boolean;
    x: boolean;
    google: boolean;
  };
  topicsPack: { label: string; topics: { id: string; topic: string }[] }[];

  cards: {
    selectedCardName: string;
  };
}

export interface Topic {
  id: string;
  topic: string;
}

export interface TopicsPack {
  label: string;
  topics: Topic[];
}

const initialState: PreferencesState = {
  schemaVersion: 1,
  activeMode: "custom",
  activeTopicPack: "My Topics",
  focusScore: 0,
  strictness:"balanced",

  sites: {
    yt: true,
    insta: false,
    x: true,
    google: true,
  },
  topicsPack: [
    {
      label: "My Topics",
      topics: [
        { id: "1", topic: "react" },
        { id: "2", topic: "machine learning" },
      ],
    },
  ],

  cards: {
    selectedCardName: "Energy Boost",
  },
};

export const preferencesSlice = createSlice({
  name: "preference",
  initialState,

  reducers: {
    // Active mode
    toggleActiveMode(state) {
      state.activeMode = state.activeMode === "cards" ? "custom" : "cards";
    },

    setActiveMode(state, action: PayloadAction<"custom" | "cards">) {
      state.activeMode = action.payload;
    },

    // Sites
    setSiteEnabled(
      state,
      action: PayloadAction<{
        site: keyof PreferencesState["sites"];
        enabled: boolean;
      }>,
    ) {
      state.sites[action.payload.site] = action.payload.enabled;
    },
    setStrictness(state,action:PayloadAction<string>){
      if(state.strictness!=action.payload && (action.payload=="relaxed" || action.payload=="balanced" || action.payload=="strict")){
        state.strictness=action.payload;
      }
    },

    toggleSiteEnabled(
      state,
      action: PayloadAction<keyof PreferencesState["sites"]>,
    ) {
      state.sites[action.payload] = !state.sites[action.payload];
    },

    setAllSites(state, action: PayloadAction<PreferencesState["sites"]>) {
      state.sites = action.payload;
    },

    // Pack
    addPack(
      state,
      action: PayloadAction<{
        label: string;
        topics?: Topic[];
      }>,
    ) {
      state.topicsPack.push({
        label: action.payload.label,
        topics: action.payload.topics ?? [],
      });
    },

    removePack(
      state,
      action: PayloadAction<string>, // label
    ) {
      state.topicsPack = state.topicsPack.filter(
        (pack) => pack.label !== action.payload,
      );

      if (state.activeTopicPack === action.payload) {
        state.activeTopicPack = state.topicsPack[0]?.label ?? "";
      }
    },

    // Topics
    addCustomTopicPack(
      state,
      action: PayloadAction<{
        label: string;
        topics: { id: string; topic: string }[];
      }>,
    ) {
      const topic = action.payload;
      state.topicsPack.push(topic);
    },

    addTopicToTopicPack(
      state,
      action: PayloadAction<{
        targetPack: string;
        topic: Topic;
      }>,
    ) {
      const pack = state.topicsPack.find(
        (pack) => pack.label === action.payload.targetPack,
      );

      if (pack) {
        pack.topics.push(action.payload.topic);
      }
    },

    removeTopic(
      state,
      action: PayloadAction<{
        targetPack: string;
        topicId: string;
      }>,
    ) {
      const pack = state.topicsPack.find(
        (pack) => pack.label === action.payload.targetPack,
      );

      if (pack) {
        pack.topics = pack.topics.filter(
          (topic) => topic.id !== action.payload.topicId,
        );
      }
    },

    // Cards
    setSelectedCard(state, action: PayloadAction<string>) {
      state.cards.selectedCardName = action.payload;
      const card = CARD_DATA.find((i) => i.name === action.payload);
      if (!card) return;

      const existingCardPackIndex = state.topicsPack.findIndex(
        (pack) => pack.label === action.payload,
      );
      if (existingCardPackIndex >= 0) {
        state.activeTopicPack = action.payload;
        state.activeMode = "cards";
        return;
      }

      const topics: Topic[] = card.topics.map((topic: string) => ({
        id: generateUUID(),
        topic,
      }));

      const newPack = { label: card.name, topics };
      state.topicsPack.push(newPack);
      state.activeTopicPack = newPack.label;
      state.activeMode = "cards";
    },

    clearSelectedCard(state) {
      state.cards.selectedCardName = "";
    },

    // Reset
    resetPreferences() {
      return initialState;
    },

    moveTopicUp(
      state,
      action: PayloadAction<{
        targetPack: string;
        index: number;
      }>,
    ) {
      const pack = state.topicsPack.find(
        (p) => p.label === action.payload.targetPack,
      );

      if (!pack) return;

      const { index } = action.payload;

      if (index <= 0 || index >= pack.topics.length) return;

      [pack.topics[index - 1], pack.topics[index]] = [
        pack.topics[index],
        pack.topics[index - 1],
      ];
    },

    moveTopicDown(
      state,
      action: PayloadAction<{
        targetPack: string;
        index: number;
      }>,
    ) {
      const pack = state.topicsPack.find(
        (p) => p.label === action.payload.targetPack,
      );

      if (!pack) return;

      const { index } = action.payload;

      if (index < 0 || index >= pack.topics.length - 1) return;

      [pack.topics[index], pack.topics[index + 1]] = [
        pack.topics[index + 1],
        pack.topics[index],
      ];
    },

    renamePack(
      state,
      action: PayloadAction<{
        oldLabel: string;
        newLabel: string;
      }>,
    ) {
      const pack = state.topicsPack.find(
        (p) => p.label === action.payload.oldLabel,
      );

      if (!pack) return;

      pack.label = action.payload.newLabel;

      // Keep active pack in sync
      if (state.activeTopicPack === action.payload.oldLabel) {
        state.activeTopicPack = action.payload.newLabel;
      }
    },

    renameTopic(
      state,
      action: PayloadAction<{
        targetPack: string;
        topicId: string;
        topic: string;
      }>,
    ) {
      const pack = state.topicsPack.find(
        (p) => p.label === action.payload.targetPack,
      );

      if (!pack) return;

      const topic = pack.topics.find((t) => t.id === action.payload.topicId);

      if (!topic) return;

      topic.topic = action.payload.topic;
    },

    resetPackTopics(state, action: PayloadAction<string>) {
      const pack = state.topicsPack.find((p) => p.label === action.payload);
      if (!pack) return;

      const card = CARD_DATA.find((item) => item.name === action.payload);
      if (!card) return;

      pack.topics = card.topics.map((topic) => ({
        id: generateUUID(),
        topic,
      }));
    },

    setActiveTopicPack(state, action: PayloadAction<string>) {
      const exists = state.topicsPack.some((p) => p.label === action.payload);

      if (exists) {
        state.activeTopicPack = action.payload;

        // Optional: switching to a pack implies custom mode
        if (state.activeMode !== "custom") {
          state.activeMode = "custom";
        }
      }
    },
  },
});

export const {
  toggleActiveMode,
  setActiveMode,
  moveTopicDown,
  moveTopicUp,
  setSiteEnabled,
  toggleSiteEnabled,
  setAllSites,
  setStrictness,
  addPack,
  removePack,
  addTopicToTopicPack,
  removeTopic,
  setActiveTopicPack,
  setSelectedCard,
  clearSelectedCard,
  resetPackTopics,
  renamePack,
  renameTopic,
  resetPreferences,
} = preferencesSlice.actions;
export default preferencesSlice.reducer;
