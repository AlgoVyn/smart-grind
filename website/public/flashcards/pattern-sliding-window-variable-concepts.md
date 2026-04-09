## Sliding Window - Variable Size: Core Concepts

What are the fundamental principles of the variable-size sliding window pattern?

<!-- front -->

---

### Core Concept

Use **two pointers (left and right) that form a window**, expanding right to include elements and contracting left when the window violates a condition.

**Key insight**: Find the optimal (longest/shortest) subarray satisfying a condition by dynamically adjusting window size.

---

### The Pattern

```
Find smallest subarray with sum >= target:

Array: [2, 3, 1, 2, 4, 3], target = 7

Expand:
[2] sum=2 < 7 → expand
[2,3] sum=5 < 7 → expand
[2,3,1] sum=6 < 7 → expand
[2,3,1,2] sum=9 >= 7 → found, try shrinking

Shrink:
[3,1,2] sum=6 < 7 → need to expand again
[3,1,2,4] sum=10 >= 7 → found, try shrinking
[1,2,4] sum=7 >= 7 → better! shrink more
[2,4] sum=6 < 7 → expand
[2,4,3] sum=9 >= 7 → shrink
[4,3] sum=7 >= 7 → best! (length 2)
```

---

### Common Applications

| Problem Type | Condition | Example |
|--------------|-----------|---------|
| Minimum Size Subarray | Sum >= target | Minimum Size Subarray Sum |
| Longest Substring | Unique characters | Longest Substring Without Repeating |
| Longest with K Distinct | At most K distinct | Longest K Distinct |
| Smallest Window | Contains all chars | Minimum Window Substring |
| Max Consecutive Ones | Flip at most K zeros | Max Consecutive Ones III |

---

### Complexity

| Aspect | Complexity | Notes |
|--------|-----------|-------|
| Time | O(n) | Each element visited at most twice |
| Space | O(k) | Hash set/map for window state |

<!-- back -->
