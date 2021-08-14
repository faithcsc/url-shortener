import Cookies from "js-cookie";
import config from "../../shared/config";

export const allowedChars = config.ALLOWED_CHARS_IN_SHORT_URL;

export const validUrl = (string) => {
  let url;
  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }
  return url.protocol === "http:" || url.protocol === "https:";
};

export const checkShortUrlExists = async (shorturl) => {
  return fetch(config.DB_ENDPOINTS.link + shorturl, { method: "GET" })
    .then((response) => response.json())
    .then((result) => {
      if (config.LONG_URL_KEY in result) {
        return true;
      } else {
        return false;
      }
    });
};

export const convertToValidLongUrl = (string) => {
  let url;
  try {
    url = new URL(string);
    if (url.protocol === "http:" || url.protocol === "https:") {
      return string;
    }
    return "";
  } catch (_) {
    if (string.startsWith("http:") || string.startsWith("https:")) {
      return "";
    }
  }

  if (string.includes("://") || !string.includes(".")) {
    return "";
  }

  let removedTrailingSlashes = string;
  while (removedTrailingSlashes !== "" && removedTrailingSlashes[0] === "/") {
    removedTrailingSlashes = removedTrailingSlashes.substr(1);
  }

  const withProtocol = `https://${removedTrailingSlashes}`;
  if (validUrl(withProtocol)) {
    return `//${removedTrailingSlashes}`;
  }
  return "";
};

export const displayUrl = (string) => {
  const replaceStarts = ["https://", "http://", "/"];
  replaceStarts.forEach((e) => {
    if (string.startsWith(e)) {
      string = string.substr(e.length);
    }
  });
  return string;
};

export const isValidLongUrl = (string) => convertToValidLongUrl(string) !== "";

export const createShortUrl = () => {
  let result = "";
  for (let i = 0; i < 6; i += 1) {
    result += allowedChars[Math.floor(Math.random() * allowedChars.length)];
  }
  return result;
};

export const getUnusedShortUrl = async () => {
  let validShortUrl = false;
  let shortUrl = "";
  for (let i = 0; i <= 10; i++) {
    shortUrl = createShortUrl();
    validShortUrl = !(await checkShortUrlExists(shortUrl));
    if (validShortUrl) return shortUrl;
  }
  return shortUrl;
};

export const getLoggedinUser = () =>
  Cookies.get("userid") === undefined ? "" : Cookies.get("userid");
