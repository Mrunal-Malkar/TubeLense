// store.ts
import { configureStore, combineReducers } from '@reduxjs/toolkit'
import preferenceReducer from "./baseInfoStore"
// import otherReducer from "./otherStore" // when you add more later

const reducers = {
  preference: preferenceReducer,
  // other: otherReducer,
}

const rootReducer = combineReducers(reducers)
type ReducerKey = keyof typeof reducers

// --- Load persisted state (async) ---
function loadPreloadedState(): Promise<Record<string, unknown>> {
  return new Promise((resolve) => {
    const keys = Object.keys(reducers)

    chrome.storage.local.get(keys, (result) => {
      if (chrome.runtime.lastError) {
        console.warn('Failed to load persisted state', chrome.runtime.lastError)
        resolve({})
        return
      }

      const preloadedState: Record<string, unknown> = {}
      for (const key of keys) {
        if (result[key] !== undefined) {
          preloadedState[key] = result[key] // already an object, no JSON.parse needed
        }
      }
      resolve(preloadedState)
    })
  })
}

// --- Debounced write helper ---
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function debounce<T extends (...args: any[]) => void>(fn: T, wait: number) {
  let timeout: ReturnType<typeof setTimeout> | undefined
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => fn(...args), wait)
  }
}

// --- Store creation, deferred until preloaded state resolves ---
export async function initStore() {
  const preloadedState = await loadPreloadedState()

  const store = configureStore({
    reducer: rootReducer,
    preloadedState,
  })

  let previousState = store.getState()

  const persist = debounce((changedEntries: Record<string, unknown>) => {
    chrome.storage.local.set(changedEntries, () => {
      if (chrome.runtime.lastError) {
        console.warn('Failed to persist state', chrome.runtime.lastError)
      }
    })
  }, 200)

  store.subscribe(() => {
    const state = store.getState()
    const changed: Record<string, unknown> = {}

    for (const key of Object.keys(reducers) as ReducerKey[]) {
      if (state[key] !== previousState[key]) {
        console.log("the state key",state[key]);
        changed[key] = state[key] // pass the object directly, no JSON.stringify needed
      }
    }

    if (Object.keys(changed).length > 0) {
      persist(changed)
    }

    previousState = state
  })

  return store
}

export type RootState = ReturnType<ReturnType<typeof configureStore<typeof rootReducer>>['getState']>
export type AppDispatch = ReturnType<typeof configureStore<typeof rootReducer>>['dispatch']