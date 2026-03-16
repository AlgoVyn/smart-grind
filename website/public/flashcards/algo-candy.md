## Candy (Greedy)

**Question:** Distribute candies with rating constraints?

<!-- front -->

---

## Answer: Two-Pass Greedy

### Solution
```python
def candy(ratings):
    n = len(ratings)
    candies = [1] * n
    
    # Left to right pass
    for i in range(1, n):
        if ratings[i] > ratings[i - 1]:
            candies[i] = candies[i - 1] + 1
    
    # Right to left pass
    for i in range(n - 2, -1, -1):
        if ratings[i] > ratings[i + 1]:
            candies[i] = max(candies[i], candies[i + 1] + 1)
    
    return sum(candies)
```

### Visual: Two-Pass Process
```
Ratings: [1, 3, 2, 2, 1]

Initial:  [1, 1, 1, 1, 1]

Left pass (ratings[i] > ratings[i-1]):
  i=1: 3>1 → [1, 2, 1, 1, 1]
  i=2: 2>3? No → [1, 2, 1, 1, 1]
  i=3: 2>2? No → [1, 2, 1, 1, 1]
  i=4: 1>2? No → [1, 2, 1, 1, 1]

Right pass (ratings[i] > ratings[i+1]):
  i=3: 2>1 → max(1, 1+1)=2 → [1, 2, 1, 2, 1]
  i=2: 2>1 → max(1, 1+1)=2 → [1, 2, 2, 2, 1]
  i=1: 3>2 → max(2, 2+1)=3 → [1, 3, 2, 2, 1]

Sum: 1+3+2+2+1 = 9
```

### ⚠️ Tricky Parts

#### 1. Why Two Passes?
```python
# Left pass: ensures higher rating gets more than left neighbor
# Right pass: ensures higher rating gets more than right neighbor

# Single pass fails:
# [1, 3, 2] → left pass: [1, 2, 1] ✓
# [2, 1, 0] → left pass: [1, 1, 1] ✗ should be [3, 2, 1]
```

#### 2. Why max() in Right Pass?
```python
# Keep larger value from both passes
# candy[i] already satisfies left neighbor
# Must also satisfy right neighbor
# Take max to satisfy both
```

### Time & Space Complexity

| Method | Time | Space |
|--------|------|-------|
| Two-pass | O(n) | O(n) |

### Common Mistakes

| Mistake | Fix |
|---------|-----|
| Single pass | Use two passes |
| Using min instead of max | Use max to satisfy both |
| Not initializing with 1s | Start all with 1 candy |

<!-- back -->
