import { EnumDescriptor, PrimitiveType, MessageDescriptor } from '@selfage/message/descriptor';

export enum BlockKind {
  KeywordBlockKind = 1,
  RegExpBlockKind = 3,
}

export let BLOCK_KIND: EnumDescriptor<BlockKind> = {
  name: 'BlockKind',
  values: [{
    name: 'KeywordBlockKind',
    value: 1,
  }, {
    name: 'RegExpBlockKind',
    value: 3,
  }]
}

export interface BlockPattern {
  kind?: BlockKind,
  content?: string,
}

export let BLOCK_PATTERN: MessageDescriptor<BlockPattern> = {
  name: 'BlockPattern',
  fields: [{
    name: 'kind',
    index: 1,
    enumType: BLOCK_KIND,
  }, {
    name: 'content',
    index: 2,
    primitiveType: PrimitiveType.STRING,
  }],
};

export interface BlockSettings {
  blockPatterns?: Array<BlockPattern>,
}

export let BLOCK_SETTINGS: MessageDescriptor<BlockSettings> = {
  name: 'BlockSettings',
  fields: [{
    name: 'blockPatterns',
    index: 1,
    messageType: BLOCK_PATTERN,
    isArray: true,
  }],
};

export enum DistributionStyle {
  RandomDistributionStyle = 1,
  TopDownDistributionStyle = 2,
}

export let DISTRIBUTION_STYLE: EnumDescriptor<DistributionStyle> = {
  name: 'DistributionStyle',
  values: [{
    name: 'RandomDistributionStyle',
    value: 1,
  }, {
    name: 'TopDownDistributionStyle',
    value: 2,
  }]
}

export interface DisplaySettings {
  speed?: number,
  opacity?: number,
  fontSize?: number,
  density?: number,
  topMargin?: number,
  bottomMargin?: number,
  fontFamily?: string,
  fontWeight?: number,
  enable?: boolean,
  showUserName?: boolean,
  distributionStyle?: DistributionStyle,
  enableInteraction?: boolean,
  showChatWindow?: boolean,
}

export let DISPLAY_SETTINGS: MessageDescriptor<DisplaySettings> = {
  name: 'DisplaySettings',
  fields: [{
    name: 'speed',
    index: 1,
    primitiveType: PrimitiveType.NUMBER,
  }, {
    name: 'opacity',
    index: 2,
    primitiveType: PrimitiveType.NUMBER,
  }, {
    name: 'fontSize',
    index: 3,
    primitiveType: PrimitiveType.NUMBER,
  }, {
    name: 'density',
    index: 4,
    primitiveType: PrimitiveType.NUMBER,
  }, {
    name: 'topMargin',
    index: 5,
    primitiveType: PrimitiveType.NUMBER,
  }, {
    name: 'bottomMargin',
    index: 6,
    primitiveType: PrimitiveType.NUMBER,
  }, {
    name: 'fontFamily',
    index: 7,
    primitiveType: PrimitiveType.STRING,
  }, {
    name: 'fontWeight',
    index: 8,
    primitiveType: PrimitiveType.NUMBER,
  }, {
    name: 'enable',
    index: 9,
    primitiveType: PrimitiveType.BOOLEAN,
  }, {
    name: 'showUserName',
    index: 10,
    primitiveType: PrimitiveType.BOOLEAN,
  }, {
    name: 'distributionStyle',
    index: 11,
    enumType: DISTRIBUTION_STYLE,
  }, {
    name: 'enableInteraction',
    index: 12,
    primitiveType: PrimitiveType.BOOLEAN,
  }, {
    name: 'showChatWindow',
    index: 13,
    primitiveType: PrimitiveType.BOOLEAN,
  }],
};

export interface PlayerSettings {
  userId?: string,
  displaySettings?: DisplaySettings,
  blockSettings?: BlockSettings,
}

export let PLAYER_SETTINGS: MessageDescriptor<PlayerSettings> = {
  name: 'PlayerSettings',
  fields: [{
    name: 'userId',
    index: 1,
    primitiveType: PrimitiveType.STRING,
  }, {
    name: 'displaySettings',
    index: 2,
    messageType: DISPLAY_SETTINGS,
  }, {
    name: 'blockSettings',
    index: 3,
    messageType: BLOCK_SETTINGS,
  }],
};
