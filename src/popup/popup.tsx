import { useState } from "react";
import toast from "react-hot-toast";
// import getActiveTab from "../functions/getActiveTab";

// type isActiveType={
//     isActive:boolean,
//     msg:Text
// }

export default function Popup() {
  const [goal, setGoal] = useState("");

  async function activeExtension() {
    await chrome.storage.local.set({ lens_active: true });
    toast.success("activated");
  }

  return (
    <main className="w-90 bg-zinc-950 text-zinc-100 p-5">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">FeedLens</h1>

        <p className="mt-1 text-sm text-zinc-400">One less distraction.</p>
      </header>

      {/* Lens */}
      <section className="mb-8 flex flex-col items-center">
        <button
          onClick={activeExtension}
          className="
          h-24 w-24
          rounded-full
          border-2 border-emerald-500
          bg-zinc-900
          transition
          hover:scale-105
          active:scale-95
        "
        >
          👁️
        </button>

        <h2 className="mt-4 text-lg font-medium">Filtering On</h2>

        <p className="mt-1 text-center text-sm text-zinc-400">
          Your feed is cleaned up.
        </p>
      </section>

      {/* Goal */}
      <section className="space-y-3">
        <label className="text-sm font-medium text-zinc-300">
          What brought you here?
        </label>

        <input
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="Watching React tutorials..."
          className="
            w-full
            rounded-xl
            border border-zinc-800
            bg-zinc-900
            px-4 py-3
            text-sm
            outline-none
            transition
            placeholder:text-zinc-500
            focus:border-emerald-500
          "
        />

        <button
          className="
            w-full
            rounded-xl
            bg-emerald-500
            py-3
            font-medium
            text-black
            transition
            hover:bg-emerald-400
          "
        >
          Analyze Intent
        </button>
      </section>

      {/* Stats */}
      <section className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
        <p className="text-xs uppercase tracking-wide text-zinc-500">Today</p>

        <div className="mt-3 flex justify-between">
          <div>
            <h3 className="text-2xl font-bold">37</h3>
            <p className="text-xs text-zinc-400">distractions blocked</p>
          </div>

          <div className="text-right">
            <h3 className="text-2xl font-bold">14m</h3>
            <p className="text-xs text-zinc-400">time saved</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-6 flex justify-end">
        <button className="text-sm text-zinc-500 hover:text-zinc-200">
          Settings
        </button>
      </footer>
    </main>
  );
}
