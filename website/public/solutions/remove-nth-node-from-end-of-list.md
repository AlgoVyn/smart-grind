# Remove Nth Node From End Of List

## Problem Statement
Given the head of a linked list, remove the nth node from the end of the list and return its head.

---

## Examples

**Example 1:**

**Input:**
```
head = [1,2,3,4,5], n = 2
```

**Output:**
```
[1,2,3,5]
```

**Example 2:**

**Input:**
```
head = [1], n = 1
```

**Output:**
```
[]
```

**Example 3:**

**Input:**
```
head = [1,2], n = 1
```

**Output:**
```
[1]
```

---

## Constraints

- The number of nodes in the list is `sz`
- `1 <= sz <= 30`
- `0 <= Node.val <= 100`
- `1 <= n <= sz`

**Follow-up:** Could you do this in one pass?

## Solution

```python
class Solution:
    def removeNthFromEnd(self, head: Optional[ListNode], n: int) -> Optional[ListNode]:
        dummy = ListNode(0, head)
        first = second = dummy
        for _ in range(n + 1):
            first = first.next
        while first:
            first = first.next
            second = second.next
        second.next = second.next.next
        return dummy.next
```

## Explanation
We use two pointers with a dummy node to solve this problem in one pass:

1. Create a dummy node pointing to the head to handle edge cases (like removing the head).
2. Initialize both `first` and `second` pointers at the dummy node.
3. Move `first` pointer `n + 1` steps ahead to maintain a gap of `n` nodes between `first` and `second`.
4. Move both pointers forward until `first` reaches the end.
5. At this point, `second` will be pointing to the node before the one to remove.
6. Update `second.next` to skip the nth node from the end.
7. Return `dummy.next` as the new head.

This approach runs in O(n) time with O(1) extra space.
