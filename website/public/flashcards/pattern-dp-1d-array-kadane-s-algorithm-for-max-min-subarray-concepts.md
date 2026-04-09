## DP - 1D Array (Kadane's Algorithm): Core Concepts

What are the fundamental concepts behind Kadane's Algorithm?

<!-- front -->

---

### The Core Decision

At each position `i`, you face a binary choice:

```
Current element: nums[i]

Choice 1: Start fresh subarray at i
    → Sum = nums[i]

Choice 2: Extend previous subarray ending at i-1
    → Sum = nums[i] + max_sum_ending_at(i-1)

Decision: max(nums[i], nums[i] + max_sum_ending_at(i-1))
```

**Key Insight:** The greedy choice is optimal because future decisions only depend on the best sum ending at the current position.

---

### Local vs Global Maximum

| Type | Definition | Purpose |
|------|------------|---------|
| **Local (max_current)** | Best sum ending at position i | Tracks extend-or-restart decision |
| **Global (max_global)** | Best sum across all positions 0..i | Final answer |

```
nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]

i=0:  local=-2,  global=-2   (only element)
i=1:  local=1,   global=1    (restart beats extend: max(1, -2+1))
i=2:  local=-2,  global=1    (extend loses: max(-3, 1-3))
i=3:  local=4,   global=4    (restart wins: max(4, -2+4))
i=4:  local=3,   global=4    (extend: max(-1, 4-1))
i=5:  local=5,   global=5    (extend: max(2, 3+2))
i=6:  local=6,   global=6    (extend: max(1, 5+1))
i=7:  local=1,   global=6    (extend loses: max(-5, 6-5))
i=8:  local=5,   global=6    (extend: max(4, 1+4))

Answer: 6 (subarray [4, -1, 2, 1])
```

---

### The "Aha!" Moments

1. **Why single pass works:** Each decision only depends on the previous position's local maximum

2. **Why O(1) space works:** We only need the previous local max, not all history

3. **Negative numbers don't break it:** Local max handles them by restarting when beneficial

4. **Greedy is optimal here:** The choice at position i doesn't affect optimal choices before i

---

### DP vs Greedy Nature

| Aspect | Classification | Explanation |
|--------|---------------|-------------|
| **Structure** | DP | Uses optimal substructure |
| **Decision** | Greedy | Local optimal choice leads to global optimal |
| **State** | Minimal | Only tracks `max_current` and `max_global` |
| **Recurrence** | Simple | `dp[i] = max(nums[i], dp[i-1] + nums[i])` |

```
Formal DP recurrence:
dp[i] = maximum subarray sum ending at index i

dp[i] = max(nums[i], nums[i] + dp[i-1])

Space optimized: only need dp[i-1], so use variable
```

---

### When Does Kadane's Work?

**Requirements:**
- Contiguous subarray constraint
- Optimization goal (max or min sum)
- Single pass decision property

**Works for:**
- Maximum sum subarray ✓
- Minimum sum subarray ✓ (flip max to min)
- Maximum product subarray ✓ (track both max and min)

**Doesn't work for:**
- Subsequence (non-contiguous) ✗ → Use regular DP
- Fixed-length subarray ✗ → Use sliding window
- Specific target sum ✗ → Use prefix sum + hash

<!-- back -->
