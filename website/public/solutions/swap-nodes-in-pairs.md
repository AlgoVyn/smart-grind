# Swap Nodes in Pairs

## Problem Description

Given a linked list, swap every two adjacent nodes and return its head. You must solve the problem without modifying the values in the list's nodes (i.e., only nodes themselves may be changed).

**Example 1:**

Input: `head = [1,2,3,4]`
Output: `[2,1,4,3]`

**Example 2:**

Input: `head = []`
Output: `[]`

**Example 3:**

Input: `head = [1]`
Output: `[1]`

**Example 4:**

Input: `head = [1,2,3]`
Output: `[2,1,3]`

## Constraints

- The number of nodes in the list is in the range `[0, 100]`.
- `0 <= Node.val <= 100`

## Solution

```python
# Definition for singly-linked list.
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def swapPairs(head: ListNode) -> ListNode:
    dummy = ListNode(0)
    dummy.next = head
    prev = dummy

    while prev.next and prev.next.next:
        first = prev.next
        second = first.next

        # Swap the nodes
        prev.next = second
        first.next = second.next
        second.next = first

        # Move prev to the next pair
        prev = first

    return dummy.next
```

## Explanation

To swap every two adjacent nodes in a linked list, use an iterative approach with a dummy node.

1. Create a dummy node pointing to head, and set `prev` to dummy.
2. While there are at least two nodes ahead:
   - Identify first and second nodes.
   - Swap: `prev.next = second`, `first.next = second.next`, `second.next = first`.
   - Move `prev` to first (now the new prev for next pair).
3. Return `dummy.next` as the new head.

This swaps nodes without modifying values, preserving the list structure.

**Time Complexity:** O(n), traverse the list once.

**Space Complexity:** O(1), constant extra space.
