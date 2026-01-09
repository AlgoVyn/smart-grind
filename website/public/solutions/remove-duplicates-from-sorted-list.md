# Remove Duplicates From Sorted List

## Problem Description
Given the head of a sorted linked list, delete all duplicates such that each element appears only once. Return the linked list sorted as well.
 
Example 1:
Input: head = [1,1,2]
Output: [1,2]

Example 2:
Input: head = [1,1,2,3,3]
Output: [1,2,3]

 
Constraints:

The number of nodes in the list is in the range [0, 300].
-100 <= Node.val <= 100
The list is guaranteed to be sorted in ascending order.
## Solution

```python
# Definition for singly-linked list.
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class Solution:
    def deleteDuplicates(self, head: ListNode) -> ListNode:
        current = head
        while current and current.next:
            if current.val == current.next.val:
                current.next = current.next.next
            else:
                current = current.next
        return head
```

## Explanation
To remove duplicates from a sorted linked list, traverse the list with a pointer.

For each node, if the next node has the same value, skip it by setting current.next to current.next.next.

Otherwise, move to the next node.

This preserves the sorted order and removes duplicates in place.

Time Complexity: O(n), where n is the number of nodes.

Space Complexity: O(1), using only a few pointers.
