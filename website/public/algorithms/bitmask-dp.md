# Bitmask DP (DP on Subsets)

## Category
Dynamic Programming

## Description

Bitmask DP uses bit manipulation to represent sets as integers, enabling efficient state representation for subset-based problems. Each bit represents whether an element is included (1) or excluded (0) from a subset. This technique is essential for problems with n ≤ 20-22 where 2^n states are manageable.

The key insight is that an integer can represent a set, where bit i corresponds to element i. This allows O(1) set operations and compact state representation.

---

## Concepts

### 1. Bit Operations

| Operation | Code | Description |
|-----------|------|-------------|
| Set bit | `mask | (1 << i)` | Include element i |
| Check bit | `mask & (1 << i)` | Is element i included? |
| Clear bit | `mask & ~(1 << i)` | Exclude element i |
| Toggle bit | `mask ^ (1 << i)` | Flip element i |
| Count bits | `bin(mask).count('1')` | Number of elements |
| Iterate subsets | `sub = mask; while sub: sub = (sub-1) & mask` | All subsets |

### 2. State Representation

```
mask = 0b1010 means elements 1 and 3 are included (0-indexed)
mask = 13 (binary 1101) means elements 0, 2, 3 are included
```

### 3. DP Transition

```python
for mask in range(1 << n):
    for i in range(n):
        if not (mask & (1 << i)):  # i not in mask
            new_mask = mask | (1 << i)
            dp[new_mask] = transition(dp[mask], i)
```

---

## Frameworks

### Framework 1: Standard Bitmask DP

```
┌─────────────────────────────────────────────────────────────┐
│  BITMASK DP FRAMEWORK                                        │
├─────────────────────────────────────────────────────────────┤
│  1. Initialize dp array of size 2^n                          │
│     dp[0] = base case                                        │
│                                                              │
│  2. For each mask from 0 to 2^n - 1:                        │
│     a) For each bit not set in mask:                        │
│        - new_mask = mask | (1 << bit)                       │
│        - dp[new_mask] = transition from dp[mask]            │
│                                                              │
│  3. Return dp[(1 << n) - 1] (all elements)                 │
└─────────────────────────────────────────────────────────────┘
```

### Framework 2: TSP (Traveling Salesman)

```
┌─────────────────────────────────────────────────────────────┐
│  TSP WITH BITMASK DP                                         │
├─────────────────────────────────────────────────────────────┤
│  dp[mask][i] = min cost to visit mask cities, end at i       │
│                                                              │
│  1. Initialize: dp[1][0] = 0 (start at city 0)             │
│                                                              │
│  2. For each mask:                                           │
│     For each last city in mask:                             │
│       For each next city not in mask:                       │
│         new_mask = mask | (1 << next)                       │
│         dp[new_mask][next] = min(dp[new_mask][next],        │
│                                  dp[mask][last] + dist)      │
│                                                              │
│  3. Return min over all end cities                          │
└─────────────────────────────────────────────────────────────┘
```

---

## Forms

### Form 1: Subset DP

Standard DP over all subsets.

| Aspect | Details |
|--------|---------|
| **States** | 2^n |
| **Time** | O(2^n × n) |
| **Space** | O(2^n) |

### Form 2: TSP DP

Traveling Salesman Problem.

| Aspect | Details |
|--------|---------|
| **States** | n × 2^n |
| **Time** | O(n² × 2^n) |
| **Space** | O(n × 2^n) |

### Form 3: Game Theory DP

Game states as bitmasks.

| Aspect | Details |
|--------|---------|
| **Use** | Winning/losing states |
| **Example** | Can I Win (LeetCode 464) |

---

## Tactics

### Tactic 1: Basic Bitmask DP

```python
def can_i_win(max_choosable, desired_total):
    """Game theory with bitmask."""
    if desired_total <= max_choosable:
        return True
    if (1 + max_choosable) * max_choosable // 2 < desired_total:
        return False
    
    n = max_choosable
    
    @lru_cache(maxsize=None)
    def dp(mask, total):
        for i in range(n):
            if not (mask >> i) & 1:
                if total + i + 1 >= desired_total:
                    return True
                if not dp(mask | (1 << i), total + i + 1):
                    return True
        return False
    
    return dp(0, 0)
```

### Tactic 2: TSP DP

```python
def tsp(dist):
    n = len(dist)
    dp = [[float('inf')] * n for _ in range(1 << n)]
    dp[1][0] = 0
    
    for mask in range(1 << n):
        for last in range(n):
            if not (mask & (1 << last)):
                continue
            if dp[mask][last] == float('inf'):
                continue
            for nxt in range(n):
                if mask & (1 << nxt):
                    continue
                new_mask = mask | (1 << nxt)
                dp[new_mask][nxt] = min(dp[new_mask][nxt], 
                                        dp[mask][last] + dist[last][nxt])
    
    return min(dp[(1 << n) - 1][i] + dist[i][0] for i in range(n))
```

---

## Python Templates

### Template 1: Basic Bitmask DP

```python
def bitmask_dp(n, costs):
    """
    Standard bitmask DP pattern.
    
    Time: O(2^n × n)
    Space: O(2^n)
    """
    dp = [float('inf')] * (1 << n)
    dp[0] = 0
    
    for mask in range(1 << n):
        i = bin(mask).count('1')
        for j in range(n):
            if not (mask & (1 << j)):
                new_mask = mask | (1 << j)
                dp[new_mask] = min(dp[new_mask], dp[mask] + costs[i][j])
    
    return dp[(1 << n) - 1]
```

### Template 2: TSP

```python
def tsp(dist):
    """
    Traveling Salesman Problem with Bitmask DP.
    
    Time: O(n^2 × 2^n)
    Space: O(n × 2^n)
    """
    n = len(dist)
    dp = [[float('inf')] * n for _ in range(1 << n)]
    dp[1][0] = 0
    
    for mask in range(1 << n):
        for last in range(n):
            if not (mask & (1 << last)):
                continue
            if dp[mask][last] == float('inf'):
                continue
            for nxt in range(n):
                if mask & (1 << nxt):
                    continue
                new_mask = mask | (1 << nxt)
                dp[new_mask][nxt] = min(dp[new_mask][nxt], 
                                        dp[mask][last] + dist[last][nxt])
    
    return min(dp[(1 << n) - 1][i] + dist[i][0] for i in range(n))
```

---

## When to Use

Use Bitmask DP when:
- n ≤ 20-22
- Problem involves subsets
- State can be represented as set
- Need to track which elements are used

---

## Practice Problems

### Problem 1: Can I Win
**Problem:** [LeetCode 464](https://leetcode.com/problems/can-i-win/)

### Problem 2: Find the Shortest Superstring
**Problem:** [LeetCode 943](https://leetcode.com/problems/find-the-shortest-superstring/)

---

## Summary

Bitmask DP:
- Use integers to represent sets
- 2^n states for n elements
- Key operations: set, check, clear bits
- Best for n ≤ 20-22
- Precompute transition costs when possible
