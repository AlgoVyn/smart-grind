# Heap Sort

## Category
Sorting Algorithms

## Description

Heap Sort is a comparison-based sorting algorithm that uses a binary heap data structure. It has O(n log n) time complexity in all cases and O(1) auxiliary space complexity, making it efficient for memory-constrained environments. Unlike Quick Sort, it guarantees O(n log n) performance without worst-case degradation.

The algorithm works in two phases: first, it builds a max-heap from the input array; then it repeatedly extracts the maximum element and places it at the end of the array. The in-place nature of heap sort, combined with its consistent performance, makes it particularly useful for sorting large datasets and for implementing priority queues.

---

## Concepts

Heap Sort relies on the binary heap data structure and several fundamental concepts.

### 1. Binary Heap Structure

A complete binary tree satisfying heap property:

| Property | Max-Heap | Min-Heap |
|----------|----------|----------|
| **Parent vs Child** | Parent ≥ Children | Parent ≤ Children |
| **Root** | Maximum element | Minimum element |
| **Use in Sort** | Ascending order | Descending order |

### 2. Array Representation

Heaps are efficiently stored as arrays:

```
For node at index i (0-indexed):
  - Parent: (i - 1) // 2
  - Left child: 2*i + 1
  - Right child: 2*i + 2
```

### 3. Heap Operations

Core operations for heap sort:

| Operation | Time | Description |
|-----------|------|-------------|
| **Heapify (sift down)** | O(log n) | Restore heap property at node |
| **Build Heap** | O(n) | Convert array to heap |
| **Extract Max** | O(log n) | Remove and return root, restore heap |

### 4. Complete Binary Tree Properties

| Property | Formula |
|----------|---------|
| **Last non-leaf node** | n//2 - 1 |
| **Height** | ⌊log₂n⌋ |
| **Leaves** | ⌈n/2⌉ to n-1 |

---

## Frameworks

Structured approaches for implementing heap sort.

### Framework 1: Standard Heap Sort

```
┌─────────────────────────────────────────────────────────────┐
│  STANDARD HEAP SORT FRAMEWORK                                │
├─────────────────────────────────────────────────────────────┤
│  Input: Array of n elements                                 │
│  Output: Sorted array (ascending with max-heap)              │
│                                                             │
│  1. Build Max Heap:                                         │
│     for i = n//2 - 1 down to 0:                           │
│         heapify(arr, n, i)                                  │
│                                                             │
│  2. Extract elements one by one:                            │
│     for i = n-1 down to 1:                                 │
│         swap(arr[0], arr[i])  # Move max to end            │
│         heapify(arr, i, 0)    # Heapify reduced heap       │
│                                                             │
│  3. Return sorted array                                     │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Standard heap sort implementation.

### Framework 2: Heapify Operation

```
┌─────────────────────────────────────────────────────────────┐
│  HEAPIFY (SIFT DOWN) FRAMEWORK                               │
├─────────────────────────────────────────────────────────────┤
│  Restore heap property at index i assuming subtrees are valid │
│                                                             │
│  function heapify(arr, n, i):                               │
│      largest = i  # Initialize largest as root              │
│      left = 2*i + 1                                         │
│      right = 2*i + 2                                        │
│                                                             │
│      if left < n and arr[left] > arr[largest]:             │
│          largest = left                                    │
│                                                             │
│      if right < n and arr[right] > arr[largest]:           │
│          largest = right                                   │
│                                                             │
│      if largest != i:                                       │
│          swap(arr[i], arr[largest])                        │
│          heapify(arr, n, largest)  # Recursively heapify   │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Restoring heap property after modification.

### Framework 3: Sorting Algorithm Decision

```
┌─────────────────────────────────────────────────────────────┐
│  CHOOSING HEAP SORT                                          │
├─────────────────────────────────────────────────────────────┤
│  Use Heap Sort when:                                         │
│    ✓ Guaranteed O(n log n) required (no worst-case O(n²)) │
│    ✓ Memory is limited (O(1) extra space)                   │
│    ✓ Sorting data streams/partially available               │
│    ✓ External sorting needed                                  │
│    ✓ Priority queue operations combined with sorting         │
│                                                             │
│  Don't use when:                                             │
│    ✗ Stability is required (heap sort is not stable)        │
│    ✗ Data is nearly sorted (insertion sort faster)          │
│    ✗ Constant factors matter (quick sort often faster)      │
│    ✗ Simplest implementation preferred                      │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Deciding on heap sort vs alternatives.

---

## Forms

Different manifestations and variations of heap sort.

### Form 1: Max-Heap Sort (Ascending)

Standard implementation for ascending order.

| Phase | Operation | Result |
|-------|-----------|--------|
| **Build** | Create max-heap | Largest at root |
| **Extract** | Move root to end | Sorted from right |
| **Repeat** | Heapify remaining | Fully sorted |

### Form 2: Min-Heap Sort (Descending)

Using min-heap for descending order.

```python
def heap_sort_descending(arr):
    """Sort in descending order using min-heap."""
    # Similar to max-heap but with reversed comparisons
    # Or simply reverse the result of max-heap sort
    pass
```

### Form 3: Iterative Heapify

Non-recursive sift-down for better performance.

```python
def heapify_iterative(arr, n, i):
    """Iterative heapify to avoid recursion overhead."""
    while True:
        largest = i
        left = 2 * i + 1
        right = 2 * i + 2
        
        if left < n and arr[left] > arr[largest]:
            largest = left
        if right < n and arr[right] > arr[largest]:
            largest = right
        
        if largest == i:
            break
        
        arr[i], arr[largest] = arr[largest], arr[i]
        i = largest
```

### Form 4: Bottom-Up Heap Construction

Alternative build-heap approach.

| Method | Time | Approach |
|--------|------|----------|
| **Top-down** | O(n log n) | Insert elements one by one |
| **Bottom-up** | O(n) | Heapify from last non-leaf |

### Form 5: In-Place vs Not In-Place

Heap sort is naturally in-place.

| Variant | Space | Use Case |
|---------|-------|----------|
| **In-place** | O(1) | Standard, memory constrained |
| **Using heapq** | O(n) | When Python's heapq preferred |

---

## Tactics

Specific techniques and optimizations for heap sort.

### Tactic 1: Recursive Heapify

Standard implementation:

```python
def heapify(arr, n, i):
    """Restore heap property at index i."""
    largest = i
    left = 2 * i + 1
    right = 2 * i + 2
    
    # Find largest among root, left, right
    if left < n and arr[left] > arr[largest]:
        largest = left
    if right < n and arr[right] > arr[largest]:
        largest = right
    
    # If largest is not root, swap and continue
    if largest != i:
        arr[i], arr[largest] = arr[largest], arr[i]
        heapify(arr, n, largest)
```

### Tactic 2: Iterative Heapify

Avoid recursion overhead:

```python
def heapify_iterative(arr, n, i):
    """Iterative version of heapify."""
    while True:
        largest = i
        left = 2 * i + 1
        right = 2 * i + 2
        
        if left < n and arr[left] > arr[largest]:
            largest = left
        if right < n and arr[right] > arr[largest]:
            largest = right
        
        if largest == i:
            break
        
        arr[i], arr[largest] = arr[largest], arr[i]
        i = largest
```

### Tactic 3: Build Heap in O(n)

Bottom-up construction:

```python
def build_heap(arr):
    """Build max heap in O(n) time."""
    n = len(arr)
    # Start from last non-leaf node
    for i in range(n // 2 - 1, -1, -1):
        heapify(arr, n, i)
```

**Why O(n) not O(n log n)?**: Most nodes are at lower levels with smaller heights.

### Tactic 4: Python Heapq for Convenience

Using built-in when performance not critical:

```python
import heapq

def heap_sort_pq(arr):
    """Sort using heapq (less efficient, O(n) space)."""
    heapq.heapify(arr)  # O(n)
    return [heapq.heappop(arr) for _ in range(len(arr))]  # O(n log n)
```

### Tactic 5: Stability Consideration

Making heap sort stable (with trade-offs):

```python
def stable_heap_sort(arr):
    """
    Stable heap sort by pairing elements with indices.
    Break ties using original position.
    """
    # Create pairs of (value, index)
    indexed = [(x, i) for i, x in enumerate(arr)]
    
    # Sort by value, then by index
    # This requires modified comparison in heapify
    # ... implementation details
    
    # Extract just the values
    return [x for x, i in indexed]
```

---

## Python Templates

### Template 1: Complete Heap Sort

```python
def heap_sort(arr):
    """
    In-place heap sort using max-heap.
    Sorts array in ascending order.
    
    Time: O(n log n) all cases
    Space: O(1) auxiliary
    
    Not stable.
    """
    n = len(arr)
    
    # Build max heap
    for i in range(n // 2 - 1, -1, -1):
        _heapify(arr, n, i)
    
    # Extract elements one by one
    for i in range(n - 1, 0, -1):
        # Move current root (max) to end
        arr[0], arr[i] = arr[i], arr[0]
        # Heapify reduced heap
        _heapify(arr, i, 0)
    
    return arr

def _heapify(arr, n, i):
    """Helper function to heapify subtree rooted at index i."""
    largest = i
    left = 2 * i + 1
    right = 2 * i + 2
    
    # Find largest among root, left child, right child
    if left < n and arr[left] > arr[largest]:
        largest = left
    
    if right < n and arr[right] > arr[largest]:
        largest = right
    
    # If largest is not root, swap and continue
    if largest != i:
        arr[i], arr[largest] = arr[largest], arr[i]
        _heapify(arr, n, largest)
```

### Template 2: Iterative Heapify

```python
def heap_sort_iterative(arr):
    """
    Heap sort with iterative heapify.
    Avoids recursion overhead.
    """
    n = len(arr)
    
    # Build max heap
    for i in range(n // 2 - 1, -1, -1):
        _heapify_iterative(arr, n, i)
    
    # Extract elements
    for i in range(n - 1, 0, -1):
        arr[0], arr[i] = arr[i], arr[0]
        _heapify_iterative(arr, i, 0)
    
    return arr

def _heapify_iterative(arr, n, i):
    """Iterative heapify implementation."""
    while True:
        largest = i
        left = 2 * i + 1
        right = 2 * i + 2
        
        if left < n and arr[left] > arr[largest]:
            largest = left
        if right < n and arr[right] > arr[largest]:
            largest = right
        
        if largest == i:
            break
        
        arr[i], arr[largest] = arr[largest], arr[i]
        i = largest
```

### Template 3: Heap Sort with Custom Comparison

```python
def heap_sort_custom(arr, key=lambda x: x):
    """
    Heap sort with custom key function.
    Sorts based on key values.
    """
    n = len(arr)
    
    # Build max heap based on key
    for i in range(n // 2 - 1, -1, -1):
        _heapify_custom(arr, n, i, key)
    
    # Extract elements
    for i in range(n - 1, 0, -1):
        arr[0], arr[i] = arr[i], arr[0]
        _heapify_custom(arr, i, 0, key)
    
    return arr

def _heapify_custom(arr, n, i, key):
    """Heapify with custom comparison key."""
    largest = i
    left = 2 * i + 1
    right = 2 * i + 2
    
    if left < n and key(arr[left]) > key(arr[largest]):
        largest = left
    if right < n and key(arr[right]) > key(arr[largest]):
        largest = right
    
    if largest != i:
        arr[i], arr[largest] = arr[largest], arr[i]
        _heapify_custom(arr, n, largest, key)
```

### Template 4: Min-Heap Sort (Descending)

```python
def heap_sort_descending(arr):
    """
    Sort in descending order using min-heap.
    """
    n = len(arr)
    
    # Build min heap
    for i in range(n // 2 - 1, -1, -1):
        _heapify_min(arr, n, i)
    
    # Extract elements
    for i in range(n - 1, 0, -1):
        arr[0], arr[i] = arr[i], arr[0]
        _heapify_min(arr, i, 0)
    
    return arr

def _heapify_min(arr, n, i):
    """Heapify for min-heap."""
    smallest = i
    left = 2 * i + 1
    right = 2 * i + 2
    
    if left < n and arr[left] < arr[smallest]:
        smallest = left
    if right < n and arr[right] < arr[smallest]:
        smallest = right
    
    if smallest != i:
        arr[i], arr[smallest] = arr[smallest], arr[i]
        _heapify_min(arr, n, smallest)
```

### Template 5: Build Heap Only

```python
def build_max_heap(arr):
    """
    Convert array to max heap in O(n) time.
    Does not sort, just builds heap structure.
    """
    n = len(arr)
    for i in range(n // 2 - 1, -1, -1):
        _heapify(arr, n, i)
    return arr

def is_max_heap(arr):
    """Check if array satisfies max-heap property."""
    n = len(arr)
    for i in range(n):
        left = 2 * i + 1
        right = 2 * i + 2
        if left < n and arr[left] > arr[i]:
            return False
        if right < n and arr[right] > arr[i]:
            return False
    return True
```

### Template 6: Using Python Heapq

```python
import heapq

def heap_sort_builtin(arr):
    """
    Sort using Python's heapq module.
    Less space efficient but simpler.
    """
    # Create a copy to avoid modifying original
    heap = arr[:]
    heapq.heapify(heap)  # O(n)
    
    # Extract elements
    result = []
    while heap:
        result.append(heapq.heappop(heap))
    
    return result

# For in-place with heapq (not truly in-place)
def heap_sort_builtin_inplace(arr):
    """Simulate in-place sorting with heapq."""
    heapq.heapify(arr)
    for i in range(len(arr)):
        arr[i] = heapq.heappop(arr)
    return arr
```

---

## When to Use

Use Heap Sort when you need:

- **Guaranteed O(n log n)**: No worst-case O(n²) like quick sort
- **Memory Constraints**: Only O(1) extra space needed
- **Sorting Streams**: Can sort as data arrives
- **External Sorting**: Good for data that doesn't fit in memory
- **Priority Queue Operations**: When sort and priority ops combined

### Comparison with Alternatives

| Algorithm | Time (Best/Avg/Worst) | Space | Stable | Cache |
|-----------|----------------------|-------|--------|-------|
| **Heap Sort** | O(n log n) / O(n log n) / O(n log n) | O(1) | No | Poor |
| **Quick Sort** | O(n log n) / O(n log n) / O(n²) | O(log n) | No | Good |
| **Merge Sort** | O(n log n) / O(n log n) / O(n log n) | O(n) | Yes | Good |
| **Tim Sort** | O(n) / O(n log n) / O(n log n) | O(n) | Yes | Excellent |

### When to Choose Heap Sort vs Other Algorithms

- **Choose Heap Sort** when:
  - Worst-case O(n log n) is required
  - Memory is severely limited
  - Sorting external data
  - Guaranteed performance needed

- **Choose Quick Sort** when:
  - Average-case performance matters most
  - Memory not severely constrained
  - Cache performance important

- **Choose Merge Sort** when:
  - Stability is required
  - Linked list sorting
  - External merge sort needed

---

## Algorithm Explanation

### Core Concept

Heap Sort uses a binary heap to efficiently select the maximum (or minimum) element. The heap structure allows O(log n) extraction of the extremum and O(log n) restoration of the heap property.

**Key Terminology**:
- **Heap**: Complete binary tree with heap ordering property
- **Max-Heap**: Parent ≥ children, root is maximum
- **Min-Heap**: Parent ≤ children, root is minimum
- **Heapify**: Restore heap property at a node
- **Complete binary tree**: All levels full except possibly last

### How It Works

#### Step 1: Build Max Heap

```python
for i in range(n//2 - 1, -1, -1):
    heapify(arr, n, i)

# Process from last non-leaf up to root
```

#### Step 2: Extract Elements

```python
for i in range(n-1, 0, -1):
    arr[0], arr[i] = arr[i], arr[0]  # Move max to end
    heapify(arr, i, 0)               # Heapify reduced heap
```

#### Step 3: Heapify (Sift Down)

```python
def heapify(arr, n, i):
    largest = i
    left, right = 2*i + 1, 2*i + 2
    
    if left < n and arr[left] > arr[largest]:
        largest = left
    if right < n and arr[right] > arr[largest]:
        largest = right
    
    if largest != i:
        swap(arr[i], arr[largest])
        heapify(arr, n, largest)
```

### Visual Walkthrough

**Example: Sort [4, 10, 3, 5, 1]**

```
Step 1: Build Max Heap
Initial: [4, 10, 3, 5, 1]

Heapify from index 1 (value 10):
  Children at 3, 4: values 5, 1
  10 > 5, 10 > 1: no change

Heapify from index 0 (value 4):
  Children at 1, 2: values 10, 3
  10 is largest, swap with 4
  Array: [10, 4, 3, 5, 1]
  Recursively heapify index 1 (now 4):
    Children at 3, 4: values 5, 1
    5 > 4, swap
    Array: [10, 5, 3, 4, 1]
    
Max Heap: [10, 5, 3, 4, 1]

Step 2: Extract Elements
Extract 10: swap with last (1)
  [1, 5, 3, 4, 10], heapify size 4
  Heapify at 0: children 5, 3 → 5 largest
  Swap 1 and 5: [5, 1, 3, 4, 10]
  Recursively heapify at 1: children 4 → 4 > 1
  Swap: [5, 4, 3, 1, 10]

Extract 5: swap with 1
  [1, 4, 3, 5, 10], heapify size 3
  ... continue

Final: [1, 3, 4, 5, 10]
```

### Why Heap Sort Works

1. **Heap Property**: Root is always maximum (for max-heap)
2. **Complete Tree**: Efficient array representation
3. **Heapify**: O(log n) to restore after extraction
4. **In-Place**: Reuses array for both heap and sorted output

### Limitations

- **Not Stable**: Equal elements may change relative order
- **Poor Cache Performance**: Jumps around memory (not sequential)
- **Slower in Practice**: Higher constant factor than quick sort
- **Complex Implementation**: More code than quick/insertion sort

---

## Practice Problems

### Problem 1: Sort an Array

**Problem:** [LeetCode 912 - Sort an Array](https://leetcode.com/problems/sort-an-array/)

**Description:** Sort array using any O(n log n) algorithm.

**How to Apply:**
- Implement heap sort
- Or use for comparison with other sorts

---

### Problem 2: Kth Largest Element

**Problem:** [LeetCode 215 - Kth Largest Element in an Array](https://leetcode.com/problems/kth-largest-element-in-an-array/)

**Description:** Find kth largest element without fully sorting.

**How to Apply:**
- Build min-heap of size k
- Or use max-heap and extract k times

---

### Problem 3: Top K Frequent Elements

**Problem:** [LeetCode 347 - Top K Frequent Elements](https://leetcode.com/problems/top-k-frequent-elements/)

**Description:** Return k most frequent elements.

**How to Apply:**
- Use heap with frequency counts
- Or bucket sort approach

---

### Problem 4: Find Median from Data Stream

**Problem:** [LeetCode 295 - Find Median from Data Stream](https://leetcode.com/problems/find-median-from-data-stream/)

**Description:** Design data structure for median queries.

**How to Apply:**
- Two heaps: max-heap for lower half, min-heap for upper half

---

### Problem 5: Sliding Window Median

**Problem:** [LeetCode 480 - Sliding Window Median](https://leetcode.com/problems/sliding-window-median/)

**Description:** Find median of each sliding window.

**How to Apply:**
- Lazy deletion with two heaps
- Or sorted list with binary search

---

### Problem 6: Meeting Rooms II

**Problem:** [LeetCode 253 - Meeting Rooms II](https://leetcode.com/problems/meeting-rooms-ii/)

**Description:** Find minimum meeting rooms needed.

**How to Apply:**
- Sort by start time, use min-heap for end times
- Or use sweep line algorithm

---

## Video Tutorial Links

### Fundamentals

- [Heap Sort - Abdul Bari](https://www.youtube.com/watch?v=MtQL_ll5KhQ) - Visual explanation
- [Heap Data Structure - William Fiset](https://www.youtube.com/watch?v=t0Cq6tVNRBA) - Foundation
- [Sorting Algorithms Comparison](https://www.youtube.com/watch?v=MtQL_ll5KhQ) - When to use heap

### Problem Solving

- [Kth Element with Heap](https://www.youtube.com/watch?v=MtQL_ll5KhQ) - Heap applications
- [Median from Data Stream](https://www.youtube.com/watch?v=MtQL_ll5KhQ) - Two heaps pattern
- [Heap Sort Implementation](https://www.youtube.com/watch?v=MtQL_ll5KhQ) - Code walkthrough

---

## Follow-up Questions

### Q1: Why is heap sort not stable?

**Answer:**
- **Definition**: Stable sort maintains relative order of equal elements
- **Why unstable**: Heap operations swap distant elements
- **Example**: [2a, 1, 2b] → heapify might swap 2a with 1, then 2b position changes
- **Fix**: Pair elements with indices, sort by (value, index)

---

### Q2: Why does build heap run in O(n) not O(n log n)?

**Answer:**
- **Height argument**: Most nodes are leaves or near leaves
- **Leaf nodes**: n/2 nodes, heapify is O(1)
- **Level i**: At most ⌈n/2^(i+1)⌉ nodes, each O(i)
- **Sum**: Σ(i=0 to log n) ⌈n/2^(i+1)⌉ × O(i) = O(n)
- **Intuition**: Lower nodes are cheaper to heapify

---

### Q3: How does heap sort compare to using heapq in Python?

**Answer:**
- **heapq**: Higher level, easier to use, O(n) space
- **Manual heap sort**: O(1) space, more control
- **Performance**: Manual implementation often faster
- **When to use heapq**: Quick implementation, priority queue ops
- **When to implement**: Learning, memory constraints, optimization

---

### Q4: Can heap sort be parallelized?

**Answer:**
- **Build heap**: Limited parallelism due to dependencies
- **Extract phase**: Sequential by nature
- **Heapify**: Could parallelize independent subtrees
- **Limited benefit**: Not naturally parallel algorithm
- **Better parallel sorts**: Sample sort, parallel merge sort

---

### Q5: When should you use heap sort over quick sort?

**Answer:**
- **Guaranteed O(n log n)**: Heap when worst-case matters
- **Memory**: Heap needs O(1), quick needs O(log n) stack
- **External sort**: Heap better for disk-based sorting
- **Quick sort wins**: Cache performance, average case, simplicity
- **Hybrid**: Many libraries use introsort (quick + heap fallback)

---

## Summary

Heap Sort is a reliable O(n log n) sorting algorithm with O(1) space. Key takeaways:

1. **Structure**: Complete binary tree stored as array
2. **Build**: O(n) time to create heap
3. **Extract**: O(log n) per element extraction
4. **Total**: O(n log n) time, O(1) space
5. **Not stable**: Equal elements may swap positions

**When to Use**:
- Worst-case O(n log n) required
- Memory severely constrained
- External sorting
- Guaranteed performance needed

**Implementation Tips**:
- Remember 0-indexed formulas: children at 2i+1, 2i+2
- Build heap bottom-up for O(n)
- Consider iterative heapify for deep trees
- Use heapq for convenience when space allows

This algorithm is essential for understanding heaps and their applications in priority queues.
