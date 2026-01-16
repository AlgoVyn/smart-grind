# Remove Nth Node From End of List

## Problem Description

Given the head of a linked list, remove the nth node from the end of the list and return its head.

The nth node from the end is the (L - n + 1)th node from the beginning, where L is the length of the list.

---

## Examples

**Example 1:**

**Input:**
```python
head = [1,2,3,4,5], n = 2
```

**Output:**
```python
[1,2,3,5]
```

**Explanation:** The linked list has 5 nodes. Removing the 2nd node from the end (node with value 4) gives [1,2,3,5].

---

**Example 2:**

**Input:**
```python
head = [1], n = 1
```

**Output:**
```python
[]
```

**Explanation:** Removing the only node from the list results in an empty list.

---

**Example 3:**

**Input:**
```python
head = [1,2], n = 1
```

**Output:**
```python
[1]
```

**Explanation:** Removing the 1st node from the end (node with value 2) gives [1].

---

## Constraints

- The number of nodes in the list is in the range `[1, 30]`.
- `1 <= Node.val <= 30`
- `1 <= n <= L` (where L is the length of the list)

---

## Solution

### Approach 1: Two Pass Algorithm

**Intuition:**
The problem asks us to remove the nth node from the end of the list. One straightforward approach is to:
1. First, find the length L of the linked list.
2. Then, remove the (L - n + 1)th node from the beginning (0-indexed).

This requires two traversals of the list.

```python
from typing import Optional

class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class Solution:
    def removeNthFromEnd(self, head: Optional[ListNode], n: int) -> Optional[ListNode]:
        # First pass: calculate the length of the list
        length = 0
        curr = head
        while curr:
            length += 1
            curr = curr.next
        
        # Create a dummy node to handle edge cases (like removing the head)
        dummy = ListNode(0, head)
        curr = dummy
        
        # Move to the node just before the one to delete
        # We need to move (length - n) steps from dummy
        for _ in range(length - n):
            curr = curr.next
        
        # Remove the target node
        curr.next = curr.next.next
        
        return dummy.next
```

---

### Approach 2: One Pass with Two Pointers (Optimal)

**Intuition:**
We can solve this in a single pass using the two-pointer technique (slow and fast pointers):
1. Use a dummy node to simplify edge cases (like removing the head).
2. Initialize both pointers at the dummy.
3. Move the fast pointer n+1 steps ahead. This ensures the slow pointer will be at the node just before the target when fast reaches the end.
4. Move both pointers one step at a time until fast reaches the end.
5. The slow pointer will be at the node just before the one we want to delete.

**Why n+1 steps?**
If we want to remove the nth node from the end, we need the slow pointer to stop at the (L-n)th node (0-indexed from dummy). When fast reaches null (end), slow should be at the correct position. Moving fast n+1 steps ahead and then moving both together keeps slow n+1 steps behind fast.

```python
from typing import Optional

class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class Solution:
    def removeNthFromEnd(self, head: Optional[ListNode], n: int) -> Optional[ListNode]:
        dummy = ListNode(0, head)
        slow = dummy
        fast = dummy
        
        # Move fast pointer n+1 steps ahead
        for _ in range(n + 1):
            fast = fast.next
        
        # Move both pointers until fast reaches the end
        while fast:
            slow = slow.next
            fast = fast.next
        
        # Remove the nth node from end
        slow.next = slow.next.next
        
        return dummy.next
```

---

## Explanation

### Two Pass Algorithm:
1. **Find Length:** Count all nodes in the list (O(L) time).
2. **Find Target Position:** The node to delete is at position (L - n) from the start (0-indexed).
3. **Delete Node:** Use a dummy node to handle deletion of the head node uniformly.
4. **Return Head:** dummy.next is the new head of the modified list.

### One Pass Algorithm (Optimal):
1. **Dummy Node:** Create a dummy node before the head to handle edge cases.
2. **Fast Pointer:** Move fast pointer n+1 steps ahead.
3. **Two Pointer Traversal:** Move both slow and fast pointers together until fast reaches null.
4. **Deletion:** At this point, slow is at the node before the target, so we can delete slow.next.

The key insight is that by moving fast n+1 steps ahead, we ensure that when fast reaches the end, slow will be exactly at the node before the one we want to delete.

---

## Time Complexity

| Approach | Time Complexity |
|----------|-----------------|
| Two Pass | O(L) - two traversals of the list |
| One Pass | O(L) - single traversal, more optimal |

Both approaches are O(L) where L is the length of the linked list.

---

## Space Complexity

| Approach | Space Complexity |
|----------|------------------|
| Two Pass | O(1) - only constant extra space |
| One Pass | O(1) - only constant extra space |

Both approaches use O(1) additional space.

---

## Related Problems

- [Remove Linked List Elements](https://leetcode.com/problems/remove-linked-list-elements/) - Remove all nodes with a specific value.
- [Delete Node in a Linked List](https://leetcode.com/problems/delete-node-in-a-linked-list/) - Delete a given node in O(1) time.
- [Remove Duplicates from Sorted List](https://leetcode.com/problems/remove-duplicates-from-sorted-list/) - Remove duplicates from a sorted list.
- [Swapping Nodes in a Linked List](https://leetcode.com/problems/swapping-nodes-in-a-linked-list/) - Swap the kth node from the end with the kth node from the beginning.

---

## Video Tutorial Links

- [NeetCode - Remove Nth Node From End of List](https://www.youtube.com/watch?v=XiVs0k7EoBw)
- [Fraz - Remove Nth Node From End of List](https://www.youtube.com/watch?v=Lhu3msvi1cU)
- [WilliamFiset - Two Pointer Technique](https://www.youtube.com/watch?v=3BclDBO1R88)

---

## Follow-up Questions

1. **How would you modify the solution to delete every nth node from the end?**
   One effective way is to:
   - Reverse the linked list.
   - Remove every nth node from the beginning of the reversed list (now equivalent to every nth from the original end).
   - Reverse the list back to its original order.

2. **What if the linked list is circular?**
   - You would need to detect the cycle first and then apply the same logic.

3. **How would you handle removing the nth node if you only have access to the node to be deleted (not the head)?**
   - You can copy the value from the next node and delete the next node instead.

4. **Can you solve this problem recursively?**
   - Yes, but it would use O(L) space for the call stack, which is less optimal than the iterative approach.

5. **How would you modify the solution for a doubly linked list?**
   - You would need to update both next and previous pointers when deleting a node.

