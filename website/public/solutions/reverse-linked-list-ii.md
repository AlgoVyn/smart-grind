# Reverse Linked List Ii

## Problem Description
[Link to problem](https://leetcode.com/problems/reverse-linked-list-ii/)

Given the head of a singly linked list and two integers left and right where left <= right, reverse the nodes of the list from position left to position right, and return the reversed list.
 
Example 1:


Input: head = [1,2,3,4,5], left = 2, right = 4
Output: [1,4,3,2,5]

Example 2:

Input: head = [5], left = 1, right = 1
Output: [5]

 
Constraints:

The number of nodes in the list is n.
1 <= n <= 500
-500 <= Node.val <= 500
1 <= left <= right <= n

 
Follow up: Could you do it in one pass?


## Solution

```python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class Solution:
    def reverseBetween(self, head: ListNode, left: int, right: int) -> ListNode:
        if not head or left == right:
            return head
        dummy = ListNode(0, head)
        prev = dummy
        for _ in range(left - 1):
            prev = prev.next
        current = prev.next
        for _ in range(right - left):
            temp = current.next
            current.next = temp.next
            temp.next = prev.next
            prev.next = temp
        return dummy.next
```

## Explanation
Use a dummy node to handle the head. Move prev to the node before the left position. Then, for each node from left to right-1, take the next node and insert it after prev, effectively reversing the segment in place.

**Time Complexity:** O(n), where n is the list length, as we traverse to left and reverse the segment.

**Space Complexity:** O(1), using constant extra space.
