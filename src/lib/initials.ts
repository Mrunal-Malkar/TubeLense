export const initialValues={
  schemaVersion: 1,
  activeMode: "custom", // "custom" | "cards"

  custom: {
    sites: { yt: true, insta: false, x: true, google: true },
    topics: ["react", "machine learning"]
  },

  cards: {
    selectedCardId: "coder", // null if none chosen yet
    // don't store card *definitions* here — see below
  }
}