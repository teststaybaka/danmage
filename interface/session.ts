import { MessageDescriptor, PrimitiveType } from '@selfage/message/descriptor';

export interface UserSession {
  userId?: string,
}

export let USER_SESSION: MessageDescriptor<UserSession> = {
  name: 'UserSession',
  fields: [
    {
      name: 'userId',
      primitiveType: PrimitiveType.STRING,
    },
  ]
};
