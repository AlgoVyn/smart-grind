# Odd Even Linked List

## Problem Description

Given the head of a singly linked list, group all the nodes with odd indices together followed by the nodes with even indices, and return the reordered list.
The first node is considered odd, and the second node is even, and so on.
Note that the relative order inside both the even and odd groups should remain as it was in the input.
You must solve the problem in O(1) extra space complexity and O(n) time complexity.

### Example 1

**Input:** `head = [1,2,3,4,5]`  
**Output:** `[1,3,5,2,4]`

### Example 2

**Input:** `head = [2,1,3,5,6,4,7]`  
**Output:** `[2,3,6,7,1,5,4]`

### Constraints

- The number of nodes in the linked list is in the range `[0, 10^4]`
- `-10^6 <= Node.val <= 10^6`

---

## Solution

```
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next

class Solution:
    def oddEvenList(self, head: Optional[ListNode]) -> Optional[ListNode]:
        if not head:
            return head
        odd = head
        even = head.next
        even_head = even
        while even and even.next:
            odd.next = even.next
            odd = odd.next
            even.next = odd.next
            even = even.next
        odd.next = even_head
        return head
```

---

## Explanation

We need to rearrange the linked list so that all nodes with odd indices come first, followed by even indices, maintaining relative order.

### Step-by-step Approach

1. If the list is empty, return it.
2. Set `odd` pointer to head, `even` pointer to `head.next`, and keep `even_head` for later.
3. While `even` and `even.next` exist:
   - Link `odd.next` to `even.next` (next odd node).
   - Move `odd` to its new next.
   - Link `even.next` to `odd.next` (next even node).
   - Move `even` to its new next.
4. Link the end of odd list to `even_head`.

### Complexity Analysis

- **Time Complexity:** O(n), where n is the number of nodes, as we traverse the list once.
- **Space Complexity:** O(1), using only a few pointers.
