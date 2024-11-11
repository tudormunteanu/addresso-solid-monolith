const CACHE_KEY = "addressoAlchemyCache";

function isServer() {
  return typeof window === 'undefined';
}

function loadCacheFromStorage(): Map<string, any> {
  if (isServer()) {
    return new Map();
  }

  try {
    const data = localStorage.getItem(CACHE_KEY);
    if (!data) {
      return new Map();
    }
    const parsed = JSON.parse(data);
    return new Map(Object.entries(parsed));
  } catch (error) {
    console.error('Error loading cache from localStorage:', error);
    return new Map();
  }
}

function saveCacheToStorage(cache: Map<string, any>): void {
  if (isServer()) {
    return;
  }

  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify(Object.fromEntries(cache))
    );
  } catch (error) {
    console.error('Error saving cache to localStorage:', error);
  }
}

export { loadCacheFromStorage, saveCacheToStorage };
