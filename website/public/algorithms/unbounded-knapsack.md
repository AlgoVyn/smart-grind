# Unbounded Knapsack

## Category
Dynamic Programming

## Description

The Unbounded Knapsack problem is a classic dynamic programming variation where we have unlimited copies of each item. Given N types of items, each with a weight and value, and a knapsack with capacity W, the goal is to maximize the total value that can be carried, with the constraint that each item type can be selected multiple times.

Unlike the 0/1 Knapsack where each item can be taken at most once, the unbounded version allows complete repetition. This seemingly small change significantly alters the DP approach: we iterate forward through capacities instead of backward. This pattern appears in numerous interview problems including coin change, rod cutting, and resource allocation scenarios where resources can be reused infinitely.

---

## Concepts

The unbounded knapsack relies on forward iteration and complete repetition properties.

### 1. Forward vs Backward Iteration

The key difference from 0/1 knapsack:

| Problem | Iteration Direction | Reason |
|---------|---------------------|--------|
| **0/1 Knapsack** | Backward (W to w) | Prevent using same item twice |
| **Unbounded** | Forward (w to W) | Allow unlimited reuse |

```
Unbounded iteration allows reuse:
dp[w] uses dp[w - weight] which may have included the same item
This is desired for unbounded (unlimited copies)

0/1 iteration prevents reuse:
dp[w] uses dp[w - weight] from previous iteration (without current item)
```

### 2. State Definition

| State | Meaning |
|-------|---------|
| `dp[w]` | Maximum value achievable with capacity w |
| `dp[w]` | Minimum items needed to achieve capacity w (coin change) |
| `dp[w]` | Number of ways to achieve capacity w (count combinations) |

### 3. State Transitions

For maximum value:
```
dp[w] = max(dp[w], dp[w - weight[i]] + value[i]) for all items i where weight[i] <= w
```

For minimum items (coin change):
```
dp[w] = min(dp[w], dp[w - coin[i]] + 1) for all coins where coin[i] <= w
```

### 4. Complete Repetition Property

| Property | Implication |
|----------|-------------|
| **Order doesn't matter** | Items processed sequentially, unlimited use |
| **Greedy doesn't work** | Still requires DP for optimal solution |
| **Space optimized** | Only 1D array needed |

---

## Frameworks

Structured approaches for unbounded knapsack problems.

### Framework 1: Maximum Value Unbounded Knapsack

```
┌─────────────────────────────────────────────────────────────┐
│  UNBOUNDED KNAPSACK - MAXIMUM VALUE                         │
├─────────────────────────────────────────────────────────────┤
│  Input: weights[], values[], capacity W                      │
│  Output: Maximum value achievable                            │
│                                                              │
│  1. Initialize dp[0..W] = 0                                  │
│  2. For w = 1 to W:                                          │
│     a. For each item i:                                      │
│        - If weights[i] <= w:                                 │
│          dp[w] = max(dp[w], dp[w - weights[i]] + values[i])  │
│  3. Return dp[W]                                              │
│                                                              │
│  Time: O(N × W)                                              │
│  Space: O(W)                                                 │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Classic unbounded knapsack for maximum value.

### Framework 2: Minimum Items (Coin Change)

```
┌─────────────────────────────────────────────────────────────┐
│  COIN CHANGE - MINIMUM COINS                                │
├─────────────────────────────────────────────────────────────┤
│  Input: coins[], target amount                               │
│  Output: Minimum coins needed, or -1 if impossible           │
│                                                              │
│  1. Initialize dp[0] = 0, dp[1..amount] = INF               │
│  2. For coin in coins:                                       │
│     a. For x = coin to amount:                               │
│        - dp[x] = min(dp[x], dp[x - coin] + 1)                │
│  3. Return dp[amount] if != INF, else -1                     │
│                                                              │
│  Alternative: Outer loop on amount, inner on coins            │
│  Both work for unbounded (unlimited coins)                 │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Coin change, minimum resources needed.

### Framework 3: Count Ways (Combinations)

```
┌─────────────────────────────────────────────────────────────┐
│  COUNT WAYS - COMBINATIONS                                  │
├─────────────────────────────────────────────────────────────┤
│  Input: items[], target                                      │
│  Output: Number of ways to achieve target                  │
│                                                              │
│  1. Initialize dp[0] = 1 (one way to make 0), rest = 0      │
│  2. For each item:                                           │
│     a. For w = item to target:                             │
│        - dp[w] += dp[w - item]                               │
│  3. Return dp[target]                                         │
│                                                              │
│  Note: Order of loops matters!                             │
│  - Item outer: combinations (order doesn't matter)           │
│  - Amount outer: permutations (order matters)              │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Counting combinations or permutations.

### Framework 4: Rod Cutting

```
┌─────────────────────────────────────────────────────────────┐
│  ROD CUTTING - MAXIMUM VALUE                                │
├─────────────────────────────────────────────────────────────┤
│  Input: prices[i] = value of rod piece of length i+1        │
│         rod_length = n                                      │
│  Output: Maximum value obtainable                            │
│                                                              │
│  1. Initialize dp[0..n] = 0                                  │
│  2. For length = 1 to n:                                     │
│     a. For cut = 1 to length:                                │
│        - price = prices[cut - 1] + dp[length - cut]         │
│        - dp[length] = max(dp[length], price)                │
│  3. Return dp[n]                                              │
│                                                              │
│  Equivalent to unbounded knapsack:                          │
│  - Items: all possible cut lengths                          │
│  - Weights: cut lengths                                     │
│  - Values: prices                                           │
│  - Capacity: rod length                                     │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Rod cutting and similar segmentation problems.

---

## Forms

Different manifestations of unbounded knapsack.

### Form 1: Maximum Value

Standard unbounded knapsack maximizing total value.

| Aspect | Details |
|--------|---------|
| **Goal** | Maximize sum of values |
| **State** | dp[w] = max value with capacity w |
| **Transition** | dp[w] = max(dp[w], dp[w-wi] + vi) |
| **Complexity** | O(N × W) |

### Form 2: Minimum Coins

Find minimum number of coins to make an amount.

| Modification | dp[w] = min coins to make w |
|--------------|------------------------------|
| **Initialize** | dp[0] = 0, rest = INF |
| **Transition** | dp[x] = min(dp[x], dp[x-coin] + 1) |
| **LeetCode** | Problem 322 - Coin Change |

### Form 3: Number of Ways (Combinations)

Count ways to make amount (order doesn't matter).

| Modification | dp[w] += dp[w - coin] |
|--------------|----------------------|
| **Initialize** | dp[0] = 1 |
| **Loop order** | Coin outer, amount inner |
| **LeetCode** | Problem 518 - Coin Change II |

### Form 4: Number of Ways (Permutations)

Count ways where order matters.

| Modification | Same as combinations but swap loop order |
|--------------|------------------------------------------|
| **Loop order** | Amount outer, coin inner |
| **LeetCode** | Problem 377 - Combination Sum IV |

### Form 5: Rod Cutting

Maximize value from cutting a rod.

| Modification | dp[length] = max value for that length |
|--------------|------------------------------------------|
| **Subproblem** | Try all possible first cuts |
| **LeetCode** | Classic DP problem |

---

## Tactics

Specific techniques and optimizations.

### Tactic 1: Item-Outer vs Capacity-Outer

Two valid iteration orders:

```python
# Approach 1: Capacity outer
def unbounded_capacity_outer(weights, values, W):
    """Process each capacity, try all items."""
    dp = [0] * (W + 1)
    
    for w in range(1, W + 1):
        for i in range(len(weights)):
            if weights[i] <= w:
                dp[w] = max(dp[w], dp[w - weights[i]] + values[i])
    
    return dp[W]

# Approach 2: Item outer (often more intuitive)
def unbounded_item_outer(weights, values, W):
    """For each item, update all capacities."""
    dp = [0] * (W + 1)
    
    for i in range(len(weights)):
        for w in range(weights[i], W + 1):
            dp[w] = max(dp[w], dp[w - weights[i]] + values[i])
    
    return dp[W]

# Both are correct for unbounded knapsack!
```

**Key insight**: Both orders work because we iterate forward, allowing reuse.

### Tactic 2: Coin Change Minimum

Classic minimum coins problem:

```python
def coin_change_min(coins, amount):
    """
    Minimum coins to make amount.
    Returns -1 if impossible.
    """
    INF = float('inf')
    dp = [INF] * (amount + 1)
    dp[0] = 0
    
    for coin in coins:
        for x in range(coin, amount + 1):
            if dp[x - coin] != INF:
                dp[x] = min(dp[x], dp[x - coin] + 1)
    
    return dp[amount] if dp[amount] != INF else -1
```

**Edge case**: Return -1 if dp[amount] remains INF (impossible).

### Tactic 3: Coin Change Ways (Combinations)

Count combinations (order doesn't matter):

```python
def coin_change_ways(coins, amount):
    """
    Number of ways to make amount (combinations).
    Coin order doesn't matter.
    """
    dp = [0] * (amount + 1)
    dp[0] = 1
    
    for coin in coins:
        for x in range(coin, amount + 1):
            dp[x] += dp[x - coin]
    
    return dp[amount]
```

**Critical**: Coin outer loop ensures combinations, not permutations.

### Tactic 4: Rod Cutting

Rod cutting as unbounded knapsack:

```python
def rod_cutting(prices, n):
    """
    Max value from cutting rod of length n.
    prices[i] = price for length i+1
    """
    dp = [0] * (n + 1)
    
    for length in range(1, n + 1):
        for cut_len in range(1, length + 1):
            # Try cut of length cut_len at position cut_len-1 in prices
            dp[length] = max(dp[length], 
                           prices[cut_len - 1] + dp[length - cut_len])
    
    return dp[n]
```

**Insight**: Try every possible first cut, recurse on remainder.

---

## Python Templates

### Template 1: Maximum Value Unbounded Knapsack

```python
from typing import List


def unbounded_knapsack(weights: List[int], values: List[int], 
                       capacity: int) -> int:
    """
    Unbounded knapsack - maximize value with unlimited items.
    
    Args:
        weights: List of item weights
        values: List of item values
        capacity: Knapsack capacity
    
    Returns:
        Maximum achievable value
    
    Time: O(n * capacity)
    Space: O(capacity)
    """
    n = len(weights)
    dp = [0] * (capacity + 1)
    
    # Forward iteration allows item reuse
    for w in range(1, capacity + 1):
        for i in range(n):
            if weights[i] <= w:
                dp[w] = max(dp[w], dp[w - weights[i]] + values[i])
    
    return dp[capacity]
```

### Template 2: Item-Outer Loop Version

```python
def unbounded_knapsack_v2(weights: List[int], values: List[int],
                          capacity: int) -> int:
    """
    Alternative: Process items first, then capacities.
    Often more intuitive and cache-friendly.
    """
    n = len(weights)
    dp = [0] * (capacity + 1)
    
    for i in range(n):
        # Forward iteration from weight[i] to capacity
        for w in range(weights[i], capacity + 1):
            dp[w] = max(dp[w], dp[w - weights[i]] + values[i])
    
    return dp[capacity]
```

### Template 3: Coin Change (Minimum Coins)

```python
def coin_change(coins: List[int], amount: int) -> int:
    """
    LeetCode 322: Coin Change
    
    Find minimum number of coins to make up amount.
    Each coin can be used unlimited times.
    
    Args:
        coins: List of coin denominations
        amount: Target amount
    
    Returns:
        Minimum coins needed, or -1 if impossible
    
    Time: O(n * amount)
    Space: O(amount)
    """
    INF = float('inf')
    dp = [INF] * (amount + 1)
    dp[0] = 0
    
    for coin in coins:
        for x in range(coin, amount + 1):
            dp[x] = min(dp[x], dp[x - coin] + 1)
    
    return dp[amount] if dp[amount] != INF else -1
```

### Template 4: Coin Change II (Number of Ways)

```python
def coin_change_ii(coins: List[int], amount: int) -> int:
    """
    LeetCode 518: Coin Change II
    
    Number of ways to make amount (combinations).
    Order of coins doesn't matter.
    
    Args:
        coins: List of coin denominations
        amount: Target amount
    
    Returns:
        Number of combinations
    
    Time: O(n * amount)
    Space: O(amount)
    """
    dp = [0] * (amount + 1)
    dp[0] = 1  # One way to make 0
    
    # Coin outer loop ensures combinations (not permutations)
    for coin in coins:
        for x in range(coin, amount + 1):
            dp[x] += dp[x - coin]
    
    return dp[amount]
```

### Template 5: Rod Cutting

```python
def rod_cutting(prices: List[int], n: int) -> int:
    """
    Rod Cutting Problem
    
    Given prices for each length, find maximum value
    obtainable from rod of length n.
    
    Args:
        prices: prices[i] is price for rod of length i+1
        n: Total rod length
    
    Returns:
        Maximum obtainable value
    
    Time: O(n^2)
    Space: O(n)
    """
    dp = [0] * (n + 1)
    
    for length in range(1, n + 1):
        # Try all possible cuts for this length
        for cut_len in range(1, length + 1):
            dp[length] = max(dp[length],
                           prices[cut_len - 1] + dp[length - cut_len])
    
    return dp[n]
```

### Template 6: Combination Sum IV (Permutations Count)

```python
def combination_sum_iv(nums: List[int], target: int) -> int:
    """
    LeetCode 377: Combination Sum IV
    
    Number of ways to make target (permutations).
    Order of numbers matters.
    
    Args:
        nums: List of integers
        target: Target sum
    
    Returns:
        Number of permutations (mod 2^31)
    
    Note: Swap loop order from combinations version
    """
    dp = [0] * (target + 1)
    dp[0] = 1
    
    # Amount outer loop creates permutations
    for x in range(1, target + 1):
        for num in nums:
            if num <= x:
                dp[x] += dp[x - num]
    
    return dp[target]
```

---

## When to Use

Use the Unbounded Knapsack pattern when you need to solve problems involving:

- **Unlimited resources**: Each item can be selected multiple times
- **Coin change**: Minimum coins or ways to make amount
- **Rod cutting**: Optimal segmentation problems
- **Complete knapsack**: Resource allocation with infinite supply
- **Integer partition**: Ways to write number as sum

### Comparison with 0/1 Knapsack

| Aspect | 0/1 Knapsack | Unbounded Knapsack |
|--------|--------------|-------------------|
| **Item usage** | At most once | Unlimited |
| **Iteration** | Backward (W to w) | Forward (w to W) |
| **State** | dp[w] = max value | dp[w] = max value |
| **Transition** | Same formula | Same formula |
| **Time** | O(N × W) | O(N × W) |
| **Space** | O(W) | O(W) |

### When to Choose Unbounded vs Other Approaches

- **Choose Unbounded DP** when:
  - Items can be used unlimited times
  - Problem asks for maximum value, minimum count, or ways
  - Capacity/amount is reasonable (≤ 10⁴-10⁵)
  - Optimal solution is required

- **Choose Greedy** when:
  - Problem has special structure (e.g., canonical coin systems)
  - Approximation is acceptable
  - Always picking largest valid item works
  - Note: Greedy fails for general unbounded knapsack!

- **Choose BFS/Graph** when:
  - Problem can be modeled as shortest path in unweighted graph
  - State space is manageable
  - Need actual sequence of items

---

## Algorithm Explanation

### Core Concept

The Unbounded Knapsack problem demonstrates how a small change in constraints (unlimited vs single use) changes the solution approach while maintaining similar complexity. The key is forward iteration, which allows the same item to be considered multiple times.

**Key Terminology**:
- **DP[w]**: Optimal value for capacity/amount w
- **Forward iteration**: Processing capacities from low to high
- **Complete repetition**: Items can be used infinitely many times
- **Coin change variant**: Minimum coins or count ways instead of max value

### How It Works

#### State Transition

For each capacity w, we consider adding any item that fits:

```
dp[w] = max over all items i of:
    if weight[i] <= w:
        dp[w - weight[i]] + value[i]
```

The forward iteration ensures that when computing dp[w], the value dp[w - weight[i]] may already include item i (allowing reuse).

#### Comparison with 0/1 Knapsack

**0/1 Knapsack (Backward)**:
```python
for i in range(n):
    for w in range(W, weights[i] - 1, -1):  # Backward!
        dp[w] = max(dp[w], dp[w - weights[i]] + values[i])
```
Backward iteration ensures dp[w - weight[i]] hasn't included item i yet.

**Unbounded Knapsack (Forward)**:
```python
for i in range(n):
    for w in range(weights[i], W + 1):  # Forward!
        dp[w] = max(dp[w], dp[w - weights[i]] + values[i])
```
Forward iteration allows dp[w - weight[i]] to include item i (enabling reuse).

### Visual Walkthrough

**Counting Ways Example**: Coins [1, 2, 3], Amount = 4

```
Initialize: dp = [1, 0, 0, 0, 0]

Process coin 1:
  w=1: dp[1] += dp[0] = 1
  w=2: dp[2] += dp[1] = 1
  w=3: dp[3] += dp[2] = 1
  w=4: dp[4] += dp[3] = 1
  dp = [1, 1, 1, 1, 1]

Process coin 2:
  w=2: dp[2] += dp[0] = 1 + 1 = 2
  w=3: dp[3] += dp[1] = 1 + 1 = 2
  w=4: dp[4] += dp[2] = 1 + 2 = 3
  dp = [1, 1, 2, 2, 3]

Process coin 3:
  w=3: dp[3] += dp[0] = 2 + 1 = 3
  w=4: dp[4] += dp[1] = 3 + 1 = 4
  dp = [1, 1, 2, 3, 4]

Result: 4 ways to make amount 4
```

### Why Forward Iteration Works

Forward iteration creates a "complete" knapsack because:
1. When computing dp[w], dp[w - weight] is already computed
2. dp[w - weight] might have used the same item (allowed!)
3. This creates unlimited "layers" of the same item

### Limitations

- **Pseudo-polynomial**: Time depends on capacity W, not just input size
- **Large capacities**: W > 10^6 may be too slow
- **No item tracking**: Space-optimized version loses item selection info
- **Integer weights**: Requires integer weights/amounts

---

## Practice Problems

### Problem 1: Coin Change

**Problem:** [LeetCode 322 - Coin Change](https://leetcode.com/problems/coin-change/)

**Description:** You are given an integer array coins representing denominations and an integer amount. Return the fewest number of coins needed to make up that amount. Return -1 if amount cannot be made.

**How to Apply:**
- Unbounded knapsack with minimization
- dp[x] = minimum coins to make amount x
- Forward iteration, take min instead of max

---

### Problem 2: Coin Change II

**Problem:** [LeetCode 518 - Coin Change II](https://leetcode.com/problems/coin-change-ii/)

**Description:** You are given an integer array coins and an integer amount. Return the number of combinations that make up that amount. Order doesn't matter.

**How to Apply:**
- Unbounded knapsack counting combinations
- dp[x] += dp[x - coin] for each coin
- Coin outer loop ensures combinations

---

### Problem 3: Combination Sum IV

**Problem:** [LeetCode 377 - Combination Sum IV](https://leetcode.com/problems/combination-sum-iv/)

**Description:** Given an array of distinct integers and a target, return the number of possible combinations that add up to target. Order matters.

**How to Apply:**
- Unbounded knapsack counting permutations
- Amount outer loop, numbers inner loop
- This creates permutations (order matters)

---

### Problem 4: Perfect Squares

**Problem:** [LeetCode 279 - Perfect Squares](https://leetcode.com/problems/perfect-squares/)

**Description:** Given an integer n, return the least number of perfect square numbers that sum to n.

**How to Apply:**
- Unbounded knapsack (coin change variant)
- "Coins" are perfect squares <= n
- Find minimum count

---

## Video Tutorial Links

### Fundamentals

- [Unbounded Knapsack - Aditya Verma](https://www.youtube.com/watch?v=aycn9KO) - DP explanation
- [Coin Change Pattern - NeetCode](https://www.youtube.com/watch?v=H9B) - Classic problems
- [Knapsack Variations - Abdul Bari](https://www.youtube.com/watch?v=nLmhmB) - All types

### Problem Solutions

- [LeetCode 322 Solution](https://www.youtube.com/watch?v=ud) - Minimum coins
- [LeetCode 518 Solution](https://www.youtube.com/watch?v=ja) - Count ways
- [Rod Cutting Problem](https://www.youtube.com/watch?v=FAfRh6yy) - Segmentation DP

### Advanced Topics

- [0/1 vs Unbounded Knapsack](https://www.youtube.com/watch?v=Ii) - Key differences
- [DP Space Optimization](https://www.youtube.com/watch?v=U) - 1D array techniques
- [Coin Change Variations](https://www.youtube.com/watch?v=b) - All variants

---

## Follow-up Questions

### Q1: What's the difference between 0/1 and unbounded knapsack?

**Answer:** The key difference is iteration direction:
- **0/1 Knapsack**: Iterate backward (W to weight) to prevent using the same item twice
- **Unbounded Knapsack**: Iterate forward (weight to W) to allow unlimited reuse of items

The state transition formula is the same; only the iteration order differs.

---

### Q2: Why doesn't greedy work for unbounded knapsack?

**Answer:** Unlike the fractional knapsack which has a greedy solution, unbounded knapsack requires DP because:
- Local optimal choices (pick highest value/weight ratio) don't guarantee global optimum
- Example: Capacity 10, items (weight 6, value 9) and (weight 5, value 5). Greedy picks item 1 (ratio 1.5), gets value 9. Optimal picks two of item 2, gets value 10.

---

### Q3: How do you count combinations vs permutations?

**Answer:**
- **Combinations (order doesn't matter)**: Item/coin outer loop, capacity inner
- **Permutations (order matters)**: Capacity outer loop, item/coin inner

This is because processing items first "fixes" an ordering, while processing capacity first allows different orderings to be counted separately.

---

### Q4: Can you reconstruct the actual items selected?

**Answer:** Yes, but you need to track choices. Maintain a choice[w] array that records which item was used to achieve dp[w]. Then backtrack from w to 0 following the choices.

---

### Q5: When should you NOT use unbounded knapsack DP?

**Answer:** Consider alternatives when:
- Amount/capacity is extremely large (>10^6), making DP too slow
- A greedy approach works (e.g., canonical coin systems like US coins)
- You need the actual lexicographically smallest sequence (might need different approach)
- Problem has additional constraints making pure DP insufficient

---

## Summary

The Unbounded Knapsack pattern solves optimization problems where items can be selected unlimited times. The key insight is forward iteration through capacities, enabling reuse of the same item multiple times.

**Key Takeaways**:

1. **Forward Iteration**: Unlike 0/1 knapsack, iterate w from small to large to allow reuse
2. **Complete Repetition**: Same item can be used multiple times
3. **Coin Change Pattern**: Very common interview variation
4. **Space Optimized**: Always O(W) space possible
5. **Multiple Objectives**: Can optimize for max value, min count, or count ways

**When to Use**:
- Unlimited resources of each type
- Coin change (minimum coins or count ways)
- Rod cutting and segmentation problems
- Any "complete" knapsack variant

**Important Distinction**:
- **0/1 Knapsack**: Iterate backward (W to w)
- **Unbounded Knapsack**: Iterate forward (w to W)

This pattern is essential for interview preparation and frequently appears in problems involving coin change, resource allocation, and optimal combinations.
