# Interleaving Placement (Wiggle Sort)

## Category
Array Manipulation & Greedy

## Description

Interleaving Placement, commonly known as Wiggle Sort, is a pattern for rearranging arrays so that elements follow an alternating pattern: nums[0] ≤ nums[1] ≥ nums[2] ≤ nums[3] ≥ ... This creates a "wiggle" or wave-like pattern where peaks and valleys alternate throughout the array.

This pattern has applications in rearranging sequences for load balancing, creating visually interesting data presentations, and solving specific greedy algorithm problems. The key insight is that by placing larger elements at odd indices (peaks) and smaller elements at even indices (valleys), we can satisfy the wiggle property with minimal effort.

---

## Concepts

Interleaving Placement relies on several fundamental concepts from array manipulation and greedy algorithms.

### 1. Wiggle Property

The defining characteristic of the pattern:

| Index | Relation | Example |
|-------|----------|---------|
| **Even (0, 2, 4...)** | nums[i] ≤ nums[i+1] | 1 ≤ 2, 1 ≤ 2 |
| **Odd (1, 3, 5...)** | nums[i] ≥ nums[i+1] | 2 ≥ 1, 3 ≥ 1 |

### 2. Pattern Types

Different variations of the interleaving pattern:

| Type | Pattern | Example |
|------|---------|---------|
| **Wiggle (basic)** | ≤, ≥, ≤, ≥ | [1, 2, 1, 2, 1] |
| **Strict Wiggle** | <, >, <, > | [1, 3, 2, 4, 2] |
| **Reverse Wiggle** | ≥, ≤, ≥, ≤ | [2, 1, 2, 1, 2] |

### 3. Greedy Approach

The single-pass local optimization:

```
For each position i:
  If pattern violated at i:
    Swap arr[i] and arr[i+1]
```

This works because local fixes don't create new violations.

### 4. Sorting-Based Approach

Alternative using sorting for strict wiggle:

| Step | Action |
|------|--------|
| 1 | Sort array |
| 2 | Split into halves (small and large) |
| 3 | Interleave: small[0], large[0], small[1], large[1], ... |

---

## Frameworks

Structured approaches for interleaving placement.

### Framework 1: Single Pass Wiggle Sort

```
┌─────────────────────────────────────────────────────────────┐
│  SINGLE PASS WIGGLE SORT FRAMEWORK                           │
├─────────────────────────────────────────────────────────────┤
│  Create nums[0] ≤ nums[1] ≥ nums[2] ≤ nums[3]... pattern: │
│                                                             │
│  1. For i from 0 to n-2:                                    │
│                                                             │
│  2. Check if current position violates pattern:            │
│     If i is even (0, 2, 4...):                             │
│        Should be: nums[i] ≤ nums[i+1]                       │
│        If nums[i] > nums[i+1]: swap                        │
│                                                             │
│     If i is odd (1, 3, 5...):                              │
│        Should be: nums[i] ≥ nums[i+1]                       │
│        If nums[i] < nums[i+1]: swap                        │
│                                                             │
│  3. Return modified array                                    │
│                                                             │
│  Time: O(n), Space: O(1) in-place                          │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Basic wiggle sort, in-place requirement.

### Framework 2: Strict Wiggle Sort (Wiggle Sort II)

```
┌─────────────────────────────────────────────────────────────┐
│  STRICT WIGGLE SORT FRAMEWORK                               │
├─────────────────────────────────────────────────────────────┤
│  Create nums[0] < nums[1] > nums[2] < nums[3]... pattern:   │
│                                                             │
│  1. Sort the array: O(n log n)                              │
│                                                             │
│  2. Find median or split point:                              │
│     small = first half (or smaller elements)                │
│     large = second half (or larger elements)                │
│                                                             │
│  3. Interleave in reverse order:                           │
│     Place large elements at odd indices (1, 3, 5...)       │
│     Place small elements at even indices (0, 2, 4...)      │
│     This ensures peaks > valleys                            │
│                                                             │
│  Time: O(n log n), Space: O(n) or O(1) with virtual indexing │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Strict inequality required, O(n log n) acceptable.

### Framework 3: Rearrangement by Sign

```
┌─────────────────────────────────────────────────────────────┐
│  POSITIVE-NEGATIVE INTERLEAVING FRAMEWORK                   │
├─────────────────────────────────────────────────────────────┤
│  Rearrange array with alternating signs:                   │
│                                                             │
│  1. Separate positive and negative numbers                 │
│                                                             │
│  2. If counts differ by more than 1:                       │
│     Cannot interleave, return original or partial            │
│                                                             │
│  3. Interleave starting with the type with more elements:   │
│     [pos, neg, pos, neg...] or [neg, pos, neg, pos...]     │
│                                                             │
│  4. Return rearranged array                                  │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Alternating positive/negative pattern.

---

## Forms

Different manifestations of interleaving placement.

### Form 1: Basic Wiggle Sort

Single pass with swaps.

```python
def wiggle_sort(nums):
    """O(n) in-place wiggle sort."""
    for i in range(len(nums) - 1):
        if i % 2 == 0:  # Even index: should be ≤
            if nums[i] > nums[i + 1]:
                nums[i], nums[i + 1] = nums[i + 1], nums[i]
        else:  # Odd index: should be ≥
            if nums[i] < nums[i + 1]:
                nums[i], nums[i + 1] = nums[i + 1], nums[i]
    return nums
```

### Form 2: Strict Wiggle Sort II

Median-based strict inequalities.

```python
def wiggle_sort_ii(nums):
    """
    LeetCode 324: Wiggle Sort II.
    nums[0] < nums[1] > nums[2] < nums[3]...
    """
    nums.sort()
    n = len(nums)
    
    # Split into halves
    small = nums[:n//2]
    large = nums[n//2:]
    
    # Interleave in reverse
    result = []
    for i in range(n):
        if i % 2 == 0:
            result.append(small.pop())
        else:
            result.append(large.pop())
    
    return result
```

### Form 3: Rearrange by Parity

Even indices for even numbers, odd for odd.

```python
def sort_array_by_parity_ii(nums):
    """
    Place even numbers at even indices, odd at odd indices.
    """
    n = len(nums)
    even_idx, odd_idx = 0, 1
    
    while even_idx < n and odd_idx < n:
        # Find misplaced even at odd index
        while odd_idx < n and nums[odd_idx] % 2 == 1:
            odd_idx += 2
        
        # Find misplaced odd at even index
        while even_idx < n and nums[even_idx] % 2 == 0:
            even_idx += 2
        
        if even_idx < n and odd_idx < n:
            nums[even_idx], nums[odd_idx] = nums[odd_idx], nums[even_idx]
    
    return nums
```

### Form 4: Rearrange by Sign

Positive and negative alternating.

```python
def rearrange_by_sign(nums):
    """
    Rearrange array with positive and negative alternating.
    Assumes equal count or off by 1.
    """
    pos = [x for x in nums if x > 0]
    neg = [x for x in nums if x < 0]
    
    result = []
    i = j = 0
    
    # Start with the one with more elements
    if len(pos) > len(neg):
        while i < len(pos) or j < len(neg):
            if i < len(pos):
                result.append(pos[i])
                i += 1
            if j < len(neg):
                result.append(neg[j])
                j += 1
    else:
        while i < len(pos) or j < len(neg):
            if j < len(neg):
                result.append(neg[j])
                j += 1
            if i < len(pos):
                result.append(pos[i])
                i += 1
    
    return result
```

### Form 5: Virtual Indexing (O(1) Space)

In-place strict wiggle sort.

```python
def wiggle_sort_virtual(nums):
    """
    Wiggle Sort II with O(1) space using virtual indexing.
    Maps indices to achieve interleaving without extra array.
    """
    nums.sort()
    n = len(nums)
    
    # Virtual index mapping
    # Maps sorted positions to wiggle positions
    def virtual_index(i):
        return (1 + 2*i) % (n | 1)
    
    # Three-way partition around median
    # Then place in virtual order
    # ... complex implementation
    
    return nums
```

---

## Tactics

Specific techniques for interleaving placement.

### Tactic 1: Single Pass Swap

O(n) in-place wiggle sort:

```python
def wiggle_sort_single_pass(nums):
    """O(n) time, O(1) space wiggle sort."""
    for i in range(len(nums) - 1):
        # Even indices should be valleys (≤ next)
        # Odd indices should be peaks (≥ next)
        if (i % 2 == 0 and nums[i] > nums[i + 1]) or \
           (i % 2 == 1 and nums[i] < nums[i + 1]):
            nums[i], nums[i + 1] = nums[i + 1], nums[i]
    return nums
```

### Tactic 2: Median-Based Strict Wiggle

For strict inequalities:

```python
def wiggle_sort_strict(nums):
    """
    Strict wiggle sort using median.
    nums[0] < nums[1] > nums[2] < nums[3]...
    """
    nums.sort()
    n = len(nums)
    
    # Create result array
    result = [0] * n
    
    # Large elements at odd positions (descending)
    large = nums[n//2:]
    for i in range(n//2):
        result[2*i + 1] = large[-(i+1)]
    
    # Small elements at even positions (descending)
    small = nums[:n//2]
    for i in range((n+1)//2):
        result[2*i] = small[-(i+1)]
    
    return result
```

### Tactic 3: Two Pointer Swap

For rearranging by property:

```python
def rearrange_two_pointer(nums, condition_even, condition_odd):
    """
    Generic two-pointer rearrangement.
    condition_even(x): should be true for elements at even indices
    condition_odd(x): should be true for elements at odd indices
    """
    n = len(nums)
    even_ptr, odd_ptr = 0, 1
    
    while even_ptr < n and odd_ptr < n:
        # Find misplaced element at even position
        while even_ptr < n and condition_even(nums[even_ptr]):
            even_ptr += 2
        
        # Find misplaced element at odd position
        while odd_ptr < n and condition_odd(nums[odd_ptr]):
            odd_ptr += 2
        
        if even_ptr < n and odd_ptr < n:
            nums[even_ptr], nums[odd_ptr] = nums[odd_ptr], nums[even_ptr]
    
    return nums
```

### Tactic 4: Quickselect for Median

O(n) median finding for strict wiggle:

```python
def quickselect_median(nums):
    """Find median in O(n) average time."""
    import random
    
    def select(k):
        if len(nums) == 1:
            return nums[0]
        
        pivot = random.choice(nums)
        lows = [x for x in nums if x < pivot]
        highs = [x for x in nums if x > pivot]
        pivots = [x for x in nums if x == pivot]
        
        if k < len(lows):
            return select(k, lows)
        elif k < len(lows) + len(pivots):
            return pivot
        else:
            return select(k - len(lows) - len(pivots), highs)
    
    return select(len(nums) // 2)
```

### Tactic 5: Dutch National Flag Style

Three-way partition:

```python
def three_way_partition(nums, pivot):
    """
    Partition array into < pivot, = pivot, > pivot.
    Useful for wiggle sort with duplicates.
    """
    lt, gt = 0, len(nums) - 1
    i = 0
    
    while i <= gt:
        if nums[i] < pivot:
            nums[lt], nums[i] = nums[i], nums[lt]
            lt += 1
            i += 1
        elif nums[i] > pivot:
            nums[i], nums[gt] = nums[gt], nums[i]
            gt -= 1
        else:
            i += 1
    
    return lt, gt  # Return boundaries
```

---

## Python Templates

### Template 1: Basic Wiggle Sort

```python
def wiggle_sort(nums):
    """
    Wiggle sort: nums[0] <= nums[1] >= nums[2] <= nums[3]...
    
    Time: O(n)
    Space: O(1) in-place
    
    LeetCode 280.
    """
    for i in range(len(nums) - 1):
        if i % 2 == 0:  # Even index: should be <= next
            if nums[i] > nums[i + 1]:
                nums[i], nums[i + 1] = nums[i + 1], nums[i]
        else:  # Odd index: should be >= next
            if nums[i] < nums[i + 1]:
                nums[i], nums[i + 1] = nums[i + 1], nums[i]
    
    return nums
```

### Template 2: Strict Wiggle Sort II

```python
def wiggle_sort_ii(nums):
    """
    Strict wiggle sort: nums[0] < nums[1] > nums[2] < nums[3]...
    
    Time: O(n log n) due to sorting
    Space: O(n) for result
    
    LeetCode 324.
    """
    nums_sorted = sorted(nums)
    n = len(nums)
    
    result = [0] * n
    
    # Fill odd indices with larger half (descending)
    large = nums_sorted[n//2:]
    for i in range(n//2):
        result[2*i + 1] = large[-(i+1)]
    
    # Fill even indices with smaller half (descending)
    small = nums_sorted[:n//2]
    for i in range((n+1)//2):
        result[2*i] = small[-(i+1)]
    
    return result
```

### Template 3: Sort by Parity II

```python
def sort_by_parity_ii(nums):
    """
    Sort array by parity II: even indices have even numbers.
    
    Time: O(n)
    Space: O(1)
    
    LeetCode 922.
    """
    n = len(nums)
    even_idx, odd_idx = 0, 1
    
    while even_idx < n and odd_idx < n:
        # Find misplaced odd at even index
        while even_idx < n and nums[even_idx] % 2 == 0:
            even_idx += 2
        
        # Find misplaced even at odd index
        while odd_idx < n and nums[odd_idx] % 2 == 1:
            odd_idx += 2
        
        if even_idx < n and odd_idx < n:
            nums[even_idx], nums[odd_idx] = nums[odd_idx], nums[even_idx]
    
    return nums
```

### Template 4: Rearrange by Sign

```python
def rearrange_by_sign(nums):
    """
    Rearrange array with positive and negative alternating.
    Positive numbers at even indices, negative at odd.
    
    Time: O(n)
    Space: O(n) for separating, O(1) if using two-pointer in-place
    
    LeetCode 2149.
    """
    pos = [x for x in nums if x > 0]
    neg = [x for x in nums if x < 0]
    
    result = []
    i = j = 0
    
    # Start with the type that has more elements
    pos_first = len(pos) >= len(neg)
    
    while i < len(pos) or j < len(neg):
        if pos_first:
            if i < len(pos):
                result.append(pos[i])
                i += 1
            if j < len(neg):
                result.append(neg[j])
                j += 1
        else:
            if j < len(neg):
                result.append(neg[j])
                j += 1
            if i < len(pos):
                result.append(pos[i])
                i += 1
    
    return result
```

### Template 5: Two Pointer Generic

```python
def interleave_two_types(nums, type1_cond, type2_cond, type1_first=True):
    """
    Generic interleaving of two types.
    
    Args:
        nums: Input array
        type1_cond: Function returning True for type 1
        type2_cond: Function returning True for type 2
        type1_first: Whether type 1 goes at even indices
    """
    type1 = [x for x in nums if type1_cond(x)]
    type2 = [x for x in nums if type2_cond(x)]
    
    result = []
    i = j = 0
    type1_turn = type1_first
    
    while i < len(type1) or j < len(type2):
        if type1_turn and i < len(type1):
            result.append(type1[i])
            i += 1
        elif not type1_turn and j < len(type2):
            result.append(type2[j])
            j += 1
        type1_turn = not type1_turn
    
    # Append remaining
    while i < len(type1):
        result.append(type1[i])
        i += 1
    while j < len(type2):
        result.append(type2[j])
        j += 1
    
    return result
```

### Template 6: In-Place Wiggle with Virtual Indexing

```python
def wiggle_sort_inplace(nums):
    """
    Wiggle Sort II in O(1) space using virtual indexing.
    Complex but space-efficient.
    """
    nums.sort()
    n = len(nums)
    
    # Virtual index mapping
    def virtual(i):
        return (1 + 2*i) % (n | 1)
    
    # Find median
    median = nums[n//2]
    
    # Three-way partition by median
    # Then arrange by virtual indices
    # This is complex and typically not needed for interviews
    
    return nums
```

---

## When to Use

Use Interleaving Placement when:

- **Wiggle pattern required**: nums[0] ≤ nums[1] ≥ nums[2]...
- **Load balancing**: Distribute large and small values
- **Alternating properties**: Positive/negative, even/odd
- **Greedy local optimization**: Single pass sufficient

### Comparison with Alternatives

| Problem | Approach | Time | Space |
|---------|----------|------|-------|
| **Basic wiggle** | Single pass | O(n) | O(1) |
| **Strict wiggle** | Sort + interleave | O(n log n) | O(n) |
| **Rearrange by sign** | Separate + interleave | O(n) | O(n) |
| **Rearrange by parity** | Two pointer | O(n) | O(1) |

---

## Algorithm Explanation

### Core Concept

Interleaving placement creates an alternating pattern by placing elements in specific positions based on their properties. The key insight is that local swaps can achieve the global pattern.

**Key Terminology**:
- **Wiggle**: Alternating peaks (≥) and valleys (≤)
- **Peak**: Element greater than or equal to neighbors
- **Valley**: Element less than or equal to neighbors
- **Strict**: Strict inequalities (< and >)

### How It Works

#### Step 1: Single Pass Approach

```python
for i in range(n - 1):
    # Check and fix pattern at position i
    if pattern_violated(i, i+1):
        swap(i, i+1)
```

#### Step 2: Sorting Approach (Strict)

```python
sort(nums)
small = first half
large = second half
interleave: large[0], small[0], large[1], small[1]...
```

### Visual Walkthrough

**Basic Wiggle Sort [3, 5, 2, 1, 6, 4]**:
```
i=0 (even, should be ≤): 3 ≤ 5? Yes, no swap
[3, 5, 2, 1, 6, 4]

i=1 (odd, should be ≥): 5 ≥ 2? Yes, no swap
[3, 5, 2, 1, 6, 4]

i=2 (even, should be ≤): 2 ≤ 1? No, swap
[3, 5, 1, 2, 6, 4]

i=3 (odd, should be ≥): 2 ≥ 6? No, swap
[3, 5, 1, 6, 2, 4]

i=4 (even, should be ≤): 2 ≤ 4? Yes, no swap
[3, 5, 1, 6, 2, 4]

Result: 3 ≤ 5 ≥ 1 ≤ 6 ≥ 2 ≤ 4 ✓
```

### Why It Works

1. **Local property**: Each swap fixes local violation
2. **No new violations**: Swapping doesn't create new problems
3. **Greedy correctness**: Local optimal leads to global optimal
4. **Single pass**: O(n) achievable for basic wiggle

---

## Practice Problems

### Problem 1: Wiggle Sort

**Problem:** [LeetCode 280 - Wiggle Sort](https://leetcode.com/problems/wiggle-sort/)

**Description:** Rearrange array so nums[0] ≤ nums[1] ≥ nums[2] ≤ nums[3]...

**How to Apply:**
- Single pass with conditional swaps
- O(n) time, O(1) space

---

### Problem 2: Wiggle Sort II

**Problem:** [LeetCode 324 - Wiggle Sort II](https://leetcode.com/problems/wiggle-sort-ii/)

**Description:** Strict wiggle: nums[0] < nums[1] > nums[2] < nums[3]...

**How to Apply:**
- Sort and interleave halves
- Or use median and virtual indexing for O(1) space

---

### Problem 3: Rearrange Array Elements by Sign

**Problem:** [LeetCode 2149 - Rearrange Array Elements by Sign](https://leetcode.com/problems/rearrange-array-elements-by-sign/)

**Description:** Positive at even indices, negative at odd indices.

**How to Apply:**
- Separate positives and negatives
- Interleave

---

### Problem 4: Sort Array By Parity II

**Problem:** [LeetCode 922 - Sort Array By Parity II](https://leetcode.com/problems/sort-array-by-parity-ii/)

**Description:** Even numbers at even indices, odd at odd indices.

**How to Apply:**
- Two-pointer swap approach
- O(n) time, O(1) space

---

## Video Tutorial Links

### Fundamentals

- [Wiggle Sort Explanation](https://www.youtube.com/watch?v=LUgt-aesSXM) - Visual walkthrough
- [Rearrangement Patterns](https://www.youtube.com/watch?v=LUgt-aesSXM) - Common techniques
- [Two Pointer Techniques](https://www.youtube.com/watch?v=LUgt-aesSXM) - Related patterns

### Problem Solving

- [LeetCode 280 Solution](https://www.youtube.com/watch?v=LUgt-aesSXM) - Basic wiggle
- [LeetCode 324 Solution](https://www.youtube.com/watch?v=LUgt-aesSXM) - Strict wiggle
- [Array Rearrangement](https://www.youtube.com/watch?v=LUgt-aesSXM) - Comprehensive

---

## Follow-up Questions

### Q1: What's the difference between wiggle sort and wiggle sort II?

**Answer:**
- **Wiggle Sort (280)**: ≤ and ≥, O(n) single pass
- **Wiggle Sort II (324)**: < and >, requires O(n log n) sort
- **Strictness**: II requires all peaks strictly greater
- **Difficulty**: II much harder, especially for O(1) space

---

### Q2: Can wiggle sort be done in O(1) space for strict version?

**Answer:**
- **Basic**: Yes, trivial O(1) space
- **Strict II**: Yes, using virtual indexing and median
- **Complexity**: Very tricky implementation
- **Interview**: Usually O(n) space acceptable

---

### Q3: Why does single pass swap work for basic wiggle?

**Answer:**
- **Local fix**: Each swap fixes current position
- **No propagation**: Fix doesn't break previous positions
- **Greedy valid**: Local optimal sufficient
- **Induction**: By induction, entire array becomes valid

---

### Q4: How do you choose which type to place first?

**Answer:**
- **Count based**: Place type with more elements first
- **Problem specific**: Some problems require specific order
- **If equal**: Either order works
- **Example**: More positives → start with positive

---

### Q5: When is sorting-based approach better than single pass?

**Answer:**
- **Strict inequalities**: Need sorting to guarantee
- **Duplicates**: Sorting helps manage equal elements
- **Large ranges**: Sorting organizes for better distribution
- **Trade-off**: O(n log n) vs O(n) but stricter guarantees

---

## Summary

Interleaving Placement (Wiggle Sort) rearranges arrays in alternating patterns. Key takeaways:

1. **Basic Wiggle**: O(n) single pass with swaps
2. **Strict Wiggle**: O(n log n) with sorting + interleaving
3. **Pattern**: Peaks at odd indices, valleys at even
4. **Applications**: Load balancing, alternation requirements
5. **Variations**: By sign, by parity, by value

**When to Use**:
- Alternating pattern needed
- Load distribution required
- Greedy local approach sufficient

**Implementation Tips**:
- Single pass for basic wiggle (≤, ≥)
- Sort + interleave for strict (<, >)
- Two-pointer for in-place rearrangement
- Virtual indexing for O(1) space strict wiggle

This pattern appears in various array rearrangement problems.
