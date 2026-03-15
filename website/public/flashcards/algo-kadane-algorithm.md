## Kadane's Algorithm

**Questions:**
1. What's the recurrence relation?
2. When do you start a new subarray?

<!-- front -->

---

## Kadane's Algorithm

### Recurrence Relation
```
dp[i] = max(arr[i], dp[i-1] + arr[i])
```

### Implementation
```python
def max_subarray_sum(arr):
    max_ending_here = arr[0]
    max_so_far = arr[0]
    
    for i in range(1, len(arr)):
        # Decision: extend or start fresh
        max_ending_here = max(arr[i], max_ending_here + arr[i])
        max_so_far = max(max_so_far, max_ending_here)
    
    return max_so_far
```

### 💡 When to Start Fresh?
Start a new subarray when `arr[i] > current_sum + arr[i]`

### ⚠️ Edge Case
All negative numbers → return the **least negative** (not 0)

**Example:** `[-3, -2, -5]` → answer is `-2`

<!-- back -->
