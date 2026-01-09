# Reverse Linked List

## Problem Description

Given the head of a **singly linked list**, reverse the list, and return the reversed list.

### Examples

**Example 1:**
```python
Input: head = [1,2,3,4,5]
Output: [5,4,3,2,1]
```

**Example 2:**
```python
Input: head = [1,2]
Output: [2,1]
```

**Example 3:**
```python
Input: head = []
Output: []
```

### Constraints

- The number of nodes in the list is in the range `[0, 5000]`
- `-5000 <= Node.val <= 5000`

## Solution

```python
from typing import Optional

# Definition for singly-linked list.
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class Solution:
    def reverseList(self, head: Optional[ListNode]) -> Optional[ListNode]:
        prev = None
        curr = head
        while curr:
            next_temp = curr.next
            curr.next = prev
            prev = curr
            curr = next_temp
        return prev
```

## Explanation

We use an **iterative approach** to reverse the linked list:

1. Initialize `prev` to `None`, and `curr` to `head`
2. While `curr` is not `None`:
   - Save the next node (`next_temp`)
   - Set `curr.next` to `prev`
   - Move `prev` to `curr`
   - Move `curr` to `next_temp`
3. At the end, `prev` is the new head

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time**   | `O(n)` — where `n` is the number of nodes |
| **Space**  | `O(1)` — using constant space |
