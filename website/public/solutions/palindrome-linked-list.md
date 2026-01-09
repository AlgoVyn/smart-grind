# Palindrome Linked List

## Problem Description

Given the head of a singly linked list, return `true` if it is a palindrome or `false` otherwise.

### Example 1

**Input:** `head = [1,2,2,1]`  
**Output:** `true`

### Example 2

**Input:** `head = [1,2]`  
**Output:** `false`

### Constraints

- The number of nodes in the list is in the range `[1, 10^5]`
- `0 <= Node.val <= 9`

### Follow up

Could you do it in O(n) time and O(1) space?

## Solution

```
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next

class Solution:
    def isPalindrome(self, head: Optional[ListNode]) -> bool:
        if not head or not head.next:
            return True
        
        # Find the middle of the list
        slow = fast = head
        while fast.next and fast.next.next:
            slow = slow.next
            fast = fast.next.next
        
        # Reverse the second half
        prev = None
        curr = slow.next
        while curr:
            next_temp = curr.next
            curr.next = prev
            prev = curr
            curr = next_temp
        slow.next = prev
        
        # Compare the first half and the reversed second half
        first = head
        second = slow.next
        while second:
            if first.val != second.val:
                return False
            first = first.next
            second = second.next
        return True
```

## Explanation

To check if a linked list is a palindrome, we find the middle, reverse the second half, and compare it with the first half.

### Step-by-step Approach

1. If the list has 0 or 1 node, it's a palindrome.
2. Use slow and fast pointers to find the middle.
3. Reverse the second half starting from `slow.next`.
4. Compare the first half (from head) with the reversed second half.

### Complexity Analysis

- **Time Complexity:** O(n), where n is the number of nodes.
- **Space Complexity:** O(1), excluding the space for reversing which is O(1).
