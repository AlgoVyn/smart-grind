# Subset Generation with Bits

## Category
Bit Manipulation

## Description

Subset generation using bit manipulation is an elegant technique that leverages the relationship between binary numbers and subsets. For a set of n elements, there are exactly 2^n possible subsets. This method provides a clean, iterative approach to generating all subsets without recursion, making it particularly efficient and easy to understand.

The core insight is that binary numbers naturally enumerate all possible combinations - each unique bit pattern corresponds to a unique subset, where the presence or absence of each element is determined by whether its corresponding bit is 0 or 1. This direct mapping between binary representation and set membership makes bit manipulation one of the most intuitive approaches to subset generation.

---

## Concepts

### 1. Binary-Subset Correspondence

The fundamental concept is the direct mapping between binary numbers and subsets:

| Bit Position | Binary Representation | Element Included |
|--------------|----------------------|------------------|
| 0 (LSB) | 0001 | nums[0] |
| 1 | 0010 | nums[1] |
| 2 | 0100 | nums[2] |
| 3 | 1000 | nums[3] |
| i | 1 << i | nums[i] |

### 2. Mask Enumeration

For n elements, we iterate through all masks from 0 to 2^n - 1:

| Mask (decimal) | Mask (binary) | Subset Generated |
|----------------|---------------|------------------|
| 0 | 000 | [] |
| 1 | 001 | [nums[0]] |
| 2 | 010 | [nums[1]] |
| 3 | 011 | [nums[0], nums[1]] |
| 4 | 100 | [nums[2]] |
| 5 | 101 | [nums[0], nums[2]] |
| 6 | 110 | [nums[1], nums[2]] |
| 7 | 111 | [nums[0], nums[1], nums[2]] |

### 3. Bit Checking

To check if element i is included in subset represented by mask:

```python
if mask & (1 << i):  # Bit i is set
    subset.append(nums[i])
```

| Operation | Meaning | Example |
|-----------|---------|---------|
| `1 << i` | Create bit mask with only bit i set | `1 << 2` = 4 (100) |
| `mask & (1 << i)` | Check if bit i is set in mask | `5 & 4` = 4 (non-zero = True) |
| `mask \| (1 << i)` | Set bit i in mask | `3 \| 4` = 7 (111) |
| `mask & ~(1 << i)` | Clear bit i in mask | `7 & ~4` = 3 (011) |

### 4. Subset Size Filtering

Count set bits to filter subsets by size:

```python
if bin(mask).count('1') == k:  # Exactly k elements
    # or: if mask.bit_count() == k:  # Python 3.8+
    process_subset(mask)
```

---

## Frameworks

### Framework 1: Basic Subset Generation

```
┌─────────────────────────────────────────────────────────────┐
│  BASIC SUBSET GENERATION FRAMEWORK                          │
├─────────────────────────────────────────────────────────────┤
│  1. Let n = length of input array                          │
│  2. Calculate total = 1 << n (equals 2^n)                   │
│  3. For mask from 0 to total - 1:                          │
│     a. Create empty subset list                           │
│     b. For i from 0 to n-1:                               │
│        - If mask & (1 << i): add nums[i] to subset        │
│     c. Add subset to result list                          │
│  4. Return result                                          │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Standard subset generation, n ≤ 20.

### Framework 2: Optimized Bit Iteration

```
┌─────────────────────────────────────────────────────────────┐
│  OPTIMIZED BIT ITERATION FRAMEWORK                          │
├─────────────────────────────────────────────────────────────┤
│  1. For each mask from 0 to 2^n - 1:                        │
│     a. subset = []                                         │
│     b. bit = mask, idx = 0                                │
│     c. While bit > 0:                                     │
│        - If bit & 1: add nums[idx] to subset              │
│        - bit >>= 1, idx += 1                               │
│     d. Add subset to result                                │
│  2. Return result                                          │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: When average subset size is much smaller than n.

### Framework 3: Subset Size Filtering

```
┌─────────────────────────────────────────────────────────────┐
│  SIZE-FILTERED SUBSET FRAMEWORK                             │
├─────────────────────────────────────────────────────────────┤
│  1. Let k = target subset size                             │
│  2. For mask from 0 to 2^n - 1:                            │
│     a. If bit_count(mask) != k: skip                      │
│     b. Build subset from mask (only k elements)           │
│     c. Add subset to result                                │
│  3. Return result                                          │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Need only subsets of specific size (combinations).

---

## Forms

### Form 1: Complete Power Set

Generate all 2^n subsets including empty set:

```
Input: [1, 2, 3]
Output: [[], [1], [2], [1,2], [3], [1,3], [2,3], [1,2,3]]

Mask: 0 (000) → []
Mask: 1 (001) → [1]
Mask: 2 (010) → [2]
Mask: 3 (011) → [1,2]
Mask: 4 (100) → [3]
Mask: 5 (101) → [1,3]
Mask: 6 (110) → [2,3]
Mask: 7 (111) → [1,2,3]
```

### Form 2: Non-Empty Subsets Only

Skip mask = 0 to exclude empty set:

```python
for mask in range(1, 1 << n):  # Start from 1, not 0
    # Generate subset
```

### Form 3: Subsets of Size k (Combinations)

Filter by bit count:

```
Input: [1, 2, 3, 4], k = 2
Output: [[1,2], [1,3], [1,4], [2,3], [2,4], [3,4]]

Mask: 3  (0011) → bit_count = 2 → [1,2]
Mask: 5  (0101) → bit_count = 2 → [1,3]
Mask: 6  (0110) → bit_count = 2 → [2,3]
Mask: 9  (1001) → bit_count = 2 → [1,4]
Mask: 10 (1010) → bit_count = 2 → [2,4]
Mask: 12 (1100) → bit_count = 2 → [3,4]
```

### Form 4: Subsets with Target Sum

Filter during generation:

```
Input: [1, 2, 3], target = 3
Output: [[1,2], [3]]

Mask: 3 (011) → sum = 1+2 = 3 ✓
Mask: 4 (100) → sum = 3 = 3 ✓
```

---

## Tactics

### Tactic 1: Bit Iteration Optimization

Instead of checking all n bits, iterate only through set bits:

```python
def subsets_bit_optimized(nums: list[int]) -> list[list[int]]:
    """Optimized: iterate only through set bits."""
    n = len(nums)
    result = []
    
    for mask in range(1 << n):
        subset = []
        bit = mask
        idx = 0
        while bit:
            if bit & 1:
                subset.append(nums[idx])
            bit >>= 1
            idx += 1
        result.append(subset)
    
    return result
```

**Performance**: O(2^n × k) where k = average number of set bits (≈ n/2), vs O(2^n × n) for naive approach.

### Tactic 2: Using bit_count() for Size Filtering

```python
def subsets_of_size(nums: list[int], k: int) -> list[list[int]]:
    """Generate subsets of exactly size k."""
    n = len(nums)
    result = []
    
    for mask in range(1 << n):
        if mask.bit_count() == k:  # Python 3.8+
            subset = []
            for i in range(n):
                if mask & (1 << i):
                    subset.append(nums[i])
            result.append(subset)
    
    return result
```

### Tactic 3: Subsets with Sum Target

```python
def subsets_with_sum(nums: list[int], target: int) -> list[list[int]]:
    """Find all subsets that sum to target."""
    n = len(nums)
    result = []
    
    for mask in range(1 << n):
        subset = []
        current_sum = 0
        for i in range(n):
            if mask & (1 << i):
                current_sum += nums[i]
                subset.append(nums[i])
        
        if current_sum == target:
            result.append(subset)
    
    return result
```

### Tactic 4: Meet-in-the-Middle Optimization

For n up to 40, split array and combine:

```python
def subsets_meet_in_middle(nums: list[int]) -> list[int]:
    """Generate all subset sums using meet-in-the-middle."""
    n = len(nums)
    mid = n // 2
    
    # Generate all subset sums for left half
    left_sums = []
    for mask in range(1 << mid):
        s = 0
        for i in range(mid):
            if mask & (1 << i):
                s += nums[i]
        left_sums.append(s)
    
    # Generate all subset sums for right half
    right_sums = []
    for mask in range(1 << (n - mid)):
        s = 0
        for i in range(n - mid):
            if mask & (1 << i):
                s += nums[mid + i]
        right_sums.append(s)
    
    # Combine (example: count pairs with sum = target)
    return left_sums, right_sums
```

---

## Python Templates

### Template 1: Basic Subset Generation

```python
def subsets(nums: list[int]) -> list[list[int]]:
    """
    Generate all subsets using bit manipulation.
    Time: O(2^n × n)
    Space: O(1) auxiliary, O(2^n) for output
    """
    n = len(nums)
    result = []
    
    # There are 2^n subsets (from 0 to 2^n - 1)
    for mask in range(1 << n):
        subset = []
        for i in range(n):
            # Check if i-th bit is set in mask
            if mask & (1 << i):
                subset.append(nums[i])
        result.append(subset)
    
    return result
```

### Template 2: Optimized Bit Iteration

```python
def subsets_optimized(nums: list[int]) -> list[list[int]]:
    """
    Optimized version: iterate only through set bits.
    Time: O(2^n × k) where k is avg number of set bits
    Space: O(1) auxiliary
    """
    n = len(nums)
    result = []
    
    for mask in range(1 << n):
        subset = []
        bit = mask
        idx = 0
        while bit:
            if bit & 1:
                subset.append(nums[idx])
            bit >>= 1
            idx += 1
        result.append(subset)
    
    return result
```

### Template 3: Subsets of Specific Size

```python
def subsets_of_size(nums: list[int], k: int) -> list[list[int]]:
    """
    Generate subsets of exactly size k.
    Time: O(2^n × n)
    """
    n = len(nums)
    result = []
    
    for mask in range(1 << n):
        # Count bits - only include if exactly k bits are set
        if bin(mask).count('1') == k:
            subset = []
            for i in range(n):
                if mask & (1 << i):
                    subset.append(nums[i])
            result.append(subset)
    
    return result
```

### Template 4: Subsets with Target Sum

```python
def subsets_with_sum(nums: list[int], target: int) -> list[list[int]]:
    """
    Find all subsets that sum to target.
    Time: O(2^n × n)
    """
    n = len(nums)
    result = []
    
    for mask in range(1 << n):
        subset = []
        current_sum = 0
        for i in range(n):
            if mask & (1 << i):
                current_sum += nums[i]
                subset.append(nums[i])
        
        if current_sum == target:
            result.append(subset)
    
    return result
```

### Template 5: Check if Subset Sum Exists

```python
def has_subset_sum(nums: list[int], target: int) -> bool:
    """
    Check if any subset sums to target.
    Time: O(2^n)
    """
    n = len(nums)
    
    for mask in range(1 << n):
        current_sum = 0
        for i in range(n):
            if mask & (1 << i):
                current_sum += nums[i]
        
        if current_sum == target:
            return True
    
    return False
```

### Template 6: Minimum Subset Sum Difference

```python
def min_subset_sum_diff(nums: list[int]) -> int:
    """
    Find minimum difference between two subset sums.
    Partition array into two subsets with minimum sum difference.
    Time: O(2^n × n)
    """
    n = len(nums)
    total = sum(nums)
    min_diff = float('inf')
    
    for mask in range(1 << n):
        subset_sum = 0
        for i in range(n):
            if mask & (1 << i):
                subset_sum += nums[i]
        
        other_sum = total - subset_sum
        diff = abs(subset_sum - other_sum)
        min_diff = min(min_diff, diff)
    
    return min_diff
```

### Template 7: Count Subsets with Property

```python
def count_subsets_with_property(nums: list[int], predicate) -> int:
    """
    Count subsets satisfying a given predicate.
    predicate: function that takes (subset, mask) and returns bool
    """
    n = len(nums)
    count = 0
    
    for mask in range(1 << n):
        subset = []
        for i in range(n):
            if mask & (1 << i):
                subset.append(nums[i])
        
        if predicate(subset, mask):
            count += 1
    
    return count
```

### Template 8: Maximum XOR Subset

```python
def max_subset_xor(nums: list[int]) -> int:
    """
    Find maximum XOR value of any subset.
    Time: O(2^n)
    """
    n = len(nums)
    max_xor = 0
    
    for mask in range(1 << n):
        current_xor = 0
        for i in range(n):
            if mask & (1 << i):
                current_xor ^= nums[i]
        max_xor = max(max_xor, current_xor)
    
    return max_xor
```

---

## When to Use

Use the bit manipulation subset generation algorithm when you need to solve problems involving:

- **Small to Medium Input Sizes**: When n ≤ 20 (since 2^n subsets is manageable)
- **Iterative Generation**: When you prefer an iterative solution over recursive backtracking
- **Memory Efficiency**: When you need O(1) auxiliary space (excluding output)
- **Fixed Input Arrays**: When the array doesn't change and all subsets need to be enumerated
- **Subset Enumeration Problems**: When the problem requires checking all possible combinations

### Comparison with Alternatives

| Method | Time Complexity | Space Complexity | Best Use Case |
|--------|---------------|------------------|---------------|
| **Bit Manipulation** | O(2^n × n) | O(1) aux | Small n, iterative preferred |
| **Recursive Backtracking** | O(2^n × n) | O(n) stack | Large n, early pruning possible |
| **Iterative Building** | O(2^n × n) | O(2^n) | When building incrementally |
| **Lexicographic Order** | O(2^n × n) | O(n) | When specific ordering needed |

### When to Choose Bit Manipulation vs Recursive Backtracking

- **Choose Bit Manipulation** when:
  - The input size is small (n ≤ 20)
  - You need all subsets without filtering
  - You prefer clean, iterative code
  - Memory usage is a concern (no recursion stack)

- **Choose Recursive Backtracking** when:
  - You need to prune branches early
  - The input size is large but valid subsets are sparse
  - You need to track additional state during generation
  - The problem requires finding subsets that satisfy specific conditions

---

## Algorithm Explanation

### Core Concept

The fundamental insight behind subset generation with bits is the direct correspondence between binary numbers and subsets. For a set of n elements, we can represent each subset as an n-bit binary number where the i-th bit (from right, 0-indexed) corresponds to the i-th element.

### How It Works

#### Generation Process:
1. **Total Subsets**: There are 2^n subsets for n elements (from 0 to 2^n - 1)
2. **Iterate Through Masks**: For each number `mask` from 0 to 2^n - 1:
   - Check each bit position i from 0 to n-1
   - If bit i is set (mask & (1 << i) != 0), include nums[i] in the current subset
3. **Build Result**: Collect all subsets into the result list

#### Why Bit Manipulation Works:
- **Complete Coverage**: Binary numbers from 0 to 2^n-1 cover all possible combinations of n bits
- **No Duplicates**: Each binary number is unique, so each subset is generated exactly once
- **Direct Mapping**: The bit pattern directly tells us which elements to include
- **Efficient Checking**: The `&` operator checks a bit in O(1) time

### Visual Representation

For `nums = [1, 2, 3]`:

| Mask (decimal) | Mask (binary) | Subset Generated |
|----------------|---------------|------------------|
| 0 | 000 | [] |
| 1 | 001 | [1] |
| 2 | 010 | [2] |
| 3 | 011 | [1, 2] |
| 4 | 100 | [3] |
| 5 | 101 | [1, 3] |
| 6 | 110 | [2, 3] |
| 7 | 111 | [1, 2, 3] |

### Why It Works

The binary representation naturally enumerates all possible inclusion/exclusion patterns:
- Each of the n elements has 2 choices (include or exclude)
- Total combinations = 2 × 2 × ... × 2 (n times) = 2^n
- Binary numbers from 0 to 2^n-1 represent all these combinations uniquely

### Limitations

- **Exponential Output**: The number of subsets grows as 2^n, making it impractical for n > 20
- **No Early Pruning**: Unlike backtracking, you cannot skip invalid subsets mid-generation
- **Ordered Generation**: Subsets are generated in numerical order (by mask value), not lexicographically
- **Memory for Output**: Must store all 2^n subsets, each potentially of size n

---

## Practice Problems

### Problem 1: Subsets

**Problem:** [LeetCode 78 - Subsets](https://leetcode.com/problems/subsets/)

**Description:** Given an integer array `nums` of unique elements, return all possible subsets (the power set). The solution set must not contain duplicate subsets.

**How to Apply Bit Manipulation:**
- Use the bit manipulation technique to generate all 2^n subsets
- Each mask from 0 to 2^n-1 represents a unique subset

---

### Problem 2: Subsets II

**Problem:** [LeetCode 90 - Subsets II](https://leetcode.com/problems/subsets-ii/)

**Description:** Given an integer array `nums` that may contain duplicates, return all possible subsets (the power set) without duplicate subsets.

**How to Apply Bit Manipulation:**
- Sort the array first to group duplicates
- Use bit manipulation but skip masks that would create duplicate subsets
- Skip when current element equals previous AND previous bit is not selected

---

### Problem 3: Pascal's Triangle

**Problem:** [LeetCode 118 - Pascal's Triangle](https://leetcode.com/problems/pascals-triangle/)

**Description:** Given an integer `numRows`, generate the first numRows of Pascal's triangle.

**How to Apply Bit Manipulation:**
- Use bit manipulation principles to understand the combinatorial properties
- Each row's elements can be computed using binomial coefficients

---

### Problem 4: Minimize the Difference Between Target and Chosen Elements

**Problem:** [LeetCode 1981 - Minimize the Difference Between Target and Chosen Elements](https://leetcode.com/problems/minimize-the-difference-between-target-and-chosen-elements/)

**Description:** Given a matrix `mat` and target, choose one number from each row such that the difference between the chosen number and `target` is minimized.

**How to Apply Bit Manipulation:**
- Use bit manipulation to explore all possible combinations
- For small number of rows, 2^m represents all possible selections

---

### Problem 5: Closest Subset Sum Equal to Target

**Problem:** [LeetCode 1755 - Closest Subset Sum Equal to Target](https://leetcode.com/problems/closest-subset-sum-equal-to-target/)

**Description:** Given an array `nums` and `target`, return the size of the largest subset such that the sum of its elements is closest to `target`.

**How to Apply Bit Manipulation:**
- Split the array into two halves (meet-in-the-middle)
- Use bit manipulation to generate all possible sums for each half
- This reduces complexity from O(2^n) to O(2^(n/2))

---

## Video Tutorial Links

### Fundamentals

- [Subsets using Bit Manipulation (Take U Forward)](https://www.youtube.com/watch?v=AYM9lPK5W4I) - Comprehensive introduction to subset generation
- [Bit Manipulation for Subsets (WilliamFiset)](https://www.youtube.com/watch?v=1PKMPrZ2cK0) - Detailed explanation with visualizations
- [Generate All Subsets (NeetCode)](https://www.youtube.com/watch?v=1PKMPrZ2cK0) - Practical implementation guide

### Advanced Topics

- [Subsets II - Handling Duplicates](https://www.youtube.com/watch?v=XqDuR6f1W_M) - Managing duplicate elements
- [Meet in the Middle](https://www.youtube.com/watch?v=58C2UJ8wLis) - Optimization technique for large n
- [Bit Masking DP](https://www.youtube.com/watch?v=ozEuZuK2K4I) - Dynamic programming with bit masks

---

## Follow-up Questions

### Q1: What is the maximum input size for generating all subsets?

**Answer:** The practical maximum is n ≤ 20 because:
- 2^20 = 1,048,576 subsets
- Each subset can have up to 20 elements
- Total output size can be massive (millions of elements)
- For n > 20, consider meet-in-the-middle or backtracking with pruning

### Q2: How do you handle duplicate elements in the input array?

**Answer:** Two approaches:

1. **Skip duplicate subsets**: Sort the array, then skip masks that would create duplicate subsets (when nums[i] == nums[i-1] and previous bit not selected)

2. **Use a set**: Generate all subsets first, then use a set to remove duplicates (less efficient but simpler)

### Q3: Can bit manipulation be used for combinations instead of subsets?

**Answer:** Yes, by:
1. Generating all subsets first (2^n)
2. Filtering to only those with exactly k bits set
3. Or iterating through masks and checking `mask.bit_count() == k`

```python
for mask in range(1 << n):
    if mask.bit_count() == k:
        # This is a k-combination
        subset = [nums[i] for i in range(n) if mask & (1 << i)]
```

### Q4: How does bit manipulation compare to recursive backtracking?

**Answer:**

| Aspect | Bit Manipulation | Recursive Backtracking |
|--------|------------------|------------------------|
| **Code Complexity** | Simple, iterative | More complex, recursive |
| **Auxiliary Space** | O(1) | O(n) stack |
| **Early Pruning** | Cannot prune | Can prune early |
| **Flexibility** | Fixed pattern | More adaptable |
| **Best For** | Small n, all subsets | Large n, sparse valid subsets |

**Choice**: Use bit manipulation for small, dense cases; backtracking for large, sparse cases.

### Q5: What is meet-in-the-middle for subset problems?

**Answer:** A technique to handle n up to 40:
1. Split array into two halves (n/2 each)
2. Generate all subsets for each half (2^(n/2) each)
3. Combine results efficiently using hash maps or sorting
4. Reduces time from O(2^n) to O(2^(n/2)) ≈ O(2^20) for n=40

**Example**: For subset sum problem:
- Generate all subset sums from left half
- Generate all subset sums from right half
- For each left sum, find complement in right sums using hash map

---

## Summary

The bit manipulation subset generation technique is a fundamental algorithm in competitive programming and technical interviews.

### Key Takeaways

- **Direct Binary Mapping**: Each subset corresponds uniquely to a binary number from 0 to 2^n-1
- **Simple Implementation**: Clean, iterative code without recursion overhead
- **O(1) Auxiliary Space**: Only uses constant extra memory (excluding output)
- **Exponential Output**: Must handle 2^n subsets, limiting practical use to n ≤ 20
- **Easy Filtering**: Can easily filter by subset size or sum by checking each mask

### When to Use

- ✅ Small input sizes (n ≤ 20)
- ✅ When all subsets are needed
- ✅ When iterative solution is preferred
- ✅ Memory-constrained environments
- ❌ Large inputs (use meet-in-the-middle or backtracking)
- ❌ When only valid subsets needed (use backtracking with pruning)

### Common Operations

| Operation | Expression | Meaning |
|-----------|------------|---------|
| Check bit i | `mask & (1 << i)` | Is element i included? |
| Set bit i | `mask \| (1 << i)` | Include element i |
| Clear bit i | `mask & ~(1 << i)` | Exclude element i |
| Count bits | `mask.bit_count()` | Size of subset |

### Implementation Pattern

```python
for mask in range(1 << n):           # Iterate all 2^n masks
    subset = []
    for i in range(n):                # Check each bit
        if mask & (1 << i):           # Bit i is set
            subset.append(nums[i])    # Include element i
    process(subset)                   # Use the subset
```

This technique forms the foundation for many bit manipulation problems and is essential for anyone preparing for technical interviews or competitive programming.

### Related Algorithms

- Recursive Subset Generation - Backtracking approach
- Combinations - Selecting k elements
- Permutations - All possible arrangements
- Meet in the Middle - Optimization for large inputs
