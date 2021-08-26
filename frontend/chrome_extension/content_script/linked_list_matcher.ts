import { LinkedList } from "./linked_list";
import { MatchFn, assertThat, eq } from "@selfage/test_matcher";

export function eqLinkedList<T>(
  expected: Array<MatchFn<T>>
): MatchFn<LinkedList<T>> {
  return (actual) => {
    assertThat(actual.getSize(), eq(expected.length), "size");
    let iter = actual.createLeftIterator();
    for (let i = 0; i < expected.length; i++, iter.next()) {
      assertThat(iter.isEnd(), eq(false), `isEnd at ${i}th position`);
      assertThat(iter.getValue(), expected[i], `${i}th element`);
    }
    assertThat(iter.isEnd(), eq(true), `isEnd after loop`);
  };
}
