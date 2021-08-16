import { isMobile } from "react-device-detect";

const config = {
  SHORT_URL_REGEX: "([a-zA-Z0-9]{6,20})",
  LINKS_REGEX: "^links?code=.*&state=.*",
  MAX_RETRIES: 5,
  ALLOWED_CHARS_IN_SHORT_URL:
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
  LONG_URL_KEY: "long",
  SHORT_URL_KEY: "short",
};

if (process.env.NODE_ENV === "development") {
  config.DB_ENDPOINTS = {
    base: "http://localhost:8080",
  };
} else {
  config.DB_ENDPOINTS = {
    base: "https://sus.picio.us:8443",
  };
}

config.isMobile = isMobile;
config.DB_ENDPOINTS.newuser = `${config.DB_ENDPOINTS.base}/users/`;
config.DB_ENDPOINTS.userauth = `${config.DB_ENDPOINTS.base}/auth/`;
config.DB_ENDPOINTS.link = `${config.DB_ENDPOINTS.base}/links/`;
config.DB_ENDPOINTS.userlinks = `${config.DB_ENDPOINTS.base}/userlinks/`;

export default config;
