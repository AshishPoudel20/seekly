import { FALLBACK_HOME } from '../data/fallbackHome';

let cachedHome = null;
let fetchPromise = null;
let hasFetchedOnce = false;

export function getCachedHome() {
  return cachedHome;
}

export function getInstantHome() {
  return cachedHome || FALLBACK_HOME;
}

export function hasHomeFetchedOnce() {
  return hasFetchedOnce;
}

export function setCachedHome(data) {
  if (data?.categories?.length) {
    cachedHome = data;
  }
}

export function loadHomeOnce(fetchHome) {
  if (cachedHome) {
    return Promise.resolve(cachedHome);
  }
  if (fetchPromise) return fetchPromise;

  hasFetchedOnce = true;
  fetchPromise = fetchHome()
    .then((result) => {
      setCachedHome(result);
      return cachedHome || FALLBACK_HOME;
    })
    .catch(() => {
      setCachedHome(FALLBACK_HOME);
      return FALLBACK_HOME;
    })
    .finally(() => {
      fetchPromise = null;
    });

  return fetchPromise;
}
