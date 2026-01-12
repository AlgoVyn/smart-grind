# Merge K Sorted Lists

## Problem Description

You are given an array of `k` linked-lists `lists`, where each linked-list is sorted in ascending order. Merge all linked-lists into one sorted linked-list and return it.

---

## Examples

**Example 1:**

| Input | Output |
|-------|--------|
| `lists = [[1,4,5],[1,3,4],[2,6]]` | `[1,1,2,3,4,4,5,6]` |

**Explanation:** The input lists are:
```
1 → 4 → 5
1 → 3 → 4
2 → 6
```
Merging them produces: `1 → 1 → 2 → 3 → 4 → 4 → 5 → 6`

**Example 2:**

| Input | Output |
|-------|--------|
| `lists = []` | `[]` |

**Example 3:**

| Input | Output |
|-------|--------|
| `lists = [[]]` | `[]` |

---

## Constraints

- `k == lists.length`
- `0 <= k <= 10^4`
- `0 <= lists[i].length <= 500`
- `-10^4 <= lists[i][j] <= 10^4`
- `lists[i]` is sorted in ascending order
- The sum of all `lists[i].length` will not exceed `10^4`

---

## Solution

```python
import heapq
from typing import List, Optional

# Definition for singly-linked list.
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class Solution:
    def mergeKLists(self, lists: List[Optional[ListNode]]) -> Optional[ListNode]:
        if not lists:
            return None
        
        # Min-heap: (node_value, list_index, node)
        heap = []
        for i, node in enumerate(lists):
            if node:
                heapq.heappush(heap, (node.val, i, node))
        
        # Dummy node to start the merged list
        dummy = ListNode()
        current = dummy
        
        # Extract smallest node from heap repeatedly
        while heap:
            val, i, node = heapq.heappop(heap)
            current.next = node
            current = current.next
            
            # Push next node from the same list
            if node.next:
                heapq.heappush(heap, (node.next.val, i, node.next))
        
        return dummy.next
```

---

## Explanation

To merge k sorted linked lists efficiently, we use a min-heap (priority queue) to always select the smallest current node:

1. **Initialize a min-heap** and push the head of each non-empty list.
2. **Create a dummy node** as the start of the merged list.
3. **Iterate while the heap is not empty**:
   - Pop the node with the smallest value from the heap.
   - Append it to the merged list.
   - If the popped node has a next node, push it into the heap.
4. Return `dummy.next`, the head of the merged list.

---

## Complexity Analysis

| Metric | Complexity |
|--------|------------|
| Time | `O(n log k)` — total `n` nodes, each heap operation is `O(log k)` |
| Space | `O(k)` — heap holds at most `k` nodes at any time |
