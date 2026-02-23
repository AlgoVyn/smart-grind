# Merge K Sorted Lists

## Category
Heap / Priority Queue

## Description
Merge K Sorted Lists is a classic problem that merges k sorted linked lists into one sorted list. The optimal approach uses a min-heap (priority queue) to always extract the smallest element among the current heads of all lists.

The algorithm works as follows:
1. Initialize a min-heap with the first element from each list
2. Extract the minimum element from heap and add to result
3. Push the next element from the same list into the heap
4. Repeat until heap is empty

Time complexity: O(N log k) where N is total elements and k is number of lists
- Each element is inserted and extracted from heap once: O(N log k)
- Building the initial heap: O(k)

Space complexity: O(k) for the heap plus O(k) for the result list.

Alternative approaches include:
- Divide and conquer (merge pairs of lists recursively)
- Naive approach (merge one list at a time)

---

## When to Use
Use this algorithm when you need to solve problems involving:
- heap / priority queue related operations
- Efficient traversal or search operations
- Optimization problems where this pattern applies

---

## Algorithm Steps
1. Understand the problem constraints and requirements
2. Identify the input and expected output
3. Apply the core algorithm logic
4. Handle edge cases appropriately
5. Optimize for the given constraints

---

## Implementation

```python
import heapq
from typing import List, Optional

class ListNode:
    """Definition for singly-linked list node"""
    def __init__(self, val: int = 0, next: 'ListNode' = None):
        self.val = val
        self.next = next


def merge_k_lists(lists: List[Optional[ListNode]]) -> Optional[ListNode]:
    """
    Merge k sorted linked lists into one sorted list using min-heap.
    
    Args:
        lists: List of sorted linked list heads
        
    Returns:
        Head of merged sorted linked list
        
    Time: O(N log k)
    Space: O(k)
    """
    # Dummy head for easier construction
    dummy = ListNode(-1)
    current = dummy
    
    # Initialize min-heap with (value, list_index, node)
    # list_index is used to break ties
    heap = []
    
    for i, node in enumerate(lists):
        if node:
            heapq.heappush(heap, (node.val, i, node))
    
    # Process heap
    while heap:
        val, i, node = heapq.heappop(heap)
        current.next = ListNode(val)
        current = current.next
        
        # Push next node from same list
        if node.next:
            heapq.heappush(heap, (node.next.val, i, node.next))
    
    return dummy.next


def merge_k_lists_divide_conquer(lists: List[Optional[ListNode]]) -> Optional[ListNode]:
    """
    Merge k sorted lists using divide and conquer approach.
    
    Args:
        lists: List of sorted linked list heads
        
    Returns:
        Head of merged sorted linked list
        
    Time: O(N log k)
    Space: O(log k) for recursion stack
    """
    if not lists:
        return None
    
    # Merge two lists at a time
    while len(lists) > 1:
        merged_lists = []
        
        for i in range(0, len(lists) - 1, 2):
            merged = merge_two_lists(lists[i], lists[i + 1])
            merged_lists.append(merged)
        
        # Handle odd number of lists
        if len(lists) % 2 == 1:
            merged_lists.append(lists[-1])
        
        lists = merged_lists
    
    return lists[0]


def merge_two_lists(l1: Optional[ListNode], l2: Optional[ListNode]) -> Optional[ListNode]:
    """Merge two sorted linked lists"""
    dummy = ListNode(-1)
    current = dummy
    
    while l1 and l2:
        if l1.val <= l2.val:
            current.next = l1
            l1 = l1.next
        else:
            current.next = l2
            l2 = l2.next
        current = current.next
    
    current.next = l1 or l2
    return dummy.next


def list_to_linkedlist(arr: List[int]) -> Optional[ListNode]:
    """Convert list to linked list"""
    if not arr:
        return None
    dummy = ListNode(-1)
    current = dummy
    for val in arr:
        current.next = ListNode(val)
        current = current.next
    return dummy.next


def linkedlist_to_list(node: Optional[ListNode]) -> List[int]:
    """Convert linked list to list"""
    result = []
    while node:
        result.append(node.val)
        node = node.next
    return result


# Example usage
if __name__ == "__main__":
    # Create sorted linked lists
    list1 = list_to_linkedlist([1, 4, 7, 10])
    list2 = list_to_linkedlist([2, 5, 8])
    list3 = list_to_linkedlist([3, 6, 9, 11])
    
    lists = [list1, list2, list3]
    
    # Merge using heap
    result = merge_k_lists(lists)
    print("Merged (using heap):", linkedlist_to_list(result))
    # Output: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
    
    # Recreate lists for second method
    list1 = list_to_linkedlist([1, 4, 7, 10])
    list2 = list_to_linkedlist([2, 5, 8])
    list3 = list_to_linkedlist([3, 6, 9, 11])
    
    # Merge using divide and conquer
    result = merge_k_lists_divide_conquer([list1, list2, list3])
    print("Merged (divide conquer):", linkedlist_to_list(result))
    # Output: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
    
    # Edge case: empty list
    result = merge_k_lists([])
    print("Empty input:", linkedlist_to_list(result))  # []
    
    # Edge case: one list
    result = merge_k_lists([list_to_linkedlist([1, 2, 3])])
    print("Single list:", linkedlist_to_list(result))  # [1, 2, 3]
```

```javascript
function mergeKLists() {
    // Merge K Sorted Lists implementation
    // Time: O(N log k)
    // Space: O(k)
}
```

---

## Example

**Input:**
```
lists = [
    [1, 4, 7, 10],
    [2, 5, 8],
    [3, 6, 9, 11]
]
```

**Output:**
```
[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
```

**Input:**
```
lists = [
    [],
    [1],
    []
]
```

**Output:**
```
[1]
```

**Input:**
```
lists = []
```

**Output:**
```
[]
```

---

## Time Complexity
**O(N log k)**

---

## Space Complexity
**O(k)**

---

## Common Variations
- Iterative vs Recursive implementation
- Space-optimized versions
- Modified versions for specific constraints

---

## Related Problems
- Practice problems that use this algorithm pattern
- Similar algorithms in the same category

---

## Tips
- Always consider edge cases
- Think about time vs space trade-offs
- Look for opportunities to optimize
