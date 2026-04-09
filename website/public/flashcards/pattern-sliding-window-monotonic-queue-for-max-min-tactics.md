## Sliding Window - Monotonic Queue for Max/Min: Tactics

What are practical tactics for solving monotonic queue problems?

<!-- front -->

---

### Tactic 1: Debug with Deque State Visualization

```python
def max_in_window_debug(arr, k):
    """Print deque state at each step for debugging."""
    from collections import deque
    dq = deque()
    
    for i in range(len(arr)):
        print(f"\n--- i={i}, val={arr[i]} ---")
        
        # Step 1: Remove out of window
        out_count = 0
        while dq and dq[0] <= i - k:
            print(f"  Pop front: index {dq[0]} (val={arr[dq[0]]}) out of window")
            dq.popleft()
            out_count += 1
        if out_count == 0:
            print(f"  No elements out of window (front={dq[0] if dq else 'empty'}, limit={i-k})")
        
        # Step 2: Remove smaller elements
        smaller_count = 0
        while dq and arr[dq[-1]] < arr[i]:
            print(f"  Pop back: index {dq[-1]} (val={arr[dq[-1]]}) < current {arr[i]}")
            dq.pop()
            smaller_count += 1
        if smaller_count == 0:
            print(f"  No smaller elements at back")
        
        # Step 3: Add current
        dq.append(i)
        print(f"  Append: index {i}")
        
        # Show deque state
        dq_vals = [f"{idx}:{arr[idx]}" for idx in dq]
        print(f"  Deque state: [{', '.join(dq_vals)}]")
        
        # Step 4: Record result
        if i >= k - 1:
            print(f"  >>> RESULT: max = {arr[dq[0]]}")
```

---

### Tactic 2: Identify Problem Keywords

| Keyword/Phrase | Pattern to Use |
|----------------|----------------|
| "maximum in each window" | Decreasing deque |
| "minimum in each window" | Increasing deque |
| "sliding window" + "max/min" | Monotonic queue |
| "deque" or "double-ended queue" | Monotonic queue |
| "constrained subsequence sum" | Monotonic queue + DP |
| "shortest subarray with sum at least K" | Prefix sum + monotonic deque |

---

### Tactic 3: Off-by-One Checklist

Common index errors and their fixes:

| Check | Wrong | Correct | Why |
|-------|-------|---------|-----|
| Window boundary | `dq[0] < i - k` | `dq[0] <= i - k` | Element at `i-k` just left window |
| First result | `i >= k` | `i >= k - 1` | First window ends at index `k-1` |
| Comparison | `arr[dq[-1]] <= arr[i]` | `arr[dq[-1]] < arr[i]` | Keep duplicates with `<` |
| Empty check | `if dq:` | `while dq and ...` | Need to remove ALL invalid elements |

---

### Tactic 4: Handle Edge Cases

```python
def robust_max_in_window(arr, k):
    """Handle all edge cases."""
    # Empty array
    if not arr:
        return []
    
    # Invalid k
    if k <= 0:
        return []
    
    # k larger than array
    if k > len(arr):
        # Option 1: Return max of entire array
        return [max(arr)] if arr else []
        # Option 2: Return empty
        # return []
    
    # k = 1: every element is its own max
    if k == 1:
        return arr[:]
    
    # k = len(arr): only one window
    if k == len(arr):
        return [max(arr)]
    
    # Normal case: proceed with algorithm
    # ...
```

---

### Tactic 5: Pattern for Combined Max and Min

When you need both in one pass:

```python
def max_and_min_in_window(arr, k):
    """Get both max and min in single traversal."""
    from collections import deque
    
    max_dq = deque()  # Decreasing for max
    min_dq = deque()  # Increasing for min
    max_result, min_result = [], []
    
    for i in range(len(arr)):
        # Update max deque
        while max_dq and max_dq[0] <= i - k:
            max_dq.popleft()
        while max_dq and arr[max_dq[-1]] < arr[i]:
            max_dq.pop()
        max_dq.append(i)
        
        # Update min deque
        while min_dq and min_dq[0] <= i - k:
            min_dq.popleft()
        while min_dq and arr[min_dq[-1]] > arr[i]:
            min_dq.pop()
        min_dq.append(i)
        
        # Record results
        if i >= k - 1:
            max_result.append(arr[max_dq[0]])
            min_result.append(arr[min_dq[0]])
    
    return max_result, min_result

# Time: O(n), Space: O(k) for both deques
```

---

### Tactic 6: Extension - DP with Monotonic Queue

For problems like "Constrained Subsequence Sum":

```python
def constrained_subsequence_sum(nums, k):
    """
    Find max sum of subsequence where consecutive elements 
    are at most k apart.
    """
    from collections import deque
    
    n = len(nums)
    dp = [0] * n  # dp[i] = max sum ending at i
    dq = deque()
    max_sum = float('-inf')
    
    for i in range(n):
        # Remove out of range
        while dq and dq[0] < i - k:
            dq.popleft()
        
        # dp[i] = nums[i] + max(0, max dp in window)
        best_prev = dp[dq[0]] if dq else 0
        dp[i] = nums[i] + max(0, best_prev)
        
        # Maintain decreasing deque of dp values
        while dq and dp[dq[-1]] <= dp[i]:
            dq.pop()
        dq.append(i)
        
        max_sum = max(max_sum, dp[i])
    
    return max_sum
```

---

### Tactic 7: Common Pitfall Prevention

| Pitfall | Prevention |
|---------|------------|
| Storing values instead of indices | Always store indices to check `dq[0] <= i - k` |
| Forgetting to remove out-of-window first | Always check window boundary before adding |
| Using `<=` vs `<` incorrectly | Use `<` for max, `>` for min to keep duplicates |
| Wrong window full condition | Use `i >= k - 1`, not `i >= k` |
| Not handling empty input | Add guard: `if not arr: return []` |

<!-- back -->
