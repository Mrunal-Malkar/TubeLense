import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface PreferencesState {
  schemaVersion: number;
  activeMode: "custom" | "cards";
  activeTopicPack:string;
  focusScore: number;
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
  activeTopicPack:"My Topics",
  focusScore: 0,

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

    toggleSiteEnabled(
      state,
      action: PayloadAction<keyof PreferencesState["sites"]>,
    ) {
      state.sites[action.payload] = !state.sites[action.payload];
    },

    setActiveTopicPack(state,action:PayloadAction<{packLabel:string}>){
      const isValid=state.topicsPack.find(i=>i.label==action.payload.packLabel)?true:false;
      if(isValid){
        state.activeTopicPack=action.payload.packLabel
      }
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

      if (pack) {
        pack.label = action.payload.newLabel;
      }
    },

    removePack(
      state,
      action: PayloadAction<string>, // label
    ) {
      state.topicsPack = state.topicsPack.filter(
        (pack) => pack.label !== action.payload,
      );
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
      if (state.activeMode !== "cards") {
        state.activeMode = "cards";
      }
    },

    clearSelectedCard(state) {
      state.cards.selectedCardName = "";
    },

    // Reset
    resetPreferences() {
      return initialState;
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

      const topic = pack?.topics.find((t) => t.id === action.payload.topicId);

      if (topic) {
        topic.topic = action.payload.topic;
      }
    },
  },
});

export const {
  toggleActiveMode,
  setActiveMode,

  setSiteEnabled,
  toggleSiteEnabled,
  setAllSites,

  addPack,
  removePack,
  addTopicToTopicPack,
  removeTopic,

  setSelectedCard,
  clearSelectedCard,
  renamePack,
  renameTopic,
  resetPreferences,
} = preferencesSlice.actions;
export default preferencesSlice.reducer;
