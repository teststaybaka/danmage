export class LinkedNode<T> {
  public prev: LinkedNode<T>;
  public next: LinkedNode<T>;

  public constructor(public reduceSize: () => void, public value?: T) {}

  public remove(): void {
    let next = this.next;
    let prev = this.prev;
    prev.next = next;
    next.prev = prev;
    this.reduceSize();
  }
}

export class LinkedList<T> {
  private reduceSize = (): void => {
    this.size--;
  };
  private start = new LinkedNode<T>(this.reduceSize);
  private end = new LinkedNode<T>(this.reduceSize);
  private size = 0;

  public constructor() {
    this.clear();
  }

  public pushBack(value: T): LinkedNode<T> {
    let node = new LinkedNode(this.reduceSize, value);
    let prev = this.end.prev;
    prev.next = node;
    this.end.prev = node;
    node.prev = prev;
    node.next = this.end;
    this.size++;
    return node;
  }

  public popFront(): T {
    let ret = this.start.next;
    ret.remove();
    return ret.value;
  }

  public clear(): void {
    this.start.next = this.end;
    this.end.prev = this.start;
    this.size = 0;
  }

  public getSize(): number {
    return this.size;
  }

  public forEach(callback: (arg: T) => void): void {
    for (let it = this.start.next; it !== this.end; it = it.next) {
      callback(it.value);
    }
  }

  public forEachReverse(callback: (arg: T) => void): void {
    for (let it = this.end.prev; it !== this.start; it = it.prev) {
      callback(it.value);
    }
  }

  public forEachNode(callback: (arg: LinkedNode<T>) => void): void {
    for (let it = this.start.next; it !== this.end; ) {
      let current = it;
      it = it.next;
      callback(current);
    }
  }

  public forEachNodeReverse(callback: (arg: LinkedNode<T>) => void): void {
    for (let it = this.end.prev; it !== this.start; ) {
      let current = it;
      it = it.prev;
      callback(current);
    }
  }

  public toArray(): T[] {
    let ret: T[] = [];
    this.forEach((element): void => {
      ret.push(element);
    });
    return ret;
  }
}
