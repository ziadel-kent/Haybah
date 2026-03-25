/**
 * Utility to determine the API base path based on the environment.
 * In Netlify, functions are served at /.netlify/functions
 * In our Express/Cloud Run environment, they are at /api
 */
export const getApiUrl = (endpoint: string) => {
  const isNetlify = window.location.hostname.includes('netlify.app');
  const base = isNetlify ? '/.netlify/functions' : '/api';
  return `${base}/${endpoint}`;
};
