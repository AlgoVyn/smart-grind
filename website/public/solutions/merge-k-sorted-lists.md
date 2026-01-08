# Merge K Sorted Lists

## Problem Description
[Link to problem](https://leetcode.com/problems/merge-k-sorted-lists/)

You are given an array of k linked-lists lists, each linked-list is sorted in ascending order.
Merge all the linked-lists into one sorted linked-list and return it.
 
Example 1:

Input: lists = [[1,4,5],[1,3,4],[2,6]]
Output: [1,1,2,3,4,4,5,6]
Explanation: The linked-lists are:
[
  1->4->5,
  1->3->4,
  2->6
]
merging them into one sorted linked list:
1->1->2->3->4->4->5->6

Example 2:

Input: lists = []
Output: []

Example 3:

Input: lists = [[]]
Output: []

 
Constraints:

k == lists.length
0 <= k <= 104
0 <= lists[i].length <= 500
-104 <= lists[i][j] <= 104
lists[i] is sorted in ascending order.
The sum of lists[i].length will not exceed 104.


## Solution

```python
import heapq
from typing import List, Optional

class Solution:
    def mergeKLists(self, lists: List[Optional[ListNode]]) -> Optional[ListNode]:
        if not lists:
            return None
        heap = []
        for i, node in enumerate(lists):
            if node:
                heapq.heappush(heap, (node.val, i, node))
        dummy = ListNode()
        current = dummy
        while heap:
            val, i, node = heapq.heappop(heap)
            current.next = node
            current = current.next
            if node.next:
                heapq.heappush(heap, (node.next.val, i, node.next))
        return dummy.next
```

## Explanation
To merge k sorted linked lists, we use a min-heap (priority queue) to always select the smallest current node among the lists' heads.

1. Initialize a min-heap and push the head of each non-empty list into it, using the node value for priority.
2. Create a dummy node to serve as the start of the merged list.
3. Use a pointer to build the merged list.
4. While the heap is not empty:
   - Pop the node with the smallest value from the heap.
   - Append it to the merged list.
   - If the popped node has a next node, push the next node into the heap.
5. After processing all nodes, return the next of the dummy node, which is the head of the merged list.

Time complexity: O(n log k), where n is the total number of nodes across all lists and k is the number of lists, due to heap operations for each node.
Space complexity: O(k), for the heap that holds at most k nodes at any time.
