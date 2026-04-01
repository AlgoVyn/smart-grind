## Kadane's Algorithm: Comparison with Alternatives

How does Kadane's algorithm compare to other subarray sum approaches?

<!-- front -->

---

### Kadane vs Brute Force vs Prefix Sum

| Approach | Time | Space | When to Use |
|----------|------|-------|-------------|
| **Brute force** | O(n³) | O(1) | Never (education only) |
| **Optimized brute** | O(n²) | O(1) | Very small n |
| **Prefix sum** | O(n²) | O(n) | Multiple queries |
| **Kadane** | **O(n)** | **O(1)** | **Single query** |
| **Divide & conquer** | O(n log n) | O(log n) | Parallel processing |

```python
# Brute force O(n^3) - never use
def max_subarray_brute(arr):
    n = len(arr)
    max_sum = float('-inf')
    for i in range(n):
        for j in range(i, n):
            curr_sum = sum(arr[i:j+1])
            max_sum = max(max_sum, curr_sum)
    return max_sum

# Optimized O(n^2) - still slow
def max_subarray_prefix(arr):
    n = len(arr)
    prefix = [0] * (n + 1)
    for i in range(n):
        prefix[i+1] = prefix[i] + arr[i]
    
    max_sum = float('-inf')
    for i in range(n):
        for j in range(i, n):
            max_sum = max(max_sum, prefix[j+1] - prefix[i])
    return max_sum

# Kadane O(n) - always use this
def max_subarray_kadane(arr):
    max_here = max_so_far = arr[0]
    for x in arr[1:]:
        max_here = max(x, max_here + x)
        max_so_far = max(max_so_far, max_here)
    return max_so_far
```

---

### Prefix Sum vs Kadane for Multiple Queries

| Scenario | Best Approach | Why |
|----------|---------------|-----|
| **Single max subarray** | Kadane | O(n) optimal |
| **Many range sum queries** | Prefix sum | O(1) per query |
| **Many max subarray queries on subarrays** | Segment tree | O(log n) per query |
| **2D max subarray (single)** | 2D Kadane | O(n³) or O(n²) with optimization |

```python
# Preprocess for multiple queries
class SubarrayQuery:
    def __init__(self, arr):
        self.arr = arr
        self.n = len(arr)
        # Precompute nothing for max subarray - must use Kadane each time
    
    def max_subarray(self):
        return kadane_basic(self.arr)
    
    def range_sum(self, l, r):
        # Prefix sum needed here
        if not hasattr(self, 'prefix'):
            self.prefix = [0]
            for x in self.arr:
                self.prefix.append(self.prefix[-1] + x)
        return self.prefix[r+1] - self.prefix[l]
```

---

### Kadane vs Divide & Conquer

| Aspect | Kadane | Divide & Conquer |
|--------|--------|------------------|
| **Time** | O(n) | O(n log n) |
| **Space** | O(1) | O(log n) stack |
| **Parallelizable** | Sequential | Yes |
| **Cache efficiency** | Good | Poorer |

```python
# Divide & conquer for parallel processing
def max_subarray_dc(arr, left, right):
    if left == right:
        return arr[left]
    
    mid = (left + right) // 2
    
    # Max in left half (parallel)
    left_max = max_subarray_dc(arr, left, mid)
    
    # Max in right half (parallel)
    right_max = max_subarray_dc(arr, mid + 1, right)
    
    # Max crossing the middle
    cross_max = max_crossing_sum(arr, left, mid, right)
    
    return max(left_max, right_max, cross_max)

def max_crossing_sum(arr, left, mid, right):
    # Sum from mid to left
    sum_left = float('-inf')
    curr = 0
    for i in range(mid, left - 1, -1):
        curr += arr[i]
        sum_left = max(sum_left, curr)
    
    # Sum from mid+1 to right
    sum_right = float('-inf')
    curr = 0
    for i in range(mid + 1, right + 1):
        curr += arr[i]
        sum_right = max(sum_right, curr)
    
    return sum_left + sum_right
```

**Verdict:** Kadane always wins unless you need parallelism.

---

### When Each Algorithm Wins

| Problem | Best Algorithm | Why |
|---------|----------------|-----|
| **Maximum subarray** | Kadane | O(n), O(1) space |
| **Maximum subarray 2D** | 2D Kadane | Extendable pattern |
| **Circular max subarray** | Kadane + total sum | Two cases |
| **Maximum product** | Modified Kadane | Track min too |
| **k maximum subarrays** | DP with heap | More complex state |
| **Maximum average** | Binary search + Kadane | Transform and check |

```python
# Decision tree
def choose_max_subarray_algorithm(arr, variant):
    if variant == "standard":
        return kadane_basic(arr)
    elif variant == "circular":
        return kadane_circular(arr)
    elif variant == "2d":
        return kadane_2d(arr)
    elif variant == "product":
        return max_product_subarray(arr)
    elif variant == "with_skips":
        return kadane_with_skip(arr, k)
    else:
        return "Unknown variant"
```

<!-- back -->
