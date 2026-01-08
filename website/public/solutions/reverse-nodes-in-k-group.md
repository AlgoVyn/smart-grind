# Reverse Nodes In K Group

## Problem Description
[Link to problem](https://leetcode.com/problems/reverse-nodes-in-k-group/)

Given the head of a linked list, reverse the nodes of the list k at a time, and return the modified list.
k is a positive integer and is less than or equal to the length of the linked list. If the number of nodes is not a multiple of k then left-out nodes, in the end, should remain as it is.
You may not alter the values in the list's nodes, only nodes themselves may be changed.
 
Example 1:


Input: head = [1,2,3,4,5], k = 2
Output: [2,1,4,3,5]

Example 2:


Input: head = [1,2,3,4,5], k = 3
Output: [3,2,1,4,5]

 
Constraints:

The number of nodes in the list is n.
1 <= k <= n <= 5000
0 <= Node.val <= 1000

 
Follow-up: Can you solve the problem in O(1) extra memory space?


## Solution

```python
# Definition for singly-linked list.
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class Solution:
    def reverseKGroup(self, head: ListNode, k: int) -> ListNode:
        dummy = ListNode(0)
        dummy.next = head
        prev_group_end = dummy
        
        while True:
            # Check if there are at least k nodes left
            count = 0
            curr = prev_group_end.next
            while curr and count < k:
                curr = curr.next
                count += 1
            if count < k:
                break
            
            # Reverse the k nodes
            prev = prev_group_end.next
            curr = prev.next
            for _ in range(k - 1):
                next_node = curr.next
                curr.next = prev
                prev = curr
                curr = next_node
            
            # Connect the reversed group
            group_start = prev_group_end.next
            prev_group_end.next = prev
            group_start.next = curr
            prev_group_end = group_start
        
        return dummy.next
```

## Explanation

This problem requires reversing nodes in a linked list in groups of k, leaving remaining nodes unchanged if less than k.

### Step-by-Step Approach:

1. **Dummy Node**: Use a dummy node to simplify handling the head.

2. **Iterate Groups**: Use prev_group_end to track the end of the previous group.

3. **Check Group Size**: Count nodes from prev_group_end.next; if less than k, stop.

4. **Reverse Group**:
   - Set prev to the first node of the group.
   - Use curr to traverse and reverse pointers.
   - For each of k-1 iterations, adjust pointers to reverse the group.

5. **Connect Groups**: Link the reversed group to the previous part and update prev_group_end.

6. **Return Result**: Return dummy.next.

### Time Complexity:
- O(n), where n is the number of nodes, as each node is visited once.

### Space Complexity:
- O(1), using constant extra space.
