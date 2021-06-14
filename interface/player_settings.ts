import { EnumDescriptor, MessageDescriptor, PrimitiveType } from '@selfage/message/descriptor';

export enum BlockKind {
  Keyword = 1,
  RegExp = 3,
}

export let BLOCK_KIND: EnumDescriptor<BlockKind> = {
  name: 'BlockKind',
  values: [
    {
      name: 'Keyword',
      value: 1,
    },
    {
      name: 'RegExp',
      value: 3,
    },
  ]
}

export interface BlockPattern {
  kind?: BlockKind,
  content?: string,
}

export let BLOCK_PATTERN: MessageDescriptor<BlockPattern> = {
  name: 'BlockPattern',
  factoryFn: () => {
    return new Object();
  },
  fields: [
    {
      name: 'kind',
      enumDescriptor: BLOCK_KIND,
    },
    {
      name: 'content',
      primitiveType: PrimitiveType.STRING,
    },
  ]
};

export interface BlockSettings {
  blockPatterns?: Array<BlockPattern>,
}

export let BLOCK_SETTINGS: MessageDescriptor<BlockSettings> = {
  name: 'BlockSettings',
  factoryFn: () => {
    return new Object();
  },
  fields: [
    {
      name: 'blockPatterns',
      messageDescriptor: BLOCK_PATTERN,
      arrayFactoryFn: () => {
        return new Array<any>();
      },
    },
  ]
};

export interface DisplaySettings {
  enable?: boolean,
  speed?: number,
  opacity?: number,
  fontSize?: number,
  numLimit?: number,
  fontFamily?: string,
  showUserName?: boolean,
}

export let DISPLAY_SETTINGS: MessageDescriptor<DisplaySettings> = {
  name: 'DisplaySettings',
  factoryFn: () => {
    return new Object();
  },
  fields: [
    {
      name: 'enable',
      primitiveType: PrimitiveType.BOOLEAN,
    },
    {
      name: 'speed',
      primitiveType: PrimitiveType.NUMBER,
    },
    {
      name: 'opacity',
      primitiveType: PrimitiveType.NUMBER,
    },
    {
      name: 'fontSize',
      primitiveType: PrimitiveType.NUMBER,
    },
    {
      name: 'numLimit',
      primitiveType: PrimitiveType.NUMBER,
    },
    {
      name: 'fontFamily',
      primitiveType: PrimitiveType.STRING,
    },
    {
      name: 'showUserName',
      primitiveType: PrimitiveType.BOOLEAN,
    },
  ]
};

export interface PlayerSettings {
  userId?: string,
  displaySettings?: DisplaySettings,
  blockSettings?: BlockSettings,
}

export let PLAYER_SETTINGS: MessageDescriptor<PlayerSettings> = {
  name: 'PlayerSettings',
  factoryFn: () => {
    return new Object();
  },
  fields: [
    {
      name: 'userId',
      primitiveType: PrimitiveType.STRING,
    },
    {
      name: 'displaySettings',
      messageDescriptor: DISPLAY_SETTINGS,
    },
    {
      name: 'blockSettings',
      messageDescriptor: BLOCK_SETTINGS,
    },
  ]
};