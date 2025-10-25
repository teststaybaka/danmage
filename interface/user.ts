import { PrimitiveType, MessageDescriptor } from '@selfage/message/descriptor';

export interface User {
  id?: string,
  nickname?: string,
  created?: number,
}

export let USER: MessageDescriptor<User> = {
  name: 'User',
  fields: [{
    name: 'id',
    index: 1,
    primitiveType: PrimitiveType.STRING,
  }, {
    name: 'nickname',
    index: 2,
    primitiveType: PrimitiveType.STRING,
  }, {
    name: 'created',
    index: 3,
    primitiveType: PrimitiveType.NUMBER,
  }],
};
