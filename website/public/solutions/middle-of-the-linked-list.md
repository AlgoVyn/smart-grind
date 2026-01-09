# Middle of the Linked List

## Problem Description

Given the head of a singly linked list, return the **middle node** of the linked list.

If there are **two middle nodes**, return the **second middle node**.

---

## Examples

**Example 1:**

| Input | Output |
|-------|--------|
| `head = [1,2,3,4,5]` | `[3,4,5]` |

**Explanation:** The middle node is node 3 (value 3).

**Example 2:**

| Input | Output |
|-------|--------|
| `head = [1,2,3,4,5,6]` | `[4,5,6]` |

**Explanation:** Since the list has two middle nodes (values 3 and 4), we return the second one (value 4).

---

## Constraints

- The number of nodes in the list is in the range `[1, 100]`
- `1 <= Node.val <= 100`

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
    def middleNode(self, head: Optional[ListNode]) -> Optional[ListNode]:
        """
        Find the middle of a linked list using the slow and fast pointer technique.
        """
        slow = fast = head
        
        # Move slow by 1 and fast by 2
        # When fast reaches the end, slow is at the middle
        while fast and fast.next:
            slow = slow.next
            fast = fast.next.next
        
        return slow
```

---

## Explanation

We use the **slow and fast pointer** (tortoise and hare) technique:

1. Initialize both `slow` and `fast` at the head.
2. Move `slow` one step at a time and `fast` two steps at a time.
3. When `fast` reaches the end of the list, `slow` will be at the middle.
4. Return `slow`.

This works because:
- In a list with odd length: `fast` reaches the last node, `slow` is at the center.
- In a list with even length: `fast` becomes `None`, `slow` is at the second middle node.

---

## Complexity Analysis

| Metric | Complexity |
|--------|------------|
| Time | `O(n)` — single pass through the list |
| Space | `O(1)` — constant extra space |
