# Bounded Knapsack

## Category
Dynamic Programming

## Description

Bounded Knapsack is a variation where each item can be used at most k times (limited quantity). This is between 0/1 knapsack (use once) and unbounded knapsack (use unlimited). The problem has applications in inventory management, production planning, and resource allocation with constraints.

---

## Concepts

### 1. Binary Splitting

Convert bounded items to 0/1 items using binary representation:
- Count k = 1 + 2 + 4 + ... + remainder
- Each becomes a 0/1 knapsack item
- Example: count 13 → 1 + 2 + 4 + 6 (4 items instead of 13)

### 2. Complexity

| Approach | Time | Space |
|----------|------|-------|
| Naive | O(n × W × max_count) | O(W) |
| Binary Splitting | O(n × W × log(max_count)) | O(W) |
| Monotone Queue | O(n × W) | O(W) |

### 3. Transformation

For item with weight w, value v, count c:
```
Split into: (w×1, v×1), (w×2, v×2), (w×4, v×4), ..., (w×rem, v×rem)
```

---

## Frameworks

### Framework 1: Binary Splitting

```
┌─────────────────────────────────────────────────────────────┐
│  BOUNDED KNAPSACK - BINARY SPLITTING                         │
├─────────────────────────────────────────────────────────────┤
│  1. Create new item lists                                     │
│                                                              │
│  2. For each item (w, v, c):                                 │
│     k = 1                                                    │
│     While k <= c:                                            │
│       Add (w×k, v×k) to new lists                           │
│       c -= k                                                 │
│       k *= 2                                                 │
│     If c > 0:                                                │
│       Add (w×c, v×c) to new lists                           │
│                                                              │
│  3. Run standard 0/1 knapsack on new items                  │
└─────────────────────────────────────────────────────────────┘
```

---

## Forms

### Form 1: Binary Splitting

Convert to 0/1 knapsack with O(log k) items per original item.

| Aspect | Details |
|--------|---------|
| **Time** | O(n × W × log(max_count)) |
| **Space** | O(W) |
| **Method** | Transform then 0/1 knapsack |

### Form 2: Monotone Queue Optimization

Direct O(n × W) solution using sliding window.

| Aspect | Details |
|--------|---------|
| **Time** | O(n × W) |
| **Space** | O(W) |
| **Complexity** | Higher implementation complexity |

---

## Tactics

### Tactic 1: Binary Splitting

```python
def bounded_knapsack(weights, values, counts, capacity):
    # Binary splitting
    new_weights, new_values = [], []
    
    for w, v, c in zip(weights, values, counts):
        k = 1
        while k <= c:
            new_weights.append(w * k)
            new_values.append(v * k)
            c -= k
            k *= 2
        if c > 0:
            new_weights.append(w * c)
            new_values.append(v * c)
    
    # Standard 0/1 knapsack
    dp = [0] * (capacity + 1)
    for w, v in zip(new_weights, new_values):
        for j in range(capacity, w - 1, -1):
            dp[j] = max(dp[j], dp[j - w] + v)
    
    return dp[capacity]
```

---

## Python Templates

### Template 1: Binary Splitting

```python
def bounded_knapsack(weights, values, counts, capacity):
    """
    Bounded knapsack using binary splitting.
    
    Time: O(n * W * log(max_count))
    Space: O(W)
    """
    new_weights, new_values = [], []
    
    for w, v, c in zip(weights, values, counts):
        k = 1
        while k <= c:
            new_weights.append(w * k)
            new_values.append(v * k)
            c -= k
            k *= 2
        if c > 0:
            new_weights.append(w * c)
            new_values.append(v * c)
    
    dp = [0] * (capacity + 1)
    for w, v in zip(new_weights, new_values):
        for j in range(capacity, w - 1, -1):
            dp[j] = max(dp[j], dp[j - w] + v)
    
    return dp[capacity]
```

---

## Practice Problems

### Problem 1: Combination Sum IV
**Problem:** [LeetCode 377](https://leetcode.com/problems/combination-sum-iv/)

### Problem 2: Coin Change
**Problem:** [LeetCode 322](https://leetcode.com/problems/coin-change/)

---

## Summary

Bounded Knapsack:
- Binary splitting converts to 0/1 knapsack
- O(log k) items per original item
- Monotone queue for O(n×W) without extra items
- Between 0/1 and unbounded knapsack
