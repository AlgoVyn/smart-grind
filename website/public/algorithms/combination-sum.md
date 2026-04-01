# Combination Sum

## Category
Backtracking

## Description

The Combination Sum algorithm finds all unique combinations of elements from a given set that sum up to a target value. This classic backtracking problem allows each element to be used **unlimited times** (unbounded knapsack variant), making it distinct from standard combination problems where each element can only be used once.

This pattern is fundamental in competitive programming and technical interviews for solving subset generation problems, knapsack variations, and recursive pattern matching. The algorithm systematically explores all possible combinations using backtracking while efficiently pruning the search space.

---

## Concepts

The Combination Sum algorithm is built on several fundamental concepts that make it powerful for solving subset generation problems.

### 1. Backtracking Pattern

The core backtracking pattern follows three steps:

| Step | Action | Purpose |
|------|--------|---------|
| **Choose** | Add element to current combination | Include the element in solution |
| **Explore** | Recursively build combinations | Find all valid extensions |
| **Unchoose** | Remove element (backtrack) | Try alternative combinations |

### 2. Unbounded vs Bounded

Understanding the difference between unlimited and limited element usage:

| Type | Recursive Call | Use Case |
|------|----------------|----------|
| **Unbounded** | `backtrack(i, ...)` | Same index allows reuse (Combination Sum I) |
| **Bounded** | `backtrack(i+1, ...)` | Next index only, no reuse (Combination Sum II) |

### 3. Pruning Strategy

Early termination conditions that reduce the search space:

```
if candidate > remaining:
    break  # All subsequent candidates are larger (after sorting)
```

### 4. Duplicate Prevention

Avoid generating duplicate combinations like [2,3] and [3,2]:

- Always iterate from current index forward
- Never revisit earlier indices
- Sorting helps both with pruning and consistency

---

## Frameworks

Structured approaches for solving combination sum problems.

### Framework 1: Unbounded Knapsack Template

```
┌─────────────────────────────────────────────────────┐
│  UNBOUNDED COMBINATION SUM FRAMEWORK                │
├─────────────────────────────────────────────────────┤
│  1. Sort candidates (optional but recommended)     │
│  2. Initialize result list                          │
│  3. Define backtrack(start, current, remaining):   │
│     a. If remaining == 0: add to result            │
│     b. For i from start to end:                    │
│        - If candidates[i] > remaining: break       │
│        - Add candidates[i] to current              │
│        - Recurse with same index i                 │
│        - Remove candidates[i] (backtrack)          │
│  4. Call backtrack(0, [], target)                  │
│  5. Return result                                   │
└─────────────────────────────────────────────────────┘
```

**When to use**: Elements can be used unlimited times, need all combinations.

### Framework 2: Bounded Knapsack Template

```
┌─────────────────────────────────────────────────────┐
│  BOUNDED COMBINATION SUM FRAMEWORK                  │
├─────────────────────────────────────────────────────┤
│  1. Sort candidates                                 │
│  2. Initialize result list                          │
│  3. Define backtrack(start, current, remaining):   │
│     a. If remaining == 0: add to result            │
│     b. For i from start to end:                    │
│        - Skip duplicates: if i > start and         │
│          candidates[i] == candidates[i-1]: continue│
│        - If candidates[i] > remaining: break       │
│        - Add candidates[i] to current              │
│        - Recurse with index i+1 (no reuse)         │
│        - Remove candidates[i] (backtrack)          │
│  4. Call backtrack(0, [], target)                  │
│  5. Return result                                   │
└─────────────────────────────────────────────────────┘
```

**When to use**: Each element can be used at most once.

### Framework 3: Count-Only Template

```
┌─────────────────────────────────────────────────────┐
│  COUNT WAYS FRAMEWORK (Dynamic Programming)        │
├─────────────────────────────────────────────────────┤
│  1. Initialize dp[0] = 1 (one way to make sum 0)   │
│  2. For each candidate:                             │
│     a. For sum from candidate to target:            │
│        - dp[sum] += dp[sum - candidate]            │
│  3. Return dp[target]                               │
└─────────────────────────────────────────────────────┘
```

**When to use**: Only need the count, not the actual combinations.

---

## Forms

Different manifestations of the combination sum pattern.

### Form 1: Basic Combination Sum

Find all combinations that sum to target with unlimited usage.

| Feature | Specification |
|---------|---------------|
| Element Usage | Unlimited |
| Output | All unique combinations |
| Approach | Backtracking |
| Complexity | O(2^n) worst case |

### Form 2: Combination Sum with Limited Usage

Each element can be used at most once.

| Feature | Specification |
|---------|---------------|
| Element Usage | At most once per element |
| Duplicates | Handle duplicate candidates carefully |
| Recursive Index | i+1 (move to next) |
| Skip Logic | Skip duplicates at same level |

### Form 3: Count of Combinations

Return only the count, not the actual combinations.

| Approach | Time | Space | When to Use |
|----------|------|-------|-------------|
| **Backtracking** | O(2^n) | O(target) | Need actual combinations |
| **DP** | O(n×target) | O(target) | Count only, small target |
| **Memoization** | O(n×target) | O(n×target) | Overlapping subproblems |

### Form 4: K-Element Combinations

Find combinations using exactly k elements that sum to target.

```
Additional parameter: count of elements used
Base case: remaining == 0 AND count == 0
```

### Form 5: Iterative/BFS Approach

Build combinations level by level using iteration.

```
Queue stores: (current_combination, current_sum, start_index)
Process level by level until sum equals target
```

---

## Tactics

Specific techniques and optimizations.

### Tactic 1: Early Pruning with Sorting

```python
def combination_sum_pruned(candidates, target):
    candidates.sort()  # Enable pruning
    result = []
    
    def backtrack(start, current, remaining):
        if remaining == 0:
            result.append(list(current))
            return
        
        for i in range(start, len(candidates)):
            # Pruning: break if candidate exceeds remaining
            if candidates[i] > remaining:
                break
            current.append(candidates[i])
            backtrack(i, current, remaining - candidates[i])  # Same i for reuse
            current.pop()
    
    backtrack(0, [], target)
    return result
```

### Tactic 2: Duplicate Handling

```python
def combination_sum_no_duplicates(candidates, target):
    candidates.sort()
    result = []
    
    def backtrack(start, current, remaining):
        if remaining == 0:
            result.append(list(current))
            return
        
        for i in range(start, len(candidates)):
            # Skip duplicates at same recursion level
            if i > start and candidates[i] == candidates[i-1]:
                continue
            if candidates[i] > remaining:
                break
            current.append(candidates[i])
            backtrack(i + 1, current, remaining - candidates[i])  # i+1 for no reuse
            current.pop()
    
    backtrack(0, [], target)
    return result
```

### Tactic 3: Optimization with Prefix Sum

Precompute to quickly check if remaining can be achieved:

```python
def can_complete(remaining, candidates, start):
    """Quick check if remaining sum is possible."""
    min_remaining = min(candidates[start:]) if start < len(candidates) else float('inf')
    return remaining >= min_remaining
```

### Tactic 4: Memoization for Overlapping Subproblems

```python
from functools import lru_cache

def combination_sum_memo(candidates, target):
    candidates.sort()
    
    @lru_cache(maxsize=None)
    def dp(index, remaining):
        if remaining == 0:
            return [[]]
        if remaining < 0 or index >= len(candidates):
            return []
        
        # Include current
        include = [[candidates[index]] + combo 
                   for combo in dp(index, remaining - candidates[index])]
        # Exclude current
        exclude = dp(index + 1, remaining)
        
        return include + exclude
    
    return dp(0, target)
```

### Tactic 5: Iterative Breadth-First Approach

```python
from collections import deque

def combination_sum_bfs(candidates, target):
    candidates.sort()
    result = []
    queue = deque([([], 0, 0)])  # (combination, sum, start_index)
    
    while queue:
        current, total, start = queue.popleft()
        
        if total == target:
            result.append(current)
            continue
        
        for i in range(start, len(candidates)):
            new_total = total + candidates[i]
            if new_total > target:
                break
            queue.append((current + [candidates[i]], new_total, i))
    
    return result
```

---

## Python Templates

### Template 1: Unbounded Combination Sum

```python
def combination_sum(candidates: list[int], target: int) -> list[list[int]]:
    """
    Find all unique combinations of candidates that sum to target.
    Each candidate may be used unlimited times.
    
    Time: O(2^n) where n is number of candidates
    Space: O(target) for recursion stack
    """
    candidates.sort()
    result = []
    
    def backtrack(start: int, current: list[int], remaining: int) -> None:
        """Recursively build combinations."""
        # Base case: found valid combination
        if remaining == 0:
            result.append(list(current))
            return
        
        # Try each candidate from start index
        for i in range(start, len(candidates)):
            # Pruning: if candidate > remaining, no need to try larger ones
            if candidates[i] > remaining:
                break
            
            # Choose: add candidate to current combination
            current.append(candidates[i])
            
            # Explore: recurse with same index (unlimited use allowed)
            backtrack(i, current, remaining - candidates[i])
            
            # Unchoose: backtrack by removing the candidate
            current.pop()
    
    backtrack(0, [], target)
    return result
```

### Template 2: Bounded Combination Sum (No Reuse)

```python
def combination_sum2(candidates: list[int], target: int) -> list[list[int]]:
    """
    Find all unique combinations where each number may only be used once.
    
    Time: O(2^n)
    Space: O(target)
    """
    candidates.sort()
    result = []
    
    def backtrack(start: int, current: list[int], remaining: int) -> None:
        if remaining == 0:
            result.append(list(current))
            return
        
        for i in range(start, len(candidates)):
            # Skip duplicates at the same level
            if i > start and candidates[i] == candidates[i - 1]:
                continue
            
            if candidates[i] > remaining:
                break
            
            current.append(candidates[i])
            # Use i + 1 instead of i (no reuse)
            backtrack(i + 1, current, remaining - candidates[i])
            current.pop()
    
    backtrack(0, [], target)
    return result
```

### Template 3: Count Ways (Dynamic Programming)

```python
def combination_sum_count(candidates: list[int], target: int) -> int:
    """
    Count number of ways to make target (not enumerate).
    Time: O(n × target)
    Space: O(target)
    """
    dp = [0] * (target + 1)
    dp[0] = 1  # One way to make sum 0 (use nothing)
    
    for candidate in candidates:
        for i in range(candidate, target + 1):
            dp[i] += dp[i - candidate]
    
    return dp[target]
```

### Template 4: K-Element Combination Sum

```python
def combination_sum3(k: int, target: int) -> list[list[int]]:
    """
    Find all valid combinations of k numbers that sum to target.
    Numbers are 1-9, each used at most once.
    
    Time: O(C(9,k)) - combinations of 9 taken k at a time
    Space: O(k)
    """
    result = []
    
    def backtrack(start: int, current: list[int], remaining: int, count: int) -> None:
        # Base case: found valid combination
        if remaining == 0 and count == 0:
            result.append(list(current))
            return
        
        # Pruning
        if remaining < 0 or count < 0:
            return
        
        for i in range(start, 10):
            current.append(i)
            backtrack(i + 1, current, remaining - i, count - 1)
            current.pop()
    
    backtrack(1, [], target, k)
    return result
```

### Template 5: Find Actual Partition

```python
def find_partition(nums: list[int]) -> tuple[list[int], list[int]]:
    """
    Find the actual partition of array into two equal-sum subsets.
    Returns ([], []) if partition is impossible.
    
    Time: O(n × sum)
    Space: O(n × sum) for tracking choices
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
            subset2.append(nums[i-1])
        else:
            subset1.append(nums[i-1])
            s -= nums[i-1]
    
    return subset1, subset2
```

### Template 6: Minimum Combination Sum (Shortest Path)

```python
def min_combination_sum(candidates: list[int], target: int) -> int:
    """
    Find minimum number of elements needed to sum to target.
    Returns -1 if impossible.
    
    Time: O(n × target)
    Space: O(target)
    """
    dp = [float('inf')] * (target + 1)
    dp[0] = 0
    
    for i in range(1, target + 1):
        for candidate in candidates:
            if candidate <= i:
                dp[i] = min(dp[i], dp[i - candidate] + 1)
    
    return dp[target] if dp[target] != float('inf') else -1
```

---

## When to Use

Use the Combination Sum algorithm when you need to solve problems involving:

- **Subset Generation**: Finding all possible subsets that satisfy a sum constraint
- **Unbounded Knapsack**: Items can be selected multiple times to reach a target
- **Recursive Pattern Matching**: Building combinations incrementally with backtracking
- **Target Sum Problems**: When you need to enumerate all ways to reach a specific value

### Comparison with Alternatives

| Approach | Time Complexity | Space Complexity | Use Case |
|----------|----------------|------------------|----------|
| **Backtracking** | O(2^n) | O(target) | Finding all combinations |
| **Dynamic Programming (Count)** | O(n × target) | O(target) | Count ways (not enumerate) |
| **BFS/Iterative** | O(2^n) | O(2^n) | Level-order exploration |
| **Memoization** | O(n × target) | O(n × target) | Overlapping subproblems |

### When to Choose Backtracking vs Dynamic Programming

- **Choose Backtracking** when:
  - You need to enumerate all valid combinations (not just count)
  - The solution requires returning actual subsets
  - Input size is manageable (typically n ≤ 30)

- **Choose Dynamic Programming** when:
  - You only need the count of ways (not the actual combinations)
  - The target value is small (typically ≤ 1000)
  - Space optimization is critical

---

## Algorithm Explanation

### Core Concept

The Combination Sum problem uses **backtracking** to systematically explore all possible combinations. The key insight is that we can build solutions incrementally by:

1. **Choosing** an element to include
2. **Exploring** all combinations with that choice
3. **Unchoosing** (backtracking) to try alternatives

Since elements can be reused unlimited times, after choosing an element at index `i`, we recursively explore starting from the **same index** (not `i+1`), allowing unlimited selections.

### How It Works

#### Recursive Backtracking Strategy:

```
backtrack(start_index, current_combination, remaining_target):
    if remaining_target == 0:
        found a valid combination!
        return
    
    for i from start_index to end:
        if candidates[i] > remaining_target:
            break  // prune: no need to try larger values
        
        add candidates[i] to current_combination
        backtrack(i, current_combination, remaining - candidates[i])  // same i allows reuse
        remove candidates[i] from current_combination  // backtrack
```

#### Why Sort First?

Sorting the candidates array enables **pruning**:
- If `candidates[i] > remaining`, all subsequent candidates (being larger) will also exceed the target
- This early termination significantly reduces the search space

### Visual Representation

For `candidates = [2, 3, 6, 7]`, `target = 7`:

```
Start (target=7)
├── 2 (target=5)
│   ├── 2 (target=3)
│   │   ├── 2 (target=1) → 2 > 1, prune
│   │   └── 3 (target=0) → [2,2,3] ✓
│   └── 3 (target=2) → 3 > 2, prune
├── 3 (target=4)
│   ├── 3 (target=1) → 3 > 1, prune
│   └── 6 (target=-2) → skip
├── 6 (target=1) → 6 > 1, prune
└── 7 (target=0) → [7] ✓
```

### Key Insights

1. **Same index recursion**: `backtrack(i, ...)` allows unlimited usage of element at index `i`
2. **No duplicates**: By only moving forward (`start` index), we avoid generating duplicate combinations like [2,3] and [3,2]
3. **Pruning power**: Early termination when `candidate > remaining` saves significant computation

### Limitations

- **Exponential time**: O(2^n) in worst case - not suitable for very large inputs
- **Stack depth**: Recursion depth limited by target value
- **Memory**: All combinations stored in memory simultaneously

---

## Practice Problems

### Problem 1: Combination Sum

**Problem:** [LeetCode 39 - Combination Sum](https://leetcode.com/problems/combination-sum/)

**Description:** Given an array of distinct integers `candidates` and a target integer `target`, return a list of all unique combinations of `candidates` where the chosen numbers sum to `target`. You may return the combinations in any order.

**How to Apply Combination Sum:**
- Use same index in recursive call for unlimited reuse
- Sort candidates to enable pruning
- Handle base case when remaining target equals 0

---

### Problem 2: Combination Sum II

**Problem:** [LeetCode 40 - Combination Sum II](https://leetcode.com/problems/combination-sum-ii/)

**Description:** Given a collection of candidate numbers (`candidates`) and a target number (`target`), find all unique combinations in `candidates` where the candidate numbers sum to `target`. Each number in `candidates` may only be used once in the combination.

**How to Apply Combination Sum:**
- Use index i+1 instead of i to prevent reuse
- Skip duplicates at the same recursion level
- Sort candidates first to handle duplicates efficiently

---

### Problem 3: Combination Sum III

**Problem:** [LeetCode 216 - Combination Sum III](https://leetcode.com/problems/combination-sum-iii/)

**Description:** Find all valid combinations of `k` numbers that sum up to `n` such that only numbers 1 through 9 are used and each number is used at most once.

**How to Apply Combination Sum:**
- Add a count parameter to track numbers used
- Base case checks both remaining sum and remaining count
- Iterate from 1 to 9 only

---

### Problem 4: Combination Sum IV

**Problem:** [LeetCode 377 - Combination Sum IV](https://leetcode.com/problems/combination-sum-iv/)

**Description:** Given an array of distinct integers `nums` and a target integer `target`, return the number of possible combinations that add up to `target`. The answer fits in a 32-bit integer.

**How to Apply Combination Sum:**
- Use Dynamic Programming instead of backtracking
- dp[i] = number of ways to form sum i
- Different sequences are counted as different combinations

---

### Problem 5: Target Sum

**Problem:** [LeetCode 494 - Target Sum](https://leetcode.com/problems/target-sum/)

**Description:** You are given an integer array `nums` and an integer `target`. You want to build an expression out of `nums` by adding one of the symbols `+` or `-` before each integer in `nums` and then concatenate all the integers.

**How to Apply Combination Sum:**
- Transform into a subset sum problem: find subset P such that sum(P) - sum(nums-P) = target
- This simplifies to finding subset with sum = (target + sum(nums)) / 2
- Apply standard combination sum/count DP approach

---

## Video Tutorial Links

### Fundamentals

- [Combination Sum - Backtracking Pattern (NeetCode)](https://www.youtube.com/watch?v=GBKI9VSKdGg) - Comprehensive backtracking explanation
- [Combination Sum Explained (Tech With Tim)](https://www.youtube.com/watch?v=FBwQLllxLxA) - Python implementation walkthrough
- [Backtracking Algorithm Introduction (Back To Back SWE)](https://www.youtube.com/watch?v=Zq4upTEaQyM) - General backtracking concepts

### Problem-Specific Tutorials

- [LeetCode 39 - Combination Sum (Nick White)](https://www.youtube.com/watch?v=qsMb8Oj2p9E) - Step-by-step solution
- [Combination Sum II & III (Kevin Naughton Jr.)](https://www.youtube.com/watch?v=J8vRL1LLjC4) - Variations explained
- [Combination Sum IV - DP Solution](https://www.youtube.com/watch?v=dw22KyPzn2Y) - Dynamic programming approach

### Advanced Topics

- [Backtracking vs Dynamic Programming](https://www.youtube.com/watch?v=Hv73s1jwQdd) - When to use each
- [Pruning Techniques in Backtracking](https://www.youtube.com/watch?v=73l5p8b3Nrs) - Optimization strategies
- [Time and Space Complexity Analysis](https://www.youtube.com/watch?v=0TNztf2r6Hk) - Detailed complexity breakdown

---

## Follow-up Questions

### Q1: Why do we use the same index `i` instead of `i+1` in the recursive call?

**Answer:** We use the same index `i` to allow **unlimited reuse** of the same element:
- `backtrack(i, ...)` allows using `candidates[i]` again
- `backtrack(i+1, ...)` would only allow using elements after `i` (no reuse)
- This is the key difference between Combination Sum I (unlimited reuse) and Combination Sum II (single use)

---

### Q2: What happens if we don't sort the candidates array?

**Answer:** The algorithm still works but without optimization:
- **Correctness**: Unchanged - all valid combinations are still found
- **Performance**: Loses pruning optimization - can't break early when `candidate > remaining`
- **Duplicates**: Still avoided by the start index constraint
- **Recommendation**: Always sort for better performance, especially with large targets

---

### Q3: How do we handle negative numbers in candidates?

**Answer:** The standard algorithm requires modification:
- **Problem**: With negative numbers, the recursion may not terminate
- **Solution**: Add additional constraints (e.g., limit combination length)
- **Alternative**: Use Dynamic Programming with memoization
- **Note**: Most Combination Sum problems specify positive integers only

---

### Q4: What is the maximum input size this algorithm can handle?

**Answer:** Practical limits depend on constraints:
- **Candidates (n)**: Up to ~30 for backtracking (exponential complexity)
- **Target**: Up to ~500 (affects recursion depth and pruning effectiveness)
- **Time**: Worst case 2^30 ≈ 1 billion operations (too slow)
- **Space**: Recursion depth limited by target/min_candidate
- **For larger inputs**: Use Dynamic Programming or memoization

---

### Q5: How does this differ from the 0/1 Knapsack problem?

**Answer:** Key differences:

| Aspect | Combination Sum | 0/1 Knapsack |
|--------|-----------------|--------------|
| **Reuse** | Unlimited | Each item once |
| **Goal** | Exact sum match | Maximize value within capacity |
| **Output** | All valid combinations | Maximum value |
| **Approach** | Backtracking | DP (usually) |
| **Complexity** | O(2^n) | O(n × W) |

Combination Sum is essentially the **unbounded knapsack** variant with exact sum constraint.

---

## Summary

The Combination Sum algorithm is a classic **backtracking** problem that demonstrates systematic exploration of all possible solutions. Key takeaways:

- **Backtracking pattern**: Choose → Explore → Unchoose
- **Unlimited reuse**: Use same index `i` in recursive call
- **Avoid duplicates**: Only explore candidates from current index forward
- **Pruning**: Sort candidates to enable early termination
- **Trade-offs**: Backtracking for enumeration, DP for counting only

### When to Use:
- ✅ Finding all valid combinations/subsets
- ✅ Target sum problems with unlimited element reuse
- ✅ Input size is small to moderate (n ≤ 30)

### When NOT to Use:
- ❌ When you only need the count (use DP)
- ❌ Very large input sizes (exponential complexity)
- ❌ Problems requiring optimization (max/min value)

### Key Implementation Points:
1. Sort candidates for pruning (optional but recommended)
2. Recursive function with `start` index parameter
3. Base case when remaining target equals 0
4. Loop from `start` to end of candidates
5. Backtrack by removing last added element

This pattern appears frequently in technical interviews and competitive programming, making it essential to master the backtracking approach and understand when to apply optimizations.
