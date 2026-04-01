# Coin Change

## Category
Dynamic Programming

## Description

The Coin Change problem is a classic dynamic programming problem that models an **unbounded knapsack**. Given a set of coin denominations and a target amount, we need to find the minimum number of coins needed to make up that amount. This problem appears frequently in financial applications, optimization problems, and as a fundamental DP pattern in technical interviews.

Unlike the 0/1 Knapsack where each item can be used once, Coin Change allows unlimited usage of each coin denomination. This changes the DP state transition and iteration order, making it a distinct but related pattern.

---

## Concepts

The Coin Change technique is built on several fundamental concepts that make it powerful for solving unbounded optimization problems.

### 1. Unbounded Choice

Each coin can be used unlimited times:

| Property | 0/1 Knapsack | Coin Change (Unbounded) |
|----------|--------------|------------------------|
| Usage limit | 0 or 1 times | Unlimited times |
| Iteration direction | Backwards | Forwards |
| Typical goal | Maximize value | Minimize count |

### 2. State Definition

The DP state represents the optimal solution for a subproblem:

| State | Meaning | Initialization |
|-------|---------|----------------|
| `dp[amount]` | Min coins to make `amount` | `inf` (unreachable) |
| `dp[amount]` | Ways to make `amount` | `0` |
| `dp[0]` | Base case | `0` (min) or `1` (count) |

### 3. Optimal Substructure

The minimum coins for amount `i` depends on minimum coins for smaller amounts:

```
dp[i] = min(dp[i], dp[i - coin] + 1) for all coins ≤ i
```

### 4. Overlapping Subproblems

Calculating `dp[10]` with coins [1, 2, 5] requires:
- `dp[9]` (using coin 1)
- `dp[8]` (using coin 2)
- `dp[5]` (using coin 5)

These subproblems overlap and are reused.

---

## Frameworks

Structured approaches for solving Coin Change problems.

### Framework 1: Minimum Coins Template

```
┌─────────────────────────────────────────────────────┐
│  MINIMUM COINS FRAMEWORK                            │
├─────────────────────────────────────────────────────┤
│  1. Initialize dp[0] = 0, dp[i] = infinity for i>0 │
│  2. For amount from 1 to target:                   │
│     For each coin in coins:                        │
│       If coin ≤ amount:                            │
│         dp[amount] = min(dp[amount],              │
│                          dp[amount - coin] + 1)    │
│  3. Return dp[target] if finite, else -1          │
└─────────────────────────────────────────────────────┘
```

**When to use**: Finding fewest coins to make exact amount.

### Framework 2: Count Combinations Template

```
┌─────────────────────────────────────────────────────┐
│  COUNT COMBINATIONS FRAMEWORK                       │
├─────────────────────────────────────────────────────┤
│  1. Initialize dp[0] = 1 (empty combination)      │
│  2. For each coin in coins (outer loop):          │
│     For amount from coin to target:                │
│       dp[amount] += dp[amount - coin]             │
│  3. Return dp[target]                                │
│                                                      │
│  Note: Coins outer loop ensures order doesn't matter│
└─────────────────────────────────────────────────────┘
```

**When to use**: Counting number of ways to make amount (combinations).

### Framework 3: Count Permutations Template

```
┌─────────────────────────────────────────────────────┐
│  COUNT PERMUTATIONS FRAMEWORK                       │
├─────────────────────────────────────────────────────┤
│  1. Initialize dp[0] = 1                            │
│  2. For amount from 1 to target:                   │
│     For each coin in coins:                        │
│       If coin ≤ amount:                            │
│         dp[amount] += dp[amount - coin]             │
│  3. Return dp[target]                                │
│                                                      │
│  Note: Amount outer loop counts different orders    │
└─────────────────────────────────────────────────────┘
```

**When to use**: Counting sequences where order matters.

---

## Forms

Different manifestations of the Coin Change pattern.

### Form 1: Minimum Coins Required

Find the fewest coins to make exact amount.

| Example | Coins | Amount | Answer | Explanation |
|---------|-------|--------|--------|-------------|
| Basic | [1,2,5] | 11 | 3 | 5+5+1 |
| Impossible | [2] | 3 | -1 | Can't make odd amount |
| Edge | [] | 0 | 0 | Zero coins for zero amount |

### Form 2: Count Combinations

Number of ways to make amount (order doesn't matter).

```
Coins: [1, 2, 5], Amount: 5
Combinations: [1,1,1,1,1], [1,1,1,2], [1,2,2], [5]
Answer: 4
```

### Form 3: Count Permutations

Number of sequences to make amount (order matters).

```
Coins: [1, 2], Amount: 3
Permutations: [1,1,1], [1,2], [2,1]
Answer: 3
```

### Form 4: Limited Coins (Bounded)

Each coin has a maximum usage limit.

```
Approach: Convert to 0/1 using binary splitting
Or use 2D DP: dp[i][amount] considering first i coin types
```

### Form 5: Maximum Value with Cost

Each coin has a "value" - maximize total value within cost budget.

---

## Tactics

Specific techniques and optimizations.

### Tactic 1: Forward vs Backward Iteration

The iteration direction determines if coins can be reused:

```python
# FORWARD - Coin Change (unbounded, can reuse)
for coin in coins:
    for amount in range(coin, target + 1):
        dp[amount] += dp[amount - coin]

# BACKWARD - 0/1 style (each coin once)
for coin in coins:
    for amount in range(target, coin - 1, -1):
        dp[amount] += dp[amount - coin]
```

**Key insight**: Forward allows building on current iteration's updates (reuse), backward prevents it.

### Tactic 2: Greedy vs DP Decision

Greedy works only for canonical coin systems:

```python
def is_canonical(coins):
    """Check if greedy works for all amounts."""
    for amount in range(1, max(coins) * 2):
        greedy_result = greedy_min_coins(coins, amount)
        dp_result = coin_change(coins, amount)
        if greedy_result != dp_result:
            return False
    return True

# Example: [1, 3, 4] with amount 6
# Greedy: 4+1+1 = 3 coins (suboptimal)
# DP: 3+3 = 2 coins (optimal)
```

### Tactic 3: Space-Optimized Reconstruction

Track parent pointers without full 2D table:

```python
def coin_change_with_path(coins, amount):
    dp = [float('inf')] * (amount + 1)
    parent = [-1] * (amount + 1)  # Which coin led to this amount
    dp[0] = 0
    
    for i in range(1, amount + 1):
        for coin in coins:
            if coin <= i and dp[i - coin] + 1 < dp[i]:
                dp[i] = dp[i - coin] + 1
                parent[i] = coin
    
    # Reconstruct path
    path = []
    curr = amount
    while curr > 0:
        path.append(parent[curr])
        curr -= parent[curr]
    
    return dp[amount], path
```

### Tactic 4: BFS Alternative for Minimum Coins

BFS finds minimum coins without full DP table:

```python
from collections import deque

def coin_change_bfs(coins, amount):
    """BFS for minimum coins - useful for very large amounts."""
    if amount == 0:
        return 0
    
    coins = sorted(set(coins), reverse=True)  # Larger first for pruning
    queue = deque([(amount, 0)])  # (remaining, coins_used)
    visited = set([amount])
    
    while queue:
        remaining, count = queue.popleft()
        
        for coin in coins:
            next_remaining = remaining - coin
            if next_remaining == 0:
                return count + 1
            if next_remaining > 0 and next_remaining not in visited:
                visited.add(next_remaining)
                queue.append((next_remaining, count + 1))
    
    return -1
```

### Tactic 5: Modulo Optimization for Large Counts

When counting ways with very large numbers:

```python
def coin_change_count_mod(coins, amount, mod=10**9 + 7):
    dp = [0] * (amount + 1)
    dp[0] = 1
    
    for coin in coins:
        for i in range(coin, amount + 1):
            dp[i] = (dp[i] + dp[i - coin]) % mod
    
    return dp[amount]
```

---

## Python Templates

### Template 1: Minimum Coins (Bottom-Up)

```python
def coin_change_min(coins: list[int], amount: int) -> int:
    """
    Template 1: Find minimum coins needed to make amount.
    Time: O(amount * len(coins)), Space: O(amount)
    """
    if amount == 0:
        return 0
    if not coins or amount < 0:
        return -1
    
    # dp[i] = minimum coins needed to make amount i
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    
    for current in range(1, amount + 1):
        for coin in coins:
            if coin <= current:
                dp[current] = min(dp[current], dp[current - coin] + 1)
    
    return dp[amount] if dp[amount] != float('inf') else -1
```

### Template 2: Minimum Coins with Reconstruction

```python
def coin_change_min_path(coins: list[int], amount: int):
    """
    Template 2: Return both minimum coins and the coins used.
    Time: O(amount * len(coins)), Space: O(amount)
    """
    if amount == 0:
        return 0, []
    
    dp = [float('inf')] * (amount + 1)
    parent = [-1] * (amount + 1)  # Which coin was used
    dp[0] = 0
    
    for current in range(1, amount + 1):
        for coin in coins:
            if coin <= current and dp[current - coin] + 1 < dp[current]:
                dp[current] = dp[current - coin] + 1
                parent[current] = coin
    
    if dp[amount] == float('inf'):
        return -1, []
    
    # Reconstruct the coins used
    result_coins = []
    curr = amount
    while curr > 0:
        result_coins.append(parent[curr])
        curr -= parent[curr]
    
    return dp[amount], result_coins
```

### Template 3: Count Combinations

```python
def coin_change_combinations(coins: list[int], amount: int) -> int:
    """
    Template 3: Count combinations (order doesn't matter).
    Time: O(amount * len(coins)), Space: O(amount)
    """
    MOD = 10**9 + 7
    dp = [0] * (amount + 1)
    dp[0] = 1  # One way to make amount 0 (use nothing)
    
    # Coins outer loop ensures combinations (not permutations)
    for coin in coins:
        for current in range(coin, amount + 1):
            dp[current] = (dp[current] + dp[current - coin]) % MOD
    
    return dp[amount]
```

### Template 4: Count Permutations

```python
def coin_change_permutations(coins: list[int], amount: int) -> int:
    """
    Template 4: Count permutations (order matters).
    Time: O(amount * len(coins)), Space: O(amount)
    """
    MOD = 10**9 + 7
    dp = [0] * (amount + 1)
    dp[0] = 1
    
    # Amount outer loop counts different orderings
    for current in range(1, amount + 1):
        for coin in coins:
            if coin <= current:
                dp[current] = (dp[current] + dp[current - coin]) % MOD
    
    return dp[amount]
```

### Template 5: Recursive with Memoization

```python
from functools import lru_cache

def coin_change_memo(coins: list[int], amount: int) -> int:
    """
    Template 5: Top-down DP with memoization.
    Time: O(amount * len(coins)), Space: O(amount)
    """
    @lru_cache(maxsize=None)
    def helper(remain: int) -> int:
        if remain == 0:
            return 0
        if remain < 0:
            return float('inf')
        
        min_coins = float('inf')
        for coin in coins:
            result = helper(remain - coin)
            if result != float('inf'):
                min_coins = min(min_coins, result + 1)
        
        return min_coins
    
    result = helper(amount)
    return result if result != float('inf') else -1
```

### Template 6: Perfect Squares Variation

```python
def num_squares(n: int) -> int:
    """
    Template 6: Minimum perfect squares summing to n.
    Coin Change where coins are all perfect squares ≤ n.
    Time: O(n * sqrt(n)), Space: O(n)
    """
    # Generate perfect square "coins"
    coins = [i * i for i in range(1, int(n**0.5) + 1)]
    
    dp = [float('inf')] * (n + 1)
    dp[0] = 0
    
    for i in range(1, n + 1):
        for square in coins:
            if square <= i:
                dp[i] = min(dp[i], dp[i - square] + 1)
    
    return dp[n]
```

---

## When to Use

Use the Coin Change algorithm when you need to solve problems involving:

- **Unbounded Knapsack**: When you can use each item unlimited times
- **Optimization Problems**: Finding minimum/maximum ways to achieve a target
- **Counting Problems**: Counting the number of ways to make change
- **Reachability Problems**: Determining if a target is achievable

### Comparison with Alternatives

| Approach | Use Case | Time Complexity | Space Complexity |
|----------|----------|-----------------|------------------|
| **Greedy** | Works only for canonical coin systems | O(n log n) | O(1) |
| **Dynamic Programming (Bottom-up)** | Most general solution | O(amount × n) | O(amount) |
| **Dynamic Programming (Top-down)** | Recursive with memoization | O(amount × n) | O(amount) |
| **BFS** | Finding minimum steps | O(amount × n) | O(amount) |

### When to Choose Each Approach

- **Choose DP (Bottom-up)** when:
  - You need guaranteed optimal solution
  - The coin system is not canonical
  - You need to handle edge cases properly
  - Memory is not a constraint

- **Choose DP (Top-down/Memoization)** when:
  - You prefer recursive solutions
  - You want to visualize the problem as a tree
  - You want to easily reconstruct the solution

- **Choose BFS** when:
  - You need the minimum number of coins
  - You want to visualize as level-by-level exploration

- **Greedy may work** when:
  - Coin system is canonical (e.g., US coins: 1, 5, 10, 25)
  - You need the fastest solution
  - You can prove greedy works for your coin system

---

## Algorithm Explanation

### Core Concept

The key insight behind the Coin Change problem is that we can break down the problem into **subproblems**. If we know the minimum coins needed for all amounts less than our target, we can build up to the target amount.

**Why DP Works:**
1. **Optimal Substructure**: The minimum coins for amount `i` depends on minimum coins for amounts `i - coin` for each coin
2. **Overlapping Subproblems**: The same subproblems (amounts) are computed multiple times without memoization

### How It Works

#### State Definition:
- `dp[amount]` = minimum number of coins needed to make exactly `amount`

#### Initialization:
- `dp[0] = 0` — Zero coins needed to make amount 0
- `dp[i] = infinity` for all other amounts (unreachable state)

#### State Transition:
```
For each amount from 1 to target:
    For each coin:
        If coin <= amount:
            dp[amount] = min(dp[amount], dp[amount - coin] + 1)
```

This checks if using the current coin results in fewer coins than the current best solution.

### Visual Representation

For `coins = [1, 2, 5]` and `amount = 11`:

```
dp[0] = 0
dp[1] = 1 (using coin 1)
dp[2] = 1 (using coin 2)
dp[3] = 2 (1+2 or 1+1+1)
dp[4] = 2 (2+2)
dp[5] = 1 (using coin 5)
dp[6] = 2 (5+1)
dp[7] = 3 (5+2)
dp[8] = 3 (5+2+1)
dp[9] = 4 (5+2+2)
dp[10] = 2 (5+5)
dp[11] = 3 (5+5+1)
```

### Why This Works

Think of it as building a graph:
- Each amount `i` is a node
- From amount `i`, you can reach `i + coin` using one coin
- We want the shortest path from 0 to target amount

### Limitations

- **Not all coin systems work with greedy**: [1, 3, 4] with amount 6 — greedy gives 4+1+1=3 coins, but optimal is 3+3=2 coins
- **Large amounts can overflow memory**: Consider space-optimized solutions
- **Integer overflow**: Use appropriate data types for very large answers

---

## Practice Problems

### Problem 1: Coin Change (Minimum Coins)

**Problem:** [LeetCode 322 - Coin Change](https://leetcode.com/problems/coin-change/)

**Description:** You are given an integer array `coins` representing coins of different denominations and an integer `amount` representing a total amount of money. Return the fewest number of coins that you need to make up that amount.

**How to Apply the Technique:**
- Use bottom-up DP: `dp[i] = min(dp[i], dp[i - coin] + 1)`
- Initialize with infinity, base case `dp[0] = 0`
- Track parent pointers if reconstruction needed

---

### Problem 2: Coin Change II (Count Combinations)

**Problem:** [LeetCode 518 - Coin Change II](https://leetcode.com/problems/coin-change-2/)

**Description:** Find the number of combinations that make up that amount using any number of coins.

**How to Apply the Technique:**
- Use DP with combinations approach (coins outer loop)
- `dp[i] += dp[i - coin]` — each coin contributes to all reachable amounts
- Order doesn't matter, so coins iterated first

---

### Problem 3: Perfect Squares

**Problem:** [LeetCode 279 - Perfect Squares](https://leetcode.com/problems/perfect-squares/)

**Description:** Given an integer n, return the least number of perfect square numbers that sum to n.

**How to Apply the Technique:**
- Perfect squares become your "coins"
- Same DP as coin change: `dp[i] = min(dp[i], dp[i - square] + 1)`
- Precompute all squares up to n

---

### Problem 4: Combination Sum IV

**Problem:** [LeetCode 377 - Combination Sum IV](https://leetcode.com/problems/combination-sum-iv/)

**Description:** Given an array of distinct integers `nums` and a target integer `target`, return the number of possible combinations that add up to `target`.

**How to Apply the Technique:**
- This counts permutations (order matters)
- Amount outer loop, coins inner loop
- `dp[i] += dp[i - num]` for each valid num

---

### Problem 5: Minimum Cost For Tickets

**Problem:** [LeetCode 983 - Minimum Cost For Tickets](https://leetcode.com/problems/minimum-cost-for-tickets/)

**Description:** You have planned some train traveling one year in advance. The days of the year you will travel are given as an integer array `days`. Return the minimum number of dollars you need to travel every day in the given list of days.

**How to Apply the Technique:**
- DP where dp[i] = min cost to cover days from index i onward
- Three choices at each day: 1-day, 7-day, or 30-day pass
- Similar to coin change with variable "coin" values

---

## Video Tutorial Links

### Fundamentals

- [Coin Change Problem - Dynamic Programming (Take U Forward)](https://www.youtube.com/watch?v=I-l6P7Qn3uA) - Comprehensive introduction
- [Coin Change - LeetCode 322 (NeetCode)](https://www.youtube.com/watch?v=oL6mJ8D3iNI) - Practical implementation
- [Dynamic Programming - Coin Change (BackToBack SWE)](https://www.youtube.com/watch?v=1mtVMEtzI_8) - Detailed explanation

### Variations

- [Coin Change II - Count Combinations (NeetCode)](https://www.youtube.com/watch?v=ru1OwsZbQ5U) - Counting variations
- [Perfect Squares - LeetCode 279](https://www.youtube.com/watch?v=HLReNd4dVzo) - Application to perfect squares
- [Coin Change - Space Optimization](https://www.youtube.com/watch?v=U2qo8hK3QjM) - Space optimization techniques

### Advanced

- [Unbounded Knapsack (Pepcoding)](https://www.youtube.com/watch?v=zaM_gG5uH3s) - Theory behind coin change
- [DP on Subsequences vs DP on Indexes](https://www.youtube.com/watch?v=AE039b4Ug3s) - Understanding DP patterns

---

## Follow-up Questions

### Q1: What makes the Coin Change problem different from 0/1 Knapsack?

**Answer:** The key difference is **unbounded vs bounded**:
- **Coin Change (Unbounded)**: Each coin can be used unlimited times — iterate amount first, then coins
- **0/1 Knapsack**: Each item can be used at most once — iterate amount from high to low

The state transition is similar, but the iteration order differs to prevent reusing items.

### Q2: Why does greedy fail for some coin systems?

**Answer:** Greedy works only for **canonical coin systems** where the greedy choice always leads to optimal solution. Example: coins = [1, 3, 4], amount = 6
- Greedy: 4 + 1 + 1 = 3 coins
- Optimal: 3 + 3 = 2 coins

The greedy algorithm makes locally optimal choices but doesn't consider future implications, leading to suboptimal global solutions.

### Q3: How do you handle very large amounts efficiently?

**Answer:** For very large amounts:
1. **Space optimization**: Use O(n) space by iterating coins first
2. **Bitset approach**: Use bitset for boolean reachability
3. **BFS**: Find minimum coins without storing all states
4. **Mathematical approaches**: For specific coin systems like [1, 5, 10, 25]

### Q4: Can you solve Coin Change in O(amount) space using BFS?

**Answer:** Yes! BFS treats each amount as a node and finds the shortest path:
- Start from amount 0
- Each step subtracts a coin
- First time we reach 0 (going backwards) gives minimum coins

This uses O(amount) space for the visited set but avoids the full DP array.

### Q5: What's the difference between counting combinations vs permutations?

**Answer:**
- **Combinations** (order doesn't matter): Count ways to select coins without considering order
  - Use: coins loop outer, amount loop inner
  - Example: [1,2] and [2,1] are the same

- **Permutations** (order matters): Count all ordered sequences
  - Use: amount loop outer, coins loop inner
  - Example: [1,2] and [2,1] are different

---

## Summary

The Coin Change problem is a fundamental **dynamic programming** pattern that teaches essential concepts:

- **Unbounded Knapsack**: Using items unlimited times
- **Optimal Substructure**: Building solutions from subproblems
- **State Transition**: `dp[i] = min(dp[i], dp[i-coin] + 1)`
- **Order Matters**: Combinations vs permutations

Key takeaways:

- **Use DP** when you need guaranteed optimal solution
- **Greedy works only** for canonical coin systems
- **Time: O(amount × n)**, **Space: O(amount)**
- **Variations**: Counting, maximum value, limited coins
- **Reconstruction**: Track parent pointers to find actual coins used

When to use:
- ✅ Finding minimum coins for exact amount
- ✅ Counting number of ways to make change
- ✅ Unbounded knapsack problems
- ❌ When greedy is not proven optimal
- ❌ For very large amounts (consider BFS or optimizations)

This pattern is essential for technical interviews and competitive programming, appearing in various forms across many problems.
