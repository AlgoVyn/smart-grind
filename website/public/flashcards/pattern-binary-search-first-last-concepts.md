## Binary Search - First Last Occurrence: Core Concepts

What are the fundamental principles for finding first and last occurrences using binary search?

<!-- front -->

---

### Core Concept

Use **modified binary search that continues searching** even after finding the target to locate the boundary (first or last occurrence).

**Key insight**: When you find the target, don't return immediately - continue searching the appropriate half to find the boundary.

---

### The Pattern

```
Find first and last of 8 in [1, 2, 4, 8, 8, 8, 9, 10]

First occurrence:
Step 1: left=0, right=7, mid=3, arr[3]=8 == target
        Found! But might be more to the left
        right = mid - 1 = 2, save result = 3

Step 2: left=0, right=2, mid=1, arr[1]=2 < 8
        left = mid + 1 = 2

Step 3: left=2, right=2, mid=2, arr[2]=4 < 8
        left = mid + 1 = 3

Step 4: left=3 > right=2, done
        First occurrence = 3 ✓

Last occurrence:
(Similar but move left = mid + 1 when found)
```

---

### Search Direction

| Occurrence | When Found | Search Direction |
|------------|------------|------------------|
| **First** | `arr[mid] == target` | Left (right = mid - 1) |
| **Last** | `arr[mid] == target` | Right (left = mid + 1) |

---

### Common Applications

| Problem Type | Description | Example |
|--------------|-------------|---------|
| Range Search | Find all indices of target | Find First and Last |
| Count Occurrences | How many times target appears | Count in Sorted |
| Search Range | Is target in sorted array? | Contains |
| Insert Position | Where to insert | Lower Bound |

---

### Complexity

| Aspect | Complexity | Notes |
|--------|-----------|-------|
| Time | O(log n) | Two binary searches |
| Space | O(1) | Iterative |
| Naive | O(n) | Linear scan |

<!-- back -->
