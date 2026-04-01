## Kadane's Algorithm: Core Concepts

What is Kadane's algorithm and how does it find maximum subarray sum?

<!-- front -->

---

### Fundamental Definition

**Kadane's algorithm** finds the **maximum sum contiguous subarray** in O(n) time.

| Aspect | Value |
|--------|-------|
| **Time** | O(n) |
| **Space** | O(1) |
| **Problem** | Maximum subarray sum |
| **Variants** | 1D array, 2D matrix, circular |

---

### Key Insight: Local vs Global Maximum

```
At each position i:
  local_max = max(arr[i], local_max + arr[i])
  global_max = max(global_max, local_max)

Decision: Start new subarray at i OR extend existing
```

**Why it works:**
- If extending gives negative, better to start fresh
- Local maximum tracks best subarray ending at i
- Global maximum tracks best seen anywhere

---

### Algorithm Trace

```
arr = [-2, 1, -3, 4, -1, 2, 1, -5, 4]

i=0: local = -2, global = -2
i=1: local = max(1, -2+1) = 1, global = max(-2, 1) = 1
i=2: local = max(-3, 1-3) = -2, global = 1
i=3: local = max(4, -2+4) = 4, global = 4
i=4: local = max(-1, 4-1) = 3, global = 4
i=5: local = max(2, 3+2) = 5, global = 5
i=6: local = max(1, 5+1) = 6, global = 6  ← max subarray [4,-1,2,1]
i=7: local = max(-5, 6-5) = 1, global = 6
i=8: local = max(4, 1+4) = 5, global = 6

Result: 6 (subarray [4, -1, 2, 1])
```

---

### All-Negative Array Handling

```
Standard Kadane returns max element for all-negative arrays.

If empty subarray allowed (sum 0):
  local = max(0, local + arr[i])
  global = max(global, local)
```

---

### Complexity Comparison

| Approach | Time | Space | Note |
|----------|------|-------|------|
| **Brute force** | O(n³) | O(1) | All subarrays |
| **Prefix sum** | O(n²) | O(n) | Cumulative sums |
| **Divide & conquer** | O(n log n) | O(log n) | Recursive |
| **Kadane** | **O(n)** | **O(1)** | **Optimal** |

<!-- back -->
