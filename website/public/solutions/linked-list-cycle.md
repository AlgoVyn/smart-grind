# Linked List Cycle

## Problem Description

Given `head`, the head of a linked list, determine if the linked list has a **cycle** in it.

A cycle exists if there is some node in the list that can be reached again by continuously following the `next` pointer. Internally, `pos` is used to denote the index of the node that tail's `next` pointer is connected to.

> **Note:** `pos` is not passed as a parameter.

Return `true` if there is a cycle in the linked list. Otherwise, return `false`.

### Examples

**Example 1:**
```python
Input: head = [3,2,0,-4], pos = 1
Output: true
```
There is a cycle in the linked list, where the tail connects to the 1st node (0-indexed).

**Example 2:**
```python
Input: head = [1,2], pos = 0
Output: true
```
There is a cycle in the linked list, where the tail connects to the 0th node.

**Example 3:**
```python
Input: head = [1], pos = -1
Output: false
```
There is no cycle in the linked list.

### Constraints

- The number of nodes in the list is in the range `[0, 10^4]`
- `-10^5 <= Node.val <= 10^5`
- `pos` is `-1` or a valid index in the linked-list

### Follow Up

Can you solve it using **O(1)** (i.e., constant) memory?

---

## Solution

```python
class Solution:
    def hasCycle(self, head: Optional[ListNode]) -> bool:
        if not head or not head.next:
            return False
        slow = head
        fast = head.next
        while fast and fast.next:
            if slow == fast:
                return True
            slow = slow.next
            fast = fast.next.next
        return False
```

---

## Explanation

We use **slow and fast pointers** (Floyd's Cycle-Finding Algorithm):

1. `slow` moves **one step** at a time
2. `fast` moves **two steps** at a time
3. If there's a cycle, they will eventually meet
4. If `fast` reaches the end, there's no cycle

This approach detects a cycle in **O(n) time** and **O(1) space**.

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time**   | `O(n)` — where `n` is the number of nodes |
| **Space**  | `O(1)` — constant space |
