import { MessageDescriptor, PrimitiveType } from '@selfage/message/descriptor';

export interface UserIssue {
  id?: string,
  email?: string,
  description?: string,
  created?: number,
}

export let USER_ISSUE: MessageDescriptor<UserIssue> = {
  name: 'UserIssue',
  fields: [
    {
      name: 'id',
      primitiveType: PrimitiveType.STRING,
    },
    {
      name: 'email',
      primitiveType: PrimitiveType.STRING,
    },
    {
      name: 'description',
      primitiveType: PrimitiveType.STRING,
    },
    {
      name: 'created',
      primitiveType: PrimitiveType.NUMBER,
    },
  ]
};
