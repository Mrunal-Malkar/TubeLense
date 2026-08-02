import { createSlice,type PayloadAction } from "@reduxjs/toolkit";

export interface PreferencesState {
  schemaVersion: number;
  activeMode: "custom" | "cards";

  custom: {
    sites: {
      yt: boolean;
      insta: boolean;
      x: boolean;
      google: boolean;
    };
    topics: string[];
  };

  cards: {
    selectedCardName: string;
  };
}

const initialState: PreferencesState = {
  schemaVersion: 1,

  activeMode: "custom",

  custom: {
    sites: {
      yt: true,
      insta: false,
      x: true,
      google: true,
    },
    topics: ["react", "machine learning"],
  },

  cards: {
    selectedCardName: "Energy Boost",
  },
};

export const preferencesSlice = createSlice({
  name: "preferences",
  initialState,

  reducers: {
    // Active mode
    toggleActiveMode(state) {
      state.activeMode =
        state.activeMode === "cards" ? "custom" : "cards";
    },

    setActiveMode(
      state,
      action: PayloadAction<"custom" | "cards">
    ) {
      state.activeMode = action.payload;
    },

    // Sites
    setSiteEnabled(
      state,
      action: PayloadAction<{
        site: keyof PreferencesState["custom"]["sites"];
        enabled: boolean;
      }>
    ) {
      state.custom.sites[action.payload.site] = action.payload.enabled;
    },

    setAllSites(
      state,
      action: PayloadAction<PreferencesState["custom"]["sites"]>
    ) {
      state.custom.sites = action.payload;
    },

    // Topics
    setTopics(state, action: PayloadAction<string[]>) {
      state.custom.topics = action.payload;
    },

    addTopic(state, action: PayloadAction<string>) {
      if (!state.custom.topics.includes(action.payload)) {
        state.custom.topics.push(action.payload);
      }
    },

    removeTopic(state, action: PayloadAction<string>) {
      state.custom.topics = state.custom.topics.filter(
        (topic) => topic !== action.payload
      );
    },

    clearTopics(state) {
      state.custom.topics = [];
    },

    // Cards
    setSelectedCard(
      state,
      action: PayloadAction<string>
    ) {
      state.cards.selectedCardName = action.payload;
    },

    clearSelectedCard(state) {
      state.cards.selectedCardName = "";
    },

    // Reset
    resetPreferences() {
      return initialState;
    },
  },
});

export const {
  toggleActiveMode,
  setActiveMode,

  setSiteEnabled,
  setAllSites,

  setTopics,
  addTopic,
  removeTopic,
  clearTopics,

  setSelectedCard,
  clearSelectedCard,

  resetPreferences,
} = preferencesSlice.actions;

export default preferencesSlice.reducer;