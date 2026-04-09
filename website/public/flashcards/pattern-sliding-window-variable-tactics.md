## Sliding Window - Variable Size: Tactics

What are the advanced techniques for variable-size sliding window?

<!-- front -->

---

### Tactic 1: Optimized Character Index Tracking

**Problem**: Track last seen position instead of set membership

```python
def longest_substring_optimized(s):
    """O(n) with direct index comparison."""
    char_index = {}  # char -> last seen index
    left = 0
    max_len = 0
    
    for right in range(len(s)):
        if s[right] in char_index and char_index[s[right]] >= left:
            left = char_index[s[right]] + 1
        
        char_index[s[right]] = right
        max_len = max(max_len, right - left + 1)
    
    return max_len
```

**Benefit**: Avoids inner while loop, true O(n)

---

### Tactic 2: At Most vs At Least Transformation

**Problem**: Count subarrays with at most K distinct

**Trick**: atMost(K) - atMost(K-1) = exactly K

```python
def subarrays_with_k_distinct(nums, k):
    return at_most_k(nums, k) - at_most_k(nums, k - 1)

def at_most_k(nums, k):
    from collections import defaultdict
    count = defaultdict(int)
    left = 0
    result = 0
    
    for right in range(len(nums)):
        count[nums[right]] += 1
        
        while len(count) > k:
            count[nums[left]] -= 1
            if count[nums[left]] == 0:
                del count[nums[left]]
            left += 1
        
        result += right - left + 1  # All valid subarrays ending at right
    
    return result
```

---

### Tactic 3: Replace to Get Longest Substring

```python
def character_replacement(s, k):
    """Replace at most k chars to get longest repeating char substring."""
    count = {}
    left = 0
    max_freq = 0
    max_len = 0
    
    for right in range(len(s)):
        count[s[right]] = count.get(s[right], 0) + 1
        max_freq = max(max_freq, count[s[right]])
        
        # Window size - max_freq = replacements needed
        while (right - left + 1) - max_freq > k:
            count[s[left]] -= 1
            left += 1
        
        max_len = max(max_len, right - left + 1)
    
    return max_len
```

---

### Tactic 4: Common Pitfalls

| Pitfall | Issue | Fix |
|---------|-------|-----|
| **Not shrinking enough** | Window still invalid | Use while, not if |
| **Updating result at wrong time** | Wrong window size | Update after shrinking |
| **Integer overflow** | Large sums | Use appropriate types |
| **Empty window** | No valid subarray | Check before returning |
| **Off-by-one indices** | Wrong length | right - left + 1 |

---

### Tactic 5: Binary Search + Sliding Window

**Problem**: Find if subarray with average >= threshold exists

```python
def has_avg_above(nums, threshold, k):
    """Check if any length-k subarray has avg >= threshold."""
    # Transform: nums[i] - threshold
    transformed = [num - threshold for num in nums]
    
    # Find if any length-k subarray has sum >= 0
    current_sum = sum(transformed[:k])
    if current_sum >= 0:
        return True
    
    for i in range(k, len(nums)):
        current_sum += transformed[i] - transformed[i - k]
        if current_sum >= 0:
            return True
    
    return False
```

---

### Tactic 6: Negative Numbers

**Problem**: Minimum subarray with sum >= target when negatives exist

**Note**: Standard sliding window doesn't work with negatives

**Solution**: Prefix sum + monotonic deque or binary search

```python
# With negatives, use prefix sum + monotonic queue
def shortest_subarray(nums, k):
    from collections import deque
    
    n = len(nums)
    prefix = [0] * (n + 1)
    for i in range(n):
        prefix[i + 1] = prefix[i] + nums[i]
    
    dq = deque()
    min_len = float('inf')
    
    for i in range(n + 1):
        while dq and prefix[i] - prefix[dq[0]] >= k:
            min_len = min(min_len, i - dq.popleft())
        
        while dq and prefix[i] <= prefix[dq[-1]]:
            dq.pop()
        
        dq.append(i)
    
    return min_len if min_len != float('inf') else -1
```

<!-- back -->
