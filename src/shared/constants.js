export const SHORT_URL_REGEX = '([a-zA-Z0-9]{6,20})';
export const MAX_RETRIES = 5;
export const ALLOWED_CHARS_IN_SHORT_URL = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

// DATABASE
export const LONG_URL_KEY = 'long';
export const SHORT_URL_KEY = 'short';
export const DB_ENDPOINTS = {
  base: 'http://localhost:3600',
};
DB_ENDPOINTS.newuser = `${DB_ENDPOINTS.base}/users/`;
DB_ENDPOINTS.userauth = `${DB_ENDPOINTS.base}/auth/`;
DB_ENDPOINTS.link = `${DB_ENDPOINTS.base}/links/`;
DB_ENDPOINTS.userlinks = `${DB_ENDPOINTS.base}/userlinks/`;
