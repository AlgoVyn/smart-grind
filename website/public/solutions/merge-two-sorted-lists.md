# Merge Two Sorted Lists

## Problem Description

You are given the heads of two sorted linked lists `list1` and `list2`. Merge the two lists into one sorted list by **splicing together the nodes** of the first two lists. Return the head of the merged linked list.

---

## Examples

**Example 1:**

| Input | Output |
|-------|--------|
| `list1 = [1,2,4], list2 = [1,3,4]` | `[1,1,2,3,4,4]` |

**Example 2:**

| Input | Output |
|-------|--------|
| `list1 = [], list2 = []` | `[]` |

**Example 3:**

| Input | Output |
|-------|--------|
| `list1 = [], list2 = [0]` | `[0]` |

---

## Constraints

- The number of nodes in both lists is in the range `[0, 50]`
- `-100 <= Node.val <= 100`
- Both `list1` and `list2` are sorted in non-decreasing order

---

## Solution

```python
from typing import Optional

# Definition for singly-linked list.
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class Solution:
    def mergeTwoLists(self, list1: Optional[ListNode], list2: Optional[ListNode]) -> Optional[ListNode]:
        """
        Merge two sorted linked lists using a dummy node.
        """
        dummy = ListNode()
        current = dummy
        
        # Compare and merge nodes
        while list1 and list2:
            if list1.val < list2.val:
                current.next = list1
                list1 = list1.next
            else:
                current.next = list2
                list2 = list2.next
            current = current.next
        
        # Attach remaining nodes (one list is exhausted)
        current.next = list1 if list1 else list2
        
        return dummy.next
```

---

## Explanation

1. **Create a dummy node** to serve as the start of the merged list.
2. **Use a pointer (`current`)** to track the end of the merged list.
3. **Iterate while both lists have nodes**:
   - Compare the values of the current nodes.
   - Append the node with the smaller value to the merged list.
   - Advance the pointer of the list from which the node was taken.
4. **Attach any remaining nodes** from `list1` or `list2`.
5. Return `dummy.next`, the head of the merged sorted list.

---

## Complexity Analysis

| Metric | Complexity |
|--------|------------|
| Time | `O(m + n)` — where `m` and `n` are the lengths of `list1` and `list2` |
| Space | `O(1)` — constant extra space (reuses existing nodes) |
