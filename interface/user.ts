import { MessageDescriptor, PrimitiveType } from '@selfage/message/descriptor';

export interface User {
  id?: string,
  displayName?: string,
/* seconds since epoch */
  created?: number,
}

export let USER: MessageDescriptor<User> = {
  name: 'User',
  factoryFn: () => {
    return new Object();
  },
  fields: [
    {
      name: 'id',
      primitiveType: PrimitiveType.STRING,
    },
    {
      name: 'displayName',
      primitiveType: PrimitiveType.STRING,
    },
    {
      name: 'created',
      primitiveType: PrimitiveType.NUMBER,
    },
  ]
};
