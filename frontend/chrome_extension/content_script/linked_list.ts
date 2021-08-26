class LinkedNode<T> {
  public prev: LinkedNode<T>;
  public next: LinkedNode<T>;

  public constructor(public value?: T) {}
}

export class LinkedListIterator<T> {
  public constructor(
    private start: LinkedNode<T>,
    private end: LinkedNode<T>,
    private node: LinkedNode<T>,
    private reduceSizeByOne: () => void
  ) {}

  public getValue(): T {
    return this.node.value;
  }

  public isStart(): boolean {
    return this.start === this.node;
  }

  public isEnd(): boolean {
    return this.end === this.node;
  }

  public next(): void {
    this.node = this.node.next;
  }

  public prev(): void {
    this.node = this.node.prev;
  }

  public removeAndNext(): void {
    this.remove();
    this.node = this.node.next;
  }

  public removeAndPrev(): void {
    this.remove();
    this.node = this.node.prev;
  }

  private remove(): void {
    let next = this.node.next;
    let prev = this.node.prev;
    prev.next = next;
    next.prev = prev;
    this.reduceSizeByOne();
  }
}

export class LinkedList<T> {
  private start = new LinkedNode<T>();
  private end = new LinkedNode<T>();
  private size = 0;

  public constructor() {
    this.clear();
  }

  public pushBack(value: T): void {
    let node = new LinkedNode(value);
    let prev = this.end.prev;
    prev.next = node;
    this.end.prev = node;
    node.prev = prev;
    node.next = this.end;
    this.size++;
  }

  public popFront(): T {
    let node = this.start.next;
    this.start.next = this.start.next.next;
    this.start.next.prev = this.start;
    this.reduceSizeByOne();
    return node.value;
  }

  public popBack(): T {
    let node = this.end.prev;
    this.end.prev = this.end.prev.prev;
    this.end.prev.next = this.end;
    this.reduceSizeByOne();
    return node.value;
  }

  public clear(): void {
    this.start.next = this.end;
    this.end.prev = this.start;
    this.size = 0;
  }

  public getSize(): number {
    return this.size;
  }

  public createLeftIterator(): LinkedListIterator<T> {
    return new LinkedListIterator(this.start, this.end, this.start.next, () =>
      this.reduceSizeByOne()
    );
  }

  public createRightIterator(): LinkedListIterator<T> {
    return new LinkedListIterator(this.start, this.end, this.end.prev, () =>
      this.reduceSizeByOne()
    );
  }

  private reduceSizeByOne(): void {
    this.size--;
  }

  public forEach(callback: (arg: T) => void): void {
    for (let iter = this.createLeftIterator(); !iter.isEnd(); iter.next()) {
      callback(iter.getValue());
    }
  }

  public toArray(): T[] {
    let ret: T[] = [];
    this.forEach((element): void => {
      ret.push(element);
    });
    return ret;
  }

  public sort(shouldKeep?: (l: T, r: T) => boolean): void {
    for (let subLength = 1; subLength < this.size; subLength *= 2) {
      let pointer = this.start.next;
      while (pointer !== this.end) {
        let lStart = pointer;
        for (let i = 0; i < subLength && pointer !== this.end; i++) {
          pointer = pointer.next;
        }

        let rStart = pointer;
        for (let i = 0; i < subLength && pointer !== this.end; i++) {
          pointer = pointer.next;
        }

        this.merge(lStart, rStart, subLength, shouldKeep);
      }
    }
  }

  private merge(
    lStart: LinkedNode<T>,
    rStart: LinkedNode<T>,
    length: number,
    shouldKeep?: (l: T, r: T) => boolean
  ): void {
    for (
      let lCount = 0, rCount = 0;
      lCount < length && rCount < length && rStart !== this.end;

    ) {
      let lValue = lStart.value;
      let rValue = rStart.value;
      if (
        (shouldKeep && shouldKeep(lValue, rValue)) ||
        (!shouldKeep && lValue <= rValue)
      ) {
        lStart = lStart.next;
        lCount++;
      } else {
        let node = rStart;
        rStart = rStart.next;
        rCount++;

        let rPrev = node.prev;
        rPrev.next = rStart;
        rStart.prev = rPrev;

        let lPrev = lStart.prev;
        lPrev.next = node;
        lStart.prev = node;
        node.next = lStart;
        node.prev = lPrev;
      }
    }
  }
}
