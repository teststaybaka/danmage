import { MessageDescriptor, PrimitiveType } from '@selfage/message/descriptor';

export class HomeState {
  public onShowChange: (newValue: boolean, oldValue: boolean) => void;
  private show_?: boolean;
  get show(): boolean {
    return this.show_;
  }
  set show(value: boolean) {
    let oldValue = this.show_;
    if (value === oldValue) {
      return;
    }
    this.show_ = value;
    if (this.onShowChange) {
      this.onShowChange(this.show_, oldValue);
    }
  }

  public toJSON(): Object {
    return {
      show: this.show,
    };
  }
}

export let HOME_STATE: MessageDescriptor<HomeState> = {
  name: 'HomeState',
  factoryFn: () => {
    return new HomeState();
  },
  fields: [
    {
      name: 'show',
      primitiveType: PrimitiveType.BOOLEAN,
    },
  ]
};

export class ChatHistoryState {
  public onShowChange: (newValue: boolean, oldValue: boolean) => void;
  private show_?: boolean;
  get show(): boolean {
    return this.show_;
  }
  set show(value: boolean) {
    let oldValue = this.show_;
    if (value === oldValue) {
      return;
    }
    this.show_ = value;
    if (this.onShowChange) {
      this.onShowChange(this.show_, oldValue);
    }
  }

  public toJSON(): Object {
    return {
      show: this.show,
    };
  }
}

export let CHAT_HISTORY_STATE: MessageDescriptor<ChatHistoryState> = {
  name: 'ChatHistoryState',
  factoryFn: () => {
    return new ChatHistoryState();
  },
  fields: [
    {
      name: 'show',
      primitiveType: PrimitiveType.BOOLEAN,
    },
  ]
};

export class AccountInfoState {
  public onShowChange: (newValue: boolean, oldValue: boolean) => void;
  private show_?: boolean;
  get show(): boolean {
    return this.show_;
  }
  set show(value: boolean) {
    let oldValue = this.show_;
    if (value === oldValue) {
      return;
    }
    this.show_ = value;
    if (this.onShowChange) {
      this.onShowChange(this.show_, oldValue);
    }
  }

  public toJSON(): Object {
    return {
      show: this.show,
    };
  }
}

export let ACCOUNT_INFO_STATE: MessageDescriptor<AccountInfoState> = {
  name: 'AccountInfoState',
  factoryFn: () => {
    return new AccountInfoState();
  },
  fields: [
    {
      name: 'show',
      primitiveType: PrimitiveType.BOOLEAN,
    },
  ]
};

export class ReportUserIssueState {
  public onShowChange: (newValue: boolean, oldValue: boolean) => void;
  private show_?: boolean;
  get show(): boolean {
    return this.show_;
  }
  set show(value: boolean) {
    let oldValue = this.show_;
    if (value === oldValue) {
      return;
    }
    this.show_ = value;
    if (this.onShowChange) {
      this.onShowChange(this.show_, oldValue);
    }
  }

  public toJSON(): Object {
    return {
      show: this.show,
    };
  }
}

export let REPORT_USER_ISSUE_STATE: MessageDescriptor<ReportUserIssueState> = {
  name: 'ReportUserIssueState',
  factoryFn: () => {
    return new ReportUserIssueState();
  },
  fields: [
    {
      name: 'show',
      primitiveType: PrimitiveType.BOOLEAN,
    },
  ]
};

export class PrivacyPolicyState {
  public onShowChange: (newValue: boolean, oldValue: boolean) => void;
  private show_?: boolean;
  get show(): boolean {
    return this.show_;
  }
  set show(value: boolean) {
    let oldValue = this.show_;
    if (value === oldValue) {
      return;
    }
    this.show_ = value;
    if (this.onShowChange) {
      this.onShowChange(this.show_, oldValue);
    }
  }

  public toJSON(): Object {
    return {
      show: this.show,
    };
  }
}

export let PRIVACY_POLICY_STATE: MessageDescriptor<PrivacyPolicyState> = {
  name: 'PrivacyPolicyState',
  factoryFn: () => {
    return new PrivacyPolicyState();
  },
  fields: [
    {
      name: 'show',
      primitiveType: PrimitiveType.BOOLEAN,
    },
  ]
};

export class TermsAndConditionsState {
  public onShowChange: (newValue: boolean, oldValue: boolean) => void;
  private show_?: boolean;
  get show(): boolean {
    return this.show_;
  }
  set show(value: boolean) {
    let oldValue = this.show_;
    if (value === oldValue) {
      return;
    }
    this.show_ = value;
    if (this.onShowChange) {
      this.onShowChange(this.show_, oldValue);
    }
  }

  public toJSON(): Object {
    return {
      show: this.show,
    };
  }
}

export let TERMS_AND_CONDITIONS_STATE: MessageDescriptor<TermsAndConditionsState> = {
  name: 'TermsAndConditionsState',
  factoryFn: () => {
    return new TermsAndConditionsState();
  },
  fields: [
    {
      name: 'show',
      primitiveType: PrimitiveType.BOOLEAN,
    },
  ]
};

export class State {
  public onHomeStateChange: (newValue: HomeState, oldValue: HomeState) => void;
  private homeState_?: HomeState;
  get homeState(): HomeState {
    return this.homeState_;
  }
  set homeState(value: HomeState) {
    let oldValue = this.homeState_;
    if (value === oldValue) {
      return;
    }
    this.homeState_ = value;
    if (this.onHomeStateChange) {
      this.onHomeStateChange(this.homeState_, oldValue);
    }
  }

  public onChatHistoryStateChange: (newValue: ChatHistoryState, oldValue: ChatHistoryState) => void;
  private chatHistoryState_?: ChatHistoryState;
  get chatHistoryState(): ChatHistoryState {
    return this.chatHistoryState_;
  }
  set chatHistoryState(value: ChatHistoryState) {
    let oldValue = this.chatHistoryState_;
    if (value === oldValue) {
      return;
    }
    this.chatHistoryState_ = value;
    if (this.onChatHistoryStateChange) {
      this.onChatHistoryStateChange(this.chatHistoryState_, oldValue);
    }
  }

  public onAccountInfoStateChange: (newValue: AccountInfoState, oldValue: AccountInfoState) => void;
  private accountInfoState_?: AccountInfoState;
  get accountInfoState(): AccountInfoState {
    return this.accountInfoState_;
  }
  set accountInfoState(value: AccountInfoState) {
    let oldValue = this.accountInfoState_;
    if (value === oldValue) {
      return;
    }
    this.accountInfoState_ = value;
    if (this.onAccountInfoStateChange) {
      this.onAccountInfoStateChange(this.accountInfoState_, oldValue);
    }
  }

  public onReportUserIssueStateChange: (newValue: ReportUserIssueState, oldValue: ReportUserIssueState) => void;
  private reportUserIssueState_?: ReportUserIssueState;
  get reportUserIssueState(): ReportUserIssueState {
    return this.reportUserIssueState_;
  }
  set reportUserIssueState(value: ReportUserIssueState) {
    let oldValue = this.reportUserIssueState_;
    if (value === oldValue) {
      return;
    }
    this.reportUserIssueState_ = value;
    if (this.onReportUserIssueStateChange) {
      this.onReportUserIssueStateChange(this.reportUserIssueState_, oldValue);
    }
  }

  public onPrivacyPolicyStateChange: (newValue: PrivacyPolicyState, oldValue: PrivacyPolicyState) => void;
  private privacyPolicyState_?: PrivacyPolicyState;
  get privacyPolicyState(): PrivacyPolicyState {
    return this.privacyPolicyState_;
  }
  set privacyPolicyState(value: PrivacyPolicyState) {
    let oldValue = this.privacyPolicyState_;
    if (value === oldValue) {
      return;
    }
    this.privacyPolicyState_ = value;
    if (this.onPrivacyPolicyStateChange) {
      this.onPrivacyPolicyStateChange(this.privacyPolicyState_, oldValue);
    }
  }

  public onTermsAndConditionsStateChange: (newValue: TermsAndConditionsState, oldValue: TermsAndConditionsState) => void;
  private termsAndConditionsState_?: TermsAndConditionsState;
  get termsAndConditionsState(): TermsAndConditionsState {
    return this.termsAndConditionsState_;
  }
  set termsAndConditionsState(value: TermsAndConditionsState) {
    let oldValue = this.termsAndConditionsState_;
    if (value === oldValue) {
      return;
    }
    this.termsAndConditionsState_ = value;
    if (this.onTermsAndConditionsStateChange) {
      this.onTermsAndConditionsStateChange(this.termsAndConditionsState_, oldValue);
    }
  }

  public toJSON(): Object {
    return {
      homeState: this.homeState,
      chatHistoryState: this.chatHistoryState,
      accountInfoState: this.accountInfoState,
      reportUserIssueState: this.reportUserIssueState,
      privacyPolicyState: this.privacyPolicyState,
      termsAndConditionsState: this.termsAndConditionsState,
    };
  }
}

export let STATE: MessageDescriptor<State> = {
  name: 'State',
  factoryFn: () => {
    return new State();
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
