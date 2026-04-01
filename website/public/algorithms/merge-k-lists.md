# Merge K Sorted Lists

## Category
Heap / Priority Queue

## Description

Merge K Sorted Lists is a classic problem that merges k sorted linked lists into one sorted list. The optimal approach uses a min-heap (priority queue) to always extract the smallest element among the current heads of all lists, achieving O(N log k) time complexity where N is the total number of elements and k is the number of lists.

This algorithm is fundamental for solving problems involving multiple sorted sequences, k-way merging, and finding kth smallest elements across multiple data sources. It's widely used in external sorting, database merge operations, and stream processing where data arrives from multiple sorted sources.

---

## Concepts

The Merge K Sorted Lists algorithm is built on several fundamental concepts from heap data structures and merge algorithms.

### 1. Min-Heap Property

A min-heap ensures the smallest element is always accessible in O(1) time:

| Property | Description | Complexity |
|----------|-------------|------------|
| **Min Access** | Smallest element at root | O(1) |
| **Insertion** | Add new element | O(log k) |
| **Extraction** | Remove and return min | O(log k) |
| **Size** | Number of elements tracked | O(1) |

### 2. K-Way Merge Strategy

The core insight of merging k lists simultaneously:

```
Initialize: Push first element from each list into heap

While heap not empty:
    1. Extract minimum element from heap (current smallest)
    2. Add to result list
    3. Push next element from same source list into heap
    4. Repeat until all lists exhausted
```

### 3. List State Tracking

Each heap entry tracks its source list to know which list to advance:

| Component | Purpose | Stored As |
|-----------|---------|-----------|
| **Value** | The actual element value | Integer |
| **List Index** | Which source list | Integer index |
| **Node Reference** | Pointer to current node | Node object |

### 4. Alternative Approaches

Different strategies for merging k sorted lists:

| Approach | Time | Space | Best For |
|----------|------|-------|----------|
| **Min-Heap** | O(N log k) | O(k) | General purpose, streaming |
| **Divide & Conquer** | O(N log k) | O(log k) | Linked lists, recursion-friendly |
| **Sequential Merge** | O(N·k) | O(1) | Only when k is very small |

---

## Frameworks

Structured approaches for solving merge k sorted lists problems.

### Framework 1: Min-Heap Template

```
┌─────────────────────────────────────────────────────┐
│  MIN-HEAP K-WAY MERGE FRAMEWORK                       │
├─────────────────────────────────────────────────────┤
│                                                     │
│  1. INITIALIZE HEAP:                                │
│     For each list i from 0 to k-1:                  │
│         If list[i] not empty:                        │
│             Push (value[i], i, node[i]) to heap     │
│                                                     │
│  2. CREATE RESULT DUMMY NODE                         │
│     dummy = new Node()                               │
│     current = dummy                                   │
│                                                     │
│  3. PROCESS WHILE HEAP NOT EMPTY:                    │
│     While heap not empty:                           │
│         a. (val, i, node) = heap.pop()              │
│         b. current.next = new Node(val)             │
│         c. current = current.next                   │
│         d. If node.next exists:                     │
│              heap.push((node.next.val, i, node.next))│
│                                                     │
│  4. RETURN RESULT                                    │
│     Return dummy.next                                │
│                                                     │
│  Complexity: O(N log k) time, O(k) space             │
└─────────────────────────────────────────────────────┘
```

**When to use**: When you need to merge k sorted lists efficiently with predictable performance.

### Framework 2: Divide and Conquer Template

```
┌─────────────────────────────────────────────────────┐
│  DIVIDE AND CONQUER MERGE FRAMEWORK                   │
├─────────────────────────────────────────────────────┤
│                                                     │
│  function mergeKLists(lists):                        │
│      If lists is empty: return null                  │
│      While len(lists) > 1:                           │
│          merged = []                                 │
│          For i from 0 to len(lists)-1 step 2:       │
│              If i+1 < len(lists):                    │
│                  merged.append(mergeTwoLists(        │
│                      lists[i], lists[i+1]))          │
│              Else:                                   │
│                  merged.append(lists[i])            │
│          lists = merged                              │
│      Return lists[0]                                 │
│                                                     │
│  function mergeTwoLists(l1, l2):                      │
│      // Standard merge of two sorted lists           │
│      dummy = new Node()                              │
│      current = dummy                                 │
│      While l1 and l2:                                │
│          If l1.val < l2.val:                        │
│              current.next = l1                       │
│              l1 = l1.next                            │
│          Else:                                       │
│              current.next = l2                       │
│              l2 = l2.next                            │
│          current = current.next                      │
│      current.next = l1 or l2                        │
│      Return dummy.next                               │
│                                                     │
│  Complexity: O(N log k) time, O(log k) stack space   │
└─────────────────────────────────────────────────────┘
```

**When to use**: When working with linked lists and want to avoid heap overhead, or when recursion depth is acceptable.

### Framework 3: Kth Smallest Element Framework

```
┌─────────────────────────────────────────────────────┐
│  KTH SMALLEST ELEMENT FRAMEWORK                       │
├─────────────────────────────────────────────────────┤
│                                                     │
│  1. Initialize heap with first element of each list │
│                                                     │
│  2. Extract (k-1) elements:                          │
│     For count from 1 to k-1:                         │
│         (val, i, node) = heap.pop()                 │
│         If node.next exists:                         │
│             heap.push((node.next.val, i, node.next)) │
│         If heap is empty: return null                │
│                                                     │
│  3. Return kth smallest:                               │
│     Return heap.peek().val                           │
│                                                     │
│  Complexity: O(k log k) time for kth element         │
└─────────────────────────────────────────────────────┘
```

**When to use**: When you only need the kth smallest element without fully merging all lists.

---

## Forms

Different manifestations of the merge k sorted lists pattern.

### Form 1: Merge K Sorted Linked Lists

Classic linked list merging where each list is a chain of nodes.

| Characteristic | Implementation Detail |
|----------------|----------------------|
| **Node Structure** | val + next pointer |
| **Heap Entry** | (val, list_index, node_ptr) |
| **Progression** | node = node.next |
| **Result Type** | Linked list head |

### Form 2: Merge K Sorted Arrays

Same algorithm applied to array data structures.

| Characteristic | Implementation Detail |
|----------------|----------------------|
| **Index Tracking** | Track (array_index, element_index) |
| **Heap Entry** | (val, arr_idx, elem_idx) |
| **Progression** | elem_idx++ |
| **Boundary Check** | elem_idx < len(array) |

### Form 3: Streaming/Multi-Source Merge

Merge data arriving from multiple live sources (logs, sensors, etc.).

```
Source 1: [1, 4, 7] arriving over time
Source 2: [2, 5, 8] arriving over time
Source 3: [3, 6, 9] arriving over time

Heap maintains "current" element from each active source
As data arrives: push to heap
When source ends: stop pushing that source
```

### Form 4: External Merge Sort Application

Used in external sorting when data doesn't fit in memory.

1. Sort chunks of data that fit in memory
2. Create k sorted runs (files)
3. Use k-way merge to combine into final sorted output
4. Process incrementally, write to disk

---

## Tactics

Specific techniques and optimizations for merge k sorted lists.

### Tactic 1: Using heapq in Python

Python's built-in heapq module simplifies implementation:

```python
import heapq

def merge_k_lists_heapq(lists):
    """Merge using Python's heapq module."""
    heap = []
    
    # Initialize heap with (value, list_index, node)
    # list_index breaks ties to avoid comparing nodes
    for i, node in enumerate(lists):
        if node:
            heapq.heappush(heap, (node.val, i, node))
    
    dummy = ListNode(0)
    current = dummy
    
    while heap:
        val, i, node = heapq.heappop(heap)
        current.next = ListNode(val)
        current = current.next
        
        if node.next:
            heapq.heappush(heap, (node.next.val, i, node.next))
    
    return dummy.next
```

**Key point**: Include list_index as tie-breaker since Python's heapq can't compare custom objects directly.

### Tactic 2: Early Termination for Kth Element

Stop early when only need kth smallest:

```python
def find_kth_smallest(lists, k):
    """Find kth smallest without full merge."""
    heap = []
    
    for i, lst in enumerate(lists):
        if lst:
            heapq.heappush(heap, (lst[0], i, 0))
    
    count = 0
    while heap:
        val, i, j = heapq.heappop(heap)
        count += 1
        
        if count == k:
            return val
        
        if j + 1 < len(lists[i]):
            heapq.heappush(heap, (lists[i][j + 1], i, j + 1))
    
    return None
```

**Optimization**: O(k log k) instead of O(N log k) when k << N.

### Tactic 3: Optimized Two-List Merge

Efficient merge of two sorted lists as building block:

```python
def merge_two_lists(l1, l2):
    """Optimized two-list merge using dummy head."""
    dummy = ListNode(0)
    tail = dummy
    
    while l1 and l2:
        if l1.val <= l2.val:
            tail.next = l1
            l1 = l1.next
        else:
            tail.next = l2
            l2 = l2.next
        tail = tail.next
    
    # Attach remaining list (optimization: avoid loop)
    tail.next = l1 if l1 else l2
    
    return dummy.next
```

**Benefits**: Single pass through both lists, O(1) extra space.

### Tactic 4: Handling Empty Lists

Defensive programming for edge cases:

```python
def merge_k_lists_safe(lists):
    """Handle edge cases gracefully."""
    # Filter out None/empty lists
    valid_lists = [lst for lst in lists if lst]
    
    if not valid_lists:
        return None
    
    if len(valid_lists) == 1:
        return valid_lists[0]
    
    # Proceed with merge...
```

### Tactic 5: Custom Comparator Pattern

For complex data types, use custom comparison:

```python
import heapq
from dataclasses import dataclass, field

@dataclass(order=True)
class HeapEntry:
    priority: int
    list_idx: int = field(compare=False)
    node: 'ListNode' = field(compare=False)

# Usage:
heap = []
for i, node in enumerate(lists):
    if node:
        heapq.heappush(heap, HeapEntry(node.val, i, node))
```

---

## Python Templates

### Template 1: Min-Heap Approach

```python
import heapq
from typing import List, Optional

class ListNode:
    def __init__(self, val: int = 0, next: Optional['ListNode'] = None):
        self.val = val
        self.next = next

def merge_k_lists(lists: List[Optional[ListNode]]) -> Optional[ListNode]:
    """
    Merge k sorted linked lists using min-heap.
    
    Time: O(N log k) where N is total elements, k is number of lists
    Space: O(k) for the heap
    """
    # Edge cases
    if not lists:
        return None
    
    # Initialize heap with first node from each list
    heap = []
    for i, node in enumerate(lists):
        if node:
            # (value, list_index, node) - list_index breaks ties
            heapq.heappush(heap, (node.val, i, node))
    
    # Dummy head for easier list construction
    dummy = ListNode(0)
    current = dummy
    
    # Process heap until empty
    while heap:
        val, i, node = heapq.heappop(heap)
        current.next = ListNode(val)
        current = current.next
        
        # Push next node from same list if exists
        if node.next:
            heapq.heappush(heap, (node.next.val, i, node.next))
    
    return dummy.next
```

### Template 2: Divide and Conquer Approach

```python
def merge_k_lists_divide_conquer(lists: List[Optional[ListNode]]) -> Optional[ListNode]:
    """
    Merge k sorted lists using divide and conquer.
    
    Time: O(N log k) 
    Space: O(log k) for recursion stack
    """
    if not lists:
        return None
    
    # Merge pairs iteratively until one list remains
    while len(lists) > 1:
        merged = []
        
        # Merge adjacent pairs
        for i in range(0, len(lists) - 1, 2):
            merged.append(merge_two_lists(lists[i], lists[i + 1]))
        
        # Handle odd number of lists
        if len(lists) % 2 == 1:
            merged.append(lists[-1])
        
        lists = merged
    
    return lists[0]

def merge_two_lists(l1: Optional[ListNode], l2: Optional[ListNode]) -> Optional[ListNode]:
    """Merge two sorted linked lists."""
    dummy = ListNode(0)
    current = dummy
    
    while l1 and l2:
        if l1.val <= l2.val:
            current.next = l1
            l1 = l1.next
        else:
            current.next = l2
            l2 = l2.next
        current = current.next
    
    # Attach remaining nodes
    current.next = l1 or l2
    return dummy.next
```

### Template 3: Kth Smallest Element

```python
def find_kth_smallest(lists: List[List[int]], k: int) -> Optional[int]:
    """
    Find kth smallest element across k sorted arrays.
    
    Time: O(k log k) to initialize + O(k log k) to extract k elements = O(k log k)
    Space: O(k) for heap
    """
    if not lists or k <= 0:
        return None
    
    # Initialize heap with first element from each array
    heap = []
    for i, arr in enumerate(lists):
        if arr:
            heapq.heappush(heap, (arr[0], i, 0))
    
    # Extract k-1 elements
    for _ in range(k - 1):
        if not heap:
            return None  # k is larger than total elements
        
        val, i, j = heapq.heappop(heap)
        
        # Push next element from same array
        if j + 1 < len(lists[i]):
            heapq.heappush(heap, (lists[i][j + 1], i, j + 1))
    
    # kth smallest is at heap top
    return heap[0][0] if heap else None
```

### Template 4: Merge K Sorted Arrays

```python
def merge_k_arrays(arrays: List[List[int]]) -> List[int]:
    """
    Merge k sorted arrays into one sorted array.
    
    Time: O(N log k) where N is total elements
    Space: O(k) for heap + O(N) for result
    """
    if not arrays:
        return []
    
    result = []
    heap = []
    
    # Initialize: (value, array_index, element_index)
    for i, arr in enumerate(arrays):
        if arr:
            heapq.heappush(heap, (arr[0], i, 0))
    
    # Process heap
    while heap:
        val, i, j = heapq.heappop(heap)
        result.append(val)
        
        # Push next element from same array
        if j + 1 < len(arrays[i]):
            heapq.heappush(heap, (arrays[i][j + 1], i, j + 1))
    
    return result
```

### Template 5: Smallest Range Covering K Lists

```python
def smallest_range(lists: List[List[int]]) -> List[int]:
    """
    Find smallest range that includes at least one element from each list.
    Uses min-heap to track current window.
    
    Time: O(N log k) where N is total elements
    Space: O(k)
    """
    if not lists:
        return []
    
    heap = []
    current_max = float('-inf')
    
    # Initialize heap and find initial max
    for i, lst in enumerate(lists):
        if lst:
            heapq.heappush(heap, (lst[0], i, 0))
            current_max = max(current_max, lst[0])
    
    best_range = [float('-inf'), float('inf')]
    
    while len(heap) == len(lists):  # All lists must contribute
        current_min, i, j = heapq.heappop(heap)
        
        # Update best range if current is smaller
        if current_max - current_min < best_range[1] - best_range[0]:
            best_range = [current_min, current_max]
        
        # Push next from same list
        if j + 1 < len(lists[i]):
            next_val = lists[i][j + 1]
            heapq.heappush(heap, (next_val, i, j + 1))
            current_max = max(current_max, next_val)
        else:
            break  # One list exhausted, can't get smaller range
    
    return best_range
```

---

## When to Use

Use the Merge K Sorted Lists algorithm when you need to solve problems involving:

- **Multiple Sorted Sequences**: When you need to merge or process multiple sorted arrays/lists efficiently
- **K-way Merge Problems**: When merging k sorted data sources into one sorted output
- **Finding Kth Smallest**: When finding the kth smallest element across multiple sorted structures
- **Priority Queue Applications**: When you need to repeatedly select the minimum/maximum from multiple sources

### Comparison with Alternatives

| Approach | Time Complexity | Space Complexity | Best Use Case |
|----------|----------------|-------------------|---------------|
| **Min-Heap / Priority Queue** | O(N log k) | O(k) | General purpose, streaming data |
| **Divide and Conquer** | O(N log k) | O(log k) | Linked lists, recursion-friendly |
| **Naive (merge one by one)** | O(N·k) | O(k) | Only when k is very small |
| **Brute Force** | O(N·k) | O(N) | When heap not available |

### When to Choose Each Approach

- **Choose Min-Heap** when:
  - You need to process elements as they come
  - Memory is a concern (O(k) space)
  - You're working with linked lists or arrays
  - You want the most straightforward solution

- **Choose Divide and Conquer** when:
  - Working with linked lists (can merge in-place)
  - You want to avoid heap overhead
  - Recursion is acceptable
  - k is a power of 2 (optimal pairing)

- **Choose Naive** when:
  - k is very small (k ≤ 2)
  - Simplicity is more important than efficiency
  - Memory is extremely constrained

---

## Algorithm Explanation

### Core Concept

The key insight behind the Merge K Sorted Lists algorithm is to **always have access to the smallest current element** from all k lists. By using a min-heap (priority queue), we can efficiently find and extract the minimum among k "pointers" (one per list) in O(log k) time.

### How It Works

#### Min-Heap Approach:

1. **Initialization**: Insert the first node from each of the k lists into the min-heap. Each heap element stores: (value, list_index, node_pointer).

2. **Extraction**: Repeatedly extract the minimum element from the heap - this is guaranteed to be the smallest among all current list heads.

3. **Insertion**: After extracting a node, push the next node from the same list into the heap (if one exists).

4. **Termination**: When the heap becomes empty, all nodes have been processed, and we have a fully merged sorted list.

#### Divide and Conquer Approach:

1. **Pair Up**: Merge lists pairwise (list[0] with list[1], list[2] with list[3], etc.)

2. **Recurse**: Apply the same merging process to the newly merged lists

3. **Base Case**: When only one list remains, return it

### Visual Representation

Given three sorted lists:
```
List 1: 1 → 4 → 7 → 10 → NULL
List 2: 2 → 5 → 8 → NULL
List 3: 3 → 6 → 9 → 11 → NULL
```

Min-Heap operations:
```
Step 1: Heap has [1(list1), 2(list2), 3(list3)] → Extract 1, add 4
Step 2: Heap has [2(list2), 3(list3), 4(list1)] → Extract 2, add 5
Step 3: Heap has [3(list3), 4(list1), 5(list2)] → Extract 3, add 6
... and so on until all merged

Final: 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9 → 10 → 11
```

### Why It Works

- **Heap Property**: The heap always maintains the smallest element at the top (O(1) access)
- **Incremental Processing**: Each element is processed exactly once in sorted order
- **Pointer Tracking**: By tracking which list each element came from, we know which list to advance
- **Comparison Efficiency**: Each insertion/extraction is O(log k), giving total O(N log k)

### Limitations

- **Memory Overhead**: Requires O(k) space for the heap
- **Random Access Required**: Must be able to advance each list independently
- **Sorted Input Required**: All input lists must be pre-sorted
- **No Early Termination**: For full merge, must process all N elements

---

## Practice Problems

### Problem 1: Merge K Sorted Lists (Classic)

**Problem:** [LeetCode 23 - Merge K Sorted Lists](https://leetcode.com/problems/merge-k-sorted-lists/)

**Description:** You are given an array of k linked-lists lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.

**How to Apply Merge K Sorted Lists:**
- Use min-heap to always extract the smallest current element
- Time complexity: O(N log k) where N = total elements, k = number of lists
- Space: O(k) for the heap

---

### Problem 2: Kth Smallest Element in Sorted Matrix

**Problem:** [LeetCode 378 - Kth Smallest Element in a Sorted Matrix](https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix/)

**Description:** Given an n x n matrix where each of the rows and columns is sorted in ascending order, return the kth smallest element in the matrix.

**How to Apply Merge K Sorted Lists:**
- Treat each row as a sorted list
- Use min-heap to find kth smallest in O(k log n) time
- Alternative: Binary search with count function

---

### Problem 3: Smallest Range Covering Elements from K Lists

**Problem:** [LeetCode 632 - Smallest Range Covering Elements from K Lists](https://leetcode.com/problems/smallest-range-covering-elements-from-k-lists/)

**Description:** You have k lists of sorted integers in non-decreasing order. Find the smallest range that contains at least one number from each of the k lists.

**How to Apply Merge K Sorted Lists:**
- Use min-heap to maintain current window
- Track current maximum separately
- Update range when smaller range found

---

### Problem 4: Find Median from Data Stream

**Problem:** [LeetCode 295 - Find Median from Data Stream](https://leetcode.com/problems/find-median-from-data-stream/)

**Description:** Design a data structure that supports adding a num from data stream and finding the median of all elements so far.

**How to Apply Merge K Sorted Lists:**
- Use two heaps: min-heap for upper half, max-heap for lower half
- Balance heaps to ensure median is at heap tops
- This is a direct application of heap-based selection

---

### Problem 5: Top K Frequent Elements

**Problem:** [LeetCode 347 - Top K Frequent Elements](https://leetcode.com/problems/top-k-frequent-elements/)

**Description:** Given an integer array nums and an integer k, return the k most frequent elements.

**How to Apply Merge K Sorted Lists:**
- Use heap to efficiently select top k elements
- First count frequencies, then use min-heap to extract k most frequent
- Time: O(N log k) for heap operations

---

## Video Tutorial Links

### Fundamentals

- [Merge K Sorted Lists - LeetCode Solution (Take U Forward)](https://www.youtube.com/watch?v=z5R1R4E6y8I) - Comprehensive explanation with multiple approaches
- [Priority Queue / Min Heap Approach (NeetCode)](https://www.youtube.com/watch?v=3WaxQMELSkw) - Detailed min-heap implementation
- [Divide and Conquer Approach (WilliamFiset)](https://www.youtube.com/watch?v=pmKjNCBelJo) - Alternative approach explanation

### Related Topics

- [Heap Data Structure Complete Guide](https://www.youtube.com/watch?v=11X5tO9A3xE) - Understanding heaps
- [Priority Queue Implementation](https://www.youtube.com/watch?v=EnZFg8jZ6l0) - How priority queues work
- [K-way Merge Pattern](https://www.youtube.com/watch?v=8g1P5z9iT4U) - General k-way merge technique

---

## Follow-up Questions

### Q1: What if some lists are much longer than others?

**Answer:** The min-heap approach handles this naturally. Shorter lists will exhaust their elements sooner, and only the remaining non-empty lists will continue to contribute to the heap. The time complexity remains O(N log k) regardless of list length distribution.

### Q2: Can you do better than O(N log k)?

**Answer:** No, Ω(N log k) is optimal for comparison-based merging because:
- Each element must be compared at least once to determine order
- With k lists, each comparison can only eliminate one candidate
- However, if data has special properties (e.g., bounded integer range), counting sort variants can achieve O(N)

### Q3: How would you handle very large files that don't fit in memory?

**Answer:** Use external merge sort:
1. Split files into chunks that fit in memory
2. Sort each chunk individually
3. Use heap-based k-way merge to merge sorted chunks
4. Write output to disk incrementally

### Q4: What if you need to merge arrays instead of linked lists?

**Answer:** The approach is identical! Simply replace the linked list node access (`node.next`) with array index access (`arr[index + 1]`). The algorithmic complexity remains the same.

### Q5: When should you choose divide and conquer over heap-based approach?

**Answer:** Choose divide and conquer when:
- Working with linked lists (can merge in-place without extra space)
- Memory is very constrained (O(log k) vs O(k) space)
- You want to avoid heap overhead
- The number of lists is a power of 2 (optimal pairing)

---

## Summary

The Merge K Sorted Lists algorithm is a fundamental heap-based problem that demonstrates the power of priority queues for merging multiple sorted sequences. Key takeaways:

- **Min-Heap Approach**: O(N log k) time, O(k) space - most intuitive and commonly used
- **Divide and Conquer**: O(N log k) time, O(log k) space - better for linked lists
- **Core Pattern**: Always extract minimum from k sources using a heap
- **Generalization**: This pattern applies to any k-way merge problem

When to use:
- ✅ Multiple sorted sequences that need merging
- ✅ Finding kth smallest/largest across sorted data
- ✅ Stream processing with multiple sources
- ❌ When data is unsorted (need to sort first)
- ❌ When k = 1 (use simple traversal)

This algorithm is essential for understanding heap-based problem solving and frequently appears in technical interviews and competitive programming.
