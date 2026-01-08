# Plus One Linked List

## Problem Description
[Link to problem](https://leetcode.com/problems/plus-one-linked-list/)

## Solution

```python
class Solution:
    def plusOne(self, head: ListNode) -> ListNode:
        dummy = ListNode(0)
        dummy.next = head
        not_nine = dummy
        while head:
            if head.val != 9:
                not_nine = head
            head = head.next
        not_nine.val += 1
        node = not_nine.next
        while node:
            node.val = 0
            node = node.next
        return dummy.next if dummy.val == 0 else dummy
```

## Explanation
Traverse to find the rightmost digit not 9. Increment it, set all digits after to 0. If the head was 0 (all 9s), return the dummy as new head.

Time complexity: O(n), Space complexity: O(1).
