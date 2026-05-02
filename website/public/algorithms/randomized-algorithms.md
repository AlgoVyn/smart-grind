# Randomized Algorithms

## Category
Algorithms & Probability

## Description

Randomized algorithms use randomness as part of their logic to achieve better performance or simplicity compared to deterministic alternatives. These algorithms can be classified into two types: Las Vegas algorithms, which always produce the correct result but have variable runtime, and Monte Carlo algorithms, which have fixed runtime but may produce incorrect results with small probability.

The power of randomization lies in its ability to avoid worst-case scenarios that plague deterministic algorithms. By making random choices, these algorithms can achieve expected performance that often exceeds the best-known deterministic bounds, while being simpler to implement and understand.

---

## Concepts

Randomized algorithms are built on fundamental probability and algorithm design concepts.

### 1. Types of Randomized Algorithms

| Type | Correctness | Runtime | Example |
|------|-------------|---------|---------|
| **Las Vegas** | Always correct | Variable (expected bound) | Quick Select, Randomized Quicksort |
| **Monte Carlo** | Probably correct | Fixed | Miller-Rabin primality test |
| **Atlantic City** | Probably correct | Probably fast | Some approximation algorithms |

### 2. Expected Value and Probability

| Concept | Definition | Application |
|---------|------------|-------------|
| **Expected runtime** | Average over all random choices | Analysis of Quick Sort |
| **High probability** | Probability ≥ 1 - 1/n^c | Confidence in results |
| **Expected approximation** | Expected value within factor | Approximation algorithms |

### 3. Random Pivot and Partitioning

| Algorithm | Deterministic Worst | Randomized Expected | Space |
|-----------|-------------------|---------------------|-------|
| **Quick Sort** | O(n²) | O(n log n) | O(log n) |
| **Quick Select** | O(n²) | O(n) | O(log n) |
| **BST Operations** | O(n) | O(log n) | O(log n) |

### 4. Reservoir Sampling

Family of algorithms for randomly sampling from a stream:

| Variant | Problem | Probability |
|---------|---------|-------------|
| **k=1** | Single random element | 1/n for each |
| **k>1** | k random elements | k/n for each |
| **Weighted** | Proportional to weight | weight/total |

---

## Frameworks

Structured approaches for applying randomized algorithms.

### Framework 1: Randomized Quick Select

```
┌─────────────────────────────────────────────────────────────┐
│  RANDOMIZED QUICK SELECT (KTH SMALLEST)                    │
├─────────────────────────────────────────────────────────────┤
│  Input: array arr, target index k                           │
│  Output: kth smallest element                                │
│                                                              │
│  1. If len(arr) == 1: return arr[0]                        │
│  2. Choose random pivot from arr                            │
│  3. Partition arr into:                                     │
│     - left: elements < pivot                                │
│     - middle: elements == pivot                            │
│     - right: elements > pivot                                │
│  4. If k < len(left):                                       │
│     - Return QuickSelect(left, k)                          │
│  5. If k < len(left) + len(middle):                        │
│     - Return pivot                                          │
│  6. Else:                                                   │
│     - Return QuickSelect(right, k - len(left) - len(middle))│
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Finding kth order statistic with expected O(n) time.

### Framework 2: Randomized Quick Sort

```
┌─────────────────────────────────────────────────────────────┐
│  RANDOMIZED QUICK SORT                                     │
├─────────────────────────────────────────────────────────────┤
│  1. If array length <= 1: return                            │
│  2. Choose random pivot element                             │
│  3. Create three lists:                                     │
│     - left = [x for x in arr if x < pivot]                 │
│     - middle = [x for x in arr if x == pivot]              │
│     - right = [x for x in arr if x > pivot]                │
│  4. Return: QuickSort(left) + middle + QuickSort(right)     │
│                                                              │
│  Expected Time: O(n log n)                                  │
│  Worst Time: O(n²) - extremely unlikely                    │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Simple implementation, expected O(n log n) performance.

### Framework 3: Reservoir Sampling

```
┌─────────────────────────────────────────────────────────────┐
│  RESERVOIR SAMPLING (k ITEMS FROM STREAM)                  │
├─────────────────────────────────────────────────────────────┤
│  Input: stream of unknown/very large size                   │
│  Output: k uniformly random elements                        │
│                                                              │
│  1. Initialize reservoir = []                              │
│  2. For i, item in enumerate(stream):                     │
│     a. If i < k:                                           │
│        - reservoir.append(item)                            │
│     b. Else:                                               │
│        - j = random integer in [0, i]                      │
│        - If j < k:                                         │
│           * reservoir[j] = item                            │
│  3. Return reservoir                                        │
│                                                              │
│  Probability: Each item has probability k/n of being selected│
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Sampling from large or unknown-size streams.

### Framework 4: Median of Medians (Deterministic Selection)

```
┌─────────────────────────────────────────────────────────────┐
│  MEDIAN OF MEDIANS (DETERMINISTIC O(N) SELECTION)          │
├─────────────────────────────────────────────────────────────┤
│  1. If |arr| <= 5: return median by sorting                │
│  2. Divide arr into groups of 5                            │
│  3. Find median of each group                               │
│  4. Find median of medians (recursive call)                 │
│  5. Use this as pivot for partitioning                     │
│  6. Recurse on appropriate partition                       │
│                                                              │
│  Time: O(n) guaranteed                                      │
│  Space: O(log n)                                            │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: When deterministic O(n) guarantee is required.

---

## Forms

Different manifestations of randomized algorithms.

### Form 1: Las Vegas Algorithms

Always correct, variable runtime.

| Aspect | Details |
|--------|---------|
| **Guarantee** | Correct result guaranteed |
| **Runtime** | Expected bound, worst case possible |
| **Examples** | Quick Sort, Quick Select, Treap operations |
| **Analysis** | Expected value over random choices |

### Form 2: Monte Carlo Algorithms

Fixed runtime, probably correct.

| Aspect | Details |
|--------|---------|
| **Guarantee** | Fixed runtime guaranteed |
| **Correctness** | Correct with high probability |
| **Examples** | Miller-Rabin primality test, randomized hashing |
| **Analysis** | Probability of correct result |

### Form 3: Randomized Data Structures

Expected balanced performance without complex rebalancing.

| Structure | Expected Time | Deterministic Equivalent |
|-----------|---------------|-------------------------|
| **Treap** | O(log n) | AVL Tree, Red-Black Tree |
| **Skip List** | O(log n) | Balanced BST |
| **Randomized BST** | O(log n) | Balanced BST |

### Form 4: Probabilistic Counting

Approximate results with bounded error.

| Algorithm | Problem | Accuracy |
|-----------|---------|----------|
| **HyperLogLog** | Distinct count | ~2% error |
| **Count-Min Sketch** | Frequency estimation | Bounded error |
| **Bloom Filter** | Set membership | No false negatives |

### Form 5: Randomized Graph Algorithms

| Algorithm | Problem | Approach |
|-----------|---------|----------|
| **Random Walk** | Connectivity, s-t paths | Random edge selection |
| **Min-Cut (Karger)** | Global min-cut | Random edge contraction |
| **PageRank** | Importance ranking | Random surfer model |

---

## Tactics

Specific techniques for randomized algorithms.

### Tactic 1: Basic Quick Select

Expected O(n) kth element selection:

```python
import random

def quick_select(arr, k):
    """
    Find k-th smallest element (0-indexed).
    Expected time: O(n)
    """
    if not arr:
        return None
    
    # Random pivot
    pivot_idx = random.randint(0, len(arr) - 1)
    pivot = arr[pivot_idx]
    
    # Partition
    left = [x for x in arr if x < pivot]
    mid = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    
    if k < len(left):
        return quick_select(left, k)
    elif k < len(left) + len(mid):
        return pivot
    else:
        return quick_select(right, k - len(left) - len(mid))
```

**Why it works**: Random pivot gives expected balanced partition.

### Tactic 2: In-Place Quick Select

Memory-efficient version:

```python
def quick_select_inplace(arr, k):
    """In-place Quick Select with O(1) extra space."""
    def select(left, right, k_smallest):
        if left == right:
            return arr[left]
        
        # Random pivot
        pivot_idx = random.randint(left, right)
        
        # Move pivot to end
        arr[pivot_idx], arr[right] = arr[right], arr[pivot_idx]
        
        # Partition
        store_idx = left
        for i in range(left, right):
            if arr[i] < arr[right]:
                arr[store_idx], arr[i] = arr[i], arr[store_idx]
                store_idx += 1
        
        # Move pivot to final place
        arr[right], arr[store_idx] = arr[store_idx], arr[right]
        
        if k_smallest == store_idx:
            return arr[k_smallest]
        elif k_smallest < store_idx:
            return select(left, store_idx - 1, k_smallest)
        else:
            return select(store_idx + 1, right, k_smallest)
    
    return select(0, len(arr) - 1, k)
```

**Advantage**: O(1) space overhead, modifies array in-place.

### Tactic 3: Median of Medians

Deterministic O(n) selection:

```python
def median_of_medians_select(arr, k):
    """Deterministic O(n) selection algorithm."""
    if len(arr) <= 5:
        return sorted(arr)[k]
    
    # Divide into groups of 5
    chunks = [arr[i:i+5] for i in range(0, len(arr), 5)]
    medians = [sorted(chunk)[len(chunk)//2] for chunk in chunks]
    
    # Recursively find median of medians
    pivot = median_of_medians_select(medians, len(medians)//2)
    
    # Partition around pivot
    left = [x for x in arr if x < pivot]
    mid = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    
    if k < len(left):
        return median_of_medians_select(left, k)
    elif k < len(left) + len(mid):
        return pivot
    else:
        return median_of_medians_select(right, k - len(left) - len(mid))
```

**Guarantee**: O(n) worst case, though higher constant factor.

### Tactic 4: Reservoir Sampling

Single-pass random sampling:

```python
def reservoir_sample_k(stream, k):
    """
    Sample k items uniformly from stream.
    """
    reservoir = []
    
    for i, item in enumerate(stream):
        if i < k:
            reservoir.append(item)
        else:
            # Replace with probability k/(i+1)
            j = random.randint(0, i)
            if j < k:
                reservoir[j] = item
    
    return reservoir
```

**Probability proof**: Each item has probability k/n of being in final sample.

### Tactic 5: Randomized QuickSort

Simple, expected O(n log n) sort:

```python
def quicksort_random(arr):
    """QuickSort with random pivot - expected O(n log n)."""
    if len(arr) <= 1:
        return arr
    
    pivot = random.choice(arr)
    left = [x for x in arr if x < pivot]
    mid = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    
    return quicksort_random(left) + mid + quicksort_random(right)
```

**Simplicity**: Much simpler than deterministic O(n log n) sorts with guaranteed bounds.

---

## Python Templates

### Template 1: Randomized Quick Select

```python
import random
from typing import List


def quick_select(nums: List[int], k: int) -> int:
    """
    Find kth smallest element using randomized Quick Select.
    
    Expected Time: O(n)
    Worst Case: O(n²) - extremely unlikely with random pivot
    Space: O(log n) recursion stack
    """
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
    
    def select(left: int, right: int, k: int) -> int:
        if left == right:
            return nums[left]
        
        # Random pivot to avoid worst case
        pivot_idx = random.randint(left, right)
        pivot_idx = partition(left, right, pivot_idx)
        
        if k == pivot_idx:
            return nums[k]
        elif k < pivot_idx:
            return select(left, pivot_idx - 1, k)
        else:
            return select(pivot_idx + 1, right, k)
    
    return select(0, len(nums) - 1, k)
```

### Template 2: Kth Largest Element

```python
def find_kth_largest(nums: List[int], k: int) -> int:
    """
    Find kth largest element.
    
    k=1 means largest element.
    Expected Time: O(n)
    """
    # kth largest = (n-k)th smallest
    return quick_select(nums, len(nums) - k)
```

### Template 3: Reservoir Sampling (k items)

```python
def reservoir_sample(stream, k: int) -> List:
    """
    Randomly sample k items from a stream.
    
    Each item in stream has equal probability k/n of being selected.
    
    Time: O(n) where n is stream length
    Space: O(k)
    """
    reservoir = []
    
    for i, item in enumerate(stream):
        if i < k:
            reservoir.append(item)
        else:
            # Replace with probability k/(i+1)
            j = random.randint(0, i)
            if j < k:
                reservoir[j] = item
    
    return reservoir
```

### Template 4: Randomized QuickSort

```python
def quick_sort(nums: List[int]) -> List[int]:
    """
    Randomized QuickSort.
    
    Expected Time: O(n log n)
    Worst Case: O(n²) - extremely unlikely
    """
    if len(nums) <= 1:
        return nums
    
    pivot = random.choice(nums)
    left = [x for x in nums if x < pivot]
    mid = [x for x in nums if x == pivot]
    right = [x for x in nums if x > pivot]
    
    return quick_sort(left) + mid + quick_sort(right)
```

### Template 5: Median of Medians (Deterministic)

```python
def median_of_medians(nums: List[int], k: int) -> int:
    """
    Deterministic O(n) selection algorithm.
    
    Guarantees O(n) worst-case time but with higher constant factor.
    """
    if len(nums) <= 5:
        return sorted(nums)[k]
    
    # Divide into chunks of 5 and find medians
    chunks = [nums[i:i+5] for i in range(0, len(nums), 5)]
    medians = [sorted(chunk)[len(chunk)//2] for chunk in chunks]
    
    # Recursively find median of medians
    pivot = median_of_medians(medians, len(medians) // 2)
    
    # Partition
    left = [x for x in nums if x < pivot]
    mid = [x for x in nums if x == pivot]
    right = [x for x in nums if x > pivot]
    
    if k < len(left):
        return median_of_medians(left, k)
    elif k < len(left) + len(mid):
        return pivot
    else:
        return median_of_medians(right, k - len(left) - len(mid))
```

### Template 6: Random Sample from Linked List

```python
# Definition for singly-linked list
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def get_random_from_linked_list(head: ListNode) -> int:
    """
    Return a random node's value from linked list.
    Reservoir sampling with k=1.
    
    Time: O(n)
    Space: O(1)
    """
    result = head.val
    current = head.next
    count = 1
    
    while current:
        count += 1
        # Replace with probability 1/count
        if random.randint(1, count) == 1:
            result = current.val
        current = current.next
    
    return result
```

---

## When to Use

Use randomized algorithms when you need to solve problems involving:

- **Order statistics**: Finding kth smallest/largest elements
- **Sorting**: When expected O(n log n) is acceptable
- **Sampling**: Random selection from streams or large datasets
- **Approximation**: When exact solutions are too expensive
- **Load balancing**: Random distribution of work
- **Avoiding worst case**: When deterministic algorithms have poor worst-case behavior

### Comparison: Randomized vs Deterministic

| Aspect | Randomized | Deterministic |
|--------|-----------|---------------|
| **Implementation** | Often simpler | Often more complex |
| **Expected performance** | Usually better | Consistent |
| **Worst case** | Unlikely | Predictable |
| **Analysis** | Requires probability | Standard complexity |
| **Reproducibility** | Requires seeding | Naturally reproducible |

### When to Choose Randomized

- **Choose Randomized** when:
  - Simple implementation is preferred
  - Expected performance matters more than worst-case
  - Worst-case inputs are unlikely or can be detected
  - Dealing with streaming/unknown-size data

- **Choose Deterministic** when:
  - Worst-case guarantees are required
  - Reproducibility without seeding is needed
  - Security or adversarial settings
  - Performance variance must be minimized

---

## Algorithm Explanation

### Core Concept

Randomized algorithms use random choices to:
1. **Avoid worst cases**: Random pivot prevents O(n²) on sorted input
2. **Simplify design**: No need for complex deterministic strategies
3. **Achieve better expected bounds**: Randomization often beats deterministic lower bounds

### Expected Value Analysis

For Quick Select with random pivot:
- Probability pivot is in middle 50%: 1/2
- Expected number of "good" splits: O(log n)
- Expected work at each level: O(n)
- Total expected: O(n)

### High Probability Bounds

Most randomized algorithms achieve their bounds with high probability:
- Probability of exceeding 10× expected time: very small
- Probability decreases exponentially with deviation
- Multiple runs amplify success probability

### Visual Walkthrough

**Quick Select Example**:
```
Find 3rd smallest in [7, 3, 9, 1, 5, 2, 8]

Step 1: Random pivot = 5
Partition: [3, 1, 2] [5] [7, 9, 8]
            ↑    ↑    ↑
           left pivot right
            3    1    3

k=2 < 3, recurse on left

Step 2: Random pivot = 2
Partition: [1] [2] [3]
           1   1   1

k=2, need 3rd in original = index 2 in [1,2,3]
Result: 3 ✓
```

---

## Practice Problems

### Problem 1: Kth Largest Element in an Array

**Problem:** [LeetCode 215 - Kth Largest Element in an Array](https://leetcode.com/problems/kth-largest-element-in-an-array/)

**Description:** Find the kth largest element in an unsorted array. Note that it is the kth largest element in sorted order, not the kth distinct element.

**How to Apply:**
- Use Quick Select with random pivot
- Map kth largest to (n-k)th smallest
- Expected O(n) time

---

### Problem 2: Wiggle Sort II

**Problem:** [LeetCode 324 - Wiggle Sort II](https://leetcode.com/problems/wiggle-sort-ii/)

**Description:** Given an unsorted array `nums`, reorder it such that `nums[0] < nums[1] > nums[2] < nums[3]...`

**How to Apply:**
- Find median using Quick Select
- Partition around median
- Use virtual indexing for arrangement

---

### Problem 3: K Closest Points to Origin

**Problem:** [LeetCode 973 - K Closest Points to Origin](https://leetcode.com/problems/k-closest-points-to-origin/)

**Description:** Given an array of points, return the k closest points to the origin.

**How to Apply:**
- Use Quick Select on squared distances
- Partial sort to find k smallest distances
- Return corresponding points

---

## Video Tutorial Links

### Fundamentals

- [Randomized Algorithms Introduction](https://www.youtube.com/watch?v=gM4m2E6C2bY) - Theory and concepts
- [Quick Select Explained](https://www.youtube.com/watch?v=BP7TqB1PlU0) - Randomized selection
- [Median of Medians](https://www.youtube.com/watch?v=79qQ5hoRJoU) - Deterministic selection

### Applications

- [Reservoir Sampling](https://www.youtube.com/watch?v=A1iwzSew5QY) - Stream sampling
- [Randomized QuickSort](https://www.youtube.com/watch?v=Hoixgm4-P4M) - Sorting
- [Las Vegas vs Monte Carlo](https://www.youtube.com/watch?v=csLw11U7lM8) - Algorithm types

---

## Follow-up Questions

### Q1: Why does random pivot selection help in Quick Sort?

**Answer**: Without randomization, sorted or nearly-sorted input causes O(n²) worst case with naive pivot selection (first/last element). Random pivot makes the probability of consistently bad choices negligible, giving O(n log n) expected time regardless of input distribution.

### Q2: What's the difference between Las Vegas and Monte Carlo algorithms?

**Answer**: 
- **Las Vegas**: Always correct, runtime varies (e.g., Quick Sort, Quick Select)
- **Monte Carlo**: Fixed runtime, may be incorrect with small probability (e.g., Miller-Rabin primality test)

For Monte Carlo, running multiple times amplifies the probability of correct result.

### Q3: When should I use Median of Medians instead of randomized Quick Select?

**Answer**: Use Median of Medians when:
- You need guaranteed O(n) worst case
- Dealing with potentially adversarial input
- Security or real-time constraints require predictable performance

Trade-off is higher constant factors (typically 3-4× slower in practice).

### Q4: Can randomized algorithms be derandomized?

**Answer**: Sometimes yes, through techniques like:
- **Probabilistic method**: Show existence without construction
- **Pseudorandom generators**: Replace true randomness
- **Conditional expectations**: Make deterministic choices that preserve expected value

However, derandomization often increases complexity significantly.

### Q5: How does reservoir sampling ensure uniform probability?

**Answer**: For the k=1 case, when processing the ith element:
- Keep it with probability 1/i
- This gives probability 1/n for each element because:
  - Element i survives to end with probability: 1/i × i/(i+1) × (i+1)/(i+2) × ... × (n-1)/n = 1/n

---

## Summary

Randomized algorithms provide elegant solutions to many algorithmic problems, often achieving better expected performance with simpler implementations than their deterministic counterparts.

**Key Takeaways:**

1. **Two Types**: Las Vegas (always correct) vs Monte Carlo (probably correct)
2. **Avoid Worst Case**: Randomization prevents adversarial inputs
3. **Expected Performance**: Often beats deterministic bounds
4. **Simplicity**: Random choices can replace complex deterministic strategies
5. **High Probability**: Bounds hold with probability → 1 as n grows

**When to Use:**
- Order statistics (Quick Select)
- Sorting (Randomized Quick Sort)
- Sampling from streams (Reservoir Sampling)
- Approximation algorithms
- Anywhere deterministic worst-case is problematic

Understanding randomized algorithms is essential for modern algorithm design, providing powerful tools for tackling problems where deterministic approaches fall short.
