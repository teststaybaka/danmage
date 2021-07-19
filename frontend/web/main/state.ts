import { EventEmitter } from 'events';
import { MessageDescriptor, PrimitiveType } from '@selfage/message/descriptor';

export interface State {
  on(event: 'showHome', listener: (newValue: boolean, oldValue: boolean) => void): this;
  on(event: 'showNickname', listener: (newValue: boolean, oldValue: boolean) => void): this;
  on(event: 'showHistory', listener: (newValue: boolean, oldValue: boolean) => void): this;
  on(event: 'showTerms', listener: (newValue: boolean, oldValue: boolean) => void): this;
  on(event: 'showPrivacy', listener: (newValue: boolean, oldValue: boolean) => void): this;
  on(event: 'showFeedback', listener: (newValue: boolean, oldValue: boolean) => void): this;
  on(event: string, listener: Function): this;
}

export class State extends EventEmitter {
  private showHome_?: boolean;
  get showHome(): boolean {
    return this.showHome_;
  }
  set showHome(value: boolean) {
    let oldValue = this.showHome_;
    if (value === oldValue) {
      return;
    }
    this.showHome_ = value;
    this.emit('showHome', this.showHome_, oldValue);
  }

  private showNickname_?: boolean;
  get showNickname(): boolean {
    return this.showNickname_;
  }
  set showNickname(value: boolean) {
    let oldValue = this.showNickname_;
    if (value === oldValue) {
      return;
    }
    this.showNickname_ = value;
    this.emit('showNickname', this.showNickname_, oldValue);
  }

  private showHistory_?: boolean;
  get showHistory(): boolean {
    return this.showHistory_;
  }
  set showHistory(value: boolean) {
    let oldValue = this.showHistory_;
    if (value === oldValue) {
      return;
    }
    this.showHistory_ = value;
    this.emit('showHistory', this.showHistory_, oldValue);
  }

  private showTerms_?: boolean;
  get showTerms(): boolean {
    return this.showTerms_;
  }
  set showTerms(value: boolean) {
    let oldValue = this.showTerms_;
    if (value === oldValue) {
      return;
    }
    this.showTerms_ = value;
    this.emit('showTerms', this.showTerms_, oldValue);
  }

  private showPrivacy_?: boolean;
  get showPrivacy(): boolean {
    return this.showPrivacy_;
  }
  set showPrivacy(value: boolean) {
    let oldValue = this.showPrivacy_;
    if (value === oldValue) {
      return;
    }
    this.showPrivacy_ = value;
    this.emit('showPrivacy', this.showPrivacy_, oldValue);
  }

  private showFeedback_?: boolean;
  get showFeedback(): boolean {
    return this.showFeedback_;
  }
  set showFeedback(value: boolean) {
    let oldValue = this.showFeedback_;
    if (value === oldValue) {
      return;
    }
    this.showFeedback_ = value;
    this.emit('showFeedback', this.showFeedback_, oldValue);
  }

  public triggerInitialEvents(): void {
    if (this.showHome_ !== undefined) {
      this.emit('showHome', this.showHome_, undefined);
    }
    if (this.showNickname_ !== undefined) {
      this.emit('showNickname', this.showNickname_, undefined);
    }
    if (this.showHistory_ !== undefined) {
      this.emit('showHistory', this.showHistory_, undefined);
    }
    if (this.showTerms_ !== undefined) {
      this.emit('showTerms', this.showTerms_, undefined);
    }
    if (this.showPrivacy_ !== undefined) {
      this.emit('showPrivacy', this.showPrivacy_, undefined);
    }
    if (this.showFeedback_ !== undefined) {
      this.emit('showFeedback', this.showFeedback_, undefined);
    }
  }

  public toJSON(): Object {
    return {
      showHome: this.showHome,
      showNickname: this.showNickname,
      showHistory: this.showHistory,
      showTerms: this.showTerms,
      showPrivacy: this.showPrivacy,
      showFeedback: this.showFeedback,
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
      name: 'showHome',
      primitiveType: PrimitiveType.BOOLEAN,
    },
    {
      name: 'showNickname',
      primitiveType: PrimitiveType.BOOLEAN,
    },
    {
      name: 'showHistory',
      primitiveType: PrimitiveType.BOOLEAN,
    },
    {
      name: 'showTerms',
      primitiveType: PrimitiveType.BOOLEAN,
    },
    {
      name: 'showPrivacy',
      primitiveType: PrimitiveType.BOOLEAN,
    },
    {
      name: 'showFeedback',
      primitiveType: PrimitiveType.BOOLEAN,
    },
  ]
};
