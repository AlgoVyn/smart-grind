## Binary Search - Two Sorted Arrays: Core Concepts

What are the fundamental principles for finding medians and k-th elements across two sorted arrays?

<!-- front -->

---

### Core Concept

Use **binary search to partition two sorted arrays** such that the left halves contain exactly k elements total.

**Key insight**: The k-th smallest element is the maximum of the left partition when we've selected k elements from both arrays combined.

---

### The Pattern

```
Find k=4th element in:
A = [1, 3, 5, 7, 9]
B = [2, 4, 6, 8, 10]

Partition A at i, B at j where i + j = k

i=2: A[:2] = [1, 3], A[2:] = [5, 7, 9]
j=2: B[:2] = [2, 4], B[2:] = [6, 8, 10]

Check partition validity:
  max(A[:2]) = 3 <= min(B[2:]) = 6? ✓
  max(B[:2]) = 4 <= min(A[2:]) = 5? ✓
  
Valid partition! k-th element = max(3, 4) = 4 ✓
```

---

### Why It Works

| Partition Condition | Meaning |
|---------------------|---------|
| `i + j = k` | Exactly k elements in left partitions |
| `A[i-1] <= B[j]` | All elements in A[:i] <= all in B[j:] |
| `B[j-1] <= A[i]` | All elements in B[:j] <= all in A[i:] |

When both conditions hold, max(left side) is the k-th element.

---

### Common Applications

| Problem Type | Description | Example |
|--------------|-------------|---------|
| Median of Two | Find median | Median of Two Sorted Arrays |
| K-th Element | Find k-th smallest | K-th Element in Sorted Arrays |
| Upper/Lower Median | Even/odd handling | Various median definitions |

---

### Complexity

| Aspect | Complexity | Notes |
|--------|-----------|-------|
| Time | O(log(min(m, n))) | Binary search on smaller array |
| Space | O(1) | Iterative |
| Naive merge | O(m + n) | Merge then find median |

<!-- back -->
