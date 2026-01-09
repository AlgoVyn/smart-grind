# Delete The Middle Node Of A Linked List

## Problem Description
You are given the head of a linked list. Delete the middle node, and return the head of the modified linked list.

The middle node of a linked list of size n is the ⌊n / 2⌋th node from the start using 0-based indexing, where ⌊x⌋ denotes the largest integer less than or equal to x.

For n = 1, 2, 3, 4, and 5, the middle nodes are 0, 1, 1, 2, and 2, respectively.

## Examples

**Input:**
```python
head = [1,3,4,7,1,2,6]
```

**Output:**
```python
[1,3,4,1,2,6]
```

## Constraints

- The number of nodes in the list is in the range `[1, 10^5]`.
- `1 <= Node.val <= 10^5`

## Solution

```python
class Solution:
    def deleteMiddle(self, head: Optional[ListNode]) -> Optional[ListNode]:
        if not head or not head.next:
            return None
        slow = head
        fast = head
        prev = None
        while fast and fast.next:
            prev = slow
            slow = slow.next
            fast = fast.next.next
        prev.next = slow.next
        return head
```

## Explanation
We use slow and fast pointers to find the middle node. Slow moves one step, fast two. When fast reaches the end, slow is at the middle. We remove it by updating the previous node's next. This is O(n) time and O(1) space.
