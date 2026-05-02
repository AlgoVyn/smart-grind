# Meet in the Middle

## Category
Advanced Techniques

## Description

Meet in the Middle is an algorithmic technique that splits a problem into two halves, solves each half separately, and then combines the results to solve the original problem. This approach reduces the time complexity from O(2^n) to O(2^(n/2)) or O(2^(n/2) × n), making exponential problems with n ≈ 30-40 feasible.

The key insight is that solving two problems of size n/2 is exponentially easier than solving one problem of size n. By splitting the array into two halves, generating all possible subset sums for each half (2^(n/2) each), and combining them efficiently using sorting and binary search, we can solve problems that would otherwise require infeasible computation time. This technique is particularly powerful for subset sum, knapsack variations, and other NP-hard problems.

---

## Concepts

Meet in the Middle relies on several fundamental concepts to achieve its dramatic speedup.

### 1. The Split Strategy

Divide and conquer approach:

| Aspect | Without MITM | With MITM | Speedup |
|--------|--------------|-----------|---------|
| **n=20** | O(2^20) ≈ 1M | O(2^10) ≈ 1K | 1000x |
| **n=30** | O(2^30) ≈ 1B | O(2^15) ≈ 32K | 30,000x |
| **n=40** | O(2^40) ≈ 1T | O(2^20) ≈ 1M | 1,000,000x |

### 2. Combination Strategy

Efficiently combining the two halves:

| Method | Time | Space | Use Case |
|--------|------|-------|----------|
| **Sort + Binary Search** | O(2^(n/2) × n) | O(2^(n/2)) | Closest sum, existence |
| **Hash Map** | O(2^(n/2)) | O(2^(n/2)) | Counting problems |
| **Two Pointers** | O(2^(n/2)) | O(2^(n/2)) | Pairs summing to target |

### 3. When MITM Applies

Problems suitable for this technique:

| Problem Type | Example | Approach |
|--------------|---------|----------|
| **Subset Sum** | Find subset closest to target | Split, generate sums, binary search |
| **Knapsack** | Exact weight with constraints | Split, combine with constraints |
| **Counting** | Count subsets with property | Split, hash map counting |
| **Partition** | Divide into equal sum groups | Split, find complementary sums |

### 4. Complexity Analysis

Understanding the trade-offs:

| Operation | Complexity | Notes |
|-----------|------------|-------|
| **Generate left sums** | O(2^(n/2)) | Enumerate all subsets |
| **Generate right sums** | O(2^(n/2)) | Same for other half |
| **Sort** | O(2^(n/2) × n) | For binary search |
| **Combine** | O(2^(n/2) × n) | Binary search for each |
| **Total** | O(2^(n/2) × n) | Dramatic improvement! |

---

## Frameworks

Structured approaches for implementing Meet in the Middle.

### Framework 1: Closest Subset Sum

```
┌─────────────────────────────────────────────────────────────┐
│  CLOSEST SUBSET SUM FRAMEWORK                                 │
├─────────────────────────────────────────────────────────────┤
│  Input: Array nums, target goal                              │
│  Output: Minimum absolute difference from goal              │
│                                                                │
│  1. Split array into two halves:                            │
│     left = nums[0:n//2]                                        │
│     right = nums[n//2:]                                        │
│                                                                │
│  2. Generate all subset sums for each half:                 │
│     left_sums = get_all_sums(left)  // 2^(n/2) sums         │
│     right_sums = get_all_sums(right)  // 2^(n/2) sums       │
│                                                                │
│  3. Sort right_sums for binary search                        │
│                                                                │
│  4. For each sum in left_sums:                                │
│     remaining = goal - sum                                    │
│     Find closest in right_sums to remaining                   │
│     Update answer if better                                   │
│                                                                │
│  5. Return minimum difference found                           │
│                                                                │
│  Time: O(2^(n/2) × n), Space: O(2^(n/2))                    │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: LeetCode 1755, closest subsequence sum problems.

### Framework 2: Count Valid Subsets

```
┌─────────────────────────────────────────────────────────────┐
│  COUNT VALID SUBSETS FRAMEWORK                                │
├─────────────────────────────────────────────────────────────┤
│  Input: Array nums, target T                                   │
│  Output: Count of subsets with sum exactly T                 │
│                                                                │
│  1. Split array into two halves                               │
│                                                                │
│  2. Generate all subset sums with counts:                   │
│     left_counts = Counter of left sums                      │
│     right_counts = Counter of right sums                    │
│                                                                │
│  3. For each sum in left_counts:                            │
│     complement = T - sum                                      │
│     total += left_counts[sum] × right_counts[complement]    │
│                                                                │
│  4. Return total count                                        │
│                                                                │
│  Time: O(2^(n/2)), Space: O(2^(n/2))                        │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Counting problems, exact sum queries.

### Framework 3: Minimum Partition Difference

```
┌─────────────────────────────────────────────────────────────┐
│  MINIMUM PARTITION DIFFERENCE FRAMEWORK                       │
├─────────────────────────────────────────────────────────────┤
│  Input: Array nums to partition into two groups               │
│  Output: Minimum possible absolute difference of sums       │
│                                                                │
│  1. Split array into two halves                               │
│                                                                │
│  2. Generate all possible sums for each half:                 │
│     Can also track which elements used (bitmask)            │
│                                                                │
│  3. For each sum of first half:                             │
│     Find complement in second half that minimizes:          │
│       |sum1 - (total - sum2)| or similar                    │
│                                                                │
│  4. Return minimum difference found                           │
│                                                                │
│  Note: Can use to find partition into k groups with DP      │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: LeetCode 2035, partition array problems.

---

## Forms

Different manifestations of the Meet in the Middle pattern.

### Form 1: Closest to Target

Find subset sum closest to target value.

| Aspect | Details |
|--------|---------|
| **Goal** | Minimize \|sum - target\| |
| **Approach** | Binary search for complement |
| **Time** | O(2^(n/2) × n) |

### Form 2: Exact Target Count

Count subsets with sum exactly equal to target.

| Aspect | Details |
|--------|---------|
| **Goal** | Count valid subsets |
| **Approach** | Hash map of sums with counts |
| **Time** | O(2^(n/2)) |

### Form 3: Partition Optimization

Divide into k groups with optimal property.

| Aspect | Details |
|--------|---------|
| **Goal** | Minimize max sum or difference |
| **Approach** | Generate all, then DP on halves |
| **Time** | O(2^(n/2) × poly(n)) |

### Form 4: Constraint Satisfaction

Find subset satisfying complex constraints.

| Aspect | Details |
|--------|---------|
| **Goal** | Find valid subset |
| **Approach** | Split constraints across halves |
| **Complexity** | Varies by constraint |

### Form 5: 4-SUM Generalization

Find k elements summing to target.

| Aspect | Details |
|--------|---------|
| **Goal** | Find k elements with sum = target |
| **Approach** | Pairs from each half, then combine |
| **Use** | 4-SUM, k-SUM problems |

---

## Tactics

Specific techniques and optimizations.

### Tactic 1: Closest Subsequence Sum

Standard MITM for closest sum:

```python
from bisect import bisect_left

def min_abs_difference(nums, goal):
    """
    Closest Subsequence Sum (LeetCode 1755).
    Time: O(2^(n/2) × n), Space: O(2^(n/2))
    """
    n = len(nums)
    left, right = nums[:n//2], nums[n//2:]
    
    # Generate all subset sums
    def get_sums(arr):
        sums = [0]
        for num in arr:
            new_sums = [s + num for s in sums]
            sums.extend(new_sums)
        return sums
    
    left_sums = get_sums(left)
    right_sums = get_sums(right)
    
    # Sort for binary search
    right_sums.sort()
    
    ans = float('inf')
    
    for s in left_sums:
        remaining = goal - s
        # Find closest in right_sums
        idx = bisect_left(right_sums, remaining)
        
        if idx < len(right_sums):
            ans = min(ans, abs(remaining - right_sums[idx]))
        if idx > 0:
            ans = min(ans, abs(remaining - right_sums[idx - 1]))
    
    return ans
```

### Tactic 2: Optimized with Deduplication

Remove duplicates for speed:

```python
def closest_subset_sum_optimized(nums, goal):
    """Optimized with duplicate removal."""
    n = len(nums)
    
    def get_sums(arr):
        """Generate subset sums and remove duplicates."""
        sums = {0}
        for num in arr:
            new_sums = {s + num for s in sums}
            sums.update(new_sums)
        return sorted(sums)
    
    left_sums = get_sums(nums[:n//2])
    right_sums = get_sums(nums[n//2:])
    
    ans = float('inf')
    
    for s in left_sums:
        remaining = goal - s
        idx = bisect_left(right_sums, remaining)
        
        if idx < len(right_sums):
            ans = min(ans, abs(remaining - right_sums[idx]))
        if idx > 0:
            ans = min(ans, abs(remaining - right_sums[idx - 1]))
        
        if ans == 0:
            break
    
    return ans
```

### Tactic 3: Count Subsets with Given Sum

Count using hash maps:

```python
from collections import Counter

def count_subsets(nums, target):
    """
    Count subsets with sum exactly equal to target.
    Time: O(2^(n/2)), Space: O(2^(n/2))
    """
    n = len(nums)
    
    def get_counts(arr):
        """Generate all subset sums with counts."""
        counts = Counter([0])
        for num in arr:
            new_counts = Counter({s + num: c for s, c in counts.items()})
            counts.update(new_counts)
        return counts
    
    left_counts = get_counts(nums[:n//2])
    right_counts = get_counts(nums[n//2:])
    
    ans = 0
    for s, c1 in left_counts.items():
        ans += c1 * right_counts[target - s]
    
    return ans
```

### Tactic 4: Minimum Partition Difference

LeetCode 2035 style:

```python
def min_partition_difference(nums):
    """
    Partition into two arrays to minimize sum difference.
    LeetCode 2035.
    """
    n = len(nums)
    total = sum(nums)
    
    # Generate all possible sums for first half
    def get_sums(arr):
        sums = {0}
        for num in arr:
            new_sums = {s + num for s in sums}
            sums.update(new_sums)
        return sorted(sums)
    
    left_sums = get_sums(nums[:n//2])
    right_sums = get_sums(nums[n//2:])
    
    # For each possible sum of first half, find best complement
    ans = float('inf')
    for s1 in left_sums:
        # Want: s1 + s2 ≈ total / 2
        # So: s2 ≈ total/2 - s1
        target = total / 2 - s1
        
        # Find closest in right_sums
        idx = bisect_left(right_sums, target)
        if idx < len(right_sums):
            s2 = right_sums[idx]
            diff = abs((s1 + s2) - (total - s1 - s2))
            ans = min(ans, diff)
        if idx > 0:
            s2 = right_sums[idx - 1]
            diff = abs((s1 + s2) - (total - s1 - s2))
            ans = min(ans, diff)
    
    return ans
```

### Tactic 5: Bitmask Enumeration

Efficient subset generation:

```python
def get_subset_sums_bitmask(arr):
    """Generate subset sums using bitmask enumeration."""
    n = len(arr)
    sums = []
    for mask in range(1 << n):
        s = 0
        for i in range(n):
            if mask & (1 << i):
                s += arr[i]
        sums.append(s)
    return sums
```

---

## Python Templates

### Template 1: Closest Subsequence Sum (MITM)

```python
from bisect import bisect_left
from typing import List

def min_abs_difference(nums: List[int], goal: int) -> int:
    """
    LeetCode 1755: Closest Subsequence Sum.
    Find subset sum closest to goal using Meet in the Middle.
    
    Args:
        nums: List of integers (can be negative)
        goal: Target sum
    
    Returns:
        Minimum absolute difference between subset sum and goal
        
    Time: O(2^(n/2) × n)
    Space: O(2^(n/2))
    """
    n = len(nums)
    
    # Split into two halves
    left = nums[:n // 2]
    right = nums[n // 2:]
    
    # Generate all subset sums
    def get_subset_sums(arr: List[int]) -> List[int]:
        """Generate all possible subset sums."""
        sums = [0]
        for num in arr:
            new_sums = [s + num for s in sums]
            sums.extend(new_sums)
        return sums
    
    left_sums = get_subset_sums(left)
    right_sums = get_subset_sums(right)
    
    # Sort right sums for binary search
    right_sums.sort()
    
    answer = float('inf')
    
    # For each sum from left, find closest complement in right
    for s in left_sums:
        remaining = goal - s
        
        # Binary search for closest
        idx = bisect_left(right_sums, remaining)
        
        if idx < len(right_sums):
            answer = min(answer, abs(remaining - right_sums[idx]))
        if idx > 0:
            answer = min(answer, abs(remaining - right_sums[idx - 1]))
    
    return answer
```

### Template 2: Count Subsets with Target Sum

```python
from collections import Counter
from typing import List

def count_subsets_with_sum(nums: List[int], target: int) -> int:
    """
    Count subsets with sum exactly equal to target.
    
    Args:
        nums: List of integers
        target: Target sum
    
    Returns:
        Number of subsets with sum = target
        
    Time: O(2^(n/2))
    Space: O(2^(n/2))
    """
    n = len(nums)
    
    def get_subset_counts(arr: List[int]) -> Counter:
        """Generate subset sums with counts."""
        counts = Counter([0])
        for num in arr:
            new_counts = Counter({s + num: c for s, c in counts.items()})
            counts.update(new_counts)
        return counts
    
    left_counts = get_subset_counts(nums[:n // 2])
    right_counts = get_subset_counts(nums[n // 2:])
    
    result = 0
    for s, count_left in left_counts.items():
        result += count_left * right_counts[target - s]
    
    return result
```

### Template 3: Minimum Partition Array Difference

```python
from bisect import bisect_left
from typing import List

def minimum_difference_partition(nums: List[int]) -> int:
    """
    Partition array into two subsets minimizing absolute difference.
    LeetCode 2035 style problem.
    
    Args:
        nums: List of integers
    
    Returns:
        Minimum possible difference between subset sums
        
    Time: O(2^(n/2) × n)
    Space: O(2^(n/2))
    """
    n = len(nums)
    total = sum(nums)
    half = total // 2
    
    def get_subset_sums(arr: List[int]) -> List[int]:
        sums = {0}
        for num in arr:
            new_sums = {s + num for s in sums}
            sums.update(new_sums)
        return sorted(sums)
    
    left_sums = get_subset_sums(nums[:n // 2])
    right_sums = get_subset_sums(nums[n // 2:])
    
    answer = float('inf')
    
    for s1 in left_sums:
        # Want s1 + s2 close to half
        target = half - s1
        idx = bisect_left(right_sums, target)
        
        if idx < len(right_sums):
            s2 = right_sums[idx]
            current_sum = s1 + s2
            answer = min(answer, abs((total - current_sum) - current_sum))
        
        if idx > 0:
            s2 = right_sums[idx - 1]
            current_sum = s1 + s2
            answer = min(answer, abs((total - current_sum) - current_sum))
    
    return answer
```

### Template 4: Tallest Billboard (DP with MITM)

```python
from typing import List

def tallest_billboard(rods: List[int]) -> int:
    """
    LeetCode 956: Tallest Billboard.
    Split rods into two groups with equal sum, maximize sum.
    
    Args:
        rods: List of rod lengths
    
    Returns:
        Maximum equal sum achievable
    """
    # DP approach: dp[diff] = max taller height for difference
    dp = {0: 0}
    
    for r in rods:
        new_dp = dict(dp)  # Copy current state
        for diff, taller in dp.items():
            shorter = taller - diff
            
            # Add to taller group
            new_diff = abs((taller + r) - shorter)
            new_taller = max(taller + r, shorter)
            new_dp[new_diff] = max(new_dp.get(new_diff, 0), new_taller)
            
            # Add to shorter group
            new_diff2 = abs(taller - (shorter + r))
            new_taller2 = max(taller, shorter + r)
            new_dp[new_diff2] = max(new_dp.get(new_diff2, 0), new_taller2)
        
        dp = new_dp
    
    return dp[0] if 0 in dp else 0
```

### Template 5: 4-SUM Problem using MITM

```python
from collections import defaultdict
from typing import List, Tuple

def four_sum(nums: List[int], target: int) -> List[Tuple[int, int, int, int]]:
    """
    Find all unique quadruplets that sum to target.
    MITM approach for demonstration (standard hash approach is simpler).
    
    Args:
        nums: List of integers
        target: Target sum
    
    Returns:
        List of unique quadruplets
    """
    nums.sort()
    n = len(nums)
    
    # Store pair sums
    pair_sums = defaultdict(list)
    
    for i in range(n):
        for j in range(i + 1, n):
            pair_sums[nums[i] + nums[j]].append((i, j))
    
    result = set()
    
    for i in range(n):
        for j in range(i + 1, n):
            remaining = target - nums[i] - nums[j]
            if remaining in pair_sums:
                for k, l in pair_sums[remaining]:
                    if k > j:  # Ensure distinct indices
                        result.add((nums[i], nums[j], nums[k], nums[l]))
    
    return list(result)
```

### Template 6: Generic MITM Framework

```python
from typing import List, Callable, TypeVar, Generic

T = TypeVar('T')

def meet_in_middle(
    items: List[T],
    combine: Callable[[T, T], T],
    valid: Callable[[T], bool]
) -> T:
    """
    Generic Meet in the Middle framework.
    
    Args:
        items: List of items to process
        combine: Function to combine two results
        valid: Function to check if result is valid
    
    Returns:
        Best valid result found
    """
    n = len(items)
    mid = n // 2
    
    left_items = items[:mid]
    right_items = items[mid:]
    
    # Generate all combinations for each half
    def generate_all(arr: List[T]) -> List[T]:
        """Generate all possible combinations."""
        results = [None]  # Base case: empty
        for item in arr:
            new_results = []
            for r in results:
                if r is None:
                    new_results.append(item)
                else:
                    new_results.append(combine(r, item))
            results.extend(new_results)
        return results[1:]  # Exclude empty
    
    left_results = generate_all(left_items)
    right_results = generate_all(right_items)
    
    # Find best valid combination
    best = None
    for l in left_results:
        for r in right_results:
            combined = combine(l, r)
            if valid(combined):
                if best is None or combined < best:  # Or other comparison
                    best = combined
    
    return best
```

---

## When to Use

Use Meet in the Middle when you need to solve problems involving:

- **Subset Selection**: Choosing subsets with specific sum/properties
- **n ≈ 30-40**: Too large for 2^n, small enough for 2^(n/2)
- **Partition Problems**: Dividing into groups with constraints
- **NP-Hard Problems**: Exact solutions for moderate sizes
- **Combination Enumeration**: All possible combinations needed

### Comparison with Alternatives

| Approach | Time | Space | Best For |
|----------|------|-------|----------|
| **Brute Force** | O(2^n) | O(n) | n < 20 |
| **Meet in Middle** | O(2^(n/2) × n) | O(2^(n/2)) | n = 20-40 |
| **DP (pseudopolynomial)** | O(n × W) | O(W) | Small weights/values |
| **Greedy** | O(n log n) | O(1) | Approximation acceptable |
| **ILP Solver** | Varies | Varies | Larger n, exact solution |

### When to Choose Each Approach

- **Choose Meet in Middle** when:
  - n is between 20 and 40
  - Need exact solution
  - 2^n is infeasible but 2^(n/2) is manageable
  - Problem can be split into independent halves

- **Choose Brute Force** when:
  - n < 20
  - Implementation simplicity matters

- **Choose DP** when:
  - Values are small (pseudopolynomial applies)
  - Problem has optimal substructure

- **Choose Greedy/Approximation** when:
  - n > 40
  - Exact solution not required

---

## Algorithm Explanation

### Core Concept

Meet in the Middle exploits the fact that 2^(n/2) + 2^(n/2) is exponentially smaller than 2^n. By splitting the problem, generating all possibilities for each half, and combining efficiently, we solve problems that would otherwise be computationally infeasible.

### How It Works

#### Step 1: Split

Divide the array into two halves:
```python
n = len(nums)
left = nums[:n//2]   # n/2 elements
right = nums[n//2:]  # n/2 elements
```

#### Step 2: Generate

Enumerate all subset sums for each half:
```python
def get_sums(arr):
    sums = [0]
    for num in arr:
        new = [s + num for s in sums]
        sums.extend(new)
    return sums  # 2^(n/2) sums

left_sums = get_sums(left)
right_sums = get_sums(right)
```

#### Step 3: Combine

Use binary search or hash maps for efficient combination:
```python
right_sums.sort()

for s in left_sums:
    target = goal - s
    # Binary search for closest in right_sums
```

### Visual Representation

**Standard vs MITM:**
```
Standard approach (n=30):
  2^30 = 1,073,741,824 combinations
  Time: ~1 billion operations

Meet in Middle:
  Left: 2^15 = 32,768 combinations
  Right: 2^15 = 32,768 combinations
  Combine: ~32K × log(32K) ≈ 500K operations
  Total: ~66K operations

Speedup: ~16,000x!
```

### Why MITM Works

1. **Exponential Split**: 2^(n/2) vs 2^n is dramatic
2. **Independent Halves**: Each half can be processed separately
3. **Efficient Combination**: Sort + binary search is fast
4. **Space Trade-off**: Acceptable for n ≤ 40

### Limitations

- **Space**: O(2^(n/2)) can be large (for n=40, ~1M integers)
- **Not for Large n**: n > 40 usually requires other approaches
- **Problem Structure**: Requires splittable problem structure
- **Combination Cost**: Some problems have expensive combination step

---

## Practice Problems

### Problem 1: Closest Subsequence Sum

**Problem:** [LeetCode 1755 - Closest Subsequence Sum](https://leetcode.com/problems/closest-subsequence-sum/)

**Description:** Find subset sum closest to target.

**How to Apply MITM:**
- Split array
- Generate all subset sums
- Binary search for closest complement

---

### Problem 2: Partition Array Into Two Arrays

**Problem:** [LeetCode 2035 - Partition Array Into Two Arrays to Minimize Sum Difference](https://leetcode.com/problems/partition-array-into-two-arrays-to-minimize-sum-difference/)

**Description:** Divide array into two equal-size arrays minimizing sum difference.

**How to Apply MITM:**
- Generate all possible sums for each half with size constraints
- Use hash sets or sorting to find best partition

---

### Problem 3: Tallest Billboard

**Problem:** [LeetCode 956 - Tallest Billboard](https://leetcode.com/problems/tallest-billboard/)

**Description:** Support billboard with rods of different lengths.

**How to Apply:**
- Variant of MITM with DP
- Track height differences

---

### Problem 4: Number of Ways to Split Array

**Problem:** [LeetCode 1712 - Ways to Split Array](https://leetcode.com/problems/ways-to-split-array-into-three-subarrays/)

**Description:** Count ways to split into three non-empty parts with equal sums.

**How to Apply:**
- Prefix/suffix sum approach
- Related to partition concepts

---

## Video Tutorial Links

### Fundamentals

- [Meet in the Middle - Errichto](https://www.youtube.com/watch?v=U4fPWyD6jTc) - Comprehensive tutorial
- [MITM Explanation - Algorithms](https://www.youtube.com/watch?v=8LusJS5-AGo) - Visual explanation
- [Advanced MITM - Competitive Programming](https://www.youtube.com/watch?v=UEfFjfG_4hI) - Techniques

### Problem Solving

- [LeetCode 1755 Solution - NeetCode](https://www.youtube.com/watch?v=2CZ8Zg7-m2c) - Closest subsequence
- [Partition Problems - Codeforces](https://codeforces.com/blog/entry/85768) - MITM applications

---

## Follow-up Questions

### Q1: When is Meet in the Middle better than DP?

**Answer:** MITM is better when:
- The value range is large (making DP pseudopolynomial time too slow)
- n is around 30-40 (too big for brute force, small enough for 2^(n/2))
- The problem doesn't have the optimal substructure needed for DP

---

### Q2: Can I split into more than two parts (k-way MITM)?

**Answer:** Yes, but the complexity becomes k × 2^(n/k). For k=3, you get 3 × 2^(n/3). This is useful for n ≈ 60 where 2^(n/2) is too large but 2^(n/3) is manageable. However, the combination step becomes more complex.

---

### Q3: How do I handle negative numbers in MITM?

**Answer:** Negative numbers work fine with MITM. The subset sums can be negative, but sorting and binary search still work. Just ensure your data structures handle negative values correctly.

---

### Q4: What's the maximum n for practical MITM?

**Answer:** Typically n ≤ 40. For n=40, you generate about 1 million values per half (2^20), which is manageable. For n=50, you'd need 2^25 ≈ 33 million values, which might cause memory issues depending on constraints.

---

### Q5: Can MITM be used for problems other than subset sum?

**Answer:** Yes! MITM can be applied to any problem where:
- The problem can be split into independent subproblems
- Solutions to subproblems can be combined
- The combination is faster than solving the original problem

Examples include: cryptanalysis (meet-in-the-middle attacks), certain graph problems, and constraint satisfaction problems.

---

## Summary

Meet in the Middle is a powerful technique for solving exponential problems by splitting them into manageable pieces. The key takeaways are:

1. **Exponential Speedup**: O(2^n) becomes O(2^(n/2) × n)
2. **Feasible Range**: Makes n = 30-40 problems tractable
3. **Split and Combine**: Generate all for each half, combine efficiently
4. **Binary Search/Hash**: Use sorting + binary search or hash maps for combination
5. **Space Trade-off**: Uses O(2^(n/2)) memory

**When to Use:**
- n = 30-40 for subset/knapsack type problems
- Exact solution needed
- Problem can be naturally split
- 2^n is infeasible

**Key Insight:**
```
2^(n/2) + 2^(n/2) << 2^n

Split → Generate → Sort → Binary Search → Combine
```

This technique is essential for competitive programming, enabling exact solutions to NP-hard problems at moderate scales.
