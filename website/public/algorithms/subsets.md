# Subsets

## Category
Backtracking

## Description

Generating all subsets (also known as the **Power Set**) is a classic problem in computer science where we enumerate all possible groups of elements from a given set. For a set of size n, there are exactly 2^n subsets (including the empty set), because each element presents a binary choice: either **included** or **excluded** from any subset.

This problem serves as a fundamental building block for combinatorial algorithms and appears frequently in technical interviews. The key insight is that subset generation represents binary decisions at each position — a natural fit for backtracking. The technique extends to variations like subset sum, subsets with duplicates, and constrained subset generation.

Unlike permutations (where order matters) and combinations (where we select exactly k elements), subsets include all possible groupings of any size from 0 to n.

---

## Concepts

The Subsets algorithm is built on several fundamental concepts.

### 1. Power Set Cardinality

For n elements, exactly 2^n subsets exist:

| n | 2^n | Subset Count | Practical? |
|---|-----|--------------|------------|
| 3 | 8 | 8 | Yes |
| 5 | 32 | 32 | Yes |
| 10 | 1,024 | 1,024 | Yes |
| 15 | 32,768 | 32,768 | Yes |
| 20 | 1,048,576 | ~1 million | Maybe |
| 25 | 33,554,432 | ~33 million | No |

### 2. Binary Choice Representation

Each subset corresponds to a binary number:

| Subset | Binary (n=3) | Decimal |
|--------|-------------|---------|
| [] | 000 | 0 |
| [1] | 001 | 1 |
| [2] | 010 | 2 |
| [1,2] | 011 | 3 |
| [3] | 100 | 4 |
| [1,3] | 101 | 5 |
| [2,3] | 110 | 6 |
| [1,2,3] | 111 | 7 |

### 3. Three Main Approaches

| Approach | Mechanism | Space | Intuition |
|----------|-----------|-------|-----------|
| **Backtracking** | Include/exclude recursively | O(n) | Decision tree |
| **Bit Manipulation** | Iterate all bitmasks | O(n × 2^n) | Binary enumeration |
| **Iterative** | Build subsets incrementally | O(n × 2^n) | Cascade building |

### 4. Decision Tree Structure

```
For [1, 2, 3]:

                    []
               /         \
          [1]                []
        /    \             /    \
    [1,2]    [1]        [2]     []
    /   \      \         / \      \
[1,2,3][1,2][1,3][1][2,3][2][3] []

Each leaf is a subset. Internal nodes are also valid subsets.
```

---

## Frameworks

Structured approaches for solving subset problems.

### Framework 1: Backtracking Subset Template

```
┌─────────────────────────────────────────────────────────────┐
│  BACKTRACKING SUBSET FRAMEWORK                                │
├─────────────────────────────────────────────────────────────┤
│  1. Define backtrack(start, path):                          │
│                                                              │
│     - Add path to result (every node is a valid subset)    │
│                                                              │
│     - For i from start to n-1:                              │
│         path.append(nums[i])    # Include                   │
│         backtrack(i + 1, path)  # Recurse                   │
│         path.pop()              # Exclude (backtrack)     │
│                                                              │
│  2. Initialize: result = [], call backtrack(0, [])          │
│                                                              │
│  3. Return result                                            │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: General subset generation, most intuitive approach.

### Framework 2: Bit Manipulation Template

```
┌─────────────────────────────────────────────────────────────┐
│  BIT MANIPULATION SUBSET FRAMEWORK                            │
├─────────────────────────────────────────────────────────────┤
│  1. Calculate total = 2^n (1 << n)                            │
│                                                              │
│  2. For mask from 0 to total - 1:                           │
│       subset = []                                            │
│       For i from 0 to n-1:                                   │
│         If mask & (1 << i):   # Check if bit i is set       │
│           subset.append(nums[i])                            │
│       result.append(subset)                                  │
│                                                              │
│  3. Return result                                            │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: When you need exact control over subset ordering.

### Framework 3: Iterative Building Template

```
┌─────────────────────────────────────────────────────────────┐
│  ITERATIVE SUBSET FRAMEWORK                                   │
├─────────────────────────────────────────────────────────────┤
│  1. Initialize: result = [[]]   # Start with empty set     │
│                                                              │
│  2. For each num in nums:                                    │
│       current_size = len(result)                            │
│       For i from 0 to current_size - 1:                     │
│         new_subset = result[i] + [num]                      │
│         result.append(new_subset)                           │
│                                                              │
│  3. Return result                                            │
│                                                              │
│  Key insight: Each element doubles the result size          │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Simple implementation, good for understanding.

---

## Forms

Different manifestations of the subset pattern.

### Form 1: Standard Subsets (Distinct Elements)

Generate all 2^n subsets of unique elements.

| Approach | Time | Space | Code Complexity |
|----------|------|-------|-----------------|
| Backtracking | O(n × 2^n) | O(n) aux | Medium |
| Bit Mask | O(n × 2^n) | O(n × 2^n) | Low |
| Iterative | O(n × 2^n) | O(n × 2^n) | Low |

### Form 2: Subsets with Duplicates (Subsets II)

Input contains duplicates, output must not.

```
Key technique:
1. Sort input to group duplicates
2. At each level, skip duplicate elements
3. Only use first occurrence of each value at each level

Example: [1, 2, 2]
Without handling: [], [1], [2], [2], [1,2], [1,2], [2,2], [1,2,2]
With handling:    [], [1], [2], [1,2], [2,2], [1,2,2]
```

### Form 3: Subsets of Specific Size

Generate only subsets with exactly k elements.

```python
def subsets_of_size_k(nums, k):
    result = []
    def backtrack(start, path):
        if len(path) == k:
            result.append(path[:])
            return
        for i in range(start, len(nums)):
            path.append(nums[i])
            backtrack(i + 1, path)
            path.pop()
    backtrack(0, [])
    return result
```

### Form 4: Subset Sum

Find subsets that sum to a target value.

| Variation | Constraint | Pruning Strategy |
|-----------|-----------|------------------|
| **Exact sum** | Sum equals target | Return when sum == target |
| **At most** | Sum ≤ target | Break when sum > target |
| **All valid** | Multiple targets | Collect all matching |

### Form 5: Constrained Subsets

Subsets meeting complex constraints (size, sum, content).

```
Example constraints:
- Sum divisible by k
- Contains at least one even number
- Size is prime
- Maximum element < threshold
```

---

## Tactics

Specific techniques for subset problems.

### Tactic 1: Handling Duplicates (Cascading)

```python
def subsets_with_duplicates(nums: list[int]) -> list[list[int]]:
    """Generate unique subsets from array with duplicates."""
    nums.sort()  # Essential: group duplicates together
    result = []
    
    def backtrack(start: int, path: list[int]):
        result.append(path[:])
        
        for i in range(start, len(nums)):
            # Skip duplicates at same level
            if i > start and nums[i] == nums[i - 1]:
                continue
            
            path.append(nums[i])
            backtrack(i + 1, path)
            path.pop()
    
    backtrack(0, [])
    return result
```

### Tactic 2: Subset Sum with Pruning

```python
def subset_sum(nums: list[int], target: int) -> list[list[int]]:
    """Find all subsets that sum to target with pruning."""
    result = []
    nums.sort()  # Sort for pruning
    
    def backtrack(start: int, path: list[int], current_sum: int):
        if current_sum == target:
            result.append(path[:])
            return
        
        for i in range(start, len(nums)):
            # Pruning: would exceed target
            if current_sum + nums[i] > target:
                break
            
            path.append(nums[i])
            backtrack(i + 1, path, current_sum + nums[i])
            path.pop()
    
    backtrack(0, [], 0)
    return result
```

### Tactic 3: Bit Manipulation Optimization

```python
def subsets_bit_optimized(nums: list[int]) -> list[list[int]]:
    """Generate subsets using bit manipulation."""
    n = len(nums)
    total = 1 << n  # 2^n
    result = []
    
    for mask in range(total):
        subset = []
        for i in range(n):
            if mask & (1 << i):
                subset.append(nums[i])
        result.append(subset)
    
    return result

# For specific subset size
def subsets_of_size_k_bits(nums: list[int], k: int) -> list[list[int]]:
    """Generate subsets of exactly size k using bits."""
    n = len(nums)
    result = []
    
    for mask in range(1 << n):
        if bin(mask).count('1') == k:
            subset = [nums[i] for i in range(n) if mask & (1 << i)]
            result.append(subset)
    
    return result
```

### Tactic 4: Iterative Cascade

```python
def subsets_iterative_cascade(nums: list[int]) -> list[list[int]]:
    """
    Build subsets incrementally.
    For each number, add it to all existing subsets.
    """
    result = [[]]
    
    for num in nums:
        # Create new subsets by adding num to all existing
        new_subsets = [subset + [num] for subset in result]
        result.extend(new_subsets)
    
    return result

# With duplicate handling
def subsets_iterative_duplicates(nums: list[int]) -> list[list[int]]:
    nums.sort()
    result = [[]]
    i = 0
    
    while i < len(nums):
        # Count duplicates
        count = 1
        while i + count < len(nums) and nums[i + count] == nums[i]:
            count += 1
        
        # Add current element 1 to count times to each existing subset
        current_size = len(result)
        for _ in range(count):
            for j in range(current_size):
                result.append(result[j] + [nums[i]])
            current_size = len(result) - current_size
        
        i += count
    
    return result
```

### Tactic 5: Lazy Subset Generation

```python
def subsets_lazy(nums: list[int]):
    """Generate subsets lazily using generator."""
    n = len(nums)
    
    for mask in range(1 << n):
        subset = []
        for i in range(n):
            if mask & (1 << i):
                subset.append(nums[i])
        yield subset

# Usage: process without storing all
for subset in subsets_lazy([1, 2, 3, 4, 5]):
    process(subset)  # Memory efficient
```

### Tactic 6: Meet-in-the-Middle for Large n

```python
def subset_sum_meet_middle(nums: list[int], target: int) -> bool:
    """
    Check if any subset sums to target.
    Efficient for n up to 40 (vs 20 for standard).
    """
    n = len(nums)
    mid = n // 2
    
    # Generate all subset sums for both halves
    def get_subset_sums(arr):
        sums = [0]
        for num in arr:
            sums += [s + num for s in sums]
        return sums
    
    left_sums = get_subset_sums(nums[:mid])
    right_sums = set(get_subset_sums(nums[mid:]))
    
    for s in left_sums:
        if target - s in right_sums:
            return True
    return False
```

---

## Python Templates

### Template 1: Standard Subsets (Backtracking)

```python
def subsets(nums: list[int]) -> list[list[int]]:
    """
    Template for generating all subsets using backtracking.
    Each element: include or exclude.
    Time: O(n * 2^n), Space: O(n) for recursion
    """
    result = []
    
    def backtrack(start: int, path: list[int]):
        # Add current subset (copy to avoid reference issues)
        result.append(path[:])
        
        # Try including each remaining element
        for i in range(start, len(nums)):
            path.append(nums[i])
            backtrack(i + 1, path)
            path.pop()  # Backtrack
    
    backtrack(0, [])
    return result
```

### Template 2: Subsets with Duplicates

```python
def subsets_with_duplicates(nums: list[int]) -> list[list[int]]:
    """
    Template for subsets with duplicate handling.
    Sorts first, then skips duplicates at same level.
    Time: O(n * 2^n), Space: O(n)
    """
    result = []
    nums.sort()  # Essential for duplicate handling
    
    def backtrack(start: int, path: list[int]):
        result.append(path[:])
        
        for i in range(start, len(nums)):
            # Skip duplicates at same level
            if i > start and nums[i] == nums[i - 1]:
                continue
            
            path.append(nums[i])
            backtrack(i + 1, path)
            path.pop()
    
    backtrack(0, [])
    return result
```

### Template 3: Subsets (Bit Manipulation)

```python
def subsets_bit(nums: list[int]) -> list[list[int]]:
    """
    Template for generating subsets using bit manipulation.
    Each subset corresponds to a bitmask.
    Time: O(n * 2^n), Space: O(n * 2^n)
    """
    n = len(nums)
    result = []
    
    # Total subsets = 2^n
    for mask in range(1 << n):
        subset = []
        for i in range(n):
            # Check if bit i is set in mask
            if mask & (1 << i):
                subset.append(nums[i])
        result.append(subset)
    
    return result
```

### Template 4: Subsets (Iterative)

```python
def subsets_iterative(nums: list[int]) -> list[list[int]]:
    """
    Template for iterative subset generation.
    Start with [[]] and double for each element.
    Time: O(n * 2^n), Space: O(n * 2^n)
    """
    result = [[]]  # Start with empty set
    
    for num in nums:
        # For each existing subset, create new subset with current num
        new_subsets = [subset + [num] for subset in result]
        result.extend(new_subsets)
    
    return result
```

### Template 5: Subsets of Size K

```python
def subsets_of_size_k(nums: list[int], k: int) -> list[list[int]]:
    """
    Template for generating subsets of exactly size k.
    Time: O(C(n,k) * k), Space: O(k)
    """
    result = []
    
    def backtrack(start: int, path: list[int]):
        if len(path) == k:
            result.append(path[:])
            return
        
        for i in range(start, len(nums)):
            path.append(nums[i])
            backtrack(i + 1, path)
            path.pop()
    
    backtrack(0, [])
    return result
```

### Template 6: Subset Sum

```python
def subset_sum(nums: list[int], target: int) -> list[list[int]]:
    """
    Template for finding subsets that sum to target.
    Time: O(2^n), Space: O(n)
    """
    result = []
    nums.sort()  # Sort for pruning
    
    def backtrack(start: int, path: list[int], current_sum: int):
        if current_sum == target:
            result.append(path[:])
            return
        
        for i in range(start, len(nums)):
            # Pruning: would exceed target
            if current_sum + nums[i] > target:
                break
            
            path.append(nums[i])
            backtrack(i + 1, path, current_sum + nums[i])
            path.pop()
    
    backtrack(0, [], 0)
    return result
```

---

## When to Use

Use the Subsets algorithm when you need to solve problems involving:

- **Power Set Generation**: All possible subsets of any size
- **Binary Decisions**: Each element has include/exclude choice
- **Subset Sum**: Finding subsets meeting sum criteria
- **Combinatorial Enumeration**: Exploring all possible groupings

### Comparison with Alternatives

| Approach | Time | Space | Best For |
|----------|------|-------|----------|
| **Backtracking** | O(n × 2^n) | O(n) aux | Clear, intuitive implementation |
| **Bit Manipulation** | O(n × 2^n) | O(n × 2^n) | Exact ordering control |
| **Iterative** | O(n × 2^n) | O(n × 2^n) | No recursion concerns |
| **Dynamic Programming** | Varies | Varies | Optimization over subsets |

### When to Choose Subsets vs Related Patterns

- **Choose Subsets** when:
  - You need ALL possible groupings of any size
  - Each element has a binary decision
  - Problem asks for "all possible combinations"

- **Choose Combinations** when:
  - You need groups of exactly size k
  - Order doesn't matter

- **Choose Permutations** when:
  - Order matters within the group
  - You need all arrangements

---

## Algorithm Explanation

### Core Concept

The key insight is that subset generation is equivalent to exploring all binary strings of length n. Each bit represents whether an element is included (1) or excluded (0). This creates a natural mapping between integers 0 to 2^n-1 and all possible subsets.

### How It Works

**Backtracking Approach**:
1. At each element, make two implicit choices: include or exclude
2. If we include: add to path and recurse
3. If we exclude: simply recurse (or backtrack after include)
4. Add path to results at every node

**Bit Manipulation Approach**:
1. Iterate through all numbers from 0 to 2^n-1
2. Each number represents a subset via its binary representation
3. Extract subset by checking which bits are set

### Visual Representation

For [1, 2, 3], the complete subset tree:

```
                        []
                    /        \
                [1]            []
              /    \         /    \
          [1,2]    [1]    [2]    []
          /  \      \      / \     \
      [1,2,3][1,2][1,3][1][2,3][2][3] []
```

All 8 nodes (including root) represent valid subsets.

### Why It Works

- **Complete**: Every possible grouping is generated
- **Unique**: Each subset appears exactly once
- **Systematic**: Follows clear decision tree structure
- **Extensible**: Easy to add constraints (sum, size, etc.)

### Limitations

- **Exponential Output**: Must generate 2^n subsets
- **Memory**: Storing all subsets requires O(n × 2^n) space
- **Practical Limit**: n > 20 typically too large
- **No Optimization**: Just enumeration, not finding optimal

---

## Practice Problems

### Problem 1: Subsets

**Problem:** [LeetCode 78 - Subsets](https://leetcode.com/problems/subsets/)

**Description:** Given an integer array `nums` of unique elements, return all possible subsets (the power set). The solution set must not contain duplicate subsets.

**How to Apply Subsets:**
- Classic power set generation
- Use any approach: backtracking, bit manipulation, or iterative
- Add copy of current path at every node
- Time: O(n × 2^n), Space: O(n × 2^n)

---

### Problem 2: Subsets II (With Duplicates)

**Problem:** [LeetCode 90 - Subsets II](https://leetcode.com/problems/subsets-ii/)

**Description:** Given an integer array `nums` that may contain duplicates, return all possible subsets. The solution set must not contain duplicate subsets.

**How to Apply Subsets:**
- Sort the array first to group duplicates
- Skip duplicates at same recursion level: `if i > start and nums[i] == nums[i-1]: continue`
- Use backtracking approach for easiest duplicate handling
- Time: O(n × 2^n), Space: O(n × 2^n)

---

### Problem 3: Combination Sum

**Problem:** [LeetCode 39 - Combination Sum](https://leetcode.com/problems/combination-sum/)

**Description:** Given an array of distinct integers `candidates` and a `target`, return all unique combinations where chosen numbers sum to target. Each number may be used unlimited times.

**How to Apply Subsets:**
- Similar to subsets but with sum constraint
- Prune when current sum exceeds target
- Allow reuse by passing `i` not `i+1` to recursion
- Time: O(target/min_candidate), Space: O(target/min_candidate)

---

### Problem 4: Letter Case Permutation

**Problem:** [LeetCode 784 - Letter Case Permutation](https://leetcode.com/problems/letter-case-permutation/)

**Description:** Given a string `s`, return all strings that can be created by changing the case of letters. Digits remain unchanged.

**How to Apply Subsets:**
- Treat each letter as having 2 choices (uppercase/lowercase)
- Digits have 1 choice (unchanged)
- Similar to binary subset decisions
- Time: O(2^L × n) where L is letter count, Space: O(2^L × n)

---

### Problem 5: Partition to K Equal Sum Subsets

**Problem:** [LeetCode 698 - Partition to K Equal Sum Subsets](https://leetcode.com/problems/partition-to-k-equal-sum-subsets/)

**Description:** Given an array of integers `nums` and a positive integer `k`, find whether it's possible to divide this array into k non-empty subsets whose sums are all equal.

**How to Apply Subsets:**
- Use backtracking to assign elements to k buckets
- Try placing each element in each valid bucket
- Prune when bucket sum exceeds target
- Time: O(k^n), Space: O(n)

---

## Video Tutorial Links

### Fundamentals

- [Subsets - Backtracking (Take U Forward)](https://www.youtube.com/watch?v=2kRjMKDkJoc) - Comprehensive introduction
- [Generate All Subsets (WilliamFiset)](https://www.youtube.com/watch?v=1Z6nKfqwJq0) - Visual explanation
- [LeetCode 78 - Subsets (NeetCode)](https://www.youtube.com/watch?v=OD0zN8F1zBw) - Practical guide

### Advanced Topics

- [Subsets II - Handling Duplicates](https://www.youtube.com/watch?v=rcR7yJ-aq-M) - Duplicate management
- [Bit Manipulation for Subsets](https://www.youtube.com/watch?v=0G3Zt9v-7U4) - Bit-based approach
- [Meet-in-the-Middle Technique](https://www.youtube.com/watch?v=KLlXCFG5S1k) - For larger n
- [Partition Equal Subset Sum](https://www.youtube.com/watch?v=3BDpLCQBsBA) - Subset sum variations

---

## Follow-up Questions

### Q1: How do you handle duplicates in subset generation?

**Answer:** The standard approach:
1. **Sort the array** to group duplicate elements together
2. **Skip at same level**: Use condition `if i > start and nums[i] == nums[i-1]: continue`
3. **Why it works**: At each recursion level, we only use the first occurrence of each value
4. **Result**: Each unique value is either included or not, duplicates don't create extra subsets

### Q2: What is the maximum n for practical subset generation?

**Answer:** Practical limits:
- **n ≤ 20**: Can generate and store all subsets (~1 million)
- **n = 20-25**: May cause memory issues but feasible
- **n > 25**: Consider alternative approaches:
  - Meet-in-the-middle (handles up to n=40)
  - Pruning with constraints
  - Lazy evaluation (generator pattern)
  - Dynamic programming for optimization problems

### Q3: Which approach is best - backtracking, bit manipulation, or iterative?

**Answer:** Depends on requirements:

| Criterion | Winner |
|-----------|--------|
| **Readability** | Backtracking |
| **Speed** | Bit manipulation (often faster in practice) |
| **No recursion** | Iterative |
| **Memory (auxiliary)** | Backtracking O(n) vs others O(n × 2^n) |
| **Specific subset size** | Bit manipulation with bit count check |

For interviews, backtracking is usually preferred for clarity.

### Q4: How do you find subset sum without generating all subsets?

**Answer:** Use dynamic programming:

```python
def has_subset_sum(nums, target):
    """Check if any subset sums to target using DP."""
    dp = [False] * (target + 1)
    dp[0] = True
    
    for num in nums:
        for i in range(target, num - 1, -1):
            dp[i] = dp[i] or dp[i - num]
    
    return dp[target]
```

This runs in O(n × target) time, much faster than O(2^n) for reasonable targets.

### Q5: How do you generate subsets in sorted/lexicographic order?

**Answer:** Three approaches:

1. **Sort input first**: Results will be in sorted order naturally
2. **Bit manipulation**: Iterate masks in order (already sorted for sorted input)
3. **Backtracking with sorted input**: Natural sorted order due to forward selection

```python
def subsets_sorted(nums):
    nums.sort()  # Ensure sorted order
    # ... any approach will now give sorted subsets
```

---

## Summary

The Subsets algorithm is a fundamental technique for generating the power set of a given set. Key takeaways:

- **Power Set Size**: Exactly 2^n subsets for n elements
- **Three Approaches**: Backtracking (intuitive), Bit manipulation (fast), Iterative (simple)
- **Time Complexity**: O(n × 2^n) — optimal since output is that size
- **Space Complexity**: O(n) auxiliary for backtracking, O(n × 2^n) for storage
- **Duplicates**: Sort input, skip duplicates at same recursion level
- **Practical Limit**: n ≤ 20 for storing all subsets

When to use:
- ✅ Generating all possible groupings
- ✅ Problems with binary element choices
- ✅ Subset sum and constrained subset problems
- ❌ When n is very large without constraints
- ❌ When only existence check needed (use DP instead)

Master the subset pattern as it forms the foundation for many combinatorial problems and appears frequently in technical interviews and competitive programming.
