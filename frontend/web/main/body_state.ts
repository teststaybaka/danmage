import { EnumDescriptor, MessageDescriptor } from '@selfage/message/descriptor';

export enum Page {
  HOME = 1,
  NICKNAME = 2,
  HISTORY = 3,
  FEEDBACK = 4,
}

export let PAGE: EnumDescriptor<Page> = {
  name: 'Page',
  values: [
    {
      name: 'HOME',
      value: 1,
    },
    {
      name: 'NICKNAME',
      value: 2,
    },
    {
      name: 'HISTORY',
      value: 3,
    },
    {
      name: 'FEEDBACK',
      value: 4,
    },
  ]
}

export interface BodyState {
  page?: Page,
}

export let BODY_STATE: MessageDescriptor<BodyState> = {
  name: 'BodyState',
  fields: [
    {
      name: 'page',
      enumType: PAGE,
    },
  ]
};
