# Merge Two Sorted Lists

## Problem Description
You are given the heads of two sorted linked lists list1 and list2.
Merge the two lists into one sorted list. The list should be made by splicing together the nodes of the first two lists.
Return the head of the merged linked list.
 
Example 1:
Input: list1 = [1,2,4], list2 = [1,3,4]
Output: [1,1,2,3,4,4]

Example 2:

Input: list1 = [], list2 = []
Output: []

Example 3:

Input: list1 = [], list2 = [0]
Output: [0]

 
Constraints:

The number of nodes in both lists is in the range [0, 50].
-100 <= Node.val <= 100
Both list1 and list2 are sorted in non-decreasing order.
## Solution

```python
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
class Solution:
    def mergeTwoLists(self, list1: Optional[ListNode], list2: Optional[ListNode]) -> Optional[ListNode]:
        dummy = ListNode()
        current = dummy
        while list1 and list2:
            if list1.val < list2.val:
                current.next = list1
                list1 = list1.next
            else:
                current.next = list2
                list2 = list2.next
            current = current.next
        current.next = list1 if list1 else list2
        return dummy.next
```

## Explanation
To merge two sorted linked lists, we use an iterative approach with a dummy node to handle the merge process.

1. Create a dummy node to act as the start of the merged list, and a pointer (current) to track the end of the merged list.
2. While both list1 and list2 have nodes:
   - Compare the values of the current nodes in list1 and list2.
   - Append the node with the smaller value to the merged list via the current pointer, and advance the corresponding list pointer.
3. After the loop, append any remaining nodes from list1 or list2 to the merged list.
4. Return the next node of the dummy node, which is the head of the merged sorted list.

Time complexity: O(m + n), where m and n are the lengths of list1 and list2, as we traverse each node once.
Space complexity: O(1), since we only use a constant amount of extra space and reuse the existing nodes.
