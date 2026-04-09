## Binary Search - Find First/Last Occurrence: Core Concepts

What are the fundamental principles for finding boundary positions using modified binary search?

<!-- front -->

---

### Core Concept

Use **modified binary search that continues searching** even after finding the target to locate the boundary (first or last occurrence).

**Key insight**: When you find the target, don't return immediately—continue searching the appropriate half to find the extreme boundary.

---

### The Pattern

```
Find first and last of 8 in [1, 2, 4, 8, 8, 8, 9, 10]
                      0  1  2  3  4  5  6   7

First occurrence:
Step 1: low=0, high=7, mid=3, arr[3]=8 == target
        Found! But might be more to the left
        Save first=3, high = mid - 1 = 2

Step 2: low=0, high=2, mid=1, arr[1]=2 < 8
        left = mid + 1 = 2

Step 3: low=2, high=2, mid=2, arr[2]=4 < 8
        left = mid + 1 = 3

Step 4: left=3 > right=2, done
        First occurrence = 3 ✓

Last occurrence:
(Similar but move left = mid + 1 when found, save last)
Result: last = 5
```

---

### Search Direction

| Occurrence | Condition | When Found | Search Direction |
|------------|-----------|------------|------------------|
| **First** | `arr[mid] >= target` | Save `first = mid`, `high = mid - 1` | Left |
| **Last** | `arr[mid] <= target` | Save `last = mid`, `low = mid + 1` | Right |

**Critical difference**: First uses `>=` (left-biased), Last uses `<=` (right-biased).

---

### Common Applications

| Problem Type | Description | Example |
|--------------|-------------|---------|
| Range Search | Find all indices of target | LeetCode 34 |
| Count Occurrences | How many times target appears | `count = last - first + 1` |
| Lower/Upper Bound | Find insertion position | Where to insert to maintain order |
| First Bad Version | Find boundary in boolean array | LeetCode 278 |
| Peak Element | Find local maximum | LeetCode 162 |

---

### Complexity

| Aspect | Complexity | Notes |
|--------|-----------|-------|
| Time | O(log n) | Two binary searches, each O(log n) |
| Space | O(1) | Iterative, no recursion |
| Naive approach | O(n) | Linear scan all occurrences |

<!-- back -->
