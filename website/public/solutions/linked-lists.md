# Linked Lists

## Problem Description
[Link to problem](https://leetcode.com/problems/reverse-linked-list/)

Given the head of a singly linked list, reverse the list, and return the reversed list.

Example 1:

Input: head = [1,2,3,4,5]
Output: [5,4,3,2,1]

Constraints:

The number of nodes in the list is the range [0, 5000].
-5000 <= Node.val <= 5000

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
We use an iterative approach to reverse the linked list. Initialize prev to None, and curr to head.

While curr is not None, save the next node, set curr.next to prev, move prev to curr, and curr to next_temp.

At the end, prev is the new head.

Time complexity: O(n), where n is the number of nodes.
Space complexity: O(1), using constant space.
