export const GAME_NAME = "udaipur";
export const LOCAL_GAME_SERVER_PORT = 8000;
export const LOCAL_GAME_SERVER_URL = () =>
  `${window.location.protocol}//${window.location.hostname}:${LOCAL_GAME_SERVER_PORT}`;

export const LOCAL_WEB_SERVER_PORT = 3000;
export const LOCAL_WEB_SERVER_URL = () =>
  `${window.location.protocol}//${window.location.hostname}:${LOCAL_WEB_SERVER_PORT}`;
export const GAME_SERVER_PORT = LOCAL_GAME_SERVER_PORT;

export const APP_PRODUCTION =
  process.env.REACT_APP_DEV === "YES" ? false : true;

export function gameServer() {
  console.log(process.env);
  return APP_PRODUCTION
    ? `${window.location.protocol}//${window.location.host}`
    : LOCAL_GAME_SERVER_URL();
}

export function clientServer() {
  return APP_PRODUCTION
    ? `${window.location.protocol}//${window.location.host}`
    : LOCAL_WEB_SERVER_URL();
}
