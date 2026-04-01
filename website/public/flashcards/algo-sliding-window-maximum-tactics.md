## Title: Sliding Window Maximum - Tactics

What are specific techniques and optimizations for sliding window maximum?

<!-- front -->

---

### Tactic 1: Storing Indices vs Values

Always store indices, not values, to track window boundaries:

```python
# Good: Store indices
dq.append(i)  # Index
max_val = nums[dq[0]]  # Access value via index

# Not recommended: Store values
dq.append(nums[i])  # Loses position information
```

---

### Tactic 2: Handling Edge Cases

```python
def max_sliding_window(nums, k):
    if not nums or k == 0:
        return []
    if k == 1:
        return nums[:]  # Each element is its own max
    if k >= len(nums):
        return [max(nums)]  # Single window
    # ... main logic
```

---

### Tactic 3: Prefix Sum + Monotonic Deque

For problems with negative numbers and sum constraints:

```python
def shortest_subarray_with_sum_at_least_k(arr, k):
    """Use prefix sums + monotonic deque."""
    n = len(arr)
    prefix = [0] * (n + 1)
    for i in range(n):
        prefix[i + 1] = prefix[i] + arr[i]
    
    min_len = float('inf')
    dq = deque()  # Stores indices with increasing prefix sums
    
    for i in range(n + 1):
        # Check if we can form valid subarray
        while dq and prefix[i] - prefix[dq[0]] >= k:
            min_len = min(min_len, i - dq.popleft())
        
        # Maintain monotonicity
        while dq and prefix[i] <= prefix[dq[-1]]:
            dq.pop()
        
        dq.append(i)
    
    return min_len if min_len != float('inf') else -1
```

---

### Tactic 4: Comparing Approaches

```python
# Monotonic Deque: O(n) time, O(k) space
# Best for: single max/min per window

def max_sliding_window_deque(nums, k):
    # O(n) optimal solution
    pass

# Heap: O(n log k) time, O(k) space
# Best for: need k-largest elements

def max_sliding_window_heap(nums, k):
    # O(n log k) but more flexible
    pass
```

---

### Tactic 5: Comparison with Alternatives

| Approach | Time | Space | Best Use Case |
|----------|------|-------|---------------|
| **Monotonic Deque** | O(n) | O(k) | Optimal for single pass |
| **Brute Force** | O(n × k) | O(1) | Small k, simple implementation |
| **Max Heap** | O(n log k) | O(k) | Need k-largest elements |
| **Sorted Container** | O(n log k) | O(k) | Need order statistics |
| **Sparse Table** | O(n log n) preprocess, O(1) query | O(n log n) | Static array, many queries |

**Key Insight:** Monotonic deque is optimal for finding just the maximum; use heap if you need k-largest.

<!-- back -->
