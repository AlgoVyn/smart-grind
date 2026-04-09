## Binary Search - On Sorted Array/List: Core Concepts

What are the fundamental principles that make binary search work on sorted arrays?

<!-- front -->

---

### Core Concept

Binary search leverages the **sorted property** of the array to **eliminate half the search space** in each iteration.

**Key insight**: If `nums[mid] > target`, the target (if it exists) must be in the left half. If `nums[mid] < target`, it must be in the right half.

---

### Why Binary Search Works

```
Search for 23 in [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]

Step 1: low=0, high=9, mid=4, nums[4]=16 < 23
        Target must be in right half [23, 38, 56, 72, 91]
        low = 5

Step 2: low=5, high=9, mid=7, nums[7]=56 > 23
        Target must be in left half [23, 38]
        high = 6

Step 3: low=5, high=6, mid=5, nums[5]=23 == 23
        Found at index 5! ✓
```

**Only 3 steps instead of 6 linear steps!**

---

### Key Invariants

| Invariant | Description |
|-----------|-------------|
| **Search Space** | Maintains contiguous subarray `[low, high]` where target could exist |
| **Termination** | Loop continues while `low <= high` |
| **Mid Calculation** | `mid = low + (high - low) // 2` prevents integer overflow |
| **Progress** | Each iteration halves the search space |

---

### Prerequisites for Binary Search

| Requirement | Why It Matters |
|-------------|----------------|
| **Sorted array** | Enables elimination of half the elements |
| **Random access** | O(1) access to middle element |
| **Comparable elements** | Can determine <, >, == relationships |

---

### Complexity Analysis

| Aspect | Complexity | Explanation |
|--------|-----------|-------------|
| **Time** | O(log n) | Each step halves n: n → n/2 → n/4 → ... → 1 |
| **Space (iterative)** | O(1) | Only uses a few variables |
| **Space (recursive)** | O(log n) | Stack depth from recursion |

---

### The Logarithmic Advantage

| Array Size | Linear Search | Binary Search |
|------------|---------------|---------------|
| 1,000 | 1,000 ops | ~10 ops |
| 1,000,000 | 1,000,000 ops | ~20 ops |
| 1,000,000,000 | 1,000,000,000 ops | ~30 ops |

<!-- back -->
