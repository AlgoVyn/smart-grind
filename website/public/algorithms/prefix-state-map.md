# Prefix State Map

## Category
Arrays & Hash Maps

## Description

The Prefix State Map pattern is a powerful technique for solving subarray problems by tracking cumulative states (sums, counts, or other aggregations) as we iterate through an array. By storing these prefix states in a hash map, we enable O(1) lookup to efficiently answer subarray queries.

The key insight is that the sum of any subarray from index i+1 to j can be expressed as `prefix_sum[j] - prefix_sum[i]`. By storing prefix sums in a hash map, we can instantly check if a subarray with a target property exists. This technique transforms seemingly complex O(n²) subarray problems into elegant O(n) solutions.

---

## Concepts

The Prefix State Map pattern relies on several fundamental concepts that make it effective for subarray problems.

### 1. Prefix Sum Fundamentals

The prefix sum at position i represents the cumulative sum from the start of the array to position i:

| Index | Array | Prefix Sum | Meaning |
|-------|-------|------------|---------|
| 0 | 1 | 1 | Sum of [0..0] |
| 1 | 2 | 3 | Sum of [0..1] |
| 2 | 3 | 6 | Sum of [0..2] |
| 3 | -1 | 5 | Sum of [0..3] |

For array [1, 2, 3, -1]:
```
Prefix sums: [1, 3, 6, 5]
Subarray sum from i=1 to j=3: prefix[3] - prefix[0] = 5 - 1 = 4
This equals: 2 + 3 + (-1) = 4 ✓
```

### 2. Hash Map Lookup Strategy

The hash map stores prefix state values for O(1) lookup:

| Map Key | Map Value | Use Case |
|---------|-----------|----------|
| prefix_sum | count | Count subarrays with sum k |
| prefix_sum | first_index | Find longest subarray |
| prefix_mod | count | Count subarrays divisible by k |
| count_diff | first_index | Equal 0s and 1s |

### 3. The Core Equation

For any target property:
```
If prefix_sum[j] - prefix_sum[i] = target
Then prefix_sum[i] = prefix_sum[j] - target
```

This allows us to check if a valid subarray ending at position j exists by looking up `(prefix_sum[j] - target)` in our hash map.

### 4. Initialization Strategy

Always initialize `prefix_map[0] = 1` (or appropriate base case):

| Scenario | Initialization | Reason |
|----------|---------------|--------|
| Count subarrays | {0: 1} | Empty subarray has sum 0 |
| Longest subarray | {0: -1} | Empty subarray starts at index -1 |
| Minimum operations | {0: 0} | Base case for operations |

---

## Frameworks

Structured approaches for solving prefix state problems.

### Framework 1: Count Subarrays with Sum K

```
┌─────────────────────────────────────────────────────────────┐
│  COUNT SUBARRAYS WITH SUM EQUAL TO K                        │
├─────────────────────────────────────────────────────────────┤
│  Input: nums array, target sum k                           │
│  Output: count of subarrays with sum = k                     │
│                                                              │
│  1. Initialize: prefix_sum = 0, count = 0                  │
│  2. Create hash map: prefix_map = {0: 1}                   │
│  3. For each num in nums:                                   │
│     a. prefix_sum += num                                    │
│     b. target_prefix = prefix_sum - k                       │
│     c. count += prefix_map.get(target_prefix, 0)          │
│     d. prefix_map[prefix_sum] += 1                        │
│  4. Return count                                            │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: When you need to count all subarrays with a specific sum.

### Framework 2: Longest Subarray with Sum K

```
┌─────────────────────────────────────────────────────────────┐
│  LONGEST SUBARRAY WITH SUM K                               │
├─────────────────────────────────────────────────────────────┤
│  1. Initialize: prefix_sum = 0, max_len = 0               │
│  2. Create hash map: prefix_map = {0: -1}                  │
│     (stores first occurrence of each prefix sum)            │
│  3. For each num at index i:                                │
│     a. prefix_sum += num                                    │
│     b. If prefix_sum - k in prefix_map:                   │
│        - max_len = max(max_len, i - prefix_map[prefix_sum-k])│
│     c. If prefix_sum not in prefix_map:                   │
│        - prefix_map[prefix_sum] = i                         │
│  4. Return max_len                                          │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Finding the maximum length subarray with given sum.

### Framework 3: Subarrays Divisible by K

```
┌─────────────────────────────────────────────────────────────┐
│  SUBARRAYS WITH SUM DIVISIBLE BY K                         │
├─────────────────────────────────────────────────────────────┤
│  1. Initialize: prefix_sum = 0, count = 0                 │
│  2. Create hash map: prefix_map = {0: 1}                   │
│  3. For each num in nums:                                 │
│     a. prefix_sum = (prefix_sum + num) % k               │
│     b. Handle negative: if prefix_sum < 0: prefix_sum += k│
│     c. count += prefix_map.get(prefix_sum, 0)             │
│     d. prefix_map[prefix_sum] += 1                        │
│  4. Return count                                            │
│                                                              │
│  Key insight: if two prefix sums have same mod k,           │
│  the subarray between them has sum divisible by k           │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Divisibility problems, modular arithmetic subarrays.

### Framework 4: Equal 0s and 1s

```
┌─────────────────────────────────────────────────────────────┐
│  LONGEST SUBARRAY WITH EQUAL 0s AND 1s                       │
├─────────────────────────────────────────────────────────────┤
│  1. Transform: treat 0 as -1, 1 as +1                       │
│  2. Now problem becomes: find longest subarray with sum = 0│
│  3. Apply Framework 2 with k = 0                           │
│  4. Return max_len                                          │
│                                                              │
│  State tracking: prefix_sum = count(1) - count(0)          │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Binary array balance problems.

---

## Forms

Different manifestations of the Prefix State Map pattern.

### Form 1: Standard Prefix Sum

Basic form for counting subarrays with target sum.

| Aspect | Details |
|--------|---------|
| **State** | Running sum |
| **Map stores** | Count of each prefix sum |
| **Initialization** | {0: 1} |
| **Update** | prefix_map[sum] += 1 |
| **Query** | prefix_map.get(sum - k, 0) |

### Form 2: First Occurrence Tracking

For finding longest subarrays, store first occurrence.

| Aspect | Details |
|--------|---------|
| **State** | Running sum |
| **Map stores** | First index where prefix sum occurs |
| **Initialization** | {0: -1} |
| **Update** | Only if sum not in map |
| **Query** | current_index - prefix_map[sum - k] |

### Form 3: Modular Prefix

For divisibility and cyclic problems.

| Aspect | Details |
|--------|---------|
| **State** | prefix_sum % k |
| **Map stores** | Count of each remainder |
| **Initialization** | {0: 1} |
| **Key insight** | Same remainder → divisible subarray |

### Form 4: Multi-dimensional State

When tracking multiple properties simultaneously.

```python
# Example: Track both sum and count of even numbers
state = (prefix_sum, even_count)
map[state] = index
```

### Form 5: Sliding Window Variant

For "at most K distinct" problems using similar intuition.

| Aspect | Details |
|--------|---------|
| **Technique** | Count at most K minus at most K-1 |
| **Data structure** | Hash map of frequencies |
| **Related** | Sliding window, not pure prefix state |

---

## Tactics

Specific techniques and optimizations.

### Tactic 1: Basic Subarray Sum Equals K

The classic prefix state implementation:

```python
from collections import defaultdict

def subarray_sum_equals_k(nums, k):
    """
    Count subarrays with sum equal to k.
    Time: O(n), Space: O(n)
    """
    prefix_sum = 0
    count = 0
    prefix_map = defaultdict(int)
    prefix_map[0] = 1  # Empty subarray has sum 0
    
    for num in nums:
        prefix_sum += num
        # If prefix_sum - k exists, those subarrays sum to k
        count += prefix_map[prefix_sum - k]
        # Record current prefix sum
        prefix_map[prefix_sum] += 1
    
    return count
```

**Why it works**: When we see `prefix_sum`, any previous `prefix_sum - k` indicates a subarray with sum k ending at current position.

### Tactic 2: Longest Subarray with Sum K

Store first occurrence for maximum length:

```python
def longest_subarray_sum_k(nums, k):
    """
    Find longest subarray with sum equal to k.
    """
    prefix_map = {0: -1}  # sum -> first index
    prefix_sum = 0
    max_len = 0
    
    for i, num in enumerate(nums):
        prefix_sum += num
        
        # Check if we can form sum k
        if prefix_sum - k in prefix_map:
            max_len = max(max_len, i - prefix_map[prefix_sum - k])
        
        # Only record first occurrence for longest
        if prefix_sum not in prefix_map:
            prefix_map[prefix_sum] = i
    
    return max_len
```

**Key difference**: Only store first occurrence to maximize length.

### Tactic 3: Subarrays Divisible by K

Modular arithmetic variant:

```python
def subarrays_div_by_k(nums, k):
    """
    Count subarrays with sum divisible by k.
    """
    from collections import defaultdict
    
    prefix_map = defaultdict(int)
    prefix_map[0] = 1  # Empty subarray
    
    prefix_sum = 0
    count = 0
    
    for num in nums:
        prefix_sum = (prefix_sum + num) % k
        # In Python, ensure non-negative
        if prefix_sum < 0:
            prefix_sum += k
        
        # Subarrays with same mod have sum divisible by k
        count += prefix_map[prefix_sum]
        prefix_map[prefix_sum] += 1
    
    return count
```

**Mathematical basis**: If `prefix[i] ≡ prefix[j] (mod k)`, then `sum(i+1..j) ≡ 0 (mod k)`.

### Tactic 4: Equal 0s and 1s (Contiguous Array)

Transform and apply prefix state:

```python
def find_max_length_equal_01(nums):
    """
    Longest contiguous subarray with equal 0s and 1s.
    Treat 0 as -1, find subarray with sum 0.
    """
    prefix_map = {0: -1}
    prefix_sum = 0
    max_len = 0
    
    for i, num in enumerate(nums):
        # Treat 0 as -1
        prefix_sum += 1 if num == 1 else -1
        
        if prefix_sum in prefix_map:
            max_len = max(max_len, i - prefix_map[prefix_sum])
        else:
            prefix_map[prefix_sum] = i
    
    return max_len
```

**Transformation**: Count(1) - Count(0) = 0 means equal numbers.

### Tactic 5: Maximum Size with Negative Numbers

Handle arbitrary integers including negatives:

```python
def max_subarray_size_sum_k(nums, k):
    """
    Maximum size subarray with sum k (handles negatives).
    """
    prefix_map = {}
    prefix_sum = 0
    max_size = 0
    
    for i, num in enumerate(nums):
        prefix_sum += num
        
        # Check if current prefix equals k
        if prefix_sum == k:
            max_size = max(max_size, i + 1)
        
        # Check if prefix_sum - k exists
        if prefix_sum - k in prefix_map:
            max_size = max(max_size, i - prefix_map[prefix_sum - k])
        
        # Store first occurrence
        if prefix_sum not in prefix_map:
            prefix_map[prefix_sum] = i
    
    return max_size
```

**Important**: Must check both current prefix and prefix difference.

---

## Python Templates

### Template 1: Count Subarrays with Sum K

```python
from collections import defaultdict
from typing import List


def count_subarrays_sum_k(nums: List[int], k: int) -> int:
    """
    Count number of subarrays with sum equal to k.
    
    Time: O(n), Space: O(n)
    """
    prefix_sum = 0
    count = 0
    prefix_map = defaultdict(int)
    prefix_map[0] = 1  # Empty subarray
    
    for num in nums:
        prefix_sum += num
        # Add count of previous prefix sums that would form sum k
        count += prefix_map[prefix_sum - k]
        # Record current prefix sum
        prefix_map[prefix_sum] += 1
    
    return count
```

### Template 2: Longest Subarray with Sum K

```python
def longest_subarray_sum_k(nums: List[int], k: int) -> int:
    """
    Find length of longest subarray with sum equal to k.
    
    Time: O(n), Space: O(n)
    """
    prefix_map = {0: -1}  # prefix_sum -> first index
    prefix_sum = 0
    max_len = 0
    
    for i, num in enumerate(nums):
        prefix_sum += num
        
        # Check if we can form subarray with sum k
        if prefix_sum - k in prefix_map:
            max_len = max(max_len, i - prefix_map[prefix_sum - k])
        
        # Store first occurrence only (for maximum length)
        if prefix_sum not in prefix_map:
            prefix_map[prefix_sum] = i
    
    return max_len
```

### Template 3: Subarrays Divisible by K

```python
def subarrays_divisible_by_k(nums: List[int], k: int) -> int:
    """
    Count subarrays with sum divisible by k.
    
    Time: O(n), Space: O(k) at most
    """
    prefix_map = defaultdict(int)
    prefix_map[0] = 1
    
    prefix_sum = 0
    count = 0
    
    for num in nums:
        prefix_sum = (prefix_sum + num) % k
        if prefix_sum < 0:
            prefix_sum += k
        
        count += prefix_map[prefix_sum]
        prefix_map[prefix_sum] += 1
    
    return count
```

### Template 4: Equal 0s and 1s

```python
def find_longest_equal_01(nums: List[int]) -> int:
    """
    Find longest subarray with equal number of 0s and 1s.
    
    Time: O(n), Space: O(n)
    """
    prefix_map = {0: -1}
    prefix_sum = 0
    max_len = 0
    
    for i, num in enumerate(nums):
        # Transform: 0 -> -1, 1 -> +1
        prefix_sum += 1 if num == 1 else -1
        
        if prefix_sum in prefix_map:
            max_len = max(max_len, i - prefix_map[prefix_sum])
        else:
            prefix_map[prefix_sum] = i
    
    return max_len
```

### Template 5: Minimum Operations to Make Divisible

```python
def min_operations_divisible(nums: List[int], k: int) -> int:
    """
    Find minimum number of elements to remove to make
    remaining subarray sum divisible by k.
    
    Returns minimum operations or -1 if impossible.
    """
    prefix_map = {0: 0}  # mod -> earliest index
    prefix_sum = 0
    min_ops = float('inf')
    
    for i, num in enumerate(nums):
        prefix_sum = (prefix_sum + num) % k
        if prefix_sum < 0:
            prefix_sum += k
        
        # Look for previous prefix with same mod
        if prefix_sum in prefix_map:
            min_ops = min(min_ops, i - prefix_map[prefix_sum] + 1)
        
        if prefix_sum not in prefix_map:
            prefix_map[prefix_sum] = i + 1
    
    return min_ops if min_ops != float('inf') else -1
```

### Template 6: Generic Prefix State with Custom State

```python
from typing import Callable, Dict, Any, Tuple

def generic_prefix_state(nums: List[int], 
                         target_state: Any,
                         state_fn: Callable[[Any, int], Any],
                         initial: Any = 0) -> int:
    """
    Generic template for prefix state problems.
    
    Args:
        nums: Input array
        target_state: Target state to find
        state_fn: Function (current_state, num) -> new_state
        initial: Initial state value
    
    Returns:
        Count of subarrays with target_state difference
    """
    prefix_map: Dict[Any, int] = defaultdict(int)
    prefix_map[initial] = 1
    
    state = initial
    count = 0
    
    for num in nums:
        state = state_fn(state, num)
        count += prefix_map.get(state - target_state, 0)
        prefix_map[state] += 1
    
    return count
```

---

## When to Use

Use the Prefix State Map pattern when you need to solve problems involving:

- **Subarray sum problems**: Finding subarrays with specific sum properties
- **Counting subarrays**: Number of subarrays meeting criteria
- **Longest/shortest subarrays**: Optimal length subarray problems
- **Divisibility**: Subarrays with sums divisible by k
- **Binary arrays**: Equal 0s and 1s, or similar balance problems

### Comparison with Alternatives

| Approach | Time | Space | Best For |
|----------|------|-------|----------|
| **Prefix State Map** | O(n) | O(n) | Single pass, hashable states |
| **Brute Force** | O(n²) | O(1) | Small arrays, verification |
| **Sliding Window** | O(n) | O(1) or O(k) | Contiguous constraints, positive numbers |
| **Segment Tree** | O(n log n) | O(n) | Range queries, dynamic updates |

### When to Choose Prefix State vs Sliding Window

- **Choose Prefix State** when:
  - Array contains negative numbers
  - Need exact sum (not at most/at least)
  - Problem involves divisibility
  - Counting all valid subarrays

- **Choose Sliding Window** when:
  - All numbers are positive
  - Looking for "at most K distinct" or similar
  - Need to maintain window property
  - Linear space is preferred

---

## Algorithm Explanation

### Core Concept

The Prefix State Map pattern leverages the fundamental property that any subarray sum can be expressed as the difference of two prefix sums. By maintaining a running aggregation (sum, count, or custom state) and storing each state in a hash map, we can instantly check if a valid subarray ending at the current position exists.

### How It Works

#### Step 1: Initialize
```
Create empty hash map
Set initial state (usually {0: 1} for sums)
Initialize running state variable
```

#### Step 2: Iterate Through Array
```
For each element:
  1. Update running state (e.g., add to prefix sum)
  2. Query hash map for complement state
  3. Update result based on query
  4. Store/update current state in hash map
```

#### Step 3: Return Result
```
The result accumulates during iteration:
- Count problems: running total
- Length problems: maximum length found
- Existence problems: boolean flag
```

### Visual Walkthrough

**Example**: Find subarrays with sum = 5 in [1, 2, 3, 4, 1]

```
Step 1: num = 1
Prefix sum: 1
Looking for: 1 - 5 = -4 (not found)
Map: {0: 1, 1: 1}
Count: 0

Step 2: num = 2
Prefix sum: 3
Looking for: 3 - 5 = -2 (not found)
Map: {0: 1, 1: 1, 3: 1}
Count: 0

Step 3: num = 3
Prefix sum: 6
Looking for: 6 - 5 = 1 (found! count += 1)
Map: {0: 1, 1: 1, 3: 1, 6: 1}
Count: 1
Subarray [2, 3] sums to 5 ✓

Step 4: num = 4
Prefix sum: 10
Looking for: 10 - 5 = 5 (not found)
Map: {0: 1, 1: 1, 3: 1, 6: 1, 10: 1}
Count: 1

Step 5: num = 1
Prefix sum: 11
Looking for: 11 - 5 = 6 (found! count += 1)
Count: 2
Subarray [4, 1] sums to 5 ✓
```

### Mathematical Foundation

For any subarray from index i to j:
```
sum(i..j) = prefix[j+1] - prefix[i]

If sum(i..j) = k:
prefix[j+1] - prefix[i] = k
prefix[i] = prefix[j+1] - k
```

This shows that if we're at position j and have prefix sum P, we need to find how many times `P - k` has appeared before.

---

## Practice Problems

### Problem 1: Subarray Sum Equals K

**Problem:** [LeetCode 560 - Subarray Sum Equals K](https://leetcode.com/problems/subarray-sum-equals-k/)

**Description:** Given an array of integers `nums` and an integer `k`, return the total number of continuous subarrays whose sum equals to `k`.

**How to Apply Prefix State:**
- Use standard prefix sum hash map
- Initialize with {0: 1} for empty subarray
- Count occurrences of `prefix_sum - k` at each step

---

### Problem 2: Contiguous Array

**Problem:** [LeetCode 525 - Contiguous Array](https://leetcode.com/problems/contiguous-array/)

**Description:** Given a binary array `nums`, return the maximum length of a contiguous subarray with an equal number of 0 and 1.

**How to Apply Prefix State:**
- Transform: treat 0 as -1, 1 as +1
- Find longest subarray with sum = 0
- Store first occurrence of each prefix sum

---

### Problem 3: Subarray Sums Divisible by K

**Problem:** [LeetCode 974 - Subarray Sums Divisible by K](https://leetcode.com/problems/subarray-sums-divisible-by-k/)

**Description:** Given an integer array `nums` and an integer `k`, return the number of non-empty subarrays that have a sum divisible by `k`.

**How to Apply Prefix State:**
- Store prefix_sum % k in hash map
- Handle negative mods by adding k
- Count pairs with same remainder

---

### Problem 4: Longest Well-Performing Interval

**Problem:** [LeetCode 1124 - Longest Well-Performing Interval](https://leetcode.com/problems/longest-well-performing-interval/)

**Description:** We consider a day as "tiring" if hours > 8. Return the length of the longest well-performing interval (more tiring than non-tiring days).

**How to Apply Prefix State:**
- Transform: tiring day = +1, non-tiring = -1
- Find longest subarray with sum > 0
- Variation: use monotonic stack + prefix state hybrid

---

## Video Tutorial Links

### Fundamentals

- [Prefix Sum and Hash Map Pattern](https://www.youtube.com/watch?v=hLCiWw_4CMI) - NeetCode explanation
- [Subarray Sum Problems Explained](https://www.youtube.com/watch?v=QM0klnvTQjg) - Comprehensive tutorial
- [Hash Map Patterns for Arrays](https://www.youtube.com/watch?v=F95z5Wq9s7c) - Coding pattern overview

### Problem-Specific

- [LeetCode 560 Solution](https://www.youtube.com/watch?v=HbbYPQc-Oo4) - Subarray Sum Equals K
- [LeetCode 525 Solution](https://www.youtube.com/watch?v=6GjNho_9M0c) - Contiguous Array
- [LeetCode 974 Solution](https://www.youtube.com/watch?v=5ymzG4tFEnY) - Divisible by K

---

## Follow-up Questions

### Q1: Why do we initialize the hash map with {0: 1}?

**Answer:** The prefix sum of an empty subarray is 0. Initializing with {0: 1} accounts for subarrays that start from index 0. Without this, we would miss subarrays where the sum equals k starting from the beginning of the array.

### Q2: Can this pattern handle negative numbers?

**Answer:** Yes! Unlike sliding window which requires positive numbers, prefix state map works with any integers including negatives. The hash map stores all prefix sums regardless of sign.

### Q3: What if we need to find the actual subarray, not just count?

**Answer:** Store indices in the hash map instead of counts. When you find a match, the subarray is from `prefix_map[target] + 1` to current index.

### Q4: How does this compare to segment trees for range queries?

**Answer:** Prefix state is for static arrays with O(n) preprocessing. Segment trees support dynamic updates with O(log n) per query. Use prefix state for one-pass problems, segment trees when elements change.

### Q5: Can we optimize space for the divisible by k problem?

**Answer:** Yes! Since remainders are always in [0, k-1], we can use an array of size k instead of a hash map, achieving O(k) space regardless of n.

---

## Summary

The Prefix State Map pattern is an essential technique for solving subarray problems efficiently. By maintaining a running state and using hash map lookups, we transform O(n²) brute-force solutions into O(n) elegant algorithms.

**Key Takeaways:**

1. **Core Equation**: `sum(i..j) = prefix[j] - prefix[i]` enables O(1) subarray sum queries
2. **Hash Map Storage**: Enables instant lookup of required complement states
3. **Initialization Matters**: Always include base case (usually empty subarray)
4. **Versatility**: Works with sums, mods, differences, and custom state functions
5. **Negative Numbers**: Unlike sliding window, handles negative integers seamlessly

**When to Use:**
- Subarray sum problems with arbitrary integers
- Counting subarrays with specific properties
- Finding optimal-length subarrays
- Divisibility and modular arithmetic problems
- Binary array balance problems (equal 0s and 1s)

This pattern frequently appears in technical interviews and competitive programming, making it a fundamental tool in any programmer's algorithmic toolkit.
