import { EnumDescriptor, MessageDescriptor } from '@selfage/message/descriptor';
import { EventEmitter } from 'events';

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
  on(event: 'page', listener: (newValue: Page, oldValue: Page) => void): this;
  on(event: 'init', listener: () => void): this;
}

export class BodyState extends EventEmitter {
  private page_?: Page;
  get page(): Page {
    return this.page_;
  }
  set page(value: Page) {
    let oldValue = this.page_;
    if (value === oldValue) {
      return;
    }
    this.page_ = value;
    this.emit('page', this.page_, oldValue);
  }

  public triggerInitialEvents(): void {
    if (this.page_ !== undefined) {
      this.emit('page', this.page_, undefined);
    }
    this.emit('init');
  }

  public toJSON(): Object {
    return {
      page: this.page,
    };
  }
}

export let BODY_STATE: MessageDescriptor<BodyState> = {
  name: 'BodyState',
  factoryFn: () => {
    return new BodyState();
  },
  fields: [
    {
      name: 'page',
      enumDescriptor: PAGE,
    },
  ]
};
