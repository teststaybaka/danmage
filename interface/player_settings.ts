import { EnumDescriptor, MessageDescriptor, PrimitiveType } from '@selfage/message/descriptor';

export enum BlockKind {
  KeywordBlockKind = 1,
  RegExpBlockKind = 3,
}

export let BLOCK_KIND: EnumDescriptor<BlockKind> = {
  name: 'BlockKind',
  values: [
    {
      name: 'KeywordBlockKind',
      value: 1,
    },
    {
      name: 'RegExpBlockKind',
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
  fields: [
    {
      name: 'kind',
      enumType: BLOCK_KIND,
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
  fields: [
    {
      name: 'blockPatterns',
      messageType: BLOCK_PATTERN,
      isArray: true,
    },
  ]
};

export enum DistributionStyle {
  RandomDistributionStyle = 1,
  TopDownDistributionStyle = 2,
}

export let DISTRIBUTION_STYLE: EnumDescriptor<DistributionStyle> = {
  name: 'DistributionStyle',
  values: [
    {
      name: 'RandomDistributionStyle',
      value: 1,
    },
    {
      name: 'TopDownDistributionStyle',
      value: 2,
    },
  ]
}

export interface DisplaySettings {
  speed?: number,
  opacity?: number,
  fontSize?: number,
  numLimit?: number,
  topMargin?: number,
  bottomMargin?: number,
  fontFamily?: string,
  enable?: boolean,
  showUserName?: boolean,
  distributionStyle?: DistributionStyle,
}

export let DISPLAY_SETTINGS: MessageDescriptor<DisplaySettings> = {
  name: 'DisplaySettings',
  fields: [
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
      name: 'topMargin',
      primitiveType: PrimitiveType.NUMBER,
    },
    {
      name: 'bottomMargin',
      primitiveType: PrimitiveType.NUMBER,
    },
    {
      name: 'fontFamily',
      primitiveType: PrimitiveType.STRING,
    },
    {
      name: 'enable',
      primitiveType: PrimitiveType.BOOLEAN,
    },
    {
      name: 'showUserName',
      primitiveType: PrimitiveType.BOOLEAN,
    },
    {
      name: 'distributionStyle',
      enumType: DISTRIBUTION_STYLE,
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
  fields: [
    {
      name: 'userId',
      primitiveType: PrimitiveType.STRING,
    },
    {
      name: 'displaySettings',
      messageType: DISPLAY_SETTINGS,
    },
    {
      name: 'blockSettings',
      messageType: BLOCK_SETTINGS,
    },
  ]
};
