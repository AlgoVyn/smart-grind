# Partition Equal Subset

## Category
Dynamic Programming

## Description

The **Partition Equal Subset Sum** problem asks whether a given array of positive integers can be partitioned into two subsets with equal sum. This is a classic dynamic programming problem that reduces to the **Subset Sum** problem - finding a subset that sums to exactly half of the total array sum.

This algorithm is essential for solving resource allocation problems, balanced partitioning tasks, and serves as a foundation for understanding the 0/1 Knapsack pattern. The space-optimized dynamic programming approach makes it practical for interview and competition settings.

---

## Concepts

The Partition Equal Subset algorithm is built on several fundamental concepts that make it powerful for solving balanced partitioning problems.

### 1. Problem Transformation

The key insight that enables efficient solution:

| Original Problem | Equivalent Problem |
|------------------|-------------------|
| Partition into two equal-sum subsets | Find one subset with sum = total/2 |
| Check if both subsets equal | Check if subset sums to target |

### 2. 0/1 Knapsack Connection

This problem IS the 0/1 Knapsack with boolean constraint:

| Knapsack Element | Partition Equal Subset |
|------------------|------------------------|
| Items | Array elements |
| Item weight | Element value |
| Knapsack capacity | target = sum/2 |
| Goal | Fill exactly to capacity |

### 3. DP State Evolution

Understanding the state transition:

| State | Definition | Formula |
|-------|------------|---------|
| **dp[i][s]** | Sum s achievable with first i elements | `dp[i][s] = dp[i-1][s] OR dp[i-1][s-num]` |
| **dp[s]** (1D) | Sum s achievable | `dp[s] = dp[s] OR dp[s-num]` |

### 4. Space Optimization Principle

Why backwards iteration enables 1D array:

```
Forward iteration: dp[s] might use updated dp[s-num] (same element twice)
Backwards iteration: dp[s-num] is from previous iteration (previous elements only)
```

---

## Frameworks

Structured approaches for solving partition problems.

### Framework 1: Space-Optimized DP Template

```
┌─────────────────────────────────────────────────────┐
│  SPACE-OPTIMIZED PARTITION FRAMEWORK                │
├─────────────────────────────────────────────────────┤
│  1. Calculate total sum of array                    │
│  2. If sum is odd: return False (cannot partition)   │
│  3. Set target = sum // 2                           │
│  4. Initialize dp[0] = True, rest = False          │
│  5. For each number in array:                       │
│     a. For s from target down to number:            │
│        - dp[s] = dp[s] OR dp[s - number]             │
│     b. If dp[target]: return True (early exit)       │
│  6. Return dp[target]                               │
└─────────────────────────────────────────────────────┘
```

**When to use**: Standard partition problem, need boolean result.

### Framework 2: 2D DP Template (Educational)

```
┌─────────────────────────────────────────────────────┐
│  2D DP PARTITION FRAMEWORK                          │
├─────────────────────────────────────────────────────┤
│  1. Calculate total sum                             │
│  2. If sum is odd: return False                    │
│  3. target = sum // 2                               │
│  4. Initialize dp[n+1][target+1] = False           │
│  5. dp[0][0] = True                                 │
│  6. For i from 1 to n:                              │
│     a. For s from 0 to target:                      │
│        - dp[i][s] = dp[i-1][s] (don't include)     │
│        - If s >= nums[i-1]:                         │
│          dp[i][s] |= dp[i-1][s-nums[i-1]] (include)│
│  7. Return dp[n][target]                            │
└─────────────────────────────────────────────────────┘
```

**When to use**: Learning the concept, need to reconstruct actual subset.

### Framework 3: Set-Based Framework

```
┌─────────────────────────────────────────────────────┐
│  SET-BASED PARTITION FRAMEWORK                      │
├─────────────────────────────────────────────────────┤
│  1. Calculate total sum                             │
│  2. If sum is odd: return False                    │
│  3. target = sum // 2                               │
│  4. reachable = {0}                                 │
│  5. For each number:                                │
│     a. new_reachable = {s + num for s in reachable}│
│     b. reachable = reachable ∪ new_reachable         │
│     c. If target in reachable: return True          │
│  6. Return target in reachable                      │
└─────────────────────────────────────────────────────┘
```

**When to use**: Sparse sum spaces, want to avoid DP array allocation.

---

## Forms

Different manifestations of the partition pattern.

### Form 1: Boolean Partition Check

Determine if equal partition is possible.

| Feature | Specification |
|---------|---------------|
| Output | Boolean |
| Approach | Space-optimized DP |
| Space | O(sum) |
| Time | O(n × sum) |

### Form 2: Count Partitions

Count the number of ways to partition.

| DP State | Formula |
|----------|---------|
| **dp[s]** | Number of ways to achieve sum s |
| **Transition** | `dp[s] += dp[s - num]` |

### Form 3: Minimum Partition Difference

When equal partition is impossible, minimize the difference.

```python
# Find largest achievable sum <= target
for s in range(target, -1, -1):
    if dp[s]:
        return (total - s) - s  # Difference
```

### Form 4: K-Partition

Partition into k equal-sum subsets.

| Feature | Specification |
|---------|---------------|
| Approach | Backtracking with pruning |
| Complexity | O(k × 2^n) |
| Note | DP becomes infeasible for k > 2 |

### Form 5: Reconstruct Partition

Return the actual subsets, not just boolean.

| Requirement | 2D DP needed to track choices |
|-------------|-------------------------------|
| Backtrack | From dp[n][target] to find included elements |
| Output | Two lists representing the partition |

---

## Tactics

Specific techniques and optimizations.

### Tactic 1: Early Odd Check

```python
def can_partition(nums: list[int]) -> bool:
    total = sum(nums)
    
    # Early termination: odd sum cannot be split equally
    if total % 2 != 0:
        return False
    
    target = total // 2
    # Continue with DP...
```

### Tactic 2: Early Success Exit

```python
def can_partition_with_exit(nums: list[int]) -> bool:
    total = sum(nums)
    if total % 2 != 0:
        return False
    
    target = total // 2
    dp = [False] * (target + 1)
    dp[0] = True
    
    for num in nums:
        for s in range(target, num - 1, -1):
            dp[s] = dp[s] or dp[s - num]
        
        # Early exit: target already achievable
        if dp[target]:
            return True
    
    return dp[target]
```

### Tactic 3: Set-Based Approach (Sparse Sums)

```python
def can_partition_set(nums: list[int]) -> bool:
    """Alternative for sparse reachable sums."""
    total = sum(nums)
    if total % 2 != 0:
        return False
    
    target = total // 2
    reachable = {0}
    
    for num in nums:
        # Add new reachable sums by including current number
        new_reachable = {s + num for s in reachable if s + num <= target}
        reachable = reachable | new_reachable
        
        if target in reachable:
            return True
    
    return target in reachable
```

### Tactic 4: Memoization (Top-Down)

```python
from functools import lru_cache

def can_partition_memo(nums: list[int]) -> bool:
    """Top-down approach with memoization."""
    total = sum(nums)
    if total % 2 != 0:
        return False
    
    target = total // 2
    
    @lru_cache(maxsize=None)
    def dp(index: int, remaining: int) -> bool:
        if remaining == 0:
            return True
        if index >= len(nums) or remaining < 0:
            return False
        
        # Include or exclude current element
        return dp(index + 1, remaining - nums[index]) or \
               dp(index + 1, remaining)
    
    return dp(0, target)
```

### Tactic 5: Bitset Optimization (Concept)

```python
def can_partition_bitset(nums: list[int]) -> bool:
    """
    Bitset optimization concept (most effective in C++).
    Uses bit manipulation for faster operations.
    """
    total = sum(nums)
    if total % 2 != 0:
        return False
    
    target = total // 2
    # Represent reachable sums as bits
    # dp |= dp << num  shifts and ORs in one operation
    
    # Python simulation (less efficient than C++ bitset)
    reachable = 1  # Bit 0 is set (sum 0 is achievable)
    
    for num in nums:
        reachable |= reachable << num
    
    # Check if bit 'target' is set
    return (reachable >> target) & 1
```

---

## Python Templates

### Template 1: Space-Optimized Partition (Recommended)

```python
def can_partition(nums: list[int]) -> bool:
    """
    Check if array can be partitioned into two subsets with equal sum.
    Space-optimized dynamic programming approach.
    
    Time Complexity: O(n × sum)
    Space Complexity: O(sum)
    """
    total = sum(nums)
    
    # If total is odd, cannot partition into equal halves
    if total % 2 != 0:
        return False
    
    target = total // 2
    
    # dp[i] = True if sum i is achievable
    dp = [False] * (target + 1)
    dp[0] = True  # Sum 0 is always achievable (empty subset)
    
    for num in nums:
        # Iterate backwards to avoid using same element twice
        for s in range(target, num - 1, -1):
            dp[s] = dp[s] or dp[s - num]
        
        # Early exit if target is reached
        if dp[target]:
            return True
    
    return dp[target]
```

### Template 2: 2D DP (For Reconstruction)

```python
def can_partition_2d(nums: list[int]) -> bool:
    """
    Full 2D DP implementation for educational purposes.
    Easier to understand and enables subset reconstruction.
    
    Time Complexity: O(n × sum)
    Space Complexity: O(n × sum)
    """
    total = sum(nums)
    if total % 2 != 0:
        return False
    
    target = total // 2
    n = len(nums)
    
    # dp[i][s] = True if sum s is achievable using first i elements
    dp = [[False] * (target + 1) for _ in range(n + 1)]
    dp[0][0] = True
    
    for i in range(1, n + 1):
        for s in range(target + 1):
            # Don't include nums[i-1]
            dp[i][s] = dp[i-1][s]
            
            # Include nums[i-1] if possible
            if s >= nums[i-1]:
                dp[i][s] = dp[i][s] or dp[i-1][s - nums[i-1]]
    
    return dp[n][target]
```

### Template 3: Find Actual Partition

```python
def find_partition(nums: list[int]) -> tuple[list[int], list[int]]:
    """
    Find the actual partition of array into two equal-sum subsets.
    Returns ([], []) if partition is impossible.
    
    Time Complexity: O(n × sum)
    Space Complexity: O(n × sum) for tracking choices
    """
    total = sum(nums)
    
    if total % 2 != 0:
        return [], []
    
    target = total // 2
    n = len(nums)
    
    # dp[i][s] = True if sum s achievable with first i elements
    dp = [[False] * (target + 1) for _ in range(n + 1)]
    dp[0][0] = True
    
    for i in range(1, n + 1):
        for s in range(target + 1):
            dp[i][s] = dp[i-1][s]  # Don't include
            if s >= nums[i-1] and dp[i-1][s - nums[i-1]]:
                dp[i][s] = True  # Include
    
    if not dp[n][target]:
        return [], []
    
    # Backtrack to find which elements were included
    subset1 = []
    subset2 = []
    s = target
    
    for i in range(n, 0, -1):
        if dp[i-1][s]:
            # nums[i-1] was not included
            subset2.append(nums[i-1])
        else:
            # nums[i-1] was included
            subset1.append(nums[i-1])
            s -= nums[i-1]
    
    return subset1, subset2
```

### Template 4: Count Number of Partitions

```python
def count_partitions(nums: list[int]) -> int:
    """
    Count number of ways to partition array into two equal-sum subsets.
    
    Time Complexity: O(n × sum)
    Space Complexity: O(sum)
    """
    total = sum(nums)
    
    if total % 2 != 0:
        return 0
    
    target = total // 2
    
    # dp[i] = number of ways to achieve sum i
    dp = [0] * (target + 1)
    dp[0] = 1  # One way to make sum 0 (empty subset)
    
    for num in nums:
        for s in range(target, num - 1, -1):
            dp[s] += dp[s - num]
    
    return dp[target]
```

### Template 5: Minimum Partition Difference

```python
def min_partition_difference(nums: list[int]) -> int:
    """
    Find minimum difference between two subset sums.
    
    Time Complexity: O(n × sum)
    Space Complexity: O(sum)
    """
    total = sum(nums)
    target = total // 2
    
    # dp[s] = True if sum s is achievable
    dp = [False] * (target + 1)
    dp[0] = True
    
    for num in nums:
        for s in range(target, num - 1, -1):
            dp[s] = dp[s] or dp[s - num]
    
    # Find the largest achievable sum <= total/2
    for s in range(target, -1, -1):
        if dp[s]:
            # One subset sums to s, other sums to total - s
            return (total - s) - s
    
    return total  # Should never reach here
```

### Template 6: K-Partition (Backtracking)

```python
def can_partition_k_subsets(nums: list[int], k: int) -> bool:
    """
    Check if array can be partitioned into k subsets with equal sum.
    
    Time Complexity: O(k × 2^n) - exponential, uses backtracking with pruning
    Space Complexity: O(n) - recursion depth
    """
    total = sum(nums)
    
    if total % k != 0:
        return False
    
    target = total // k
    nums.sort(reverse=True)  # Sort descending for better pruning
    
    used = [False] * len(nums)
    
    def backtrack(start_index: int, current_sum: int, groups_formed: int) -> bool:
        if groups_formed == k - 1:
            return True  # Last group automatically has correct sum
        
        if current_sum == target:
            return backtrack(0, 0, groups_formed + 1)
        
        for i in range(start_index, len(nums)):
            if used[i] or current_sum + nums[i] > target:
                continue
            
            used[i] = True
            if backtrack(i + 1, current_sum + nums[i], groups_formed):
                return True
            used[i] = False
            
            # Pruning: if current_sum is 0 and this fails, skip rest
            if current_sum == 0:
                break
        
        return False
    
    return backtrack(0, 0, 0)
```

---

## When to Use

Use the Partition Equal Subset algorithm when you need to solve problems involving:

- **Subset Sum with Target**: When you need to find if any subset sums to a specific value
- **Array Partitioning**: Dividing arrays into groups with equal properties (sum, count, etc.)
- **Resource Allocation**: Splitting resources equally between two parties
- **Dynamic Programming Practice**: As a stepping stone to more complex DP problems like Knapsack

### Comparison with Alternatives

| Approach | Time Complexity | Space Complexity | When to Use |
|----------|-----------------|------------------|-------------|
| **Brute Force (Recursion)** | O(2ⁿ) | O(n) | Never - only for understanding |
| **Memoization (Top-down)** | O(n × sum) | O(n × sum) | When you prefer recursive thinking |
| **Tabulation (Bottom-up)** | O(n × sum) | O(n × sum) | Standard DP approach |
| **Space-Optimized DP** | O(n × sum) | **O(sum)** | **Recommended** - best space efficiency |
| **Bitset Optimization** | O(n × sum/word_size) | O(sum/word_size) | For very tight space constraints |

### When to Use Each Approach

- **Choose Space-Optimized DP** when:
  - You need the most practical solution
  - Memory is a concern (reduces space from O(n×sum) to O(sum))
  - You're solving this in an interview or competition

- **Choose Bitset Optimization** when:
  - Dealing with very large sums and need maximum speed
  - Working in C++ where `std::bitset` is available
  - Space is extremely constrained

---

## Algorithm Explanation

### Core Concept

The key insight is that partitioning into two equal-sum subsets is equivalent to finding **one subset that sums to half of the total**:

- If total sum = S, we need to find a subset with sum = S/2
- If S is odd, partitioning is impossible (return False)
- The remaining elements automatically sum to S/2 if we find such a subset

This transforms the problem into the classic **0/1 Knapsack** variant:
- Items: Array elements
- Capacity: target = sum/2
- Goal: Fill knapsack exactly to capacity

### How It Works

#### Dynamic Programming Approach:

1. **State Definition**: `dp[i][s]` = True if sum `s` is achievable using first `i` elements
2. **Transition**: For each element, we have two choices:
   - **Include**: `dp[i][s] = dp[i-1][s - nums[i-1]]`
   - **Exclude**: `dp[i][s] = dp[i-1][s]`
3. **Space Optimization**: Since we only need the previous row, use a 1D array and iterate backwards

#### Visual Representation

For `nums = [1, 5, 11, 5]`, total = 22, target = 11:

```
Initial dp: [T, F, F, F, F, F, F, F, F, F, F, F]
              0  1  2  3  4  5  6  7  8  9  10 11

After num=1:  [T, T, F, F, F, F, F, F, F, F, F, F]
After num=5:  [T, T, F, F, F, T, T, F, F, F, F, F]
After num=11: [T, T, F, F, F, T, T, F, F, F, F, T] ✓ Target reached!
After num=5:  (would also work, but we can early exit)
```

### Why Backwards Iteration?

When using 1D DP, we iterate from target down to num to **prevent using the same element twice**:
- Forward iteration: `dp[s]` might use the updated `dp[s-num]` (same element used twice)
- Backward iteration: `dp[s-num]` is from the previous iteration (previous elements only)

### Key Insights

1. **Problem transformation**: Equal partition ⇔ subset with sum = total/2
2. **Odd sum check**: Early termination saves computation
3. **Space optimization**: 1D array sufficient with backwards iteration
4. **Early exit**: Return as soon as target is achievable

### Limitations

- **Pseudo-polynomial time**: O(n × sum) depends on numeric values, not just n
- **Large sum constraint**: If sum > 10⁵, may need alternative approaches
- **K-partition limitation**: DP only efficient for k=2; use backtracking for k>2

---

## Practice Problems

### Problem 1: Partition Equal Subset Sum

**Problem:** [LeetCode 416 - Partition Equal Subset Sum](https://leetcode.com/problems/partition-equal-subset-sum/)

**Description:** Given a non-empty array `nums` containing only positive integers, find if the array can be partitioned into two subsets such that the sum of elements in both subsets is equal.

**How to Apply:**
- Direct application of the space-optimized DP approach
- Check if sum is odd first (quick rejection)
- Use backwards iteration to prevent reuse

---

### Problem 2: Target Sum

**Problem:** [LeetCode 494 - Target Sum](https://leetcode.com/problems/target-sum/)

**Description:** You are given an integer array `nums` and an integer `target`. You want to build an expression out of nums by adding one of the symbols `+` and `-` before each integer in `nums` and then concatenate all the integers.

**How to Apply:**
- Transform to subset sum problem: Find subset P such that `sum(P) - sum(nums-P) = target`
- This simplifies to `2*sum(P) = target + sum(nums)`, so we need subset with sum = `(target + sum(nums)) / 2`
- Apply standard combination sum/count DP approach

---

### Problem 3: Last Stone Weight II

**Problem:** [LeetCode 1049 - Last Stone Weight II](https://leetcode.com/problems/last-stone-weight-ii/)

**Description:** You are given an array of integers `stones` where `stones[i]` is the weight of the i-th stone. We are playing a game with the stones. On each turn, we choose any two stones and smash them together.

**How to Apply:**
- This reduces to finding the minimum partition difference
- We want to partition stones into two groups with sums as close as possible
- The difference between group sums is the remaining weight

---

### Problem 4: Partition to K Equal Sum Subsets

**Problem:** [LeetCode 698 - Partition to K Equal Sum Subsets](https://leetcode.com/problems/partition-to-k-equal-sum-subsets/)

**Description:** Given an integer array `nums` and an integer `k`, return true if it is possible to divide this array into `k` non-empty subsets whose sums are all equal.

**How to Apply:**
- Use backtracking with pruning (DP becomes infeasible for k > 2)
- Sort descending for better pruning
- Use used[] array to track which elements are assigned

---

### Problem 5: Ones and Zeroes

**Problem:** [LeetCode 474 - Ones and Zeroes](https://leetcode.com/problems/ones-and-zeroes/)

**Description:** You are given an array of binary strings `strs` and two integers `m` and `n`. Return the size of the largest subset of `strs` such that there are at most `m` 0's and `n` 1's in the subset.

**How to Apply:**
- This is a 2D variant of the subset sum / knapsack problem
- Instead of one constraint (sum), we have two constraints (count of 0s and 1s)
- Use 2D DP: dp[i][j] = max subset size with i zeros and j ones

---

## Video Tutorial Links

### Fundamentals

- [Partition Equal Subset Sum - Dynamic Programming (NeetCode)](https://www.youtube.com/watch?v=IsvocB5BJhw) - Comprehensive explanation with visualizations
- [0/1 Knapsack Problem (Aditya Verma)](https://www.youtube.com/watch?v=ntCGbPMeqgg) - Understanding the knapsack pattern that this problem follows
- [Subset Sum Problem (Take U Forward)](https://www.youtube.com/watch?v=34l1kTIQCIA) - Detailed walkthrough of subset sum DP

### Advanced Topics

- [Target Sum Problem (NeetCode)](https://www.youtube.com/watch?v=g0npyaQtAQM) - Extension that uses similar transformation technique
- [Last Stone Weight II (LeetCode Discuss)](https://www.youtube.com/watch?v=q-0wnOWDVPo) - Advanced variation with partition difference minimization
- [DP Patterns: Subset Sum (Back To Back SWE)](https://www.youtube.com/watch?v=s6FhG--P7z0) - Understanding DP patterns

### Practice and Problem Solving

- [Dynamic Programming Playlist (Aditya Verma)](https://www.youtube.com/playlist?list=PL_z_8CaSLPWekqhdCPmFohncHwz8TY2Go) - Complete DP playlist including knapsack variations
- [LeetCode 416 Walkthrough (Nick White)](https://www.youtube.com/watch?v=obhWqDfzwQQ) - Step-by-step solution walkthrough

---

## Follow-up Questions

### Q1: Can we use BFS or DFS instead of DP?

**Answer:** Yes, but it's less efficient:
- **BFS/DFS approach**: Explore all possible subsets (2ⁿ possibilities)
- **Time Complexity**: O(2ⁿ) - exponential
- **When to use**: Only for very small n (n ≤ 20) or when you need to enumerate all partitions
- **DP is preferred**: O(n × sum) is pseudo-polynomial and much faster for typical constraints

---

### Q2: What if the array contains negative numbers or zero?

**Answer:** 
- **Zero**: Doesn't affect the solution - can be placed in either subset
- **Negative numbers**: The problem changes significantly:
  - Target sum can be achieved in multiple ways
  - Need to track both positive and negative ranges in DP
  - DP array needs offset: `dp[s + offset]` where offset = sum of absolute values
  - Time complexity becomes O(n × total_range) where total_range includes negatives

---

### Q3: How does this relate to the Knapsack problem?

**Answer:** This IS the 0/1 Knapsack problem in disguise:
- **Knapsack**: Maximize value with weight constraint
- **Partition Equal Subset**: Find exact weight (sum/2) with boolean constraint
- **Transformation**:
  - Items = array elements
  - Item weight = element value
  - Item value = 1 (or any constant)
  - Knapsack capacity = target = sum/2
  - Goal: Fill knapsack exactly to capacity

---

### Q4: Can we optimize further if we know the array is sorted?

**Answer:** Sorting helps in some variations:
- **Early termination**: If `nums[i] > target`, skip it
- **Pruning in k-partition**: Sorting descending helps backtracking explore larger elements first
- **No asymptotic improvement**: DP complexity remains O(n × sum)
- **Practical improvement**: Can reduce constants and early exit in some cases

---

### Q5: What are the constraints where this solution becomes infeasible?

**Answer:** 
- **Large sum**: If sum > 10⁵ or 10⁶, O(n × sum) may be too slow
- **Large n with small sum**: DP is still efficient
- **Alternatives for large sums**:
  - **Meet-in-the-middle**: Split array, enumerate subsets of each half (O(2^(n/2)))
  - **Bitset optimization**: Faster in practice for C++ (bit parallelism)
  - **Greedy heuristics**: For approximate solutions

---

## Summary

The **Partition Equal Subset Sum** problem is a fundamental dynamic programming problem that demonstrates the power of transforming a complex partitioning problem into a simpler subset sum problem. Key takeaways:

- **Key Insight**: Partitioning into two equal sums ⇔ Finding one subset with sum = total/2
- **DP State**: `dp[s]` = whether sum `s` is achievable
- **Transition**: For each element, update achievable sums by including or excluding
- **Space Optimization**: Use 1D array with backwards iteration to achieve O(sum) space
- **Time Complexity**: O(n × sum) - pseudo-polynomial

### When to use:
- ✅ Finding if array can be split into equal-sum groups
- ✅ Subset sum problems with specific target
- ✅ As building block for more complex partition problems
- ❌ When sum is extremely large (use meet-in-the-middle instead)
- ❌ When you need to partition into more than 2 subsets (use backtracking)

### Essential Understanding:
- 0/1 Knapsack pattern
- Space optimization in DP
- Problem transformation techniques

This problem is essential for competitive programming and technical interviews, appearing frequently in problems from major tech companies.
