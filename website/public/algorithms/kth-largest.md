# Kth Largest Element

## Category
Heap / Priority Queue

## Description

The **Kth Largest Element** problem asks us to find the k-th largest element in an unsorted array. This is a fundamental problem that appears frequently in interviews and competitive programming. There are several approaches to solve this problem, each with different time and space trade-offs.

The key challenge is finding the k-th largest without fully sorting the array, which would be inefficient for large datasets. This problem demonstrates important algorithmic techniques including heap-based optimization and divide-and-conquer strategies. Understanding when to use each approach is crucial for efficient problem solving.

---

## Concepts

The Kth Largest problem is built on several fundamental concepts from data structures and algorithms.

### 1. Order Statistics

Order statistics deal with finding elements at specific positions in a collection.

| Statistic | Definition | Relation to k-th Largest |
|-----------|------------|--------------------------|
| Minimum | 1st smallest | (n-1)-th largest |
| Maximum | n-th smallest | 1st largest |
| Median | n/2-th smallest | n/2-th largest |
| k-th Largest | k-th from top | (n-k+1)-th smallest |

### 2. Heap Properties

Heaps provide efficient access to min/max elements.

| Heap Type | Top Element | Use for k-th |
|-----------|-------------|--------------|
| Min Heap | Smallest | k-th largest (size k) |
| Max Heap | Largest | k-th smallest (size k) |

### 3. Partition-Based Selection

Quickselect uses partitioning similar to quicksort.

| Approach | Time (Average) | Time (Worst) | Space |
|----------|---------------|--------------|-------|
| Quickselect | O(n) | O(n²) | O(1) |
| Heaps | O(n log k) | O(n log k) | O(k) |
| Sorting | O(n log n) | O(n log n) | O(1) |

---

## Frameworks

### Framework 1: Min Heap of Size k

```
┌─────────────────────────────────────────────────────┐
│  MIN HEAP (SIZE K) FRAMEWORK                        │
├─────────────────────────────────────────────────────┤
│  1. Initialize empty min heap                       │
│  2. For each element in array:                      │
│     a. Push element onto heap                       │
│     b. If heap size > k: pop smallest               │
│  3. Return heap top (k-th largest)                 │
│                                                     │
│  Invariant: Heap always contains k largest seen    │
│  Heap top = smallest among k largest = k-th largest │
└─────────────────────────────────────────────────────┘
```

**When to use**: k << n, streaming data, guaranteed O(n log k).

### Framework 2: Quickselect (Average O(n))

```
┌─────────────────────────────────────────────────────┐
│  QUICKSELECT FRAMEWORK                              │
├─────────────────────────────────────────────────────┤
│  Goal: Find (n-k)-th smallest element               │
│                                                     │
│  1. Convert: target = n - k (0-indexed)             │
│  2. Partition array around pivot                  │
│  3. If pivot_index == target: return element      │
│  4. If pivot_index < target: recurse right        │
│  5. If pivot_index > target: recurse left          │
│                                                     │
│  Optimization: Only recurse one side (unlike sort) │
└─────────────────────────────────────────────────────┘
```

**When to use**: Space critical, average O(n) preferred, can tolerate worst case.

### Framework 3: Max Heap of All Elements

```
┌─────────────────────────────────────────────────────┐
│  MAX HEAP (ALL ELEMENTS) FRAMEWORK                  │
├─────────────────────────────────────────────────────┤
│  1. Build max heap from all elements: O(n)          │
│  2. Extract max (k-1) times: O(k log n)           │
│  3. Return next max (k-th largest)                  │
│                                                     │
│  Best when: k is close to n (more efficient)      │
└─────────────────────────────────────────────────────┘
```

**When to use**: k close to n, or when you need top-k elements.

---

## Forms

### Form 1: k-th Largest (Standard)

Find the element at position k when sorted in descending order.

| Approach | Time | Space | Best When |
|----------|------|-------|-----------|
| Min Heap (size k) | O(n log k) | O(k) | k << n |
| Quickselect | O(n) avg | O(1) | Space critical |
| Sorting | O(n log n) | O(1) | Simplicity |

### Form 2: k-th Smallest

Find the element at position k when sorted in ascending order.

| Approach | Modification from Largest |
|----------|--------------------------|
| Min Heap | Use max heap of size k |
| Quickselect | target = k-1 (0-indexed) |
| Sorting | Return nums[k-1] after sort |

### Form 3: Top k Elements

Return all k largest elements, not just the k-th.

| Approach | Output |
|----------|--------|
| Min Heap (size k) | Heap contents (sort if needed) |
| Partial sort | First k elements |
| Quickselect variant | Partitioned array |

### Form 4: k-th Largest in Stream

Process elements one at a time, maintain k-th largest seen so far.

| Property | Value |
|----------|-------|
| Data structure | Min heap of size k |
| Per element | O(log k) |
| Query | O(1) - heap top |

### Form 5: k-th Largest in 2D Matrix

Find k-th smallest/largest in a row-column sorted matrix.

| Approach | Time | Space |
|----------|------|-------|
| Min heap with pointers | O(k log n) | O(n) |
| Binary search | O(n log(max-min)) | O(1) |

---

## Tactics

### Tactic 1: Min Heap for k-th Largest

```python
import heapq

def kth_largest(nums, k):
    """Min heap approach - O(n log k) time, O(k) space."""
    min_heap = []
    for num in nums:
        heapq.heappush(min_heap, num)
        if len(min_heap) > k:
            heapq.heappop(min_heap)
    return min_heap[0]
```

### Tactic 2: Max Heap for k-th Smallest

```python
def kth_smallest(nums, k):
    """Max heap approach - O(n log k) time, O(k) space."""
    max_heap = [-num for num in nums[:k]]
    heapq.heapify(max_heap)
    
    for num in nums[k:]:
        if -num > max_heap[0]:
            heapq.heapreplace(max_heap, -num)
    
    return -max_heap[0]
```

### Tactic 3: Quickselect Partition

```python
def partition(nums, left, right, pivot_idx):
    """Lomuto partition scheme."""
    pivot = nums[pivot_idx]
    # Move pivot to end
    nums[pivot_idx], nums[right] = nums[right], nums[pivot_idx]
    
    store_idx = left
    for i in range(left, right):
        if nums[i] < pivot:
            nums[store_idx], nums[i] = nums[i], nums[store_idx]
            store_idx += 1
    
    # Move pivot to final place
    nums[right], nums[store_idx] = nums[store_idx], nums[right]
    return store_idx
```

### Tactic 4: Randomized Quickselect

```python
import random

def quickselect(nums, k):
    """Randomized quickselect for k-th smallest."""
    def select(left, right, k_smallest):
        if left == right:
            return nums[left]
        
        # Random pivot
        pivot_idx = random.randint(left, right)
        pivot_idx = partition(nums, left, right, pivot_idx)
        
        if k_smallest == pivot_idx:
            return nums[k_smallest]
        elif k_smallest < pivot_idx:
            return select(left, pivot_idx - 1, k_smallest)
        else:
            return select(pivot_idx + 1, right, k_smallest)
    
    return select(0, len(nums) - 1, k - 1)
```

### Tactic 5: Streaming k-th Largest Class

```python
import heapq

class KthLargest:
    """Stream processor for k-th largest."""
    
    def __init__(self, k, nums):
        self.k = k
        self.min_heap = []
        for num in nums:
            self.add(num)
    
    def add(self, val):
        """Add new element and return current k-th largest."""
        heapq.heappush(self.min_heap, val)
        if len(self.min_heap) > self.k:
            heapq.heappop(self.min_heap)
        return self.min_heap[0]
```

---

## Python Templates

### Template 1: Min Heap Approach (k-th Largest)

```python
import heapq
from typing import List

def find_kth_largest(nums: List[int], k: int) -> int:
    """
    Find k-th largest using min heap of size k.
    
    Time: O(n log k)
    Space: O(k)
    
    Args:
        nums: List of integers
        k: 1-indexed position (k=1 means largest)
    
    Returns:
        The k-th largest element
    """
    if not nums or k < 1 or k > len(nums):
        raise ValueError("Invalid input")
    
    min_heap = []
    
    for num in nums:
        heapq.heappush(min_heap, num)
        if len(min_heap) > k:
            heapq.heappop(min_heap)
    
    return min_heap[0]
```

### Template 2: Quickselect (Average O(n))

```python
import random
from typing import List

def find_kth_largest_quickselect(nums: List[int], k: int) -> int:
    """
    Find k-th largest using quickselect.
    
    Time: O(n) average, O(n²) worst case
    Space: O(1) - in-place
    
    Args:
        nums: List of integers (modified in-place)
        k: 1-indexed position
    
    Returns:
        The k-th largest element
    """
    if not nums or k < 1 or k > len(nums):
        raise ValueError("Invalid input")
    
    # Convert to (n-k)-th smallest problem
    target = len(nums) - k
    
    def partition(left: int, right: int, pivot_idx: int) -> int:
        pivot = nums[pivot_idx]
        nums[pivot_idx], nums[right] = nums[right], nums[pivot_idx]
        
        store_idx = left
        for i in range(left, right):
            if nums[i] < pivot:
                nums[store_idx], nums[i] = nums[i], nums[store_idx]
                store_idx += 1
        
        nums[right], nums[store_idx] = nums[store_idx], nums[right]
        return store_idx
    
    def select(left: int, right: int, k_smallest: int) -> int:
        if left == right:
            return nums[left]
        
        # Random pivot for good average case
        pivot_idx = random.randint(left, right)
        pivot_idx = partition(left, right, pivot_idx)
        
        if k_smallest == pivot_idx:
            return nums[k_smallest]
        elif k_smallest < pivot_idx:
            return select(left, pivot_idx - 1, k_smallest)
        else:
            return select(pivot_idx + 1, right, k_smallest)
    
    return select(0, len(nums) - 1, target)
```

### Template 3: Max Heap Approach (k Close to n)

```python
import heapq
from typing import List

def find_kth_largest_max_heap(nums: List[int], k: int) -> int:
    """
    Find k-th largest using max heap (all elements).
    
    Time: O(n + k log n)
    Space: O(n)
    
    Best when k is close to n.
    """
    if not nums or k < 1 or k > len(nums):
        raise ValueError("Invalid input")
    
    # Negate values for max heap behavior
    max_heap = [-num for num in nums]
    heapq.heapify(max_heap)
    
    # Extract max (k-1) times
    for _ in range(k - 1):
        heapq.heappop(max_heap)
    
    return -max_heap[0]
```

### Template 4: Sorting Approach (Simple)

```python
def find_kth_largest_sorted(nums: List[int], k: int) -> int:
    """
    Simple sorting approach.
    
    Time: O(n log n)
    Space: O(1) if sorted in-place
    
    Use when simplicity is preferred or n is small.
    """
    if not nums or k < 1 or k > len(nums):
        raise ValueError("Invalid input")
    
    nums.sort(reverse=True)
    return nums[k - 1]
```

### Template 5: Kth Smallest (Using Max Heap)

```python
import heapq
from typing import List

def find_kth_smallest(nums: List[int], k: int) -> int:
    """
    Find k-th smallest using max heap of size k.
    
    Time: O(n log k)
    Space: O(k)
    """
    if not nums or k < 1 or k > len(nums):
        raise ValueError("Invalid input")
    
    # Max heap using negation
    max_heap = []
    
    for num in nums:
        heapq.heappush(max_heap, -num)
        if len(max_heap) > k:
            heapq.heappop(max_heap)
    
    return -max_heap[0]
```

### Template 6: Streaming k-th Largest Class

```python
import heapq
from typing import List

class KthLargest:
    """
    Stream processor for k-th largest element.
    LeetCode 703 implementation.
    """
    
    def __init__(self, k: int, nums: List[int]):
        """
        Initialize with k and initial numbers.
        
        Time: O(n log k) where n = len(nums)
        Space: O(k)
        """
        self.k = k
        self.min_heap = []
        
        for num in nums:
            self.add(num)
    
    def add(self, val: int) -> int:
        """
        Add new element and return current k-th largest.
        
        Time: O(log k)
        """
        heapq.heappush(self.min_heap, val)
        
        if len(self.min_heap) > self.k:
            heapq.heappop(self.min_heap)
        
        return self.min_heap[0]


# Usage example:
# kth = KthLargest(3, [4, 5, 8, 2])
# print(kth.add(3))  # Returns 4
# print(kth.add(5))  # Returns 5
# print(kth.add(10)) # Returns 5
# print(kth.add(9))  # Returns 8
# print(kth.add(4))  # Returns 8
```

---

## When to Use

Use the Kth Largest Element algorithm when you need to solve problems involving:
- **Top-K Problems**: Finding the k largest/smallest elements in a dataset
- **Order Statistics**: Finding elements at specific positions in unordered data
- **Streaming Data**: Processing elements one at a time while maintaining a collection of k largest elements
- **Optimization Scenarios**: When you need better than O(n log n) time complexity

### Comparison with Alternatives

| Approach | Time Complexity | Space Complexity | Best Use Case |
|----------|-----------------|------------------|---------------|
| **Min Heap (size k)** | O(n log k) | O(k) | When k << n, streaming data |
| **Max Heap (size n)** | O(n + k log n) | O(n) | When k is close to n |
| **Quickselect (Average)** | O(n) | O(1) | When average case matters more than worst case |
| **Quickselect (Worst)** | O(n²) | O(1) | Avoid unless data is nearly sorted |
| **Sorting** | O(n log n) | O(1) | When you need the full sorted array anyway |

### When to Choose Each Approach

- **Choose Min Heap (size k)** when:
  - k is small relative to n
  - Processing streaming/chunked data
  - Memory is limited
  - You need guaranteed O(n log k) performance

- **Choose Quickselect** when:
  - You need average O(n) time
  - Space is extremely limited
  - You can tolerate occasional O(n²) performance
  - The data fits in memory

- **Choose Sorting** when:
  - n is small
  - You need multiple order statistics
  - Simplicity is preferred over optimization

---

## Algorithm Explanation

### Core Concept

The fundamental insight behind finding the k-th largest element is understanding the relationship between:
- **k-th largest**: The element that would be at index `k-1` if the array were sorted in descending order
- **n - k + 1-th smallest**: The element at index `n - k` if sorted in ascending order

This duality allows us to apply both "k largest" and "k smallest" strategies.

### How It Works

#### Approach 1: Min Heap (Recommended for most cases)

The min heap approach maintains exactly k elements - the k largest ones seen so far.

1. **Initialize** an empty min heap
2. **Iterate** through each number in the array
3. **Push** the current number onto the heap
4. **If heap size exceeds k**, pop the smallest element
5. **After processing all elements**, the top of the heap is the k-th largest

**Why Min Heap?**
- A min heap of size k always contains the k largest elements seen so far
- The smallest element in this heap is the k-th largest overall
- We only need O(k) space, not O(n)

#### Approach 2: Quickselect (Average O(n))

Quickselect is a divide-and-conquer algorithm that works similar to quicksort:

1. **Choose a pivot** element
2. **Partition** the array around the pivot (like in quicksort)
3. **Determine** which partition contains the k-th largest
4. **Recursively** repeat on that partition until found

The key optimization is that we only recurse into one partition, unlike quicksort which processes both.

#### Approach 3: Max Heap (Building Complete Collection)

1. **Push all elements** onto a max heap: O(n)
2. **Extract max** k-1 times: O(k log n)
3. **Return** the next maximum

### Visual Representation

For array `[3, 2, 1, 5, 6, 4]` with k=2:

```
Min Heap Approach (k=2):
Step-by-step:
  Element | Heap Content | Action
  --------|--------------|-------------
     3    | [3]          | First element
     2    | [2, 3]       | Add 2, heap=[2,3], size=2
     1    | [2, 3]       | 1<2? No, push 1→[1,3,2], pop→[2,3]
     5    | [3, 5]       | Push 5→[2,3,5], pop→[3,5]
     6    | [5, 6]       | Push 6→[3,5,6], pop→[5,6]
     4    | [4, 6]       | Push 4→[4,5,6], pop→[5,6]

Result: heap[0] = 5 ✓ (2nd largest is 5)

Quickselect Approach:
Target index = n - k = 6 - 2 = 4 (4th smallest = 2nd largest)

1. Choose pivot=4, partition → [3,2,1,4,5,6]
2. pivot_index=3 < 4, recurse right on [5,6]
3. Choose pivot=6, partition → [5,6]
4. pivot_index=4 = target, return nums[4] = 5 ✓
```

### Why It Works

**Min Heap**: By maintaining a heap of size k, we ensure we only keep the k largest elements. The heap property guarantees O(log k) insertion and removal.

**Quickselect**: The partition operation places the pivot in its final sorted position. By only recursing on the side containing our target, we achieve average O(n) time.

**Max Heap**: Building a complete heap then extracting k-1 elements guarantees we find the k-th largest, but uses O(n) space.

### Limitations

- **Min Heap**: O(k) space required, not in-place
- **Quickselect**: Worst case O(n²), not stable
- **Max Heap**: O(n) space, inefficient when k << n
- **All approaches**: Require all data in memory (not external sorting)

---

## Practice Problems

### Problem 1: Kth Largest Element in an Array

**Problem:** [LeetCode 215 - Kth Largest Element in an Array](https://leetcode.com/problems/kth-largest-element-in-an-array/)

**Description:** Given an integer array `nums` and integer `k`, return the `k-th` largest element. Note that it is the `k-th` largest element in sorted order, not the `k-th` distinct element.

**How to Apply:**
- Use min heap of size k for O(n log k) solution
- Use quickselect for average O(n) solution
- Choose based on whether worst-case guarantees matter

---

### Problem 2: Kth Largest Element in a Stream

**Problem:** [LeetCode 703 - Kth Largest Element in a Stream](https://leetcode.com/problems/kth-largest-element-in-a-stream/)

**Description:** Design a class `KthLargest` with a constructor that takes an integer `k` and an integer array `nums`, and an `add` method that returns the kth largest element after adding a new value.

**How to Apply:**
- Use a min heap of size k to maintain only k largest elements seen so far
- This is the classic "streaming" variation of the problem
- Each add operation takes O(log k) time

---

### Problem 3: Kth Smallest Element in a Sorted Matrix

**Problem:** [LeetCode 378 - Kth Smallest Element in a Sorted Matrix](https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix/)

**Description:** Given an `n x n` matrix where each row and column is sorted in ascending order, return the `k-th` smallest element in the matrix.

**How to Apply:**
- Use a min heap starting from top-left element
- Track visited cells to avoid duplicates
- Extract minimum k times to find answer
- Time: O(k log n), Space: O(n)

---

### Problem 4: Find K Pairs with Smallest Sums

**Problem:** [LeetCode 373 - Find K Pairs with Smallest Sums](https://leetcode.com/problems/find-k-pairs-with-smallest-sums/)

**Description:** Given two sorted arrays `nums1` and `nums2`, return the k pairs with the smallest sums.

**How to Apply:**
- Use a min heap initialized with pairs from nums1[0] to nums1[k-1]
- Each heap entry contains (sum, index1, index2)
- Extract k pairs, adding new candidates after each extraction
- Similar to k-way merge pattern

---

### Problem 5: Top K Frequent Elements

**Problem:** [LeetCode 347 - Top K Frequent Elements](https://leetcode.com/problems/top-k-frequent-elements/)

**Description:** Given an integer array `nums` and an integer `k`, return the `k` most frequent elements.

**How to Apply:**
- First, count frequencies using a hash map
- Use a min heap of size k to track top k frequent elements
- Heap elements are (frequency, element)
- This combines frequency counting with the kth largest pattern

---

## Video Tutorial Links

### Fundamentals

- [Kth Largest Element - Heap Approach (Take U Forward)](https://www.youtube.com/watch?v=3BymHM1JJe0) - Comprehensive min heap explanation
- [Quickselect Algorithm (WilliamFiset)](https://www.youtube.com/watch?v=HzvJ82cFCps) - Detailed quickselect visualization
- [Kth Largest Element - LeetCode Solution (NeetCode)](https://www.youtube.com/watch?v=XEmxdkObWt4) - Practical implementation

### Advanced Topics

- [Quickselect vs QuickSort](https://www.youtube.com/watch?v=Y3ZM1rmM5jM) - Understanding the difference
- [Heap vs Quickselect](https://www.youtube.com/watch?v=6Y_G1tHiqes) - When to use which approach
- [Streaming Kth Largest](https://www.youtube.com/watch?v=hOjms7X70sE) - Handling data streams

### Related Problems

- [Kth Smallest in Sorted Matrix](https://www.youtube.com/watch?v=Nvj6N2b6xF8) - 2D variation
- [Top K Frequent Elements](https://www.youtube.com/watch?v=YPTqJIyQ7xQ) - Combining with frequency counting

---

## Follow-up Questions

### Q1: What if k = 1 (finding the maximum)?

**Answer:** For k = 1, all approaches simplify:
- Min heap of size 1: O(n) - just track the maximum seen
- Max heap: O(n) to build, O(1) to extract
- Quickselect: Still O(n) average
- Simply iterating: O(n), O(1) space - most efficient!

For finding max/min, don't use heaps - just iterate once.

---

### Q2: What if k = n (finding the minimum)?

**Answer:** Similarly, the problem becomes finding the minimum:
- Swap min/max heap strategies
- Quickselect still works with adjusted target
- Consider if you even need a heap - linear scan works in O(n)

---

### Q3: How do you handle duplicates?

**Answer:** Several approaches:
1. **Heap approach**: Works correctly with duplicates automatically
2. **Binary search on answer**: Count elements ≥ candidate
3. **Use a counter**: Track frequencies, adjust for duplicates
4. **Sort and skip**: For small n, sort and handle duplicates

The min heap approach handles duplicates correctly without modification.

---

### Q4: Can you find median using this approach?

**Answer:** Yes! The median is essentially:
- For odd n: k = n/2 + 1 (k-th smallest) or k = (n+1)/2
- For even n: Average of k = n/2 and k = n/2 + 1
- Use the k-th largest approach with appropriate k values

For even n, you need to find two middle elements and average them.

---

### Q5: How do you handle very large k (close to n)?

**Answer:** Consider these strategies:
- **Sorting becomes competitive**: O(n log n) vs O(n log k) when k ≈ n
- **Max heap**: O(n + k log n) can be better when k > n/2
- **Calculate (n-k+1)th smallest**: Could be more efficient
- **Quickselect**: Still works fine regardless of k value

When k > n/2, consider finding the (n-k+1)-th smallest instead using max heap.

---

## Summary

The Kth Largest Element is a fundamental problem that tests understanding of various algorithmic techniques. Key takeaways:

| Approach | Time | Space | When to Use |
|----------|------|-------|-------------|
| **Min Heap (size k)** | O(n log k) | O(k) | Most cases, streaming |
| **Quickselect** | O(n) avg, O(n²) worst | O(1) | Space-critical, avg performance |
| **Max Heap** | O(n + k log n) | O(n) | k close to n |
| **Sorting** | O(n log n) | O(1) | Small n, simplicity |

### When to Use

- ✅ Stream processing with memory constraints → Min Heap
- ✅ Need guaranteed performance → Min Heap  
- ✅ Average O(n) is critical → Quickselect
- ✅ k close to n → Sorting or Max Heap
- ❌ Don't use naive approach for large n

This problem pattern appears frequently in interviews and competitive programming, making it essential to master. The techniques learned here apply to many other problems like top-k elements, medians, and order statistics.
