import { PLAYER_SETTINGS_STORAGE } from "./common/player_settings_storage";
import { Refresher } from "./refresher";

async function main(): Promise<void> {
  let playerSettings = await PLAYER_SETTINGS_STORAGE.read();
  switch (location.hostname) {
    case "www.youtube.com":
      Refresher.createYouTube(playerSettings);
      break;
    case "www.twitch.tv":
      Refresher.createTwitch(playerSettings);
      break;
    case "kick.com":
      Refresher.createKick(playerSettings);
      break;
    case "static.crunchyroll.com":
      Refresher.createCrunchyroll(playerSettings);
      break;
    default:
      throw new Error(`Unsupported hostname: ${location.hostname}.`);
  }
}

main();
