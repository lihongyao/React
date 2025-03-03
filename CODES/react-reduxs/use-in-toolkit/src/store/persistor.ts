const REDUX_PERSIST_KEY = 'reduxState';
export const loadState = (): unknown => {
  try {
    const serializedState = localStorage.getItem(REDUX_PERSIST_KEY);
    if (!serializedState) return undefined;
    return JSON.parse(serializedState);
  } catch (err) {
    console.error('Failed to load state from localStorage', err);
    return undefined;
  }
};


export const saveState = (state: unknown) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(REDUX_PERSIST_KEY, serializedState);
  } catch (err) {
    console.error('Failed to save state to localStorage', err);
  }
};