import { LinkedList } from "./linked_list";
import { eqLinkedList } from "./linked_list_matcher";
import { MatchFn, assertThat, eq } from "@selfage/test_matcher";
import { NODE_TEST_RUNNER } from "@selfage/test_runner";

function eqLinkedListBilateral<T>(
  expected: Array<MatchFn<T>>
): MatchFn<LinkedList<T>> {
  return (actual) => {
    assertThat(actual, eqLinkedList(expected), "from left");
    let iter = actual.createRightIterator();
    for (let i = expected.length - 1; i >= 0; i--, iter.prev()) {
      assertThat(
        iter.isStart(),
        eq(false),
        `from right, isStart at ${i}th position`
      );
      assertThat(iter.getValue(), expected[i], `from right, ${i}th element`);
    }
    assertThat(iter.isStart(), eq(true), `from right, isStart after loop`);
  };
}

NODE_TEST_RUNNER.run({
  name: "LinkedListTest",
  cases: [
    {
      name: "PushAndClear",
      execute: () => {
        // Execute
        let linkedList = new LinkedList<number>();

        // Verify
        assertThat(linkedList, eqLinkedListBilateral([]), "empty");

        // Execute
        linkedList.pushBack(12311);

        // Verify
        assertThat(
          linkedList,
          eqLinkedListBilateral([eq(12311)]),
          "one element"
        );

        // Execute
        linkedList.pushBack(4332);

        // Verify
        assertThat(
          linkedList,
          eqLinkedListBilateral([eq(12311), eq(4332)]),
          "two elements"
        );

        // Execute
        linkedList.clear();

        // Verify
        assertThat(linkedList, eqLinkedListBilateral([]), "cleared");
      },
    },
    {
      name: "RemoveFromLeft",
      execute: () => {
        // Prepare
        let linkedList = new LinkedList<number>();
        linkedList.pushBack(132);
        linkedList.pushBack(31);
        let iter = linkedList.createLeftIterator();

        // Execute
        iter.removeAndNext();

        // Verify
        assertThat(linkedList, eqLinkedListBilateral([eq(31)]), "removed one");

        // Execute
        iter.removeAndNext();

        // Verify
        assertThat(linkedList, eqLinkedListBilateral([]), "removed two");
      },
    },
    {
      name: "RemoveFromRight",
      execute: () => {
        // Prepare
        let linkedList = new LinkedList<number>();
        linkedList.pushBack(132);
        linkedList.pushBack(31);
        let iter = linkedList.createRightIterator();

        // Execute
        iter.removeAndPrev();

        // Verify
        assertThat(linkedList, eqLinkedListBilateral([eq(132)]), "removed one");

        // Execute
        iter.removeAndPrev();

        // Verify
        assertThat(linkedList, eqLinkedListBilateral([]), "removed two");
      },
    },
    {
      name: "PopFront",
      execute: () => {
        // Prepare
        let linkedList = new LinkedList<number>();
        linkedList.pushBack(132);
        linkedList.pushBack(31);

        // Execute
        let value = linkedList.popFront();

        // Verify
        assertThat(value, eq(132), "first value");
        assertThat(linkedList, eqLinkedListBilateral([eq(31)]), "popped one");

        // Execute
        value = linkedList.popFront();

        // Verify
        assertThat(value, eq(31), "second value");
        assertThat(linkedList, eqLinkedListBilateral([]), "popped two");
      },
    },
    {
      name: "PopBack",
      execute: () => {
        // Prepare
        let linkedList = new LinkedList<number>();
        linkedList.pushBack(132);
        linkedList.pushBack(31);

        // Execute
        let value = linkedList.popBack();

        // Verify
        assertThat(value, eq(31), "first value");
        assertThat(linkedList, eqLinkedListBilateral([eq(132)]), "popped one");

        // Execute
        value = linkedList.popBack();

        // Verify
        assertThat(value, eq(132), "second value");
        assertThat(linkedList, eqLinkedListBilateral([]), "popped two");
      },
    },
    {
      name: "SortOneNumber",
      execute: () => {
        // Prepare
        let linkedList = new LinkedList<number>();
        linkedList.pushBack(1312);

        // Execute
        linkedList.sort();

        // Verify
        assertThat(linkedList, eqLinkedListBilateral([eq(1312)]), "linkedList");
      },
    },
    {
      name: "SortTwoNumbers",
      execute: () => {
        // Prepare
        let linkedList = new LinkedList<number>();
        linkedList.pushBack(1312);
        linkedList.pushBack(132);

        // Execute
        linkedList.sort();

        // Verify
        assertThat(
          linkedList,
          eqLinkedListBilateral([eq(132), eq(1312)]),
          "linkedList"
        );
      },
    },
    {
      name: "SortThreeNumbers",
      execute: () => {
        // Prepare
        let linkedList = new LinkedList<number>();
        linkedList.pushBack(5);
        linkedList.pushBack(3);
        linkedList.pushBack(4);

        // Execute
        linkedList.sort();

        // Verify
        assertThat(
          linkedList,
          eqLinkedListBilateral([eq(3), eq(4), eq(5)]),
          "linkedList"
        );
      },
    },
    {
      name: "SortFourNumbers",
      execute: () => {
        // Prepare
        let linkedList = new LinkedList<number>();
        linkedList.pushBack(5);
        linkedList.pushBack(3);
        linkedList.pushBack(4);
        linkedList.pushBack(9);

        // Execute
        linkedList.sort();

        // Verify
        assertThat(
          linkedList,
          eqLinkedListBilateral([eq(3), eq(4), eq(5), eq(9)]),
          "linkedList"
        );
      },
    },
    {
      name: "SortFiveNumbers",
      execute: () => {
        // Prepare
        let linkedList = new LinkedList<number>();
        linkedList.pushBack(5);
        linkedList.pushBack(3);
        linkedList.pushBack(4);
        linkedList.pushBack(9);
        linkedList.pushBack(1);

        // Execute
        linkedList.sort();

        // Verify
        assertThat(
          linkedList,
          eqLinkedListBilateral([eq(1), eq(3), eq(4), eq(5), eq(9)]),
          "linkedList"
        );
      },
    },
    {
      name: "SortSixNumbers",
      execute: () => {
        // Prepare
        let linkedList = new LinkedList<number>();
        linkedList.pushBack(5);
        linkedList.pushBack(3);
        linkedList.pushBack(4);
        linkedList.pushBack(9);
        linkedList.pushBack(1);
        linkedList.pushBack(7);

        // Execute
        linkedList.sort();

        // Verify
        assertThat(
          linkedList,
          eqLinkedListBilateral([eq(1), eq(3), eq(4), eq(5), eq(7), eq(9)]),
          "linkedList"
        );
      },
    },
    {
      name: "SortSevenNumbers",
      execute: () => {
        // Prepare
        let linkedList = new LinkedList<number>();
        linkedList.pushBack(5);
        linkedList.pushBack(3);
        linkedList.pushBack(4);
        linkedList.pushBack(9);
        linkedList.pushBack(1);
        linkedList.pushBack(7);
        linkedList.pushBack(2);

        // Execute
        linkedList.sort();

        // Verify
        assertThat(
          linkedList,
          eqLinkedListBilateral([
            eq(1),
            eq(2),
            eq(3),
            eq(4),
            eq(5),
            eq(7),
            eq(9),
          ]),
          "linkedList"
        );
      },
    },
    {
      name: "SortObjects",
      execute: () => {
        // Prepare
        let value = { num: 5 };
        let value2 = { num: 3 };
        let value3 = { num: 4 };
        let value4 = { num: 9 };
        let linkedList = new LinkedList<{ num: number }>();
        linkedList.pushBack(value);
        linkedList.pushBack(value2);
        linkedList.pushBack(value3);
        linkedList.pushBack(value4);

        // Execute
        linkedList.sort((l, r) => {
          return l.num <= r.num;
        });

        // Verify
        assertThat(
          linkedList,
          eqLinkedListBilateral([
            eq(value2),
            eq(value3),
            eq(value),
            eq(value4),
          ]),
          "linkedList"
        );
      },
    },
    {
      name: "SortObjectsStable",
      execute: () => {
        // Prepare
        let value = { num: 5 };
        let value2 = { num: 3 };
        let value3 = { num: 3 };
        let value4 = { num: 9 };
        let linkedList = new LinkedList<{ num: number }>();
        linkedList.pushBack(value);
        linkedList.pushBack(value2);
        linkedList.pushBack(value3);
        linkedList.pushBack(value4);

        // Execute
        linkedList.sort((l, r) => {
          return l.num <= r.num;
        });

        // Verify
        assertThat(
          linkedList,
          eqLinkedListBilateral([
            eq(value2),
            eq(value3),
            eq(value),
            eq(value4),
          ]),
          "linkedList"
        );
      },
    },
  ],
});
