# 0/1 Knapsack

## Category
Dynamic Programming

## Description

The 0/1 Knapsack is a classic dynamic programming problem where we have **n items**, each with a **weight** and a **value**. Given a knapsack with capacity **W**, we need to select items such that the total weight doesn't exceed W while maximizing the total value. Each item can only be taken once (0 or 1 time).

This problem demonstrates fundamental dynamic programming concepts including optimal substructure and overlapping subproblems, making it essential for understanding DP fundamentals. The pattern appears frequently in resource allocation problems, subset selection, and optimization with constraints.

---

## Concepts

The 0/1 Knapsack technique is built on several fundamental concepts that make it powerful for solving constrained optimization problems.

### 1. Binary Choice

Each item presents a binary decision:

| Choice | Action | Result |
|--------|--------|--------|
| **0 (Don't take)** | Skip item i | Keep current value at capacity w |
| **1 (Take)** | Include item i | Add item's value, reduce remaining capacity |

This binary choice creates 2^n possible combinations, but DP reduces this to O(n × W).

### 2. Optimal Substructure

The optimal solution for n items can be built from optimal solutions of n-1 items:

```
For capacity w:
- If we don't take item i: solution = dp[i-1][w]
- If we take item i: solution = dp[i-1][w-weight[i]] + value[i]
- Take the maximum of both choices
```

### 3. Overlapping Subproblems

The same subproblems are computed multiple times without memoization. DP tables store these results for reuse.

| Subproblem | Meaning |
|------------|---------|
| `dp[i][w]` | Max value using first i items with capacity w |
| `dp[i-1][w]` | Max value without item i |
| `dp[i-1][w-weight[i]]` | Max value with item i included |

### 4. Space Optimization Principle

The 2D DP can be reduced to 1D by iterating capacity backwards:

| Approach | Space | Trade-off |
|----------|-------|-----------|
| 2D DP | O(n × W) | Can reconstruct solution |
| 1D DP | O(W) | Cannot easily reconstruct |

---

## Frameworks

Structured approaches for solving 0/1 Knapsack problems.

### Framework 1: 2D DP Table Template

```
┌─────────────────────────────────────────────────────┐
│  2D DP TABLE FRAMEWORK                              │
├─────────────────────────────────────────────────────┤
│  1. Create dp[n+1][W+1] initialized to 0            │
│  2. For each item i from 1 to n:                   │
│     For each capacity w from 0 to W:               │
│       a. Don't take: dp[i][w] = dp[i-1][w]         │
│       b. If weight[i-1] ≤ w:                       │
│          Take: dp[i][w] = max(dp[i][w],            │
│                      dp[i-1][w-weight[i-1]] + value[i-1])│
│  3. Return dp[n][W]                                 │
└─────────────────────────────────────────────────────┘
```

**When to use**: When you need to reconstruct which items were selected.

### Framework 2: 1D Space-Optimized Template

```
┌─────────────────────────────────────────────────────┐
│  1D SPACE-OPTIMIZED FRAMEWORK                         │
├─────────────────────────────────────────────────────┤
│  1. Create dp[W+1] initialized to 0                  │
│  2. For each item i from 0 to n-1:                 │
│     For w from W down to weight[i]:                │
│       dp[w] = max(dp[w], dp[w-weight[i]] + value[i])│
│  3. Return dp[W]                                     │
│                                                      │
│  Key: Iterate BACKWARDS to prevent using same      │
│       item multiple times                           │
└─────────────────────────────────────────────────────┘
```

**When to use**: When only the maximum value is needed (not which items).

### Framework 3: Solution Reconstruction Framework

```
┌─────────────────────────────────────────────────────┐
│  SOLUTION RECONSTRUCTION FRAMEWORK                  │
├─────────────────────────────────────────────────────┤
│  1. Build full 2D dp table                           │
│  2. Create keep[i][w] = True if item i-1 selected    │
│  3. Backtrack from dp[n][W]:                         │
│     w = W                                            │
│     for i from n down to 1:                        │
│       if keep[i][w]:                               │
│         add item i-1 to result                       │
│         w -= weight[i-1]                             │
│  4. Return selected items                            │
└─────────────────────────────────────────────────────┘
```

**When to use**: When you need to know exactly which items form the optimal solution.

---

## Forms

Different manifestations of the 0/1 Knapsack pattern.

### Form 1: Classic Value Maximization

Maximize total value with exact or at-most weight constraint.

| Problem Type | State Definition | Transition |
|--------------|------------------|------------|
| Max value | `dp[w] = max value` | `max(dp[w], dp[w-weight] + value)` |
| Count ways | `dp[w] += dp[w-weight]` | Add ways to reach remaining capacity |
| Min items | `dp[w] = min coins` | `min(dp[w], dp[w-weight] + 1)` |

### Form 2: Subset Sum (Decision Variant)

Determine if a subset with exact sum exists.

```
dp[i][w] = True if sum w achievable with first i items
dp[i][w] = dp[i-1][w] OR dp[i-1][w-nums[i-1]]
```

**Example**: Partition Equal Subset Sum - can array be split into two equal sums?

### Form 3: Multi-Dimensional Knapsack

Multiple constraints (e.g., weight and volume).

```
dp[w][v] = max value with weight ≤ w and volume ≤ v
```

**Example**: Ones and Zeroes - maximize strings with m zeros and n ones constraint.

### Form 4: Group Knapsack

Items are in groups, pick at most one from each group.

```
For each group:
    For each capacity (backwards):
        Try each item in group
```

### Form 5: Dependent Knapsack

Items have dependencies (taking item A requires taking item B).

---

## Tactics

Specific techniques and optimizations.

### Tactic 1: Backward Iteration for 0/1 Property

The key to 0/1 knapsack space optimization:

```python
# WRONG - allows multiple uses (unbounded knapsack)
for w in range(weight[i], W + 1):
    dp[w] = max(dp[w], dp[w - weight[i]] + value[i])

# CORRECT - 0/1 knapsack (each item once)
for w in range(W, weight[i] - 1, -1):
    dp[w] = max(dp[w], dp[w - weight[i]] + value[i])
```

**Why**: Backward iteration uses values from previous iteration, preventing reuse.

### Tactic 2: Early Termination Optimization

Skip items that exceed capacity:

```python
for i in range(n):
    if weights[i] > W:
        continue  # Item can't fit, skip it
    for w in range(W, weights[i] - 1, -1):
        dp[w] = max(dp[w], dp[w - weights[i]] + values[i])
```

### Tactic 3: Value-Weight Ratio Pruning

For approximate solutions or heuristics:

```python
def sort_by_density(items):
    """Sort by value/weight ratio descending."""
    return sorted(items, key=lambda x: x.value/x.weight, reverse=True)
```

### Tactic 4: Meet-in-the-Middle for Large W

When W is too large for O(n × W):

```python
def meet_in_middle(values, weights, W):
    """Split items into two halves, enumerate all subsets of each."""
    n = len(values)
    mid = n // 2
    
    # Generate all subsets for both halves
    left_subsets = generate_subsets(values[:mid], weights[:mid])
    right_subsets = generate_subsets(values[mid:], weights[mid:])
    
    # Sort and use two-pointer to find optimal combination
    left_subsets.sort()
    right_subsets.sort(reverse=True)
    
    # Find best combination not exceeding W
    return find_optimal_combination(left_subsets, right_subsets, W)
```

### Tactic 5: Bounded to 0/1 Conversion

Convert items with limits to multiple 0/1 items using binary splitting:

```python
def binary_split(limit, value, weight):
    """Convert k copies to log(k) 0/1 items."""
    items = []
    k = 1
    while limit > 0:
        take = min(k, limit)
        items.append((take * value, take * weight))
        limit -= take
        k *= 2
    return items
```

---

## Python Templates

### Template 1: 2D DP with Full Table

```python
def knapsack_01_2d(values: list[int], weights: list[int], capacity: int) -> int:
    """
    Template 1: 2D DP approach - can reconstruct solution.
    Time: O(n * W), Space: O(n * W)
    """
    if not values or not weights or capacity <= 0:
        return 0
    
    n = len(values)
    # dp[i][w] = max value using first i items with capacity w
    dp = [[0] * (capacity + 1) for _ in range(n + 1)]
    
    for i in range(1, n + 1):
        for w in range(capacity + 1):
            # Don't include item i-1
            dp[i][w] = dp[i - 1][w]
            
            # Include item i-1 if it fits
            if weights[i - 1] <= w:
                dp[i][w] = max(
                    dp[i][w],
                    dp[i - 1][w - weights[i - 1]] + values[i - 1]
                )
    
    return dp[n][capacity]
```

### Template 2: 1D Space Optimized

```python
def knapsack_01_1d(values: list[int], weights: list[int], capacity: int) -> int:
    """
    Template 2: Space-optimized 1D DP.
    Time: O(n * W), Space: O(W)
    """
    if not values or not weights or capacity <= 0:
        return 0
    
    n = len(values)
    dp = [0] * (capacity + 1)
    
    for i in range(n):
        # CRITICAL: Iterate backwards for 0/1 property
        for w in range(capacity, weights[i] - 1, -1):
            dp[w] = max(dp[w], dp[w - weights[i]] + values[i])
    
    return dp[capacity]
```

### Template 3: With Solution Reconstruction

```python
def knapsack_01_with_items(values: list[int], weights: list[int], capacity: int):
    """
    Template 3: Returns both max value and selected items.
    Time: O(n * W), Space: O(n * W)
    """
    if not values or not weights or capacity <= 0:
        return 0, []
    
    n = len(values)
    dp = [[0] * (capacity + 1) for _ in range(n + 1)]
    keep = [[False] * (capacity + 1) for _ in range(n + 1)]
    
    for i in range(1, n + 1):
        for w in range(capacity + 1):
            dp[i][w] = dp[i - 1][w]  # Don't take
            
            if weights[i - 1] <= w:
                include_val = dp[i - 1][w - weights[i - 1]] + values[i - 1]
                if include_val > dp[i - 1][w]:
                    dp[i][w] = include_val
                    keep[i][w] = True
    
    # Backtrack to find items
    items = []
    w = capacity
    for i in range(n, 0, -1):
        if keep[i][w]:
            items.append(i - 1)
            w -= weights[i - 1]
    
    return dp[n][capacity], items
```

### Template 4: Subset Sum (Decision Variant)

```python
def subset_sum(nums: list[int], target: int) -> bool:
    """
    Template 4: Check if any subset sums to target.
    Classic knapsack variation - returns boolean.
    Time: O(n * target), Space: O(target)
    """
    dp = [False] * (target + 1)
    dp[0] = True
    
    for num in nums:
        # Backwards to prevent reuse
        for t in range(target, num - 1, -1):
            if dp[t - num]:
                dp[t] = True
    
    return dp[target]
```

### Template 5: Count Number of Subsets

```python
def count_subsets(nums: list[int], target: int) -> int:
    """
    Template 5: Count subsets that sum to target.
    Time: O(n * target), Space: O(target)
    """
    MOD = 10**9 + 7
    dp = [0] * (target + 1)
    dp[0] = 1  # Empty subset
    
    for num in nums:
        for t in range(target, num - 1, -1):
            dp[t] = (dp[t] + dp[t - num]) % MOD
    
    return dp[target]
```

### Template 6: 2D Knapsack (Two Constraints)

```python
def knapsack_2d(strs: list[str], m: int, n: int) -> int:
    """
    Template 6: Two-dimensional knapsack (e.g., Ones and Zeroes).
    dp[i][j] = max strings using i zeros and j ones.
    Time: O(len(strs) * m * n), Space: O(m * n)
    """
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    for s in strs:
        zeros = s.count('0')
        ones = len(s) - zeros
        
        # Backwards in both dimensions
        for i in range(m, zeros - 1, -1):
            for j in range(n, ones - 1, -1):
                dp[i][j] = max(dp[i][j], dp[i - zeros][j - ones] + 1)
    
    return dp[m][n]
```

---

## When to Use

Use the 0/1 Knapsack algorithm when you need to solve problems involving:

- **Resource Allocation**: Limited capacity with items to choose from
- **Binary Choice Problems**: Every item has a "take it or leave it" decision
- **Optimization with Constraints**: Maximize value under weight/cost constraints
- **Selection Problems**: Choose subset of items that maximize total value
- **Partition Problems**: Divide items into groups with constraints

### Comparison with Alternatives

| Algorithm | Use Case | Time Complexity | Space Complexity |
|-----------|----------|-----------------|------------------|
| **0/1 Knapsack (DP)** | Exactly one of each item | O(n × W) | O(n × W) or O(W) |
| **Unbounded Knapsack** | Unlimited copies of each item | O(n × W) | O(W) |
| **Fractional Knapsack** | Can take fractions of items | O(n log n) | O(n) |
| **Meet-in-Middle** | Large W (2^n/2 subsets) | O(2^(n/2)) | O(2^(n/2)) |
| **Greedy** | Fractional only | O(n log n) | O(n) |

### When to Choose 0/1 Knapsack vs Other Variations

- **Choose 0/1 Knapsack** when:
  - Each item can be taken at most once
  - You need exact optimization (not approximation)
  - The problem explicitly states "each item can be used once"
  - n × W is feasible (typically n ≤ 10³, W ≤ 10⁴)

- **Choose Unbounded Knapsack** when:
  - You can use each item unlimited times
  - Coin change problems (minimum/maximum coins)

- **Choose Fractional Knapsack** when:
  - You can take fractions of items
  - Real-world scenarios like cutting gold bars

---

## Algorithm Explanation

### Core Concept

The key insight behind 0/1 Knapsack is that for each item, we have a **binary choice**: either include it in the knapsack or don't. This creates a decision tree of possibilities, but we can optimize using dynamic programming by building solutions from smaller subproblems.

The **optimal substructure** property means that the optimal solution for n items can be built from optimal solutions of n-1 items. The **overlapping subproblems** property means we can reuse previously computed results.

### How It Works

#### 2D DP Table Approach:

1. Create a 2D DP table where `dp[i][w]` represents the maximum value using the first `i` items with knapsack capacity `w`
2. For each item `i` (from 1 to n) and each capacity `w` (from 0 to W):
   - **Don't include** item i-1: `dp[i][w] = dp[i-1][w]`
   - **Include** item i-1 (if it fits): `dp[i][w] = dp[i-1][w - weight[i-1]] + value[i-1]`
   - Take the maximum of both choices
3. The answer is `dp[n][W]`

#### Space-Optimized 1D Approach:

We can use a 1D DP array by iterating capacity in **reverse order** (from W to weight[i]). This ensures we don't use the same item twice, because when going backwards, we reference values from the previous iteration that haven't been updated yet.

### Visual Representation

For items: values = [60, 100, 120], weights = [10, 20, 30], capacity = 50

```
DP Table (rows = items considered, cols = capacity):
         0   10   20   30   40   50
Items=0:  0    0    0    0    0    0
Items=1:  0   60   60   60   60   60    ← only item 0 fits
Items=2:  0   60  100  160  160  160   ← items 0+1
Items=3:  0   60  100  160  220  220   ← items 1+2 (optimal!)

Optimal selection: Items 2 and 3 (weights 20+30=50, values 100+120=220)
```

### Why Reverse Iteration for Space Optimization?

When using 1D DP, iterating forward would allow using the same item multiple times:
- Forward: `dp[w] = max(dp[w], dp[w - weight] + value)` - dp[w-weight] is UPDATED in current iteration
- Backward: `dp[w] = max(dp[w], dp[w - weight] + value)` - dp[w-weight] is from PREVIOUS iteration

### Limitations

- **Pseudo-polynomial time**: O(n × W) - not truly polynomial if W is large
- **Cannot handle negative weights** without modification
- **Memory intensive** for large capacities
- **Only works for discrete items** (not fractional)

---

## Practice Problems

### Problem 1: Partition Equal Subset Sum

**Problem:** [LeetCode 416 - Partition Equal Subset Sum](https://leetcode.com/problems/partition-equal-subset-sum/)

**Description:** Given a non-empty array of positive integers, determine if the array can be partitioned into two subsets such that the sum of elements in both subsets is equal.

**How to Apply 0/1 Knapsack:**
- This is a subset sum problem, which is a special case of 0/1 knapsack
- Target sum = total_sum / 2
- Each number can only be used once (0 or 1)
- Use DP where dp[w] = true if sum w is achievable

---

### Problem 2: Ones and Zeroes

**Problem:** [LeetCode 474 - Ones and Zeroes](https://leetcode.com/problems/ones-and-zeroes/)

**Description:** Given an array of binary strings, find the maximum number of strings that can be formed with at most m '0's and n '1's.

**How to Apply 0/1 Knapsack:**
- This is a 2-dimensional knapsack problem
- Two constraints: zeros and ones
- Each string has cost (zeros, ones) and value = 1
- Use 2D DP: dp[i][j] = max strings using i zeros and j ones

---

### Problem 3: Last Stone Weight II

**Problem:** [LeetCode 1049 - Last Stone Weight II](https://leetcode.com/problems/last-stone-weight-ii/)

**Description:** Given an array of stone weights, split them into two groups to minimize the difference between the two groups' weights.

**How to Apply 0/1 Knapsack:**
- Total sum S, target = S/2
- Equivalent to finding subset with sum closest to S/2
- This is subset sum (0/1 knapsack variation)
- Answer = S - 2 * (max achievable sum ≤ S/2)

---

### Problem 4: Target Sum

**Problem:** [LeetCode 494 - Target Sum](https://leetcode.com/problems/target-sum/)

**Description:** You are given an array of integers and a target. You can assign + or - sign to each element. Count the number of ways to get the target.

**How to Apply 0/1 Knapsack:**
- Transform to subset sum problem
- (Sum of positive) - (Sum of negative) = target
- Sum of positive = (target + total_sum) / 2
- Count number of subsets achieving this sum

---

### Problem 5: Profitable Schemes

**Problem:** [LeetCode 879 - Profitable Schemes](https://leetcode.com/problems/profitable-schemes/)

**Description:** There are G members in a gang, and a list of various crimes they could commit. The i-th crime generates profit[i] and requires group[i] members to participate. Return the number of schemes that can be chosen such that at least P profit is generated.

**How to Apply 0/1 Knapsack:**
- 2D DP: dp[g][p] = number of schemes with exactly g members and p profit
- Each crime is a 0/1 choice (commit or not)
- Combine group and profit constraints

---

## Video Tutorial Links

### Fundamentals

- [0/1 Knapsack - Introduction (Take U Forward)](https://www.youtube.com/watch?v=bUS_aZtvHB4) - Comprehensive introduction
- [Knapsack Problem Explained (WilliamFiset)](https://www.youtube.com/watch?v=8LusJ5-jhfs) - Detailed explanation with visualizations
- [DP for Beginners (NeetCode)](https://www.youtube.com/watch?v=nqlNzOcnCfs) - Dynamic programming fundamentals

### Implementation Tutorials

- [0/1 Knapsack Code Implementation](https://www.youtube.com/watch?v=oTTzNMHMU7A) - Step-by-step coding
- [Space Optimization Explained](https://www.youtube.com/watch?v=PO5ll7WVzSE) - 2D to 1D DP
- [Knapsack Variations](https://www.youtube.com/watch?v=LawbG3U3j8U) - Common variations

### Advanced Topics

- [Multiple Knapsack](https://www.youtube.com/watch?v=pT_m9tO59g) - Multiple capacity constraints
- [DP on Trees + Knapsack](https://www.youtube.com/watch?v=o5XK-7kX8Y) - Tree DP applications
- [Knapsack with Complexity Analysis](https://www.youtube.com/watch?v=YV3EbB3Y7Xk) - Interview-focused

---

## Follow-up Questions

### Q1: What's the difference between 0/1 Knapsack and Unbounded Knapsack?

**Answer:** In 0/1 Knapsack, each item can be used at most once. In Unbounded Knapsack, each item can be used unlimited times. The key difference is in the iteration direction:
- 0/1: Iterate capacity backwards (w → weights[i])
- Unbounded: Iterate capacity forwards (w → capacity)

### Q2: How do you reconstruct the selected items in 0/1 Knapsack?

**Answer:** You have two options:
1. **Maintain a keep table**: Track decisions (keep[i][w] = true if item i is included)
2. **2D DP only**: Use the dp table to backtrack from dp[n][W]

### Q3: What if the capacity W is very large (e.g., 10⁹)?

**Answer:** When n × W is too large, consider:
1. **Meet-in-the-middle**: Split items into two halves, compute all subset possibilities
2. **Greedy approximation**: For fractional knapsack (if fractions allowed)
3. **Pseudo-polynomial**: DP only works when W is reasonably small

### Q4: Can 0/1 Knapsack be solved recursively?

**Answer:** Yes, using memoization:
- Recurrence: `knapsack(i, w) = max(knapsack(i-1, w), knapsack(i-1, w-weight[i]) + value[i])`
- Base case: `i == 0 or w == 0` returns 0
- Time: O(n × W), Space: O(n × W) + O(n) stack

### Q5: How do you handle negative weights or values?

**Answer:** Standard knapsack assumes non-negative values. For negative:
- Shift all values to positive by adding offset
- Use different DP formulation (minimization instead of maximization)
- Or transform the problem conceptually

---

## Summary

The 0/1 Knapsack is a fundamental dynamic programming problem that demonstrates key DP concepts. Key takeaways:

- **Binary choice**: Each item is either taken (1) or not taken (0)
- **Optimal substructure**: Build solutions from smaller subproblems
- **Overlapping subproblems**: Reuse computed results efficiently
- **Two implementations**: 2D DP (O(n×W) space) or 1D DP (O(W) space)
- **Backward iteration**: Critical for space-optimized version to avoid reusing items

When to use:
- ✅ Resource allocation with capacity constraints
- ✅ Binary selection problems
- ✅ Subset optimization problems
- ❌ When items can be used multiple times (use Unbounded Knapsack)
- ❌ When fractions are allowed (use Fractional Knapsack with greedy)

This problem is essential for competitive programming and technical interviews, serving as a foundation for understanding more complex dynamic programming problems.
