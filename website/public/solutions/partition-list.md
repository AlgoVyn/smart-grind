# Partition List

## Problem Description

Given the head of a linked list and a value `x`, partition it such that all nodes less than `x` come before nodes greater than or equal to `x`.
You should preserve the original relative order of the nodes in each of the two partitions.

### Example 1

**Input:** `head = [1,4,3,2,5,2]`, `x = 3`  
**Output:** `[1,2,2,4,3,5]`

### Example 2

**Input:** `head = [2,1]`, `x = 2`  
**Output:** `[1,2]`

### Constraints

- The number of nodes in the list is in the range `[0, 200]`
- `-100 <= Node.val <= 100`
- `-200 <= x <= 200`

---

## Solution

```python
class Solution:
    def partition(self, head: Optional[ListNode], x: int) -> Optional[ListNode]:
        before = ListNode(0)
        after = ListNode(0)
        before_head = before
        after_head = after
        while head:
            if head.val < x:
                before.next = head
                before = before.next
            else:
                after.next = head
                after = after.next
            head = head.next
        after.next = None
        before.next = after_head.next
        return before_head.next
```

---

## Explanation

Create two dummy nodes for the 'before' list (nodes < x) and 'after' list (nodes >= x). Traverse the original list, appending each node to the appropriate list while preserving order. Finally, connect the 'before' list to the 'after' list and return the head of the combined list.

### Step-by-step Approach

1. Create two dummy nodes: `before` for nodes < x and `after` for nodes >= x.
2. Traverse the original list.
3. For each node, append it to the appropriate list based on its value.
4. Terminate the 'after' list with `None`.
5. Connect the 'before' list to the 'after' list.
6. Return the head of the combined list.

### Complexity Analysis

- **Time Complexity:** O(n), where n is the number of nodes.
- **Space Complexity:** O(1), as we only use constant extra space.
