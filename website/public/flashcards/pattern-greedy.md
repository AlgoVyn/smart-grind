## Greedy Pattern

**Question:** When and how to use greedy algorithms?

<!-- front -->

---

## Answer: Greedy Decision Framework

### When Greedy Works
```python
# 1. Local optimal leads to global optimal
# 2. No need to reconsider decisions
# 3. Problem has greedy-choice property
```

### Classic Problems & Strategy

#### 1. Activity Selection
```python
# Sort by end time, pick earliest finishing
activities.sort(key=lambda x: x[1])  # End time
```

#### 2. Fractional Knapsack
```python
# Sort by value/weight ratio (descending)
# Take items greedily
```

#### 3. Minimum Platforms (Railway)
```python
# Sort arrivals and departures separately
# Track overlapping trains
```

#### 4. Jump Game
```python
# Track farthest reachable position
# Greedily extend as far as possible
```

### ⚠️ Tricky Parts

#### 1. Proving Greedy Works
```python
# No universal proof technique
# Common approaches:
# - Exchange argument
# - Cut-and-paste proof
  
# If unsure, try DP as backup
```

#### 2. Greedy vs DP
```python
# Greedy: O(n) or O(n log n), may miss optimal
# DP: O(n²) or O(n³), guarantees optimal

# When in doubt, compare both
```

### When NOT to Use Greedy

| Problem | Greedy Fails | Solution |
|---------|--------------|----------|
| 0/1 Knapsack | Can't backtrack | DP |
| Longest Path | No optimal substructure | DFS/BFS |
| Coin Change | May miss optimal | DP |

<!-- back -->
