import { PlayerSettings, PLAYER_SETTINGS } from '../../interface/player_settings';
import { DatastoreModelDescriptor } from '@selfage/datastore_client/model_descriptor';

export let PLAYER_SETTINGS_MODEL: DatastoreModelDescriptor<PlayerSettings> = {
  name: "PlayerSettings",
  key: "userId",
  excludedIndexes: ["userId", "displaySettings", "blockSettings"],
  valueDescriptor: PLAYER_SETTINGS,
}
