import { LinkedList } from "./linked_list";
import { TEST_RUNNER } from "@selfage/puppeteer_test_runner";
import { assertThat, eq, isArray } from "@selfage/test_matcher";

TEST_RUNNER.run({
  name: "LinkedListTest",
  cases: [
    {
      name: "PushBackAndClear",
      execute: () => {
        // Execute
        let linkedList = new LinkedList<number>();

        // Verify
        assertThat(linkedList.toArray(), isArray([]), "empty");

        // Execute
        let node = linkedList.pushBack(12311);

        // Verify
        assertThat(linkedList.toArray(), isArray([eq(12311)]), "one element");
        assertThat(node.value, eq(12311), "1st node value");

        // Execute
        let node2 = linkedList.pushBack(4332);

        // Verify
        assertThat(
          linkedList.toArray(),
          isArray([eq(12311), eq(4332)]),
          "two elements",
        );
        assertThat(node2.value, eq(4332), "2nd node value");
      },
    },
    {
      name: "ForEachLoop",
      execute: () => {
        // Prepare
        let linkedList = new LinkedList<number>();
        linkedList.pushBack(132);
        linkedList.pushBack(31);
        linkedList.pushBack(22);

        // Execute
        let res = new Array<number>();
        linkedList.forEach((value) => {
          res.push(value);
        });

        // Verify
        assertThat(res, isArray([eq(132), eq(31), eq(22)]), "forEach");
      },
    },
    {
      name: "ForEachReverseLoop",
      execute: () => {
        // Prepare
        let linkedList = new LinkedList<number>();
        linkedList.pushBack(132);
        linkedList.pushBack(31);
        linkedList.pushBack(22);

        // Execute
        let res = new Array<number>();
        linkedList.forEachReverse((value) => {
          res.push(value);
        });

        // Verify
        assertThat(res, isArray([eq(22), eq(31), eq(132)]), "forEachReverse");
      },
    },
    {
      name: "ForEachNodeLoop",
      execute: () => {
        // Prepare
        let linkedList = new LinkedList<number>();
        linkedList.pushBack(132);
        linkedList.pushBack(31);
        linkedList.pushBack(22);

        // Execute
        let res = new Array<number>();
        linkedList.forEachNode((node) => {
          res.push(node.value);
        });

        // Verify
        assertThat(res, isArray([eq(132), eq(31), eq(22)]), "forEachNode");
      },
    },
    {
      name: "ForEachNodeReverseLoop",
      execute: () => {
        // Prepare
        let linkedList = new LinkedList<number>();
        linkedList.pushBack(132);
        linkedList.pushBack(31);
        linkedList.pushBack(22);

        // Execute
        let res = new Array<number>();
        linkedList.forEachNodeReverse((node) => {
          res.push(node.value);
        });

        // Verify
        assertThat(
          res,
          isArray([eq(22), eq(31), eq(132)]),
          "forEachNodeReverse",
        );
      },
    },
    {
      name: "PopFront",
      execute: () => {
        // Prepare
        let linkedList = new LinkedList<number>();
        linkedList.pushBack(132);
        linkedList.pushBack(31);
        linkedList.pushBack(22);

        // Execute
        let value = linkedList.popFront();

        // Verify
        assertThat(value, eq(132), "popFront");
      },
    },
    {
      name: "NodeRemove",
      execute: () => {
        // Prepare
        let linkedList = new LinkedList<number>();
        linkedList.pushBack(132);
        let node = linkedList.pushBack(31);
        linkedList.pushBack(22);

        // Execute
        node.remove();

        // Verify
        assertThat(linkedList.toArray(), isArray([eq(132), eq(22)]), "removed");
      },
    },
    {
      name: "Clear",
      execute: () => {
        // Prepare
        let linkedList = new LinkedList<number>();
        linkedList.pushBack(132);
        linkedList.pushBack(31);
        linkedList.pushBack(22);

        // Execute
        linkedList.clear();

        // Verify
        assertThat(linkedList.toArray(), isArray([]), "cleared");
      },
    },
  ],
});
