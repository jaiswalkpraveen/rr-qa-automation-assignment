/**
 * Environment Configuration for TMDB Discover
 */
export const environments = {
  tmdb: {
    baseURL: 'https://tmdb-discover.surge.sh',
  },
};

export function getEnvironment() {
  return environments.tmdb;
}