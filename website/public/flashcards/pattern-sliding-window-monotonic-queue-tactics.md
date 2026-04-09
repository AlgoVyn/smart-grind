## Sliding Window - Monotonic Queue: Tactics

What are the advanced techniques for monotonic queue optimization?

<!-- front -->

---

### Tactic 1: Two Monotonic Queues (Max and Min)

**Problem**: Find window where max - min <= limit

```python
def longest_subarray(nums, limit):
    from collections import deque
    
    max_dq = deque()  # Decreasing
    min_dq = deque()  # Increasing
    left = 0
    max_len = 0
    
    for right, num in enumerate(nums):
        # Update max deque
        while max_dq and nums[max_dq[-1]] < num:
            max_dq.pop()
        max_dq.append(right)
        
        # Update min deque
        while min_dq and nums[min_dq[-1]] > num:
            min_dq.pop()
        min_dq.append(right)
        
        # Shrink if constraint violated
        while nums[max_dq[0]] - nums[min_dq[0]] > limit:
            left += 1
            if max_dq[0] < left:
                max_dq.popleft()
            if min_dq[0] < left:
                min_dq.popleft()
        
        max_len = max(max_len, right - left + 1)
    
    return max_len
```

---

### Tactic 2: Monotonic Queue with Indices

**Always store indices, not values**:

| Store | Can Check | Cannot Check |
|-------|-----------|--------------|
| Indices | Out of window, value | - |
| Values | Value | Out of window |

```python
# Good: Store indices
dq.append(i)
nums[dq[0]]  # Get value

# Bad: Store values
dq.append(nums[i])
# Can't check if value at front is still in window
```

---

### Tactic 3: Common Pitfalls

| Pitfall | Issue | Fix |
|---------|-------|-----|
| **Storing values** | Can't check window bounds | Store indices |
| **Wrong comparison** | <= vs < for duplicates | Use <= to maintain all elements |
| **Forgetting window check** | Old indices remain | Check dq[0] <= i - k |
| **Empty deque access** | IndexError | Check dq before accessing dq[0] |
| **Off-by-one** | Wrong window size | Use i >= k - 1 |

---

### Tactic 4: Monotonic Stack vs Queue

| Structure | Access Pattern | Use Case |
|-----------|---------------|----------|
| **Monotonic Stack** | One end only | Previous/next greater element |
| **Monotonic Queue** | Both ends | Sliding window max/min |
| **Deque** | Both ends | General sliding window |

**Previous Greater Element (Stack)**:
```python
def previous_greater(nums):
    stack = []
    result = [-1] * len(nums)
    
    for i, num in enumerate(nums):
        while stack and nums[stack[-1]] <= num:
            stack.pop()
        result[i] = nums[stack[-1]] if stack else -1
        stack.append(i)
    
    return result
```

---

### Tactic 5: Monotonic Queue with Segment Tree Alternative

**When to use Segment Tree instead**:
- Range queries not aligned with sliding window
- Static array, multiple different queries
- Need more complex aggregation

**Monotonic Queue wins when**:
- Fixed-size sliding window
- Only need max/min at window boundary
- Online/streaming processing

---

### Tactic 6: Deque vs List Performance

| Operation | Deque | List |
|-----------|-------|------|
| pop(0) | O(1) | O(n) |
| pop() | O(1) | O(1) |
| appendleft() | O(1) | O(n) |
| append() | O(1) | O(1) |

**Always use deque** for monotonic queue operations

<!-- back -->
