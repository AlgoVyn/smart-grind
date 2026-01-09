# Plus One Linked List

## Problem Description

You are given a non-negative integer represented as a linked list, where each node contains a single digit. The digits are stored in reverse order, such that the head points to the least significant digit.

Add one to the integer represented by the linked list and return the resulting linked list.

### Example 1

**Input:** `head = [1,2,3]`  
**Output:** `[1,2,4]`

**Explanation:** Adding 1 to 321 gives 324.

### Example 2

**Input:** `head = [9,9,9]`  
**Output:** `[1,0,0,0]`

**Explanation:** Adding 1 to 999 gives 1000.

### Example 3

**Input:** `head = [0]`  
**Output:** `[1]`

### Constraints

- The number of nodes in the list is between 1 and 30
- Each node contains a single digit (0-9)

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

To add one to a linked list representation of a number:

1. **Find the rightmost digit not equal to 9:** Traverse the list while keeping track of the last node that is not 9. This is where we need to increment.
2. **Increment that node:** Add 1 to the value of the `not_nine` node.
3. **Set all nodes after it to 0:** Since any 9 after the incremented digit would become 0 (with a carry), we set them to 0.
4. **Handle the edge case of all 9s:** If the dummy node's value becomes 1 (meaning the head was all 9s), we return the dummy as the new head.

### Step-by-step Approach

1. Create a dummy node pointing to head.
2. Find the rightmost node that is not 9.
3. Increment that node's value.
4. Set all nodes after it to 0.
5. Return appropriate head.

### Complexity Analysis

- **Time Complexity:** O(n), where n is the number of nodes in the linked list. We traverse the list twice at most.
- **Space Complexity:** O(1), only using a constant amount of extra space.
