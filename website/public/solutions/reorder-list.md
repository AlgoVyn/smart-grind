# Reorder List

## Problem Description
You are given the head of a singly linked-list. The list can be represented as:

L0 → L1 → … → Ln - 1 → Ln

Reorder the list to be on the following form:

L0 → Ln → L1 → Ln - 1 → L2 → Ln - 2 → …

You may not modify the values in the list's nodes. Only nodes themselves may be changed.
 
Example 1:
Input: head = [1,2,3,4]
Output: [1,4,2,3]

Example 2:
Input: head = [1,2,3,4,5]
Output: [1,5,2,4,3]

 
Constraints:

The number of nodes in the list is in the range [1, 5 * 104].
1 <= Node.val <= 1000
## Solution

```python
# Definition for singly-linked list.
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class Solution:
    def reorderList(self, head: Optional[ListNode]) -> None:
        if not head or not head.next:
            return
        
        # Find the middle of the list
        slow, fast = head, head
        while fast and fast.next:
            slow = slow.next
            fast = fast.next.next
        
        # Reverse the second half
        prev = None
        curr = slow
        while curr:
            next_temp = curr.next
            curr.next = prev
            prev = curr
            curr = next_temp
        
        # Merge the two halves
        first = head
        second = prev
        while second.next:
            temp1 = first.next
            temp2 = second.next
            first.next = second
            second.next = temp1
            first = temp1
            second = temp2
```

## Explanation

This problem requires reordering a singly linked list to alternate between the start and end nodes.

### Approach

Find the middle of the list, reverse the second half, then merge the first half with the reversed second half by alternating nodes.

### Step-by-Step Explanation

1. **Find Middle**: Use slow and fast pointers to find the middle node.

2. **Reverse Second Half**: Reverse the list starting from the middle node.

3. **Merge Halves**: Alternate nodes from the first half and the reversed second half.

### Time Complexity

- O(n), where n is the number of nodes, as we traverse the list a few times.

### Space Complexity

- O(1), using only a constant amount of extra space.
