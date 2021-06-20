import { MessageDescriptor, PrimitiveType } from '@selfage/message/descriptor';

export interface HomeState {
  show?: boolean,
}

export let HOME_STATE: MessageDescriptor<HomeState> = {
  name: 'HomeState',
  factoryFn: () => {
    return new Object();
  },
  fields: [
    {
      name: 'show',
      primitiveType: PrimitiveType.BOOLEAN,
    },
  ]
};

export interface ChatHistoryState {
  show?: boolean,
}

export let CHAT_HISTORY_STATE: MessageDescriptor<ChatHistoryState> = {
  name: 'ChatHistoryState',
  factoryFn: () => {
    return new Object();
  },
  fields: [
    {
      name: 'show',
      primitiveType: PrimitiveType.BOOLEAN,
    },
  ]
};

export interface AccountInfoState {
  show?: boolean,
}

export let ACCOUNT_INFO_STATE: MessageDescriptor<AccountInfoState> = {
  name: 'AccountInfoState',
  factoryFn: () => {
    return new Object();
  },
  fields: [
    {
      name: 'show',
      primitiveType: PrimitiveType.BOOLEAN,
    },
  ]
};

export interface ReportUserIssueState {
  show?: boolean,
}

export let REPORT_USER_ISSUE_STATE: MessageDescriptor<ReportUserIssueState> = {
  name: 'ReportUserIssueState',
  factoryFn: () => {
    return new Object();
  },
  fields: [
    {
      name: 'show',
      primitiveType: PrimitiveType.BOOLEAN,
    },
  ]
};

export interface PrivacyPolicyState {
  show?: boolean,
}

export let PRIVACY_POLICY_STATE: MessageDescriptor<PrivacyPolicyState> = {
  name: 'PrivacyPolicyState',
  factoryFn: () => {
    return new Object();
  },
  fields: [
    {
      name: 'show',
      primitiveType: PrimitiveType.BOOLEAN,
    },
  ]
};

export interface TermsAndConditionsState {
  show?: boolean,
}

export let TERMS_AND_CONDITIONS_STATE: MessageDescriptor<TermsAndConditionsState> = {
  name: 'TermsAndConditionsState',
  factoryFn: () => {
    return new Object();
  },
  fields: [
    {
      name: 'show',
      primitiveType: PrimitiveType.BOOLEAN,
    },
  ]
};

export interface State {
  homeState?: HomeState,
  chatHistoryState?: ChatHistoryState,
  accountInfoState?: AccountInfoState,
  reportUserIssueState?: ReportUserIssueState,
  privacyPolicyState?: PrivacyPolicyState,
  termsAndConditionsState?: TermsAndConditionsState,
}

export let STATE: MessageDescriptor<State> = {
  name: 'State',
  factoryFn: () => {
    return new Object();
  },
  fields: [
    {
      name: 'homeState',
      messageDescriptor: HOME_STATE,
    },
    {
      name: 'chatHistoryState',
      messageDescriptor: CHAT_HISTORY_STATE,
    },
    {
      name: 'accountInfoState',
      messageDescriptor: ACCOUNT_INFO_STATE,
    },
    {
      name: 'reportUserIssueState',
      messageDescriptor: REPORT_USER_ISSUE_STATE,
    },
    {
      name: 'privacyPolicyState',
      messageDescriptor: PRIVACY_POLICY_STATE,
    },
    {
      name: 'termsAndConditionsState',
      messageDescriptor: TERMS_AND_CONDITIONS_STATE,
    },
  ]
};
