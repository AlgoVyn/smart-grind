# Remove Duplicates From Sorted List Ii

## Problem Description
[Link to problem](https://leetcode.com/problems/remove-duplicates-from-sorted-list-ii/)

Given the head of a sorted linked list, delete all nodes that have duplicate numbers, leaving only distinct numbers from the original list. Return the linked list sorted as well.
 
Example 1:


Input: head = [1,2,3,3,4,4,5]
Output: [1,2,5]

Example 2:


Input: head = [1,1,1,2,3]
Output: [2,3]

 
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
    def deleteDuplicates(self, head: Optional[ListNode]) -> Optional[ListNode]:
        dummy = ListNode(0, head)
        prev = dummy
        curr = head
        while curr:
            if curr.next and curr.val == curr.next.val:
                while curr.next and curr.val == curr.next.val:
                    curr = curr.next
                prev.next = curr.next
            else:
                prev = prev.next
            curr = curr.next
        return dummy.next
```

## Explanation

This problem requires removing all nodes with duplicate values from a sorted linked list.

### Approach

Use a dummy head and iterate through the list, skipping groups of duplicates.

### Step-by-Step Explanation

1. **Dummy Head**: Create dummy pointing to head.

2. **Pointers**: prev = dummy, curr = head.

3. **Traverse**: While curr, if curr.next and equal, skip all duplicates, set prev.next to after.

4. **Else**: Move prev to curr.

5. **Move Curr**: Always move curr.

6. **Return**: dummy.next.

### Time Complexity

- O(n), where n is the number of nodes.

### Space Complexity

- O(1), constant space.
