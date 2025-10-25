import { EnumDescriptor, MessageDescriptor } from '@selfage/message/descriptor';

export enum Page {
  HOME = 1,
  NICKNAME = 2,
  HISTORY = 3,
}

export let PAGE: EnumDescriptor<Page> = {
  name: 'Page',
  values: [{
    name: 'HOME',
    value: 1,
  }, {
    name: 'NICKNAME',
    value: 2,
  }, {
    name: 'HISTORY',
    value: 3,
  }]
}

export interface BodyRl {
  page?: Page,
}

export let BODY_RL: MessageDescriptor<BodyRl> = {
  name: 'BodyRl',
  fields: [{
    name: 'page',
    index: 1,
    enumType: PAGE,
  }],
};
