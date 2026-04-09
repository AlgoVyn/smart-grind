## DP - Kadane's Algorithm: Core Concepts

What are the fundamental principles of Kadane's algorithm?

<!-- front -->

---

### Core Concept

**At each position, decide whether to extend the previous subarray or start a new one from the current element.**

The key insight: The maximum subarray ending at position `i` is either:
- The current element alone (`nums[i]`), OR
- The previous maximum subarray extended by current element (`max_ending_at_{i-1} + nums[i]`)

**Greedy choice at every step:**
```
max_ending_at_i = max(nums[i], max_ending_at_{i-1} + nums[i])
```

---

### The Pattern

```
Array: [-2, 1, -3, 4, -1, 2, 1, -5, 4]

Step by step:
Index 0: nums[0] = -2
  current_max = -2
  global_max = -2

Index 1: nums[1] = 1
  Start new? 1
  Extend? -2 + 1 = -1
  current_max = max(1, -1) = 1  ← Start fresh!
  global_max = max(-2, 1) = 1

Index 2: nums[2] = -3
  Start new? -3
  Extend? 1 + (-3) = -2
  current_max = max(-3, -2) = -2  ← Extend
  global_max stays 1

Index 3: nums[3] = 4
  Start new? 4
  Extend? -2 + 4 = 2
  current_max = 4  ← Start fresh!
  global_max = 4

...and so on
```

---

### Common Applications

| Problem Type | Variation | Example |
|--------------|-----------|---------|
| Maximum subarray | Classic | LeetCode 53 |
| Minimum subarray | Reverse (use min) | Extended |
| Maximum circular | Kadane + total - min | LeetCode 918 |
| 2D maximum sum | Apply Kadane on rows | Extended |
| Stock trading | Max profit = max subarray of diffs | LeetCode 121 |

---

### Complexity

| Aspect | Complexity | Notes |
|--------|-----------|-------|
| Time | O(n) | Single pass |
| Space | O(1) | Only track two variables |

---

### When to Reset?

```python
# Reset condition hidden in max()
current_max = max(num, current_max + num)

When does "num" win over "current_max + num"?
When current_max + num < num
→ current_max < 0

So we reset (start fresh) when current_max becomes negative!

Why? A negative current_max drags down future sums.
Better to start fresh from current element.

Example: [-2, 1, 3]
At 1: max(1, -2+1) = max(1, -1) = 1 (reset!)
At 3: max(3, 1+3) = 4 (extend)
Result: 4 from subarray [1, 3]
```

<!-- back -->
