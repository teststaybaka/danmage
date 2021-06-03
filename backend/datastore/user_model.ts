import { User, USER } from '../../interface/user';
import { DatastoreModelDescriptor } from '@selfage/datastore_client/model_descriptor';

export let USER_MODEL: DatastoreModelDescriptor<User> = {
  name: "User",
  key: "id",
  excludedIndexes: ["id", "displayName", "created"],
  valueDescriptor: USER,
}
