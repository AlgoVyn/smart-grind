## DP - Longest Increasing Subsequence (LIS): Core Concepts

What are the fundamental concepts behind LIS?

<!-- front -->

---

### The Core Insight

**End-Focused DP**: `dp[i]` represents the length of the longest increasing subsequence **ending at index i** (not starting from i).

```
nums:  [10, 9, 2, 5, 3, 7, 101, 18]
index:  0   1   2  3  4  5   6    7

dp:     [1,  1,  1, 2, 2, 3,  4,   4]
                ↑        ↑       ↑
                2→5      2→3→7   2→5→7→101
```

**Key Properties**:
- Subsequence: elements don't need to be contiguous
- Increasing: each next element > previous (strict)
- Non-decreasing: each next element >= previous (if duplicates allowed)

---

### The "Aha!" Moments

| Moment | Insight |
|--------|---------|
| **Compare all previous** | For each i, check all j < i where nums[j] < nums[i] |
| **Patience sorting** | Cards game: maintain piles, place on leftmost valid pile |
| **Binary search optimization** | Use `lower_bound` to find pile in O(log n) |
| **tails array meaning** | `tails[i]` = smallest tail value for all IS of length i+1 |
| **Why replacement works** | Smaller tail allows more future elements to extend |

---

### DP vs Binary Search: What They Track

**DP Approach**:
```
dp[i] = length of LIS ending at index i
Can reconstruct actual subsequence via parent pointers
Time: O(n²), Space: O(n)
```

**Binary Search Approach**:
```
tails[i] = smallest ending value of all IS of length i+1
Only tracks length correctly, not the actual sequence!
Time: O(n log n), Space: O(n)
```

> ⚠️ **Important**: The `tails` array does NOT contain the actual LIS! It only helps compute the length.

---

### Why Binary Search Works (Patience Sorting)

**Card Game Analogy**:
- Each number is a card
- Piles must be in decreasing order (can only place smaller on top)
- Number of piles = length of LIS

```
Numbers: 3, 1, 4, 1, 5, 9, 2, 6

Pile 1:  [3] → [1]      → [1, 2]
              ↓            ↓
Pile 2:       [4] → [1]  → [1, 5] → [1, 5, 6]
                    ↓            ↓
Pile 3:            [9]        [9]

Final piles: 3 piles = LIS length = 3
(Actual LIS: 1, 5, 6 or 1, 2, 6)
```

**Binary Search Logic**:
- `bisect_left(tails, num)`: finds leftmost pile where top >= num
- If found: replace that pile's top (smaller tail = more extendable)
- If not found: start new pile (extends longest subsequence)

---

### Key Differences: Strict vs Non-Strict

| Type | Condition | Binary Search Function |
|------|-----------|----------------------|
| **Strictly Increasing** | nums[j] < nums[i] | `bisect_left` (>=) |
| **Non-Decreasing** | nums[j] <= nums[i] | `bisect_right` (>) |

```python
# Strictly increasing
if nums[j] < nums[i]:  # DP
idx = bisect.bisect_left(tails, num)  # Binary Search

# Non-decreasing (allows duplicates)
if nums[j] <= nums[i]:  # DP
idx = bisect.bisect_right(tails, num)  # Binary Search
```

<!-- back -->
